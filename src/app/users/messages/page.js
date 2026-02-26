'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
	AlertTriangle,
	ArrowLeft,
	MessageSquare,
	Paperclip,
	Search,
	Send,
	User,
	UserPlus,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

// Tizim xabarlari (Mock)
const SYSTEM_MESSAGES = {
	admin: [
		{
			id: 'sys-1',
			type: 'complaint',
			sender: 'Sardor Rahmatov',
			role: 'student',
			text: "Platformada to'lovni amalga oshirishda xatolik yuz bermoqda. Menga yordam bering.",
			time: '10:30',
			isRead: false,
			chatHistory: [
				{
					id: 1,
					sender: 'Sardor Rahmatov',
					text: "Platformada to'lovni amalga oshirishda xatolik yuz bermoqda. Menga yordam bering.",
					time: '10:30',
					isMe: false,
				},
			],
		},
		{
			id: 'sys-2',
			type: 'connection',
			sender: 'Malika Botirova',
			role: 'mentor',
			text: "Yangi kursimni tasdiqlashingizni so'rayman. Materiallar yuklandi.",
			time: 'Kecha',
			isRead: true,
			chatHistory: [
				{
					id: 1,
					sender: 'Malika Botirova',
					text: "Yangi kursimni tasdiqlashingizni so'rayman. Materiallar yuklandi.",
					time: 'Kecha',
					isMe: false,
				},
			],
		},
		{
			id: 'sys-3',
			type: 'general',
			sender: 'Tizim xabarnomasi',
			role: 'system',
			text: 'Yangi 1.4 versiyasi muvaffaqiyatli serverga yuklandi.',
			time: '2 kun oldin',
			isRead: true,
			chatHistory: [
				{
					id: 1,
					sender: 'Tizim xabarnomasi',
					text: 'Yangi 1.4 versiyasi muvaffaqiyatli serverga yuklandi.',
					time: '2 kun oldin',
					isMe: false,
				},
			],
		},
	],
	student: [
		{
			id: 'sys-admin',
			type: 'general',
			sender: 'Tizim Admini',
			role: 'admin',
			text: "Profil tasdiqlandi. Savollaringiz bo'lsa yozishingiz mumkin.",
			time: '09:00',
			isRead: true,
			chatHistory: [
				{
					id: 1,
					sender: 'Tizim Admini',
					text: "Profil tasdiqlandi. Savollaringiz bo'lsa yozishingiz mumkin.",
					time: '09:00',
					isMe: false,
				},
			],
		},
	],
	mentor: [
		{
			id: 'sys-admin',
			type: 'connection',
			sender: 'Platforma Admini',
			role: 'admin',
			text: 'Assalomu alaykum. Yangi kursingiz yuzasidan barcha materiallar tasdiqlandi. Ishingizga muvaffaqiyat!',
			time: '10:00',
			isRead: false,
			chatHistory: [
				{
					id: 1,
					sender: 'Platforma Admini',
					text: 'Assalomu alaykum. Yangi kursingiz yuzasidan barcha materiallar tasdiqlandi. Ishingizga muvaffaqiyat!',
					time: '10:00',
					isMe: false,
				},
				{
					id: 2,
					sender: 'me',
					text: 'Rahmat! Tez orada darslarni boshlaymiz.',
					time: '10:05',
					isMe: true,
				},
			],
		},
	],
}

