'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import api from '@/lib/api'
import { AnimatePresence, motion } from 'framer-motion'
import {
	ArrowLeft,
	Clock,
	MessageSquareOff,
	MessagesSquare,
	Send,
	Users,
	Video,
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'

const containerVariants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: { staggerChildren: 0.1 },
	},
}

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	show: {
		opacity: 1,
		y: 0,
		transition: { type: 'spring', stiffness: 300, damping: 24 },
	},
}

export default function AdminWatchLessonPage() {
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

	useEffect(() => {
		const initData = async () => {
			try {
				const [meRes, lesRes] = await Promise.all([
					api.get('/auth/me'),
					api.get(`/admin/lessons/${id}`),
				])

				if (meRes.data.success && lesRes.data.success) {
					setUser(meRes.data.user)
					setLesson(lesRes.data.lesson)
					// Load existing messages
					if (lesRes.data.lesson.messages) {
						setMessages(lesRes.data.lesson.messages)
					}
				}
				setLoading(false)
			} catch (error) {
				console.error(error)
				router.push('/admin/lessons')
			}
		}
		if (id) initData()

		// Polling for real-time message updates every 5 seconds
		const pollInterval = setInterval(async () => {
			try {
				const res = await api.get(`/admin/lessons/${id}`)
				if (res.data.success && res.data.lesson.messages) {
					setMessages(res.data.lesson.messages)
				}
			} catch (e) {}
		}, 5000)

		return () => clearInterval(pollInterval)
	}, [id, router])

	useEffect(() => {
		if (!lesson || !user) return

		const apiUrl =
			process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ||
			'http://13.48.57.24:5001'
		const socket = io(apiUrl, { withCredentials: true })
		socketRef.current = socket

		socket.on('connect', () => {
			socket.emit('join_lesson', {
				lessonId: lesson._id || lesson.id,
				userId: user.id || user._id,
			})
		})

		socket.on('active_users', users => setActiveUsers(users))
		socket.on('new_message', msg => {
			setMessages(prev => [...prev, msg])
			setTimeout(() => {
				scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
			}, 100)
		})

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

	const sendMessage = e => {
		e.preventDefault()
		if (!inputMessage.trim() || !socketRef.current) return
		socketRef.current.emit('send_message', {
			lessonId: lesson._id || lesson.id,
			userId: user.id || user._id,
			text: inputMessage,
		})
		setInputMessage('')
	}

	if (loading) {
		return (
			<div className='max-w-6xl mx-auto space-y-6 pt-6 pb-12 w-full px-4'>
				<Skeleton className='h-24 w-full rounded-xl' />
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
					<Skeleton className='h-[60vh] lg:col-span-2 rounded-xl' />
					<Skeleton className='h-[60vh] rounded-xl' />
				</div>
			</div>
		)
	}

	return (
		<motion.div
			variants={containerVariants}
			initial='hidden'
			animate='show'
			className='max-w-6xl mx-auto space-y-6 pb-12 w-full px-4 pt-4 sm:pt-6'
		>
			{/* HEADER */}
			<motion.div
				variants={itemVariants}
				className='flex items-center gap-4 bg-card p-5 rounded-2xl border shadow-sm'
			>
				<Button
					variant='outline'
					size='icon'
					onClick={() => router.push('/admin/lessons')}
					className='rounded-full shrink-0 hover:bg-primary/5 h-10 w-10'
				>
					<ArrowLeft className='h-5 w-5' />
				</Button>
				<div className='flex-1 min-w-0'>
					<div className='flex items-center gap-3 mb-1.5 flex-wrap'>
						<Badge className='bg-red-500 hover:bg-red-600 text-white gap-1.5 animate-pulse border-none px-3'>
							<Video className='w-3.5 h-3.5' /> LIVE
						</Badge>
						<div className='flex items-center gap-1.5 text-sm font-bold text-primary bg-primary/5 px-3 py-1 rounded-full'>
							<Clock className='w-4 h-4' /> {timeElapsed}
						</div>
					</div>
					<h1 className='text-xl sm:text-2xl font-bold tracking-tight truncate text-foreground'>
						{lesson?.title}
					</h1>
					<p className='text-muted-foreground text-xs sm:text-sm flex items-center gap-2 mt-1 truncate font-medium'>
						Mentor:{' '}
						<span className='text-foreground'>
							{lesson?.mentor?.firstName} {lesson?.mentor?.lastName}
						</span>
					</p>
				</div>
			</motion.div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* CHAT SECTION */}
				<motion.div variants={itemVariants} className='lg:col-span-2'>
					<Card className='shadow-md border-muted flex flex-col h-[65vh] sm:h-[70vh] overflow-hidden'>
						<CardHeader className='border-b bg-muted/30 py-4 px-6 shrink-0'>
							<div className='flex items-center gap-3'>
								<div className='p-2 bg-primary/10 rounded-xl'>
									<MessagesSquare className='w-5 h-5 text-primary' />
								</div>
								<div>
									<CardTitle className='text-lg'>Jonli Muhokama</CardTitle>
									<p className='text-xs text-muted-foreground font-medium'>
										Monitoring va kuzatuv oynasi
									</p>
								</div>
							</div>
						</CardHeader>

						<CardContent className='flex-1 p-0 flex flex-col overflow-hidden bg-muted/5'>
							{lesson?.allowComments ? (
								<>
									<ScrollArea className='flex-1 p-4 sm:p-6'>
										<AnimatePresence initial={false}>
											{messages.length === 0 ? (
												<div className='h-full flex flex-col items-center justify-center text-muted-foreground space-y-3 opacity-40 py-20'>
													<MessagesSquare className='h-12 w-12' />
													<p className='font-medium'>Hozircha xabarlar yo'q</p>
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
																initial={{ opacity: 0, y: 10, scale: 0.95 }}
																animate={{ opacity: 1, y: 0, scale: 1 }}
																className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}
															>
																{!isMe && (
																	<div className='flex items-center gap-1.5 mb-1 px-1'>
																		<span className='text-[11px] font-bold text-foreground capitalize'>
																			{sender?.firstName} {sender?.lastName}
																		</span>
																		<Badge
																			variant='outline'
																			className='text-[9px] h-4 px-1 leading-none uppercase opacity-70'
																		>
																			{sender?.role || 'user'}
																		</Badge>
																	</div>
																)}
																<div
																	className={`px-4 py-2.5 rounded-2xl text-[14px] shadow-sm border ${
																		isMe
																			? 'bg-primary text-white border-primary rounded-br-sm'
																			: 'bg-card text-foreground border-muted rounded-bl-sm'
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

									<div className='p-4 border-t bg-card shrink-0'>
										<form
											onSubmit={sendMessage}
											className='flex items-center gap-2'
										>
											<Input
												placeholder='Xabar yuborish...'
												value={inputMessage}
												onChange={e => setInputMessage(e.target.value)}
												className='flex-1 bg-muted/50 border-transparent focus-visible:ring-primary/20 h-11'
											/>
											<Button
												type='submit'
												disabled={!inputMessage.trim()}
												className='rounded-xl gap-2 h-11 px-6 shadow-sm transition-all hover:shadow-primary/20'
											>
												<Send className='h-4 w-4' />
												<span className='hidden sm:inline'>Yuborish</span>
											</Button>
										</form>
									</div>
								</>
							) : (
								<div className='h-full flex flex-col items-center justify-center text-muted-foreground p-10 text-center'>
									<div className='bg-muted p-4 rounded-full mb-4'>
										<MessageSquareOff className='h-10 w-10 opacity-30' />
									</div>
									<h3 className='font-bold text-foreground mb-1'>
										Chat o'chirib qo'yilgan
									</h3>
									<p className='text-sm max-w-[250px] leading-relaxed'>
										Ustoz ushbu dars uchun muhokamani yopib qo'ygan.
									</p>
								</div>
							)}
						</CardContent>
					</Card>
				</motion.div>

				{/* ACTIVE USERS SECTION */}
				<motion.div variants={itemVariants}>
					<Card className='shadow-md border-muted flex flex-col h-[65vh] sm:h-[70vh] overflow-hidden'>
						<CardHeader className='border-b bg-muted/30 py-4 px-6 shrink-0'>
							<div className='flex items-center gap-3'>
								<div className='p-2 bg-blue-500/10 rounded-xl'>
									<Users className='w-5 h-5 text-blue-600' />
								</div>
								<div>
									<CardTitle className='text-lg'>Foydalanuvchilar</CardTitle>
									<p className='text-xs text-muted-foreground font-medium'>
										<span className='text-blue-600 font-bold'>
											{activeUsers.length} ta
										</span>{' '}
										kishi onlayn
									</p>
								</div>
							</div>
						</CardHeader>

						<CardContent className='flex-1 p-0 overflow-hidden bg-card'>
							<ScrollArea className='h-full'>
								<div className='p-3 space-y-1'>
									{activeUsers.map((u, i) => (
										<motion.div
											key={i}
											initial={{ opacity: 0, x: -10 }}
											animate={{ opacity: 1, x: 0 }}
											className='flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-all border border-transparent hover:border-muted'
										>
											<div className='flex items-center gap-3 min-w-0'>
												<Avatar className='h-9 w-9 border-2 border-background shadow-sm shrink-0'>
													<AvatarFallback className='bg-primary/10 text-primary font-bold text-xs uppercase'>
														{u.firstName?.charAt(0)}
													</AvatarFallback>
												</Avatar>
												<div className='flex flex-col min-w-0'>
													<span className='text-sm font-bold leading-tight truncate'>
														{u.firstName} {u.lastName}
													</span>
													<span className='text-[10px] text-muted-foreground capitalize mt-0.5 font-medium'>
														{u.role}
													</span>
												</div>
											</div>
											<div className='h-2 w-2 rounded-full bg-green-500 shrink-0 shadow-[0_0_8px_rgba(34,197,94,0.5)]' />
										</motion.div>
									))}

									{activeUsers.length === 0 && (
										<div className='text-center text-muted-foreground text-sm py-20 opacity-50 font-medium'>
											Hali hech kim qo'shilmadi
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
