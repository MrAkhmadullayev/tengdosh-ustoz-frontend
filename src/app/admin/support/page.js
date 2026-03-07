'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import api from '@/lib/api'
import { AnimatePresence, motion } from 'framer-motion'
import {
	Bot,
	Calendar,
	CheckCircle,
	ChevronDown,
	Clock,
	Eye,
	Headphones,
	Loader2,
	MessageSquare,
	MoreVertical,
	Phone,
	Send,
	Trash2,
	User,
} from 'lucide-react'
import { useEffect, useState } from 'react'

const containerVariants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: { staggerChildren: 0.08 },
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

const STATUS_MAP = {
	new: {
		label: 'Yangi',
		variant: 'destructive',
		icon: <MessageSquare className='h-3.5 w-3.5' />,
	},
	read: {
		label: "O'qildi",
		variant: 'secondary',
		icon: <Eye className='h-3.5 w-3.5' />,
	},
	answered: {
		label: 'Javob berildi',
		variant: 'default',
		icon: <CheckCircle className='h-3.5 w-3.5' />,
	},
}

const MONTHS = [
	'Yan',
	'Fev',
	'Mar',
	'Apr',
	'May',
	'Iyun',
	'Iyul',
	'Avg',
	'Sen',
	'Okt',
	'Noy',
	'Dek',
]

