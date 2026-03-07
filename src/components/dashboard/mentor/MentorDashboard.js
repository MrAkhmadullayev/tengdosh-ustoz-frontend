'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import api from '@/lib/api'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import {
	Bell,
	BookOpen,
	CheckCircle2,
	Hourglass,
	MessageCircle,
	Star,
	Users,
	Video,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// --- SKELETON LOADER COMPONENT ---
const DashboardSkeleton = () => (
	<div className='space-y-6 max-w-6xl mx-auto pb-8 animate-in fade-in duration-500'>
		{/* Header Skeleton */}
		<div className='flex flex-col sm:flex-row justify-between gap-4'>
			<div className='space-y-2'>
				<Skeleton className='h-9 w-64' />
				<Skeleton className='h-4 w-80' />
			</div>
			<Skeleton className='h-10 w-40 rounded-md' />
		</div>

		{/* Stats Grid Skeleton */}
		<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
			{[1, 2, 3, 4].map(i => (
				<Card key={i} className='border-muted'>
					<CardContent className='p-6 flex items-center gap-4'>
						<Skeleton className='h-12 w-12 rounded-full shrink-0' />
						<div className='space-y-2 w-full'>
							<Skeleton className='h-3 w-24' />
							<Skeleton className='h-6 w-16' />
						</div>
					</CardContent>
				</Card>
			))}
		</div>

		{/* Main Content Skeleton */}
		<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
			{/* Lessons Column */}
			<div className='lg:col-span-2 space-y-4'>
				<Skeleton className='h-[400px] w-full rounded-xl' />
			</div>
			{/* Messages Column */}
			<div className='lg:col-span-1 space-y-4'>
				<Skeleton className='h-[400px] w-full rounded-xl' />
			</div>
		</div>
	</div>
)

