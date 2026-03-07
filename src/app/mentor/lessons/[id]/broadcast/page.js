'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import api from '@/lib/api'
import { cn } from '@/lib/utils'
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

const MotionDiv = motion.div

export default function MentorBroadcastPage() {
	const router = useRouter()
	const params = useParams()
	const { id } = params

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
	const [startTime] = useState(Date.now())

	// --- API CALLS ---
	const fetchData = useCallback(
		async (isInitial = false) => {
			try {
				const [resLesson, resAttendance] = await Promise.all([
					api.get(`/mentor/lessons/${id}`),
					api.get(`/mentor/lessons/${id}/attendance`),
				])

				if (resLesson.data?.success) {
					setLesson(resLesson.data.lesson)
					setMessages(resLesson.data.lesson.messages || [])
				}
				if (resAttendance.data?.success) {
					setAttendanceData(resAttendance.data)
				}
			} catch (error) {
				console.error("Ma'lumotlarni yuklashda xatolik:", error)
			} finally {
				if (isInitial) setLoading(false)
			}
		},
		[id],
	)

	// Initial fetch and Polling
	useEffect(() => {
		fetchData(true) // isInitial = true

		// Fonda (background) 5 soniyada bir yangilash (Loader ko'rsatmasdan)
		const pollInterval = setInterval(() => {
			fetchData(false)
		}, 5000)

		return () => clearInterval(pollInterval)
	}, [fetchData])

	// Timer
	useEffect(() => {
		const timer = setInterval(() => {
			setElapsed(Math.floor((Date.now() - startTime) / 1000))
		}, 1000)
		return () => clearInterval(timer)
	}, [startTime])

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

	// Toggle attendance
	const handleToggleAttendance = async (userId, isPresent) => {
		// UI-ni darhol o'zgartirish (Optimistic Update) yaltirashni oldini olish uchun
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
			fetchData(false) // Fonda haqiqiy datani tortib kelish
		} catch (error) {
			console.error('Davomat yangilanmadi:', error)
			fetchData(false) // Xato bo'lsa joyiga qaytarish
		}
	}

	// Add guest
	const handleAddGuest = async () => {
		if (!guestForm.firstName || !guestForm.lastName) return
		try {
			setGuestLoading(true)
			await api.post('/mentor/attendance/guest', { lessonId: id, ...guestForm })
			setGuestForm({ firstName: '', lastName: '', group: '' })
			setShowGuestForm(false)
			fetchData(false)
		} catch (error) {
			console.error("Mehmon qo'shilmadi:", error)
		} finally {
			setGuestLoading(false)
		}
	}

	// Send message
	const handleSendMessage = async () => {
		if (!inputMessage.trim() || sendingMessage) return

		// Optimistic UI update
		const newMessage = {
			_id: Date.now(),
			senderId: { firstName: 'Siz', lastName: '', role: 'mentor' },
			text: inputMessage.trim(),
			createdAt: new Date().toISOString(),
		}
		setMessages(prev => [...prev, newMessage])
		const currentInput = inputMessage
		setInputMessage('')

		try {
			setSendingMessage(true)
			const res = await api.post(`/mentor/lessons/${id}/message`, {
				text: currentInput.trim(),
			})
			if (!res.data.success) {
				fetchData(false) // Xatolik bo'lsa serverdagi haqiqiy chatni yuklash
			}
		} catch (error) {
			console.error('Xabar yuborishda xatolik:', error)
			fetchData(false)
		} finally {
			setSendingMessage(false)
		}
	}

	// End lesson
	const handleEndLesson = async () => {
		if (!confirm('Haqiqatan ham darsni yakunlashni xohlaysizmi?')) return
		try {
			await api.patch(`/mentor/lessons/${id}/status`, { status: 'completed' })
			router.push('/mentor/lessons')
		} catch (error) {
			console.error('Dars yakunlanmadi:', error)
			alert(
				"Darsni yakunlashda xatolik yuz berdi. Iltimos qayta urinib ko'ring.",
			)
		}
	}

	if (loading) {
		return (
			<div className='fixed inset-0 bg-background flex flex-col z-50 overflow-hidden'>
				<div className='h-16 px-6 border-b flex items-center justify-between'>
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
			{/* --- TOP BAR --- */}
			<div className='h-16 px-4 md:px-6 flex items-center justify-between border-b bg-card shrink-0 shadow-sm z-10'>
				<div className='flex items-center gap-3 md:gap-4 overflow-hidden'>
					<Badge className='bg-red-500 text-white hover:bg-red-600 border-0 px-2.5 py-1 animate-pulse font-bold tracking-widest text-[10px] md:text-xs shrink-0 rounded-md'>
						JONLI EFIR
					</Badge>
					<h1 className='font-bold text-foreground truncate max-w-[200px] md:max-w-[400px] text-base md:text-lg'>
						{lesson?.title || 'Dars nomi'}
					</h1>
					<div className='hidden md:flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full text-xs font-mono text-muted-foreground font-semibold'>
						<Clock className='w-3.5 h-3.5 text-primary' />
						{formatTime(elapsed)}
					</div>
					<div className='hidden md:flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full text-xs font-semibold text-muted-foreground'>
						<Users className='w-3.5 h-3.5 text-primary' />
						{attendanceData?.summary?.total || 0} ishtirokchi
					</div>
				</div>
				<Button
					onClick={handleEndLesson}
					variant='destructive'
					className='rounded-xl gap-2 font-bold shadow-sm h-9 md:h-10'
				>
					<Square className='w-4 h-4 fill-current' />{' '}
					<span className='hidden md:inline'>Yakunlash</span>
				</Button>
			</div>

			{/* --- MAIN CONTENT --- */}
			<div className='flex-1 flex flex-col md:flex-row overflow-hidden bg-muted/20'>
				{/* --- LEFT: ATTENDANCE PANEL --- */}
				<div className='flex-1 flex flex-col bg-background md:border-r border-border'>
					{/* Header */}
					<div className='p-4 md:p-5 border-b bg-card flex items-center justify-between shrink-0 shadow-sm z-10'>
						<div className='flex items-center gap-2.5'>
							<div className='bg-primary/10 p-2 rounded-lg'>
								<UserCheck className='w-5 h-5 text-primary' />
							</div>
							<div>
								<h2 className='font-bold text-foreground leading-none'>
									Davomat
								</h2>
								<span className='text-xs text-muted-foreground'>
									O'quvchilarni belgilang
								</span>
							</div>
						</div>
						<Button
							size='sm'
							variant='secondary'
							className='rounded-lg gap-2 text-xs font-semibold'
							onClick={() => setShowGuestForm(!showGuestForm)}
						>
							<UserPlus className='w-4 h-4 text-primary' />{' '}
							<span className='hidden sm:inline'>Mehmon</span>
						</Button>
					</div>

					{/* Summary Cards */}
					{attendanceData && (
						<div className='grid grid-cols-3 gap-0 border-b bg-card shrink-0'>
							<div className='p-4 text-center border-r'>
								<p className='text-2xl font-black text-blue-600'>
									{attendanceData.summary?.total || 0}
								</p>
								<p className='text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-0.5'>
									Jami
								</p>
							</div>
							<div className='p-4 text-center border-r'>
								<p className='text-2xl font-black text-emerald-600'>
									{attendanceData.summary?.present || 0}
								</p>
								<p className='text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-0.5'>
									Kelgan
								</p>
							</div>
							<div className='p-4 text-center'>
								<p className='text-2xl font-black text-red-600'>
									{attendanceData.summary?.absent || 0}
								</p>
								<p className='text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-0.5'>
									Kelmagan
								</p>
							</div>
						</div>
					)}

					{/* Guest Form */}
					{showGuestForm && (
						<MotionDiv
							initial={{ height: 0, opacity: 0 }}
							animate={{ height: 'auto', opacity: 1 }}
							className='p-4 bg-muted/50 border-b space-y-3 shrink-0 overflow-hidden'
						>
							<p className='text-xs font-bold text-muted-foreground uppercase tracking-wider'>
								Yangi talaba qo'shish
							</p>
							<div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
								<Input
									placeholder='Ism'
									value={guestForm.firstName}
									onChange={e =>
										setGuestForm({ ...guestForm, firstName: e.target.value })
									}
									className='rounded-lg bg-background'
								/>
								<Input
									placeholder='Familiya'
									value={guestForm.lastName}
									onChange={e =>
										setGuestForm({ ...guestForm, lastName: e.target.value })
									}
									className='rounded-lg bg-background'
								/>
								<Input
									placeholder='Guruh'
									value={guestForm.group}
									onChange={e =>
										setGuestForm({ ...guestForm, group: e.target.value })
									}
									className='rounded-lg bg-background'
								/>
							</div>
							<div className='flex gap-2 pt-1'>
								<Button
									size='sm'
									onClick={handleAddGuest}
									disabled={
										guestLoading || !guestForm.firstName || !guestForm.lastName
									}
									className='rounded-lg gap-2 shadow-sm'
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
									variant='outline'
									onClick={() => setShowGuestForm(false)}
								>
									Bekor
								</Button>
							</div>
						</MotionDiv>
					)}

					{/* Student List */}
					<div className='flex-1 overflow-y-auto p-3 sm:p-4 bg-muted/10'>
						<div className='grid gap-2'>
							{attendanceData?.students?.map(s => (
								<div
									key={s.id}
									className='flex items-center justify-between p-3 sm:p-4 rounded-xl bg-card border shadow-sm hover:shadow-md transition-all group'
								>
									<div className='flex items-center gap-3 flex-1 min-w-0'>
										<div
											className={cn(
												'w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black shrink-0 transition-colors',
												s.isPresent
													? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
													: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
											)}
										>
											{s.firstName?.[0]}
											{s.lastName?.[0]}
										</div>
										<div className='min-w-0'>
											<p className='font-bold text-sm sm:text-base text-foreground truncate'>
												{s.firstName} {s.lastName}
												{s.isGuest && (
													<Badge
														variant='secondary'
														className='ml-2 text-[10px] bg-blue-100 text-blue-700 border-none font-bold py-0'
													>
														Mehmon
													</Badge>
												)}
											</p>
											<p className='text-xs text-muted-foreground font-medium mt-0.5'>
												{s.group || 'Guruhsiz'}
											</p>
										</div>
									</div>

									{!s.isGuest ? (
										<button
											onClick={() => handleToggleAttendance(s.id, !s.isPresent)}
											className={cn(
												'w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0 border-2',
												s.isPresent
													? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-600'
													: 'bg-transparent border-muted hover:border-red-200 hover:bg-red-50 text-muted-foreground hover:text-red-500 dark:hover:bg-red-500/10',
											)}
										>
											{s.isPresent ? (
												<Check className='w-5 h-5 sm:w-6 sm:h-6' />
											) : (
												<X className='w-5 h-5 sm:w-6 sm:h-6' />
											)}
										</button>
									) : (
										<div className='w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center bg-emerald-500 text-white shadow-md'>
											<Check className='w-5 h-5 sm:w-6 sm:h-6' />
										</div>
									)}
								</div>
							))}

							{(!attendanceData?.students ||
								attendanceData.students.length === 0) && (
								<div className='flex flex-col items-center justify-center py-16 text-muted-foreground text-center'>
									<div className='bg-muted p-4 rounded-full mb-4'>
										<Users className='w-8 h-8 opacity-50' />
									</div>
									<p className='text-sm font-medium'>
										Bu darsga hech kim yozilmagan
									</p>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* --- RIGHT: CHAT PANEL --- */}
				<div className='w-full md:w-[380px] lg:w-[450px] flex flex-col bg-card border-l shrink-0 h-[40vh] md:h-auto'>
					{/* Chat Header */}
					<div className='p-4 border-b flex items-center gap-3 shrink-0 bg-muted/30'>
						<div className='bg-primary/10 p-2 rounded-lg'>
							<MessageSquare className='w-4 h-4 text-primary' />
						</div>
						<h2 className='font-bold text-base flex-1'>Jonli Chat</h2>
						<Badge variant='secondary' className='font-mono'>
							{messages.length}
						</Badge>
					</div>

					{/* Messages */}
					<div
						ref={scrollRef}
						className='flex-1 overflow-y-auto p-4 bg-muted/10 custom-scrollbar'
					>
						<div className='space-y-4'>
							<div className='text-center sticky top-0 z-10'>
								<Badge
									variant='outline'
									className='text-[10px] uppercase tracking-widest font-bold bg-background/80 backdrop-blur-sm'
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
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										key={msg._id || idx}
										className={cn(
											'flex flex-col gap-1',
											isMentor ? 'items-end' : 'items-start',
										)}
									>
										<div className='flex items-baseline gap-2 px-1'>
											<span className='text-[11px] font-bold text-muted-foreground'>
												{senderName}
											</span>
											<span className='text-[9px] text-muted-foreground/50 font-mono'>
												{time}
											</span>
										</div>
										<div
											className={cn(
												'px-4 py-2.5 rounded-2xl text-sm max-w-[85%] break-words shadow-sm',
												isMentor
													? 'bg-primary text-primary-foreground rounded-tr-sm'
													: 'bg-background border rounded-tl-sm',
											)}
										>
											{msg.text}
										</div>
									</MotionDiv>
								)
							})}

							{messages.length === 0 && (
								<div className='flex flex-col items-center justify-center h-full text-muted-foreground py-12'>
									<MessageSquare className='w-8 h-8 mb-3 opacity-20' />
									<p className='text-xs font-medium'>Xabarlar mavjud emas</p>
								</div>
							)}
						</div>
					</div>

					{/* Input Area */}
					<div className='p-4 border-t bg-card shrink-0'>
						<div className='flex gap-2 relative items-end'>
							<Input
								placeholder='Xabar yozing...'
								className='bg-muted/50 border-transparent focus-visible:ring-primary focus-visible:bg-background rounded-xl h-11 pr-12'
								value={inputMessage}
								onChange={e => setInputMessage(e.target.value)}
								onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
							/>
							<Button
								size='icon'
								className='h-9 w-9 rounded-lg absolute right-1 top-1 shadow-sm'
								onClick={handleSendMessage}
								disabled={sendingMessage || !inputMessage.trim()}
							>
								{sendingMessage ? (
									<Loader2 className='w-4 h-4 animate-spin' />
								) : (
									<Send className='w-4 h-4 -ml-0.5 mt-0.5' />
								)}
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
