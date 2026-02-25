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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import { useState } from 'react'
// Mock Data
const LIVE_CLASSES = [
	{
		id: 1,
		title: 'React Hooks: useEffect ni mukammal tushunish',
		mentor: 'Sardor R.',
		avatar: 'SR',
		category: 'Frontend',
		viewers: 124,
		status: 'live',
		time: 'Hozir',
		tags: ['React', 'JavaScript'],
	},
	{
		id: 2,
		title: "PostgreSQL arxitekturasi va ma'lumotlar bazasini loyihalash",
		mentor: 'Bekzod O.',
		avatar: 'BO',
		category: 'Backend',
		viewers: 85,
		status: 'live',
		time: 'Hozir',
		tags: ['PostgreSQL', 'Database'],
	},
	{
		id: 3,
		title: "Figma'da Design System qurish sirlari",
		mentor: 'Diyora S.',
		avatar: 'DS',
		category: 'Dizayn',
		viewers: 210,
		status: 'live',
		time: 'Hozir',
		tags: ['UI/UX', 'Figma'],
	},
	{
		id: 4,
		title: 'LeetCode: Array va String masalalarini ishlash',
		mentor: 'Javohir T.',
		avatar: 'JT',
		category: 'Algoritmlar',
		viewers: 0,
		status: 'upcoming',
		time: 'Bugun, 18:00',
		tags: ['C++', 'Algoritmlar'],
	},
	{
		id: 5,
		title: 'Android: Jetpack Compose asoslari',
		mentor: 'Malika B.',
		avatar: 'MB',
		category: 'Mobil',
		viewers: 0,
		status: 'upcoming',
		time: 'Ertaga, 15:00',
		tags: ['Kotlin', 'Android'],
	},
]

const CATEGORIES = [
	'Barchasi',
	'Frontend',
	'Backend',
	'Mobil',
	'Dizayn',
	'Algoritmlar',
]

// ClassCard komponenti to'g'rilandi
const ClassCard = ({ cls }) => {
	return (
		<Card className='flex flex-col h-full'>
			<CardHeader className='pb-3 relative'>
				<div className='flex justify-between items-start mb-2'>
					{cls.status === 'live' ? (
						<Badge variant='destructive' className='flex items-center gap-1'>
							<span className='h-1.5 w-1.5 rounded-full bg-white animate-pulse' />
							LIVE
						</Badge>
					) : (
						<Badge variant='secondary' className='flex items-center gap-1'>
							<Calendar className='h-3 w-3' />
							Kutilmoqda
						</Badge>
					)}

					{cls.status === 'live' && (
						<div className='flex items-center text-xs text-muted-foreground gap-1'>
							<Users className='h-3.5 w-3.5' />
							{cls.viewers}
						</div>
					)}
				</div>

				<CardTitle className='line-clamp-2 text-lg leading-tight'>
					{cls.title}
				</CardTitle>
				<CardDescription className='flex items-center gap-2 mt-2'>
					<Avatar className='h-6 w-6'>
						<AvatarImage src='' />
						<AvatarFallback className='text-[10px]'>
							{cls.avatar}
						</AvatarFallback>
					</Avatar>
					<span>{cls.mentor}</span>
				</CardDescription>
			</CardHeader>

			<CardContent className='flex-1 pb-4'>
				<div className='flex flex-wrap gap-2 mt-2'>
					{cls.tags.map((tag, idx) => (
						<Badge key={idx} variant='outline' className='text-xs'>
							{tag}
						</Badge>
					))}
				</div>
			</CardContent>

			<CardFooter className='p-5 pt-0 mt-auto flex-col gap-3'>
				<div className='w-full flex justify-between items-center z-10'>
					<div className='text-sm font-medium flex items-center gap-1.5 text-muted-foreground'>
						<Clock className='h-4 w-4' />
						{cls.time}
					</div>
				</div>

				{/* BATAFSIL TUGMASI HAMMA UCHUN BIR XIL */}
				<Link href={`/home/live-lessons/${cls.id}`} className='w-full'>
					<Button
						variant={cls.status === 'live' ? 'default' : 'default'}
						className={`w-full shadow-sm transition-all`}
					>
						Batafsil ko'rish
					</Button>
				</Link>
			</CardFooter>
		</Card>
	)
}

