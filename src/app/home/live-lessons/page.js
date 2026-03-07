'use client'

import Navbar from '@/components/landing/Navbar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import api from '@/lib/api'
import { motion } from 'framer-motion'
import {
	Calendar,
	ChevronDown,
	Clock,
	MonitorPlay,
	Search,
	Users,
	Video,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

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

const MONTHS = [
	'Yanvar',
	'Fevral',
	'Mart',
	'Aprel',
	'May',
	'Iyun',
	'Iyul',
	'Avgust',
	'Sentabr',
	'Oktabr',
	'Noyabr',
	'Dekabr',
]

const ClassCard = ({ cls }) => {
	const formattedDate = useMemo(() => {
		if (!cls.date) return ''
		try {
			const d = new Date(cls.date)
			if (isNaN(d.getTime())) return cls.date
			return `${d.getDate()}-${MONTHS[d.getMonth()]}`
		} catch {
			return cls.date
		}
	}, [cls.date])

	return (
		<motion.div variants={itemVariants} className='h-full'>
			<Link
				href={`/home/live-lessons/${cls._id}`}
				className='block h-full group'
			>
				<Card className='flex flex-col h-full hover:shadow-lg hover:border-primary/50 transition-all duration-300'>
					<CardHeader className='pb-3 relative'>
						<div className='flex justify-between items-start mb-2'>
							{cls.status === 'live' ? (
								<Badge
									variant='destructive'
									className='flex items-center gap-1'
								>
									<span className='h-1.5 w-1.5 rounded-full bg-white animate-pulse' />
									LIVE
								</Badge>
							) : (
								<Badge variant='secondary' className='flex items-center gap-1'>
									<Calendar className='h-3 w-3' />
									Kutilmoqda
								</Badge>
							)}

							{cls.viewers > 0 && (
								<div className='flex items-center text-xs text-muted-foreground gap-1'>
									<Users className='h-3.5 w-3.5' />
									{cls.viewers}
								</div>
							)}
						</div>

						<CardTitle className='line-clamp-2 text-lg leading-tight group-hover:text-primary transition-colors'>
							{cls.title}
						</CardTitle>
						<CardDescription className='flex items-center gap-2 mt-2'>
							<div className='flex items-center gap-2'>
								<Avatar className='h-6 w-6'>
									<AvatarImage src={cls.mentorAvatar || ''} />
									<AvatarFallback className='text-[10px] bg-primary/10 text-primary font-bold'>
										{cls.mentorInitials}
									</AvatarFallback>
								</Avatar>
								<span className='font-medium text-foreground'>
									{cls.mentorName}
								</span>
							</div>
						</CardDescription>
					</CardHeader>

					<CardContent className='flex-1 pb-4 pt-1'>
						<div className='flex flex-wrap gap-2 mt-1'>
							<Badge variant='outline' className='text-xs bg-secondary/30'>
								{cls.format || 'online'}
							</Badge>
							{cls.mentorSpecialty && (
								<Badge variant='outline' className='text-xs bg-secondary/30'>
									{cls.mentorSpecialty}
								</Badge>
							)}
						</div>
					</CardContent>

					<CardFooter className='p-5 pt-0 mt-auto flex-col gap-3'>
						<div className='w-full flex justify-between items-center z-10'>
							<div className='text-sm font-medium flex items-center gap-1.5 text-muted-foreground'>
								<Clock className='h-4 w-4' />
								{formattedDate && <span>{formattedDate}</span>}
								{formattedDate && cls.time && <span>, </span>}
								{cls.time && <span>{cls.time}</span>}
							</div>
						</div>

						<div className='w-full inline-flex h-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground text-sm font-medium transition-colors group-hover:bg-primary group-hover:text-primary-foreground'>
							Batafsil ko'rish
						</div>
					</CardFooter>
				</Card>
			</Link>
		</motion.div>
	)
}

export default function LiveClassesPage() {
	const [lessons, setLessons] = useState([])
	const [loading, setLoading] = useState(true)
	const [searchQuery, setSearchQuery] = useState('')
	const [activeCategory, setActiveCategory] = useState('Barchasi')
	const [activeTab, setActiveTab] = useState('live')

	useEffect(() => {
		const savedTab = localStorage.getItem('liveClassesTab')
		if (savedTab === 'live' || savedTab === 'upcoming') {
			setActiveTab(savedTab)
		}
	}, [])

	const handleTabChange = value => {
		setActiveTab(value)
		localStorage.setItem('liveClassesTab', value)
	}

	useEffect(() => {
		const fetchLessons = async () => {
			try {
				const res = await api.get('/public/lessons')
				if (res?.data?.success) {
					setLessons(res.data.lessons)
				}
			} catch (error) {
				console.error(error)
			} finally {
				setLoading(false)
			}
		}
		fetchLessons()
	}, [])

	const categories = useMemo(() => {
		const cats = new Set()
		lessons.forEach(l => {
			if (l.mentorSpecialty) cats.add(l.mentorSpecialty)
		})
		return ['Barchasi', ...Array.from(cats)]
	}, [lessons])

	const filteredClasses = useMemo(() => {
		return lessons.filter(cls => {
			const searchLower = searchQuery.toLowerCase()
			const matchesSearch =
				cls.title?.toLowerCase().includes(searchLower) ||
				cls.mentorName?.toLowerCase().includes(searchLower)
			const matchesCategory =
				activeCategory === 'Barchasi' || cls.mentorSpecialty === activeCategory
			return matchesSearch && matchesCategory
		})
	}, [lessons, searchQuery, activeCategory])

	const liveSessions = filteredClasses.filter(c => c.status === 'live')
	const upcomingSessions = filteredClasses.filter(c => c.status === 'upcoming')

	return (
		<div className='min-h-screen bg-background flex flex-col'>
			<Navbar />

			<main className='container mx-auto px-4 py-8 md:py-12 max-w-7xl flex-1'>
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className='mb-10 bg-primary/5 rounded-3xl p-6 md:p-10 border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative'
				>
					<div className='z-10 relative'>
						<div className='inline-flex items-center rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-sm font-semibold text-red-500 mb-4'>
							<span className='relative flex h-2 w-2 mr-2'>
								<span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75'></span>
								<span className='relative inline-flex rounded-full h-2 w-2 bg-red-500'></span>
							</span>
							Jonli efirda o'rganing
						</div>

						<h1 className='text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-foreground'>
							Bilimni to'g'ridan-to'g'ri <br className='hidden md:block' />
							<span className='text-primary'>tengdoshlardan oling</span>
						</h1>

						<p className='text-muted-foreground text-lg max-w-xl'>
							Universitetdagi eng kuchli talabalar hozir onlayn. Darslarga bepul
							qo'shiling va savollaringizga real vaqtda javob oling.
						</p>
					</div>

					<div className='hidden md:flex items-center justify-center h-40 w-40 bg-background rounded-full shadow-xl z-10 relative border border-primary/20'>
						<Video className='h-16 w-16 text-primary' />
						<div
							className='absolute -inset-4 border-2 border-primary/20 rounded-full animate-spin-slow'
							style={{ animationDuration: '10s' }}
						></div>
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.2, duration: 0.5 }}
					className='flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8'
				>
					<div>
						<h2 className='text-3xl font-bold tracking-tight mb-2'>
							Jonli Darslar
						</h2>
						<p className='text-muted-foreground'>
							Tengdoshlaringiz tomonidan o'tilayotgan real vaqtdagi darslarga
							qo'shiling.
						</p>
					</div>

					<div className='flex flex-col sm:flex-row gap-3 w-full md:w-auto'>
						<div className='relative w-full sm:w-[300px]'>
							<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
							<Input
								placeholder='Dars yoki ustozni qidiring...'
								className='pl-9 bg-background'
								value={searchQuery}
								onChange={e => setSearchQuery(e.target.value)}
							/>
						</div>

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant='outline'
									className='w-full sm:w-[180px] justify-between'
								>
									{activeCategory}
									<ChevronDown className='h-4 w-4 opacity-50' />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align='end' className='w-[180px]'>
								{categories.map(cat => (
									<DropdownMenuItem
										key={cat}
										onClick={() => setActiveCategory(cat)}
										className={
											activeCategory === cat ? 'bg-muted font-medium' : ''
										}
									>
										{cat}
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</motion.div>

				<Tabs
					value={activeTab}
					onValueChange={handleTabChange}
					className='w-full'
				>
					<TabsList className='grid w-full max-w-[400px] grid-cols-2 mb-8'>
						<TabsTrigger value='live' className='flex items-center gap-2'>
							<MonitorPlay className='h-4 w-4' />
							Hozir jonli
							{!loading && liveSessions.length > 0 && (
								<Badge
									variant='destructive'
									className='ml-1 h-5 px-1.5 text-[10px]'
								>
									{liveSessions.length}
								</Badge>
							)}
						</TabsTrigger>
						<TabsTrigger value='upcoming' className='flex items-center gap-2'>
							<Calendar className='h-4 w-4' />
							Kutilmoqda
							{!loading && upcomingSessions.length > 0 && (
								<Badge
									variant='secondary'
									className='ml-1 h-5 px-1.5 text-[10px]'
								>
									{upcomingSessions.length}
								</Badge>
							)}
						</TabsTrigger>
					</TabsList>

					{loading ? (
						<motion.div
							variants={containerVariants}
							initial='hidden'
							animate='show'
							className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
						>
							{Array.from({ length: 8 }).map((_, i) => (
								<motion.div key={i} variants={itemVariants}>
									<Card className='flex flex-col h-full min-h-[220px]'>
										<CardHeader className='pb-3 relative'>
											<div className='flex justify-between items-start mb-2'>
												<Skeleton className='h-5 w-20 rounded-full' />
											</div>
											<Skeleton className='h-6 w-3/4 mb-2' />
											<div className='flex items-center gap-2 mt-2'>
												<Skeleton className='h-6 w-6 rounded-full' />
												<Skeleton className='h-4 w-24' />
											</div>
										</CardHeader>
										<CardContent className='flex-1 pb-4 pt-1'>
											<div className='flex flex-wrap gap-2 mt-1'>
												<Skeleton className='h-5 w-16 rounded-full' />
												<Skeleton className='h-5 w-20 rounded-full' />
											</div>
										</CardContent>
										<CardFooter className='p-5 pt-0 mt-auto flex-col gap-3'>
											<div className='w-full flex justify-between items-center z-10'>
												<Skeleton className='h-4 w-32' />
											</div>
											<Skeleton className='h-10 w-full rounded-md' />
										</CardFooter>
									</Card>
								</motion.div>
							))}
						</motion.div>
					) : (
						<>
							<TabsContent value='live' className='mt-0'>
								{liveSessions.length > 0 ? (
									<motion.div
										variants={containerVariants}
										initial='hidden'
										animate='show'
										className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
									>
										{liveSessions.map(cls => (
											<ClassCard key={cls._id} cls={cls} />
										))}
									</motion.div>
								) : (
									<motion.div
										initial={{ opacity: 0, scale: 0.95 }}
										animate={{ opacity: 1, scale: 1 }}
										className='flex flex-col items-center justify-center py-24 text-center border rounded-lg bg-muted/50'
									>
										<Video className='h-12 w-12 text-muted-foreground mb-4' />
										<h3 className='text-lg font-semibold'>
											Ayni vaqtda jonli darslar yo'q
										</h3>
										<p className='text-sm text-muted-foreground mt-2 max-w-sm'>
											Kutilayotgan darslar bo'limidan yaqin orada boshlanadigan
											darslarni ko'rishingiz mumkin.
										</p>
									</motion.div>
								)}
							</TabsContent>

							<TabsContent value='upcoming' className='mt-0'>
								{upcomingSessions.length > 0 ? (
									<motion.div
										variants={containerVariants}
										initial='hidden'
										animate='show'
										className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
									>
										{upcomingSessions.map(cls => (
											<ClassCard key={cls._id} cls={cls} />
										))}
									</motion.div>
								) : (
									<motion.div
										initial={{ opacity: 0, scale: 0.95 }}
										animate={{ opacity: 1, scale: 1 }}
										className='flex flex-col items-center justify-center py-24 text-center border rounded-lg bg-muted/50'
									>
										<Calendar className='h-12 w-12 text-muted-foreground mb-4' />
										<h3 className='text-lg font-semibold'>
											Hech qanday dars belgilanmagan
										</h3>
										<p className='text-sm text-muted-foreground mt-2 max-w-sm'>
											Tez orada ustozlar tomonidan yangi darslar jadvali e'lon
											qilinadi.
										</p>
									</motion.div>
								)}
							</TabsContent>
						</>
					)}
				</Tabs>
			</main>
		</div>
	)
}
