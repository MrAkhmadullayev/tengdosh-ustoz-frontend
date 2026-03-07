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
import { useCallback, useEffect, useState } from 'react'

const TIME_RANGES = [
	{ key: 'daily', label: 'Kunlik' },
	{ key: 'monthly', label: 'Oylik' },
	{ key: 'yearly', label: 'Yillik' },
]

// Yuklanish jarayoni uchun Skeleton komponenti
const DashboardSkeleton = () => (
	<div className='max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500'>
		<div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
			<div className='space-y-2'>
				<Skeleton className='h-9 w-64' />
				<Skeleton className='h-4 w-80' />
			</div>
			<Skeleton className='h-10 w-64 rounded-xl' />
		</div>

		<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
			{[1, 2, 3, 4].map(i => (
				<Skeleton key={i} className='h-36 w-full rounded-3xl' />
			))}
		</div>

		<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
			<Skeleton className='h-[450px] w-full rounded-3xl' />
			<Skeleton className='h-[450px] w-full rounded-3xl' />
		</div>

		<Skeleton className='h-[400px] w-full rounded-3xl' />
	</div>
)

export default function KPIDashboardPage() {
	const [timeRange, setTimeRange] = useState('monthly')
	const [stats, setStats] = useState(null)
	const [loading, setLoading] = useState(true)

	const fetchStats = useCallback(async range => {
		try {
			setLoading(true)
			const res = await api.get(`/admin/kpi/stats?range=${range}`)
			if (res.data.success) {
				setStats(res.data.stats)
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

	const getTrend = change => {
		if (!change) return 'up'
		return change.startsWith('-') ? 'down' : 'up'
	}

	// Loading holati endi Skeleton qaytaradi
	if (loading && !stats) {
		return <DashboardSkeleton />
	}

	const chartData = stats?.chartData || []
	const maxChartVal = Math.max(
		...chartData.map(d => Math.max(d.students, d.mentors)),
		1,
	)

	return (
		<div className='max-w-7xl mx-auto space-y-8 pb-12'>
			{/* Header */}
			<div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>
						KPI Ko&apos;rsatkichlar
					</h1>
					<p className='text-muted-foreground mt-1 text-sm'>
						Darslar, foydalanuvchilar faolligi va davomat tahlili.
					</p>
				</div>
				<div className='flex items-center gap-3'>
					<div className='flex items-center bg-muted/50 rounded-xl p-1 gap-1'>
						{TIME_RANGES.map(r => (
							<button
								key={r.key}
								onClick={() => setTimeRange(r.key)}
								className={cn(
									'px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200',
									timeRange === r.key
										? 'bg-primary text-white shadow-md shadow-primary/25'
										: 'text-muted-foreground hover:text-foreground hover:bg-muted',
								)}
							>
								{r.label}
							</button>
						))}
					</div>
				</div>
			</div>

			{/* Orqa fonda ma'lumot yangilanayotganini ko'rsatish */}
			{loading && stats && (
				<div className='flex items-center justify-end text-sm text-muted-foreground animate-pulse'>
					Yangilanmoqda...
				</div>
			)}

			{/* Main Metrics */}
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
				{[
					{
						title: "Jami O'quvchilar",
						value: stats?.totalStudents || 0,
						change: stats?.studentsChange,
						icon: <GraduationCap className='w-6 h-6 text-blue-500' />,
						bg: 'bg-blue-50',
					},
					{
						title: 'Faol Mentorlar',
						value: stats?.activeMentors || 0,
						change: stats?.mentorsChange,
						icon: <Users className='w-6 h-6 text-green-500' />,
						bg: 'bg-green-50',
					},
					{
						title: 'Jami Darslar',
						value: stats?.totalLessons || 0,
						change: stats?.lessonsChange,
						icon: <BookOpen className='w-6 h-6 text-purple-500' />,
						bg: 'bg-purple-50',
					},
					{
						title: 'Yangi Arizalar',
						value: stats?.pendingApplications || 0,
						icon: <Activity className='w-6 h-6 text-orange-500' />,
						bg: 'bg-orange-50',
					},
				].map((m, idx) => {
					const trend = getTrend(m.change)
					return (
						<Card
							key={idx}
							className='group hover:shadow-xl transition-all duration-300 border-muted/60 rounded-3xl overflow-hidden relative'
						>
							<CardContent className='p-6'>
								<div className='flex items-center justify-between mb-4'>
									<div
										className={cn(
											'p-3 rounded-2xl transition-transform group-hover:scale-110 duration-300',
											m.bg,
										)}
									>
										{m.icon}
									</div>
									{m.change && (
										<Badge
											variant='outline'
											className={cn(
												'rounded-lg gap-1 border-none font-bold',
												trend === 'up'
													? 'text-green-600 bg-green-50'
													: 'text-red-600 bg-red-50',
											)}
										>
											{trend === 'up' ? (
												<ArrowUpRight className='w-3 h-3' />
											) : (
												<ArrowDownRight className='w-3 h-3' />
											)}
											{m.change}
										</Badge>
									)}
								</div>
								<p className='text-muted-foreground text-sm font-medium'>
									{m.title}
								</p>
								<h2 className='text-3xl font-extrabold tracking-tight'>
									{m.value.toLocaleString()}
								</h2>
							</CardContent>
							<div
								className={cn(
									'absolute bottom-0 left-0 h-1 w-full',
									trend === 'up' ? 'bg-green-500/20' : 'bg-red-500/20',
								)}
							/>
						</Card>
					)
				})}
			</div>

			{/* Darslar Tahlili */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
				{/* Dars bo'yicha kelish tahlili */}
				<Card className='shadow-sm border-muted rounded-3xl overflow-hidden'>
					<CardHeader className='bg-muted/30 border-b p-6'>
						<CardTitle className='text-lg flex items-center gap-2'>
							<UserCheck className='w-5 h-5 text-green-500' /> Dars Davomat
							Tahlili
						</CardTitle>
						<CardDescription>
							Har bir darsga nechta talaba yozilgan va nechta kelgan
						</CardDescription>
					</CardHeader>
					<CardContent className='p-0'>
						<div className='divide-y max-h-[400px] overflow-auto'>
							{stats?.lessonAttendance?.length > 0 ? (
								stats.lessonAttendance.map((lesson, idx) => {
									const attendRate =
										lesson.registered > 0
											? Math.round((lesson.attended / lesson.registered) * 100)
											: 0
									return (
										<motion.div
											initial={{ opacity: 0, x: -10 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: idx * 0.05 }}
											key={lesson.id}
											className='p-4 hover:bg-muted/20 transition-colors'
										>
											<div className='flex items-center justify-between mb-2'>
												<div className='flex-1 min-w-0'>
													<p className='font-bold text-sm truncate'>
														{lesson.title}
													</p>
													<p className='text-xs text-muted-foreground'>
														{lesson.mentorName}
													</p>
												</div>
												<Badge
													variant='outline'
													className={cn(
														'ml-2 border-none font-bold',
														attendRate >= 70
															? 'bg-green-50 text-green-600'
															: attendRate >= 40
																? 'bg-yellow-50 text-yellow-600'
																: 'bg-red-50 text-red-600',
													)}
												>
													{attendRate}%
												</Badge>
											</div>
											<div className='flex items-center gap-4 text-xs'>
												<span className='flex items-center gap-1 text-blue-600'>
													<Users className='w-3 h-3' /> {lesson.registered}{' '}
													yozilgan
												</span>
												<span className='flex items-center gap-1 text-green-600'>
													<UserCheck className='w-3 h-3' /> {lesson.attended}{' '}
													kelgan
												</span>
												<span className='flex items-center gap-1 text-red-500'>
													<UserX className='w-3 h-3' />{' '}
													{lesson.registered - lesson.attended} kelmagan
												</span>
											</div>
											<div className='mt-2 h-2 bg-muted rounded-full overflow-hidden'>
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
																: 'bg-red-500',
													)}
												/>
											</div>
										</motion.div>
									)
								})
							) : (
								<div className='p-8 text-center text-muted-foreground text-sm'>
									Davomat ma&apos;lumotlari mavjud emas
								</div>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Foydalanuvchilar faolligi */}
				<Card className='shadow-sm border-muted rounded-3xl overflow-hidden'>
					<CardHeader className='bg-muted/30 border-b p-6'>
						<CardTitle className='text-lg flex items-center gap-2'>
							<Activity className='w-5 h-5 text-primary' /> Foydalanuvchilar
							Faolligi
						</CardTitle>
						<CardDescription>
							Tizimdan foydalanish va darslar faollik darajasi
						</CardDescription>
					</CardHeader>
					<CardContent className='p-6 space-y-6'>
						{(stats?.userActivity || []).map((item, idx) => (
							<div key={idx} className='space-y-3'>
								<div className='flex items-center justify-between text-sm font-bold'>
									<span className='text-muted-foreground'>{item.label}</span>
									<span>{item.value}%</span>
								</div>
								<div className='h-3 w-full bg-muted rounded-full overflow-hidden'>
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
												? 'bg-blue-500'
												: idx === 1
													? 'bg-green-500'
													: 'bg-purple-500',
										)}
									/>
								</div>
							</div>
						))}

						{(!stats?.userActivity || stats.userActivity.length === 0) && (
							<div className='text-center text-muted-foreground text-sm py-4'>
								Faollik ma&apos;lumotlari mavjud emas
							</div>
						)}

						<div className='grid grid-cols-2 gap-4 pt-4 border-t'>
							<div className='bg-blue-50 p-4 rounded-2xl space-y-1'>
								<p className='text-[10px] text-blue-600 font-bold uppercase'>
									Bugungi darslar
								</p>
								<p className='text-2xl font-bold text-blue-700'>
									{stats?.todayLessonsCount || 0}
								</p>
							</div>
							<div className='bg-green-50 p-4 rounded-2xl space-y-1'>
								<p className='text-[10px] text-green-600 font-bold uppercase'>
									Faol mentorlar
								</p>
								<p className='text-2xl font-bold text-green-700'>
									{stats?.activeMentors || 0}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* O'sish grafigi */}
			<Card className='shadow-sm border-muted rounded-3xl overflow-hidden'>
				<CardHeader className='bg-muted/30 border-b p-6'>
					<div className='flex items-center justify-between'>
						<div className='space-y-1'>
							<CardTitle className='text-lg flex items-center gap-2'>
								<TrendingUp className='w-5 h-5 text-primary' /> Yangi
								Foydalanuvchilar
							</CardTitle>
							<CardDescription>
								Yangi qo&apos;shilgan talaba va mentorlar soni
							</CardDescription>
						</div>
						<div className='flex items-center gap-4 text-xs font-semibold'>
							<div className='flex items-center gap-2'>
								<span className='w-3 h-3 rounded-full bg-blue-500' /> Talabalar
							</div>
							<div className='flex items-center gap-2'>
								<span className='w-3 h-3 rounded-full bg-green-500' /> Mentorlar
							</div>
						</div>
					</div>
				</CardHeader>
				<CardContent className='p-8'>
					<div className='flex items-end justify-between h-48 gap-3'>
						{chartData.map((d, i) => {
							const sH = maxChartVal > 0 ? (d.students / maxChartVal) * 100 : 5
							const mH = maxChartVal > 0 ? (d.mentors / maxChartVal) * 100 : 2
							return (
								<div
									key={i}
									className='flex-1 flex flex-col items-center gap-2 group/bar'
								>
									<div className='text-[10px] text-muted-foreground font-bold opacity-0 group-hover/bar:opacity-100 transition-opacity'>
										{d.students}/{d.mentors}
									</div>
									<div className='w-full flex gap-1 items-end justify-center'>
										<motion.div
											initial={{ height: 0 }}
											animate={{ height: `${Math.max(sH, 4)}%` }}
											transition={{ duration: 0.8, delay: i * 0.05 }}
											className='w-full bg-blue-500/20 group-hover/bar:bg-blue-500 rounded-t-lg transition-colors duration-300'
										/>
										<motion.div
											initial={{ height: 0 }}
											animate={{ height: `${Math.max(mH, 4)}%` }}
											transition={{ duration: 0.8, delay: i * 0.05 }}
											className='w-full bg-green-500/20 group-hover/bar:bg-green-500 rounded-t-lg transition-colors duration-300'
										/>
									</div>
									<span className='text-[10px] text-muted-foreground font-mono'>
										{d.label}
									</span>
								</div>
							)
						})}
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
