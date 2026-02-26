'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
	ArrowLeft,
	Bell,
	CheckCheck,
	Circle,
	Clock,
	MessageSquare,
	MoreHorizontal,
	Search,
	Trash2,
	Video,
	Wallet,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

// Mock Bildirishnomalar
const INITIAL_NOTIFICATIONS = [
	{
		id: 1,
		type: 'lesson',
		title: 'Yangi dars!',
		description:
			'Siz uchun "React Advanced" darsi qo\'shildi. Bugun soat 20:00 da darsga qo\'shilishni unutmang.',
		time: '5 daqiqa oldin',
		date: '2024-03-26',
		href: '/admin/lessons',
		unread: true,
		icon: <Video className='w-5 h-5 text-blue-500' />,
		bgColor: 'bg-blue-50',
	},
	{
		id: 2,
		type: 'message',
		title: 'Xabar keldi',
		description:
			'Mentor Javohir sizga xabar yubordi: "Vazifalar topshirish muddati uzaytirildi".',
		time: '1 soat oldin',
		date: '2024-03-26',
		href: '/users/messages',
		unread: true,
		icon: <MessageSquare className='w-5 h-5 text-green-500' />,
		bgColor: 'bg-green-50',
	},
	{
		id: 3,
		type: 'payment',
		title: "To'lov tasdiqlandi",
		description:
			"Oylik obunangiz muvaffaqiyatli yangilandi. Platformadan to'liq foydalanishingiz mumkin.",
		time: '2 kun oldin',
		date: '2024-03-24',
		href: '/admin/dashboard',
		unread: false,
		icon: <Wallet className='w-5 h-5 text-orange-500' />,
		bgColor: 'bg-orange-50',
	},
	{
		id: 4,
		type: 'system',
		title: "Parol o'zgartirildi",
		description:
			'Hisobingiz xavfsizligi uchun maxfiy parolingiz muvaffaqiyatli yangilandi.',
		time: '3 kun oldin',
		date: '2024-03-23',
		href: '/users/settings',
		unread: false,
		icon: <Bell className='w-5 h-5 text-purple-500' />,
		bgColor: 'bg-purple-50',
	},
]

