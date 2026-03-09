'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import api from '@/lib/api'
import { useTranslation } from '@/lib/i18n'
// 🔥 utils'dan markaziy funksiyalarni olamiz
import { getInitials } from '@/lib/utils'
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
import { useCallback, useEffect, useMemo, useState } from 'react'

// ==========================================
// 🎨 ANIMATSIYALAR
// ==========================================
const containerVars = {
	hidden: { opacity: 0 },
	visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}
const itemVars = {
	hidden: { opacity: 0, y: 15 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { type: 'spring', stiffness: 300, damping: 24 },
	},
}

// ==========================================
// 🧩 SKELETON
// ==========================================
const DashboardSkeleton = () => (
	<div className='space-y-6 max-w-6xl mx-auto pb-8 pt-6 px-4 sm:px-6 animate-pulse'>
		<div className='flex flex-col sm:flex-row justify-between gap-4 border-b pb-6'>
			<div className='space-y-2'>
				<Skeleton className='h-8 w-64' />
				<Skeleton className='h-4 w-80' />
			</div>
			<Skeleton className='h-10 w-40 rounded-md' />
		</div>
		<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
			{[1, 2, 3, 4].map(i => (
				<Skeleton key={i} className='h-28 w-full rounded-xl' />
			))}
		</div>
		<div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2'>
			<div className='lg:col-span-2 space-y-4'>
				<Skeleton className='h-[400px] w-full rounded-xl' />
			</div>
			<div className='lg:col-span-1 space-y-4'>
				<Skeleton className='h-[400px] w-full rounded-xl' />
			</div>
		</div>
	</div>
)

