'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import api from '@/lib/api'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import {
	ArrowLeft,
	Clock,
	Loader2,
	MessageSquareOff,
	MessagesSquare,
	Send,
	Users,
	Video,
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'

// --- ANIMATION VARIANTS ---
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

// --- SKELETON LOADER ---
const WatchSkeleton = () => (
	<div className='max-w-6xl mx-auto space-y-6 pt-6 pb-12 w-full px-4 animate-in fade-in duration-500'>
		<Skeleton className='h-24 w-full rounded-2xl' />
		<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
			<Skeleton className='h-[60vh] min-h-[500px] lg:col-span-2 rounded-2xl' />
			<Skeleton className='h-[60vh] min-h-[500px] rounded-2xl' />
		</div>
	</div>
)

export default function StudentWatchLessonPage() {
	const params = useParams()
	const { id } = params
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

	// Asosiy ma'lumotlarni yuklash
	useEffect(() => {
		const initData = async () => {
			try {
				const [meRes, lesRes] = await Promise.all([
					api.get('/auth/me'),
					api.get(`/student/lessons/${id}`),
				])

				if (meRes.data.success && lesRes.data.success) {
					setUser(meRes.data.user)
					setLesson(lesRes.data.lesson)
					if (lesRes.data.lesson.messages) {
						setMessages(lesRes.data.lesson.messages)
					}
				}
				setLoading(false)
			} catch (error) {
				console.error(error)
				router.push('/student/courses')
			}
		}
		if (id) initData()
	}, [id, router])

	// Socket.io ulanishi
	useEffect(() => {
		if (!lesson || !user) return

		const apiUrl =
			process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ||
			'http://13.48.57.24:5000'
		const socket = io(apiUrl, { withCredentials: true })
		socketRef.current = socket

		socket.on('connect', () => {
			const lId = lesson._id?.toString() || lesson.id?.toString()
			const uId = user.id?.toString() || user._id?.toString()
			socket.emit('join_lesson', { lessonId: lId, userId: uId })
		})

		socket.on('active_users', users => setActiveUsers(users))

		socket.on('new_message', msg => {
			setMessages(prev => {
				// Xabarlar 2 marta chiqib qolmasligi uchun ID orqali tekshiramiz
				if (prev.find(m => m._id === msg._id)) return prev
				return [...prev, msg]
			})
		})

		// Taymer
		let startTime = new Date(
			`${lesson.date?.split('T')[0]}T${lesson.time}:00`,
		).getTime()

		timerRef.current = setInterval(() => {
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
				setTimeElapsed('Boshlanmagan')
			}
		}, 1000)

		return () => {
			socket.disconnect()
			if (timerRef.current) clearInterval(timerRef.current)
		}
	}, [lesson, user])

	// Xabar yuborish
	const sendMessage = e => {
		e.preventDefault()
		if (!inputMessage.trim() || !socketRef.current) return
		const lId = lesson._id?.toString() || lesson.id?.toString()
		const uId = user.id?.toString() || user._id?.toString()

		// Serverga yuborish (Server o'zi barchaga, shu jumladan sizga ham qaytaradi)
		socketRef.current.emit('send_message', {
			lessonId: lId,
			userId: uId,
			text: inputMessage,
		})

		setInputMessage('')
	}

	// Yangi xabar kelganda avtomatik pastga tushish
	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
		}
	}, [messages])

	if (loading) return <WatchSkeleton />

	return (
		<motion.div
			variants={containerVariants}
			initial='hidden'
			animate='show'
			className='max-w-7xl mx-auto space-y-6 pb-12 w-full px-4 pt-4 sm:pt-6'
		>
			{/* HEADER SECTION */}
			<motion.div
				variants={itemVariants}
				className='flex items-center gap-4 bg-card p-4 sm:p-5 rounded-2xl border shadow-sm'
			>
				<Button
					variant='secondary'
					size='icon'
					onClick={() => router.push('/student/courses')}
					className='rounded-full shrink-0 h-10 w-10'
				>
					<ArrowLeft className='h-5 w-5' />
				</Button>
				<div className='flex-1 min-w-0'>
					<div className='flex items-center gap-3 mb-1.5 flex-wrap'>
						<Badge className='bg-red-500 hover:bg-red-600 text-white gap-1.5 animate-pulse border-none px-2.5 py-0.5 shadow-sm'>
							<Video className='w-3.5 h-3.5' /> LIVE
						</Badge>
						<div className='flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full'>
							<Clock className='w-3.5 h-3.5' /> {timeElapsed}
						</div>
					</div>
					<h1 className='text-lg sm:text-2xl font-bold tracking-tight truncate text-foreground leading-none'>
						{lesson?.title}
					</h1>
					<p className='text-muted-foreground text-xs sm:text-sm flex items-center gap-2 mt-1.5 truncate font-medium'>
						Ustoz:{' '}
						<span className='text-foreground font-semibold'>
							{lesson?.mentor?.firstName} {lesson?.mentor?.lastName}
						</span>
					</p>
				</div>
			</motion.div>

			{/* MAIN CONTENT GRID */}
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* CHAT SECTION (Left - spans 2 cols) */}
				<motion.div variants={itemVariants} className='lg:col-span-2'>
					<Card className='shadow-sm border-muted flex flex-col h-[60vh] min-h-[500px] max-h-[800px] overflow-hidden rounded-2xl'>
						{/* Chat Header */}
						<CardHeader className='border-b bg-muted/20 py-4 px-5 shrink-0'>
							<div className='flex items-center gap-3'>
								<div className='p-2 bg-primary/10 rounded-xl'>
									<MessagesSquare className='w-5 h-5 text-primary' />
								</div>
								<div>
									<CardTitle className='text-base sm:text-lg'>
										Jonli Muhokama
									</CardTitle>
									<p className='text-[11px] sm:text-xs text-muted-foreground font-medium'>
										Dars davomida savollaringizni bering
									</p>
								</div>
							</div>
						</CardHeader>

						{/* Chat Messages Area */}
						<CardContent className='flex-1 min-h-0 p-0 flex flex-col bg-muted/5'>
							{lesson?.allowComments !== false ? (
								<>
									{/* SCROLLABLE AREA: min-h-0 is crucial for flex children to scroll properly */}
									<div className='flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar min-h-0'>
										<AnimatePresence initial={false}>
											{messages.length === 0 ? (
												<div className='h-full flex flex-col items-center justify-center text-muted-foreground space-y-3 opacity-50'>
													<MessagesSquare className='h-12 w-12' />
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
																initial={{ opacity: 0, y: 10, scale: 0.95 }}
																animate={{ opacity: 1, y: 0, scale: 1 }}
																className={cn(
																	'flex flex-col max-w-[85%] sm:max-w-[75%]',
																	isMe
																		? 'ml-auto items-end'
																		: 'mr-auto items-start',
																)}
															>
																{!isMe && (
																	<div className='flex items-center gap-2 mb-1 px-1'>
																		<span className='text-[11px] font-bold text-muted-foreground capitalize'>
																			{sender?.firstName || 'Foydalanuvchi'}{' '}
																			{sender?.lastName || ''}
																		</span>
																		{isMentor && (
																			<Badge
																				variant='secondary'
																				className='text-[9px] h-4 px-1.5 leading-none uppercase bg-blue-500/10 text-blue-600 border-none'
																			>
																				Ustoz
																			</Badge>
																		)}
																	</div>
																)}
																<div
																	className={cn(
																		'px-4 py-2.5 rounded-2xl text-[14px] shadow-sm break-words',
																		isMe
																			? 'bg-primary text-primary-foreground rounded-br-sm'
																			: 'bg-card text-foreground border border-muted rounded-bl-sm',
																	)}
																>
																	{msg.text}
																</div>
															</motion.div>
														)
													})}
													{/* Scroll to bottom dummy div */}
													<div ref={scrollRef} className='h-1' />
												</div>
											)}
										</AnimatePresence>
									</div>

									{/* Input Form */}
									<div className='p-4 border-t bg-card shrink-0 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)] z-10'>
										<form
											onSubmit={sendMessage}
											className='flex items-center gap-2'
										>
											<Input
												placeholder='Xabar yuborish...'
												value={inputMessage}
												onChange={e => setInputMessage(e.target.value)}
												className='flex-1 bg-muted/50 border-transparent focus-visible:ring-primary h-12 rounded-xl'
											/>
											<Button
												type='submit'
												disabled={!inputMessage.trim()}
												className='rounded-xl h-12 w-12 sm:w-auto sm:px-6 shadow-sm transition-all hover:scale-[1.02] active:scale-95'
											>
												<Send className='h-4 w-4 sm:mr-2' />
												<span className='hidden sm:inline'>Yuborish</span>
											</Button>
										</form>
									</div>
								</>
							) : (
								<div className='flex-1 flex flex-col items-center justify-center text-muted-foreground p-10 text-center'>
									<div className='bg-muted p-4 rounded-full mb-4'>
										<MessageSquareOff className='h-8 w-8 opacity-40' />
									</div>
									<h3 className='font-bold text-foreground mb-1'>
										Chat o'chirib qo'yilgan
									</h3>
									<p className='text-sm max-w-[250px] leading-relaxed'>
										Ustoz ushbu dars uchun muhokamani vaqtincha yopib qo'ygan.
									</p>
								</div>
							)}
						</CardContent>
					</Card>
				</motion.div>

				{/* ACTIVE USERS SECTION (Right - spans 1 col) */}
				<motion.div variants={itemVariants}>
					<Card className='shadow-sm border-muted flex flex-col h-[60vh] min-h-[500px] max-h-[800px] overflow-hidden rounded-2xl'>
						<CardHeader className='border-b bg-muted/20 py-4 px-5 shrink-0'>
							<div className='flex items-center gap-3'>
								<div className='p-2 bg-emerald-500/10 rounded-xl'>
									<Users className='w-5 h-5 text-emerald-600' />
								</div>
								<div>
									<CardTitle className='text-base sm:text-lg'>
										Foydalanuvchilar
									</CardTitle>
									<p className='text-[11px] sm:text-xs text-muted-foreground font-medium'>
										<span className='text-emerald-600 font-bold'>
											{activeUsers.length} ta
										</span>{' '}
										kishi onlayn
									</p>
								</div>
							</div>
						</CardHeader>

						<CardContent className='flex-1 min-h-0 p-0 flex flex-col bg-card'>
							<div className='flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar min-h-0'>
								{activeUsers.map((u, i) => (
									<motion.div
										key={i}
										initial={{ opacity: 0, x: -10 }}
										animate={{ opacity: 1, x: 0 }}
										className='flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent group'
									>
										<div className='flex items-center gap-3 min-w-0'>
											<Avatar className='h-9 w-9 border-2 border-background shadow-sm shrink-0'>
												<AvatarFallback
													className={cn(
														'font-bold text-xs uppercase',
														u.role === 'mentor'
															? 'bg-blue-500/10 text-blue-600'
															: 'bg-primary/10 text-primary',
													)}
												>
													{u.firstName?.charAt(0)}
												</AvatarFallback>
											</Avatar>
											<div className='flex flex-col min-w-0'>
												<span className='text-sm font-bold leading-tight truncate text-foreground'>
													{u.firstName} {u.lastName}
												</span>
												<span className='text-[10px] text-muted-foreground capitalize mt-0.5 font-semibold'>
													{u.role === 'mentor' ? 'Ustoz' : 'Talaba'}
												</span>
											</div>
										</div>
										<div className='flex items-center justify-center shrink-0'>
											<div className='h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse' />
										</div>
									</motion.div>
								))}

								{activeUsers.length === 0 && (
									<div className='text-center text-muted-foreground text-sm h-full flex flex-col items-center justify-center gap-2'>
										<Loader2 className='h-6 w-6 animate-spin opacity-30' />
										<p className='font-medium opacity-60'>
											Foydalanuvchilar kutilmoqda...
										</p>
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