export default function NotificationsPage() {
	const router = useRouter()
	const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
	const [searchQuery, setSearchQuery] = useState('')
	const [activeFilter, setActiveFilter] = useState('all')

	const unreadCount = notifications.filter(n => n.unread).length

	const filteredNotifications = notifications.filter(n => {
		const matchesSearch =
			n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			n.description.toLowerCase().includes(searchQuery.toLowerCase())
		const matchesFilter =
			activeFilter === 'all'
				? true
				: activeFilter === 'unread'
					? n.unread
					: n.type === activeFilter
		return matchesSearch && matchesFilter
	})

	const markAllAsRead = () => {
		setNotifications(notifications.map(n => ({ ...n, unread: false })))
	}

	const deleteNotification = id => {
		setNotifications(notifications.filter(n => n.id !== id))
	}

	const markAsRead = id => {
		setNotifications(
			notifications.map(n => (n.id === id ? { ...n, unread: false } : n)),
		)
	}

	return (
		<div className='max-w-4xl mx-auto space-y-8 pb-12'>
			{/* Header Section */}
			<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
				<div className='space-y-1'>
					<div className='flex items-center gap-3'>
						<Button
							variant='ghost'
							size='icon'
							className='rounded-full -ml-2'
							onClick={() => router.back()}
						>
							<ArrowLeft className='w-5 h-5' />
						</Button>
						<h1 className='text-3xl font-bold tracking-tight'>
							Bildirishnomalar
						</h1>
					</div>
					<p className='text-muted-foreground ml-10 sm:ml-0'>
						Tizimdan kelgan barcha xabar va ogohlantirishlarni boshqarish.
					</p>
				</div>
				{unreadCount > 0 && (
					<Button
						variant='outline'
						className='rounded-xl gap-2 font-medium border-primary/20 hover:bg-primary/5 text-primary'
						onClick={markAllAsRead}
					>
						<CheckCheck className='w-4 h-4' /> Hammasini o'qildi deb belgilash
					</Button>
				)}
			</div>

			{/* Filters & Search */}
			<div className='flex flex-col md:flex-row items-center gap-4 bg-card p-4 rounded-2xl border shadow-sm'>
				<div className='relative flex-1 w-full'>
					<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
					<Input
						placeholder='Bildirishnomalarni qidirish...'
						className='pl-10 h-11 bg-muted/20 border-transparent focus-visible:ring-primary/20 rounded-xl'
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
					/>
				</div>
				<div className='flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0'>
					<Button
						variant={activeFilter === 'all' ? 'default' : 'ghost'}
						size='sm'
						className='rounded-lg h-9'
						onClick={() => setActiveFilter('all')}
					>
						Barchasi
					</Button>
					<Button
						variant={activeFilter === 'unread' ? 'default' : 'ghost'}
						size='sm'
						className='rounded-lg h-9 gap-2'
						onClick={() => setActiveFilter('unread')}
					>
						O'qilmagan
						{unreadCount > 0 && (
							<Badge className='h-5 w-5 p-0 flex items-center justify-center rounded-full bg-white text-primary'>
								{unreadCount}
							</Badge>
						)}
					</Button>
					<Button
						variant={activeFilter === 'lesson' ? 'default' : 'ghost'}
						size='sm'
						className='rounded-lg h-9'
						onClick={() => setActiveFilter('lesson')}
					>
						Darslar
					</Button>
				</div>
			</div>

			{/* Notifications List */}
			<div className='space-y-4'>
				{filteredNotifications.length > 0 ? (
					filteredNotifications.map(notif => (
						<Card
							key={notif.id}
							className={`group relative overflow-hidden transition-all duration-300 hover:shadow-md border-muted/50 rounded-2xl ${notif.unread ? 'ring-1 ring-primary/20 bg-primary/opacity-5' : 'bg-card'}`}
						>
							<CardContent
								className='p-6 cursor-pointer'
								onClick={() => {
									if (notif.unread) markAsRead(notif.id)
									router.push(notif.href)
								}}
							>
								<div className='flex items-start gap-4'>
									<div className={`p-3 rounded-2xl shrink-0 ${notif.bgColor}`}>
										{notif.icon}
									</div>
									<div className='flex-1 space-y-1 pr-12 text-foreground'>
										<div className='flex items-center gap-2'>
											<h3
												className={`font-bold text-lg ${notif.unread ? 'text-foreground' : 'text-muted-foreground'}`}
											>
												{notif.title}
											</h3>
											{notif.unread && (
												<span className='h-2 w-2 rounded-full bg-primary animate-pulse' />
											)}
										</div>
										<p className='text-muted-foreground leading-relaxed'>
											{notif.description}
										</p>
										<div className='flex items-center gap-4 text-xs text-muted-foreground pt-2 font-medium'>
											<span className='flex items-center gap-1.5'>
												<Clock className='w-3.5 h-3.5' /> {notif.time}
											</span>
											<span className='flex items-center gap-1.5'>
												<Circle className='w-2 h-2 fill-current' /> {notif.date}
											</span>
										</div>
									</div>

									{/* Quick Actions */}
									<div className='absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
										<Button
											variant='ghost'
											size='icon'
											className='h-9 w-9 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-full'
											onClick={e => {
												e.stopPropagation()
												deleteNotification(notif.id)
											}}
										>
											<Trash2 className='w-4 h-4' />
										</Button>
										<Button
											variant='ghost'
											size='icon'
											className='h-9 w-9 rounded-full'
										>
											<MoreHorizontal className='w-4 h-4' />
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					))
				) : (
					<Card className='border-dashed border-2 bg-muted/5'>
						<CardContent className='flex flex-col items-center justify-center p-12 space-y-4'>
							<div className='bg-muted/20 p-4 rounded-full'>
								<Bell className='w-12 h-12 text-muted-foreground opacity-20' />
							</div>
							<div className='text-center space-y-1'>
								<h3 className='text-lg font-semibold'>Hech narsa topilmadi</h3>
								<p className='text-muted-foreground'>
									{searchQuery
										? `"${searchQuery}" so'roviga mos bildirishnoma yo'q.`
										: 'Hozircha sizda bildirishnomalar mavjud emas.'}
								</p>
							</div>
							{activeFilter !== 'all' && (
								<Button
									variant='link'
									className='text-primary'
									onClick={() => setActiveFilter('all')}
								>
									Barcha filtrlarni tozalash
								</Button>
							)}
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	)
}