// ==========================================
// 🚀 ASOSIY KOMPONENT
// ==========================================
export default function MentorDashboard() {
	const { t } = useTranslation()
	const router = useRouter()

	const [loading, setLoading] = useState(true)
	const [userData, setUserData] = useState(null)
	const [stats, setStats] = useState({
		totalLessons: 0,
		completedLessons: 0,
		totalStudents: 0,
		rating: 0,
	})
	const [todayLessons, setTodayLessons] = useState([])
	const [recentMessages, setRecentMessages] = useState([])

	// API chaqiruvlari (Parallel)
	const fetchDashboardData = useCallback(async () => {
		try {
			const results = await Promise.allSettled([
				api.get('/auth/me'),
				api.get('/mentor/kpi/stats'),
				api.get('/mentor/lessons'),
				api.get('/messages/conversations'),
			])

			const [meRes, statsRes, lessonsRes, messagesRes] = results

			if (meRes.status === 'fulfilled' && meRes.value.data.success) {
				setUserData(meRes.value.data.user)
			}

			if (statsRes.status === 'fulfilled' && statsRes.value.data?.success) {
				setStats(statsRes.value.data.stats)
			}

			if (lessonsRes.status === 'fulfilled' && lessonsRes.value.data?.success) {
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
				const activeConversations = (messagesRes.value.data.conversations || [])
					.filter(c => c.lastMessage)
					.slice(0, 3)
				setRecentMessages(activeConversations)
			}
		} catch (error) {
			console.error('Mentor Dashboard error:', error)
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		fetchDashboardData()
	}, [fetchDashboardData])

	const roleLabel = useMemo(
		() => ({
			admin: t('auth.roleAdmin') || 'Admin',
			mentor: t('auth.roleMentor') || 'Mentor',
			student: t('auth.roleStudent') || 'Talaba',
		}),
		[t],
	)

	// Loading
	if (loading) return <DashboardSkeleton />

	// ⚠️ Tasdiq kutilayotgan Mentor holati
	if (userData && !userData.isMentor) {
		return (
			<div className='flex flex-col items-center justify-center min-h-[70vh] text-center max-w-md mx-auto space-y-6 px-4'>
				<div className='w-24 h-24 bg-orange-500/10 rounded-full flex items-center justify-center relative'>
					<div
						className='absolute inset-0 border-4 border-orange-500/20 rounded-full animate-ping'
						style={{ animationDuration: '3s' }}
					/>
					<Hourglass className='h-10 w-10 text-orange-500 animate-pulse' />
				</div>
				<div>
					<h2 className='text-2xl font-bold tracking-tight mb-2'>
						{t('dashboard.pendingTitle') || "Arizangiz ko'rib chiqilmoqda"}
					</h2>
					<p className='text-muted-foreground text-sm'>
						{t('dashboard.pendingDesc') ||
							"Sizning mentorlik arizangiz hozirda adminlar tomonidan ko'rib chiqilmoqda. Tasdiqlangach barcha funksiyalar ochiladi."}
					</p>
				</div>

				<div className='w-full space-y-3 mt-4'>
					<div className='bg-card border rounded-xl p-4 flex items-center justify-between shadow-sm'>
						<div className='flex items-center gap-3'>
							<div className='bg-green-500/10 p-2 rounded-full'>
								<CheckCircle2 className='h-5 w-5 text-green-600' />
							</div>
							<div className='text-left'>
								<p className='text-sm font-semibold'>
									{t('dashboard.resumeSent') || 'Rezyume yuborildi'}
								</p>
								<p className='text-xs text-muted-foreground'>
									{t('dashboard.dataEntered') ||
										"Barcha ma'lumotlar kiritilgan"}
								</p>
							</div>
						</div>
					</div>
					<div className='bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-xl p-4 flex items-center justify-between shadow-sm'>
						<div className='flex items-center gap-3'>
							<div className='bg-orange-500/10 p-2 rounded-full'>
								<Hourglass className='h-5 w-5 text-orange-600' />
							</div>
							<div className='text-left'>
								<p className='text-sm font-semibold text-orange-700 dark:text-orange-400'>
									{t('dashboard.waitingProcess') || 'Kutilmoqda'}
								</p>
								<p className='text-xs text-orange-600/70 dark:text-orange-400/70'>
									{t('dashboard.adminReplying') ||
										'Admin tasdiqlashi kutilmoqda'}
								</p>
							</div>
						</div>
						<Badge className='bg-orange-500 hover:bg-orange-600 text-white border-none shadow-none text-[10px] px-2 py-0.5 uppercase tracking-wider'>
							{t('dashboard.inProgress') || 'Jarayonda'}
						</Badge>
					</div>
				</div>
			</div>
		)
	}

	// Asosiy Mentor Dashboard Stats
	const statsConfig = [
		{
			title: t('dashboard.totalStudents') || 'Jami Talabalar',
			val: stats?.totalStudents || 0,
			suf: t('common.count') || 'ta',
			icon: Users,
		},
		{
			title: t('dashboard.averageRating') || "O'rtacha Reyting",
			val: stats?.rating ? stats.rating.toFixed(1) : '0.0',
			suf: '/ 5.0',
			icon: Star,
		},
		{
			title: t('dashboard.lessonsTaught') || "O'tilgan Darslar",
			val: stats?.completedLessons || 0,
			suf: t('common.count') || 'ta',
			icon: BookOpen,
		},
		{
			title: t('dashboard.plannedLessons') || 'Rejadagi Darslar',
			val: Math.max(
				0,
				(stats?.totalLessons || 0) - (stats?.completedLessons || 0),
			),
			suf: t('common.count') || 'ta',
			icon: CheckCircle2,
		},
	]

	return (
		<motion.div
			initial='hidden'
			animate='visible'
			variants={containerVars}
			className='space-y-6 max-w-6xl mx-auto pb-12 pt-6 px-4 sm:px-6'
		>
			{/* 🏷️ HEADER */}
			<motion.div
				variants={itemVars}
				className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6'
			>
				<div>
					<h1 className='text-2xl sm:text-3xl font-bold tracking-tight text-foreground'>
						{t('dashboard.welcome', {
							name: userData?.firstName || t('auth.roleMentor'),
						})}
					</h1>
					<p className='text-muted-foreground mt-1 text-sm'>
						{t('dashboard.welcomeMentorDesc') ||
							'Bugungi darslar va faoliyatingiz xulosasi.'}
					</p>
				</div>
				<Button
					onClick={() => router.push('/mentor/lessons')}
					className='shrink-0 shadow-sm font-semibold'
				>
					<Video className='h-4 w-4 mr-2' />{' '}
					{t('dashboard.goToLessons') || "Darslarga o'tish"}
				</Button>
			</motion.div>

			{/* 📊 ASOSIY KARTALAR */}
			<motion.div
				variants={itemVars}
				className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
			>
				{statsConfig.map((s, i) => (
					<Card
						key={i}
						className='shadow-sm hover:shadow-md transition-shadow bg-card'
					>
						<CardContent className='p-6'>
							<div className='flex items-center justify-between space-y-0 pb-2'>
								<p className='text-[11px] font-bold uppercase tracking-wider text-muted-foreground'>
									{s.title}
								</p>
								<s.icon className='h-4 w-4 text-muted-foreground' />
							</div>
							<h3 className='text-2xl font-black text-foreground mt-1'>
								{s.val}{' '}
								<span className='text-xs text-muted-foreground font-semibold lowercase tracking-normal'>
									{s.suf}
								</span>
							</h3>
						</CardContent>
					</Card>
				))}
			</motion.div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* 📚 BUGUNGI DARSLAR (Chap va O'rta Qism) */}
				<motion.div variants={itemVars} className='lg:col-span-2'>
					<Card className='shadow-sm h-full flex flex-col bg-card'>
						<CardHeader className='pb-4 border-b bg-muted/20'>
							<div className='flex items-center justify-between'>
								<CardTitle className='text-base flex items-center gap-2'>
									<BookOpen className='w-4 h-4 text-primary' />{' '}
									{t('dashboard.todayLessons') || 'Bugungi darslar'}
								</CardTitle>
								<Badge
									variant='secondary'
									className='font-bold text-xs bg-background shadow-sm'
								>
									{todayLessons.length} {t('common.count') || 'ta'}
								</Badge>
							</div>
						</CardHeader>
						<CardContent className='flex-1 p-0'>
							<div className='divide-y divide-border max-h-[450px] overflow-y-auto no-scrollbar'>
								{todayLessons.length === 0 ? (
									<div className='py-16 px-6 text-center text-muted-foreground flex flex-col items-center'>
										<BookOpen className='w-12 h-12 mb-3 opacity-20' />
										<p className='font-semibold text-foreground mb-1'>
											{t('dashboard.noLessonsToday') ||
												"Bugun uchun darslar yo'q"}
										</p>
										<p className='text-sm'>
											{t('dashboard.restWell') ||
												'Mirqiqib dam oling yoki yangi dars rejalashtiring.'}
										</p>
									</div>
								) : (
									todayLessons.map((lesson, idx) => (
										<div
											key={lesson._id || idx}
											className='flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 hover:bg-muted/30 transition-colors gap-4'
										>
											<div className='flex gap-4 items-center w-full sm:w-auto'>
												<div className='bg-background border shadow-sm p-3 rounded-lg text-center min-w-[70px]'>
													<p className='text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5'>
														{t('dashboard.time') || 'Vaqt'}
													</p>
													<p className='font-black text-sm text-foreground'>
														{lesson.time}
													</p>
												</div>
												<div className='space-y-1'>
													<h4 className='font-bold text-sm leading-tight text-foreground'>
														{lesson.title}
													</h4>
													<div className='flex items-center gap-2 text-xs text-muted-foreground font-medium'>
														<Users className='h-3.5 w-3.5' />
														{lesson.format === 'group'
															? t('dashboard.groupLesson') || 'Guruh'
															: t('dashboard.individualLesson') || 'Yakka'}
														<span className='opacity-50'>•</span>
														{lesson.registeredUsers?.length || 0} ta o'quvchi
													</div>
												</div>
											</div>
											<Button
												onClick={() =>
													router.push(`/mentor/lessons/${lesson._id}/edit`)
												}
												variant={
													lesson.status === 'live' ? 'default' : 'outline'
												}
												className='w-full sm:w-auto gap-2 text-xs font-bold shadow-sm'
											>
												<Video className='h-3.5 w-3.5' />
												{lesson.status === 'live'
													? t('dashboard.join') || "Qo'shilish"
													: t('dashboard.prepare') || 'Tayyorlanish'}
											</Button>
										</div>
									))
								)}
							</div>
						</CardContent>
					</Card>
				</motion.div>

				{/* 💬 SO'NGGI XABARLAR (O'ng Qism) */}
				<motion.div variants={itemVars} className='lg:col-span-1'>
					<Card className='shadow-sm h-full flex flex-col bg-card'>
						<CardHeader className='pb-4 border-b bg-muted/20'>
							<CardTitle className='text-base flex items-center gap-2'>
								<Bell className='h-4 w-4 text-primary' />{' '}
								{t('dashboard.recentMessages') || "So'nggi xabarlar"}
							</CardTitle>
						</CardHeader>
						<CardContent className='flex-1 p-0 flex flex-col'>
							<div className='divide-y divide-border flex-1'>
								{recentMessages.length === 0 ? (
									<div className='py-16 text-center text-sm text-muted-foreground flex flex-col items-center'>
										<MessageCircle className='w-10 h-10 mb-2 opacity-20' />
										<p>{t('dashboard.noMessages') || "Xabarlar yo'q"}</p>
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
																{getInitials(msg.name, '')}
															</AvatarFallback>
														</Avatar>
														<div className='min-w-0'>
															<p className='font-bold text-sm truncate'>
																{msg.name}
															</p>
															<p className='text-[10px] text-muted-foreground capitalize font-medium'>
																{roleLabel[msg.role] || msg.role}
															</p>
														</div>
													</div>
													<span className='text-[10px] font-mono text-muted-foreground shrink-0 mt-1'>
														{msgTime}
													</span>
												</div>
												<p className='text-xs text-muted-foreground bg-muted/50 p-2.5 rounded-lg truncate border border-transparent cursor-default'>
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
													className='w-full h-8 text-[11px] font-bold uppercase tracking-wider gap-1.5 shadow-none'
												>
													<MessageCircle className='h-3.5 w-3.5' />{' '}
													{t('dashboard.reply') || 'Javob yozish'}
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
										className='w-full text-xs font-semibold text-muted-foreground hover:text-foreground'
										onClick={() => router.push('/users/messages')}
									>
										{t('dashboard.viewAllMessages') ||
											"Barcha xabarlarni ko'rish"}
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
