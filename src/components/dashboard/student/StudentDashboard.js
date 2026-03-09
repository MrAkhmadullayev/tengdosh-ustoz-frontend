'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import api from '@/lib/api'
import { useTranslation } from '@/lib/i18n'
// 🔥 Markazlashgan utils
import { getErrorMessage, getInitials } from '@/lib/utils'
import { motion } from 'framer-motion'
import {
	Award,
	BookOpen,
	Calendar,
	Clock,
	PlayCircle,
	Search,
	Smartphone,
	TrendingUp,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

// ==========================================
// 🎨 ANIMATSIYALAR
// ==========================================
const containerVars = {
	hidden: { opacity: 0 },
	show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVars = {
	hidden: { opacity: 0, y: 15 },
	show: {
		opacity: 1,
		y: 0,
		transition: { type: 'spring', stiffness: 300, damping: 24 },
	},
}

// ==========================================
// 🧩 SKELETON
// ==========================================
const DashboardSkeleton = () => (
	<div className='max-w-6xl mx-auto space-y-6 pb-8 pt-6 px-4 sm:px-6 animate-pulse'>
		<div className='flex flex-col sm:flex-row justify-between gap-4 border-b pb-6'>
			<div className='space-y-2'>
				<Skeleton className='h-8 w-64' />
				<Skeleton className='h-4 w-80' />
			</div>
			<Skeleton className='h-10 w-[180px] rounded-md' />
		</div>
		<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
			{[1, 2, 3, 4].map(i => (
				<Skeleton key={i} className='h-28 w-full rounded-xl' />
			))}
		</div>
		<div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2'>
			<div className='lg:col-span-2'>
				<Skeleton className='h-[250px] w-full rounded-xl' />
			</div>
			<div className='lg:col-span-1'>
				<Skeleton className='h-[400px] w-full rounded-xl' />
			</div>
		</div>
	</div>
)

// ==========================================
// 🚀 ASOSIY KOMPONENT
// ==========================================
export default function StudentDashboard() {
	const { t } = useTranslation()
	const router = useRouter()

	const [userData, setUserData] = useState(null)
	const [stats, setStats] = useState(null)
	const [loading, setLoading] = useState(true)

	// 1. API dan ma'lumotlarni parallel yuklash
	const fetchDashboardData = useCallback(async () => {
		try {
			setLoading(true)
			const [meRes, statsRes] = await Promise.all([
				api.get('/auth/me').catch(() => ({ data: { success: false } })),
				api
					.get('/student/dashboard/stats')
					.catch(() => ({ data: { success: false } })),
			])

			if (meRes.data?.success) setUserData(meRes.data.user)
			if (statsRes.data?.success) setStats(statsRes.data.stats)
		} catch (error) {
			toast.error(
				getErrorMessage(error, "Ma'lumotlarni yuklashda xatolik yuz berdi"),
			)
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		fetchDashboardData()
	}, [fetchDashboardData])

	// Loading
	if (loading) return <DashboardSkeleton />

	return (
		<motion.div
			variants={containerVars}
			initial='hidden'
			animate='show'
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
							name: userData?.firstName || t('auth.roleStudent'),
						})}
					</h1>
					<p className='text-muted-foreground mt-1 text-sm'>
						{t('dashboard.welcomeDesc') ||
							'Platformadagi faoliyatingiz va rejalashtirilgan darslar.'}
					</p>
				</div>
				<Button
					onClick={() => router.push('/student/mentors')}
					className='shrink-0 gap-2 shadow-sm font-semibold'
				>
					<Search className='h-4 w-4' />{' '}
					{t('dashboard.findNewMentor') || 'Yangi ustoz izlash'}
				</Button>
			</motion.div>

			{/* 📊 ASOSIY KARTALAR */}
			<motion.div
				variants={itemVars}
				className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
			>
				<Card className='shadow-sm hover:shadow-md transition-shadow'>
					<CardContent className='p-6'>
						<div className='flex items-center justify-between space-y-0 pb-2'>
							<p className='text-[11px] font-bold uppercase tracking-wider text-muted-foreground'>
								{t('dashboard.learnedTime') || "O'rganilgan Vaqt"}
							</p>
							<Clock className='h-4 w-4 text-muted-foreground' />
						</div>
						<h3 className='text-2xl font-bold text-foreground mt-1'>
							{stats?.totalHours || 0}{' '}
							<span className='text-xs text-muted-foreground font-semibold lowercase tracking-normal'>
								{t('dashboard.hours') || 'soat'}
							</span>
						</h3>
					</CardContent>
				</Card>

				<Card className='shadow-sm hover:shadow-md transition-shadow'>
					<CardContent className='p-6'>
						<div className='flex items-center justify-between space-y-0 pb-2'>
							<p className='text-[11px] font-bold uppercase tracking-wider text-muted-foreground'>
								{t('dashboard.activeLessons') || 'Faol Darslar'}
							</p>
							<BookOpen className='h-4 w-4 text-muted-foreground' />
						</div>
						<h3 className='text-2xl font-bold text-foreground mt-1'>
							{stats?.activeLessonsCount || 0}{' '}
							<span className='text-xs text-muted-foreground font-semibold lowercase tracking-normal'>
								{t('common.count') || 'ta'}
							</span>
						</h3>
					</CardContent>
				</Card>

				<Card className='shadow-sm hover:shadow-md transition-shadow'>
					<CardContent className='p-6'>
						<div className='flex items-center justify-between space-y-0 pb-2'>
							<p className='text-[11px] font-bold uppercase tracking-wider text-muted-foreground'>
								{t('dashboard.weeklyGrowth') || "Haftalik O'sish"}
							</p>
							<TrendingUp className='h-4 w-4 text-muted-foreground' />
						</div>
						<h3 className='text-2xl font-bold text-foreground mt-1'>
							{stats?.weeklyGrowth || '+0%'}
						</h3>
					</CardContent>
				</Card>

				<Card className='shadow-sm hover:shadow-md transition-shadow relative overflow-hidden bg-card'>
					<div className='absolute -right-6 -top-6 bg-primary/10 w-24 h-24 rounded-full blur-2xl pointer-events-none' />
					<CardContent className='p-6 relative z-10'>
						<div className='flex items-center justify-between space-y-0 pb-2'>
							<p className='text-[11px] font-bold uppercase tracking-wider text-muted-foreground'>
								{t('dashboard.myPlatformRank') || 'Reytingingiz'}
							</p>
							<Award className='h-4 w-4 text-amber-500' />
						</div>
						<h3 className='text-2xl font-bold text-foreground mt-1'>
							{stats?.rating || t('dashboard.none') || "Yo'q"}
						</h3>
					</CardContent>
				</Card>
			</motion.div>

			{/* 📚 ASOSIY QISM */}
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* CHAP: KEYINGI DARS */}
				<motion.div variants={itemVars} className='lg:col-span-2 space-y-6'>
					{stats?.nextLesson ? (
						<Card className='shadow-md border-primary/20 bg-card overflow-hidden'>
							<CardHeader className='pb-3 border-b bg-muted/20'>
								<div className='flex justify-between items-center'>
									<CardTitle className='text-base flex items-center gap-2'>
										<Calendar className='h-4 w-4 text-primary' />{' '}
										{t('dashboard.nextLesson') || 'Keyingi Dars'}
									</CardTitle>
									{stats.nextLesson.isLive && (
										<Badge
											variant='destructive'
											className='animate-pulse uppercase tracking-wider text-[10px] px-2 shadow-none border-transparent'
										>
											{t('dashboard.live') || 'Live'}
										</Badge>
									)}
								</div>
							</CardHeader>
							<CardContent className='p-6'>
								<div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group'>
									<div className='flex items-center gap-4 min-w-0'>
										<div className='bg-primary/10 p-3.5 rounded-xl hidden sm:flex items-center justify-center shrink-0 text-primary'>
											<Smartphone className='h-6 w-6' />
										</div>
										<div className='min-w-0'>
											<h4 className='font-bold text-lg leading-tight mb-2 truncate'>
												{stats.nextLesson.title}
											</h4>
											<div className='flex flex-wrap items-center gap-2 text-xs text-muted-foreground font-medium'>
												<Avatar className='h-5 w-5 border'>
													<AvatarFallback className='text-[9px] bg-muted text-foreground'>
														{getInitials(stats.nextLesson.mentorName, '')}
													</AvatarFallback>
												</Avatar>
												<span className='truncate'>
													{t('dashboard.mentor') || 'Ustoz'}:{' '}
													<span className='text-foreground'>
														{stats.nextLesson.mentorName}
													</span>
												</span>
												<span className='opacity-50 hidden sm:inline'>•</span>
												<span className='capitalize'>
													{stats.nextLesson.mentorFormat}
												</span>
											</div>
											<Badge
												variant='secondary'
												className='mt-3 font-mono font-medium shadow-none'
											>
												{t('dashboard.time') || 'Vaqt'}: {stats.nextLesson.time}
											</Badge>
										</div>
									</div>
									<Button
										size='lg'
										className='w-full sm:w-auto shrink-0 font-semibold'
										onClick={() =>
											router.push(
												`/student/lessons/${stats.nextLesson.id}/watch`,
											)
										}
									>
										<PlayCircle className='h-4 w-4 mr-2' />{' '}
										{t('dashboard.joinLesson') || 'Darsga Kirish'}
									</Button>
								</div>
							</CardContent>
						</Card>
					) : (
						<Card className='border-dashed bg-muted/10 shadow-none'>
							<CardContent className='py-16 text-center text-muted-foreground flex flex-col items-center justify-center gap-2'>
								<div className='bg-background p-4 rounded-full border shadow-sm mb-2'>
									<Calendar className='h-6 w-6 opacity-50' />
								</div>
								<p className='font-bold text-foreground'>
									{t('dashboard.noLessonsPlanned') ||
										"Rejalashtirilgan darslar yo'q"}
								</p>
								<p className='text-sm max-w-xs'>
									{t('dashboard.startLearning') ||
										"Yangi bilimlarni o'rganish uchun darslarga yoziling."}
								</p>
								<Button
									variant='outline'
									onClick={() => router.push('/student/mentors')}
									className='mt-4 font-medium'
								>
									{t('dashboard.searchNewLesson') || "Ustozlarni ko'rish"}
								</Button>
							</CardContent>
						</Card>
					)}
				</motion.div>

				{/* O'NG: TAVSIYA ETILGAN USTOZLAR */}
				<motion.div variants={itemVars} className='lg:col-span-1'>
					<Card className='shadow-sm h-full flex flex-col bg-card'>
						<CardHeader className='pb-4 border-b bg-muted/20'>
							<CardTitle className='text-base'>
								{t('dashboard.recommendations') || 'Tavsiya etilgan ustozlar'}
							</CardTitle>
							<CardDescription className='text-xs'>
								{t('dashboard.recommendationsDesc') ||
									"Sizning yo'nalishingizga mos mutaxassislar"}
							</CardDescription>
						</CardHeader>
						<CardContent className='flex-1 p-0 overflow-y-auto no-scrollbar'>
							<div className='divide-y'>
								{stats?.recommendedMentors &&
								stats.recommendedMentors.length > 0 ? (
									stats.recommendedMentors.map((mentor, idx) => (
										<div
											key={mentor.id || idx}
											onClick={() =>
												router.push(`/student/mentors/${mentor.id}`)
											}
											className='flex items-center justify-between p-4 hover:bg-muted/30 transition-colors cursor-pointer group'
										>
											<div className='flex items-center gap-3 min-w-0'>
												<Avatar className='h-10 w-10 border shrink-0'>
													<AvatarFallback className='text-[10px] font-bold bg-muted text-foreground'>
														{getInitials(mentor.name, '')}
													</AvatarFallback>
												</Avatar>
												<div className='min-w-0'>
													<p className='font-semibold text-sm leading-tight truncate group-hover:text-primary transition-colors'>
														{mentor.name}
													</p>
													<p className='text-xs text-muted-foreground truncate mt-0.5'>
														{mentor.skill}
													</p>
												</div>
											</div>
											<Badge
												variant='outline'
												className='text-amber-500 bg-amber-500/10 border-transparent shadow-none shrink-0 ml-2'
											>
												★ {mentor.rating}
											</Badge>
										</div>
									))
								) : (
									<div className='py-12 flex flex-col items-center justify-center text-center text-muted-foreground text-sm opacity-60'>
										<Search className='h-8 w-8 mb-2' />
										{t('dashboard.noRecommendations') || "Tavsiyalar yo'q"}
									</div>
								)}
							</div>
						</CardContent>
						{stats?.recommendedMentors &&
							stats.recommendedMentors.length > 0 && (
								<CardFooter className='p-3 border-t mt-auto bg-muted/10'>
									<Button
										variant='ghost'
										size='sm'
										onClick={() => router.push('/student/mentors')}
										className='w-full text-xs font-semibold'
									>
										{t('dashboard.viewAllMentors') || "Barchasini ko'rish"}
									</Button>
								</CardFooter>
							)}
					</Card>
				</motion.div>
			</div>
		</motion.div>
	)
}
