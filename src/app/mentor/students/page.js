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
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import api from '@/lib/api'
import { motion } from 'framer-motion'
import {
	BookOpen,
	GraduationCap,
	Mail,
	Phone,
	Search,
	User,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

// Animatsiya variantlari
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

// Telefon raqamini formatlash
const formatPhone = phoneStr => {
	if (!phoneStr || phoneStr === 'Kiritilmagan') return phoneStr
	const cleaned = phoneStr.replace(/\D/g, '')
	if (cleaned.length === 12 && cleaned.startsWith('998')) {
		return `+998 ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 12)}`
	}
	return phoneStr
}

function MentorStudentsContent() {
	const router = useRouter()
	const [students, setStudents] = useState([])
	const [filteredStudents, setFilteredStudents] = useState([])
	const [loading, setLoading] = useState(true)
	const [searchQuery, setSearchQuery] = useState('')

	useEffect(() => {
		const fetchStudents = async () => {
			try {
				const res = await api.get('/mentor/students')
				if (res.data.success) {
					const mapped = res.data.students.map((s, idx) => ({
						...s,
						index: idx + 1,
						avatar:
							(s.firstName?.charAt(0) || '') + (s.lastName?.charAt(0) || ''),
						phoneNumber: s.phoneNumber || 'Kiritilmagan',
						course: s.course || 'Kurs kiritilmagan',
						group: s.group || 'Kiritilmagan',
					}))
					setStudents(mapped)
					setFilteredStudents(mapped)
				}
			} catch (error) {
				console.error('Talabalarni olishda xatolik:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchStudents()
	}, [])

	useEffect(() => {
		if (!searchQuery) {
			setFilteredStudents(students)
			return
		}

		const lowerQuery = searchQuery.toLowerCase()
		const filtered = students.filter(
			s =>
				s.firstName?.toLowerCase().includes(lowerQuery) ||
				s.lastName?.toLowerCase().includes(lowerQuery) ||
				s.phoneNumber?.toLowerCase().includes(lowerQuery) ||
				s.course?.toLowerCase().includes(lowerQuery),
		)
		setFilteredStudents(filtered)
	}, [searchQuery, students])

	const handleMessageClick = studentId => {
		sessionStorage.setItem('selectedContact', studentId) // 'targetMessageId' o'rniga kontakt uchun ishlatilgan key
		router.push('/users/messages')
	}

	return (
		<motion.div
			variants={containerVariants}
			initial='hidden'
			animate='show'
			className='space-y-6 max-w-7xl mx-auto pb-8'
		>
			{/* HEADER QISMI */}
			<motion.div
				variants={itemVariants}
				className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'
			>
				<div>
					<h1 className='text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2'>
						<GraduationCap className='h-7 w-7 text-primary' /> Mening
						O'quvchilarim
					</h1>
					<p className='text-muted-foreground mt-1'>
						Sizning darslaringizga yozilgan va qatnashgan barcha talabalar
						ro'yxati.
					</p>
				</div>
				<div className='bg-primary/10 text-primary px-4 py-1 rounded-xl font-bold flex items-center gap-2 border border-primary/20 shadow-sm'>
					<User className='h-4 w-4' />
					Jami: {students.length} ta
				</div>
			</motion.div>

			{/* QIDIRUV VA FILTR */}
			<motion.div
				variants={itemVariants}
				className='flex flex-col sm:flex-row sm:items-center justify-between bg-card p-4 rounded-xl border shadow-sm gap-4'
			>
				<div className='relative w-full max-w-md'>
					<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
					<Input
						placeholder="Ism, telefon yoki kurs bo'yicha qidiruv..."
						className='pl-9 bg-background focus-visible:ring-primary'
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
					/>
				</div>
				<div className='flex items-center gap-2'>
					<Badge variant='secondary' className='px-3 py-1 text-sm font-medium'>
						Natija: {filteredStudents.length} ta
					</Badge>
				</div>
			</motion.div>

			{/* JADVAL QISMI */}
			<motion.div
				variants={itemVariants}
				className='bg-card rounded-xl border shadow-sm overflow-hidden'
			>
				<div className='overflow-x-auto'>
					<Table>
						<TableHeader className='bg-muted/50'>
							<TableRow>
								<TableHead className='w-[80px] font-bold'>T/R</TableHead>
								<TableHead className='font-bold'>Talaba F.I.O</TableHead>
								<TableHead className='font-bold'>Aloqa</TableHead>
								<TableHead className='font-bold'>
									O'quv bosqichi / Guruh
								</TableHead>
								<TableHead className='font-bold text-center'>
									Qatnashishi
								</TableHead>
								<TableHead className='text-right font-bold'>
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
												<Skeleton className='h-9 w-9 rounded-full shrink-0' />
												<div className='space-y-2'>
													<Skeleton className='h-4 w-32' />
													<Skeleton className='h-3 w-20' />
												</div>
											</div>
										</TableCell>
										<TableCell>
											<Skeleton className='h-4 w-28' />
										</TableCell>
										<TableCell>
											<div className='flex items-center gap-2'>
												<Skeleton className='h-5 w-16 rounded-full' />
												<Skeleton className='h-5 w-12 rounded-full' />
											</div>
										</TableCell>
										<TableCell>
											<Skeleton className='h-6 w-20 mx-auto rounded-full' />
										</TableCell>
										<TableCell className='text-right'>
											<Skeleton className='h-8 w-24 ml-auto rounded-md' />
										</TableCell>
									</TableRow>
								))
							) : filteredStudents.length > 0 ? (
								filteredStudents.map(student => (
									<MotionTableRow
										key={student.id}
										variants={itemVariants}
										className='hover:bg-muted/30 transition-colors'
									>
										<TableCell className='font-medium text-muted-foreground'>
											{student.index}
										</TableCell>

										<TableCell>
											<div className='flex items-center gap-3'>
												<Avatar className='h-9 w-9 border border-background shadow-sm'>
													<AvatarFallback className='bg-primary/10 text-primary font-bold text-xs uppercase'>
														{student.avatar}
													</AvatarFallback>
												</Avatar>
												<div>
													<p className='font-semibold text-foreground leading-none mb-1'>
														{student.firstName} {student.lastName}
													</p>
													<p className='text-[10px] text-muted-foreground uppercase tracking-wider font-semibold md:hidden'>
														{student.course} • {student.group}
													</p>
												</div>
											</div>
										</TableCell>

										<TableCell>
											{student.phoneNumber !== 'Kiritilmagan' ? (
												<a
													href={`tel:${student.phoneNumber.replace(/\s+/g, '')}`}
													className='font-medium whitespace-nowrap text-primary hover:underline flex items-center gap-1.5 w-fit text-sm'
												>
													<Phone className='h-3.5 w-3.5' />
													{formatPhone(student.phoneNumber)}
												</a>
											) : (
												<span className='text-muted-foreground text-sm'>
													Kiritilmagan
												</span>
											)}
										</TableCell>

										<TableCell className='hidden md:table-cell'>
											<div className='flex flex-wrap items-center gap-1.5'>
												<Badge
													variant='outline'
													className='font-semibold bg-blue-50 text-blue-700 border-none'
												>
													{student.course}
												</Badge>
												<Badge
													variant='secondary'
													className='font-semibold bg-indigo-50 text-indigo-700 border-none'
												>
													{student.group}
												</Badge>
											</div>
										</TableCell>

										<TableCell className='text-center'>
											<TooltipProvider>
												<Tooltip>
													<TooltipTrigger asChild>
														<Badge
															variant='secondary'
															className='bg-green-500/10 text-green-600 hover:bg-green-500/20 border-none font-bold cursor-help px-3 py-1 gap-1.5'
														>
															<BookOpen className='h-3.5 w-3.5' />
															{student.lessonsAttended || 0} ta dars
														</Badge>
													</TooltipTrigger>
													<TooltipContent>
														Umumiy ro'yxatdan o'tgan yoki qatnashgan darslar
														soni
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
										</TableCell>

										<TableCell className='text-right'>
											<Button
												size='sm'
												variant='secondary'
												className='bg-primary/10 text-primary hover:bg-primary hover:text-black transition-colors rounded-lg gap-2 font-semibold'
												onClick={() => handleMessageClick(student.id)}
											>
												<Mail className='h-4 w-4' />
												<span className='hidden sm:inline'>Xabar yozish</span>
											</Button>
										</TableCell>
									</MotionTableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={6}
										className='h-32 text-center text-muted-foreground'
									>
										{searchQuery
											? 'Qidiruvingizga mos talaba topilmadi.'
											: 'Sizning darslaringizga hali hech kim yozilmagan.'}
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>

				{/* FOOTER */}
				<div className='p-4 border-t flex items-center justify-between text-sm text-muted-foreground bg-muted/20'>
					<p>
						Jami {filteredStudents.length} ta natijadan 1-
						{filteredStudents.length} tasi ko'rsatilmoqda.
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
			</motion.div>
		</motion.div>
	)
}

// Sahifa boshida Skeletonni Suspanse orqali o'rash (Layout va Page renderini toza saqlash uchun)
export default function MentorStudentsPage() {
	return (
		<Suspense
			fallback={
				<div className='space-y-6 max-w-7xl mx-auto pb-8 p-6'>
					<div className='flex justify-between'>
						<div className='space-y-2'>
							<Skeleton className='h-8 w-48' />
							<Skeleton className='h-4 w-64' />
						</div>
						<Skeleton className='h-10 w-32 rounded-xl' />
					</div>
					<Skeleton className='h-16 w-full rounded-xl' />
					<Skeleton className='h-[400px] w-full rounded-xl' />
				</div>
			}
		>
			<MentorStudentsContent />
		</Suspense>
	)
}
