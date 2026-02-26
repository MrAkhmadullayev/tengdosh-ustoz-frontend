'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
	ArrowDownRight,
	ArrowUpRight,
	Award,
	BookOpen,
	Calendar as CalendarIcon,
	ChevronRight,
	Clock,
	DollarSign,
	Download,
	GraduationCap,
	Target,
	TrendingUp,
	Users,
	Zap,
} from 'lucide-react'
import { useState } from 'react'

// Mock Data for KPI
const KPI_METRICS = [
	{
		title: "Jami O'quvchilar",
		value: '2.450',
		change: '+12%',
		trend: 'up',
		icon: <GraduationCap className='w-6 h-6 text-blue-500' />,
		bgColor: 'bg-blue-50',
	},
	{
		title: 'Faol Mentorlar',
		value: '128',
		change: '+5%',
		trend: 'up',
		icon: <Users className='w-6 h-6 text-green-500' />,
		bgColor: 'bg-green-50',
	},
	{
		title: 'Umumiy Daromad',
		value: '45.2M',
		change: '+24%',
		trend: 'up',
		icon: <DollarSign className='w-6 h-6 text-orange-500' />,
		bgColor: 'bg-orange-50',
	},
	{
		title: 'Darslar Soni',
		value: '1.240',
		change: '-2%',
		trend: 'down',
		icon: <BookOpen className='w-6 h-6 text-purple-500' />,
		bgColor: 'bg-purple-50',
	},
]

const TOP_MENTORS = [
	{
		id: 1,
		name: "Javohir To'rayev",
		rating: 4.9,
		students: 450,
		growth: '+15%',
	},
	{
		id: 2,
		name: "Olimjon G'aniyev",
		rating: 4.8,
		students: 380,
		growth: '+10%',
	},
	{ id: 3, name: 'Malika Qodirova', rating: 4.7, students: 310, growth: '+8%' },
	{
		id: 4,
		name: 'Samandar Abduvohidov',
		rating: 4.9,
		students: 290,
		growth: '+12%',
	},
]

const CONVERSION_STATS = [
	{ label: "Ro'yxatdan o'tish", value: 85, color: 'bg-blue-500' },
	{ label: "Obuna bo'lish", value: 62, color: 'bg-green-500' },
	{ label: 'Darsni tugatish', value: 48, color: 'bg-purple-500' },
]

