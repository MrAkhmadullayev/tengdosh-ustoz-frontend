'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import api from '@/lib/api'
// 🔥 Markazlashgan utils
import { getInitials } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import {
	ArrowLeft,
	Clock,
	MessageSquareOff,
	MessagesSquare,
	Send,
	Users,
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'

// ==========================================
// 🎨 ANIMATSIYA VARIANTLARI
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
// 🚀 ASOSIY KOMPONENT
// ==========================================
export default function AdminWatchLessonPage() {
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

	// 1. Dastlabki ma'lumotlarni yuklash va Polling
	useEffect(() => {
		const initData = async () => {
			try {
				const [meRes, lesRes] = await Promise.all([
					api.get('/auth/me'),
					api.get(`/admin/lessons/${id}`),
				])

				if (meRes.data?.success && lesRes.data?.success) {
					setUser(meRes.data.user)
					setLesson(lesRes.data.lesson)
					if (lesRes.data.lesson.messages) {
						setMessages(lesRes.data.lesson.messages)
					}
				}
			} catch (error) {
				console.error('Darsni yuklashda xatolik:', error)
				router.push('/admin/lessons')
			} finally {
				setLoading(false)
			}
		}

		if (id) initData()

		// Orqa fonda chatni sinxronlash (Polling)
		const pollInterval = setInterval(async () => {
			try {
				const res = await api.get(`/admin/lessons/${id}`)
				if (res.data?.success && res.data.lesson.messages) {
					setMessages(res.data.lesson.messages)
				}
			} catch (e) {
				// Silent catch
			}
		}, 5000)

		return () => clearInterval(pollInterval)
	}, [id, router])

	// 2. SOCKET.IO VA TIMER ULANISHI
	useEffect(() => {
		if (!lesson || !user) return

		const apiUrl =
			process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ||
			'http://13.48.57.24:5001'

		// 🔥 Xavfsiz ulanish (faqat bir marta)
		if (!socketRef.current) {
			socketRef.current = io(apiUrl, { withCredentials: true })

			socketRef.current.on('connect', () => {
				socketRef.current.emit('join_lesson', {
					lessonId: lesson._id || lesson.id,
					userId: user.id || user._id,
				})
			})

			socketRef.current.on('active_users', users => setActiveUsers(users))

			socketRef.current.on('new_message', msg => {
				setMessages(prev => [...prev, msg])
				setTimeout(() => {
					scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
				}, 100)
			})
		}

		// 🔥 Jonli taymer hisoblagichi (faqat status live bo'lsa mantiqiy ishlaydi)
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

		calculateTime() // Dastlabki hisob
		timerRef.current = setInterval(calculateTime, 1000)

		// Tozalash qismi (Cleanup)
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
		if (!inputMessage.trim() || !socketRef.current || !lesson?.allowComments)
			return

		socketRef.current.emit('send_message', {
			lessonId: lesson._id || lesson.id,
			userId: user.id || user._id,
			text: inputMessage,
		})

		setInputMessage('')
		// Inputdan keyin focusni ushlab qolish uchun
		document.getElementById('chat-input')?.focus()
	}

	// 4. UI: Loading Skeleton
	if (loading) {
		return (
			<div className='max-w-6xl mx-auto space-y-6 pt-6 pb-12 w-full px-4 sm:px-6 animate-pulse'>
				<Skeleton className='h-24 w-full rounded-xl' />
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
					<Skeleton className='h-[60vh] lg:col-span-2 rounded-xl' />
					<Skeleton className='h-[60vh] rounded-xl' />
				</div>
			</div>
		)
	}

	// 5. UI: Asosiy Forma (Sof Shadcn/ui uslubida)
	return (
		<motion.div
			variants={containerVariants}
			initial='hidden'
			animate='show'
			className='max-w-6xl mx-auto space-y-6 pb-12 pt-6 px-4 sm:px-6 w-full'
		>
			{/* 🏷️ HEADER (Xuddi Vercel Navbar kabi toza) */}
			<motion.div
				variants={itemVariants}
				className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-6'
			>
				<div className='flex items-center gap-4'>
					<Button
						variant='outline'
						size='icon'
						onClick={() => router.push('/admin/lessons')}
						className='shrink-0'
					>
						<ArrowLeft className='h-4 w-4' />
					</Button>
					<div className='flex-1 min-w-0'>
						<div className='flex items-center gap-3 flex-wrap mb-1'>
							<h1 className='text-2xl font-bold tracking-tight text-foreground truncate max-w-sm'>
								{lesson?.title}
							</h1>
							<Badge
								variant='destructive'
								className='animate-pulse uppercase text-[10px] tracking-wider px-2'
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
							Mentor: {lesson?.mentor?.firstName} {lesson?.mentor?.lastName}
						</p>
					</div>
				</div>
			</motion.div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* ========================================== */}
				{/* 💬 CHAT QISMI (Chap taraf) */}
				{/* ========================================== */}
				<motion.div variants={itemVariants} className='lg:col-span-2'>
					<Card className='flex flex-col h-[65vh] sm:h-[70vh] border-border overflow-hidden'>
						<CardHeader className='border-b py-3 px-6 shrink-0 bg-muted/20'>
							<div className='flex items-center gap-2'>
								<MessagesSquare className='w-4 h-4 text-muted-foreground' />
								<CardTitle className='text-sm font-medium'>
									Jonli Muhokama
								</CardTitle>
							</div>
						</CardHeader>

						<CardContent className='flex-1 p-0 flex flex-col overflow-hidden bg-muted/5'>
							{lesson?.allowComments ? (
								<>
									<ScrollArea className='flex-1 p-4 sm:p-6'>
										<AnimatePresence initial={false}>
											{messages.length === 0 ? (
												<div className='h-full flex flex-col items-center justify-center text-muted-foreground space-y-3 opacity-50 py-20'>
													<MessagesSquare className='h-8 w-8' />
													<p className='text-sm font-medium'>
														Hozircha xabarlar yo'q
													</p>
												</div>
											) : (
												<div className='space-y-4'>
													{messages.map((msg, i) => {
														const isMe =
															(msg.senderId._id || msg.senderId) ===
															(user.id || user._id)
														const sender = msg.senderId

														return (
															<motion.div
																key={i}
																initial={{ opacity: 0, y: 10, scale: 0.98 }}
																animate={{ opacity: 1, y: 0, scale: 1 }}
																className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}
															>
																{!isMe && (
																	<div className='flex items-center gap-1.5 mb-1 px-1'>
																		<span className='text-[11px] font-medium text-muted-foreground capitalize'>
																			{sender?.firstName} {sender?.lastName}
																		</span>
																		<Badge
																			variant='outline'
																			className='text-[9px] h-4 px-1 uppercase border-transparent bg-muted/50 text-muted-foreground'
																		>
																			{sender?.role || 'user'}
																		</Badge>
																	</div>
																)}
																<div
																	className={`px-4 py-2 rounded-xl text-sm ${
																		isMe
																			? 'bg-primary text-primary-foreground rounded-br-sm'
																			: 'bg-card text-foreground border rounded-bl-sm shadow-sm'
																	}`}
																>
																	{msg.text}
																</div>
															</motion.div>
														)
													})}
													<div ref={scrollRef} />
												</div>
											)}
										</AnimatePresence>
									</ScrollArea>

									{/* Chat Input */}
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
												className='flex-1 bg-background'
												autoComplete='off'
											/>
											<Button
												type='submit'
												disabled={!inputMessage.trim()}
												size='icon'
												className='shrink-0 h-10 w-10'
											>
												<Send className='h-4 w-4' />
												<span className='sr-only'>Yuborish</span>
											</Button>
										</form>
									</div>
								</>
							) : (
								<div className='h-full flex flex-col items-center justify-center text-muted-foreground p-10 text-center'>
									<MessageSquareOff className='h-12 w-12 mb-4 opacity-20' />
									<h3 className='font-medium text-foreground mb-1'>
										Chat o'chirib qo'yilgan
									</h3>
									<p className='text-sm'>
										Ustoz ushbu dars uchun muhokamani yopib qo'ygan.
									</p>
								</div>
							)}
						</CardContent>
					</Card>
				</motion.div>

				{/* ========================================== */}
				{/* 👥 FAOL FOYDALANUVCHILAR (O'ng taraf) */}
				{/* ========================================== */}
				<motion.div variants={itemVariants}>
					<Card className='flex flex-col h-[65vh] sm:h-[70vh] border-border overflow-hidden bg-card'>
						<CardHeader className='border-b py-3 px-6 shrink-0 bg-muted/20'>
							<div className='flex items-center justify-between'>
								<div className='flex items-center gap-2'>
									<Users className='w-4 h-4 text-muted-foreground' />
									<CardTitle className='text-sm font-medium'>
										Faol foydalanuvchilar
									</CardTitle>
								</div>
								<Badge
									variant='secondary'
									className='font-normal text-xs bg-background'
								>
									{activeUsers.length} onlayn
								</Badge>
							</div>
						</CardHeader>

						<CardContent className='flex-1 p-0 overflow-hidden'>
							<ScrollArea className='h-full'>
								<div className='p-2 space-y-1'>
									{activeUsers.length > 0 ? (
										activeUsers.map((u, i) => (
											<motion.div
												key={i}
												initial={{ opacity: 0, x: -10 }}
												animate={{ opacity: 1, x: 0 }}
												className='flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors'
											>
												<div className='flex items-center gap-3 min-w-0'>
													<Avatar className='h-8 w-8 border'>
														<AvatarFallback className='text-xs bg-muted'>
															{getInitials(u.firstName, u.lastName)}
														</AvatarFallback>
													</Avatar>
													<div className='flex flex-col min-w-0'>
														<span className='text-sm font-medium leading-tight truncate capitalize'>
															{u.firstName} {u.lastName}
														</span>
														<span className='text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5'>
															{u.role}
														</span>
													</div>
												</div>
												{/* Yashil onlayn nuqtasi */}
												<div className='h-2 w-2 rounded-full bg-green-500 shrink-0 mr-1' />
											</motion.div>
										))
									) : (
										<div className='text-center text-muted-foreground text-sm py-20 flex flex-col items-center'>
											<Users className='h-8 w-8 mb-2 opacity-20' />
											Hali hech kim ulanmadi
										</div>
									)}
								</div>
							</ScrollArea>
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</motion.div>
	)
}