// Kontakt chatlari (Mock)
const INITIAL_CONTACTS_DATA = [
	{
		id: 'c-1',
		type: 'mentor',
		name: 'Rustam Qosimov',
		specialty: 'JavaScript Mentor',
		lastMessage: "Xo'p, darslarni ertaga boshlaymiz.",
		time: '11:20',
		isRead: false,
		chatHistory: [
			{
				id: 1,
				sender: 'me',
				text: "Salom ustoz, darslarni qachon boshlasak bo'ladi?",
				time: '11:00',
				isMe: true,
			},
			{
				id: 2,
				sender: 'Rustam Qosimov',
				text: "Xo'p, darslarni ertaga boshlaymiz.",
				time: '11:20',
				isMe: false,
			},
		],
	},
	{
		id: 'c-2',
		type: 'mentor',
		name: 'Akmal Turgun',
		specialty: 'Python Mentor',
		lastMessage: 'Vazifani tekshirib yuboring.',
		time: 'Kecha',
		isRead: true,
		chatHistory: [
			{
				id: 1,
				sender: 'Akmal Turgun',
				text: 'Vazifani tekshirib yuboring.',
				time: 'Kecha',
				isMe: false,
			},
		],
	},
	{
		id: 'c-3',
		type: 'student',
		name: 'Olim Gafurov',
		specialty: 'Frontend Talaba',
		lastMessage: "Rahmat ustoz, hammasi tushunarli bo'ldi.",
		time: '09:15',
		isRead: true,
		chatHistory: [
			{
				id: 1,
				sender: 'Olim Gafurov',
				text: "Rahmat ustoz, hammasi tushunarli bo'ldi.",
				time: '09:15',
				isMe: false,
			},
		],
	},
	{
		id: 'c-4',
		type: 'student',
		name: 'Dilnoza Salimova',
		specialty: 'UX/UI Dizayn Talabasi',
		lastMessage: "Ustoz, 5-dars bo'yicha savolim bor edi.",
		time: '14:20',
		isRead: false,
		chatHistory: [
			{
				id: 1,
				sender: 'Dilnoza Salimova',
				text: "Ustoz, 5-dars bo'yicha savolim bor edi.",
				time: '14:20',
				isMe: false,
			},
		],
	},
]

