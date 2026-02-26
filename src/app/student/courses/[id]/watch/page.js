'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
	ArrowLeft,
	MessageSquare,
	PlayCircle,
	Radio,
	Send,
	Users,
	Video,
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

// O'quvchilar mock datasi
const MOCK_ATTENDEES = [
	{ id: 1, name: 'Aliyev Vali', status: 'online', joinedAt: '15:02' },
	{ id: 2, name: 'Karimova Nargiza', status: 'online', joinedAt: '15:00' },
	{ id: 3, name: 'Toshmatov Eshmat', status: 'offline', joinedAt: '15:10' },
	{ id: 4, name: 'Axmedova Gulnoza', status: 'online', joinedAt: '15:05' },
	{ id: 5, name: 'Samadov Jasur', status: 'online', joinedAt: '15:01' },
	{ id: 6, name: 'Qodirova Malikam', status: 'offline', joinedAt: '15:00' },
]

// Mock Chat guruhlari
const MOCK_CHAT = [
	{
		id: 1,
		user: 'Aliyev Vali',
		message: 'Assalomu alaykum, dars qachon boshlanadi?',
		time: '15:00',
	},
	{
		id: 2,
		user: 'Karimova Nargiza',
		message: 'Menda hammasi zor 👍',
		time: '15:02',
	},
	{
		id: 3,
		user: "Javohir To'rayev",
		isMentor: true,
		message:
			"Va alaykum assalom. Hammaga xayrli kun, 2 daqiqada efirni ochaman o'rtoqlar!",
		time: '15:03',
	},
	{
		id: 4,
		user: 'Samadov Jasur',
		message: 'Ustoz ovozingiz pastroq kelyapti...',
		time: '15:07',
	},
]

