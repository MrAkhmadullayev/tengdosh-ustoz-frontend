'use client'

import { Badge } from '@/components/ui/badge'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import api from '@/lib/api'
import { useTranslation } from '@/lib/i18n'
// 🔥 Markazlashgan utilitalar
import { cn, getErrorMessage, getInitials } from '@/lib/utils'
import { motion } from 'framer-motion'
import {
	ArrowDownRight,
	ArrowUpRight,
	BookOpen,
	CheckCircle2,
	Clock,
	Heart,
	Star,
	UserCheck,
	Users,
	UserX,
	XCircle,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'

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
	<div className='max-w-6xl mx-auto space-y-6 pb-12 pt-6 px-4 sm:px-6 animate-pulse'>
		<div className='flex flex-col md:flex-row justify-between gap-4 border-b pb-6'>
			<div className='space-y-2'>
				<Skeleton className='h-8 w-64' />
				<Skeleton className='h-4 w-80' />
			</div>
			<Skeleton className='h-10 w-[250px] rounded-md' />
		</div>
		<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
			{[1, 2, 3, 4].map(i => (
				<Skeleton key={i} className='h-28 w-full rounded-xl' />
			))}
		</div>
		<div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4'>
			<Skeleton className='h-[400px] w-full rounded-xl' />
			<div className='space-y-4 flex flex-col h-full'>
				<div className='flex gap-4'>
					<Skeleton className='h-24 w-1/2 rounded-xl' />
					<Skeleton className='h-24 w-1/2 rounded-xl' />
				</div>
				<Skeleton className='flex-1 w-full rounded-xl min-h-[250px]' />
			</div>
		</div>
	</div>
)

