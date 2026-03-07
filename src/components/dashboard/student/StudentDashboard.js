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
import { useEffect, useState } from 'react'

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
	<div className='max-w-6xl mx-auto space-y-6 pb-8 animate-in fade-in duration-500'>
		<div className='flex flex-col sm:flex-row justify-between gap-4'>
			<div className='space-y-2'>
				<Skeleton className='h-9 w-64' />
				<Skeleton className='h-4 w-80' />
			</div>
			<Skeleton className='h-10 w-[180px] rounded-md' />
		</div>

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

		<div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2'>
			<div className='lg:col-span-2'>
				<Skeleton className='h-[200px] w-full rounded-xl' />
			</div>
			<div className='lg:col-span-1'>
				<Skeleton className='h-[400px] w-full rounded-xl' />
			</div>
		</div>
	</div>
)

export default function StudentDashboard() {
	const router = useRouter()
	const [userData, setUserData] = useState(null)
	const [stats, setStats] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchDashboardData = async () => {
			try {
				const [meRes, statsRes] = await Promise.all([
					api.get('/auth/me'),
					api.get('/student/dashboard/stats'),
				])

				if (meRes.data.success) {
					setUserData(meRes.data.user)
				}
				if (statsRes.data.success) {
					setStats(statsRes.data.stats)
				}
			} catch (error) {
				console.error("Ma'lumotlarni yuklashda xato:", error)
			} finally {
				setLoading(false)
			}
		}

		fetchDashboardData()
	}, [])

	if (loading) return <DashboardSkeleton />

	return (
		<motion.div
			variants={containerVars}
			initial='hidden'
			animate='show'
			className='space-y-6 max-w-6xl mx-auto pb-8'
		>
			{/* --- GREETING SECTION --- */}
			<motion.div
				variants={itemVars}
				className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'
			>
				<div>
					<h1 className='text-2xl sm:text-3xl font-bold tracking-tight text-foreground'>
						Xush kelibsiz, {userData?.firstName || 'Talaba'}! 👋
					</h1>
					<p className='text-muted-foreground mt-1 text-sm sm:text-base'>
						Bugun nimani o'rganishni rejalashtiryapsiz? Yangi darslarni boshlang
						va bilimlaringizni oshiring.
					</p>
				</div>
				<Button
					onClick={() => router.push('/student/mentors')}
					className='shrink-0 gap-2 shadow-sm'
				>
					<Search className='h-4 w-4' /> Yangi ustoz topish
				</Button>
			</motion.div>

			{/* --- STATS OVERVIEW --- */}
			<motion.div
				variants={itemVars}
				className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
			>
				{/* O'rganilgan vaqt */}
				<Card className='border-muted shadow-sm hover:shadow-md transition-shadow group'>
					<CardContent className='p-6 flex items-center gap-4'>
						<div className='bg-blue-50 dark:bg-blue-500/10 p-3.5 rounded-2xl shrink-0 group-hover:scale-110 transition-transform'>
							<Clock className='h-6 w-6 text-blue-600 dark:text-blue-500' />
						</div>
						<div>
							<p className='text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5'>
								O'rganilgan vaqt
							</p>
							<h3 className='text-2xl font-black text-foreground'>
								{stats?.totalHours || 0}{' '}
								<span className='text-sm font-semibold text-muted-foreground'>
									soat
								</span>
							</h3>
						</div>
					</CardContent>
				</Card>

				{/* Faol darslar */}
				<Card className='border-muted shadow-sm hover:shadow-md transition-shadow group'>
					<CardContent className='p-6 flex items-center gap-4'>
						<div className='bg-emerald-50 dark:bg-emerald-500/10 p-3.5 rounded-2xl shrink-0 group-hover:scale-110 transition-transform'>
							<BookOpen className='h-6 w-6 text-emerald-600 dark:text-emerald-500' />
						</div>
						<div>
							<p className='text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5'>
								Faol darslar
							</p>
							<h3 className='text-2xl font-black text-foreground'>
								{stats?.activeLessonsCount || 0}{' '}
								<span className='text-sm font-semibold text-muted-foreground'>
									ta
								</span>
							</h3>
						</div>
					</CardContent>
				</Card>

				{/* Haftalik o'sish */}
				<Card className='border-muted shadow-sm hover:shadow-md transition-shadow group'>
					<CardContent className='p-6 flex items-center gap-4'>
						<div className='bg-purple-50 dark:bg-purple-500/10 p-3.5 rounded-2xl shrink-0 group-hover:scale-110 transition-transform'>
							<TrendingUp className='h-6 w-6 text-purple-600 dark:text-purple-500' />
						</div>
						<div>
							<p className='text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5'>
								Haftalik o'sish
							</p>
							<h3 className='text-2xl font-black text-foreground'>
								{stats?.weeklyGrowth || '+0%'}
							</h3>
						</div>
					</CardContent>
				</Card>

				{/* Top Reytingi */}
				<Card className='border-muted shadow-sm hover:shadow-md transition-all group overflow-hidden relative cursor-default'>
					<div className='absolute -right-6 -top-6 bg-amber-500/10 w-24 h-24 rounded-full blur-2xl group-hover:scale-150 transition-transform'></div>
					<CardContent className='p-6 flex items-center gap-4 relative z-10'>
						<div className='bg-amber-50 dark:bg-amber-500/10 p-3.5 rounded-2xl shrink-0 group-hover:scale-110 transition-transform'>
							<Award className='h-6 w-6 text-amber-600 dark:text-amber-500' />
						</div>
						<div>
							<p className='text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5'>
								Platformadagi O'rnim
							</p>
							<h3 className='text-2xl font-black text-foreground'>
								{stats?.rating || "Yo'q"}
							</h3>
						</div>
					</CardContent>
				</Card>
			</motion.div>

			{/* --- CONTENT GRID --- */}
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* CHAP TOMON: KUTILAYOTGAN DARSLAR (2/3 QISM) */}
				<motion.div variants={itemVars} className='lg:col-span-2 space-y-6'>
					{stats?.nextLesson ? (
						<Card className='border-primary/20 bg-primary/5 shadow-sm relative overflow-hidden'>
							{/* Blur background effect */}
							<div className='absolute right-0 top-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none'></div>

							<CardHeader className='pb-3 relative z-10'>
								<div className='flex justify-between items-center'>
									<CardTitle className='text-base flex items-center gap-2 font-bold'>
										<Calendar className='h-5 w-5 text-primary' /> Keyingi
										darsingiz
									</CardTitle>
									{stats.nextLesson.isLive && (
										<Badge className='bg-red-500 hover:bg-red-600 animate-pulse text-white border-none shadow-sm px-3'>
											Efirda
										</Badge>
									)}
								</div>
							</CardHeader>

							<CardContent className='relative z-10'>
								<div className='bg-background rounded-xl p-5 border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 group'>
									<div className='flex items-center gap-4'>
										<div className='bg-primary/10 p-4 rounded-2xl hidden sm:block border border-primary/20 group-hover:scale-105 transition-transform'>
											<Smartphone className='h-6 w-6 text-primary' />
										</div>
										<div>
											<h4 className='font-bold text-lg leading-tight mb-2'>
												{stats.nextLesson.title}
											</h4>
											<div className='flex items-center gap-2 text-sm font-medium text-muted-foreground'>
												<Avatar className='h-6 w-6 border'>
													<AvatarFallback className='text-[10px] bg-primary/10 text-primary font-bold'>
														{stats.nextLesson.mentorName
															?.charAt(0)
															?.toUpperCase() || 'M'}
													</AvatarFallback>
												</Avatar>
												<span>
													Ustoz:{' '}
													<span className='text-foreground'>
														{stats.nextLesson.mentorName}
													</span>
												</span>
												<span className='opacity-50'>•</span>
												<span className='capitalize'>
													{stats.nextLesson.mentorFormat}
												</span>
											</div>
											<Badge
												variant='secondary'
												className='mt-3 font-mono font-bold bg-primary/10 text-primary border-none'
											>
												Vaqti: {stats.nextLesson.time}
											</Badge>
										</div>
									</div>
									<Button
										size='lg'
										className='w-full sm:w-auto gap-2 shadow-sm font-semibold'
										onClick={() =>
											router.push(
												`/student/lessons/${stats.nextLesson.id}/watch`,
											)
										}
									>
										<PlayCircle className='h-5 w-5' /> Darsga qo'shilish
									</Button>
								</div>
							</CardContent>
						</Card>
					) : (
						<Card className='border-dashed bg-muted/10 shadow-sm'>
							<CardContent className='py-16 text-center text-muted-foreground flex flex-col items-center justify-center gap-3'>
								<div className='bg-muted p-4 rounded-full'>
									<Calendar className='h-8 w-8 opacity-40' />
								</div>
								<p className='font-medium text-foreground'>
									Hozircha rejalashtirilgan yangi darslar yo'q.
								</p>
								<p className='text-sm'>Yangi darslarni o'rganishni boshlang.</p>
								<Button
									variant='outline'
									onClick={() => router.push('/student/mentors')}
									className='mt-2'
								>
									Yangi dars izlash
								</Button>
							</CardContent>
						</Card>
					)}
				</motion.div>

				{/* O'NG TOMON: TAVSIYA ETILGAN USTOZLAR (1/3 QISM) */}
				<motion.div variants={itemVars} className='lg:col-span-1'>
					<Card className='shadow-sm h-full flex flex-col'>
						<CardHeader className='pb-4 border-b bg-muted/20'>
							<CardTitle className='text-base font-bold'>
								Siz uchun tavsiyalar
							</CardTitle>
							<CardDescription className='text-xs'>
								Qiziqishlaringizga mos mutaxassislar.
							</CardDescription>
						</CardHeader>
						<CardContent className='flex-1 p-0 overflow-y-auto custom-scrollbar'>
							<div className='divide-y divide-muted'>
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
												<Avatar className='h-10 w-10 border border-background shadow-sm shrink-0'>
													<AvatarFallback className='bg-primary/10 text-primary font-bold text-xs'>
														{mentor.avatar}
													</AvatarFallback>
												</Avatar>
												<div className='min-w-0'>
													<p className='font-bold text-sm leading-tight truncate group-hover:text-primary transition-colors'>
														{mentor.name}
													</p>
													<p className='text-[11px] font-medium text-muted-foreground truncate mt-0.5'>
														{mentor.skill}
													</p>
												</div>
											</div>
											<Badge
												variant='secondary'
												className='bg-amber-500/10 text-amber-600 dark:text-amber-400 border-none font-bold shrink-0 ml-2'
											>
												★ {mentor.rating}
											</Badge>
										</div>
									))
								) : (
									<div className='py-12 text-center text-muted-foreground text-sm'>
										Hozircha tavsiyalar mavjud emas.
									</div>
								)}
							</div>
						</CardContent>
						{stats?.recommendedMentors &&
							stats.recommendedMentors.length > 0 && (
								<CardFooter className='p-3 border-t mt-auto'>
									<Button
										variant='ghost'
										size='sm'
										onClick={() => router.push('/student/mentors')}
										className='w-full text-xs font-semibold'
									>
										Barcha ustozlarni ko'rish
									</Button>
								</CardFooter>
							)}
					</Card>
				</motion.div>
			</div>
		</motion.div>
	)
}
