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
// 🔥 Markazlashgan utilitalar
import { cn, formatUzDate, getErrorMessage, getInitials } from '@/lib/utils'
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
import { toast } from 'sonner'
// ==========================================
// 🎨 ANIMATSIYALAR
// ==========================================
const containerVariants = {
	hidden: { opacity: 0 },
	show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
	hidden: { opacity: 0, y: 15 },
	show: {
		opacity: 1,
		y: 0,
		transition: { type: 'spring', stiffness: 300, damping: 24 },
	},
}

// ==========================================
// 🧩 QISMIY KOMPONENT: CLASS CARD
// ==========================================
const ClassCard = ({ cls }) => {
	const formattedDate = useMemo(() => {
		if (!cls.date) return ''
		try {
			return formatUzDate(cls.date).split(',')[0]
		} catch {
			return cls.date
		}
	}, [cls.date])

	return (
		<motion.div variants={itemVariants} className='h-full'>
			<Link
				href={`/home/live-lessons/${cls._id || cls.id}`}
				className='block h-full group'
			>
				<Card className='flex flex-col h-full bg-card hover:border-primary/40 hover:shadow-md transition-all duration-300'>
					<CardHeader className='pb-3 relative border-b bg-muted/10'>
						<div className='flex justify-between items-start mb-3'>
							{cls.status === 'live' ? (
								<Badge
									variant='destructive'
									className='flex items-center gap-1.5 shadow-none animate-pulse'
								>
									<span className='h-1.5 w-1.5 rounded-full bg-white' />
									LIVE
								</Badge>
							) : (
								<Badge
									variant='secondary'
									className='flex items-center gap-1 font-medium shadow-none bg-background border'
								>
									<Calendar className='h-3 w-3 text-muted-foreground' />
									Kutilmoqda
								</Badge>
							)}

							{cls.viewers > 0 && (
								<div className='flex items-center text-xs font-semibold text-muted-foreground gap-1.5 bg-background border px-2 py-0.5 rounded-md shadow-sm'>
									<Users className='h-3.5 w-3.5' />
									{cls.viewers}
								</div>
							)}
						</div>

						<CardTitle className='line-clamp-2 text-base font-semibold leading-snug group-hover:text-primary transition-colors'>
							{cls.title}
						</CardTitle>

						<CardDescription className='flex items-center gap-2 mt-3'>
							<Avatar className='h-7 w-7 border shrink-0'>
								<AvatarImage src={cls.mentorAvatar || ''} />
								<AvatarFallback className='text-[10px] bg-muted text-foreground font-bold'>
									{getInitials(cls.mentorName, '')}
								</AvatarFallback>
							</Avatar>
							<span className='font-medium text-sm text-foreground truncate'>
								{cls.mentorName}
							</span>
						</CardDescription>
					</CardHeader>

					<CardContent className='flex-1 pb-4 pt-4 flex flex-col justify-end'>
						<div className='flex flex-wrap gap-2'>
							<Badge
								variant='secondary'
								className='text-[10px] font-normal uppercase tracking-wider shadow-none'
							>
								{cls.format || 'online'}
							</Badge>
							{cls.mentorSpecialty && (
								<Badge
									variant='outline'
									className='text-[10px] font-medium shadow-none bg-muted/50 border-transparent'
								>
									{cls.mentorSpecialty}
								</Badge>
							)}
						</div>
					</CardContent>

					<CardFooter className='p-4 pt-0 mt-auto flex-col gap-4'>
						<div className='w-full flex justify-between items-center text-xs font-medium text-muted-foreground'>
							<div className='flex items-center gap-1.5'>
								<Clock className='h-3.5 w-3.5' />
								<span>
									{formattedDate} {cls.time && `, ${cls.time}`}
								</span>
							</div>
						</div>

						<div className='w-full inline-flex h-9 items-center justify-center rounded-md bg-secondary text-secondary-foreground text-xs font-semibold transition-colors group-hover:bg-primary group-hover:text-primary-foreground shadow-sm'>
							Batafsil ko'rish
						</div>
					</CardFooter>
				</Card>
			</Link>
		</motion.div>
	)
}

