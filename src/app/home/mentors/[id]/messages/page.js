'use client'

import Navbar from '@/components/landing/Navbar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
	ArrowLeft,
	MoreVertical,
	Paperclip,
	Phone,
	Send,
	Video,
} from 'lucide-react'
import Link from 'next/link'
import { use, useEffect, useRef, useState } from 'react'

// Mock Data mentors
const MENTORS = [
	{
		id: 1,
		name: 'Sardor R.',
		specialty: 'Full-Stack Dasturlash',
		isOnline: true,
		avatar: 'SR',
	},
	{
		id: 2,
		name: 'Malika B.',
		specialty: 'Mobil Dasturlash',
		isOnline: false,
		avatar: 'MB',
	},
	{
		id: 3,
		name: 'Javohir T.',
		specialty: "Algoritmlar va Ma'lumotlar",
		isOnline: true,
		avatar: 'JT',
	},
	{
		id: 4,
		name: 'Aziza K.',
		specialty: 'IT Menejment va Tahlil',
		isOnline: true,
		avatar: 'AK',
	},
	{
		id: 5,
		name: 'Bekzod O.',
		specialty: 'Backend Dasturlash',
		isOnline: false,
		avatar: 'BO',
	},
	{
		id: 6,
		name: 'Diyora S.',
		specialty: 'UI/UX Dizayn',
		isOnline: true,
		avatar: 'DS',
	},
]