export default function MentorDashboard() {
	const router = useRouter()

	const [loading, setLoading] = useState(true)
	const [userData, setUserData] = useState(null)
	const [stats, setStats] = useState({
		totalLessons: 0,
		completedLessons: 0,
		totalStudents: 0,
		rating: 4.9,
	})
	const [todayLessons, setTodayLessons] = useState([])
	const [recentMessages, setRecentMessages] = useState([])

	useEffect(() => {
		let isMounted = true

		const fetchDashboardData = async () => {
			try {
				// Promise.allSettled bitta xatolik boshqalarini to'xtatib qo'ymasligini ta'minlaydi
				const results = await Promise.allSettled([
					api.get('/auth/me'),
					api.get('/mentor/kpi/stats'),
					api.get('/mentor/lessons'),
					api.get('/messages/conversations'),
				])

				if (!isMounted) return

				const [meRes, statsRes, lessonsRes, messagesRes] = results

				if (meRes.status === 'fulfilled' && meRes.value.data.success) {
					setUserData(meRes.value.data.user)
				}

				if (statsRes.status === 'fulfilled' && statsRes.value.data?.success) {
					setStats(statsRes.value.data.stats)
				}

				if (
					lessonsRes.status === 'fulfilled' &&
					lessonsRes.value.data?.success
				) {
					const allLessons = lessonsRes.value.data.lessons || []
					const today = new Date().toISOString().split('T')[0]
					setTodayLessons(
						allLessons.filter(l => l.date && l.date.startsWith(today)),
					)
				}

				if (
					messagesRes.status === 'fulfilled' &&
					messagesRes.value.data?.success
				) {
					const activeConversations = (
						messagesRes.value.data.conversations || []
					)
						.filter(c => c.lastMessage)
						.slice(0, 3)
					setRecentMessages(activeConversations)
				}
			} catch (error) {
				console.error('Dashboardni yuklashda xato:', error)
			} finally {
				if (isMounted) setLoading(false)
			}
		}

		fetchDashboardData()
		return () => {
			isMounted = false
		} // Cleanup function to prevent state updates on unmounted component
	}, [])

	// Animatsiya variantlari
	const containerVars = {
		hidden: { opacity: 0 },
		visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
	}
	const itemVars = {
		hidden: { opacity: 0, y: 15 },
		visible: { opacity: 1, y: 0 },
	}

	if (loading) return <DashboardSkeleton />

	// Pending Ekrani (Mentor tasdiqlanmagan holat)
	if (userData && !userData.isMentor) {
		return (
			<div className='flex flex-col items-center justify-center min-h-[70vh] text-center max-w-md mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500'>
				<div className='w-24 h-24 bg-orange-500/10 rounded-full flex items-center justify-center relative'>
					<div
						className='absolute inset-0 border-4 border-orange-500/20 rounded-full animate-ping'
						style={{ animationDuration: '3s' }}
					/>
					<Hourglass className='h-10 w-10 text-orange-500 animate-pulse' />
				</div>
				<div>
					<h2 className='text-2xl font-bold mb-2'>
						Arizangiz ko'rib chiqilmoqda
					</h2>
					<p className='text-muted-foreground text-sm'>
						Rezyumeingiz admin tomonidan tekshirilmoqda. Tasdiqlangach, bu yerda
						o'z faoliyatingizni boshlashingiz mumkin.
					</p>
				</div>
				<div className='bg-card w-full border rounded-xl p-4 flex items-center justify-between shadow-sm'>
					<div className='flex items-center gap-3'>
						<div className='bg-primary/10 p-2 rounded-full'>
							<CheckCircle2 className='h-5 w-5 text-primary' />
						</div>
						<div className='text-left'>
							<p className='text-sm font-semibold'>Rezyume yuborildi</p>
							<p className='text-xs text-muted-foreground'>
								Ma'lumotlar kiritildi
							</p>
						</div>
					</div>
				</div>
				<div className='bg-orange-500/5 w-full border border-orange-500/20 rounded-xl p-4 flex items-center justify-between shadow-sm'>
					<div className='flex items-center gap-3'>
						<div className='bg-orange-500/10 p-2 rounded-full'>
							<Hourglass className='h-5 w-5 text-orange-600' />
						</div>
						<div className='text-left'>
							<p className='text-sm font-semibold text-orange-700'>
								Kutish jarayoni
							</p>
							<p className='text-xs text-orange-600/70'>Admin javob bermoqda</p>
						</div>
					</div>
					<Badge className='bg-orange-500 hover:bg-orange-600 text-white border-none shadow-none text-[10px] px-2 py-0.5'>
						Jarayonda
					</Badge>
				</div>
			</div>
		)
	}

	return (
		<motion.div
			initial='hidden'
			animate='visible'
			variants={containerVars}
			className='space-y-6 max-w-6xl mx-auto pb-8'
		>
			{/* HEADER */}
			<motion.div
				variants={itemVars}
				className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'
			>
				<div>
					<h1 className='text-2xl sm:text-3xl font-bold tracking-tight text-foreground'>
						Xush kelibsiz, {userData?.firstName || 'Ustoz'}!
					</h1>
					<p className='text-muted-foreground mt-1'>
						Bugun yana kimlargadir yangi bilimlarni ulashish vaqti keldi.
					</p>
				</div>
				<Button
					onClick={() => router.push('/mentor/lessons')}
					className='shrink-0 gap-2 shadow-sm'
				>
					<Video className='h-4 w-4' /> Darslarga o'tish
				</Button>
			</motion.div>

			{/* STATS GRID */}
			<motion.div
				variants={itemVars}
				className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
			>
				{[
					{
						title: "Jami o'quvchilar",
						val: stats?.totalStudents || 0,
						suf: 'ta',
						icon: Users,
						color: 'blue',
					},
					{
						title: "O'rtacha reyting",
						val: stats?.rating ? stats.rating.toFixed(1) : '4.9',
						suf: '/ 5.0',
						icon: Star,
						color: 'amber',
					},
					{
						title: "O'tilgan darslar",
						val: stats?.completedLessons || 0,
						suf: 'ta',
						icon: BookOpen,
						color: 'purple',
					},
					{
						title: 'Rejadagi darslar',
						val: Math.max(
							0,
							(stats?.totalLessons || 0) - (stats?.completedLessons || 0),
						),
						suf: 'ta',
						icon: CheckCircle2,
						color: 'emerald',
					},
				].map((s, i) => {
					const Icon = s.icon
					return (
						<Card
							key={i}
							className='border-muted shadow-sm hover:shadow-md transition-shadow'
						>
							<CardContent className='p-6 flex items-center gap-4'>
								<div
									className={cn(
										'p-3 rounded-full shrink-0',
										`bg-${s.color}-50 dark:bg-${s.color}-500/10`,
									)}
								>
									<Icon
										className={cn(
											'h-6 w-6',
											`text-${s.color}-500 dark:text-${s.color}-400`,
										)}
									/>
								</div>
								<div>
									<p className='text-[11px] font-bold uppercase tracking-wider text-muted-foreground'>
										{s.title}
									</p>
									<h3 className='text-2xl font-black text-foreground mt-0.5'>
										{s.val}{' '}
										<span className='text-sm text-muted-foreground font-semibold'>
											{s.suf}
										</span>
									</h3>
								</div>
							</CardContent>
						</Card>
					)
				})}
			</motion.div>

			{/* CONTENT GRID */}
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* CHAP TOMON: BUGUNGI DARSLAR (2/3) */}
				<motion.div variants={itemVars} className='lg:col-span-2'>
					<Card className='shadow-sm h-full flex flex-col'>
						<CardHeader className='pb-4 border-b flex flex-row items-center justify-between'>
							<CardTitle className='text-lg'>Bugungi darslar</CardTitle>
							<Badge variant='secondary' className='font-bold'>
								Jami: {todayLessons.length}
							</Badge>
						</CardHeader>
						<CardContent className='flex-1 p-0'>
							<div className='divide-y divide-muted max-h-[450px] overflow-y-auto custom-scrollbar'>
								{todayLessons.length === 0 ? (
									<div className='py-12 px-6 text-center text-muted-foreground flex flex-col items-center gap-2'>
										<div className='p-4 bg-muted/50 rounded-full mb-2'>
											<BookOpen className='w-8 h-8 text-muted-foreground/50' />
										</div>
										<p className='font-medium'>
											Bugun uchun darslar belgilanmagan.
										</p>
										<p className='text-sm'>Yaxshi dam oling! </p>
									</div>
								) : (
									todayLessons.map((lesson, idx) => (
										<div
											key={lesson._id || idx}
											className='flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 hover:bg-muted/30 transition-colors gap-4 group'
										>
											<div className='flex gap-4 items-center w-full sm:w-auto'>
												<div className='bg-background border shadow-sm p-3 rounded-xl text-center min-w-[75px] group-hover:border-primary/30 transition-colors'>
													<p className='text-[10px] font-bold uppercase text-muted-foreground mb-0.5'>
														Vaqti
													</p>
													<p className='font-black text-foreground'>
														{lesson.time}
													</p>
												</div>
												<div className='space-y-1'>
													<h4 className='font-bold text-base leading-tight'>
														{lesson.title}
													</h4>
													<div className='flex items-center gap-2 text-xs text-muted-foreground font-medium'>
														<Users className='h-3.5 w-3.5' />
														{lesson.format === 'group'
															? 'Guruh darsi'
															: 'Individual'}
														<span className='opacity-50'>•</span>
														{lesson.registeredUsers?.length || 0} ishtirokchi
													</div>
												</div>
											</div>
											<Button
												onClick={() =>
													router.push(`/mentor/lessons/${lesson._id}/edit`)
												}
												variant={
													lesson.status === 'live' ? 'default' : 'secondary'
												}
												className='w-full sm:w-auto gap-2 font-semibold'
											>
												<Video className='h-4 w-4' />
												{lesson.status === 'live'
													? 'Darsga ulanish'
													: 'Tayyorlanish'}
											</Button>
										</div>
									))
								)}
							</div>
						</CardContent>
					</Card>
				</motion.div>

				{/* O'NG TOMON: XABARLAR (1/3) */}
				<motion.div variants={itemVars} className='lg:col-span-1'>
					<Card className='shadow-sm h-full flex flex-col'>
						<CardHeader className='pb-4 border-b bg-muted/20'>
							<CardTitle className='text-base flex items-center gap-2 font-bold'>
								<Bell className='h-4 w-4 text-primary' /> Oxirgi Xabarlar
							</CardTitle>
						</CardHeader>
						<CardContent className='flex-1 p-0 flex flex-col'>
							<div className='divide-y divide-muted flex-1'>
								{recentMessages.length === 0 ? (
									<div className='py-8 text-center text-sm text-muted-foreground'>
										Yangi xabarlar yo'q
									</div>
								) : (
									recentMessages.map((msg, idx) => {
										const msgTime = new Date(msg.time).toLocaleTimeString([], {
											hour: '2-digit',
											minute: '2-digit',
										})
										return (
											<div
												key={msg.id || idx}
												className='p-4 hover:bg-muted/30 transition-colors flex flex-col gap-3'
											>
												<div className='flex justify-between items-start gap-2'>
													<div className='flex gap-3 items-center min-w-0'>
														<Avatar className='h-9 w-9 border shrink-0'>
															<AvatarFallback className='bg-primary/5 text-primary text-xs font-bold'>
																{msg.name?.substring(0, 2).toUpperCase()}
															</AvatarFallback>
														</Avatar>
														<div className='min-w-0'>
															<p className='font-bold text-sm truncate'>
																{msg.name}
															</p>
															<p className='text-[10px] text-muted-foreground capitalize font-medium'>
																{msg.role}
															</p>
														</div>
													</div>
													<span className='text-[10px] font-mono text-muted-foreground shrink-0 mt-1'>
														{msgTime}
													</span>
												</div>
												<p className='text-xs text-muted-foreground bg-muted/50 p-2.5 rounded-lg truncate border border-transparent hover:border-border transition-colors cursor-default'>
													{msg.lastMessage}
												</p>
												<Button
													size='sm'
													variant='secondary'
													onClick={() => {
														sessionStorage.setItem(
															'selectedContact',
															msg.contactTargetId,
														)
														router.push('/users/messages')
													}}
													className='w-full h-8 text-xs gap-1.5'
												>
													<MessageCircle className='h-3.5 w-3.5' /> Javob yozish
												</Button>
											</div>
										)
									})
								)}
							</div>

							{recentMessages.length > 0 && (
								<div className='p-3 border-t bg-muted/10'>
									<Button
										variant='ghost'
										size='sm'
										className='w-full text-xs text-muted-foreground hover:text-foreground'
										onClick={() => router.push('/users/messages')}
									>
										Barcha xabarlar
									</Button>
								</div>
							)}
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</motion.div>
	)
}
