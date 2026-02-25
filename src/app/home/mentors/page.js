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
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { BookOpen, Clock, Search, Star, UserCheck } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'

// Vaqtinchalik ma'lumotlar (Mock Data)
const MENTORS = [
	{
		id: 1,
		name: 'Sardor R.',
		course: '2-kurs',
		specialty: 'Full-Stack Dasturlash',
		skills: ['React', 'Node.js', 'PostgreSQL'],
		rating: 4.9,
		reviewsCount: 124,
		isOnline: true,
		avatar: 'SR',
	},
	{
		id: 2,
		name: 'Malika B.',
		course: '3-kurs',
		specialty: 'Mobil Dasturlash',
		skills: ['Kotlin', 'Android SDK', 'Java'],
		rating: 4.8,
		reviewsCount: 89,
		isOnline: false,
		avatar: 'MB',
	},
	{
		id: 3,
		name: 'Javohir T.',
		course: '4-kurs',
		specialty: "Algoritmlar va Ma'lumotlar",
		skills: ['C++', 'Python', 'LeetCode'],
		rating: 5.0,
		reviewsCount: 210,
		isOnline: true,
		avatar: 'JT',
	},
	{
		id: 4,
		name: 'Aziza K.',
		course: '2-kurs',
		specialty: 'IT Menejment va Tahlil',
		skills: ['BPM', 'UML', 'Agile'],
		rating: 4.7,
		reviewsCount: 56,
		isOnline: true,
		avatar: 'AK',
	},
	{
		id: 5,
		name: 'Bekzod O.',
		course: '3-kurs',
		specialty: 'Backend Dasturlash',
		skills: ['Go', 'Docker', 'Linux'],
		rating: 4.6,
		reviewsCount: 42,
		isOnline: false,
		avatar: 'BO',
	},
	{
		id: 6,
		name: 'Diyora S.',
		course: '1-kurs (Magistr)',
		specialty: 'UI/UX Dizayn',
		skills: ['Figma', 'Design Systems'],
		rating: 4.9,
		reviewsCount: 178,
		isOnline: true,
		avatar: 'DS',
	},
]

const specialties = Array.from(new Set(MENTORS.map(mentor => mentor.specialty)))

