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
import { Skeleton } from '@/components/ui/skeleton'
import api from '@/lib/api'
import { useTranslation } from '@/lib/i18n'
// 🔥 Markazlashgan utils
import { getErrorMessage, getInitials } from '@/lib/utils'
import { motion } from 'framer-motion'
import { BookOpen, Search, Star, UserCheck, Users } from 'lucide-react'
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
// 🚀 ASOSIY KOMPONENT
// ==========================================
export default function MentorsPage() {
	const { t } = useTranslation()
	const [mentors, setMentors] = useState([])
	const [loading, setLoading] = useState(true)

	// Filtrlar
	const [searchQuery, setSearchQuery] = useState('')
	const [categoryFilter, setCategoryFilter] = useState('all')

	// API dan o'qish
	useEffect(() => {
		const fetchMentors = async () => {
			try {
				setLoading(true)
				const res = await api.get('/public/mentors')
				if (res?.data?.success) {
					setMentors(res.data.mentors || [])
				}
			} catch (error) {
				toast.error(getErrorMessage(error, 'Mentorlarni yuklashda xatolik'))
			} finally {
				setLoading(false)
			}
		}
		fetchMentors()
	}, [])

	// Dynamic kategoriyalar
	const specialties = useMemo(() => {
		return Array.from(new Set(mentors.map(m => m.specialty).filter(Boolean)))
	}, [mentors])

	// Filtr logikasi
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

			const matchesCategory =
				categoryFilter === 'all' || mentor.specialty === categoryFilter

			return matchesSearch && matchesCategory
		})
	}, [mentors, searchQuery, categoryFilter])

	return (
		<div className='min-h-screen bg-muted/20 flex flex-col'>
			<Navbar />

			<main className='flex-1 container mx-auto px-4 py-8 md:py-12 max-w-7xl'>
				{/* 🏷️ HEADER & FILTERS */}
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}
					className='flex flex-col space-y-6 md:space-y-0 md:flex-row md:items-end md:justify-between mb-10 border-b pb-6'
				>
					<div className='max-w-xl'>
						<h1 className='text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-2'>
							{t('mentorsPage.title') || 'Mentorlar'}
						</h1>
						<p className='text-muted-foreground text-sm sm:text-base'>
							{t('mentorsPage.subtitle') ||
								"O'zingizga kerakli soha bo'yicha eng yaxshi mutaxassislarni toping."}
						</p>
					</div>

					<div className='flex flex-col sm:flex-row gap-3 w-full md:w-auto'>
						{/* Qidiruv */}
						<div className='relative w-full sm:w-[280px]'>
							<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
							<Input
								placeholder={
									t('mentorsPage.searchPlaceholder') ||
									"Ism yoki soha bo'yicha..."
								}
								className='pl-9 bg-background h-10'
								value={searchQuery}
								onChange={e => setSearchQuery(e.target.value)}
							/>
						</div>

						{/* Kategoriya */}
						<Select value={categoryFilter} onValueChange={setCategoryFilter}>
							<SelectTrigger className='w-full sm:w-[200px] h-10 bg-background font-medium'>
								<SelectValue
									placeholder={t('mentorsPage.selectCategory') || 'Kategoriya'}
								/>
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='all'>
									{t('mentorsPage.allCategories') || "Barcha yo'nalishlar"}
								</SelectItem>
								{specialties.map(spec => (
									<SelectItem key={spec} value={spec}>
										{spec}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</motion.div>

				{/* 🗂️ CONTENT AREA */}
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
								<Card className='flex flex-col h-[320px]'>
									<CardHeader className='pb-4 relative'>
										<div className='flex items-center gap-4'>
											<Skeleton className='h-12 w-12 rounded-full shrink-0' />
											<div className='space-y-2 w-full'>
												<Skeleton className='h-5 w-3/4' />
												<Skeleton className='h-3 w-1/2' />
											</div>
										</div>
									</CardHeader>
									<CardContent className='flex-1 pb-4 flex flex-col'>
										<Skeleton className='h-4 w-2/3 mb-4' />
										<div className='flex flex-wrap gap-2 mt-auto mb-4'>
											<Skeleton className='h-5 w-16 rounded-md' />
											<Skeleton className='h-5 w-20 rounded-md' />
										</div>
										<div className='flex items-center justify-between pt-4 border-t'>
											<Skeleton className='h-4 w-12' />
											<Skeleton className='h-4 w-16' />
										</div>
									</CardContent>
									<CardFooter className='pt-0'>
										<Skeleton className='h-9 w-full rounded-md' />
									</CardFooter>
								</Card>
							</motion.div>
						))}
					</motion.div>
				) : filteredMentors.length === 0 ? (
					// Empty State
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						className='flex flex-col items-center justify-center py-20 border border-dashed rounded-xl bg-card text-center px-4'
					>
						<UserCheck className='h-10 w-10 text-muted-foreground mb-4 opacity-30' />
						<h3 className='text-base font-semibold text-foreground mb-1'>
							{t('mentorsPage.noMentors') || 'Mentorlar topilmadi'}
						</h3>
						<p className='text-sm text-muted-foreground max-w-sm mb-6'>
							Qidiruvingizga mos keladigan natijalar yo'q. Qidiruv so'zini yoki
							kategoriyani o'zgartirib ko'ring.
						</p>
						<Button
							variant='outline'
							onClick={() => {
								setSearchQuery('')
								setCategoryFilter('all')
							}}
							className='font-medium'
						>
							{t('mentorsPage.clearFilters') || 'Filtrlarni tozalash'}
						</Button>
					</motion.div>
				) : (
					// Cards Grid
					<motion.div
						variants={containerVariants}
						initial='hidden'
						animate='show'
						className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
					>
						{filteredMentors.map(mentor => {
							const skills = mentor.skills || []
							const visibleSkills = skills.slice(0, 2)
							const remainingCount = skills.length - 2

							return (
								<motion.div
									key={mentor._id || mentor.id}
									variants={itemVariants}
									className='h-full'
								>
									<Link
										href={`/home/mentors/${mentor._id || mentor.id}`}
										className='group block h-full'
									>
										<Card className='flex flex-col h-full bg-card hover:border-primary/40 hover:shadow-md transition-all duration-300'>
											{/* Profil Qismi */}
											<CardHeader className='pb-4 border-b bg-muted/10'>
												<div className='flex items-center gap-3'>
													<Avatar className='h-12 w-12 border bg-background shrink-0 shadow-sm'>
														<AvatarImage
															src={mentor.avatarUrl || ''}
															alt={mentor.firstName}
															className='object-cover'
														/>
														<AvatarFallback className='text-xs font-bold text-muted-foreground uppercase'>
															{getInitials(mentor.firstName, mentor.lastName)}
														</AvatarFallback>
													</Avatar>
													<div className='min-w-0'>
														<CardTitle className='text-base font-semibold group-hover:text-primary transition-colors truncate'>
															{mentor.firstName} {mentor.lastName?.charAt(0)}.
														</CardTitle>
														<CardDescription className='text-[11px] font-medium truncate mt-0.5 capitalize'>
															{mentor.course || 'Mentor'}
														</CardDescription>
													</div>
												</div>
											</CardHeader>

											{/* Asosiy Ma'lumot */}
											<CardContent className='flex-1 pt-4 pb-4 flex flex-col'>
												<div className='mb-auto'>
													<p className='font-medium text-sm text-foreground mb-3 flex items-center gap-1.5 truncate'>
														<BookOpen className='h-3.5 w-3.5 text-muted-foreground' />
														{mentor.specialty ||
															t('common.notEntered') ||
															'Kiritilmagan'}
													</p>

													<div className='flex flex-wrap gap-1.5'>
														{visibleSkills.map((skill, idx) => (
															<Badge
																key={idx}
																variant='secondary'
																className='font-normal text-[10px] shadow-none'
															>
																{skill}
															</Badge>
														))}
														{remainingCount > 0 && (
															<Badge
																variant='outline'
																className='font-medium text-[10px] shadow-none bg-muted/50 border-transparent'
															>
																+{remainingCount}
															</Badge>
														)}
													</div>
												</div>

												{/* Statistika */}
												<div className='flex items-center justify-between gap-4 text-xs font-medium text-muted-foreground pt-5'>
													<div className='flex items-center gap-1'>
														<Star className='h-3.5 w-3.5 text-amber-500 fill-amber-500' />
														<span className='text-foreground font-bold'>
															{mentor.rating > 0 ? mentor.rating : 'N/A'}
														</span>
														<span className='opacity-70'>
															({mentor.ratingsCount || 0})
														</span>
													</div>
													<div className='flex items-center gap-1'>
														<Users className='h-3.5 w-3.5' />
														<span>{mentor.studentsCount || 0}</span>
													</div>
												</div>
											</CardContent>

											{/* Footer Tugma */}
											<CardFooter className='pt-0 pb-4 px-4'>
												<div className='w-full inline-flex h-9 items-center justify-center rounded-md bg-secondary text-secondary-foreground text-xs font-semibold transition-colors group-hover:bg-primary group-hover:text-primary-foreground shadow-sm'>
													{t('mentorsPage.viewDetail') || "Profilni ko'rish"}
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