export default function AdminSupportPage() {
	const [messages, setMessages] = useState([])
	const [loading, setLoading] = useState(true)
	const [statusFilter, setStatusFilter] = useState('all')

	// Delete modal
	const [showDeleteModal, setShowDeleteModal] = useState(false)
	const [deleteTarget, setDeleteTarget] = useState(null)
	const [deleteLoading, setDeleteLoading] = useState(false)

	// Detail modal
	const [selectedMessage, setSelectedMessage] = useState(null)

	// Reply
	const [replyText, setReplyText] = useState('')
	const [replyLoading, setReplyLoading] = useState(false)

	useEffect(() => {
		fetchMessages()
	}, [])

	const fetchMessages = async () => {
		try {
			setLoading(true)
			const res = await api.get('/admin/support-messages')
			if (res?.data?.success) {
				setMessages(res.data.messages)
			}
		} catch (error) {
			console.error(error)
		} finally {
			setLoading(false)
		}
	}

	const handleStatusChange = async (id, newStatus) => {
		try {
			const res = await api.patch(`/admin/support-messages/${id}/status`, {
				status: newStatus,
			})
			if (res?.data?.success) {
				setMessages(prev =>
					prev.map(m => (m._id === id ? { ...m, status: newStatus } : m)),
				)
				if (selectedMessage?._id === id) {
					setSelectedMessage(prev => ({ ...prev, status: newStatus }))
				}
			}
		} catch (error) {
			console.error(error)
		}
	}

	const handleDelete = async () => {
		if (!deleteTarget) return
		setDeleteLoading(true)
		try {
			const res = await api.delete(
				`/admin/support-messages/${deleteTarget._id}`,
			)
			if (res?.data?.success) {
				setMessages(prev => prev.filter(m => m._id !== deleteTarget._id))
				if (selectedMessage?._id === deleteTarget._id) {
					setSelectedMessage(null)
				}
				setShowDeleteModal(false)
			}
		} catch (error) {
			console.error(error)
		} finally {
			setDeleteLoading(false)
			setDeleteTarget(null)
		}
	}

	const handleReply = async () => {
		if (!replyText.trim() || !selectedMessage) return
		setReplyLoading(true)
		try {
			const res = await api.post(
				`/admin/support-messages/${selectedMessage._id}/reply`,
				{ reply: replyText.trim() },
			)
			if (res?.data?.success) {
				const updated = res.data.supportMessage
				setMessages(prev =>
					prev.map(m => (m._id === updated._id ? updated : m)),
				)
				setSelectedMessage(updated)
				setReplyText('')
			}
		} catch (error) {
			console.error(error)
		} finally {
			setReplyLoading(false)
		}
	}

	const openMessage = msg => {
		setSelectedMessage(msg)
		setReplyText('')
		if (msg.status === 'new') {
			handleStatusChange(msg._id, 'read')
		}
	}

	const formatDate = dateStr => {
		if (!dateStr) return '-'
		const d = new Date(dateStr)
		if (isNaN(d.getTime())) return dateStr
		return `${d.getDate()}-${MONTHS[d.getMonth()]}, ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
	}

	const filteredMessages =
		statusFilter === 'all'
			? messages
			: messages.filter(m => m.status === statusFilter)

	const newCount = messages.filter(m => m.status === 'new').length

	return (
		<motion.div
			variants={containerVariants}
			initial='hidden'
			animate='show'
			className='space-y-6 max-w-6xl mx-auto pb-12 pt-4 sm:pt-6'
		>
			{/* DELETE MODAL */}
			<Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
				<DialogContent className='sm:max-w-md border-destructive/20'>
					<DialogHeader className='text-center space-y-4'>
						<div className='mx-auto bg-destructive/10 w-16 h-16 rounded-full flex items-center justify-center'>
							<Trash2 className='h-8 w-8 text-destructive' />
						</div>
						<DialogTitle className='text-xl font-bold'>
							Xabarni o'chirish
						</DialogTitle>
						<DialogDescription className='text-base'>
							<strong>"{deleteTarget?.subject}"</strong> mavzusidagi murojaatni
							butunlay o'chirib yubormoqchimisiz?
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className='flex flex-col sm:flex-row gap-3 pt-4'>
						<Button
							variant='outline'
							className='flex-1 h-11'
							onClick={() => setShowDeleteModal(false)}
						>
							Bekor qilish
						</Button>
						<Button
							variant='destructive'
							className='flex-1 h-11'
							onClick={handleDelete}
							disabled={deleteLoading}
						>
							{deleteLoading ? (
								<Loader2 className='h-4 w-4 animate-spin mr-2' />
							) : (
								<Trash2 className='h-4 w-4 mr-2' />
							)}
							O'chirish
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* DETAIL + REPLY MODAL */}
			<Dialog
				open={!!selectedMessage}
				onOpenChange={o => !o && setSelectedMessage(null)}
			>
				<DialogContent className='sm:max-w-lg max-h-[90vh] overflow-y-auto'>
					{selectedMessage && (
						<div className='space-y-5'>
							<DialogHeader>
								<div className='flex items-center gap-3 mb-2 flex-wrap'>
									<Badge
										variant={STATUS_MAP[selectedMessage.status]?.variant}
										className='gap-1.5'
									>
										{STATUS_MAP[selectedMessage.status]?.icon}
										{STATUS_MAP[selectedMessage.status]?.label}
									</Badge>
									<span className='text-xs text-muted-foreground flex items-center gap-1.5'>
										<Clock className='h-3.5 w-3.5' />
										{formatDate(selectedMessage.createdAt)}
									</span>
								</div>
								<DialogTitle className='text-xl font-bold leading-tight'>
									{selectedMessage.subject}
								</DialogTitle>
								<div className='flex flex-col gap-1.5 pt-3'>
									<span className='flex items-center gap-2.5 text-sm font-medium'>
										<User className='h-4 w-4 text-primary' />{' '}
										{selectedMessage.name}
									</span>
									<span className='flex items-center gap-2.5 text-sm font-medium'>
										<Phone className='h-4 w-4 text-primary' />{' '}
										{selectedMessage.phone}
									</span>
								</div>
							</DialogHeader>

							<Separator />

							<div className='space-y-2'>
								<p className='text-xs font-bold text-muted-foreground uppercase tracking-widest'>
									Murojaat matni
								</p>
								<div className='bg-muted/50 p-4 rounded-xl text-sm leading-relaxed border italic'>
									"{selectedMessage.message}"
								</div>
							</div>

							{selectedMessage.adminReply && (
								<div className='space-y-2 border-l-4 border-green-500 pl-4 py-1'>
									<p className='text-xs font-bold text-green-600 uppercase tracking-widest flex items-center gap-1.5'>
										<CheckCircle className='h-3.5 w-3.5' /> Admin Javobi (
										{formatDate(selectedMessage.repliedAt)})
									</p>
									<div className='text-sm leading-relaxed text-foreground whitespace-pre-wrap font-medium'>
										{selectedMessage.adminReply}
									</div>
									<p className='text-[10px] text-muted-foreground flex items-center gap-1 mt-1'>
										<Bot className='h-3 w-3' /> Telegram bot orqali yuborilgan
									</p>
								</div>
							)}

							<Separator />

							<div className='space-y-3'>
								<Label className='font-bold text-sm'>Javob yozish</Label>
								<Textarea
									placeholder='Foydalanuvchiga yuboriladigan matn...'
									className='min-h-[120px] resize-none focus-visible:ring-primary/20'
									value={replyText}
									onChange={e => setReplyText(e.target.value)}
								/>
								<div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
									<p className='text-[11px] text-muted-foreground flex items-center gap-1.5'>
										<Bot className='h-3.5 w-3.5 text-blue-500' />
										Javob foydalanuvchiga bot orqali boradi
									</p>
									<Button
										onClick={handleReply}
										disabled={!replyText.trim() || replyLoading}
										className='w-full sm:w-auto gap-2 shadow-sm'
									>
										{replyLoading ? (
											<Loader2 className='h-4 w-4 animate-spin' />
										) : (
											<Send className='h-4 w-4' />
										)}
										Javobni yuborish
									</Button>
								</div>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>

			{/* PAGE HEADER */}
			<motion.div
				variants={itemVariants}
				className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 border-b pb-6'
			>
				<div>
					<h1 className='text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-3'>
						<Headphones className='h-8 w-8 text-primary' />
						Support Markazi
						{newCount > 0 && (
							<Badge variant='destructive' className='animate-pulse'>
								{newCount} ta yangi
							</Badge>
						)}
					</h1>
					<p className='text-muted-foreground mt-1.5 text-sm sm:text-base'>
						Foydalanuvchilar murojaatlarini boshqarish va Telegram bot orqali
						javob qaytarish.
					</p>
				</div>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant='outline'
							className='gap-2 h-11 w-full sm:w-auto shadow-sm'
						>
							<span className='font-semibold'>
								{statusFilter === 'all'
									? 'Barcha murojaatlar'
									: STATUS_MAP[statusFilter]?.label}
							</span>
							<ChevronDown className='h-4 w-4 opacity-50' />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end' className='w-56'>
						<DropdownMenuItem onClick={() => setStatusFilter('all')}>
							Barchasi ({messages.length})
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => setStatusFilter('new')}
							className='text-destructive font-medium'
						>
							🔴 Yangi ({messages.filter(m => m.status === 'new').length})
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setStatusFilter('read')}>
							👁️ O'qilganlar ({messages.filter(m => m.status === 'read').length}
							)
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => setStatusFilter('answered')}
							className='text-green-600 font-medium'
						>
							✅ Javob berilganlar (
							{messages.filter(m => m.status === 'answered').length})
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</motion.div>

			{/* MESSAGES LIST */}
			{loading ? (
				<div className='space-y-4'>
					{[1, 2, 3, 4].map(i => (
						<Skeleton key={i} className='h-32 w-full rounded-2xl' />
					))}
				</div>
			) : filteredMessages.length === 0 ? (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className='flex flex-col items-center justify-center py-24 text-center border-2 border-dashed rounded-2xl bg-muted/5'
				>
					<Headphones className='h-16 w-16 text-muted-foreground mb-4 opacity-20' />
					<h3 className='text-xl font-bold'>Murojaatlar topilmadi</h3>
					<p className='text-muted-foreground max-w-sm mx-auto mt-2'>
						Ushbu filter bo'yicha hozircha hech qanday xabar mavjud emas.
					</p>
				</motion.div>
			) : (
				<motion.div variants={containerVariants} className='space-y-4'>
					<AnimatePresence mode='popLayout'>
						{filteredMessages.map(msg => (
							<motion.div key={msg._id} variants={itemVariants} layout>
								<Card
									className={`group cursor-pointer transition-all border hover:border-primary/40 hover:shadow-md ${msg.status === 'new' ? 'border-l-4 border-l-destructive bg-destructive/[0.01]' : ''}`}
									onClick={() => openMessage(msg)}
								>
									<CardContent className='p-5'>
										<div className='flex items-start justify-between gap-4'>
											<div className='flex-1 min-w-0'>
												<div className='flex items-center gap-3 mb-2 flex-wrap'>
													<h3
														className={`font-bold text-base truncate ${msg.status === 'new' ? 'text-foreground' : 'text-muted-foreground'}`}
													>
														{msg.subject}
													</h3>
													<Badge
														variant={STATUS_MAP[msg.status]?.variant}
														className='text-[10px] uppercase font-bold px-2'
													>
														{STATUS_MAP[msg.status]?.label}
													</Badge>
													{msg.adminReply && (
														<Badge
															variant='outline'
															className='gap-1 text-[10px] bg-green-50 text-green-600 border-green-200'
														>
															<Bot className='h-3 w-3' /> Javob berilgan
														</Badge>
													)}
												</div>

												<div className='flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-muted-foreground font-medium'>
													<span className='flex items-center gap-1.5'>
														<User className='h-3.5 w-3.5 text-primary' />{' '}
														{msg.name}
													</span>
													<span className='flex items-center gap-1.5'>
														<Phone className='h-3.5 w-3.5 text-primary' />{' '}
														{msg.phone}
													</span>
													<span className='flex items-center gap-1.5'>
														<Calendar className='h-3.5 w-3.5' />{' '}
														{formatDate(msg.createdAt)}
													</span>
												</div>

												<p className='text-sm text-muted-foreground mt-3 line-clamp-1 italic'>
													"{msg.message}"
												</p>
											</div>

											<div
												className='flex items-center'
												onClick={e => e.stopPropagation()}
											>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button
															variant='ghost'
															size='icon'
															className='h-9 w-9 rounded-full group-hover:bg-muted'
														>
															<MoreVertical className='h-4 w-4' />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align='end' className='w-44'>
														<DropdownMenuItem onClick={() => openMessage(msg)}>
															<Eye className='h-4 w-4 mr-2' /> Ko'rish
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() =>
																handleStatusChange(msg._id, 'answered')
															}
														>
															<CheckCircle className='h-4 w-4 mr-2' /> Javob
															berildi
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() => handleStatusChange(msg._id, 'new')}
															className='text-destructive'
														>
															<MessageSquare className='h-4 w-4 mr-2' /> Yangi
															deb belgilash
														</DropdownMenuItem>
														<Separator className='my-1' />
														<DropdownMenuItem
															onClick={() => {
																setDeleteTarget(msg)
																setShowDeleteModal(true)
															}}
															className='text-destructive focus:bg-destructive/10'
														>
															<Trash2 className='h-4 w-4 mr-2' /> O'chirish
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</div>
										</div>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</AnimatePresence>
				</motion.div>
			)}
		</motion.div>
	)
}
