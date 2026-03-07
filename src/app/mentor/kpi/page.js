'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import api from '@/lib/api'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import {
	ArrowDownRight,
	ArrowUpRight,
	BookOpen,
	Star,
	TrendingUp,
	Users,
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

const TIME_RANGES = [
	{ key: 'daily', label: 'Kunlik' },
	{ key: 'monthly', label: 'Oylik' },
	{ key: 'yearly', label: 'Yillik' },
]

// --- ANIMATION VARIANTS ---
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

// --- SKELETON LOADER ---
const DashboardSkeleton = () => (
	<div className='max-w-7xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500'>
		<div className='flex flex-col md:flex-row justify-between gap-4'>
			<div className='space-y-2'>
				<Skeleton className='h-9 w-48' />
				<Skeleton className='h-4 w-64' />
			</div>
			<Skeleton className='h-10 w-[250px] rounded-xl' />
		</div>
		<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
			{[1, 2, 3, 4].map(i => (
				<Skeleton key={i} className='h-32 w-full rounded-xl' />
			))}
		</div>
		<Skeleton className='h-[350px] w-full rounded-xl' />
	</div>
)

export default function MentorKPIDashboard() {
	const [stats, setStats] = useState(null)
	const [loading, setLoading] = useState(true)
	const [timeRange, setTimeRange] = useState('monthly')

	const fetchKpi = useCallback(async range => {
		try {
			setLoading(true)
			const res = await api.get(`/mentor/kpi/stats?range=${range}`)
			if (res.data.success) {
				setStats(res.data.stats)
			}
		} catch (error) {
			console.error('Mentor KPI yuklashda xatolik:', error)
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		fetchKpi(timeRange)
	}, [timeRange, fetchKpi])

	const getTrend = change => {
		if (!change) return 'up'
		return change.startsWith('-') ? 'down' : 'up'
	}

	const getRatingBadge = rating => {
		if (rating >= 4.5)
			return {
				text: "A'lo",
				color:
					'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400',
			}
		if (rating >= 3.5)
			return {
				text: 'Yaxshi',
				color:
					'text-blue-600 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400',
			}
		if (rating >= 2.5)
			return {
				text: "O'rtacha",
				color:
					'text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400',
			}
		return {
			text: 'Past',
			color: 'text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400',
		}
	}

	if (loading && !stats) return <DashboardSkeleton />

	const ratingBadge = getRatingBadge(stats?.rating || 0)
	const completionRate =
		stats?.totalLessons > 0
			? Math.round((stats.completedLessons / stats.totalLessons) * 100)
			: 0

	const chartData = stats?.chartData || []
	const maxChartVal = Math.max(
		...chartData.map(d => Math.max(d.students, d.lessons)),
		1,
	)

	return (
		<motion.div
			variants={containerVars}
			initial='hidden'
			animate='show'
			className='max-w-7xl mx-auto space-y-6 pb-12'
		>
			{/* HEADER */}
			<motion.div
				variants={itemVars}
				className='flex flex-col md:flex-row md:items-center justify-between gap-4'
			>
				<div>
					<h1 className='text-2xl sm:text-3xl font-bold tracking-tight text-foreground'>
						Mening KPI
					</h1>
					<div className='flex items-center gap-2 mt-1'>
						<p className='text-sm text-muted-foreground'>
							Darslar va faoliyat tahlili.
						</p>
						{loading && (
							<span className='flex h-2 w-2 rounded-full bg-primary animate-ping' />
						)}
					</div>
				</div>

				<div className='flex items-center bg-muted rounded-xl p-1 gap-1 border shadow-sm'>
					{TIME_RANGES.map(r => (
						<button
							key={r.key}
							onClick={() => setTimeRange(r.key)}
							disabled={loading}
							className={cn(
								'px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 disabled:opacity-50',
								timeRange === r.key
									? 'bg-background text-foreground shadow-sm'
									: 'text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10',
							)}
						>
							{r.label}
						</button>
					))}
				</div>
			</motion.div>

			{/* STATS CARDS */}
			<motion.div
				variants={itemVars}
				className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
			>
				{/* Reyting */}
				<Card className='shadow-sm border-muted hover:shadow-md transition-shadow group'>
					<CardContent className='p-6'>
						<div className='flex justify-between items-start'>
							<div className='space-y-1'>
								<p className='text-[11px] font-bold uppercase tracking-wider text-muted-foreground'>
									Reyting
								</p>
								<div className='flex items-center gap-2.5 pt-1'>
									<h2 className='text-3xl font-black text-foreground'>
										{stats?.rating?.toFixed(1) || '0.0'}
									</h2>
									<Badge
										variant='outline'
										className={cn(
											'border-none shadow-none font-bold',
											ratingBadge.color,
										)}
									>
										{ratingBadge.text}
									</Badge>
								</div>
							</div>
							<div className='p-3 bg-amber-50 dark:bg-amber-500/10 rounded-2xl group-hover:scale-110 transition-transform'>
								<Star className='w-5 h-5 text-amber-500 fill-current' />
							</div>
						</div>
						<p className='mt-4 text-xs font-medium text-muted-foreground'>
							{stats?.totalRatings || 0} ta baho asosida
						</p>
					</CardContent>
				</Card>

				{/* O'quvchilar */}
				<Card className='shadow-sm border-muted hover:shadow-md transition-shadow group'>
					<CardContent className='p-6'>
						<div className='flex justify-between items-start'>
							<div className='space-y-1'>
								<p className='text-[11px] font-bold uppercase tracking-wider text-muted-foreground'>
									O'quvchilar
								</p>
								<div className='flex items-center gap-2.5 pt-1'>
									<h2 className='text-3xl font-black text-foreground'>
										{stats?.totalStudents || 0}
									</h2>
									{stats?.studentsChange && (
										<Badge
											variant='outline'
											className={cn(
												'border-none shadow-none font-bold gap-0.5',
												getTrend(stats.studentsChange) === 'up'
													? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
													: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
											)}
										>
											{getTrend(stats.studentsChange) === 'up' ? (
												<ArrowUpRight className='w-3 h-3' />
											) : (
												<ArrowDownRight className='w-3 h-3' />
											)}
											{stats.studentsChange}
										</Badge>
									)}
								</div>
							</div>
							<div className='p-3 bg-blue-50 dark:bg-blue-500/10 rounded-2xl group-hover:scale-110 transition-transform'>
								<Users className='w-5 h-5 text-blue-500' />
							</div>
						</div>
						<p className='mt-4 text-xs font-medium text-muted-foreground'>
							Aktiv obunachilar
						</p>
					</CardContent>
				</Card>

				{/* Darslar */}
				<Card className='shadow-sm border-muted hover:shadow-md transition-shadow group'>
					<CardContent className='p-6'>
						<div className='flex justify-between items-start'>
							<div className='space-y-1'>
								<p className='text-[11px] font-bold uppercase tracking-wider text-muted-foreground'>
									Darslar
								</p>
								<div className='pt-1'>
									<h2 className='text-3xl font-black text-foreground'>
										{stats?.completedLessons || 0}
										<span className='text-lg font-semibold text-muted-foreground ml-1'>
											/ {stats?.totalLessons || 0}
										</span>
									</h2>
								</div>
							</div>
							<div className='p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl group-hover:scale-110 transition-transform'>
								<BookOpen className='w-5 h-5 text-indigo-500' />
							</div>
						</div>
						<div className='mt-4 h-1.5 w-full bg-muted rounded-full overflow-hidden'>
							<motion.div
								initial={{ width: 0 }}
								animate={{ width: `${completionRate}%` }}
								transition={{ duration: 1, ease: 'easeOut' }}
								className='h-full bg-indigo-500 rounded-full'
							/>
						</div>
					</CardContent>
				</Card>

				{/* Tugatish */}
				<Card className='shadow-sm border-muted hover:shadow-md transition-shadow group'>
					<CardContent className='p-6'>
						<div className='flex justify-between items-start'>
							<div className='space-y-1'>
								<p className='text-[11px] font-bold uppercase tracking-wider text-muted-foreground'>
									Tugatish
								</p>
								<div className='pt-1'>
									<h2 className='text-3xl font-black text-foreground'>
										{completionRate}%
									</h2>
								</div>
							</div>
							<div className='p-3 bg-purple-50 dark:bg-purple-500/10 rounded-2xl group-hover:scale-110 transition-transform'>
								<TrendingUp className='w-5 h-5 text-purple-500' />
							</div>
						</div>
						<p className='mt-4 text-xs font-medium text-muted-foreground'>
							Rejaning bajarilishi
						</p>
					</CardContent>
				</Card>
			</motion.div>

			{/* O'SISH GRAFIGI */}
			<motion.div variants={itemVars}>
				<Card className='shadow-sm border-muted overflow-hidden'>
					<CardHeader className='bg-muted/20 border-b pb-4'>
						<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2'>
							<div className='space-y-1'>
								<CardTitle className='text-base flex items-center gap-2 font-bold'>
									<TrendingUp className='w-4 h-4 text-primary' /> O'sish
									Dinamikasi
								</CardTitle>
								<p className='text-xs text-muted-foreground font-medium'>
									Vaqt oralig'ida darslar va o'quvchilar soni
								</p>
							</div>
							<div className='flex items-center gap-4 text-xs font-bold text-muted-foreground bg-background px-3 py-1.5 rounded-lg border shadow-sm w-fit'>
								<div className='flex items-center gap-1.5'>
									<span className='w-2 h-2 rounded-full bg-blue-500' />{' '}
									O'quvchilar
								</div>
								<div className='flex items-center gap-1.5'>
									<span className='w-2 h-2 rounded-full bg-emerald-500' />{' '}
									Darslar
								</div>
							</div>
						</div>
					</CardHeader>
					<CardContent className='p-6 sm:p-8'>
						<div className='flex items-end justify-between h-56 gap-2 sm:gap-4'>
							{chartData.map((d, i) => {
								const sH =
									maxChartVal > 0 ? (d.students / maxChartVal) * 100 : 5
								const lH = maxChartVal > 0 ? (d.lessons / maxChartVal) * 100 : 2
								return (
									<div
										key={i}
										className='flex-1 flex flex-col items-center gap-3 group h-full justify-end'
									>
										<div className='w-full flex gap-1 items-end justify-center h-full relative'>
											<div className='absolute -top-6 text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background px-2 py-0.5 rounded shadow-xl pointer-events-none whitespace-nowrap z-10'>
												O'q: {d.students} | Da: {d.lessons}
											</div>
											<motion.div
												initial={{ height: 0 }}
												animate={{ height: `${Math.max(sH, 2)}%` }}
												transition={{ duration: 0.8, delay: i * 0.05 }}
												className='w-full max-w-[20px] bg-blue-500/20 group-hover:bg-blue-500 rounded-t-md transition-colors duration-300'
											/>
											<motion.div
												initial={{ height: 0 }}
												animate={{ height: `${Math.max(lH, 2)}%` }}
												transition={{ duration: 0.8, delay: i * 0.05 }}
												className='w-full max-w-[20px] bg-emerald-500/20 group-hover:bg-emerald-500 rounded-t-md transition-colors duration-300'
											/>
										</div>
										<span className='text-[10px] text-muted-foreground font-bold uppercase tracking-wider'>
											{d.label}
										</span>
									</div>
								)
							})}
						</div>
					</CardContent>
				</Card>
			</motion.div>

			{/* RECENT RATINGS */}
			{stats?.recentRatings?.length > 0 && (
				<motion.div variants={itemVars}>
					<Card className='shadow-sm border-muted overflow-hidden'>
						<CardHeader className='bg-muted/20 border-b pb-4'>
							<CardTitle className='text-base flex items-center gap-2 font-bold'>
								<Star className='w-4 h-4 text-amber-500 fill-current' /> So'nggi
								Baholar
							</CardTitle>
						</CardHeader>
						<CardContent className='p-0 divide-y divide-muted'>
							{stats.recentRatings.map(r => (
								<div
									key={r.id}
									className='p-4 flex items-center justify-between hover:bg-muted/30 transition-colors group'
								>
									<div className='flex items-center gap-3'>
										<div className='w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors'>
											{r.studentName?.charAt(0)?.toUpperCase() || '?'}
										</div>
										<p className='font-semibold text-sm'>{r.studentName}</p>
									</div>
									<div className='flex items-center gap-0.5 bg-background border px-2 py-1 rounded-lg shadow-sm'>
										{[...Array(5)].map((_, i) => (
											<Star
												key={i}
												className={cn(
													'w-3.5 h-3.5',
													i < r.score
														? 'text-amber-500 fill-current'
														: 'text-muted-foreground/20',
												)}
											/>
										))}
									</div>
								</div>
							))}
						</CardContent>
					</Card>
				</motion.div>
			)}
		</motion.div>
	)
}