// ==========================================
// 🚀 ASOSIY KOMPONENT
// ==========================================
export default function LiveClassesPage() {
	const [lessons, setLessons] = useState([])
	const [loading, setLoading] = useState(true)

	// Filters
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
				setLoading(true)
				const res = await api.get('/public/lessons')
				if (res?.data?.success) {
					setLessons(res.data.lessons || [])
				}
			} catch (error) {
				toast.error(getErrorMessage(error, 'Darslarni yuklashda xatolik'))
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
		<div className='min-h-screen bg-muted/10 flex flex-col'>
			<Navbar />

			<main className='container mx-auto px-4 py-8 md:py-12 max-w-7xl flex-1'>
				{/* 🏷️ Tanishuv (Hero) banner */}
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}
					className='mb-10 bg-card rounded-2xl p-6 sm:p-10 border shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative'
				>
					<div className='absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none' />
					<div className='z-10 relative'>
						<Badge
							variant='destructive'
							className='animate-pulse shadow-none border-transparent uppercase tracking-wider text-[10px] mb-4'
						>
							Jonli efirda o'rganing
						</Badge>
						<h1 className='text-3xl md:text-4xl font-extrabold tracking-tight mb-3 text-foreground text-balance'>
							Bilimni to'g'ridan-to'g'ri{' '}
							<span className='text-primary block sm:inline'>
								ustozlardan oling
							</span>
						</h1>
						<p className='text-muted-foreground text-base max-w-xl leading-relaxed'>
							O'z sohasining yetuk mutaxassislari hozir onlayn. Darslarga
							qo'shiling va savollaringizga real vaqtda javob oling.
						</p>
					</div>
					<div className='hidden md:flex items-center justify-center h-32 w-32 bg-primary/10 rounded-full shadow-inner z-10 relative border border-primary/20 shrink-0'>
						<Video className='h-12 w-12 text-primary' />
					</div>
				</motion.div>

				{/* 🔍 Filtrlar */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.1, duration: 0.4 }}
					className='flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b pb-6'
				>
					<div>
						<h2 className='text-2xl font-bold tracking-tight text-foreground mb-1'>
							Jonli Darslar
						</h2>
						<p className='text-sm text-muted-foreground'>
							Ustozlar tomonidan o'tilayotgan darslarga yoziling.
						</p>
					</div>

					<div className='flex flex-col sm:flex-row gap-3 w-full md:w-auto'>
						<div className='relative w-full sm:w-[280px]'>
							<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
							<Input
								placeholder='Dars yoki ustozni qidiring...'
								className='pl-9 bg-background h-10'
								value={searchQuery}
								onChange={e => setSearchQuery(e.target.value)}
							/>
						</div>

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant='outline'
									className='w-full sm:w-[180px] justify-between h-10 font-medium'
								>
									<span className='truncate'>{activeCategory}</span>
									<ChevronDown className='h-4 w-4 opacity-50 shrink-0' />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align='end' className='w-[200px]'>
								{categories.map(cat => (
									<DropdownMenuItem
										key={cat}
										onClick={() => setActiveCategory(cat)}
										className={cn(
											'cursor-pointer font-medium',
											activeCategory === cat && 'bg-muted text-primary',
										)}
									>
										{cat}
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</motion.div>

				{/* 🗂️ TABS & CONTENT */}
				<Tabs
					value={activeTab}
					onValueChange={handleTabChange}
					className='w-full'
				>
					<TabsList className='grid w-full max-w-[400px] grid-cols-2 mb-8 bg-muted/60 p-1'>
						<TabsTrigger
							value='live'
							className='flex items-center gap-2 text-sm font-medium'
						>
							<MonitorPlay className='h-4 w-4' /> Hozir jonli
							{!loading && liveSessions.length > 0 && (
								<Badge
									variant='destructive'
									className='ml-1 h-4 px-1 text-[9px] shadow-none'
								>
									{liveSessions.length}
								</Badge>
							)}
						</TabsTrigger>
						<TabsTrigger
							value='upcoming'
							className='flex items-center gap-2 text-sm font-medium'
						>
							<Calendar className='h-4 w-4' /> Kutilmoqda
							{!loading && upcomingSessions.length > 0 && (
								<Badge
									variant='secondary'
									className='ml-1 h-4 px-1 text-[9px] shadow-none'
								>
									{upcomingSessions.length}
								</Badge>
							)}
						</TabsTrigger>
					</TabsList>

					{loading ? (
						// Skeleton Loader
						<motion.div
							variants={containerVariants}
							initial='hidden'
							animate='show'
							className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
						>
							{Array.from({ length: 8 }).map((_, i) => (
								<motion.div key={i} variants={itemVariants}>
									<Card className='flex flex-col h-[280px]'>
										<CardHeader className='pb-3 relative'>
											<div className='flex justify-between items-start mb-3'>
												<Skeleton className='h-5 w-16 rounded-md' />
											</div>
											<Skeleton className='h-5 w-3/4 mb-2' />
											<div className='flex items-center gap-2 mt-3'>
												<Skeleton className='h-7 w-7 rounded-full' />
												<Skeleton className='h-4 w-24' />
											</div>
										</CardHeader>
										<CardContent className='flex-1 pb-4 pt-4'>
											<div className='flex flex-wrap gap-2'>
												<Skeleton className='h-5 w-16 rounded-md' />
												<Skeleton className='h-5 w-20 rounded-md' />
											</div>
										</CardContent>
										<CardFooter className='p-4 pt-0 mt-auto flex-col gap-4'>
											<div className='w-full flex justify-between items-center'>
												<Skeleton className='h-4 w-32' />
											</div>
											<Skeleton className='h-9 w-full rounded-md' />
										</CardFooter>
									</Card>
								</motion.div>
							))}
						</motion.div>
					) : (
						<>
							{/* LIVE TABS CONTENT */}
							<TabsContent
								value='live'
								className='mt-0 focus-visible:outline-none'
							>
								{liveSessions.length > 0 ? (
									<motion.div
										variants={containerVariants}
										initial='hidden'
										animate='show'
										className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
									>
										{liveSessions.map(cls => (
											<ClassCard key={cls._id || cls.id} cls={cls} />
										))}
									</motion.div>
								) : (
									<motion.div
										initial={{ opacity: 0, scale: 0.98 }}
										animate={{ opacity: 1, scale: 1 }}
										className='flex flex-col items-center justify-center py-20 text-center border border-dashed rounded-xl bg-card'
									>
										<Video className='h-10 w-10 text-muted-foreground mb-4 opacity-30' />
										<h3 className='text-base font-semibold mb-1'>
											Ayni vaqtda jonli darslar yo'q
										</h3>
										<p className='text-sm text-muted-foreground max-w-sm'>
											Kutilayotgan darslar bo'limidan yaqin orada boshlanadigan
											darslarni ko'rishingiz mumkin.
										</p>
									</motion.div>
								)}
							</TabsContent>

							{/* UPCOMING TABS CONTENT */}
							<TabsContent
								value='upcoming'
								className='mt-0 focus-visible:outline-none'
							>
								{upcomingSessions.length > 0 ? (
									<motion.div
										variants={containerVariants}
										initial='hidden'
										animate='show'
										className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
									>
										{upcomingSessions.map(cls => (
											<ClassCard key={cls._id || cls.id} cls={cls} />
										))}
									</motion.div>
								) : (
									<motion.div
										initial={{ opacity: 0, scale: 0.98 }}
										animate={{ opacity: 1, scale: 1 }}
										className='flex flex-col items-center justify-center py-20 text-center border border-dashed rounded-xl bg-card'
									>
										<Calendar className='h-10 w-10 text-muted-foreground mb-4 opacity-30' />
										<h3 className='text-base font-semibold mb-1'>
											Kutilayotgan darslar topilmadi
										</h3>
										<p className='text-sm text-muted-foreground max-w-sm'>
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
