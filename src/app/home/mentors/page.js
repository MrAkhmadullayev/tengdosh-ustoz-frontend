'use client'

import Navbar from '@/components/landing/Navbar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
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
import { Skeleton } from '@/components/ui/skeleton'
import api from '@/lib/api'
import { motion } from 'framer-motion'
import { BookOpen, Search, Star, UserCheck, Users } from 'lucide-react'
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

export default function MentorsPage() {
	const [mentors, setMentors] = useState([])
	const [loading, setLoading] = useState(true)
	const [searchQuery, setSearchQuery] = useState('')
	const [categoryFilter, setCategoryFilter] = useState('all')

	useEffect(() => {
		const fetchMentors = async () => {
			try {
				const res = await api.get('/public/mentors')
				if (res?.data?.success) {
					setMentors(res.data.mentors)
				}
			} catch (error) {
				console.error(error)
			} finally {
				setLoading(false)
			}
		}
		fetchMentors()
	}, [])

	const specialties = useMemo(() => {
		return Array.from(new Set(mentors.map(m => m.specialty).filter(Boolean)))
	}, [mentors])

	const filteredMentors = useMemo(() => {
		return mentors.filter(mentor => {
			const searchLower = searchQuery.toLowerCase()
			const fullName =
				`${mentor.firstName || ''} ${mentor.lastName || ''}`.toLowerCase()
			const matchesSearch =
				fullName.includes(searchLower) ||
				(mentor.specialty || '').toLowerCase().includes(searchLower) ||
				(mentor.skills || []).some(skill =>
					skill.toLowerCase().includes(searchLower),
				)

			let matchesCategory = true
			if (categoryFilter !== 'all') {
				matchesCategory = mentor.specialty === categoryFilter
			}

			return matchesSearch && matchesCategory
		})
	}, [mentors, searchQuery, categoryFilter])

	const getInitials = (firstName, lastName) => {
		const first = firstName ? firstName[0] : ''
		const last = lastName ? lastName[0] : ''
		return (first + last).toUpperCase()
	}

	return (
		<div className='min-h-screen bg-background flex flex-col'>
			<Navbar />
			<main className='flex-1 container mx-auto px-4 py-8 md:py-12 max-w-7xl'>
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className='flex flex-col space-y-6 md:space-y-0 md:flex-row md:items-center md:justify-between mb-10'
				>
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
				</motion.div>

				{loading ? (
					<motion.div
						variants={containerVariants}
						initial='hidden'
						animate='show'
						className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
					>
						{Array.from({ length: 4 }).map((_, i) => (
							<motion.div key={i} variants={itemVariants}>
								<Card className='flex flex-col overflow-hidden h-[320px]'>
									<CardHeader className='pb-4 relative'>
										<div className='flex items-center gap-4'>
											<Skeleton className='h-14 w-14 rounded-full shrink-0' />
											<div className='space-y-2 w-full'>
												<Skeleton className='h-5 w-3/4' />
												<Skeleton className='h-4 w-1/2' />
											</div>
										</div>
									</CardHeader>
									<CardContent className='flex-1 pb-4 flex flex-col'>
										<Skeleton className='h-5 w-2/3 mb-4' />
										<div className='flex flex-wrap gap-1.5 mt-2 mb-4'>
											<Skeleton className='h-5 w-16 rounded-full' />
											<Skeleton className='h-5 w-20 rounded-full' />
										</div>
										<div className='flex items-center justify-between mt-auto pt-4 border-t'>
											<Skeleton className='h-4 w-16' />
											<Skeleton className='h-4 w-24' />
										</div>
									</CardContent>
									<CardFooter className='pt-0'>
										<Skeleton className='h-10 w-full rounded-md' />
									</CardFooter>
								</Card>
							</motion.div>
						))}
					</motion.div>
				) : filteredMentors.length === 0 ? (
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						className='flex flex-col items-center justify-center p-12 mt-8 border-2 border-dashed border-muted rounded-xl bg-muted/10'
					>
						<UserCheck className='h-12 w-12 text-muted-foreground mb-4 opacity-50' />
						<h3 className='text-xl font-semibold mb-2'>Mentorlar topilmadi</h3>
						<p className='text-muted-foreground text-center max-w-md mb-6'>
							{searchQuery && categoryFilter !== 'all'
								? `"${searchQuery}" so'rovi hamda "${categoryFilter}" yo'nalishi bo'yicha hech qanday mentor topilmadi.`
								: searchQuery
									? `Siz qidirgan "${searchQuery}" bo'yicha mentorlar topilmadi.`
									: categoryFilter !== 'all'
										? `"${categoryFilter}" yo'nalishi bo'yicha hozircha mentorlar mavjud emas.`
										: `Kechirasiz, hozircha mentorlar mavjud emas.`}
						</p>
						<button
							className='inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2'
							onClick={() => {
								setSearchQuery('')
								setCategoryFilter('all')
							}}
						>
							Filtrlarni tozalash
						</button>
					</motion.div>
				) : (
					<motion.div
						variants={containerVariants}
						initial='hidden'
						animate='show'
						className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
					>
						{filteredMentors.map(mentor => {
							const skills = mentor.skills || []
							const visibleSkills = skills.slice(0, 2)
							const remainingSkillsCount = skills.length - 2

							return (
								<motion.div
									key={mentor._id}
									variants={itemVariants}
									className='h-full'
								>
									<Link
										href={`/home/mentors/${mentor._id}`}
										className='group block h-full'
									>
										<Card className='flex flex-col h-full overflow-hidden hover:border-primary/50 hover:shadow-md transition-all duration-300'>
											<CardHeader className='pb-4 relative'>
												<div className='flex items-center gap-4'>
													<Avatar className='h-14 w-14 border-2 border-background shadow-sm'>
														<AvatarImage
															src={mentor.avatarUrl || ''}
															alt={`${mentor.firstName} ${mentor.lastName}`}
														/>
														<AvatarFallback className='bg-primary/10 text-primary font-bold'>
															{getInitials(mentor.firstName, mentor.lastName)}
														</AvatarFallback>
													</Avatar>
													<div>
														<CardTitle className='text-lg group-hover:text-primary transition-colors'>
															{mentor.firstName} {mentor.lastName?.charAt(0)}.
														</CardTitle>
														<CardDescription className='flex items-center gap-1 mt-1'>
															<UserCheck className='h-3.5 w-3.5' />
															{mentor.course || 'Mentor'}
														</CardDescription>
													</div>
												</div>
											</CardHeader>

											<CardContent className='flex-1 pb-4 flex flex-col'>
												<div className='mb-4'>
													<p className='font-medium text-foreground mb-2 flex items-center gap-1.5'>
														<BookOpen className='h-4 w-4 text-primary' />
														{mentor.specialty || 'Mentor'}
													</p>
													<div className='flex flex-wrap gap-1.5 mt-2'>
														{visibleSkills.map((skill, idx) => (
															<Badge
																key={idx}
																variant='secondary'
																className='font-normal text-xs bg-secondary/50'
															>
																{skill}
															</Badge>
														))}
														{remainingSkillsCount > 0 && (
															<Badge
																variant='secondary'
																className='font-medium text-xs bg-primary/10 text-primary'
															>
																+{remainingSkillsCount}
															</Badge>
														)}
													</div>
												</div>

												<div className='flex items-center justify-between gap-4 text-sm mt-auto pt-4 border-t'>
													<div className='flex items-center gap-1'>
														<Star className='h-4 w-4 text-yellow-500 fill-yellow-500' />
														<span className='font-bold'>
															{mentor.rating > 0 ? mentor.rating : '—'}
														</span>
														<span className='text-muted-foreground text-xs'>
															({mentor.ratingsCount || 0})
														</span>
													</div>
													<div className='flex items-center gap-1 text-muted-foreground'>
														<Users className='h-4 w-4' />
														<span>{mentor.studentsCount || 0} o'quvchi</span>
													</div>
												</div>
											</CardContent>

											<CardFooter className='pt-0'>
												<div className='w-full inline-flex h-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground text-sm font-medium transition-colors group-hover:bg-primary group-hover:text-primary-foreground'>
													Batafsil ko'rish
												</div>
											</CardFooter>
										</Card>
									</Link>
								</motion.div>
							)
						})}
					</motion.div>
				)}
			</main>
		</div>
	)
}