// ==========================================
// 🚀 ASOSIY KOMPONENT
// ==========================================
export default function StudentKPIDashboard() {
	const { t } = useTranslation()
	const [stats, setStats] = useState(null)
	const [loading, setLoading] = useState(true)
	const [timeRange, setTimeRange] = useState('monthly')

	const timeRanges = useMemo(
		() => [
			{ key: 'daily', label: t('kpi.daily') || 'Kunlik' },
			{ key: 'monthly', label: t('kpi.monthly') || 'Oylik' },
			{ key: 'yearly', label: t('kpi.yearly') || 'Yillik' },
		],
		[t],
	)

	// 1. API orqali ma'lumot yuklash
	const fetchKpi = useCallback(async range => {
		try {
			setLoading(true)
			const res = await api
				.get(`/student/kpi/stats?range=${range}`)
				.catch(() => ({ data: { success: false } }))
			if (res?.data?.success) {
				setStats(res.data.stats)
			}
		} catch (error) {
			toast.error(getErrorMessage(error, 'Statistikalarni yuklashda xatolik'))
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		fetchKpi(timeRange)
	}, [timeRange, fetchKpi])

	const getTrend = useCallback(change => {
		if (!change) return 'up'
		return change.toString().startsWith('-') ? 'down' : 'up'
	}, [])

	if (loading && !stats) return <DashboardSkeleton />

	return (
		<motion.div
			variants={containerVars}
			initial='hidden'
			animate='show'
			className='max-w-6xl mx-auto space-y-6 pb-12 pt-6 px-4 sm:px-6'
		>
			{/* 🏷️ HEADER */}
			<motion.div
				variants={itemVars}
				className='flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6'
			>
				<div>
					<h1 className='text-2xl sm:text-3xl font-bold tracking-tight text-foreground'>
						{t('kpi.studentTitle') || "O'quvchi KPI"}
					</h1>
					<div className='flex items-center gap-2 mt-1'>
						<p className='text-sm text-muted-foreground'>
							{t('kpi.studentDesc') || 'Darslar, davomat va faollik tahlili'}
						</p>
						{loading && (
							<span className='flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse' />
						)}
					</div>
				</div>

				<div className='flex items-center bg-muted rounded-md p-1 border shadow-sm'>
					{timeRanges.map(r => (
						<button
							key={r.key}
							onClick={() => setTimeRange(r.key)}
							disabled={loading}
							className={cn(
								'px-4 py-1.5 rounded-sm text-sm font-medium transition-all disabled:opacity-50',
								timeRange === r.key
									? 'bg-background text-foreground shadow-sm'
									: 'text-muted-foreground hover:text-foreground',
							)}
						>
							{r.label}
						</button>
					))}
				</div>
			</motion.div>

			{/* 📊 ASOSIY KARTALAR */}
			<motion.div
				variants={itemVars}
				className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
			>
				{/* Attended Lessons */}
				<Card className='shadow-sm hover:shadow-md transition-shadow'>
					<CardContent className='p-6'>
						<div className='flex justify-between items-start'>
							<div className='space-y-1'>
								<p className='text-[11px] font-bold uppercase tracking-wider text-muted-foreground'>
									{t('kpi.attendedLessons') || 'Qatnashilgan darslar'}
								</p>
								<div className='flex items-center gap-2.5 pt-1'>
									<h2 className='text-3xl font-bold text-foreground'>
										{stats?.attendedCount || 0}
									</h2>
									{stats?.lessonsChange && (
										<span
											className={cn(
												'flex items-center text-xs font-bold',
												getTrend(stats?.lessonsChange) === 'up'
													? 'text-green-600'
													: 'text-destructive',
											)}
										>
											{getTrend(stats?.lessonsChange) === 'up' ? (
												<ArrowUpRight className='w-3 h-3 mr-0.5' />
											) : (
												<ArrowDownRight className='w-3 h-3 mr-0.5' />
											)}
											{stats?.lessonsChange}
										</span>
									)}
								</div>
							</div>
							<UserCheck className='w-5 h-5 text-muted-foreground' />
						</div>
						<p className='mt-4 text-[11px] font-medium text-muted-foreground'>
							{t('kpi.activeParticipation') || 'Faol ishtirok'}
						</p>
					</CardContent>
				</Card>

				{/* Missed Lessons */}
				<Card className='shadow-sm hover:shadow-md transition-shadow'>
					<CardContent className='p-6'>
						<div className='flex justify-between items-start'>
							<div className='space-y-1'>
								<p className='text-[11px] font-bold uppercase tracking-wider text-muted-foreground'>
									{t('kpi.missedLessons') || 'Qoldirilgan darslar'}
								</p>
								<div className='pt-1'>
									<h2 className='text-3xl font-bold text-destructive'>
										{stats?.missedCount || 0}
									</h2>
								</div>
							</div>
							<UserX className='w-5 h-5 text-muted-foreground' />
						</div>
						<p className='mt-4 text-[11px] font-medium text-muted-foreground'>
							{t('kpi.missedDescription') || "Ehtiyot bo'ling"}
						</p>
					</CardContent>
				</Card>

				{/* Followed Mentors */}
				<Card className='shadow-sm hover:shadow-md transition-shadow'>
					<CardContent className='p-6'>
						<div className='flex justify-between items-start'>
							<div className='space-y-1'>
								<p className='text-[11px] font-bold uppercase tracking-wider text-muted-foreground'>
									{t('kpi.followedMentors') || 'Kuzatilgan mentorlar'}
								</p>
								<div className='pt-1'>
									<h2 className='text-3xl font-bold text-foreground'>
										{stats?.followedMentorsCount || 0}
									</h2>
								</div>
							</div>
							<Heart className='w-5 h-5 text-muted-foreground' />
						</div>
						<p className='mt-4 text-[11px] font-medium text-muted-foreground'>
							{t('kpi.followedDescription') || 'Sevimli ustozlar'}
						</p>
					</CardContent>
				</Card>

				{/* Completion Rate */}
				<Card className='shadow-sm hover:shadow-md transition-shadow'>
					<CardContent className='p-6'>
						<div className='flex justify-between items-start'>
							<div className='space-y-1'>
								<p className='text-[11px] font-bold uppercase tracking-wider text-muted-foreground'>
									{t('kpi.completionRate') || 'Samaradorlik'}
								</p>
								<div className='pt-1'>
									<h2 className='text-3xl font-bold text-foreground'>
										{stats?.completionRate || 0}%
									</h2>
								</div>
							</div>
							<CheckCircle2 className='w-5 h-5 text-muted-foreground' />
						</div>
						<div className='mt-4 h-1.5 w-full bg-muted rounded-full overflow-hidden'>
							<motion.div
								initial={{ width: 0 }}
								animate={{ width: `${stats?.completionRate || 0}%` }}
								transition={{ duration: 1, ease: 'easeOut' }}
								className='h-full bg-primary'
							/>
						</div>
					</CardContent>
				</Card>
			</motion.div>

			{/* 🗂️ ASOSIY KONTENT */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				{/* Davomat tarixi */}
				<motion.div variants={itemVars}>
					<Card className='shadow-sm border-border h-full flex flex-col bg-card'>
						<CardHeader className='bg-muted/20 border-b pb-4 shrink-0'>
							<CardTitle className='text-base flex items-center gap-2'>
								<BookOpen className='w-4 h-4 text-muted-foreground' />{' '}
								{t('kpi.attendanceHistory') || 'Davomat Tarixi'}
							</CardTitle>
							<CardDescription className='text-xs'>
								{t('kpi.attendanceHistoryDesc') ||
									"So'nggi darslardagi holatingiz"}
							</CardDescription>
						</CardHeader>
						<CardContent className='p-0 flex-1 overflow-y-auto max-h-[500px] custom-scrollbar'>
							<div className='divide-y divide-border'>
								{stats?.lessonsAttendanceDetail?.length > 0 ? (
									stats.lessonsAttendanceDetail.map((lesson, idx) => (
										<div
											key={lesson.id || idx}
											className='p-4 hover:bg-muted/30 transition-colors flex items-center justify-between group'
										>
											<div className='flex items-center gap-3 flex-1 min-w-0'>
												<div
													className={cn(
														'w-9 h-9 rounded-md flex items-center justify-center shrink-0 transition-colors',
														lesson.isAttended
															? 'bg-green-500/10 text-green-600'
															: lesson.hasRecord
																? 'bg-destructive/10 text-destructive'
																: 'bg-muted text-muted-foreground',
													)}
												>
													{lesson.isAttended ? (
														<CheckCircle2 className='w-4 h-4' />
													) : lesson.hasRecord ? (
														<XCircle className='w-4 h-4' />
													) : (
														<Clock className='w-4 h-4' />
													)}
												</div>
												<div className='min-w-0'>
													<p className='font-semibold text-sm text-foreground truncate leading-tight group-hover:text-primary transition-colors'>
														{lesson.title}
													</p>
													<p className='text-xs font-medium text-muted-foreground mt-0.5'>
														{lesson.mentorName}
													</p>
												</div>
											</div>
											<Badge
												variant='outline'
												className={cn(
													'ml-2 border-transparent font-bold text-[10px] uppercase tracking-wider shrink-0 shadow-none',
													lesson.isAttended
														? 'text-green-600 bg-green-500/10'
														: lesson.hasRecord
															? 'text-destructive bg-destructive/10'
															: 'bg-muted text-muted-foreground',
												)}
											>
												{lesson.isAttended
													? t('kpi.attended') || 'Kelgan'
													: lesson.hasRecord
														? t('kpi.missed') || 'Kelmagan'
														: t('kpi.pending') || 'Kutilmoqda'}
											</Badge>
										</div>
									))
								) : (
									<div className='flex flex-col items-center justify-center p-12 text-center text-muted-foreground'>
										<BookOpen className='w-8 h-8 opacity-20 mb-3' />
										<p className='font-medium text-sm'>
											{t('kpi.noHistory') || "Davomat tarixi bo'sh"}
										</p>
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				</motion.div>

				{/* Jami statistika & Mentorlar ro'yxati */}
				<div className='space-y-6 flex flex-col h-full'>
					<motion.div
						variants={itemVars}
						className='grid grid-cols-2 gap-4 shrink-0'
					>
						<Card className='shadow-sm hover:shadow-md transition-shadow'>
							<CardContent className='p-5 flex flex-col sm:flex-row sm:items-center gap-4 text-center sm:text-left'>
								<div className='p-3 bg-muted rounded-xl shrink-0 mx-auto sm:mx-0'>
									<BookOpen className='w-5 h-5 text-muted-foreground' />
								</div>
								<div>
									<p className='text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5'>
										{t('kpi.totalLessons') || 'Jami darslar'}
									</p>
									<p className='text-2xl font-bold text-foreground'>
										{stats?.totalLessons || 0}
									</p>
								</div>
							</CardContent>
						</Card>

						<Card className='shadow-sm hover:shadow-md transition-shadow'>
							<CardContent className='p-5 flex flex-col sm:flex-row sm:items-center gap-4 text-center sm:text-left'>
								<div className='p-3 bg-muted rounded-xl shrink-0 mx-auto sm:mx-0'>
									<Clock className='w-5 h-5 text-muted-foreground' />
								</div>
								<div>
									<p className='text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5'>
										{t('kpi.totalHours') || 'Jami soat'}
									</p>
									<p className='text-2xl font-bold text-foreground'>
										{stats?.totalHours || 0}
									</p>
								</div>
							</CardContent>
						</Card>
					</motion.div>

					<motion.div variants={itemVars} className='flex-1 min-h-[300px]'>
						<Card className='shadow-sm h-full flex flex-col overflow-hidden bg-card'>
							<CardHeader className='p-5 border-b bg-muted/20 shrink-0'>
								<CardTitle className='text-base flex items-center gap-2'>
									<Users className='w-4 h-4 text-muted-foreground' />{' '}
									{t('kpi.myMentors') || 'Mening Ustozlarim'}
								</CardTitle>
								<CardDescription className='text-xs mt-1'>
									{t('kpi.myMentorsDesc') || "Siz obuna bo'lgan mutaxassislar"}
								</CardDescription>
							</CardHeader>
							<CardContent className='p-0 flex-1 overflow-y-auto custom-scrollbar'>
								<div className='divide-y divide-border'>
									{stats?.followedMentors?.length > 0 ? (
										stats.followedMentors.map(mentor => (
											<div
												key={mentor.id}
												className='p-4 hover:bg-muted/30 transition-colors flex items-center justify-between group'
											>
												<div className='flex items-center gap-3'>
													<Avatar className='h-9 w-9 border'>
														<AvatarFallback className='text-xs font-bold bg-muted text-foreground uppercase'>
															{getInitials(mentor.name, '')}
														</AvatarFallback>
													</Avatar>
													<div>
														<p className='font-semibold text-sm text-foreground'>
															{mentor.name}
														</p>
														<p className='text-xs text-muted-foreground mt-0.5'>
															{mentor.specialty}
														</p>
													</div>
												</div>
												<Badge
													variant='outline'
													className='gap-1 font-bold text-xs shadow-none border-transparent bg-muted/50'
												>
													<Star className='w-3.5 h-3.5 text-amber-500 fill-amber-500' />
													{mentor.rating}
												</Badge>
											</div>
										))
									) : (
										<div className='flex flex-col items-center justify-center p-12 text-center text-muted-foreground'>
											<Users className='w-8 h-8 opacity-20 mb-3' />
											<p className='text-sm font-medium'>
												{t('kpi.noMentors') || "Kuzatilgan mentorlar yo'q"}
											</p>
										</div>
									)}
								</div>
							</CardContent>
						</Card>
					</motion.div>
				</div>
			</div>
		</motion.div>
	)
}
