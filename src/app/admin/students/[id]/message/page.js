'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Send } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export default function TalabaMessagePage() {
	const router = useRouter()
	const { id } = useParams()
	const endOfMessagesRef = useRef(null)

	// Mock data for chat history
	const [messages, setMessages] = useState([
		{
			id: 1,
			senderId: 'M-001', // Talaba ID
			senderName: 'Sardor Rahmatov',
			text: "Assalomu alaykum! Savollaringiz bo'lsa bemalol berishingiz mumkin.",
			timestamp: '10:30 AM',
			isMe: false,
		},
		{
			id: 2,
			senderId: 'me',
			text: "Va aleykum assalom. Yaxshimisiz ustoz? Men Node.js bilan bog'liq xatolikka duch keldim.",
			timestamp: '10:32 AM',
			isMe: true,
		},
	])

	const [newMessage, setNewMessage] = useState('')

	// Scroll to bottom when messages change
	useEffect(() => {
		endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages])

	const handleSendMessage = () => {
		if (!newMessage.trim()) return

		const messageObj = {
			id: Date.now(),
			senderId: 'me',
			text: newMessage.trim(),
			timestamp: new Date().toLocaleTimeString([], {
				hour: '2-digit',
				minute: '2-digit',
			}),
			isMe: true,
		}

		setMessages(prev => [...prev, messageObj])
		setNewMessage('')
	}

	return (
		<div className='max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col'>
			<div className='flex items-center gap-4 mb-4'>
				<Button
					variant='ghost'
					size='icon'
					onClick={() => router.push(`/admin/students/${id}/view`)}
					className='rounded-full hover:bg-muted'
				>
					<ArrowLeft className='h-5 w-5' />
				</Button>
				<div>
					<h1 className='text-2xl font-bold tracking-tight'>
						Talaba bilan aloqa
					</h1>
					<p className='text-muted-foreground text-sm font-medium'>
						ID: <span className='text-primary'>{id}</span>
					</p>
				</div>
			</div>

			<Card className='flex-1 flex flex-col shadow-sm border-muted overflow-hidden'>
				{/* CHAT HEADER */}
				<CardHeader className='border-b bg-muted/20 py-4 px-6 flex flex-row items-center gap-4'>
					<Avatar className='h-10 w-10 border shadow-sm'>
						<AvatarFallback className='bg-primary/10 text-primary font-bold'>
							SR
						</AvatarFallback>
					</Avatar>
					<div>
						<h2 className='text-base font-bold'>Sardor Rahmatov</h2>
						<p className='text-xs text-green-600 font-medium flex items-center gap-1.5'>
							<span className='h-2 w-2 rounded-full bg-green-500 animate-pulse'></span>
							Online
						</p>
					</div>
				</CardHeader>

				{/* CHAT BODY */}
				<CardContent className='flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50 dark:bg-card'>
					{messages.map(msg => (
						<div
							key={msg.id}
							className={`flex flex-col max-w-[80%] ${
								msg.isMe ? 'ml-auto items-end' : 'mr-auto items-start'
							}`}
						>
							<div
								className={`px-4 py-2.5 rounded-2xl ${
									msg.isMe
										? 'bg-primary text-primary-foreground rounded-br-sm'
										: 'bg-muted rounded-bl-sm border border-border/50 text-foreground'
								}`}
							>
								<p className='text-sm leading-relaxed'>{msg.text}</p>
							</div>
							<span className='text-[10px] text-muted-foreground mt-1 px-1 font-medium'>
								{msg.timestamp}
							</span>
						</div>
					))}
					<div ref={endOfMessagesRef} />
				</CardContent>

				{/* CHAT INPUT */}
				<div className='border-t bg-background p-4 flex gap-2 sm:gap-4 items-end'>
					<Textarea
						value={newMessage}
						onChange={e => setNewMessage(e.target.value)}
						placeholder='Xabar yozing...'
						className='min-h-[50px] max-h-[150px] resize-none focus-visible:ring-primary/40 text-base'
						onKeyDown={e => {
							if (e.key === 'Enter' && !e.shiftKey) {
								e.preventDefault()
								handleSendMessage()
							}
						}}
					/>
					<Button
						onClick={handleSendMessage}
						size='icon'
						className='h-[50px] w-[50px] shrink-0 rounded-full'
						disabled={!newMessage.trim()}
					>
						<Send className='h-5 w-5 ml-0.5' />
					</Button>
				</div>
			</Card>
		</div>
	)
}
