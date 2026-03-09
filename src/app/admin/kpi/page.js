'use client'

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
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import {
	Activity,
	ArrowDownRight,
	ArrowUpRight,
	BookOpen,
	GraduationCap,
	TrendingUp,
	UserCheck,
	Users,
	UserX,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'

// ==========================================
// 🧩 YORDAMCHI KOMPONENTLAR (Skeleton)
// ==========================================
const DashboardSkeleton = () => (
	<div className='max-w-7xl mx-auto space-y-6 pb-12 pt-6 px-4 sm:px-6 lg:px-8 animate-pulse'>
		<div className='flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6'>
			<div className='space-y-2'>
				<Skeleton className='h-8 w-64' />
				<Skeleton className='h-4 w-80' />
			</div>
			<Skeleton className='h-10 w-64 rounded-md' />
		</div>

		<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
			{[1, 2, 3, 4].map(i => (
				<Skeleton key={i} className='h-32 w-full rounded-xl' />
			))}
		</div>

		<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
			<Skeleton className='h-[450px] w-full rounded-xl' />
			<Skeleton className='h-[450px] w-full rounded-xl' />
		</div>

		<Skeleton className='h-[400px] w-full rounded-xl' />
	</div>
)

// ==========================================
// 🚀 ASOSIY KOMPONENT
// ==========================================
export default function KPIDashboardPage() {
	const { t } = useTranslation()

	const [timeRange, setTimeRange] = useState('monthly')
	const [stats, setStats] = useState(null)
	const [loading, setLoading] = useState(true)

	// Time ranges (O'zgaruvchi qayta yaratilmasligi uchun useMemo da)
	const timeRanges = useMemo(
		() => [
			{ key: 'daily', label: t('dashboard.daily') || 'Kunlik' },
			{ key: 'monthly', label: t('dashboard.monthly') || 'Oylik' },
			{ key: 'yearly', label: t('dashboard.yearly') || 'Yillik' },
		],
		[t],
	)

	// 1. API dan statistikani tortish
	const fetchStats = useCallback(async range => {
		try {
			setLoading(true)
			// Agar admin kpi API yo'q bo'lsa xatolik yozmasdan shunchaki null qaytaradi
			const res = await api
				.get(`/admin/kpi/stats?range=${range}`)
				.catch(() => null)

			if (res?.data?.success) {
				setStats(res.data.stats)
			} else {
				// Fallback ma'lumot (Agar API tayyor bo'lmasa qotib qolmasligi uchun)
				setStats({
					totalStudents: 0,
					activeMentors: 0,
					totalLessons: 0,
					pendingApplications: 0,
					chartData: [],
					lessonAttendance: [],
					userActivity: [],
				})
			}
		} catch (error) {
			console.error('Failed to fetch stats', error)
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		fetchStats(timeRange)
	}, [timeRange, fetchStats])

	// 2. Trendni aniqlash (+ yoki -)
	const getTrend = useCallback(change => {
		if (!change) return 'up'
		return change.toString().startsWith('-') ? 'down' : 'up'
	}, [])

	// UI: Loading holati (Dastlabki kirganda)
	if (loading && !stats) {
		return <DashboardSkeleton />
	}

	// Diagramma uchun maksimal qiymatni aniqlash
	const chartData = stats?.chartData || []
	const maxChartVal = Math.max(
		...chartData.map(d => Math.max(d.students || 0, d.mentors || 0)),
		1,
	)

	// UI: Asosiy Dashboard
	return (
		<div className='max-w-7xl mx-auto space-y-6 pb-12 pt-6 px-4 sm:px-6 lg:px-8'>
			{/* 🏷️ HEADER & FILTERS */}
			<div className='flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6'>
				<div>
					<h1 className='text-2xl font-bold tracking-tight'>
						{t('dashboard.kpiIndicators') || "KPI Ko'rsatkichlari"}
					</h1>
					<p className='text-muted-foreground mt-1 text-sm'>
						{t('dashboard.kpiDesc') ||
							"Tizimdagi umumiy o'sish va faollik tahlili"}
					</p>
				</div>
				<div className='flex items-center gap-3'>
					<div className='flex items-center bg-muted p-1 rounded-md border shadow-sm'>
						{timeRanges.map(r => (
							<button
								key={r.key}
								onClick={() => setTimeRange(r.key)}
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
			</div>

			{loading && stats && (
				<div className='flex items-center justify-end text-xs font-medium text-muted-foreground animate-pulse mt-[-10px]'>
					{t('dashboard.updating') || 'Yangilanmoqda...'}
				</div>
			)}

			{/* 📊 ASOSIY KARTALAR (TOP CARDS) */}
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
				{[
					{
						title: t('dashboard.totalStudents') || 'Jami Talabalar',
						value: stats?.totalStudents || 0,
						change: stats?.studentsChange,
						icon: GraduationCap,
					},
					{
						title: t('dashboard.activeMentors') || 'Faol Mentorlar',
						value: stats?.activeMentors || 0,
						change: stats?.mentorsChange,
						icon: Users,
					},
					{
						title: t('dashboard.totalLessons') || 'Jami Darslar',
						value: stats?.totalLessons || 0,
						change: stats?.lessonsChange,
						icon: BookOpen,
					},
					{
						title: t('dashboard.newApplications') || 'Yangi Arizalar',
						value: stats?.pendingApplications || 0,
						change: null, // Arizalarda o'zgarish foizi shart emas
						icon: Activity,
					},
				].map((m, idx) => {
					const trend = getTrend(m.change)
					return (
						<Card
							key={idx}
							className='shadow-sm hover:shadow-md transition-shadow'
						>
							<CardContent className='p-6'>
								<div className='flex items-center justify-between space-y-0 pb-2'>
									<p className='text-sm font-medium text-muted-foreground'>
										{m.title}
									</p>
									<m.icon className='h-4 w-4 text-muted-foreground' />
								</div>
								<div className='flex items-baseline justify-between mt-2'>
									<h2 className='text-3xl font-bold tracking-tight'>
										{m.value.toLocaleString()}
									</h2>
									{m.change && (
										<span
											className={cn(
												'flex items-center text-xs font-medium',
												trend === 'up' ? 'text-green-600' : 'text-red-600',
											)}
										>
											{trend === 'up' ? (
												<ArrowUpRight className='mr-1 h-3 w-3' />
											) : (
												<ArrowDownRight className='mr-1 h-3 w-3' />
											)}
											{m.change}
										</span>
									)}
								</div>
							</CardContent>
						</Card>
					)
				})}
			</div>

			{/* 📈 O'RTA QISM (Davomat va Faollik) */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				{/* CHAP: Davomat tahlili */}
				<Card className='shadow-sm flex flex-col'>
					<CardHeader className='border-b bg-muted/20 pb-4'>
						<CardTitle className='text-base flex items-center gap-2'>
							<UserCheck className='w-4 h-4 text-muted-foreground' />
							{t('dashboard.attendanceAnalysis') || 'Davomat Tahlili'}
						</CardTitle>
						<CardDescription className='text-xs'>
							Oxirgi darslardagi qatnashish ko'rsatkichi
						</CardDescription>
					</CardHeader>
					<CardContent className='p-0 flex-1 overflow-auto max-h-[400px] no-scrollbar'>
						<div className='divide-y'>
							{stats?.lessonAttendance?.length > 0 ? (
								stats.lessonAttendance.map(lesson => {
									const attendRate =
										lesson.registered > 0
											? Math.round((lesson.attended / lesson.registered) * 100)
											: 0
									return (
										<div
											key={lesson.id}
											className='p-4 hover:bg-muted/30 transition-colors'
										>
											<div className='flex items-center justify-between mb-2'>
												<div className='flex-1 min-w-0 pr-4'>
													<p className='font-semibold text-sm truncate text-foreground'>
														{lesson.title}
													</p>
													<p className='text-xs text-muted-foreground truncate'>
														{lesson.mentorName}
													</p>
												</div>
												<span
													className={cn(
														'text-xs font-bold',
														attendRate >= 70
															? 'text-green-600'
															: attendRate >= 40
																? 'text-yellow-600'
																: 'text-destructive',
													)}
												>
													{attendRate}%
												</span>
											</div>

											<div className='flex items-center gap-4 text-xs mt-2 mb-3'>
												<span className='flex items-center gap-1 text-muted-foreground'>
													<Users className='w-3 h-3' /> {lesson.registered}{' '}
													{t('dashboard.registered') || 'yozilgan'}
												</span>
												<span className='flex items-center gap-1 text-muted-foreground'>
													<UserCheck className='w-3 h-3' /> {lesson.attended}{' '}
													{t('dashboard.attended') || 'qatnashdi'}
												</span>
											</div>

											<div className='h-1.5 bg-muted rounded-full overflow-hidden'>
												<motion.div
													initial={{ width: 0 }}
													animate={{ width: `${attendRate}%` }}
													transition={{ duration: 1, ease: 'easeOut' }}
													className={cn(
														'h-full rounded-full',
														attendRate >= 70
															? 'bg-green-500'
															: attendRate >= 40
																? 'bg-yellow-500'
																: 'bg-destructive',
													)}
												/>
											</div>
										</div>
									)
								})
							) : (
								<div className='p-12 text-center text-muted-foreground text-sm flex flex-col items-center'>
									<UserX className='w-8 h-8 mb-2 opacity-20' />
									{t('dashboard.noAttendanceData') ||
										"Davomat ma'lumotlari hozircha yo'q"}
								</div>
							)}
						</div>
					</CardContent>
				</Card>

				{/* O'NG: Foydalanuvchi faolligi */}
				<Card className='shadow-sm flex flex-col'>
					<CardHeader className='border-b bg-muted/20 pb-4'>
						<CardTitle className='text-base flex items-center gap-2'>
							<Activity className='w-4 h-4 text-muted-foreground' />
							{t('dashboard.userActivity') || 'Foydalanuvchi Faolligi'}
						</CardTitle>
						<CardDescription className='text-xs'>
							Platformadan foydalanish darajasi
						</CardDescription>
					</CardHeader>
					<CardContent className='p-6 space-y-6 flex-1 flex flex-col justify-between'>
						<div className='space-y-6'>
							{(stats?.userActivity || []).map((item, idx) => (
								<div key={idx} className='space-y-2'>
									<div className='flex items-center justify-between text-sm'>
										<span className='font-medium text-foreground'>
											{item.label}
										</span>
										<span className='text-muted-foreground'>{item.value}%</span>
									</div>
									<div className='h-2 w-full bg-muted rounded-full overflow-hidden'>
										<motion.div
											initial={{ width: 0 }}
											animate={{ width: `${item.value}%` }}
											transition={{
												duration: 1,
												ease: 'easeOut',
												delay: idx * 0.1,
											}}
											className={cn(
												'h-full rounded-full',
												idx === 0
													? 'bg-primary'
													: idx === 1
														? 'bg-blue-500'
														: 'bg-purple-500',
											)}
										/>
									</div>
								</div>
							))}

							{(!stats?.userActivity || stats.userActivity.length === 0) && (
								<div className='text-center text-muted-foreground text-sm py-10 flex flex-col items-center'>
									<Activity className='w-8 h-8 mb-2 opacity-20' />
									{t('dashboard.noActivityData') || "Faollik ma'lumotlari yo'q"}
								</div>
							)}
						</div>

						<div className='grid grid-cols-2 gap-4 pt-6 border-t mt-auto'>
							<div className='bg-muted/30 p-4 rounded-xl border shadow-sm flex flex-col justify-center items-center text-center'>
								<p className='text-xs text-muted-foreground font-medium mb-1'>
									{t('dashboard.todayLessons') || 'Bugungi darslar'}
								</p>
								<p className='text-2xl font-bold text-foreground'>
									{stats?.todayLessonsCount || 0}
								</p>
							</div>
							<div className='bg-muted/30 p-4 rounded-xl border shadow-sm flex flex-col justify-center items-center text-center'>
								<p className='text-xs text-muted-foreground font-medium mb-1'>
									{t('dashboard.activeMentors') || 'Faol Mentorlar'}
								</p>
								<p className='text-2xl font-bold text-foreground'>
									{stats?.activeMentors || 0}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* 📈 PASTKI QISM (O'sish grafigi) */}
			<Card className='shadow-sm'>
				<CardHeader className='border-b bg-muted/20 pb-4 flex flex-row items-center justify-between'>
					<div>
						<CardTitle className='text-base flex items-center gap-2'>
							<TrendingUp className='w-4 h-4 text-muted-foreground' />
							{t('dashboard.growthGraph') || "O'sish Grafigi"}
						</CardTitle>
						<CardDescription className='text-xs mt-1'>
							Vaqt kesimida foydalanuvchilar o'sishi
						</CardDescription>
					</div>
					<div className='flex items-center gap-3 text-xs font-medium'>
						<div className='flex items-center gap-1.5'>
							<span className='w-2.5 h-2.5 rounded-full bg-primary' />
							{t('dashboard.students') || 'Talabalar'}
						</div>
						<div className='flex items-center gap-1.5'>
							<span className='w-2.5 h-2.5 rounded-full bg-blue-500' />
							{t('dashboard.mentors') || 'Mentorlar'}
						</div>
					</div>
				</CardHeader>
				<CardContent className='p-6'>
					<div className='flex items-end justify-between h-48 gap-2'>
						{chartData.length > 0 ? (
							chartData.map((d, i) => {
								const sH =
									maxChartVal > 0 ? (d.students / maxChartVal) * 100 : 5
								const mH = maxChartVal > 0 ? (d.mentors / maxChartVal) * 100 : 2
								return (
									<div
										key={i}
										className='flex-1 flex flex-col items-center gap-2 group/bar h-full'
									>
										{/* Tooltip (Hover qilganda chiqadi) */}
										<div className='text-[10px] text-muted-foreground font-medium opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap bg-muted px-1.5 py-0.5 rounded'>
											{d.students} / {d.mentors}
										</div>

										{/* Ustunlar (Bars) */}
										<div className='w-full flex gap-1 items-end justify-center h-full relative'>
											<motion.div
												initial={{ height: 0 }}
												animate={{ height: `${Math.max(sH, 2)}%` }}
												transition={{ duration: 0.8, delay: i * 0.05 }}
												className='w-full bg-primary/20 group-hover/bar:bg-primary rounded-t-sm transition-colors'
											/>
											<motion.div
												initial={{ height: 0 }}
												animate={{ height: `${Math.max(mH, 2)}%` }}
												transition={{ duration: 0.8, delay: i * 0.05 }}
												className='w-full bg-blue-500/20 group-hover/bar:bg-blue-500 rounded-t-sm transition-colors'
											/>
										</div>

										<span className='text-[10px] text-muted-foreground truncate w-full text-center'>
											{d.label}
										</span>
									</div>
								)
							})
						) : (
							<div className='w-full h-full flex items-center justify-center text-sm text-muted-foreground border border-dashed rounded-lg bg-muted/10'>
								Grafik ma'lumotlari yo'q
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