export default function MentorMessagesPage({ params }) {
	const unwrappedParams = use(params)
	const mentorId = parseInt(unwrappedParams.id)

	const [mentor, setMentor] = useState(null)
	const [message, setMessage] = useState('')
	const messagesEndRef = useRef(null) // Avto-skroll uchun

	const [messages, setMessages] = useState([
		{
			id: 1,
			text: 'Salom! Qanday yordam bera olaman?',
			sender: 'mentor',
			time: '10:30',
		},
		{
			id: 2,
			text: "Assalomu alaykum. Men React bo'yicha dars olmoqchi edim.",
			sender: 'user',
			time: '10:32',
		},
		{
			id: 3,
			text: 'Albatta, qaysi darajadan boshlaymiz?',
			sender: 'mentor',
			time: '10:33',
		},
	])

	// Mentorni topish
	useEffect(() => {
		const foundMentor = MENTORS.find(m => m.id === mentorId)
		if (foundMentor) {
			setMentor(foundMentor)
		}
	}, [mentorId])

	// Yangi xabar qo'shilganda avtomatik eng pastga tushirish
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}

	useEffect(() => {
		scrollToBottom()
	}, [messages])

	const handleSendMessage = e => {
		e.preventDefault()
		if (!message.trim()) return

		const newMessage = {
			id: Date.now(),
			text: message,
			sender: 'user',
			time: new Date().toLocaleTimeString([], {
				hour: '2-digit',
				minute: '2-digit',
			}),
		}

		setMessages(prev => [...prev, newMessage])
		setMessage('')

		// Sun'iy intellekt (Mentor) javobini simulyatsiya qilish
		setTimeout(() => {
			const reply = {
				id: Date.now() + 1,
				text: "Tushunarli. Tez orada sizga to'liq ma'lumot va dars rejasini jo'nataman.",
				sender: 'mentor',
				time: new Date().toLocaleTimeString([], {
					hour: '2-digit',
					minute: '2-digit',
				}),
			}
			setMessages(prev => [...prev, reply])
		}, 1500)
	}

	// Yuklanish holati (Professional Skeleton)
	if (!mentor) {
		return (
			<div className='min-h-screen bg-muted/10 flex flex-col'>
				<Navbar />
				<div className='container mx-auto px-4 py-8 flex-1 flex flex-col items-center justify-center'>
					<div className='animate-pulse flex flex-col items-center space-y-4'>
						<div className='h-20 w-20 bg-muted-foreground/20 rounded-full'></div>
						<div className='h-5 w-48 bg-muted-foreground/20 rounded-md'></div>
						<div className='h-4 w-32 bg-muted-foreground/10 rounded-md'></div>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className='h-screen bg-muted/10 flex flex-col overflow-hidden'>
			<Navbar />

			<div className='container mx-auto max-w-4xl px-4 py-4 sm:py-6 flex-1 flex flex-col min-h-0'>
				{/* ORQAGA QAYTISH */}
				<Link
					href={`/home/mentors/${mentor.id}`}
					className='mb-4 inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-fit group'
				>
					<ArrowLeft className='h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform' />
					Mentor profiliga qaytish
				</Link>

				<Card className='flex-1 flex flex-col shadow-sm border-muted/50 overflow-hidden bg-background'>
					{/* 1. CHAT HEADER */}
					<CardHeader className='p-4 border-b bg-card/50 backdrop-blur flex flex-row items-center justify-between sticky top-0 z-10 space-y-0'>
						<div className='flex items-center gap-3 sm:gap-4'>
							<div className='relative'>
								<Avatar className='h-11 w-11 sm:h-12 sm:w-12 border-2 border-background shadow-sm'>
									<AvatarImage src='' alt={mentor.name} />
									<AvatarFallback className='bg-primary/10 text-primary font-bold'>
										{mentor.avatar}
									</AvatarFallback>
								</Avatar>
								{mentor.isOnline && (
									<span className='absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-background bg-green-500'></span>
								)}
							</div>
							<div>
								<h2 className='font-bold text-base sm:text-lg leading-tight text-foreground'>
									{mentor.name}
								</h2>
								<div className='flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground mt-0.5'>
									{mentor.isOnline ? (
										<span className='text-green-500 font-medium'>Onlayn</span>
									) : (
										<span>Oxirgi marta yaqinda</span>
									)}
									<span className='hidden sm:inline-block text-muted-foreground/50'>
										•
									</span>
									<span className='hidden sm:inline-block truncate max-w-[200px]'>
										{mentor.specialty}
									</span>
								</div>
							</div>
						</div>

						<div className='flex items-center gap-1 sm:gap-2 text-muted-foreground'>
							<Button
								variant='ghost'
								size='icon'
								className='h-9 w-9 rounded-full hidden sm:flex hover:text-primary'
							>
								<Phone className='h-4.5 w-4.5' />
							</Button>
							<Button
								variant='ghost'
								size='icon'
								className='h-9 w-9 rounded-full hidden sm:flex hover:text-primary'
							>
								<Video className='h-5 w-5' />
							</Button>
							<Button
								variant='ghost'
								size='icon'
								className='h-9 w-9 rounded-full hover:text-foreground'
							>
								<MoreVertical className='h-5 w-5' />
							</Button>
						</div>
					</CardHeader>

					{/* 2. CHAT MESSAGES BODY */}
					<CardContent className='flex-1 p-4 sm:p-6 overflow-y-auto bg-slate-50/30 dark:bg-slate-900/10 flex flex-col gap-5 relative'>
						{/* Sana ko'rsatkichi */}
						<div className='flex justify-center my-2 sticky top-2 z-10'>
							<span className='text-[11px] font-medium bg-muted/80 backdrop-blur-sm text-muted-foreground px-3 py-1.5 rounded-full shadow-sm'>
								Bugun
							</span>
						</div>

						{messages.map(msg => {
							const isMentor = msg.sender === 'mentor'
							return (
								<div
									key={msg.id}
									className={`flex w-full ${isMentor ? 'justify-start' : 'justify-end'}`}
								>
									<div
										className={`flex max-w-[85%] sm:max-w-[70%] ${isMentor ? 'flex-row' : 'flex-row-reverse'} gap-2 sm:gap-3 items-end`}
									>
										{/* Mentor avatari faqat uning xabarlarida ko'rinadi */}
										{isMentor && (
											<Avatar className='h-8 w-8 mb-4 hidden sm:block shadow-sm flex-shrink-0'>
												<AvatarFallback className='bg-primary/10 text-primary text-[10px] font-bold'>
													{mentor.avatar}
												</AvatarFallback>
											</Avatar>
										)}

										<div
											className={`flex flex-col ${isMentor ? 'items-start' : 'items-end'}`}
										>
											<div
												className={`px-4 py-2.5 rounded-2xl shadow-sm relative ${
													isMentor
														? 'bg-background border border-border/50 rounded-bl-sm text-foreground'
														: 'bg-primary text-primary-foreground rounded-br-sm'
												}`}
											>
												<p className='text-[14px] sm:text-[15px] leading-relaxed break-words'>
													{msg.text}
												</p>
											</div>

											{/* Vaqt */}
											<span className='text-[11px] text-muted-foreground mt-1.5 px-1 font-medium'>
												{msg.time} {msg.sender === 'user' && '✓✓'}
											</span>
										</div>
									</div>
								</div>
							)
						})}

						{/* Auto-scroll uchun ko'rinmas element */}
						<div ref={messagesEndRef} />
					</CardContent>

					{/* 3. CHAT INPUT FORM */}
					<div className='p-3 sm:p-4 bg-background border-t'>
						<form
							onSubmit={handleSendMessage}
							className='flex gap-2 relative items-center'
						>
							{/* Biriktirish tugmasi */}
							<Button
								type='button'
								variant='ghost'
								size='icon'
								className='h-10 w-10 shrink-0 text-muted-foreground hover:text-foreground'
							>
								<Paperclip className='h-5 w-5' />
							</Button>

							<div className='relative flex-1'>
								<Input
									placeholder='Xabar yozing...'
									className='w-full rounded-full pl-4 pr-12 shadow-sm border-muted-foreground/20 h-11 focus-visible:ring-primary/50 text-[15px] bg-muted/20'
									value={message}
									onChange={e => setMessage(e.target.value)}
									autoComplete='off'
								/>

								{/* Yuborish tugmasi input ichida */}
								<Button
									type='submit'
									size='icon'
									className={`absolute right-1 top-1 h-9 w-9 rounded-full shadow-sm transition-all active:scale-95 ${
										message.trim()
											? 'bg-primary text-primary-foreground'
											: 'bg-muted text-muted-foreground'
									}`}
									disabled={!message.trim()}
								>
									<Send className='h-4 w-4 ml-0.5' />
								</Button>
							</div>
						</form>
					</div>
				</Card>
			</div>
		</div>
	)
}
