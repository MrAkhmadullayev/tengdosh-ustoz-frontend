'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import {
	Hand,
	Layout,
	Maximize2,
	MessageSquare,
	Mic,
	MicOff,
	MoreVertical,
	PhoneOff,
	ScreenShare,
	Send,
	Settings,
	ShieldCheck,
	Smile,
	UserCircle,
	UserMinus,
	Users,
	Video as VideoIcon,
	VideoOff,
	VolumeX,
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const MOCK_PARTICIPANTS = [
	{
		id: 1,
		name: 'Madina Akramova',
		avatar: null,
		isMuted: true,
		hasVideo: false,
		handRaised: false,
	},
	{
		id: 2,
		name: 'Jasur Ahmedov',
		avatar: null,
		isMuted: false,
		hasVideo: true,
		handRaised: true,
	},
	{
		id: 3,
		name: 'Dilnoza Salimova',
		avatar: null,
		isMuted: true,
		hasVideo: false,
		handRaised: false,
	},
	{
		id: 4,
		name: "Otabek G'aniyev",
		avatar: null,
		isMuted: true,
		hasVideo: false,
		handRaised: false,
	},
	{
		id: 5,
		name: 'Sardor Rahimiv',
		avatar: null,
		isMuted: false,
		hasVideo: true,
		handRaised: false,
	},
]

