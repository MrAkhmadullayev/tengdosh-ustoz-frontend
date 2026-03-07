'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import api from '@/lib/api'
import { format } from 'date-fns'
import { uz } from 'date-fns/locale'
import { motion } from 'framer-motion'
import {
	BookOpen,
	Calendar,
	ClipboardList,
	Clock,
	MapPin,
	Play,
	Radio,
	Search,
	Users,
	Video,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// --- ANIMATION VARIANTS ---
const containerVariants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: { staggerChildren: 0.1 },
	},
}

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	show: {
		opacity: 1,
		y: 0,
		transition: { type: 'spring', stiffness: 300, damping: 24 },
	},
}

const MotionTableRow = motion(TableRow)

export default function StudentLessonsPage() {
	const router = useRouter()
	const [lessons, setLessons] = useState([])
	const [loading, setLoading] = useState(true)
	const [searchQuery, setSearchQuery] = useState('')
	const [activeTab, setActiveTab] = useState('live')

	const fetchLessons = async () => {
		try {
			setLoading(true)
			const res = await api.get('/student/lessons')
			if (res.data.success) {
				setLessons(res.data.lessons)
			}
		} catch (error) {
			console.error('Darslarni yuklashda xatolik:', error)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchLessons()
		const savedTab = localStorage.getItem('studentLessonsTab')
		if (savedTab && ['live', 'upcoming', 'completed'].includes(savedTab)) {
			setActiveTab(savedTab)
		}
	}, [])

	const handleTabChange = value => {
		setActiveTab(value)
		localStorage.setItem('studentLessonsTab', value)
	}

	const getFormatBadge = lFormat => {
		switch (lFormat) {
			case 'online':
				return (
					<Badge
						variant='outline'
						className='flex w-fit items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20'
					>
						<Video className='h-3.5 w-3.5' /> Masofaviy
					</Badge>
				)
			case 'offline':
				return (
					<Badge
						variant='outline'
						className='flex w-fit items-center gap-1.5 text-xs font-medium text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20'
					>
						<MapPin className='h-3.5 w-3.5' /> Markazda
					</Badge>
				)
			case 'hybrid':
				return (
					<Badge
						variant='outline'
						className='flex w-fit items-center gap-1.5 text-xs font-medium text-purple-600 bg-purple-50 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20'
					>
						<Users className='h-3.5 w-3.5' /> Gibrid
					</Badge>
				)
			default:
				return null
		}
	}

	const checkStatus = lesson => {
		if (lesson.status === 'live') return 'live'
		if (lesson.status === 'completed') return 'completed'

		try {
			const lessonDate = new Date(
				`${lesson.date.split('T')[0]}T${lesson.time}:00`,
			)
			const now = new Date()
			const timeDiff = lessonDate.getTime() - now.getTime()

			if (timeDiff > 0) return 'upcoming'
			if (timeDiff < -10800000) return 'completed'
			return 'upcoming'
		} catch {
			return 'upcoming'
		}
	}

	const filteredLessons = lessons.filter(l => {
		const searchLower = searchQuery.toLowerCase()
		const mentorName =
			`${l.mentor?.firstName || ''} ${l.mentor?.lastName || ''}`.toLowerCase()
		return (
			(l.title || '').toLowerCase().includes(searchLower) ||
			mentorName.includes(searchLower)
		)
	})

	const renderTable = statusTab => {
		const tabLessons = filteredLessons.filter(l => checkStatus(l) === statusTab)

		return (
			<motion.div
				variants={itemVariants}
				initial='hidden'
				animate='show'
				className='bg-card rounded-xl border shadow-sm overflow-hidden mt-4'
			>
				<div className='overflow-x-auto'>
					<Table>
						<TableHeader className='bg-muted/50'>
							<TableRow className='hover:bg-transparent'>
								<TableHead className='w-[60px] whitespace-nowrap font-bold'>
									T/R
								</TableHead>
								<TableHead className='font-bold min-w-[250px]'>
									Dars Nomi
								</TableHead>
								<TableHead className='font-bold whitespace-nowrap'>
									Ustoz
								</TableHead>
								<TableHead className='font-bold whitespace-nowrap'>
									Sana va Vaqt
								</TableHead>
								<TableHead className='font-bold whitespace-nowrap'>
									Format
								</TableHead>
								<TableHead className='text-right font-bold whitespace-nowrap'>
									Amallar
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{loading ? (
								Array.from({ length: 4 }).map((_, idx) => (
									<TableRow key={idx}>
										<TableCell>
											<Skeleton className='h-4 w-6' />
										</TableCell>
										<TableCell>
											<Skeleton className='h-5 w-48' />
										</TableCell>
										<TableCell>
											<div className='flex items-center gap-2'>
												<Skeleton className='h-8 w-8 rounded-full' />
												<Skeleton className='h-4 w-24' />
											</div>
										</TableCell>
										<TableCell>
											<div className='space-y-2'>
												<Skeleton className='h-4 w-20' />
												<Skeleton className='h-3 w-12' />
											</div>
										</TableCell>
										<TableCell>
											<Skeleton className='h-6 w-24 rounded-full' />
										</TableCell>
										<TableCell className='text-right'>
											<Skeleton className='h-9 w-28 ml-auto rounded-lg' />
										</TableCell>
									</TableRow>
								))
							) : tabLessons.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={6}
										className='h-40 text-center text-muted-foreground'
									>
										<div className='flex flex-col items-center justify-center gap-2'>
											<BookOpen className='h-8 w-8 opacity-20' />
											<p>Bu bo'limda darslar topilmadi.</p>
										</div>
									</TableCell>
								</TableRow>
							) : (
								tabLessons.map((lesson, index) => {
									const initials = `${lesson.mentor?.firstName?.[0] || ''}${lesson.mentor?.lastName?.[0] || ''}`
									return (
										<MotionTableRow
											key={lesson._id}
											variants={itemVariants}
											className='hover:bg-muted/30 transition-colors group'
										>
											<TableCell className='font-medium text-muted-foreground py-4'>
												{index + 1}
											</TableCell>

											<TableCell className='py-4'>
												<p className='font-bold text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors'>
													{lesson.title}
												</p>
											</TableCell>

											<TableCell className='py-4'>
												<div className='flex items-center gap-3'>
													<Avatar className='h-8 w-8 border border-background shadow-sm'>
														<AvatarFallback className='bg-primary/10 text-primary text-[10px] font-bold'>
															{initials || 'U'}
														</AvatarFallback>
													</Avatar>
													<span className='font-semibold text-sm'>
														{lesson.mentor?.firstName} {lesson.mentor?.lastName}
													</span>
												</div>
											</TableCell>

											<TableCell className='py-4'>
												<div className='flex flex-col gap-1.5'>
													<div className='flex items-center gap-1.5 text-sm font-medium'>
														<Calendar className='h-3.5 w-3.5 text-primary' />
														{format(new Date(lesson.date), 'd MMM, yyyy', {
															locale: uz,
														})}
													</div>
													<div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
														<Clock className='h-3.5 w-3.5' />
														{lesson.time}
													</div>
												</div>
											</TableCell>

											<TableCell className='py-4'>
												{getFormatBadge(lesson.format)}
											</TableCell>

											<TableCell className='text-right py-4'>
												<div className='flex items-center justify-end gap-2 text-sm font-medium'>
													{statusTab === 'live' ? (
														<Button
															size='sm'
															className='gap-2 bg-red-600 hover:bg-red-700 text-white animate-pulse shadow-md rounded-lg'
															onClick={() =>
																router.push(
																	`/student/courses/${lesson._id}/watch`,
																)
															}
														>
															<Play className='w-4 h-4 fill-current' />{' '}
															Qo'shilish
														</Button>
													) : (
														<Badge
															variant='secondary'
															className='text-muted-foreground font-medium bg-muted px-3 py-1'
														>
															{statusTab === 'upcoming'
																? 'Kutilmoqda'
																: 'Yakunlangan'}
														</Badge>
													)}
												</div>
											</TableCell>
										</MotionTableRow>
									)
								})
							)}
						</TableBody>
					</Table>
				</div>
			</motion.div>
		)
	}

	return (
		<motion.div
			variants={containerVariants}
			initial='hidden'
			animate='show'
			className='max-w-7xl mx-auto space-y-6 w-full pb-12'
		>
			{/* HEADER VA QIDIRUV */}
			<motion.div
				variants={itemVariants}
				className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-2xl border shadow-sm'
			>
				<div>
					<h1 className='text-2xl sm:text-3xl font-bold tracking-tight text-foreground'>
						Mening Darslarim
					</h1>
					<p className='text-muted-foreground text-sm mt-1'>
						Jonli efirlarga qo'shiling va ustozlaringiz bilan birga o'rganing.
					</p>
				</div>
			</motion.div>

			{/* FILTERS */}
			<motion.div
				variants={itemVariants}
				className='flex flex-col sm:flex-row items-center justify-between gap-4'
			>
				<div className='relative w-full max-w-sm'>
					<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
					<Input
						placeholder='Dars nomi yoki ustoz ismini qidirish...'
						className='pl-9 bg-card border shadow-sm rounded-xl focus-visible:ring-primary'
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
					/>
				</div>
				<Badge
					variant='outline'
					className='px-3 py-1.5 w-full sm:w-auto justify-center items-center bg-card text-muted-foreground rounded-xl flex whitespace-nowrap border shadow-sm'
				>
					Jami {filteredLessons.length} ta dars
				</Badge>
			</motion.div>

			{/* TABS & TABLE */}
			<motion.div variants={itemVariants} className='w-full'>
				<Tabs
					value={activeTab}
					onValueChange={handleTabChange}
					className='w-full'
				>
					<div className='w-full overflow-x-auto pb-2 no-scrollbar'>
						<TabsList className='flex w-max min-w-full sm:w-full md:w-auto h-12 bg-muted/60 rounded-xl p-1'>
							<TabsTrigger
								value='live'
								className='flex-1 rounded-lg text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:text-red-600 data-[state=active]:shadow-sm font-medium px-3 gap-1.5'
							>
								<Radio className='w-4 h-4' /> Hozirgi (Live)
								<span className='flex h-2 w-2 relative ml-1'>
									<span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75'></span>
									<span className='relative inline-flex rounded-full h-2 w-2 bg-red-500'></span>
								</span>
							</TabsTrigger>
							<TabsTrigger
								value='upcoming'
								className='flex-1 rounded-lg text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm font-medium px-3 gap-1.5'
							>
								<Calendar className='w-4 h-4' /> Kelasi Darslar
							</TabsTrigger>
							<TabsTrigger
								value='completed'
								className='flex-1 rounded-lg text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm font-medium px-3 gap-1.5'
							>
								<ClipboardList className='w-4 h-4' /> O'tgan Darslar
							</TabsTrigger>
						</TabsList>
					</div>

					<TabsContent value='live' className='mt-0 focus-visible:outline-none'>
						{renderTable('live')}
					</TabsContent>

					<TabsContent
						value='upcoming'
						className='mt-0 focus-visible:outline-none'
					>
						{renderTable('upcoming')}
					</TabsContent>

					<TabsContent
						value='completed'
						className='mt-0 focus-visible:outline-none'
					>
						{renderTable('completed')}
					</TabsContent>
				</Tabs>
			</motion.div>
		</motion.div>
	)
}