export default function KPIDashboardPage() {
	const [timeRange, setTimeRange] = useState('monthly')

	return (
		<div className='max-w-7xl mx-auto space-y-8 pb-12'>
			{/* Header Section */}
			<div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>
						KPI Ko'rsatkichlar
					</h1>
					<p className='text-muted-foreground mt-1 text-sm'>
						Platformaning asosiy samaradorlik ko'rsatkichlari va o'sish
						dinamikasi.
					</p>
				</div>
				<div className='flex items-center gap-3'>
					<Button variant='outline' className='rounded-xl gap-2 font-medium'>
						<CalendarIcon className='w-4 h-4 text-muted-foreground' />
						{timeRange === 'monthly' ? 'Oxirgi 30 kun' : 'Oxirgi 7 kun'}
					</Button>
					<Button className='rounded-xl gap-2 shadow-lg shadow-primary/20'>
						<Download className='w-4 h-4' /> Hisobotni yuklash
					</Button>
				</div>
			</div>

			{/* Metric Cards Grid */}
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
				{KPI_METRICS.map((metric, idx) => (
					<Card
						key={idx}
						className='group hover:shadow-xl transition-all duration-300 border-muted/60 rounded-3xl overflow-hidden relative'
					>
						<CardContent className='p-6'>
							<div className='flex items-center justify-between mb-4'>
								<div
									className={cn(
										'p-3 rounded-2xl transition-transform group-hover:scale-110 duration-300',
										metric.bgColor,
									)}
								>
									{metric.icon}
								</div>
								<Badge
									variant='outline'
									className={cn(
										'rounded-lg gap-1 border-none font-bold',
										metric.trend === 'up'
											? 'text-green-600 bg-green-50'
											: 'text-red-600 bg-red-50',
									)}
								>
									{metric.trend === 'up' ? (
										<ArrowUpRight className='w-3 h-3' />
									) : (
										<ArrowDownRight className='w-3 h-3' />
									)}
									{metric.change}
								</Badge>
							</div>
							<div className='space-y-1 text-foreground'>
								<p className='text-muted-foreground text-sm font-medium'>
									{metric.title}
								</p>
								<h2 className='text-3xl font-extrabold tracking-tight'>
									{metric.value}
								</h2>
							</div>
						</CardContent>
						<div
							className={cn(
								'absolute bottom-0 left-0 h-1 w-full',
								metric.trend === 'up' ? 'bg-green-500/20' : 'bg-red-500/20',
							)}
						/>
					</Card>
				))}
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
				{/* Growth Dynamics (Chart Placeholder) */}
				<Card className='lg:col-span-2 shadow-sm border-muted rounded-3xl overflow-hidden flex flex-col'>
					<CardHeader className='bg-muted/30 border-b p-6'>
						<div className='flex items-center justify-between'>
							<div className='space-y-1'>
								<CardTitle className='text-lg flex items-center gap-2'>
									<TrendingUp className='w-5 h-5 text-primary' /> O'sish
									Dinamikasi
								</CardTitle>
								<CardDescription>
									O'quvchilar va Mentorlar soni o'zgarishi
								</CardDescription>
							</div>
							<div className='flex items-center gap-4 text-xs font-semibold'>
								<div className='flex items-center gap-2'>
									<span className='w-3 h-3 rounded-full bg-blue-500' />{' '}
									O'quvchilar
								</div>
								<div className='flex items-center gap-2'>
									<span className='w-3 h-3 rounded-full bg-green-500' />{' '}
									Mentorlar
								</div>
							</div>
						</div>
					</CardHeader>
					<CardContent className='flex-1 p-8 flex flex-col justify-end min-h-[300px]'>
						{/* Simulated Bar Chart with CSS */}
						<div className='flex items-end justify-between h-48 gap-4'>
							{[40, 60, 45, 80, 55, 90, 75].map((h, i) => (
								<div
									key={i}
									className='flex-1 flex flex-col items-center gap-2 group'
								>
									<div className='w-full flex gap-1 items-end justify-center'>
										<div
											className='w-full bg-blue-500/20 group-hover:bg-blue-500 rounded-t-lg transition-all duration-500'
											style={{ height: `${h}%` }}
										/>
										<div
											className='w-full bg-green-500/20 group-hover:bg-green-500 rounded-t-lg transition-all duration-500'
											style={{ height: `${h * 0.4}%` }}
										/>
									</div>
									<span className='text-[10px] text-muted-foreground font-mono'>
										Haf-{i + 1}
									</span>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Conversion & Funnel */}
				<Card className='shadow-sm border-muted rounded-3xl overflow-hidden'>
					<CardHeader className='bg-muted/30 border-b p-6'>
						<CardTitle className='text-lg flex items-center gap-2'>
							<Target className='w-5 h-5 text-orange-500' /> Konversiya
						</CardTitle>
						<CardDescription>Foydalanuvchilar qatlamli o'sishi</CardDescription>
					</CardHeader>
					<CardContent className='p-6 space-y-8'>
						{CONVERSION_STATS.map((stat, idx) => (
							<div key={idx} className='space-y-3'>
								<div className='flex items-center justify-between text-sm font-bold'>
									<span className='text-muted-foreground'>{stat.label}</span>
									<span>{stat.value}%</span>
								</div>
								<div className='h-3 w-full bg-muted rounded-full overflow-hidden'>
									<div
										className={cn(
											'h-full transition-all duration-1000 ease-out rounded-full',
											stat.color,
										)}
										style={{ width: `${stat.value}%` }}
									/>
								</div>
							</div>
						))}
						<div className='pt-4'>
							<div className='bg-orange-50 p-4 rounded-2xl border border-orange-100 space-y-2'>
								<div className='flex items-center gap-2 text-orange-600 font-bold text-sm'>
									<Zap className='w-4 h-4' /> Tavsiya
								</div>
								<p className='text-xs text-orange-800 leading-relaxed font-medium'>
									Ro'yxatdan o'tganlarning obunaga o'tish ko'rsatkichi o'tgan
									oyga nisbatan 14% ga oshdi. Promo-kodlar yaxshi ishlamoqda.
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Second Row: Leaderboard & Recent Activity */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
				{/* Top Mentors */}
				<Card className='shadow-sm border-muted rounded-3xl overflow-hidden'>
					<CardHeader className='bg-muted/30 border-b p-6 flex flex-row items-center justify-between'>
						<div className='space-y-1'>
							<CardTitle className='text-lg flex items-center gap-2'>
								<Award className='w-5 h-5 text-yellow-500' /> Top Mentorlar
							</CardTitle>
							<CardDescription>
								Reyting va talabalar soni bo'yicha
							</CardDescription>
						</div>
						<Button
							variant='ghost'
							size='sm'
							className='text-primary font-bold rounded-lg'
						>
							Barchasi <ChevronRight className='w-4 h-4 ml-1' />
						</Button>
					</CardHeader>
					<CardContent className='p-0 text-foreground'>
						<div className='divide-y'>
							{TOP_MENTORS.map(mentor => (
								<div
									key={mentor.id}
									className='p-4 hover:bg-muted/20 transition-colors flex items-center justify-between group'
								>
									<div className='flex items-center gap-4'>
										<div className='h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm'>
											{mentor.name.charAt(0)}
										</div>
										<div className='space-y-0.5'>
											<p className='font-bold group-hover:text-primary transition-colors'>
												{mentor.name}
											</p>
											<div className='flex items-center gap-3 text-xs text-muted-foreground font-medium'>
												<span className='flex items-center gap-1'>
													<Target className='w-3 h-3 text-yellow-500 fill-yellow-500' />{' '}
													{mentor.rating}
												</span>
												<span>{mentor.students} o'quvchi</span>
											</div>
										</div>
									</div>
									<Badge
										variant='outline'
										className='text-green-600 bg-green-50 border-none font-bold'
									>
										{mentor.growth}
									</Badge>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Real-time Status Card */}
				<Card className='shadow-sm border-muted rounded-3xl overflow-hidden bg-zinc-900 text-white'>
					<CardHeader className='border-b border-white/10 p-6'>
						<CardTitle className='text-lg flex items-center gap-2 text-white'>
							<Clock className='w-5 h-5 text-blue-400' /> Real Vaqtdagi Holat
						</CardTitle>
						<CardDescription className='text-zinc-400'>
							Hozirgi vaqtda platformadagi faollik
						</CardDescription>
					</CardHeader>
					<CardContent className='p-8 space-y-10'>
						<div className='flex items-center justify-between'>
							<div className='space-y-1'>
								<p className='text-xs text-zinc-400 font-bold uppercase tracking-widest'>
									Hozir onlayn
								</p>
								<div className='flex items-baseline gap-2'>
									<h2 className='text-5xl font-black text-blue-400'>458</h2>
									<span className='w-3 h-3 rounded-full bg-green-500 animate-pulse' />
								</div>
							</div>
							<div className='text-right space-y-1'>
								<p className='text-xs text-zinc-400 font-bold uppercase tracking-widest'>
									Jonli Darslar
								</p>
								<h2 className='text-4xl font-black'>12</h2>
							</div>
						</div>

						<div className='grid grid-cols-2 gap-6'>
							<div className='bg-white/5 p-4 rounded-2xl border border-white/5 space-y-1'>
								<p className='text-[10px] text-zinc-500 font-bold uppercase'>
									Bugungi darslar
								</p>
								<p className='text-2xl font-bold'>34 ta</p>
							</div>
							<div className='bg-white/5 p-4 rounded-2xl border border-white/5 space-y-1'>
								<p className='text-[10px] text-zinc-500 font-bold uppercase'>
									Yangi arizalar
								</p>
								<p className='text-2xl font-bold text-orange-400'>8 ta</p>
							</div>
						</div>

						<div className='space-y-3 pt-4'>
							<p className='text-[10px] text-zinc-500 font-bold uppercase tracking-widest'>
								Server yuklamasi
							</p>
							<div className='h-2 w-full bg-white/10 rounded-full overflow-hidden'>
								<div className='h-full bg-blue-500 w-[65%]' />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
