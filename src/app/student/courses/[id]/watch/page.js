'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import api from '@/lib/api'
// 🔥 Markazlashgan utilitalar
import { cn, getInitials } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import {
	ArrowLeft,
	Clock,
	Loader2,
	MessageSquareOff,
	MessagesSquare,
	Send,
	Users,
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'

// ==========================================
// 🎨 ANIMATSIYALAR
// ==========================================
const containerVariants = {
	hidden: { opacity: 0 },
	show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
	hidden: { opacity: 0, y: 15 },
	show: {
		opacity: 1,
		y: 0,
		transition: { type: 'spring', stiffness: 300, damping: 24 },
	},
}

// ==========================================
// 🧩 SKELETON
// ==========================================
const WatchSkeleton = () => (
	<div className='max-w-6xl mx-auto space-y-6 pt-6 pb-12 w-full px-4 sm:px-6 animate-pulse'>
		<Skeleton className='h-20 w-full rounded-xl' />
		<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
			<Skeleton className='h-[60vh] min-h-[500px] lg:col-span-2 rounded-xl' />
			<Skeleton className='h-[60vh] min-h-[500px] rounded-xl' />
		</div>
	</div>
)

// ==========================================
// 🚀 ASOSIY KOMPONENT
// ==========================================
export default function StudentWatchLessonPage() {
	const { id } = useParams()
	const router = useRouter()

	const [loading, setLoading] = useState(true)
	const [lesson, setLesson] = useState(null)
	const [user, setUser] = useState(null)
	const [activeUsers, setActiveUsers] = useState([])
	const [messages, setMessages] = useState([])
	const [inputMessage, setInputMessage] = useState('')
	const [timeElapsed, setTimeElapsed] = useState('00:00:00')

	const socketRef = useRef(null)
	const scrollRef = useRef(null)
	const timerRef = useRef(null)

	// 1. Asosiy ma'lumotlarni yuklash
	useEffect(() => {
		const initData = async () => {
			try {
				const [meRes, lesRes] = await Promise.all([
					api.get('/auth/me').catch(() => ({ data: { success: false } })),
					api
						.get(`/student/lessons/${id}`)
						.catch(() => ({ data: { success: false } })),
				])

				if (meRes.data?.success && lesRes.data?.success) {
					setUser(meRes.data.user)
					setLesson(lesRes.data.lesson)
					if (lesRes.data.lesson.messages) {
						setMessages(lesRes.data.lesson.messages)
					}
				} else {
					throw new Error("Ma'lumot topilmadi")
				}
			} catch (error) {
				console.error(error)
				router.push('/student/courses')
			} finally {
				setLoading(false)
			}
		}
		if (id) initData()
	}, [id, router])

	// 2. Socket.io ulanishi va Timer
	useEffect(() => {
		if (!lesson || !user) return

		const apiUrl =
			process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ||
			'http://13.48.57.24:5001'

		// 🔥 Socket Multiple ulanishni oldini olish
		if (!socketRef.current) {
			socketRef.current = io(apiUrl, { withCredentials: true })

			socketRef.current.on('connect', () => {
				const lId = lesson._id?.toString() || lesson.id?.toString()
				const uId = user.id?.toString() || user._id?.toString()
				socketRef.current.emit('join_lesson', { lessonId: lId, userId: uId })
			})

			socketRef.current.on('active_users', users => setActiveUsers(users))

			socketRef.current.on('new_message', msg => {
				setMessages(prev => {
					if (prev.find(m => m._id === msg._id)) return prev
					return [...prev, msg]
				})
			})
		}

		// 🔥 Taymer
		const calculateTime = () => {
			const lessonDateStr =
				lesson.date?.split('T')[0] || new Date().toISOString().split('T')[0]
			const startTime = new Date(
				`${lessonDateStr}T${lesson.time || '00:00'}:00`,
			).getTime()
			const now = new Date().getTime()
			const diff = now - startTime

			if (diff > 0) {
				const hrs = Math.floor((diff / (1000 * 60 * 60)) % 24)
				const mins = Math.floor((diff / 1000 / 60) % 60)
				const secs = Math.floor((diff / 1000) % 60)
				setTimeElapsed(
					`${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`,
				)
			} else {
				setTimeElapsed('Kutilmoqda')
			}
		}

		calculateTime()
		timerRef.current = setInterval(calculateTime, 1000)

		return () => {
			if (socketRef.current) {
				socketRef.current.disconnect()
				socketRef.current = null
			}
			if (timerRef.current) clearInterval(timerRef.current)
		}
	}, [lesson, user])

	// 3. Xabar yuborish
	const sendMessage = e => {
		e.preventDefault()
		if (!inputMessage.trim() || !socketRef.current) return

		const lId = lesson._id?.toString() || lesson.id?.toString()
		const uId = user.id?.toString() || user._id?.toString()

		socketRef.current.emit('send_message', {
			lessonId: lId,
			userId: uId,
			text: inputMessage.trim(),
		})

		setInputMessage('')
		document.getElementById('chat-input')?.focus()
	}

	// 4. Scrollni boshqarish
	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
		}
	}, [messages])

	// UI: Loading
	if (loading) return <WatchSkeleton />

	return (
		<motion.div
			variants={containerVariants}
			initial='hidden'
			animate='show'
			className='max-w-7xl mx-auto space-y-6 pb-12 w-full px-4 pt-4 sm:px-6'
		>
			{/* 🏷️ HEADER SECTION */}
			<motion.div
				variants={itemVariants}
				className='flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b pb-6'
			>
				<Button
					variant='outline'
					size='icon'
					onClick={() => router.push('/student/courses')}
					className='shrink-0 shadow-sm'
				>
					<ArrowLeft className='h-4 w-4' />
				</Button>
				<div className='flex-1 min-w-0'>
					<div className='flex items-center gap-3 flex-wrap mb-1'>
						<h1 className='text-xl sm:text-2xl font-bold tracking-tight truncate text-foreground leading-none'>
							{lesson?.title || 'Dars nomi'}
						</h1>
						<Badge
							variant='destructive'
							className='animate-pulse uppercase tracking-wider text-[10px] shadow-none'
						>
							Live
						</Badge>
						<Badge
							variant='secondary'
							className='flex items-center gap-1.5 px-2'
						>
							<Clock className='w-3.5 h-3.5' /> {timeElapsed}
						</Badge>
					</div>
					<p className='text-muted-foreground text-sm font-medium'>
						Ustoz:{' '}
						<span className='text-foreground'>
							{lesson?.mentor?.firstName} {lesson?.mentor?.lastName}
						</span>
					</p>
				</div>
			</motion.div>

			{/* 🗂️ MAIN CONTENT GRID */}
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* ========================================== */}
				{/* 💬 CHAT SECTION (Left) */}
				{/* ========================================== */}
				<motion.div variants={itemVariants} className='lg:col-span-2'>
					<Card className='flex flex-col h-[65vh] min-h-[500px] max-h-[800px] overflow-hidden border-border bg-card shadow-sm'>
						{/* Chat Header */}
						<CardHeader className='border-b py-3 px-5 shrink-0 bg-muted/20'>
							<div className='flex items-center gap-2'>
								<MessagesSquare className='w-4 h-4 text-muted-foreground' />
								<CardTitle className='text-base font-medium'>
									Jonli Muhokama
								</CardTitle>
							</div>
						</CardHeader>

						{/* Chat Messages */}
						<CardContent className='flex-1 min-h-0 p-0 flex flex-col bg-muted/5'>
							{lesson?.allowComments !== false ? (
								<>
									<div className='flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar min-h-0'>
										<AnimatePresence initial={false}>
											{messages.length === 0 ? (
												<div className='h-full flex flex-col items-center justify-center text-muted-foreground space-y-3 opacity-50 py-20'>
													<MessagesSquare className='h-10 w-10' />
													<p className='font-medium text-sm'>
														Hozircha xabarlar yo'q. Birinchi bo'lib yozing!
													</p>
												</div>
											) : (
												<div className='space-y-4'>
													{messages.map((msg, i) => {
														const senderId =
															msg.senderId?._id ||
															msg.senderId?.id ||
															msg.senderId
														const currentUserId = user?.id || user?._id
														const isMe = senderId === currentUserId
														const sender = msg.senderId
														const isMentor = sender?.role === 'mentor'

														return (
															<motion.div
																key={msg._id || i}
																initial={{ opacity: 0, y: 10, scale: 0.98 }}
																animate={{ opacity: 1, y: 0, scale: 1 }}
																className={cn(
																	'flex flex-col max-w-[85%] sm:max-w-[75%]',
																	isMe
																		? 'ml-auto items-end'
																		: 'mr-auto items-start',
																)}
															>
																{!isMe && (
																	<div className='flex items-center gap-1.5 mb-1 px-1'>
																		<span className='text-[11px] font-medium text-muted-foreground capitalize'>
																			{sender?.firstName || 'Foydalanuvchi'}{' '}
																			{sender?.lastName || ''}
																		</span>
																		{isMentor && (
																			<Badge
																				variant='outline'
																				className='text-[9px] h-4 px-1.5 uppercase bg-primary/10 text-primary border-transparent'
																			>
																				Ustoz
																			</Badge>
																		)}
																	</div>
																)}
																<div
																	className={cn(
																		'px-4 py-2.5 rounded-xl text-sm break-words shadow-sm border',
																		isMe
																			? 'bg-primary text-primary-foreground rounded-br-sm border-primary'
																			: 'bg-card text-foreground rounded-bl-sm border-border',
																	)}
																>
																	{msg.text}
																</div>
															</motion.div>
														)
													})}
													<div ref={scrollRef} className='h-1' />
												</div>
											)}
										</AnimatePresence>
									</div>

									{/* Input Form */}
									<div className='p-4 border-t bg-card shrink-0'>
										<form
											onSubmit={sendMessage}
											className='flex items-center gap-2'
										>
											<Input
												id='chat-input'
												placeholder='Xabar yuborish...'
												value={inputMessage}
												onChange={e => setInputMessage(e.target.value)}
												className='flex-1 bg-background h-10'
												autoComplete='off'
											/>
											<Button
												type='submit'
												disabled={!inputMessage.trim()}
												size='icon'
												className='shrink-0 h-10 w-10'
											>
												<Send className='h-4 w-4' />
											</Button>
										</form>
									</div>
								</>
							) : (
								<div className='flex-1 flex flex-col items-center justify-center text-muted-foreground p-10 text-center'>
									<MessageSquareOff className='h-10 w-10 opacity-30 mb-4' />
									<h3 className='font-medium text-foreground mb-1'>
										Chat o'chirib qo'yilgan
									</h3>
									<p className='text-sm max-w-[250px]'>
										Ustoz ushbu dars uchun muhokamani vaqtincha yopib qo'ygan.
									</p>
								</div>
							)}
						</CardContent>
					</Card>
				</motion.div>

				{/* ========================================== */}
				{/* 👥 ACTIVE USERS SECTION (Right) */}
				{/* ========================================== */}
				<motion.div variants={itemVariants}>
					<Card className='flex flex-col h-[65vh] min-h-[500px] max-h-[800px] overflow-hidden border-border bg-card shadow-sm'>
						<CardHeader className='border-b py-3 px-5 shrink-0 bg-muted/20'>
							<div className='flex items-center justify-between'>
								<div className='flex items-center gap-2'>
									<Users className='w-4 h-4 text-muted-foreground' />
									<CardTitle className='text-sm font-medium'>Faol</CardTitle>
								</div>
								<Badge
									variant='secondary'
									className='font-normal text-xs bg-background'
								>
									{activeUsers.length} onlayn
								</Badge>
							</div>
						</CardHeader>

						<CardContent className='flex-1 min-h-0 p-0 flex flex-col'>
							<div className='flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar min-h-0'>
								{activeUsers.map((u, i) => (
									<motion.div
										key={i}
										initial={{ opacity: 0, x: -10 }}
										animate={{ opacity: 1, x: 0 }}
										className='flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors'
									>
										<div className='flex items-center gap-3 min-w-0'>
											<Avatar className='h-8 w-8 border shrink-0'>
												<AvatarFallback className='font-bold text-xs uppercase bg-muted'>
													{getInitials(u.firstName, u.lastName)}
												</AvatarFallback>
											</Avatar>
											<div className='flex flex-col min-w-0'>
												<span className='text-sm font-medium leading-tight truncate capitalize text-foreground'>
													{u.firstName} {u.lastName}
												</span>
												<span className='text-[10px] text-muted-foreground uppercase mt-0.5 tracking-wider'>
													{u.role === 'mentor' ? 'Ustoz' : 'Talaba'}
												</span>
											</div>
										</div>
										<div className='flex items-center justify-center shrink-0 mr-1'>
											<div className='h-2 w-2 rounded-full bg-green-500 animate-pulse' />
										</div>
									</motion.div>
								))}

								{activeUsers.length === 0 && (
									<div className='text-center text-muted-foreground text-sm h-full flex flex-col items-center justify-center gap-2'>
										<Loader2 className='h-5 w-5 animate-spin opacity-50' />
										<p>Foydalanuvchilar kutilmoqda...</p>
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</motion.div>
	)
}