export default function StudentWatchLessonPage() {
	const router = useRouter()
	const { id } = useParams() || { id: '4582' }
	const [chatMessage, setChatMessage] = useState('')
	const [messages, setMessages] = useState(MOCK_CHAT)
	const scrollRef = useRef(null)

	// Xabar yuborish
	const handleSendMessage = e => {
		e.preventDefault()
		if (!chatMessage.trim()) return

		setMessages([
			...messages,
			{
				id: Date.now(),
				user: 'Siz',
				isMe: true,
				message: chatMessage,
				time: new Date().toLocaleTimeString('uz-UZ', {
					hour: '2-digit',
					minute: '2-digit',
				}),
			},
		])
		setChatMessage('')
	}

	// Xabar kelganda silliq pastga tushish
	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollIntoView({ behavior: 'smooth' })
		}
	}, [messages])

	return (
		<div className='max-w-7xl mx-auto pb-4 w-full h-[calc(100vh-5rem)] flex flex-col'>
			{/* HEADER */}
			<div className='flex items-center gap-4 bg-card p-4 rounded-xl border shadow-sm mb-4 shrink-0'>
				<Button
					variant='ghost'
					size='icon'
					onClick={() => router.back()}
					className='rounded-full hover:bg-muted shrink-0'
				>
					<ArrowLeft className='h-5 w-5' />
				</Button>
				<div className='flex-1 min-w-0'>
					<div className='flex items-center gap-3'>
						<h1 className='text-xl sm:text-2xl font-bold tracking-tight truncate'>
							Frontend arxitekturasi asosi (React)
						</h1>
						<Badge className='bg-red-500 hover:bg-red-600 animate-pulse border-none text-white whitespace-nowrap shadow-none hidden sm:flex'>
							<Radio className='w-3 h-3 mr-1.5' /> Jonli efir
						</Badge>
					</div>
					<p className='text-muted-foreground text-sm mt-0.5 truncate'>
						Mentor: Javohir To'rayev • Mashg'ulot ID: {id}
					</p>
				</div>
			</div>

			{/* ASOSIY QISM */}
			<div className='flex-1 flex flex-col lg:flex-row gap-4 min-h-0'>
				{/* VIDEO PLAYER SECTION */}
				<div className='lg:flex-1 h-full flex flex-col min-h-[300px] lg:min-h-0 relative'>
					<Card className='shadow-sm overflow-hidden border-muted flex-1 bg-black flex flex-col'>
						<div className='flex-1 w-full flex flex-col items-center justify-center text-zinc-500 relative group'>
							<Video className='w-16 h-16 mb-4 opacity-30' />
							<p className='text-sm font-medium'>
								Dars hozirda davom etmoqda...
							</p>

							{/* Oynadagi statik ma'lumotlar */}
							<div className='absolute top-4 left-4 flex gap-2'>
								<Badge
									variant='outline'
									className='bg-black/50 text-white border-none backdrop-blur-md'
								>
									Jonli
								</Badge>
								<Badge
									variant='outline'
									className='bg-black/50 text-white border-none backdrop-blur-md flex items-center gap-1.5'
								>
									<Users className='w-3 h-3' /> 45 kishi ko'rmoqda
								</Badge>
							</div>
						</div>

						{/* Control bar placeholder */}
						<div className='h-12 bg-zinc-900/80 border-t border-zinc-800 shrink-0 flex items-center px-4'>
							<div className='flex items-center gap-4'>
								<PlayCircle className='w-5 h-5 text-zinc-400' />
								<div className='w-32 h-1 bg-zinc-700 rounded-full overflow-hidden'>
									<div className='w-1/3 h-full bg-primary' />
								</div>
							</div>
						</div>
					</Card>
				</div>

				{/* RIGHT SIDEBAR - CHAT & ATTENDEES */}
				<div className='lg:w-[350px] xl:w-[400px] h-[400px] lg:h-full shrink-0 flex flex-col'>
					<Card className='shadow-sm border-muted h-full flex flex-col overflow-hidden'>
						<Tabs defaultValue='chat' className='flex flex-col h-full w-full'>
							<div className='px-3 pt-3 pb-2 shrink-0'>
								<TabsList className='grid w-full grid-cols-2 bg-muted/50 rounded-lg h-10'>
									<TabsTrigger
										value='chat'
										className='rounded-md data-[state=active]:shadow-sm text-sm'
									>
										<MessageSquare className='w-4 h-4 mr-2' /> Chat
									</TabsTrigger>
									<TabsTrigger
										value='students'
										className='rounded-md data-[state=active]:shadow-sm text-sm'
									>
										<Users className='w-4 h-4 mr-2' /> Sinfdoshlar
									</TabsTrigger>
								</TabsList>
							</div>

							<TabsContent
								value='chat'
								className='flex-1 flex flex-col min-h-0 m-0 border-none outline-none data-[state=active]:flex'
							>
								<div className='flex-1 overflow-y-auto px-4 pb-4 hide-scrollbar'>
									<div className='space-y-4 pt-2'>
										{messages.map(msg => (
											<div
												key={msg.id}
												className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
											>
												<div
													className={`flex items-baseline gap-2 mb-1 ${msg.isMe ? 'flex-row-reverse' : ''}`}
												>
													<span
														className={`text-xs font-semibold ${msg.isMentor ? 'text-primary' : 'text-foreground'}`}
													>
														{msg.user}
													</span>
													<span className='text-[10px] text-muted-foreground'>
														{msg.time}
													</span>
												</div>
												<div
													className={`px-3 py-2.5 rounded-2xl max-w-[90%] text-[13px] leading-relaxed break-words ${msg.isMe || msg.isMentor ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted rounded-tl-sm'}`}
												>
													{msg.message}
												</div>
											</div>
										))}
										<div ref={scrollRef} className='h-1' />
									</div>
								</div>

								<div className='p-3 border-t bg-card/50 shrink-0'>
									<form
										onSubmit={handleSendMessage}
										className='flex gap-2 relative'
									>
										<Input
											placeholder='Xabar yozish...'
											className='pr-12 rounded-full bg-muted/30 border-transparent focus-visible:ring-primary/20 h-11 text-sm'
											value={chatMessage}
											onChange={e => setChatMessage(e.target.value)}
											autoComplete='off'
										/>
										<Button
											type='submit'
											size='icon'
											className='absolute right-1 top-1 h-9 w-9 rounded-full'
											disabled={!chatMessage.trim()}
										>
											<Send className='h-4 w-4 ml-0.5' />
										</Button>
									</form>
								</div>
							</TabsContent>

							<TabsContent
								value='students'
								className='flex-1 flex flex-col min-h-0 m-0 border-none outline-none data-[state=active]:flex'
							>
								<div className='px-4 py-2.5 border-b bg-muted/10 flex items-center justify-between shrink-0'>
									<span className='text-sm font-medium text-muted-foreground'>
										Sinfdoshlar:
									</span>
									<Badge variant='secondary' className='font-mono text-xs'>
										{MOCK_ATTENDEES.filter(a => a.status === 'online').length}{' '}
										onlayn
									</Badge>
								</div>

								<div className='flex-1 overflow-y-auto px-2 py-2 hide-scrollbar'>
									<div className='space-y-1'>
										{MOCK_ATTENDEES.map(student => (
											<div
												key={student.id}
												className='flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/50 transition-colors'
											>
												<div className='flex items-center gap-3'>
													<div className='relative'>
														<div className='w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm'>
															{student.name.charAt(0)}
														</div>
														<div
															className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-background ${student.status === 'online' ? 'bg-green-500' : 'bg-zinc-300'}`}
														/>
													</div>
													<div>
														<p className='text-sm font-medium leading-none mb-1'>
															{student.name}
														</p>
														<p className='text-[11px] text-muted-foreground'>
															{student.status === 'online'
																? 'Onlayn'
																: 'Oflayn'}
														</p>
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
							</TabsContent>
						</Tabs>
					</Card>
				</div>
			</div>
		</div>
	)
}