export default function MentorsPage() {
	const [searchQuery, setSearchQuery] = useState('')
	const [categoryFilter, setCategoryFilter] = useState('all')

	const filteredMentors = useMemo(() => {
		return MENTORS.filter(mentor => {
			const searchLower = searchQuery.toLowerCase()
			const matchesSearch =
				mentor.name.toLowerCase().includes(searchLower) ||
				mentor.specialty.toLowerCase().includes(searchLower) ||
				mentor.skills.some(skill => skill.toLowerCase().includes(searchLower))

			let matchesCategory = true
			if (categoryFilter !== 'all') {
				matchesCategory = mentor.specialty === categoryFilter
			}

			return matchesSearch && matchesCategory
		})
	}, [searchQuery, categoryFilter])

	return (
		<div className=''>
			<Navbar />
			<div className='container mx-auto px-4 py-8 md:py-12 max-w-7xl'>
				{/* HEADER VA QIDIRUV QISMI */}
				<div className='flex flex-col space-y-6 md:space-y-0 md:flex-row md:items-center md:justify-between mb-10'>
					<div>
						<h1 className='text-3xl md:text-4xl font-extrabold tracking-tight mb-2'>
							Mentorlar
						</h1>
						<p className='text-muted-foreground text-lg'>
							O'zingizga mos ustozni toping va bilmingizni oshiring.
						</p>
					</div>

					<div className='flex flex-col sm:flex-row gap-3 w-full md:w-auto'>
						<div className='relative w-full sm:w-[300px]'>
							<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
							<Input
								placeholder='Ism, fan yoki texnologiya...'
								className='pl-9 bg-background'
								value={searchQuery}
								onChange={e => setSearchQuery(e.target.value)}
							/>
						</div>
						<Select value={categoryFilter} onValueChange={setCategoryFilter}>
							<SelectTrigger className='w-full sm:w-[180px]'>
								<SelectValue placeholder="Yo'nalishni tanlang" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='all'>Barcha yo'nalishlar</SelectItem>
								{specialties.map(spec => (
									<SelectItem key={spec} value={spec}>
										{spec}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				{/* MENTORLAR RO'YXATI (GRID) */}
				{filteredMentors.length === 0 ? (
					<div className='flex flex-col items-center justify-center p-12 mt-8 border-2 border-dashed border-muted rounded-xl bg-muted/10'>
						<UserCheck className='h-12 w-12 text-muted-foreground mb-4 opacity-50' />
						<h3 className='text-xl font-semibold mb-2'>Mentorlar topilmadi</h3>
						<p className='text-muted-foreground text-center max-w-md'>
							{searchQuery && categoryFilter !== 'all'
								? `"${searchQuery}" so'rovi hamda "${categoryFilter}" yo'nalishi bo'yicha hech qanday mentor topilmadi.`
								: searchQuery
									? `Siz qidirgan "${searchQuery}" bo'yicha mentorlar topilmadi.`
									: categoryFilter !== 'all'
										? `"${categoryFilter}" yo'nalishi bo'yicha hozircha mentorlar mavjud emas.`
										: `Kechirasiz, mentorlar topilmadi.`}
						</p>
						<Button
							variant='outline'
							className='mt-6'
							onClick={() => {
								setSearchQuery('')
								setCategoryFilter('all')
							}}
						>
							Filtrlarni tozalash
						</Button>
					</div>
				) : (
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
						{filteredMentors.map(mentor => (
							<Card
								key={mentor.id}
								className='flex flex-col overflow-hidden hover:border-primary/50 transition-colors group'
							>
								<CardHeader className='pb-4 relative'>
									{/* Onlayn status indikatori */}
									{mentor.isOnline && (
										<div className='absolute top-4 right-4 flex items-center gap-1.5 bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-1 rounded-full text-xs font-medium border border-green-500/20'>
											<span className='relative flex h-2 w-2'>
												<span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75'></span>
												<span className='relative inline-flex rounded-full h-2 w-2 bg-green-500'></span>
											</span>
											Onlayn
										</div>
									)}

									<div className='flex items-center gap-4'>
										<Avatar className='h-14 w-14 border-2 border-background shadow-sm'>
											<AvatarImage src='' alt={mentor.name} />
											<AvatarFallback className='bg-primary/10 text-primary font-bold'>
												{mentor.avatar}
											</AvatarFallback>
										</Avatar>
										<div>
											<CardTitle className='text-lg'>{mentor.name}</CardTitle>
											<CardDescription className='flex items-center gap-1 mt-1'>
												<UserCheck className='h-3.5 w-3.5' />
												{mentor.course}
											</CardDescription>
										</div>
									</div>
								</CardHeader>

								<CardContent className='flex-1 pb-4'>
									<div className='mb-4'>
										<p className='font-medium text-foreground mb-2 flex items-center gap-1.5'>
											<BookOpen className='h-4 w-4 text-primary' />
											{mentor.specialty}
										</p>
										<div className='flex flex-wrap gap-1.5 mt-2'>
											{mentor.skills.map((skill, idx) => (
												<Badge
													key={idx}
													variant='secondary'
													className='font-normal text-xs'
												>
													{skill}
												</Badge>
											))}
										</div>
									</div>

									<div className='flex items-center gap-4 text-sm mt-auto pt-4 border-t'>
										<div className='flex items-center gap-1'>
											<Star className='h-4 w-4 text-yellow-500 fill-yellow-500' />
											<span className='font-bold'>{mentor.rating}</span>
											<span className='text-muted-foreground'>
												({mentor.reviewsCount})
											</span>
										</div>
										<div className='flex items-center gap-1 text-muted-foreground'>
											<Clock className='h-4 w-4' />
											<span>Moslashuvchan</span>
										</div>
									</div>
								</CardContent>

								<CardFooter className='pt-0'>
									<Link href={`/home/mentors/${mentor.id}`} className='w-full'>
										<Button className='w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all'>
											Batafsil ko'rish
										</Button>
									</Link>
								</CardFooter>
							</Card>
						))}
					</div>
				)}

				{/* KO'PROQ YUKLASH TUGMASI */}
				{filteredMentors.length > 8 && (
					<div className='mt-10 flex justify-center'>
						<Button variant='outline' size='lg' className='px-8'>
							Yana ko'rsatish
						</Button>
					</div>
				)}
			</div>
		</div>
	)
}