export default function MentorBroadcastPage() {
	const router = useRouter()
	const params = useParams()
	const [isMuted, setIsMuted] = useState(false)
	const [isVideoOff, setIsVideoOff] = useState(false)
	const [isSharing, setIsSharing] = useState(false)
	const [showParticipants, setShowParticipants] = useState(true)
	const [messages, setMessages] = useState([
		{
			id: 1,
			user: 'Jasur Ahmedov',
			text: "Ustoz, ekranda kod ko'rinmayapti.",
			time: '10:05',
		},
		{
			id: 2,
			user: 'Madina Akramova',
			text: "Endi ko'rindi, rahmat!",
			time: '10:06',
		},
	])
	const [inputMessage, setInputMessage] = useState('')
	const scrollRef = useRef(null)

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTo({
				top: scrollRef.current.scrollHeight,
				behavior: 'smooth',
			})
		}
	}, [messages])

	const handleSendMessage = () => {
		if (!inputMessage.trim()) return
		setMessages([
			...messages,
			{
				id: Date.now(),
				user: 'Siz (Mentor)',
				text: inputMessage,
				time: new Date().toLocaleTimeString([], {
					hour: '2-digit',
					minute: '2-digit',
				}),
			},
		])
		setInputMessage('')
	}

	return (
		<div className='fixed inset-0 bg-[#1a1a1a] text-white flex flex-col z-50 overflow-hidden'>
			{/* TOP BAR */}
			<div className='h-14 px-6 flex items-center justify-between border-b border-white/10 shrink-0 bg-[#1a1a1a]'>
				<div className='flex items-center gap-3'>
					<Badge
						variant='outline'
						className='bg-red-500/10 text-red-500 border-red-500/20 px-3 py-1 animate-pulse font-bold'
					>
						JONLI EFIR
					</Badge>
					<h1 className='font-semibold text-white/90 truncate max-w-[300px]'>
						React Advanced: Performance Optimization
					</h1>
					<div className='flex items-center gap-2 ml-4 px-3 py-1 bg-white/5 rounded-full text-xs font-medium text-white/60'>
						<Users className='w-3.5 h-3.5' /> {MOCK_PARTICIPANTS.length} kishi
					</div>
				</div>
				<div className='flex items-center gap-4'>
					<Button
						variant='ghost'
						size='icon'
						className='text-white/60 hover:text-white hover:bg-white/10'
					>
						<Maximize2 className='w-5 h-5' />
					</Button>
					<Button
						variant='ghost'
						size='icon'
						className='text-white/60 hover:text-white hover:bg-white/10'
					>
						<Settings className='w-5 h-5' />
					</Button>
				</div>
			</div>

			{/* MAIN CONTENT AREA */}
			<div className='flex-1 flex overflow-hidden'>
				{/* VIDEO AREA */}
				<div className='flex-1 relative bg-black flex items-center justify-center p-4 overflow-hidden'>
					{isSharing ? (
						<div className='w-full h-full rounded-2xl bg-slate-900 flex flex-col items-center justify-center border-4 border-primary/20 animate-in zoom-in-95 duration-300'>
							<div className='relative w-full h-full flex items-center justify-center overflow-hidden'>
								<div className='absolute inset-0 bg-[url("https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=2070")] bg-cover opacity-20' />
								<div className='z-10 text-center space-y-4'>
									<div className='w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto text-primary animate-pulse'>
										<ScreenShare className='w-10 h-10' />
									</div>
									<h2 className='text-2xl font-bold'>
										Ekranni ulashish faol...
									</h2>
									<p className='text-white/40'>
										Talabalar sizning asosiy ekraningizni ko'rishmoqda.
									</p>
									<Button
										variant='destructive'
										className='rounded-xl'
										onClick={() => setIsSharing(false)}
									>
										Ulashishni to'xtatish
									</Button>
								</div>
							</div>
						</div>
					) : (
						<div className='w-full h-full max-w-5xl aspect-video rounded-3xl bg-neutral-900 relative shadow-2xl overflow-hidden'>
							{isVideoOff ? (
								<div className='absolute inset-0 flex items-center justify-center flex-col gap-4 text-white/20 bg-neutral-900'>
									<Avatar className='h-32 w-32 border-4 border-white/5 shadow-2xl'>
										<AvatarFallback className='bg-primary/10 text-primary text-4xl font-bold'>
											JT
										</AvatarFallback>
									</Avatar>
									<p className='font-medium'>Kamera o'chirilgan</p>
								</div>
							) : (
								<div className='absolute inset-0 bg-neutral-800 flex items-center justify-center group pointer-events-none'>
									<div className='absolute inset-0 bg-[url("https://images.unsplash.com/photo-1544161515-4af6b1d462c2?auto=format&fit=crop&q=80&w=2070")] bg-cover' />
									<div className='absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all' />
									<VideoIcon className='w-20 h-20 text-white/10 group-hover:scale-110 transition-transform duration-500' />
								</div>
							)}

							{/* Self view overlay */}
							<div className='absolute bottom-6 right-6 w-48 aspect-video rounded-xl overflow-hidden bg-neutral-800 border-2 border-white/20 shadow-2xl z-20 group cursor-pointer hover:scale-105 transition-transform'>
								<div className='absolute inset-0 bg-black/40' />
								<div className='absolute inset-0 flex items-center justify-center'>
									<UserCircle className='w-8 h-8 text-white/20' />
								</div>
								<div className='absolute bottom-2 left-2 text-[10px] bg-black/60 px-1.5 py-0.5 rounded text-white/80 flex items-center gap-1.5'>
									{isMuted ? (
										<MicOff className='w-2.5 h-2.5 text-red-500' />
									) : (
										<Mic className='w-2.5 h-2.5' />
									)}
									Siz (Mentor)
								</div>
							</div>
						</div>
					)}
				</div>

				{/* SIDEBAR */}
				{showParticipants && (
					<div className='w-[380px] border-l border-white/10 shrink-0 flex flex-col bg-[#1a1a1a] animate-in slide-in-from-right duration-300'>
						<Tabs defaultValue='chat' className='flex-1 flex flex-col min-h-0'>
							<TabsList className='bg-transparent border-b border-white/5 h-14 w-full rounded-none px-4 justify-start gap-4'>
								<TabsTrigger
									value='chat'
									className='bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-14 px-2 gap-2 text-white/50'
								>
									<MessageSquare className='w-4 h-4' />
									<span className='font-bold text-sm'>Chat</span>
									<Badge className='ml-1 h-5 min-w-[20px] px-1 bg-primary text-white text-[10px]'>
										3
									</Badge>
								</TabsTrigger>
								<TabsTrigger
									value='participants'
									className='bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-14 px-2 gap-2 text-white/50'
								>
									<Users className='w-4 h-4' />
									<span className='font-bold text-sm'>Talabalar</span>
								</TabsTrigger>
							</TabsList>

							<TabsContent
								value='chat'
								className='flex-1 flex flex-col min-h-0 m-0'
							>
								<ScrollArea className='flex-1 px-4' viewportRef={scrollRef}>
									<div className='py-6 space-y-6'>
										<div className='text-center'>
											<p className='text-[10px] text-white/20 uppercase tracking-widest font-bold bg-white/5 py-1 px-3 rounded-full inline-block'>
												Dars boshlandi
											</p>
										</div>
										{messages.map(msg => (
											<div
												key={msg.id}
												className={cn(
													'flex flex-col gap-1',
													msg.user.includes('Siz')
														? 'items-end'
														: 'items-start',
												)}
											>
												<div className='flex items-baseline gap-2'>
													<span className='text-xs font-bold text-white/40'>
														{msg.user}
													</span>
													<span className='text-[10px] text-white/20'>
														{msg.time}
													</span>
												</div>
												<div
													className={cn(
														'px-4 py-2.5 rounded-2xl text-sm max-w-[85%] break-words shadow-sm',
														msg.user.includes('Siz')
															? 'bg-primary text-white rounded-tr-none'
															: 'bg-white/5 text-white/90 rounded-tl-none border border-white/5',
													)}
												>
													{msg.text}
												</div>
											</div>
										))}
									</div>
								</ScrollArea>

								<div className='p-4 border-t border-white/10 space-y-3 bg-[#1e1e1e]'>
									<div className='flex gap-2 mb-1'>
										<Button
											variant='ghost'
											size='icon'
											className='h-8 w-8 rounded-full text-white/20 hover:text-white hover:bg-white/10'
										>
											<Smile className='w-4 h-4' />
										</Button>
										<Button
											variant='ghost'
											size='icon'
											className='h-8 w-8 rounded-full text-white/20 hover:text-white hover:bg-white/10'
										>
											<Hand className='w-4 h-4' />
										</Button>
									</div>
									<div className='flex gap-2 relative'>
										<Input
											placeholder='Xabar yozing...'
											className='bg-white/5 border-transparent focus-visible:ring-primary/20 rounded-xl h-12 pr-12 text-white/90'
											value={inputMessage}
											onChange={e => setInputMessage(e.target.value)}
											onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
										/>
										<Button
											size='icon'
											className='h-10 w-10 rounded-lg absolute right-1 top-1'
											onClick={handleSendMessage}
										>
											<Send className='w-4 h-4 fill-current' />
										</Button>
									</div>
								</div>
							</TabsContent>

							<TabsContent
								value='participants'
								className='flex-1 flex flex-col min-h-0 m-0'
							>
								<div className='p-4 border-b border-white/5 flex justify-between items-center bg-white/2'>
									<span className='text-sm font-bold text-white/40 uppercase tracking-tight'>
										Hammasi ({MOCK_PARTICIPANTS.length})
									</span>
									<Button
										variant='ghost'
										size='sm'
										className='h-8 text-xs font-bold gap-2 text-primary hover:text-primary/80 hover:bg-primary/10'
									>
										<VolumeX className='w-3.5 h-3.5' /> Hammani o'chirish
									</Button>
								</div>
								<ScrollArea className='flex-1 p-4'>
									<div className='space-y-4'>
										{MOCK_PARTICIPANTS.map(participant => (
											<div
												key={participant.id}
												className='flex items-center justify-between group hover:bg-white/5 p-2 rounded-xl transition-colors'
											>
												<div className='flex items-center gap-3'>
													<div className='relative'>
														<Avatar className='h-8 w-8 border border-white/10'>
															<AvatarFallback className='bg-white/5 text-[10px] text-white/60'>
																{participant.name
																	.split(' ')
																	.map(n => n[0])
																	.join('')}
															</AvatarFallback>
														</Avatar>
														{participant.handRaised && (
															<div className='absolute -top-1 -right-1 bg-yellow-500 rounded-full p-0.5 shadow-lg border border-[#1a1a1a]'>
																<Hand className='w-2.5 h-2.5 text-black' />
															</div>
														)}
													</div>
													<div className='flex flex-col'>
														<span className='text-sm font-medium text-white/80'>
															{participant.name}
														</span>
														{participant.handRaised && (
															<span className='text-[10px] text-yellow-500 font-bold'>
																Qo'l ko'tardi
															</span>
														)}
													</div>
												</div>
												<div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
													<Button
														variant='ghost'
														size='icon'
														className='h-8 w-8 rounded-full text-white/30 hover:text-red-500'
													>
														<MicOff className='w-4 h-4' />
													</Button>
													<Button
														variant='ghost'
														size='icon'
														className='h-8 w-8 rounded-full text-white/30 hover:text-red-500'
													>
														<UserMinus className='w-4 h-4' />
													</Button>
												</div>
											</div>
										))}
									</div>
								</ScrollArea>
								<div className='p-4 border-t border-white/10'>
									<Button
										className='w-full rounded-xl gap-2 h-11 bg-white/5 hover:bg-white/10 text-white/80'
										variant='ghost'
									>
										<Hand className='w-4 h-4' /> Ruxsat so'rovlarini ko'rish
									</Button>
								</div>
							</TabsContent>
						</Tabs>
					</div>
				)}
			</div>

			{/* BOTTOM TOOLBAR */}
			<div className='h-24 px-6 shrink-0 bg-[#1a1a1a] border-t border-white/10 flex items-center justify-center relative'>
				{/* Controls */}
				<div className='flex items-center gap-4'>
					<div className='flex flex-col items-center gap-1.5'>
						<Button
							size='icon'
							className={cn(
								'h-14 w-14 rounded-2xl transition-all duration-300 shadow-lg',
								isMuted
									? 'bg-red-500 hover:bg-red-600'
									: 'bg-[#333333] hover:bg-[#444444]',
							)}
							onClick={() => setIsMuted(!isMuted)}
						>
							{isMuted ? (
								<MicOff className='w-6 h-6' />
							) : (
								<Mic className='w-6 h-6' />
							)}
						</Button>
						<span className='text-[10px] font-bold text-white/40 uppercase'>
							{isMuted ? 'Mute' : 'Mic'}
						</span>
					</div>

					<div className='flex flex-col items-center gap-1.5'>
						<Button
							size='icon'
							className={cn(
								'h-14 w-14 rounded-2xl transition-all duration-300 shadow-lg',
								isVideoOff
									? 'bg-red-500 hover:bg-red-600'
									: 'bg-[#333333] hover:bg-[#444444]',
							)}
							onClick={() => setIsVideoOff(!isVideoOff)}
						>
							{isVideoOff ? (
								<VideoOff className='w-6 h-6' />
							) : (
								<VideoIcon className='w-6 h-6' />
							)}
						</Button>
						<span className='text-[10px] font-bold text-white/40 uppercase'>
							Video
						</span>
					</div>

					<div className='flex flex-col items-center gap-1.5'>
						<Button
							size='icon'
							className={cn(
								'h-14 w-14 rounded-2xl transition-all duration-300 shadow-lg bg-[#333333] hover:bg-[#444444]',
								isSharing &&
									'bg-primary text-white scale-110 shadow-primary/20',
							)}
							onClick={() => setIsSharing(!isSharing)}
						>
							<ScreenShare className='w-6 h-6' />
						</Button>
						<span className='text-[10px] font-bold text-white/40 uppercase'>
							Ulashish
						</span>
					</div>

					<div className='flex flex-col items-center gap-1.5'>
						<Button
							size='icon'
							className={cn(
								'h-14 w-14 rounded-2xl transition-all duration-300 shadow-lg',
								showParticipants
									? 'bg-primary text-white'
									: 'bg-[#333333] hover:bg-[#444444]',
							)}
							onClick={() => setShowParticipants(!showParticipants)}
						>
							<Users className='w-6 h-6' />
						</Button>
						<span className='text-[10px] font-bold text-white/40 uppercase tracking-tighter'>
							Talabalar
						</span>
					</div>

					<div className='flex flex-col items-center gap-1.5'>
						<Button
							size='icon'
							className='h-14 w-14 rounded-2xl bg-red-500 hover:bg-red-600 transition-all duration-300 shadow-red-500/20 shadow-lg group'
							onClick={() => router.push('/mentor/schedule')}
						>
							<PhoneOff className='w-6 h-6 group-hover:scale-110' />
						</Button>
						<span className='text-[10px] font-bold text-red-500/80 uppercase'>
							Yakunlash
						</span>
					</div>
				</div>

				{/* Right Utils */}
				<div className='absolute right-8 flex items-center gap-4'>
					<div className='hidden xl:flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-xl border border-green-500/20'>
						<ShieldCheck className='w-4 h-4 text-green-500' />
						<span className='text-xs font-bold text-green-500 uppercase tracking-tight'>
							Tizim Himoyalangan
						</span>
					</div>
					<Button
						variant='ghost'
						size='icon'
						className='text-white/40 hover:text-white hover:bg-white/10 rounded-xl'
					>
						<Layout className='w-6 h-6' />
					</Button>
					<Button
						variant='ghost'
						size='icon'
						className='text-white/40 hover:text-white hover:bg-white/10 rounded-xl'
					>
						<MoreVertical className='w-6 h-6' />
					</Button>
				</div>
			</div>
		</div>
	)
}
