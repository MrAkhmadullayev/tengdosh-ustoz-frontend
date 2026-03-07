'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import api from '@/lib/api'
import { motion } from 'framer-motion'
import { BookOpen, ChevronRight, Search, Star, Users } from 'lucide-react'
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

export default function StudentMentorsPage() {
	const router = useRouter()
	const [mentors, setMentors] = useState([])
	const [searchQuery, setSearchQuery] = useState('')
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchMentors = async () => {
			try {
				const res = await api.get('/student/mentors')
				if (res.data.success) {
					setMentors(res.data.mentors)
				}
			} catch (error) {
				console.error('Mentorlarni yuklashda xatolik:', error)
			} finally {
				setLoading(false)
			}
		}
		fetchMentors()
	}, [])

	const filteredMentors = mentors.filter(
		mentor =>
			(mentor.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
			(mentor.specialty || '')
				.toLowerCase()
				.includes(searchQuery.toLowerCase()),
	)

	return (
		<motion.div
			variants={containerVariants}
			initial='hidden'
			animate='show'
			className='max-w-7xl mx-auto space-y-6 pb-12'
		>
			{/* HEADER */}
			<motion.div
				variants={itemVariants}
				className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-2xl border shadow-sm'
			>
				<div>
					<h1 className='text-2xl sm:text-3xl font-bold tracking-tight text-foreground'>
						Mentorlar ro'yxati
					</h1>
					<p className='text-muted-foreground text-sm mt-1'>
						Sohangiz bo'yicha eng tajribali mutaxassislarni toping va bilim
						oling.
					</p>
				</div>
			</motion.div>

			{/* FILTERS & SEARCH */}
			<motion.div
				variants={itemVariants}
				className='flex flex-col sm:flex-row items-center justify-between gap-4'
			>
				<div className='relative w-full max-w-md'>
					<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
					<Input
						placeholder='Mentor ismi yoki mutaxassisligi...'
						className='pl-9 bg-card border shadow-sm rounded-xl focus-visible:ring-primary'
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
					/>
				</div>
				<Badge
					variant='outline'
					className='px-3 py-1.5 w-full sm:w-auto justify-center items-center bg-card text-muted-foreground rounded-xl flex whitespace-nowrap border shadow-sm font-medium'
				>
					Natija: {filteredMentors.length} ta mentor
				</Badge>
			</motion.div>

			{/* MENTORS TABLE */}
			<motion.div
				variants={itemVariants}
				className='bg-card rounded-xl border shadow-sm overflow-hidden'
			>
				<div className='overflow-x-auto'>
					<Table>
						<TableHeader className='bg-muted/50'>
							<TableRow className='hover:bg-transparent'>
								<TableHead className='w-[60px] font-bold'>T/R</TableHead>
								<TableHead className='font-bold min-w-[250px]'>
									Mentor
								</TableHead>
								<TableHead className='font-bold text-center whitespace-nowrap'>
									Reyting
								</TableHead>
								<TableHead className='font-bold text-center whitespace-nowrap'>
									O'quvchilar
								</TableHead>
								<TableHead className='font-bold text-center whitespace-nowrap'>
									Darslar
								</TableHead>
								<TableHead className='text-right font-bold whitespace-nowrap'>
									Harakatlar
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{loading ? (
								Array.from({ length: 5 }).map((_, idx) => (
									<TableRow key={idx}>
										<TableCell>
											<Skeleton className='h-4 w-6' />
										</TableCell>
										<TableCell>
											<div className='flex items-center gap-3'>
												<Skeleton className='h-10 w-10 rounded-full shrink-0' />
												<div className='space-y-2'>
													<Skeleton className='h-4 w-32' />
													<Skeleton className='h-3 w-24' />
												</div>
											</div>
										</TableCell>
										<TableCell>
											<Skeleton className='h-6 w-16 mx-auto rounded-full' />
										</TableCell>
										<TableCell>
											<Skeleton className='h-4 w-12 mx-auto' />
										</TableCell>
										<TableCell>
											<Skeleton className='h-4 w-12 mx-auto' />
										</TableCell>
										<TableCell className='text-right'>
											<Skeleton className='h-9 w-32 ml-auto rounded-lg' />
										</TableCell>
									</TableRow>
								))
							) : filteredMentors.length > 0 ? (
								filteredMentors.map((mentor, index) => (
									<MotionTableRow
										key={mentor.id}
										variants={itemVariants}
										className='hover:bg-muted/30 transition-colors cursor-pointer group'
										onClick={() => router.push(`/student/mentors/${mentor.id}`)}
									>
										<TableCell className='font-medium text-muted-foreground py-4'>
											{index + 1}
										</TableCell>

										<TableCell className='py-4'>
											<div className='flex items-center gap-3'>
												<Avatar className='h-10 w-10 border border-background shadow-sm'>
													<AvatarImage
														src={mentor.image}
														alt={mentor.name}
														className='object-cover'
													/>
													<AvatarFallback className='bg-primary/10 text-primary font-bold text-xs uppercase'>
														{mentor.name?.charAt(0) || 'M'}
													</AvatarFallback>
												</Avatar>
												<div>
													<p className='font-bold text-foreground leading-tight mb-1 group-hover:text-primary transition-colors'>
														{mentor.name}
													</p>
													<p className='text-xs text-muted-foreground font-medium truncate max-w-[200px]'>
														{mentor.specialty}
													</p>
												</div>
											</div>
										</TableCell>

										<TableCell className='py-4 text-center'>
											<Badge
												variant='secondary'
												className='bg-amber-500/10 text-amber-600 dark:text-amber-400 border-none font-bold gap-1'
											>
												<Star className='h-3.5 w-3.5 fill-current' />{' '}
												{mentor.rating || 'Yangi'}
											</Badge>
										</TableCell>

										<TableCell className='py-4 text-center'>
											<div className='flex items-center justify-center gap-1.5 font-semibold text-sm'>
												<Users className='h-4 w-4 text-muted-foreground' />
												{mentor.students || 0} ta
											</div>
										</TableCell>

										<TableCell className='py-4 text-center'>
											<div className='flex items-center justify-center gap-1.5 font-semibold text-sm'>
												<BookOpen className='h-4 w-4 text-muted-foreground' />
												{mentor.courses || 0} ta
											</div>
										</TableCell>

										<TableCell className='text-right py-4'>
											<Button
												size='sm'
												variant='secondary'
												className='bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors rounded-lg gap-1.5 font-semibold shadow-sm'
												onClick={e => {
													e.stopPropagation()
													router.push(`/student/mentors/${mentor.id}`)
												}}
											>
												Profilni ko'rish <ChevronRight className='w-4 h-4' />
											</Button>
										</TableCell>
									</MotionTableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={6}
										className='h-48 text-center text-muted-foreground'
									>
										<div className='flex flex-col items-center justify-center gap-3'>
											<div className='bg-muted p-4 rounded-full'>
												<Users className='h-8 w-8 opacity-40' />
											</div>
											<p className='font-medium text-foreground'>
												Mentorlar topilmadi
											</p>
											<p className='text-sm max-w-sm mx-auto'>
												Sizning qidiruvingizga mos keladigan mentorlar hozircha
												ro'yxatda yo'q.
											</p>
										</div>
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>

				{/* FOOTER */}
				{!loading && filteredMentors.length > 0 && (
					<div className='p-4 border-t flex items-center justify-between text-sm text-muted-foreground bg-muted/20'>
						<p>
							Jami {filteredMentors.length} ta natijadan 1-
							{filteredMentors.length} tasi ko'rsatilmoqda.
						</p>
						<div className='flex gap-2'>
							<Button variant='outline' size='sm' disabled>
								Oldingi
							</Button>
							<Button variant='outline' size='sm' disabled>
								Keyingi
							</Button>
						</div>
					</div>
				)}
			</motion.div>
		</motion.div>
	)
}
