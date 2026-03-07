'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import api from '@/lib/api'
import { cn } from '@/lib/utils'
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
import { useEffect, useMemo, useRef, useState } from 'react'
import { io } from 'socket.io-client'

export default function MessagesPage() {
	const [userRole, setUserRole] = useState('student')
	const [userId, setUserId] = useState(null)

	// Dynamic Data
	const [conversations, setConversations] = useState([])
	const [systemConversations, setSystemConversations] = useState([])
	const [activeChatHistory, setActiveChatHistory] = useState([])
	const [activeConversationId, setActiveConversationId] = useState(null)

	const [mainTab, setMainTab] = useState('system')
	const [sysTab, setSysTab] = useState('all')
	const [contactTab, setContactTab] = useState('mentor')
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedContact, setSelectedContact] = useState(null)
	const [replyText, setReplyText] = useState('')

	// Socket
	const [socket, setSocket] = useState(null)
	const messagesEndRef = useRef(null)

	const activeChatIdRef = useRef(activeConversationId)
	const activeContactRef = useRef(selectedContact)

	useEffect(() => {
		activeChatIdRef.current = activeConversationId
	}, [activeConversationId])

	useEffect(() => {
		activeContactRef.current = selectedContact
	}, [selectedContact])

	useEffect(() => {
		const savedRole = sessionStorage.getItem('userRole') || 'student'

		// ID ni xavfsiz olish (ba'zida _id, ba'zida id bo'lishi mumkin)
		const userStr = localStorage.getItem('user')
		let savedId = ''
		if (userStr) {
			try {
				const userObj = JSON.parse(userStr)
				savedId = userObj._id || userObj.id || ''
			} catch (e) {}
		}

		setUserRole(savedRole)
		setUserId(savedId)

		if (savedRole === 'mentor') {
			setMainTab('system')
			setContactTab('student')
		}

		fetchConversations()
		fetchSystemConversations()

		const socketUrl =
			process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ||
			'http://13.48.57.24:5000'
		const socketInstance = io(socketUrl, { withCredentials: true })
		setSocket(socketInstance)

		if (savedId) {
			socketInstance.emit('join_user_channel', savedId)
		}

		// Direct Message qabul qilish
		socketInstance.on('receive_direct_message', populatedMsg => {
			const currentActiveId = activeChatIdRef.current
			const currentContact = activeContactRef.current
			const isMyMsg =
				populatedMsg.senderId?._id === savedId ||
				populatedMsg.senderId === savedId

			let shouldAdd = false

			if (currentActiveId === populatedMsg.conversationId) {
				shouldAdd = true
			} else if (
				isMyMsg &&
				(currentActiveId === true || String(currentActiveId).startsWith('new_'))
			) {
				shouldAdd = true
				setActiveConversationId(populatedMsg.conversationId)
			} else if (
				!isMyMsg &&
				currentContact?.contactTargetId === populatedMsg.senderId?._id
			) {
				shouldAdd = true
				setActiveConversationId(populatedMsg.conversationId)
			}

			if (shouldAdd) {
				setActiveChatHistory(prev => {
					if (prev.some(m => m.id === populatedMsg._id)) return prev
					return [
						...prev,
						{
							...populatedMsg,
							id: populatedMsg._id,
							isMe: isMyMsg,
							sender: isMyMsg
								? 'me'
								: `${populatedMsg.senderId?.firstName || ''} ${populatedMsg.senderId?.lastName || ''}`,
							time: new Date(populatedMsg.createdAt).toLocaleTimeString([], {
								hour: '2-digit',
								minute: '2-digit',
							}),
						},
					]
				})
			}
			fetchConversations()
			fetchSystemConversations()
		})

		return () => {
			if (socketInstance) socketInstance.disconnect()
		}
	}, [])

	const fetchConversations = async () => {
		try {
			const res = await api.get('/messages/conversations')
			if (res.data.success) {
				const filtered = res.data.conversations.filter(c => !c.isSystem)
				setConversations(filtered)
			}
		} catch (error) {
			console.error('Failed to fetch contact conversations', error)
		}
	}

	const fetchSystemConversations = async () => {
		try {
			const res = await api.get('/messages/system/all')
			if (res.data.success) {
				const mappedSys = res.data.conversations.map(c => {
					const savedRole = sessionStorage.getItem('userRole') || 'student'
					return {
						id: c._id,
						type: c.type || 'general',
						sender:
							savedRole === 'admin'
								? c.participants.find(p => p.role !== 'admin')?.firstName ||
									'Foydalanuvchi'
								: 'Platforma Admini',
						role:
							savedRole === 'admin'
								? c.participants.find(p => p.role !== 'admin')?.role ||
									'student'
								: 'admin',
						text: c.lastMessage?.text || 'Yangi xat',
						time: c.lastMessage?.createdAt
							? new Date(c.lastMessage.createdAt).toLocaleTimeString([], {
									hour: '2-digit',
									minute: '2-digit',
								})
							: '',
						isRead: true,
					}
				})
				setSystemConversations(mappedSys)
			}
		} catch (error) {
			console.error('Failed to fetch system conversations', error)
		}
	}

	const selectSystemMessage = async sysMsg => {
		setSelectedContact(sysMsg.id)
		setActiveConversationId(sysMsg.id)
		try {
			const res = await api.get(`/messages/system/${sysMsg.id}/history`)
			if (res.data.success) {
				const msgsWithTime = res.data.messages.map(m => ({
					...m,
					time: new Date(m.time).toLocaleTimeString([], {
						hour: '2-digit',
						minute: '2-digit',
					}),
				}))
				setActiveChatHistory(msgsWithTime)
			}
		} catch (err) {
			console.error(err)
		}
	}

	const selectContactChat = async contactInfo => {
		setSelectedContact(contactInfo)
		setActiveConversationId(contactInfo.id)
		if (!contactInfo.contactTargetId) return

		try {
			const res = await api.get(`/messages/${contactInfo.contactTargetId}`)
			if (res.data.success) {
				setActiveConversationId(res.data.conversationId)
				const msgsWithTime = res.data.messages.map(m => ({
					...m,
					time: new Date(m.time).toLocaleTimeString([], {
						hour: '2-digit',
						minute: '2-digit',
					}),
				}))
				setActiveChatHistory(msgsWithTime)
			}
		} catch (err) {
			console.error(err)
		}
	}

	const filteredSystemMessages = useMemo(() => {
		return systemConversations.filter(msg => {
			if (userRole === 'mentor' || userRole === 'student') {
				return (
					msg.sender?.toLowerCase().includes(searchQuery.toLowerCase()) ||
					msg.text?.toLowerCase().includes(searchQuery.toLowerCase())
				)
			}
			const matchesTab = sysTab === 'all' || msg.type === sysTab
			const matchesSearch =
				msg.sender?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				msg.text?.toLowerCase().includes(searchQuery.toLowerCase())
			return matchesTab && matchesSearch
		})
	}, [systemConversations, searchQuery, sysTab, userRole])

	const filteredContacts = useMemo(() => {
		return conversations.filter(c => {
			const matchesTab =
				c.role === contactTab || (!c.role && contactTab === 'student')
			const matchesSearch = c.name
				?.toLowerCase()
				.includes(searchQuery.toLowerCase())
			return matchesTab && matchesSearch
		})
	}, [conversations, searchQuery, contactTab])

	const selectedSystemMsg = systemConversations.find(
		m => m.id === selectedContact,
	)
	const selectedActiveContact = conversations.find(
		c => c.id === selectedContact?.id,
	)

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [activeChatHistory])

	// --- XABAR YUBORISH (Tuzatilgan qism) ---
	const handleSendMessage = () => {
		if (!replyText.trim()) return

		// Kafolatlangan UserId ni topish
		const currentUserId =
			userId ||
			JSON.parse(localStorage.getItem('user'))?._id ||
			JSON.parse(localStorage.getItem('user'))?.id

		if (!socket || !currentUserId) {
			console.warn('Socket ulanmagan yoki Foydalanuvchi ID topilmadi!')
			return
		}

		const newMsgObj = {
			id: Date.now().toString(),
			text: replyText.trim(),
			isMe: true,
			time: new Date().toLocaleTimeString([], {
				hour: '2-digit',
				minute: '2-digit',
			}),
		}

		const isContact = mainTab === 'contacts'
		const targetId = isContact ? selectedActiveContact?.contactTargetId : null

		// Server kutadigan universal payload
		const payload = {
			senderId: currentUserId,
			conversationId: activeConversationId,
			text: replyText.trim(),
			isSystem: !isContact,
		}

		if (isContact && targetId) {
			payload.targetId = targetId
		}

		// Emit qilib jo'natamiz
		socket.emit('send_direct_message', payload)

		// UI da darhol ko'rsatish (Optimistic update)
		setActiveChatHistory(prev => [...prev, newMsgObj])
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
		setSelectedContact(null)
		setActiveChatHistory([])
		setSearchQuery('')
	}

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

	const isChatOpen = selectedContact !== null

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
					className='w-full md:w-[400px]'
				>
					<TabsList className='grid w-full grid-cols-2 h-10'>
						<TabsTrigger value='system'>
							{userRole === 'mentor' || userRole === 'student'
								? 'Admin chati'
								: 'Tizim / Shikoyat'}
						</TabsTrigger>
						<TabsTrigger value='contacts'>
							{userRole === 'mentor' ? 'Talabalar' : 'Kontaktlar'}
						</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			{/* ASOSIY CONTAINER 
        flex-col md:flex-row aynan ikki tomonga (side-by-side) yoyishni ta'minlaydi.
      */}
			<Card className='flex-1 flex flex-col md:flex-row overflow-hidden border-muted shadow-sm relative'>
				{/* CHAP TOMON: RO'YXAT */}
				<div
					className={cn(
						'w-full md:w-80 lg:w-[350px] border-r flex flex-col shrink-0 bg-card',
						isChatOpen ? 'hidden md:flex' : 'flex',
					)}
				>
					<div className='p-4 border-b space-y-4 shrink-0'>
						<div className='relative'>
							<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
							<Input
								placeholder='Qidirish...'
								className='pl-9 bg-muted/50 border-transparent focus-visible:ring-primary rounded-xl h-10'
								value={searchQuery}
								onChange={e => setSearchQuery(e.target.value)}
							/>
						</div>

						{mainTab === 'system' ? (
							userRole === 'admin' ? (
								<Tabs value={sysTab} onValueChange={setSysTab}>
									<TabsList className='grid w-full grid-cols-4 h-9'>
										<TabsTrigger value='all' className='text-[10px] sm:text-xs'>
											Barchasi
										</TabsTrigger>
										<TabsTrigger
											value='general'
											className='text-[10px] sm:text-xs'
										>
											Umumiy
										</TabsTrigger>
										<TabsTrigger
											value='complaint'
											className='text-[10px] sm:text-xs'
										>
											Shikoyat
										</TabsTrigger>
										<TabsTrigger
											value='connection'
											className='text-[10px] sm:text-xs'
										>
											So'rov
										</TabsTrigger>
									</TabsList>
								</Tabs>
							) : (
								<div className='h-9 flex flex-col items-start justify-center text-xs font-bold text-muted-foreground uppercase tracking-wider gap-2'>
									<span>Asosiy Admin Kanalimiz</span>
									{filteredSystemMessages.length === 0 && (
										<Button
											size='sm'
											onClick={() => setSelectedContact(true)}
											className='h-8 rounded-lg'
										>
											Adminga yozish
										</Button>
									)}
								</div>
							)
						) : (
							<Tabs value={contactTab} onValueChange={setContactTab}>
								<TabsList className='grid w-full grid-cols-2 h-9'>
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

					<div className='flex-1 overflow-y-auto custom-scrollbar'>
						{mainTab === 'system' &&
							(filteredSystemMessages.length > 0 ? (
								<div className='divide-y divide-border'>
									{filteredSystemMessages.map(msg => (
										<button
											key={msg.id}
											onClick={() => selectSystemMessage(msg)}
											className={cn(
												'w-full text-left p-4 hover:bg-muted/50 transition-colors flex gap-3 border-l-2',
												selectedContact === msg.id
													? 'bg-muted/50 border-l-primary'
													: 'border-l-transparent',
											)}
										>
											<div className='relative shrink-0'>
												<Avatar className='h-11 w-11 border shadow-sm'>
													<AvatarFallback className='bg-primary/10 text-primary font-bold text-sm uppercase'>
														{msg.sender?.substring(0, 2) || 'AD'}
													</AvatarFallback>
												</Avatar>
												{!msg.isRead && (
													<span className='absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-blue-500 animate-pulse'></span>
												)}
											</div>
											<div className='flex-1 min-w-0 flex flex-col justify-center'>
												<div className='flex justify-between items-center mb-1'>
													<h4
														className={cn(
															'text-sm truncate pr-2',
															!msg.isRead ? 'font-bold' : 'font-medium',
														)}
													>
														{msg.sender}
													</h4>
													<span className='text-[10px] text-muted-foreground font-mono'>
														{msg.time}
													</span>
												</div>
												<div className='flex items-center gap-1.5'>
													{userRole === 'admin' && getIcon(msg.type)}
													<p className='text-xs truncate text-muted-foreground'>
														{msg.text}
													</p>
												</div>
											</div>
										</button>
									))}
								</div>
							) : (
								<div className='flex flex-col items-center justify-center h-full p-6 text-center text-muted-foreground'>
									<MessageSquare className='h-10 w-10 mb-3 opacity-20' />
									<p className='text-sm'>Tizim xabarlari topilmadi.</p>
								</div>
							))}

						{mainTab === 'contacts' &&
							(filteredContacts.length > 0 ? (
								<div className='divide-y divide-border'>
									{filteredContacts.map(contact => (
										<button
											key={contact.id}
											onClick={() => selectContactChat(contact)}
											className={cn(
												'w-full text-left p-4 hover:bg-muted/50 transition-colors flex gap-3 border-l-2',
												selectedContact?.id === contact.id
													? 'bg-muted/50 border-l-primary'
													: 'border-l-transparent',
											)}
										>
											<div className='relative shrink-0'>
												<Avatar className='h-11 w-11 border shadow-sm'>
													<AvatarFallback className='bg-primary/10 text-primary font-bold text-sm uppercase'>
														{contact.name?.substring(0, 2) || 'U'}
													</AvatarFallback>
												</Avatar>
											</div>
											<div className='flex-1 min-w-0 flex flex-col justify-center'>
												<div className='flex justify-between items-center mb-1'>
													<h4
														className={cn(
															'text-sm truncate pr-2',
															!contact.isRead ? 'font-bold' : 'font-medium',
														)}
													>
														{contact.name}
													</h4>
													<span className='text-[10px] text-muted-foreground font-mono'>
														{contact.time
															? new Date(contact.time).toLocaleTimeString([], {
																	hour: '2-digit',
																	minute: '2-digit',
																})
															: ''}
													</span>
												</div>
												<p
													className={cn(
														'text-xs truncate',
														!contact.isRead
															? 'text-foreground font-medium'
															: 'text-muted-foreground',
													)}
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
									<p className='text-sm'>Kontaktlar mavjud emas.</p>
								</div>
							))}
					</div>
				</div>

				{/* O'NG TOMON: CHAT XONASI */}
				<div
					className={cn(
						'flex-1 flex flex-col h-full bg-background min-w-0',
						isChatOpen ? 'flex' : 'hidden md:flex',
					)}
				>
					{selectedContact ? (
						<>
							{/* Chat Header */}
							<div className='h-16 px-4 md:px-6 border-b bg-card flex items-center gap-3 shadow-sm shrink-0 z-10'>
								<Button
									variant='ghost'
									size='icon'
									className='md:hidden shrink-0 -ml-2'
									onClick={() => setSelectedContact(null)}
								>
									<ArrowLeft className='h-5 w-5' />
								</Button>
								<Avatar className='h-10 w-10 border shadow-sm shrink-0'>
									<AvatarFallback className='bg-primary/10 text-primary font-bold text-xs uppercase'>
										{mainTab === 'system'
											? selectedSystemMsg?.sender?.substring(0, 2) || 'AD'
											: selectedActiveContact?.name?.substring(0, 2) || 'U'}
									</AvatarFallback>
								</Avatar>
								<div className='flex-1 min-w-0'>
									<h3 className='font-bold text-base truncate'>
										{mainTab === 'system'
											? selectedSystemMsg
												? selectedSystemMsg.sender
												: 'Admin Chati'
											: selectedActiveContact?.name}
									</h3>
									<p className='text-[11px] font-medium text-muted-foreground capitalize truncate'>
										{mainTab === 'system'
											? selectedSystemMsg?.role || 'admin'
											: 'Foydalanuvchi'}
									</p>
								</div>
							</div>

							{/* Chat Messages */}
							<div className='flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 bg-muted/10 custom-scrollbar relative'>
								<div className='max-w-3xl mx-auto space-y-4'>
									<div className='text-center sticky top-0 py-2 z-10'>
										<Badge
											variant='outline'
											className='text-[10px] font-bold bg-background/80 backdrop-blur-sm uppercase tracking-wider text-muted-foreground shadow-sm'
										>
											Suhbat tarixi
										</Badge>
									</div>

									{activeChatHistory.map((chat, idx) => (
										<div
											key={chat.id || idx}
											className={cn(
												'flex w-full',
												chat.isMe ? 'justify-end' : 'justify-start',
											)}
										>
											<div
												className={cn(
													'flex flex-col max-w-[85%] sm:max-w-[70%]',
													chat.isMe ? 'items-end' : 'items-start',
												)}
											>
												<div
													className={cn(
														'px-4 py-2.5 text-[15px] leading-relaxed break-words shadow-sm',
														chat.isMe
															? 'bg-primary text-primary-foreground rounded-2xl rounded-br-sm'
															: 'bg-card text-foreground border rounded-2xl rounded-bl-sm',
													)}
												>
													{chat.text}
												</div>
												<div className='flex items-center gap-1 mt-1 px-1'>
													<span className='text-[10px] font-mono text-muted-foreground/70'>
														{chat.time}{' '}
														{chat.isMe && (
															<span className='ml-1 text-primary'>✓✓</span>
														)}
													</span>
												</div>
											</div>
										</div>
									))}
									<div ref={messagesEndRef} className='h-1' />
								</div>
							</div>

							{/* Chat Input */}
							<div className='p-3 sm:p-4 border-t bg-card shrink-0 z-10'>
								<div className='max-w-3xl mx-auto flex items-end gap-2 relative'>
									<Button
										type='button'
										variant='ghost'
										size='icon'
										className='h-[50px] w-[50px] rounded-xl shrink-0 text-muted-foreground hover:text-foreground'
									>
										<Paperclip className='h-5 w-5' />
									</Button>
									<Textarea
										value={replyText}
										onChange={e => setReplyText(e.target.value)}
										onKeyDown={handleKeyDown}
										placeholder='Xabar yozing...'
										className='min-h-[50px] max-h-[150px] resize-none text-[15px] bg-muted/50 border-transparent focus-visible:ring-primary rounded-xl py-3.5 custom-scrollbar'
									/>
									<Button
										size='icon'
										onClick={handleSendMessage}
										disabled={!replyText.trim()}
										className='h-[50px] w-[50px] rounded-xl shrink-0 transition-all shadow-sm'
									>
										<Send className='h-5 w-5 ml-0.5' />
									</Button>
								</div>
							</div>
						</>
					) : (
						<div className='flex flex-col items-center justify-center h-full text-muted-foreground p-6 bg-muted/10'>
							<div className='h-24 w-24 rounded-full bg-card shadow-sm flex items-center justify-center mb-4'>
								<MessageSquare className='h-10 w-10 opacity-30 text-primary' />
							</div>
							<h3 className='text-xl font-bold text-foreground mb-1'>
								Xabarlar paneli
							</h3>
							<p className='text-sm max-w-[250px] text-center font-medium'>
								Suhbatni boshlash uchun chap tomondan xatni tanlang.
							</p>
						</div>
					)}
				</div>
			</Card>
		</div>
	)
}
