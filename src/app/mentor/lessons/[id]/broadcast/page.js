'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import api from '@/lib/api'
// 🔥 Markaziy utilitalar
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn, getErrorMessage } from '@/lib/utils'
import { motion } from 'framer-motion'
import {
	Check,
	Clock,
	Loader2,
	MessageSquare,
	Plus,
	Send,
	Square,
	UserCheck,
	UserPlus,
	Users,
	X,
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

const MotionDiv = motion.div

export default function MentorBroadcastPage() {
	const router = useRouter()
	const { id } = useParams()

	const [lesson, setLesson] = useState(null)
	const [loading, setLoading] = useState(true)

	// Attendance
	const [attendanceData, setAttendanceData] = useState(null)

	// Guest form
	const [showGuestForm, setShowGuestForm] = useState(false)
	const [guestForm, setGuestForm] = useState({
		firstName: '',
		lastName: '',
		group: '',
	})
	const [guestLoading, setGuestLoading] = useState(false)

	// Chat
	const [messages, setMessages] = useState([])
	const [inputMessage, setInputMessage] = useState('')
	const [sendingMessage, setSendingMessage] = useState(false)
	const scrollRef = useRef(null)

	// Timer
	const [elapsed, setElapsed] = useState(0)

	// --- API CALLS ---
	const fetchData = useCallback(
		async (isInitial = false) => {
			try {
				const [resLesson, resAttendance] = await Promise.all([
					api
						.get(`/mentor/lessons/${id}`)
						.catch(() => ({ data: { success: false } })),
					api
						.get(`/mentor/lessons/${id}/attendance`)
						.catch(() => ({ data: { success: false } })),
				])

				if (resLesson.data?.success) {
					setLesson(resLesson.data.lesson)
					setMessages(resLesson.data.lesson.messages || [])
				}
				if (resAttendance.data?.success) {
					setAttendanceData(resAttendance.data)
				}
			} catch (error) {
				if (isInitial)
					toast.error(getErrorMessage(error, "Ma'lumotlarni yuklashda xatolik"))
			} finally {
				if (isInitial) setLoading(false)
			}
		},
		[id],
	)

	// Initial fetch and Polling
	useEffect(() => {
		fetchData(true)

		const pollInterval = setInterval(() => {
			fetchData(false)
		}, 5000)

		return () => clearInterval(pollInterval)
	}, [fetchData])

	// Timer (Backend'dan qaytgan startTime ga asoslanish kerak, bo'lmasa refresh bo'lganda noldan boshlanadi)
	useEffect(() => {
		// Agar lesson boshlanish vaqti API dan kelmagan bo'lsa, o'zimiz vaqtinchalik saqlaymiz
		const localStart = localStorage.getItem(`lesson_${id}_start`)
		let startTime = localStart ? parseInt(localStart, 10) : Date.now()

		if (!localStart) {
			localStorage.setItem(`lesson_${id}_start`, startTime.toString())
		}

		const timer = setInterval(() => {
			setElapsed(Math.floor((Date.now() - startTime) / 1000))
		}, 1000)

		return () => clearInterval(timer)
	}, [id])

	const formatTime = seconds => {
		const h = Math.floor(seconds / 3600)
		const m = Math.floor((seconds % 3600) / 60)
		const s = seconds % 60
		return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
	}

	// Scroll chat to bottom
	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight
		}
	}, [messages])

	// Toggle attendance (Optimistic Update bilan)
	const handleToggleAttendance = async (userId, isPresent) => {
		setAttendanceData(prev => {
			if (!prev) return prev
			const updatedStudents = prev.students.map(s =>
				s.id === userId ? { ...s, isPresent } : s,
			)

			const newPresentCount = isPresent
				? prev.summary.present + 1
				: prev.summary.present - 1
			const newAbsentCount = isPresent
				? prev.summary.absent - 1
				: prev.summary.absent + 1

			return {
				...prev,
				students: updatedStudents,
				summary: {
					...prev.summary,
					present: newPresentCount,
					absent: newAbsentCount,
				},
			}
		})

		try {
			await api.post('/mentor/attendance/toggle', {
				lessonId: id,
				userId,
				isPresent,
			})
		} catch (error) {
			toast.error(getErrorMessage(error, 'Davomat yangilanmadi'))
			fetchData(false) // Xato bo'lsa orqaga qaytaramiz
		}
	}

	// Add guest
	const handleAddGuest = async () => {
		if (!guestForm.firstName || !guestForm.lastName) {
			toast.warning('Iltimos ism va familiyani kiriting')
			return
		}

		setGuestLoading(true)
		try {
			await api.post('/mentor/attendance/guest', { lessonId: id, ...guestForm })
			setGuestForm({ firstName: '', lastName: '', group: '' })
			setShowGuestForm(false)
			fetchData(false)
			toast.success("Mehmon qo'shildi!")
		} catch (error) {
			toast.error(getErrorMessage(error, "Mehmon qo'shilmadi"))
		} finally {
			setGuestLoading(false)
		}
	}

	// Send message
	const handleSendMessage = async e => {
		if (e) e.preventDefault()
		if (!inputMessage.trim() || sendingMessage) return

		const currentInput = inputMessage.trim()
		const newMessage = {
			_id: Date.now().toString(),
			senderId: { firstName: 'Siz', lastName: '', role: 'mentor' },
			text: currentInput,
			createdAt: new Date().toISOString(),
		}

		setMessages(prev => [...prev, newMessage])
		setInputMessage('')

		try {
			setSendingMessage(true)
			const res = await api.post(`/mentor/lessons/${id}/message`, {
				text: currentInput,
			})
			if (!res.data?.success) {
				throw new Error('API xatosi')
			}
		} catch (error) {
			toast.error(getErrorMessage(error, 'Xabar yuborishda xatolik'))
			fetchData(false)
		} finally {
			setSendingMessage(false)
			document.getElementById('chat-input')?.focus()
		}
	}

	// End lesson
	const handleEndLesson = async () => {
		if (!confirm('Haqiqatan ham darsni yakunlashni xohlaysizmi?')) return
		try {
			await api.patch(`/mentor/lessons/${id}/status`, { status: 'completed' })
			localStorage.removeItem(`lesson_${id}_start`) // Taymerni tozalaymiz
			toast.success('Dars yakunlandi')
			router.push('/mentor/lessons')
		} catch (error) {
			toast.error(
				getErrorMessage(error, 'Darsni yakunlashda xatolik yuz berdi.'),
			)
		}
	}

	// UI: Loading Skeleton
	if (loading) {
		return (
			<div className='fixed inset-0 bg-background flex flex-col z-50 overflow-hidden animate-pulse'>
				<div className='h-16 px-6 border-b flex items-center justify-between bg-card'>
					<Skeleton className='h-6 w-48' />
					<Skeleton className='h-10 w-32 rounded-xl' />
				</div>
				<div className='flex-1 flex overflow-hidden'>
					<div className='flex-1 border-r p-6 space-y-4'>
						<Skeleton className='h-24 w-full rounded-xl' />
						<Skeleton className='h-[400px] w-full rounded-xl' />
					</div>
					<div className='w-[350px] md:w-[450px] p-6'>
						<Skeleton className='h-full w-full rounded-xl' />
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className='fixed inset-0 bg-background flex flex-col z-50 overflow-hidden'>
			{/* ========================================== */}
			{/* 🏷️ TOP BAR */}
			{/* ========================================== */}
			<div className='h-16 px-4 md:px-6 flex items-center justify-between border-b bg-card shrink-0 z-10'>
				<div className='flex items-center gap-3 md:gap-4 overflow-hidden'>
					<Badge
						variant='destructive'
						className='animate-pulse font-bold tracking-widest text-[10px] uppercase rounded-sm px-2'
					>
						JONLI EFIR
					</Badge>
					<h1 className='font-bold text-foreground truncate max-w-[200px] md:max-w-[400px] text-base md:text-lg'>
						{lesson?.title || 'Dars nomi'}
					</h1>
					<div className='hidden md:flex items-center gap-2 px-3 py-1.5 bg-muted rounded-md text-xs font-mono text-muted-foreground font-semibold'>
						<Clock className='w-3.5 h-3.5' /> {formatTime(elapsed)}
					</div>
					<div className='hidden md:flex items-center gap-2 px-3 py-1.5 bg-muted rounded-md text-xs font-semibold text-muted-foreground'>
						<Users className='w-3.5 h-3.5' />{' '}
						{attendanceData?.summary?.total || 0} ishtirokchi
					</div>
				</div>
				<Button
					onClick={handleEndLesson}
					variant='destructive'
					className='gap-2 font-bold shadow-sm h-9 md:h-10'
				>
					<Square className='w-4 h-4 fill-current' />
					<span className='hidden md:inline'>Yakunlash</span>
				</Button>
			</div>

			<div className='flex-1 flex flex-col md:flex-row overflow-hidden bg-muted/10'>
				{/* ========================================== */}
				{/* 📋 CHAP PANEL: DAVOMAT */}
				{/* ========================================== */}
				<div className='flex-1 flex flex-col bg-card md:border-r border-border'>
					<div className='p-4 border-b flex items-center justify-between shrink-0 z-10'>
						<div className='flex items-center gap-2.5'>
							<div className='bg-muted p-2 rounded-md'>
								<UserCheck className='w-4 h-4 text-muted-foreground' />
							</div>
							<div>
								<h2 className='font-bold text-sm leading-none'>Davomat</h2>
								<span className='text-[10px] text-muted-foreground'>
									O'quvchilarni belgilang
								</span>
							</div>
						</div>
						<Button
							size='sm'
							variant='secondary'
							className='gap-2 text-xs'
							onClick={() => setShowGuestForm(!showGuestForm)}
						>
							<UserPlus className='w-4 h-4' />{' '}
							<span className='hidden sm:inline'>Mehmon qo'shish</span>
						</Button>
					</div>

					{/* Davomat Statistikasi */}
					{attendanceData && (
						<div className='grid grid-cols-3 gap-0 border-b shrink-0 bg-muted/30'>
							<div className='p-3 text-center border-r'>
								<p className='text-xl font-bold text-primary'>
									{attendanceData.summary?.total || 0}
								</p>
								<p className='text-[10px] text-muted-foreground font-bold uppercase tracking-wider'>
									Jami
								</p>
							</div>
							<div className='p-3 text-center border-r'>
								<p className='text-xl font-bold text-green-600'>
									{attendanceData.summary?.present || 0}
								</p>
								<p className='text-[10px] text-muted-foreground font-bold uppercase tracking-wider'>
									Kelgan
								</p>
							</div>
							<div className='p-3 text-center'>
								<p className='text-xl font-bold text-destructive'>
									{attendanceData.summary?.absent || 0}
								</p>
								<p className='text-[10px] text-muted-foreground font-bold uppercase tracking-wider'>
									Kelmagan
								</p>
							</div>
						</div>
					)}

					{/* Mehmon Qo'shish Formasi */}
					{showGuestForm && (
						<MotionDiv
							initial={{ height: 0, opacity: 0 }}
							animate={{ height: 'auto', opacity: 1 }}
							className='p-4 bg-muted/20 border-b space-y-3 shrink-0 overflow-hidden'
						>
							<div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
								<Input
									placeholder='Ism'
									value={guestForm.firstName}
									onChange={e =>
										setGuestForm({ ...guestForm, firstName: e.target.value })
									}
									className='bg-background h-9'
								/>
								<Input
									placeholder='Familiya'
									value={guestForm.lastName}
									onChange={e =>
										setGuestForm({ ...guestForm, lastName: e.target.value })
									}
									className='bg-background h-9'
								/>
								<Input
									placeholder='Guruh'
									value={guestForm.group}
									onChange={e =>
										setGuestForm({ ...guestForm, group: e.target.value })
									}
									className='bg-background h-9'
								/>
							</div>
							<div className='flex gap-2'>
								<Button
									size='sm'
									onClick={handleAddGuest}
									disabled={
										guestLoading || !guestForm.firstName || !guestForm.lastName
									}
									className='gap-2 w-full sm:w-auto'
								>
									{guestLoading ? (
										<Loader2 className='w-3.5 h-3.5 animate-spin' />
									) : (
										<Plus className='w-3.5 h-3.5' />
									)}{' '}
									Qo'shish
								</Button>
								<Button
									size='sm'
									variant='ghost'
									onClick={() => setShowGuestForm(false)}
								>
									Bekor qilish
								</Button>
							</div>
						</MotionDiv>
					)}

					{/* O'quvchilar ro'yxati */}
					<div className='flex-1 overflow-y-auto p-4 custom-scrollbar'>
						<div className='grid gap-2'>
							{attendanceData?.students?.map(s => (
								<div
									key={s.id}
									className='flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors group'
								>
									<div className='flex items-center gap-3 flex-1 min-w-0'>
										<Avatar className='h-9 w-9 border shrink-0'>
											<AvatarFallback
												className={cn(
													'text-xs font-bold uppercase',
													s.isPresent
														? 'bg-green-50 text-green-700'
														: 'bg-red-50 text-destructive',
												)}
											>
												{s.firstName?.[0]}
												{s.lastName?.[0]}
											</AvatarFallback>
										</Avatar>
										<div className='min-w-0'>
											<p className='font-semibold text-sm text-foreground truncate'>
												{s.firstName} {s.lastName}
												{s.isGuest && (
													<Badge
														variant='secondary'
														className='ml-2 text-[9px] uppercase'
													>
														Mehmon
													</Badge>
												)}
											</p>
											<p className='text-xs text-muted-foreground mt-0.5'>
												{s.group || 'Guruh kiritilmagan'}
											</p>
										</div>
									</div>

									{!s.isGuest ? (
										<button
											onClick={() => handleToggleAttendance(s.id, !s.isPresent)}
											className={cn(
												'h-10 w-10 rounded-md flex items-center justify-center transition-colors border shrink-0',
												s.isPresent
													? 'bg-green-600 border-green-600 text-white'
													: 'bg-transparent border-muted hover:border-destructive hover:text-destructive text-muted-foreground',
											)}
										>
											{s.isPresent ? (
												<Check className='w-5 h-5' />
											) : (
												<X className='w-5 h-5' />
											)}
										</button>
									) : (
										<div className='h-10 w-10 rounded-md flex items-center justify-center bg-green-600 text-white'>
											<Check className='w-5 h-5' />
										</div>
									)}
								</div>
							))}

							{(!attendanceData?.students ||
								attendanceData.students.length === 0) && (
								<div className='flex flex-col items-center justify-center py-16 text-muted-foreground'>
									<Users className='w-8 h-8 opacity-20 mb-3' />
									<p className='text-sm font-medium'>
										Bu darsga hech kim yozilmagan
									</p>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* ========================================== */}
				{/* 💬 O'NG PANEL: CHAT */}
				{/* ========================================== */}
				<div className='w-full md:w-[380px] lg:w-[450px] flex flex-col bg-card md:border-l shrink-0 h-[40vh] md:h-auto'>
					<div className='p-4 border-b flex items-center justify-between shrink-0 bg-muted/10'>
						<div className='flex items-center gap-2'>
							<MessageSquare className='w-4 h-4 text-muted-foreground' />
							<h2 className='font-bold text-sm'>Jonli Chat</h2>
						</div>
						<Badge variant='outline' className='font-mono text-xs'>
							{messages.length}
						</Badge>
					</div>

					<div
						ref={scrollRef}
						className='flex-1 overflow-y-auto p-4 custom-scrollbar'
					>
						<div className='space-y-4'>
							<div className='text-center sticky top-0 z-10'>
								<Badge
									variant='secondary'
									className='text-[10px] uppercase tracking-wider opacity-80 backdrop-blur-sm'
								>
									Dars boshlandi
								</Badge>
							</div>

							{messages.map((msg, idx) => {
								const isMentor =
									msg.senderId?.role === 'mentor' ||
									msg.senderId?.firstName === 'Siz'
								const senderName = msg.senderId
									? `${msg.senderId.firstName || ''} ${msg.senderId.lastName || ''}`
									: "Noma'lum"
								const time = msg.createdAt
									? new Date(msg.createdAt).toLocaleTimeString([], {
											hour: '2-digit',
											minute: '2-digit',
										})
									: ''

								return (
									<MotionDiv
										initial={{ opacity: 0, y: 5 }}
										animate={{ opacity: 1, y: 0 }}
										key={msg._id || idx}
										className={cn(
											'flex flex-col gap-1',
											isMentor ? 'items-end' : 'items-start',
										)}
									>
										<div className='flex items-center gap-2 px-1'>
											<span className='text-[11px] font-medium text-muted-foreground'>
												{senderName}
											</span>
											<span className='text-[9px] text-muted-foreground opacity-50 font-mono'>
												{time}
											</span>
										</div>
										<div
											className={cn(
												'px-3 py-2 text-sm max-w-[85%] break-words rounded-xl',
												isMentor
													? 'bg-primary text-primary-foreground rounded-tr-sm'
													: 'bg-muted text-foreground rounded-tl-sm',
											)}
										>
											{msg.text}
										</div>
									</MotionDiv>
								)
							})}

							{messages.length === 0 && (
								<div className='flex flex-col items-center justify-center h-full text-muted-foreground py-12'>
									<MessageSquare className='w-8 h-8 mb-2 opacity-20' />
									<p className='text-xs font-medium'>Xabarlar mavjud emas</p>
								</div>
							)}
						</div>
					</div>

					{/* Chat Input */}
					<div className='p-3 border-t shrink-0 bg-muted/10'>
						<form onSubmit={handleSendMessage} className='flex gap-2'>
							<Input
								id='chat-input'
								placeholder='Xabar yozing...'
								className='bg-background'
								value={inputMessage}
								onChange={e => setInputMessage(e.target.value)}
								autoComplete='off'
							/>
							<Button
								type='submit'
								size='icon'
								disabled={sendingMessage || !inputMessage.trim()}
								className='shrink-0'
							>
								{sendingMessage ? (
									<Loader2 className='w-4 h-4 animate-spin' />
								) : (
									<Send className='w-4 h-4' />
								)}
							</Button>
						</form>
					</div>
				</div>
			</div>
		</div>
	)
}