export default function MessagesPage() {
	const [userRole, setUserRole] = useState('student')
	const [contactsData, setContactsData] = useState(INITIAL_CONTACTS_DATA)
	const [systemData, setSystemData] = useState(SYSTEM_MESSAGES)
	const [mainTab, setMainTab] = useState('system')
	const [sysTab, setSysTab] = useState('all')
	const [contactTab, setContactTab] = useState('mentor')
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedMessageId, setSelectedMessageId] = useState(null)
	const [replyText, setReplyText] = useState('')

	// Chat oxiriga tushish uchun ref
	const messagesEndRef = useRef(null)

	useEffect(() => {
		const savedRole = sessionStorage.getItem('userRole') || 'student'
		setUserRole(savedRole)

		// Agar mentor bo'lsa, birinchi tab tizim (Admin) bo'lishi kerak
		if (savedRole === 'mentor') {
			setMainTab('system')
			setContactTab('student')
		}
	}, [])

	const currentSystemMessages = systemData[userRole] || []

	const filteredSystemMessages = currentSystemMessages.filter(msg => {
		// Mentor uchun filtratsiya shart emas, chunki faqat Admin chatlari chiqadi
		if (userRole === 'mentor') {
			return (
				msg.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
				msg.text.toLowerCase().includes(searchQuery.toLowerCase())
			)
		}
		const matchesTab = sysTab === 'all' || msg.type === sysTab
		const matchesSearch =
			msg.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
			msg.text.toLowerCase().includes(searchQuery.toLowerCase())
		return matchesTab && matchesSearch
	})

	const filteredContacts = contactsData.filter(c => {
		const matchesTab = c.type === contactTab
		const matchesSearch = c.name
			.toLowerCase()
			.includes(searchQuery.toLowerCase())
		return matchesTab && matchesSearch
	})

	const selectedSystemMsg = currentSystemMessages.find(
		m => m.id === selectedMessageId,
	)
	const selectedContactChat = contactsData.find(c => c.id === selectedMessageId)

	// Xabar yozilganda pastga scroll qilish
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [selectedContactChat?.chatHistory, selectedSystemMsg?.chatHistory])

	const handleSendMessage = () => {
		if (!replyText.trim() && !selectedContactChat && !selectedSystemMsg) return

		const newMessageTime = new Date().toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit',
		})

		// 1-Hozir Kontakt chati faol bo'lsa:
		if (selectedContactChat) {
			const newMessage = {
				id: Date.now(),
				sender: 'me',
				text: replyText.trim(),
				time: newMessageTime,
				isMe: true,
			}

			setContactsData(prev =>
				prev.map(contact =>
					contact.id === selectedContactChat.id
						? {
								...contact,
								lastMessage: replyText,
								time: newMessage.time,
								chatHistory: [...contact.chatHistory, newMessage],
								isRead: true,
							}
						: contact,
				),
			)
		}
		// 2-Hozir Tizim (System) chati faol bo'lsa:
		else if (selectedSystemMsg) {
			const newMessage = {
				id: Date.now().toString(),
				sender: 'me',
				text: replyText.trim(),
				time: newMessageTime,
				isMe: true,
			}

			setSystemData(prev => {
				const currentArr = prev[userRole] || []
				return {
					...prev,
					[userRole]: currentArr.map(msg =>
						msg.id === selectedSystemMsg.id
							? {
									...msg,
									chatHistory: [...(msg.chatHistory || []), newMessage],
									text: replyText.trim(),
								}
							: msg,
					),
				}
			})
		}

		setReplyText('')
	}

	const handleKeyDown = e => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			handleSendMessage()
		}
	}

	const handleMainTabChange = val => {
		setMainTab(val)
		setSelectedMessageId(null)
		setSearchQuery('')
	}

	// Dinamik ikonka va badgelar funksiyalari (qisqartirildi)
	const getIcon = type =>
		type === 'complaint' ? (
			<AlertTriangle className='h-4 w-4 text-red-500' />
		) : type === 'connection' ? (
			<UserPlus className='h-4 w-4 text-blue-500' />
		) : (
			<MessageSquare className='h-4 w-4 text-green-500' />
		)
	const getBadge = type =>
		type === 'complaint'
			? 'bg-red-500/10 text-red-600'
			: type === 'connection'
				? 'bg-blue-500/10 text-blue-600'
				: 'bg-green-500/10 text-green-600'
	const getLabel = type =>
		type === 'complaint'
			? 'Shikoyat'
			: type === 'connection'
				? "So'rov"
				: 'Umumiy'

	// Ekranda chat ochiqmi? (Mobil versiya uchun)
	const isChatOpen = selectedMessageId !== null

	return (
		<div className='flex flex-col h-[calc(100vh-6rem)] w-full overflow-hidden max-w-7xl mx-auto pb-4'>
			{/* HEADER SECTION */}
			<div className='shrink-0 mb-4 flex flex-col md:flex-row md:items-end justify-between gap-4'>
				<div>
					<h1 className='text-2xl sm:text-3xl font-bold tracking-tight text-foreground'>
						Xabarlar
					</h1>
					<p className='text-muted-foreground mt-1 text-sm'>
						Tizim va foydalanuvchilar o'rtasidagi yozishmalar.
					</p>
				</div>
				<Tabs
					value={mainTab}
					onValueChange={handleMainTabChange}
					className='w-full md:w-[480px]'
				>
					<TabsList className='grid w-full grid-cols-2 h-10 bg-muted/50'>
						<TabsTrigger value='system' className='font-medium text-sm'>
							{userRole === 'mentor' ? 'Admin bilan suhbat' : 'Tizim'}
						</TabsTrigger>
						<TabsTrigger value='contacts' className='font-medium text-sm'>
							{userRole === 'mentor'
								? "O'quvchilar va Mentorlar"
								: 'Kontaktlar'}
						</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			<Card className='flex-1 flex flex-col md:flex-row overflow-hidden border-muted/60 shadow-sm bg-background relative'>
				{/* CHAP TOMON: RO'YXAT (List Sidebar) */}
				{/* Mobil ekranda agar chat ochiq bo'lsa, bu qism yashiriladi */}
				<div
					className={`w-full md:w-80 lg:w-[350px] border-r bg-card flex-col flex-shrink-0 ${isChatOpen ? 'hidden md:flex' : 'flex'}`}
				>
					<div className='p-4 border-b space-y-4 shrink-0'>
						<div className='relative'>
							<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
							<Input
								placeholder='Izlash...'
								className='pl-9 bg-muted/30 h-10 rounded-full'
								value={searchQuery}
								onChange={e => setSearchQuery(e.target.value)}
							/>
						</div>

						{mainTab === 'system' ? (
							userRole === 'admin' ? (
								<Tabs
									value={sysTab}
									onValueChange={setSysTab}
									className='w-full'
								>
									<TabsList className='grid w-full grid-cols-4 h-9 bg-muted/30 p-1'>
										<TabsTrigger value='all' className='text-[10px] md:text-xs'>
											Barchasi
										</TabsTrigger>
										<TabsTrigger
											value='general'
											className='text-[10px] md:text-xs'
										>
											Umumiy
										</TabsTrigger>
										<TabsTrigger
											value='complaint'
											className='text-[10px] md:text-xs'
										>
											Shikoyat
										</TabsTrigger>
										<TabsTrigger
											value='connection'
											className='text-[10px] md:text-xs'
										>
											So'rov
										</TabsTrigger>
									</TabsList>
								</Tabs>
							) : (
								<div className='h-9 flex items-center px-1 text-xs font-bold text-muted-foreground uppercase tracking-wider'>
									Adminstratsiya chati
								</div>
							)
						) : (
							<Tabs
								value={contactTab}
								onValueChange={setContactTab}
								className='w-full'
							>
								<TabsList className='grid w-full grid-cols-2 h-9 bg-muted/30 p-1'>
									<TabsTrigger value='mentor' className='text-xs'>
										Mentorlar
									</TabsTrigger>
									<TabsTrigger value='student' className='text-xs'>
										Studentlar
									</TabsTrigger>
								</TabsList>
							</Tabs>
						)}
					</div>

					<div className='flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar'>
						{/* TIZIM XABARLARI */}
						{mainTab === 'system' &&
							(filteredSystemMessages.length > 0 ? (
								<div className='divide-y divide-border/50'>
									{filteredSystemMessages.map(msg => (
										<button
											key={msg.id}
											onClick={() => setSelectedMessageId(msg.id)}
											className={`w-full text-left p-4 hover:bg-muted/40 transition-colors flex gap-3 ${selectedMessageId === msg.id ? 'bg-muted/60 border-l-2 border-l-primary' : 'border-l-2 border-l-transparent'}`}
										>
											<div className='relative shrink-0'>
												<Avatar className='h-10 w-10 border border-background shadow-sm'>
													<AvatarFallback className='bg-primary/10 text-primary font-bold text-xs'>
														{msg.sender.substring(0, 2).toUpperCase()}
													</AvatarFallback>
												</Avatar>
												{!msg.isRead && (
													<span className='absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-blue-500 animate-pulse'></span>
												)}
											</div>
											<div className='flex-1 min-w-0'>
												<div className='flex justify-between items-center mb-1'>
													<h4
														className={`text-sm truncate pr-2 ${!msg.isRead ? 'font-bold text-foreground' : 'font-medium text-foreground/80'}`}
													>
														{msg.sender}
													</h4>
													<span className='text-[10px] text-muted-foreground shrink-0'>
														{msg.time}
													</span>
												</div>
												<div className='flex items-center gap-1.5 mb-1.5'>
													{userRole === 'admin' && getIcon(msg.type)}
													<p className='text-xs truncate text-muted-foreground'>
														{msg.text}
													</p>
												</div>
												{userRole === 'admin' && (
													<Badge
														variant='secondary'
														className={`${getBadge(msg.type)} hover:${getBadge(msg.type)} border-none px-2 py-0 text-[10px] font-medium`}
													>
														{getLabel(msg.type)}
													</Badge>
												)}
											</div>
										</button>
									))}
								</div>
							) : (
								<div className='flex flex-col items-center justify-center h-full p-6 text-center text-muted-foreground'>
									<MessageSquare className='h-10 w-10 mb-3 opacity-20' />
									<p className='text-sm'>Xabarlar topilmadi.</p>
								</div>
							))}
						{/* KONTAKT XABARLARI */}
						{mainTab === 'contacts' &&
							(filteredContacts.length > 0 ? (
								<div className='divide-y divide-border/50'>
									{filteredContacts.map(contact => (
										<button
											key={contact.id}
											onClick={() => setSelectedMessageId(contact.id)}
											className={`w-full text-left p-4 hover:bg-muted/40 transition-colors flex gap-3 ${selectedMessageId === contact.id ? 'bg-muted/60 border-l-2 border-l-primary' : 'border-l-2 border-l-transparent'}`}
										>
											<div className='relative shrink-0'>
												<Avatar className='h-10 w-10 border border-background shadow-sm'>
													<AvatarFallback className='bg-primary/10 text-primary font-bold text-xs'>
														{contact.name.substring(0, 2).toUpperCase()}
													</AvatarFallback>
												</Avatar>
												{!contact.isRead && (
													<span className='absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-blue-500 animate-pulse'></span>
												)}
											</div>
											<div className='flex-1 min-w-0'>
												<div className='flex justify-between items-center mb-1'>
													<h4
														className={`text-sm truncate pr-2 ${!contact.isRead ? 'font-bold text-foreground' : 'font-medium text-foreground/80'}`}
													>
														{contact.name}
													</h4>
													<span className='text-[10px] text-muted-foreground shrink-0'>
														{contact.time}
													</span>
												</div>
												<p
													className={`text-xs truncate ${!contact.isRead ? 'text-foreground font-medium' : 'text-muted-foreground'}`}
												>
													{contact.lastMessage}
												</p>
											</div>
										</button>
									))}
								</div>
							) : (
								<div className='flex flex-col items-center justify-center h-full p-6 text-center text-muted-foreground'>
									<User className='h-10 w-10 mb-3 opacity-20' />
									<p className='text-sm'>Kontaktlar topilmadi.</p>
								</div>
							))}
					</div>
				</div>

				{/* O'NG TOMON: CHAT XONASI (View Panel) */}
				{/* Mobil ekranda agar chat ochiq bo'lmasa, bu qism yashiriladi */}
				<div
					className={`flex-1 flex-col h-full bg-slate-50/30 dark:bg-background/50 ${isChatOpen ? 'flex' : 'hidden md:flex'}`}
				>
					{/* TIZIM XABARINI KO'RISH */}
					{mainTab === 'system' && selectedSystemMsg && (
						<div className='flex flex-col h-full overflow-hidden'>
							<div className='p-4 border-b bg-card flex items-center gap-3 shadow-sm shrink-0'>
								<Button
									variant='ghost'
									size='icon'
									className='md:hidden shrink-0 -ml-2'
									onClick={() => setSelectedMessageId(null)}
								>
									<ArrowLeft className='h-5 w-5' />
								</Button>
								<Avatar className='h-10 w-10 border shadow-sm shrink-0'>
									<AvatarFallback className='bg-primary/10 text-primary font-bold text-xs'>
										{selectedSystemMsg.sender.substring(0, 2).toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<div className='flex-1 min-w-0'>
									<h3 className='font-bold text-sm truncate'>
										{selectedSystemMsg.sender}
									</h3>
									<p className='text-xs text-muted-foreground capitalize truncate'>
										Rol: {selectedSystemMsg.role}
									</p>
								</div>
								<Badge
									variant='secondary'
									className={`${getBadge(selectedSystemMsg.type)} border-none shadow-none hidden sm:inline-flex shrink-0`}
								>
									{getLabel(selectedSystemMsg.type)}
								</Badge>
							</div>

							<div className='flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-900/10 hide-scrollbar flex flex-col gap-4'>
								<div className='max-w-2xl mx-auto space-y-4 w-full'>
									<div className='text-center my-2 sticky top-0 z-10'>
										<span className='text-[10px] font-medium bg-muted/80 backdrop-blur-sm text-muted-foreground px-3 py-1 rounded-full shadow-sm'>
											Yaratilgan sana
										</span>
									</div>

									{(selectedSystemMsg.chatHistory || []).map((chat, idx) => (
										<div
											key={chat.id || idx}
											className={`flex w-full ${chat.isMe ? 'justify-end' : 'justify-start'}`}
										>
											{/* System Message context block for the first message OR general alignment */}
											<div
												className={`flex gap-3 max-w-[85%] sm:max-w-[70%] ${chat.isMe ? 'flex-row-reverse' : ''}`}
											>
												{!chat.isMe && idx === 0 && (
													<Avatar className='h-8 w-8 shrink-0 mt-1 hidden sm:block'>
														<AvatarFallback className='bg-primary/10 text-primary text-[10px] font-bold'>
															{selectedSystemMsg.sender
																.substring(0, 2)
																.toUpperCase()}
														</AvatarFallback>
													</Avatar>
												)}

												<div
													className={`flex flex-col ${chat.isMe ? 'items-end' : 'items-start'} w-full`}
												>
													<div
														className={`p-4 text-[15px] leading-relaxed break-words shadow-sm rounded-2xl w-full
															${
																chat.isMe
																	? 'bg-primary text-primary-foreground rounded-br-sm'
																	: 'bg-background border rounded-bl-sm text-foreground'
															}`}
													>
														{!chat.isMe &&
															idx === 0 &&
															selectedSystemMsg.type === 'complaint' && (
																<div className='flex items-center gap-2 mb-3 text-red-600 font-bold bg-red-500/10 p-2.5 rounded-lg text-xs'>
																	<AlertTriangle className='h-4 w-4 shrink-0' />{' '}
																	Foydalanuvchi shikoyati:
																</div>
															)}

														{!chat.isMe &&
															idx === 0 &&
															selectedSystemMsg.type === 'connection' && (
																<div className='flex items-center gap-2 mb-3 text-blue-600 font-bold bg-blue-500/10 p-2.5 rounded-lg text-xs'>
																	<UserPlus className='h-4 w-4 shrink-0' />{' '}
																	So'rov yoki Ariza:
																</div>
															)}

														{chat.text}
													</div>

													<span className='text-[10px] text-muted-foreground mt-1 px-1 font-medium'>
														{chat.time} {chat.isMe && '✓✓'}
													</span>
												</div>
											</div>
										</div>
									))}
								</div>
								{/* Auto-scroll element */}
								<div ref={messagesEndRef} />
							</div>

							<div className='p-3 sm:p-4 border-t bg-card shrink-0 flex items-end gap-2'>
								<Button
									type='button'
									variant='ghost'
									size='icon'
									className='h-[50px] w-[50px] rounded-xl shrink-0 text-muted-foreground'
								>
									<Paperclip className='h-5 w-5' />
								</Button>
								<div className='flex-1 flex items-end gap-2'>
									<Textarea
										value={replyText}
										onChange={e => setReplyText(e.target.value)}
										onKeyDown={handleKeyDown}
										placeholder={
											userRole === 'admin'
												? 'Admin sifatida javob yozing...'
												: 'Adminga xabar yozing...'
										}
										className='min-h-[50px] max-h-[120px] resize-none text-[15px] bg-muted/30 focus-visible:bg-background rounded-xl w-full'
									/>
									<Button
										size='icon'
										onClick={handleSendMessage}
										disabled={!replyText.trim()}
										className={`h-[50px] w-[50px] rounded-xl shrink-0 transition-all ${replyText.trim() ? 'bg-primary' : 'bg-muted text-muted-foreground'}`}
									>
										<Send className='h-5 w-5 ml-0.5' />
									</Button>
								</div>
							</div>
						</div>
					)}

					{/* KONTAKT CHATINI KO'RISH */}
					{mainTab === 'contacts' && selectedContactChat && (
						<div className='flex flex-col h-full overflow-hidden'>
							<div className='p-4 border-b bg-card flex items-center gap-3 shadow-sm shrink-0'>
								<Button
									variant='ghost'
									size='icon'
									className='md:hidden shrink-0 -ml-2'
									onClick={() => setSelectedMessageId(null)}
								>
									<ArrowLeft className='h-5 w-5' />
								</Button>
								<Avatar className='h-10 w-10 border shadow-sm shrink-0'>
									<AvatarFallback className='bg-primary/10 text-primary font-bold text-xs'>
										{selectedContactChat.name.substring(0, 2).toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<div className='flex-1 min-w-0'>
									<h3 className='font-bold text-sm truncate'>
										{selectedContactChat.name}
									</h3>
									<p className='text-[11px] text-green-500 font-medium flex items-center gap-1.5 mt-0.5'>
										<span className='h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse'></span>{' '}
										Hozir onlayn
									</p>
								</div>
							</div>

							<div className='flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-900/10 hide-scrollbar flex flex-col gap-4'>
								<div className='text-center my-2 sticky top-0 z-10'>
									<span className='text-[10px] font-medium bg-muted/80 backdrop-blur-sm text-muted-foreground px-3 py-1 rounded-full shadow-sm'>
										Bugun
									</span>
								</div>

								{selectedContactChat.chatHistory.map(chat => (
									<div
										key={chat.id}
										className={`flex w-full ${chat.isMe ? 'justify-end' : 'justify-start'}`}
									>
										<div
											className={`flex flex-col max-w-[85%] sm:max-w-[70%] ${chat.isMe ? 'items-end' : 'items-start'}`}
										>
											<div
												className={`px-4 py-2.5 rounded-2xl shadow-sm text-[15px] leading-relaxed break-words ${chat.isMe ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-background border rounded-bl-sm text-foreground'}`}
											>
												{chat.text}
											</div>
											<span className='text-[10px] text-muted-foreground mt-1 px-1 font-medium'>
												{chat.time} {chat.isMe && '✓✓'}
											</span>
										</div>
									</div>
								))}
								{/* Auto-scroll element */}
								<div ref={messagesEndRef} />
							</div>

							<div className='p-3 sm:p-4 border-t bg-card shrink-0'>
								<div className='max-w-3xl mx-auto flex items-end gap-2'>
									<Button
										type='button'
										variant='ghost'
										size='icon'
										className='h-[50px] w-[50px] rounded-xl shrink-0 text-muted-foreground'
									>
										<Paperclip className='h-5 w-5' />
									</Button>
									<Textarea
										value={replyText}
										onChange={e => setReplyText(e.target.value)}
										onKeyDown={handleKeyDown}
										placeholder='Xabar yozing...'
										className='min-h-[50px] max-h-[120px] resize-none text-[15px] bg-muted/30 focus-visible:bg-background rounded-xl'
									/>
									<Button
										size='icon'
										onClick={handleSendMessage}
										disabled={!replyText.trim()}
										className={`h-[50px] w-[50px] rounded-xl shrink-0 transition-all ${replyText.trim() ? 'bg-primary' : 'bg-muted text-muted-foreground'}`}
									>
										<Send className='h-5 w-5 ml-0.5' />
									</Button>
								</div>
							</div>
						</div>
					)}

					{/* BO'SH HOLAT (Hech narsa tanlanmagan) */}
					{!selectedMessageId && (
						<div className='hidden md:flex flex-col items-center justify-center h-full text-center p-8'>
							<div className='h-20 w-20 bg-muted/50 rounded-full flex items-center justify-center mb-4'>
								<MessageSquare className='h-10 w-10 text-muted-foreground/30' />
							</div>
							<h3 className='text-lg font-bold mb-2'>Xabarni tanlang</h3>
							<p className='text-muted-foreground text-sm max-w-[250px]'>
								To'liq o'qish va javob yozish uchun chap tomondagi ro'yxatdan
								suhbatni tanlang.
							</p>
						</div>
					)}
				</div>
			</Card>
		</div>
	)
}
