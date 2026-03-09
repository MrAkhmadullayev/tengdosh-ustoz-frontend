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
import { cn, getErrorMessage } from '@/lib/utils'
import { motion } from 'framer-motion'
import {
	ArrowDownRight,
	ArrowUpRight,
	BookOpen,
	Star,
	TrendingUp,
	Users,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

// ==========================================
// 🧩 SKELETON LOADER
// ==========================================
const DashboardSkeleton = () => (
	<div className='max-w-7xl mx-auto space-y-6 pb-12 pt-6 px-4 sm:px-6 lg:px-8 animate-pulse'>
		<div className='flex flex-col md:flex-row justify-between gap-4 border-b pb-6'>
			<div className='space-y-2'>
				<Skeleton className='h-8 w-48' />
				<Skeleton className='h-4 w-64' />
			</div>
			<Skeleton className='h-10 w-[250px] rounded-md' />
		</div>
		<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
			{[1, 2, 3, 4].map(i => (
				<Skeleton key={i} className='h-28 w-full rounded-xl' />
			))}
		</div>
		<Skeleton className='h-[350px] w-full rounded-xl' />
	</div>
)

// ==========================================
// 🚀 ASOSIY KOMPONENT
// ==========================================
export default function MentorKPIDashboard() {
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

	// 1. API dan KPI ma'lumotlarini yuklash
	const fetchKpi = useCallback(
		async range => {
			try {
				setLoading(true)
				const res = await api.get(`/mentor/kpi/stats?range=${range}`)
				if (res?.data?.success) {
					setStats(res.data.stats)
				}
			} catch (error) {
				toast.error(
					getErrorMessage(
						error,
						t('errors.fetchFailed') || 'Statistikalarni yuklashda xatolik',
					),
				)
			} finally {
				setLoading(false)
			}
		},
		[t],
	)

	useEffect(() => {
		fetchKpi(timeRange)
	}, [timeRange, fetchKpi])

	// 2. Trendni aniqlash
	const getTrend = useCallback(change => {
		if (!change) return 'up'
		return change.toString().startsWith('-') ? 'down' : 'up'
	}, [])

	// 3. Reyting Badge hisoblash
	const getRatingBadgeProps = useCallback(
		rating => {
			if (rating >= 4.5)
				return {
					label: t('kpi.excellent') || "A'lo",
					color: 'text-green-600 bg-green-500/10',
				}
			if (rating >= 3.5)
				return {
					label: t('kpi.good') || 'Yaxshi',
					color: 'text-blue-600 bg-blue-500/10',
				}
			if (rating >= 2.5)
				return {
					label: t('kpi.average') || "O'rtacha",
					color: 'text-amber-600 bg-amber-500/10',
				}
			return {
				label: t('kpi.poor') || 'Past',
				color: 'text-destructive bg-destructive/10',
			}
		},
		[t],
	)

	if (loading && !stats) return <DashboardSkeleton />

	const rb = getRatingBadgeProps(stats?.rating || 0)
	const completionRate =
		stats?.totalLessons > 0
			? Math.round((stats.completedLessons / stats.totalLessons) * 100)
			: 0
	const chartData = stats?.chartData || []
	const maxChartVal = Math.max(
		...chartData.map(d => Math.max(d.students || 0, d.lessons || 0)),
		1,
	)

	return (
		<div className='max-w-7xl mx-auto space-y-6 pb-12 pt-6 px-4 sm:px-6 lg:px-8'>
			{/* 🏷️ HEADER & FILTERS */}
			<div className='flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6'>
				<div>
					<h1 className='text-2xl font-bold tracking-tight text-foreground'>
						{t('sidebar.kpi') || "KPI Ko'rsatkichlar"}
					</h1>
					<div className='flex items-center gap-2 mt-1'>
						<p className='text-sm text-muted-foreground'>
							{t('kpi.studentDesc') || 'Darslar va talabalar faolligi tahlili'}
						</p>
						{loading && (
							<span className='flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse' />
						)}
					</div>
				</div>

				<div className='flex items-center bg-muted p-1 rounded-md border shadow-sm'>
					{timeRanges.map(r => (
						<button
							key={r.key}
							onClick={() => setTimeRange(r.key)}
							disabled={loading}
							className={cn(
								'px-4 py-1.5 rounded-sm text-sm font-medium transition-all',
								timeRange === r.key
									? 'bg-background text-foreground shadow-sm'
									: 'text-muted-foreground hover:text-foreground',
							)}
						>
							{r.label}
						</button>
					))}
				</div>
			</div>

			{/* 📊 ASOSIY KARTALAR (Top Cards) */}
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
				{/* Reyting */}
				<Card className='shadow-sm'>
					<CardContent className='p-6'>
						<div className='flex items-center justify-between pb-2'>
							<p className='text-xs font-bold uppercase tracking-wider text-muted-foreground'>
								{t('mentors.rating') || 'Reyting'}
							</p>
							<Star className='h-4 w-4 text-amber-500 fill-amber-500' />
						</div>
						<div className='flex items-baseline gap-2 mt-1'>
							<h2 className='text-3xl font-bold'>
								{stats?.rating?.toFixed(1) || '0.0'}
							</h2>
							<Badge
								variant='outline'
								className={cn(
									'text-[10px] font-bold border-transparent shadow-none px-2',
									rb.color,
								)}
							>
								{rb.label}
							</Badge>
						</div>
						<p className='mt-4 text-[11px] font-medium text-muted-foreground'>
							{t('kpi.basedOnScores', { count: stats?.totalRatings || 0 }) ||
								`${stats?.totalRatings || 0} ta baholash asosida`}
						</p>
					</CardContent>
				</Card>

				{/* Talabalar */}
				<Card className='shadow-sm'>
					<CardContent className='p-6'>
						<div className='flex items-center justify-between pb-2'>
							<p className='text-xs font-bold uppercase tracking-wider text-muted-foreground'>
								{t('kpi.students') || 'Talabalar'}
							</p>
							<Users className='h-4 w-4 text-muted-foreground' />
						</div>
						<div className='flex items-baseline gap-2 mt-1'>
							<h2 className='text-3xl font-bold'>
								{stats?.totalStudents || 0}
							</h2>
							{stats?.studentsChange && (
								<span
									className={cn(
										'flex items-center text-xs font-bold',
										getTrend(stats.studentsChange) === 'up'
											? 'text-green-600'
											: 'text-destructive',
									)}
								>
									{getTrend(stats.studentsChange) === 'up' ? (
										<ArrowUpRight className='h-3 w-3 mr-0.5' />
									) : (
										<ArrowDownRight className='h-3 w-3 mr-0.5' />
									)}
									{stats.studentsChange}
								</span>
							)}
						</div>
						<p className='mt-4 text-[11px] font-medium text-muted-foreground'>
							{t('kpi.activeSubscribers') || 'Faol obunachilar'}
						</p>
					</CardContent>
				</Card>

				{/* Darslar */}
				<Card className='shadow-sm'>
					<CardContent className='p-6'>
						<div className='flex items-center justify-between pb-2'>
							<p className='text-xs font-bold uppercase tracking-wider text-muted-foreground'>
								{t('kpi.lessons') || 'Darslar'}
							</p>
							<BookOpen className='h-4 w-4 text-muted-foreground' />
						</div>
						<div className='mt-1'>
							<h2 className='text-3xl font-bold'>
								{stats?.completedLessons || 0}
								<span className='text-lg font-medium text-muted-foreground ml-1'>
									/ {stats?.totalLessons || 0}
								</span>
							</h2>
						</div>
						<div className='mt-4 h-1.5 w-full bg-muted rounded-full overflow-hidden'>
							<motion.div
								initial={{ width: 0 }}
								animate={{ width: `${completionRate}%` }}
								className='h-full bg-primary'
							/>
						</div>
					</CardContent>
				</Card>

				{/* Samaradorlik */}
				<Card className='shadow-sm'>
					<CardContent className='p-6'>
						<div className='flex items-center justify-between pb-2'>
							<p className='text-xs font-bold uppercase tracking-wider text-muted-foreground'>
								{t('kpi.completionRate') || 'Samaradorlik'}
							</p>
							<TrendingUp className='h-4 w-4 text-muted-foreground' />
						</div>
						<h2 className='text-3xl font-bold mt-1'>{completionRate}%</h2>
						<p className='mt-4 text-[11px] font-medium text-muted-foreground'>
							{t('kpi.planPerformance') || 'Reja bajarilishi'}
						</p>
					</CardContent>
				</Card>
			</div>

			{/* 📈 GROWTH CHART (Diagramma) */}
			<Card className='shadow-sm'>
				<CardHeader className='border-b bg-muted/20 pb-4'>
					<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
						<div>
							<CardTitle className='text-base font-bold'>
								{t('kpi.growthDynamics') || "O'sish dinamikasi"}
							</CardTitle>
							<CardDescription className='text-xs'>
								Vaqt kesimida darslar va talabalar soni
							</CardDescription>
						</div>
						<div className='flex items-center gap-3 text-[11px] font-bold text-muted-foreground'>
							<div className='flex items-center gap-1.5'>
								<span className='w-2 h-2 rounded-full bg-primary' /> Talabalar
							</div>
							<div className='flex items-center gap-1.5'>
								<span className='w-2 h-2 rounded-full bg-emerald-500' /> Darslar
							</div>
						</div>
					</div>
				</CardHeader>
				<CardContent className='p-6 sm:p-8'>
					<div className='flex items-end justify-between h-56 gap-2 sm:gap-4'>
						{chartData.length > 0 ? (
							chartData.map((d, i) => {
								const sH = (d.students / maxChartVal) * 100
								const lH = (d.lessons / maxChartVal) * 100
								return (
									<div
										key={i}
										className='flex-1 flex flex-col items-center gap-3 group h-full justify-end relative'
									>
										{/* Tooltip */}
										<div className='absolute -top-8 bg-foreground text-background text-[9px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 font-bold shadow-xl'>
											T: {d.students} | D: {d.lessons}
										</div>

										<div className='w-full flex gap-1 items-end justify-center h-full relative'>
											<motion.div
												initial={{ height: 0 }}
												animate={{ height: `${Math.max(sH, 2)}%` }}
												className='w-full max-w-[16px] bg-primary/20 group-hover:bg-primary rounded-t-sm transition-colors'
											/>
											<motion.div
												initial={{ height: 0 }}
												animate={{ height: `${Math.max(lH, 2)}%` }}
												className='w-full max-w-[16px] bg-emerald-500/20 group-hover:bg-emerald-500 rounded-t-sm transition-colors'
											/>
										</div>
										<span className='text-[10px] font-medium text-muted-foreground uppercase'>
											{d.label}
										</span>
									</div>
								)
							})
						) : (
							<div className='w-full h-full flex items-center justify-center text-sm text-muted-foreground italic border border-dashed rounded-lg bg-muted/10'>
								Ma'lumotlar mavjud emas
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			{/* ⭐ SO'NGGI BAHOLASHLAR */}
			{stats?.recentRatings?.length > 0 && (
				<Card className='shadow-sm'>
					<CardHeader className='border-b bg-muted/20 pb-4'>
						<CardTitle className='text-base font-bold flex items-center gap-2'>
							<Star className='h-4 w-4 text-amber-500 fill-amber-500' />{' '}
							{t('kpi.recentRatings') || "So'nggi baholashlar"}
						</CardTitle>
					</CardHeader>
					<CardContent className='p-0'>
						<div className='divide-y'>
							{stats.recentRatings.map(r => (
								<div
									key={r.id || r._id}
									className='p-4 flex items-center justify-between hover:bg-muted/30 transition-colors'
								>
									<div className='flex items-center gap-3'>
										<Avatar className='h-8 w-8 border shadow-none'>
											<AvatarFallback className='text-[10px] font-bold bg-primary/5 text-primary'>
												{getInitials(r.studentName, '')}
											</AvatarFallback>
										</Avatar>
										<span className='font-semibold text-sm capitalize'>
											{r.studentName}
										</span>
									</div>
									<div className='flex items-center gap-0.5'>
										{[...Array(5)].map((_, i) => (
											<Star
												key={i}
												className={cn(
													'h-3 w-3',
													i < r.score
														? 'text-amber-500 fill-amber-500'
														: 'text-muted opacity-20',
												)}
											/>
										))}
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	)
}
