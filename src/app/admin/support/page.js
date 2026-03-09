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
import { useTranslation } from '@/lib/i18n'
// 🔥 Markaziy utilitalar chaqirildi
import { cn, formatPhone, formatUzDate, getErrorMessage } from '@/lib/utils'
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
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner' // 🔥 Xabarnomalar uchun

// ==========================================
// 🚀 ASOSIY KOMPONENT
// ==========================================
export default function AdminSupportPage() {
	const { t } = useTranslation()
	const [messages, setMessages] = useState([])
	const [loading, setLoading] = useState(true)
	const [statusFilter, setStatusFilter] = useState('all')

	// Modal holatlari
	const [showDeleteModal, setShowDeleteModal] = useState(false)
	const [deleteTarget, setDeleteTarget] = useState(null)
	const [deleteLoading, setDeleteLoading] = useState(false)

	const [selectedMessage, setSelectedMessage] = useState(null)
	const [replyText, setReplyText] = useState('')
	const [replyLoading, setReplyLoading] = useState(false)

	// Status sozlamalari
	const statusMap = useMemo(
		() => ({
			new: {
				label: t('dashboard.newStatus') || 'Yangi',
				variant: 'destructive',
				icon: <MessageSquare className='h-3.5 w-3.5' />,
			},
			read: {
				label: t('dashboard.readStatus') || "O'qilgan",
				variant: 'secondary',
				icon: <Eye className='h-3.5 w-3.5' />,
			},
			answered: {
				label: t('dashboard.answeredStatus') || 'Javob berilgan',
				variant: 'default',
				icon: <CheckCircle className='h-3.5 w-3.5' />,
			},
		}),
		[t],
	)

	// 1. Xabarlarni yuklash
	const fetchMessages = useCallback(async () => {
		try {
			setLoading(true)
			const res = await api.get('/admin/support-messages')
			if (res?.data?.success) {
				setMessages(res.data.messages)
			}
		} catch (error) {
			toast.error(
				getErrorMessage(
					error,
					t('errors.fetchFailed') || 'Xabarlarni yuklashda xatolik',
				),
			)
		} finally {
			setLoading(false)
		}
	}, [t])

	useEffect(() => {
		fetchMessages()
	}, [fetchMessages])

	// 2. Statusni o'zgartirish
	const handleStatusChange = useCallback(
		async (id, newStatus, showToast = true) => {
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
					if (showToast)
						toast.success(t('common.updateSuccess') || 'Status yangilandi')
				}
			} catch (error) {
				if (showToast) toast.error(getErrorMessage(error))
			}
		},
		[selectedMessage, t],
	)

	// 3. Xabarni o'chirish
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
				toast.success(
					t('dashboard.deleteSuccess') || "Muvaffaqiyatli o'chirildi",
				)
				setShowDeleteModal(false)
			}
		} catch (error) {
			toast.error(getErrorMessage(error, t('errors.deleteFailed')))
		} finally {
			setDeleteLoading(false)
			setDeleteTarget(null)
		}
	}

	// 4. Javob yuborish
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
				toast.success(t('dashboard.replySuccess') || 'Javob yuborildi')
			}
		} catch (error) {
			toast.error(getErrorMessage(error, t('errors.updateFailed')))
		} finally {
			setReplyLoading(false)
		}
	}

	// 5. Xabarni ochish (Yangi bo'lsa o'qilganda o'tkazish)
	const openMessage = useCallback(
		msg => {
			setSelectedMessage(msg)
			setReplyText('')
			if (msg.status === 'new') {
				handleStatusChange(msg._id, 'read', false) // Toast ko'rsatmasdan jim statusni o'zgartiramiz
			}
		},
		[handleStatusChange],
	)

	const getTime = dateStr => {
		if (!dateStr) return ''
		const d = new Date(dateStr)
		if (isNaN(d.getTime())) return ''
		return d.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
	}

	const filteredMessages = useMemo(
		() =>
			statusFilter === 'all'
				? messages
				: messages.filter(m => m.status === statusFilter),
		[messages, statusFilter],
	)

	const newCount = useMemo(
		() => messages.filter(m => m.status === 'new').length,
		[messages],
	)

	// UI: Qism
	return (
		<div className='space-y-6 max-w-6xl mx-auto pb-12 pt-6 px-4 sm:px-6 w-full'>
			{/* 🛡️ O'CHIRISH MODALI */}
			<Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
				<DialogContent className='sm:max-w-md'>
					<DialogHeader>
						<DialogTitle>
							{t('dashboard.deleteInquiry') || "Xabarni o'chirish"}
						</DialogTitle>
						<DialogDescription>
							{t('dashboard.deleteInquiryDesc', {
								subject: deleteTarget?.subject,
							}) ||
								`Haqiqatan ham "${deleteTarget?.subject}" mavzusidagi xabarni o'chirmoqchimisiz?`}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className='flex flex-col sm:flex-row gap-2 mt-4'>
						<Button variant='outline' onClick={() => setShowDeleteModal(false)}>
							{t('common.cancel') || 'Bekor qilish'}
						</Button>
						<Button
							variant='destructive'
							onClick={handleDelete}
							disabled={deleteLoading}
						>
							{deleteLoading ? (
								<Loader2 className='h-4 w-4 animate-spin mr-2' />
							) : (
								<Trash2 className='h-4 w-4 mr-2' />
							)}
							{t('common.delete') || "O'chirish"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* 👁️ XABARNI KO'RISH / JAVOB BERISH MODALI */}
			<Dialog
				open={!!selectedMessage}
				onOpenChange={o => !o && setSelectedMessage(null)}
			>
				<DialogContent className='sm:max-w-lg max-h-[90vh] overflow-y-auto border-border'>
					{selectedMessage && (
						<div className='space-y-6'>
							<DialogHeader>
								<div className='flex items-center gap-3 mb-3 flex-wrap'>
									<Badge
										variant={statusMap[selectedMessage.status]?.variant}
										className='gap-1.5 shadow-none'
									>
										{statusMap[selectedMessage.status]?.icon}
										{statusMap[selectedMessage.status]?.label}
									</Badge>
									<span className='text-xs text-muted-foreground flex items-center gap-1.5 font-medium'>
										<Clock className='h-3.5 w-3.5' />
										{formatUzDate(selectedMessage.createdAt)}{' '}
										{getTime(selectedMessage.createdAt)}
									</span>
								</div>
								<DialogTitle className='text-xl font-bold leading-tight'>
									{selectedMessage.subject}
								</DialogTitle>
								<div className='flex flex-col gap-2 pt-3'>
									<span className='flex items-center gap-2.5 text-sm font-medium'>
										<User className='h-4 w-4 text-muted-foreground' />{' '}
										{selectedMessage.name}
									</span>
									<a
										href={`tel:${selectedMessage.phone.replace(/\D/g, '')}`}
										className='flex items-center gap-2.5 text-sm font-medium text-primary hover:underline w-fit'
									>
										<Phone className='h-4 w-4' />{' '}
										{formatPhone(selectedMessage.phone)}
									</a>
								</div>
							</DialogHeader>

							<Separator />

							<div className='space-y-2'>
								<p className='text-[10px] font-bold text-muted-foreground uppercase tracking-widest'>
									{t('dashboard.inquiryText') || 'Xabar matni'}
								</p>
								<div className='bg-muted/50 p-4 rounded-lg text-sm leading-relaxed border text-foreground'>
									"{selectedMessage.message}"
								</div>
							</div>

							{selectedMessage.adminReply && (
								<div className='space-y-2 border-l-4 border-green-500 pl-4 py-1'>
									<p className='text-[10px] font-bold text-green-600 uppercase tracking-widest flex items-center gap-1.5'>
										<CheckCircle className='h-3.5 w-3.5' />{' '}
										{t('dashboard.adminReplyLabel') || 'Admin javobi'}
									</p>
									<div className='text-sm leading-relaxed text-foreground whitespace-pre-wrap font-medium'>
										{selectedMessage.adminReply}
									</div>
									<p className='text-[10px] text-muted-foreground flex items-center gap-1 mt-1'>
										<Bot className='h-3 w-3' />{' '}
										{formatUzDate(selectedMessage.repliedAt)}{' '}
										{getTime(selectedMessage.repliedAt)}
									</p>
								</div>
							)}

							<Separator />

							{/* JAVOB YOZISH QISMI */}
							<div className='space-y-3'>
								<Label className='font-bold text-sm'>
									{t('dashboard.writeReply') || 'Javob yozish'}
								</Label>
								<Textarea
									placeholder={
										t('dashboard.replyPlaceholder') ||
										'Foydalanuvchiga javob yozing...'
									}
									className='min-h-[100px] resize-y'
									value={replyText}
									onChange={e => setReplyText(e.target.value)}
								/>
								<div className='flex flex-col sm:flex-row items-center justify-between gap-4 pt-2'>
									<p className='text-[11px] text-muted-foreground flex items-center gap-1.5'>
										<Bot className='h-3.5 w-3.5 text-blue-500' />
										{t('dashboard.replyInfo') ||
											'Xabar foydalanuvchiga Telegram bot orqali boradi.'}
									</p>
									<Button
										onClick={handleReply}
										disabled={!replyText.trim() || replyLoading}
										className='w-full sm:w-auto gap-2'
									>
										{replyLoading ? (
											<Loader2 className='h-4 w-4 animate-spin' />
										) : (
											<Send className='h-4 w-4' />
										)}
										{t('dashboard.sendReply') || 'Yuborish'}
									</Button>
								</div>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>

			{/* 🏷️ PAGE HEADER & FILTER */}
			<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-6'>
				<div>
					<h1 className='text-2xl font-bold tracking-tight flex items-center gap-3'>
						<Headphones className='h-6 w-6 text-primary' />
						{t('dashboard.supportCenter') || "Qo'llab-quvvatlash"}
						{newCount > 0 && (
							<Badge
								variant='destructive'
								className='animate-pulse shadow-none text-[10px] px-2 py-0.5'
							>
								{newCount} yangi
							</Badge>
						)}
					</h1>
					<p className='text-muted-foreground mt-1 text-sm'>
						{t('dashboard.supportCenterDesc') ||
							'Foydalanuvchilardan kelgan xabar va murojaatlar.'}
					</p>
				</div>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant='outline'
							className='gap-2 w-full sm:w-auto shadow-sm'
						>
							<span className='font-medium'>
								{statusFilter === 'all'
									? t('dashboard.allInquiries') || 'Barcha murojaatlar'
									: statusMap[statusFilter]?.label}
							</span>
							<ChevronDown className='h-4 w-4 opacity-50' />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end' className='w-56'>
						<DropdownMenuItem onClick={() => setStatusFilter('all')}>
							{t('common.all') || 'Barchasi'} ({messages.length})
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => setStatusFilter('new')}
							className='text-destructive focus:text-destructive'
						>
							<MessageSquare className='h-4 w-4 mr-2' />{' '}
							{t('dashboard.onlyNew') || 'Faqat yangilar'} (
							{messages.filter(m => m.status === 'new').length})
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setStatusFilter('read')}>
							<Eye className='h-4 w-4 mr-2' />{' '}
							{t('dashboard.onlyRead') || "O'qilganlar"} (
							{messages.filter(m => m.status === 'read').length})
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => setStatusFilter('answered')}
							className='text-green-600 focus:text-green-600'
						>
							<CheckCircle className='h-4 w-4 mr-2' />{' '}
							{t('dashboard.onlyAnswered') || 'Javob berilganlar'} (
							{messages.filter(m => m.status === 'answered').length})
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* 🗂️ MESSAGE LIST */}
			{loading ? (
				<div className='space-y-4 pt-4'>
					{[1, 2, 3, 4].map(i => (
						<Skeleton key={i} className='h-28 w-full rounded-xl' />
					))}
				</div>
			) : filteredMessages.length === 0 ? (
				<div className='flex flex-col items-center justify-center py-24 text-center border border-dashed rounded-xl bg-muted/10 mt-6'>
					<Headphones className='h-12 w-12 text-muted-foreground mb-4 opacity-20' />
					<h3 className='text-lg font-bold'>
						{t('dashboard.noSupportMsgs') || 'Murojaatlar topilmadi'}
					</h3>
					<p className='text-muted-foreground text-sm mt-1'>
						{t('dashboard.noSupportMsgsDesc') ||
							"Tanlangan filter bo'yicha hech qanday xabar mavjud emas."}
					</p>
				</div>
			) : (
				<div className='grid grid-cols-1 gap-4 pt-2'>
					<AnimatePresence mode='popLayout'>
						{filteredMessages.map(msg => (
							<motion.div
								key={msg._id}
								layout
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.95 }}
								transition={{ duration: 0.2 }}
							>
								<Card
									className={cn(
										'group cursor-pointer transition-colors hover:bg-muted/50 overflow-hidden',
										msg.status === 'new'
											? 'border-l-4 border-l-destructive bg-card'
											: 'bg-card',
									)}
									onClick={() => openMessage(msg)}
								>
									<CardContent className='p-4 sm:p-5'>
										<div className='flex items-start justify-between gap-4'>
											<div className='flex-1 min-w-0'>
												<div className='flex items-center gap-3 mb-2 flex-wrap'>
													<h3
														className={cn(
															'font-bold text-base truncate',
															msg.status === 'new'
																? 'text-foreground'
																: 'text-muted-foreground',
														)}
													>
														{msg.subject}
													</h3>
													<Badge
														variant={statusMap[msg.status]?.variant}
														className='text-[10px] uppercase font-bold px-2 shadow-none'
													>
														{statusMap[msg.status]?.label}
													</Badge>
													{msg.adminReply && (
														<Badge
															variant='outline'
															className='gap-1 text-[10px] bg-green-500/10 text-green-600 border-transparent shadow-none'
														>
															<Bot className='h-3 w-3' /> Javob berilgan
														</Badge>
													)}
												</div>

												<div className='flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-muted-foreground font-medium'>
													<span className='flex items-center gap-1.5'>
														<User className='h-3.5 w-3.5' /> {msg.name}
													</span>
													<span className='flex items-center gap-1.5'>
														<Phone className='h-3.5 w-3.5' />{' '}
														{formatPhone(msg.phone)}
													</span>
													<span className='flex items-center gap-1.5'>
														<Calendar className='h-3.5 w-3.5' />{' '}
														{formatUzDate(msg.createdAt)}
													</span>
												</div>

												<p className='text-sm text-muted-foreground mt-3 line-clamp-1 italic truncate'>
													"{msg.message}"
												</p>
											</div>

											<div
												className='flex items-center shrink-0'
												onClick={e => e.stopPropagation()}
											>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button
															variant='ghost'
															size='icon'
															className='h-8 w-8 text-muted-foreground'
														>
															<MoreVertical className='h-4 w-4' />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align='end' className='w-44'>
														<DropdownMenuItem
															className='cursor-pointer'
															onClick={() => openMessage(msg)}
														>
															<Eye className='h-4 w-4 mr-2' />{' '}
															{t('common.view') || "Ko'rish"}
														</DropdownMenuItem>
														<DropdownMenuItem
															className='cursor-pointer'
															onClick={() =>
																handleStatusChange(msg._id, 'answered')
															}
														>
															<CheckCircle className='h-4 w-4 mr-2' />{' '}
															{t('dashboard.markAsAnswered') ||
																'Javob berilgan'}
														</DropdownMenuItem>
														<DropdownMenuItem
															className='cursor-pointer text-destructive focus:text-destructive'
															onClick={() => handleStatusChange(msg._id, 'new')}
														>
															<MessageSquare className='h-4 w-4 mr-2' />{' '}
															{t('dashboard.markAsNew') ||
																'Yangi deb belgilash'}
														</DropdownMenuItem>
														<Separator className='my-1' />
														<DropdownMenuItem
															className='cursor-pointer text-destructive focus:text-destructive'
															onClick={() => {
																setDeleteTarget(msg)
																setShowDeleteModal(true)
															}}
														>
															<Trash2 className='h-4 w-4 mr-2' />{' '}
															{t('common.delete') || "O'chirish"}
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
				</div>
			)}
		</div>
	)
}