export default function LiveClassesPage() {
	const [searchQuery, setSearchQuery] = useState('')
	const [activeCategory, setActiveCategory] = useState('Barchasi')

	const filteredClasses = LIVE_CLASSES.filter(cls => {
		const matchesSearch =
			cls.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			cls.mentor.toLowerCase().includes(searchQuery.toLowerCase())
		const matchesCategory =
			activeCategory === 'Barchasi' || cls.category === activeCategory
		return matchesSearch && matchesCategory
	})

	const liveSessions = filteredClasses.filter(c => c.status === 'live')
	const upcomingSessions = filteredClasses.filter(c => c.status === 'upcoming')

	return (
		<div className='min-h-screen bg-background flex flex-col'>
			<Navbar />

			<main className='container mx-auto px-4 py-8 md:py-12 max-w-7xl flex-1'>
				{/* HEADER SECTION */}
				<div className='mb-10 bg-primary/5 rounded-3xl p-6 md:p-10 border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative'>
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

					{/* Dekorativ element */}

					<div className='hidden md:flex items-center justify-center h-40 w-40 bg-background rounded-full shadow-xl z-10 relative border border-primary/20'>
						<Video className='h-16 w-16 text-primary' />

						<div
							className='absolute -inset-4 border-2 border-primary/20 rounded-full animate-spin-slow'
							style={{ animationDuration: '10s' }}
						></div>
					</div>
				</div>
				<div className='flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8'>
					<div>
						<h1 className='text-3xl font-bold tracking-tight mb-2'>
							Jonli Darslar
						</h1>
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
								className='pl-9'
								value={searchQuery}
								onChange={e => setSearchQuery(e.target.value)}
							/>
						</div>

						{/* DROPDOWN MENU KATEGORIYALAR UCHUN */}
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
								{CATEGORIES.map(cat => (
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
				</div>

				{/* TABS (LIVE VA UPCOMING) */}
				<Tabs defaultValue='live' className='w-full'>
					<TabsList className='grid w-full max-w-[400px] grid-cols-2 mb-8'>
						<TabsTrigger value='live' className='flex items-center gap-2'>
							<MonitorPlay className='h-4 w-4' />
							Hozir jonli efirda
						</TabsTrigger>
						<TabsTrigger value='upcoming' className='flex items-center gap-2'>
							<Calendar className='h-4 w-4' />
							Kutilmoqda
						</TabsTrigger>
					</TabsList>

					{/* JONLI DARSLAR */}
					<TabsContent value='live' className='mt-0'>
						{liveSessions.length > 0 ? (
							<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
								{liveSessions.map(cls => (
									<ClassCard key={cls.id} cls={cls} />
								))}
							</div>
						) : (
							<div className='flex flex-col items-center justify-center py-24 text-center border rounded-lg bg-muted/50'>
								<Video className='h-12 w-12 text-muted-foreground mb-4' />
								<h3 className='text-lg font-semibold'>
									Ayni vaqtda jonli darslar yo'q
								</h3>
								<p className='text-sm text-muted-foreground mt-2 max-w-sm'>
									Kutilayotgan darslar bo'limidan yaqin orada boshlanadigan
									darslarni ko'rishingiz mumkin.
								</p>
							</div>
						)}
					</TabsContent>

					{/* KUTILAYOTGAN DARSLAR */}
					<TabsContent value='upcoming' className='mt-0'>
						{upcomingSessions.length > 0 ? (
							<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
								{upcomingSessions.map(cls => (
									<ClassCard key={cls.id} cls={cls} />
								))}
							</div>
						) : (
							<div className='flex flex-col items-center justify-center py-24 text-center border rounded-lg bg-muted/50'>
								<Calendar className='h-12 w-12 text-muted-foreground mb-4' />
								<h3 className='text-lg font-semibold'>
									Hech qanday dars belgilanmagan
								</h3>
								<p className='text-sm text-muted-foreground mt-2 max-w-sm'>
									Tez orada ustozlar tomonidan yangi darslar jadvali e'lon
									qilinadi.
								</p>
							</div>
						)}
					</TabsContent>
				</Tabs>
			</main>
		</div>
	)
}
