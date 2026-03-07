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
import { cn } from '@/lib/utils'
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
				<Skeleton className='h-9 w-64' />
				<Skeleton className='h-4 w-80' />
			</div>
			<Skeleton className='h-10 w-[250px] rounded-xl' />
		</div>
		<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
			{[1, 2, 3, 4].map(i => (
				<Skeleton key={i} className='h-32 w-full rounded-xl' />
			))}
		</div>
		<div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4'>
			<Skeleton className='h-[400px] w-full rounded-xl' />
			<div className='space-y-4'>
				<div className='flex gap-4'>
					<Skeleton className='h-28 w-1/2 rounded-xl' />
					<Skeleton className='h-28 w-1/2 rounded-xl' />
				</div>
				<Skeleton className='h-[270px] w-full rounded-xl' />
			</div>
		</div>
	</div>
)

export default function StudentKPIDashboard() {
	const [stats, setStats] = useState(null)
	const [loading, setLoading] = useState(true)
	const [timeRange, setTimeRange] = useState('monthly')

	const fetchKpi = useCallback(async range => {
		try {
			setLoading(true)
			const res = await api.get(`/student/kpi/stats?range=${range}`)
			if (res.data.success) {
				setStats(res.data.stats)
			}
		} catch (error) {
			console.error('Student KPI yuklashda xatolik:', error)
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

	if (loading && !stats) return <DashboardSkeleton />

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
						Mening O'quv KPI
					</h1>
					<div className='flex items-center gap-2 mt-1'>
						<p className='text-sm text-muted-foreground'>
							Darslar davomati va o'quv faoliyati tahlili.
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
				{/* Qatnashgan Darslar */}
				<Card className='shadow-sm border-muted hover:shadow-md transition-shadow group'>
					<CardContent className='p-6'>
						<div className='flex justify-between items-start'>
							<div className='space-y-1'>
								<p className='text-[11px] font-bold uppercase tracking-wider text-muted-foreground'>
									Qatnashgan Darslar
								</p>
								<div className='flex items-center gap-2.5 pt-1'>
									<h2 className='text-3xl font-black text-foreground'>
										{stats?.attendedCount || 0}
									</h2>
									<Badge
										variant='outline'
										className={cn(
											'border-none shadow-none font-bold gap-0.5',
											getTrend(stats?.lessonsChange) === 'up'
												? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
												: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
										)}
									>
										{getTrend(stats?.lessonsChange) === 'up' ? (
											<ArrowUpRight className='w-3 h-3' />
										) : (
											<ArrowDownRight className='w-3 h-3' />
										)}
										{stats?.lessonsChange || '+0%'}
									</Badge>
								</div>
							</div>
							<div className='p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl group-hover:scale-110 transition-transform'>
								<UserCheck className='w-5 h-5 text-emerald-500' />
							</div>
						</div>
						<p className='mt-4 text-xs font-medium text-muted-foreground'>
							Faol ishtirok
						</p>
					</CardContent>
				</Card>

				{/* Kelmagan Darslar */}
				<Card className='shadow-sm border-muted hover:shadow-md transition-shadow group'>
					<CardContent className='p-6'>
						<div className='flex justify-between items-start'>
							<div className='space-y-1'>
								<p className='text-[11px] font-bold uppercase tracking-wider text-muted-foreground'>
									Kelmagan Darslar
								</p>
								<div className='pt-1'>
									<h2 className='text-3xl font-black text-red-600 dark:text-red-500'>
										{stats?.missedCount || 0}
									</h2>
								</div>
							</div>
							<div className='p-3 bg-red-50 dark:bg-red-500/10 rounded-2xl group-hover:scale-110 transition-transform'>
								<UserX className='w-5 h-5 text-red-500' />
							</div>
						</div>
						<p className='mt-4 text-xs font-medium text-muted-foreground'>
							Qoldirilgan darslar
						</p>
					</CardContent>
				</Card>

				{/* Obuna Mentorlar */}
				<Card className='shadow-sm border-muted hover:shadow-md transition-shadow group'>
					<CardContent className='p-6'>
						<div className='flex justify-between items-start'>
							<div className='space-y-1'>
								<p className='text-[11px] font-bold uppercase tracking-wider text-muted-foreground'>
									Kuzatilayotganlar
								</p>
								<div className='pt-1'>
									<h2 className='text-3xl font-black text-foreground'>
										{stats?.followedMentorsCount || 0}
									</h2>
								</div>
							</div>
							<div className='p-3 bg-purple-50 dark:bg-purple-500/10 rounded-2xl group-hover:scale-110 transition-transform'>
								<Heart className='w-5 h-5 text-purple-500' />
							</div>
						</div>
						<p className='mt-4 text-xs font-medium text-muted-foreground'>
							Obuna qilingan mentorlar
						</p>
					</CardContent>
				</Card>

				{/* Tugatish */}
				<Card className='shadow-sm border-muted hover:shadow-md transition-shadow group'>
					<CardContent className='p-6'>
						<div className='flex justify-between items-start'>
							<div className='space-y-1'>
								<p className='text-[11px] font-bold uppercase tracking-wider text-muted-foreground'>
									O'zlashtirish
								</p>
								<div className='pt-1'>
									<h2 className='text-3xl font-black text-foreground'>
										{stats?.completionRate || 0}%
									</h2>
								</div>
							</div>
							<div className='p-3 bg-blue-50 dark:bg-blue-500/10 rounded-2xl group-hover:scale-110 transition-transform'>
								<CheckCircle2 className='w-5 h-5 text-blue-500' />
							</div>
						</div>
						<div className='mt-4 h-1.5 w-full bg-muted rounded-full overflow-hidden'>
							<motion.div
								initial={{ width: 0 }}
								animate={{ width: `${stats?.completionRate || 0}%` }}
								transition={{ duration: 1, ease: 'easeOut' }}
								className='h-full bg-blue-500 rounded-full'
							/>
						</div>
					</CardContent>
				</Card>
			</motion.div>

			{/* CONTENT GRID */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				{/* Darslar davomati ro'yxati */}
				<motion.div variants={itemVars}>
					<Card className='shadow-sm border-muted h-full flex flex-col'>
						<CardHeader className='bg-muted/20 border-b pb-4 shrink-0'>
							<CardTitle className='text-base flex items-center gap-2 font-bold'>
								<BookOpen className='w-4 h-4 text-primary' /> Darslarim Davomati
							</CardTitle>
							<CardDescription className='text-xs'>
								Qaysi darslarga qatnashganingiz va kelmagan darslar tarixi
							</CardDescription>
						</CardHeader>
						<CardContent className='p-0 flex-1 overflow-y-auto max-h-[500px] custom-scrollbar'>
							<div className='divide-y divide-muted'>
								{stats?.lessonsAttendanceDetail?.length > 0 ? (
									stats.lessonsAttendanceDetail.map((lesson, idx) => (
										<motion.div
											initial={{ opacity: 0, x: -10 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: idx * 0.05 }}
											key={lesson.id}
											className='p-4 hover:bg-muted/30 transition-colors flex items-center justify-between group'
										>
											<div className='flex items-center gap-3 flex-1 min-w-0'>
												<div
													className={cn(
														'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors',
														lesson.isAttended
															? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
															: lesson.hasRecord
																? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
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
													<p className='font-bold text-sm text-foreground truncate leading-tight group-hover:text-primary transition-colors'>
														{lesson.title}
													</p>
													<p className='text-[11px] font-medium text-muted-foreground mt-0.5'>
														{lesson.mentorName}
													</p>
												</div>
											</div>
											<Badge
												variant='outline'
												className={cn(
													'ml-2 border-none font-bold text-[10px] uppercase tracking-wider shrink-0 py-0.5',
													lesson.isAttended
														? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
														: lesson.hasRecord
															? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
															: 'bg-muted text-muted-foreground',
												)}
											>
												{lesson.isAttended
													? 'Kelgan'
													: lesson.hasRecord
														? 'Kelmagan'
														: 'Kutilmoqda'}
											</Badge>
										</motion.div>
									))
								) : (
									<div className='flex flex-col items-center justify-center p-12 text-center text-muted-foreground'>
										<div className='bg-muted p-4 rounded-full mb-3'>
											<BookOpen className='w-8 h-8 opacity-40' />
										</div>
										<p className='font-medium text-sm'>
											Darslar tarixi mavjud emas
										</p>
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				</motion.div>

				{/* Followed Mentors + Summary */}
				<div className='space-y-6 flex flex-col h-full'>
					{/* Summary */}
					<motion.div
						variants={itemVars}
						className='grid grid-cols-2 gap-4 shrink-0'
					>
						<Card className='border-muted shadow-sm hover:shadow-md transition-shadow'>
							<CardContent className='p-5 flex flex-col items-center sm:flex-row sm:items-center gap-4 text-center sm:text-left'>
								<div className='p-3.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl shrink-0'>
									<BookOpen className='w-6 h-6 text-indigo-500' />
								</div>
								<div>
									<p className='text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5'>
										Jami Darslar
									</p>
									<p className='text-2xl font-black text-foreground'>
										{stats?.totalLessons || 0}
									</p>
								</div>
							</CardContent>
						</Card>

						<Card className='border-muted shadow-sm hover:shadow-md transition-shadow'>
							<CardContent className='p-5 flex flex-col items-center sm:flex-row sm:items-center gap-4 text-center sm:text-left'>
								<div className='p-3.5 bg-amber-50 dark:bg-amber-500/10 rounded-2xl shrink-0'>
									<Clock className='w-6 h-6 text-amber-500' />
								</div>
								<div>
									<p className='text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5'>
										O'qish Soatlari
									</p>
									<p className='text-2xl font-black text-foreground'>
										{stats?.totalHours || 0}
									</p>
								</div>
							</CardContent>
						</Card>
					</motion.div>

					{/* Followed Mentors */}
					<motion.div variants={itemVars} className='flex-1 min-h-[300px]'>
						<Card className='border-muted shadow-sm h-full flex flex-col overflow-hidden'>
							<CardHeader className='p-5 border-b bg-muted/20 shrink-0'>
								<CardTitle className='text-base flex items-center gap-2 font-bold'>
									<Users className='w-4 h-4 text-primary' /> Mentorlarim
								</CardTitle>
								<CardDescription className='text-xs mt-1'>
									Siz obuna bo'lgan ustozlar ro'yxati
								</CardDescription>
							</CardHeader>
							<CardContent className='p-0 flex-1 overflow-y-auto custom-scrollbar'>
								<div className='divide-y divide-muted'>
									{stats?.followedMentors?.length > 0 ? (
										stats.followedMentors.map(mentor => (
											<div
												key={mentor.id}
												className='p-4 hover:bg-muted/30 transition-colors flex items-center justify-between group'
											>
												<div className='flex items-center gap-3'>
													<div className='h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors'>
														{mentor.name.charAt(0)?.toUpperCase()}
													</div>
													<div>
														<p className='font-bold text-sm text-foreground'>
															{mentor.name}
														</p>
														<p className='text-[11px] font-medium text-muted-foreground mt-0.5'>
															{mentor.specialty}
														</p>
													</div>
												</div>
												<div className='flex items-center gap-1 bg-background border px-2 py-1 rounded-md shadow-sm'>
													<Star className='w-3 h-3 text-yellow-500 fill-current' />
													<span className='font-bold text-xs'>
														{mentor.rating}
													</span>
												</div>
											</div>
										))
									) : (
										<div className='flex flex-col items-center justify-center p-12 text-center text-muted-foreground'>
											<div className='bg-muted p-4 rounded-full mb-3'>
												<Users className='w-8 h-8 opacity-40' />
											</div>
											<p className='text-sm font-medium'>
												Siz hali hech kimga obuna bo'lmagansiz
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
