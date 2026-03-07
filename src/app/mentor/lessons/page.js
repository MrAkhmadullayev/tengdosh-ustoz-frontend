'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { motion } from 'framer-motion'
import {
	AlertTriangle,
	Calendar,
	ClipboardList,
	Clock,
	Loader2,
	MapPin,
	MoreHorizontal,
	Pencil,
	Play,
	Plus,
	Radio,
	Search,
	Square,
	Trash2,
	Users,
	Video,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

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

const formatUzDate = dateStr => {
	if (!dateStr) return '-'
	try {
		const d = new Date(dateStr)
		if (isNaN(d.getTime())) return dateStr
		return `${d.getDate()}-${MONTHS[d.getMonth()]}, ${d.getFullYear()}`
	} catch {
		return dateStr
	}
}

export default function MentorLessonsPage() {
	const router = useRouter()
	const [lessons, setLessons] = useState([])
	const [loading, setLoading] = useState(true)
	const [searchQuery, setSearchQuery] = useState('')
	const [activeTab, setActiveTab] = useState('upcoming')

	// Modal states
	const [actionLesson, setActionLesson] = useState(null)
	const [isDeleteOpen, setIsDeleteOpen] = useState(false)
	const [isEndOpen, setIsEndOpen] = useState(false)
	const [isProcessing, setIsProcessing] = useState(false)
	const [modalError, setModalError] = useState('')

	useEffect(() => {
		const savedTab = localStorage.getItem('mentorLessonsTab')
		if (savedTab && ['live', 'upcoming', 'completed'].includes(savedTab)) {
			setActiveTab(savedTab)
		}
	}, [])

	const handleTabChange = value => {
		setActiveTab(value)
		localStorage.setItem('mentorLessonsTab', value)
	}

	const fetchLessons = async () => {
		try {
			setLoading(true)
			const res = await api.get('/mentor/lessons')
			if (res?.data?.success) {
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
	}, [])

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
			if (timeDiff < -10800000) return 'completed' // 3 soatdan oshib ketsa
			return 'upcoming'
		} catch {
			return lesson.status || 'upcoming'
		}
	}

	const filteredLessons = lessons.filter(l => {
		const searchLower = searchQuery.toLowerCase()
		return (l.title || '').toLowerCase().includes(searchLower)
	})

	// --- START LIVE LESSON ---
	const handleStartLive = async id => {
		try {
			const res = await api.patch(`/mentor/lessons/${id}/status`, {
				status: 'live',
			})
			if (res.data.success) {
				router.push(`/mentor/lessons/${id}/broadcast`)
			}
		} catch (error) {
			console.error(error)
			alert('Darsni boshlashda xatolik yuz berdi')
		}
	}

	// --- END LESSON LOGIC ---
	const handleEndClick = lesson => {
		setActionLesson(lesson)
		setModalError('')
		setIsEndOpen(true)
	}

	const confirmEndLesson = async () => {
		if (!actionLesson) return
		setIsProcessing(true)
		setModalError('')
		try {
			const res = await api.patch(
				`/mentor/lessons/${actionLesson._id}/status`,
				{ status: 'completed' },
			)
			if (res?.data?.success) {
				setIsEndOpen(false)
				fetchLessons()
			}
		} catch (error) {
			console.error(error)
			setModalError(
				error.response?.data?.message || 'Darsni yakunlashda xatolik yuz berdi',
			)
		} finally {
			setIsProcessing(false)
		}
	}

	// --- DELETE LOGIC ---
	const handleDeleteClick = lesson => {
		setActionLesson(lesson)
		setModalError('')
		setIsDeleteOpen(true)
	}

	const confirmDelete = async () => {
		if (!actionLesson) return
		setIsProcessing(true)
		setModalError('')
		try {
			const res = await api.delete(`/mentor/lessons/${actionLesson._id}`)
			if (res?.data?.success) {
				setIsDeleteOpen(false)
				fetchLessons()
			}
		} catch (error) {
			console.error(error)
			setModalError(
				error.response?.data?.message || "O'chirishda xatolik yuz berdi",
			)
		} finally {
			setIsProcessing(false)
		}
	}

	const getFormatBadge = format => {
		switch (format) {
			case 'online':
				return (
					<Badge
						variant='outline'
						className='flex w-fit items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 border-blue-200'
					>
						<Video className='h-3 w-3' /> Masofaviy
					</Badge>
				)
			case 'offline':
				return (
					<Badge
						variant='outline'
						className='flex w-fit items-center gap-1.5 text-xs font-medium text-orange-600 bg-orange-50 border-orange-200'
					>
						<MapPin className='h-3 w-3' /> Markazda
					</Badge>
				)
			case 'hybrid':
				return (
					<Badge
						variant='outline'
						className='flex w-fit items-center gap-1.5 text-xs font-medium text-purple-600 bg-purple-50 border-purple-200'
					>
						<Users className='h-3 w-3' /> Gibrid
					</Badge>
				)
			default:
				return null
		}
	}

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
								<TableHead className='w-[60px] whitespace-nowrap font-semibold'>
									T/R
								</TableHead>
								<TableHead className='font-semibold min-w-[200px]'>
									Dars Nomi
								</TableHead>
								<TableHead className='font-semibold whitespace-nowrap'>
									Sana va Vaqt
								</TableHead>
								<TableHead className='font-semibold whitespace-nowrap'>
									O'quvchilar
								</TableHead>
								<TableHead className='font-semibold whitespace-nowrap'>
									Format
								</TableHead>
								<TableHead className='text-right font-semibold whitespace-nowrap'>
									Sozlamalar
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{loading ? (
								Array.from({ length: 5 }).map((_, idx) => (
									<TableRow key={idx}>
										<TableCell>
											<Skeleton className='h-4 w-8' />
										</TableCell>
										<TableCell>
											<Skeleton className='h-5 w-48' />
										</TableCell>
										<TableCell>
											<div className='space-y-2'>
												<Skeleton className='h-4 w-24' />
												<Skeleton className='h-3 w-16' />
											</div>
										</TableCell>
										<TableCell>
											<Skeleton className='h-5 w-16' />
										</TableCell>
										<TableCell>
											<Skeleton className='h-6 w-24 rounded-full' />
										</TableCell>
										<TableCell className='text-right'>
											<Skeleton className='h-8 w-8 ml-auto rounded-md' />
										</TableCell>
									</TableRow>
								))
							) : tabLessons.length > 0 ? (
								tabLessons.map((lesson, index) => (
									<MotionTableRow
										key={lesson._id}
										variants={itemVariants}
										className='hover:bg-muted/30 transition-colors group'
									>
										<TableCell className='font-medium text-muted-foreground py-4'>
											{index + 1}
										</TableCell>
										<TableCell>
											<p className='font-bold text-foreground leading-tight capitalize line-clamp-2'>
												{lesson.title}
											</p>
										</TableCell>
										<TableCell>
											<div className='space-y-1.5'>
												<div className='flex items-center gap-1.5 text-sm font-medium'>
													<Calendar className='h-3.5 w-3.5 text-primary' />
													{formatUzDate(lesson.date)}
												</div>
												<div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
													<Clock className='h-3.5 w-3.5' />
													{lesson.time}
												</div>
											</div>
										</TableCell>
										<TableCell>
											<div className='flex items-center gap-1.5 font-medium text-sm'>
												<Users className='h-4 w-4 text-muted-foreground' />{' '}
												{lesson.registeredUsers?.length || 0} /{' '}
												{lesson.maxStudents || 0}
											</div>
										</TableCell>
										<TableCell>{getFormatBadge(lesson.format)}</TableCell>
										<TableCell
											className='text-right py-4'
											onClick={e => e.stopPropagation()}
										>
											<div className='flex items-center justify-end gap-2 text-sm font-medium'>
												{statusTab === 'upcoming' && (
													<Button
														size='sm'
														className='gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm'
														onClick={() => handleStartLive(lesson._id)}
													>
														<Play className='w-3.5 h-3.5 fill-current' />{' '}
														Boshlash
													</Button>
												)}
												{statusTab === 'live' && (
													<Button
														size='sm'
														className='gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm'
														onClick={() =>
															router.push(
																`/mentor/lessons/${lesson._id}/broadcast`,
															)
														}
													>
														<Video className='w-4 h-4' /> Darsga kirish
													</Button>
												)}

												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button
															variant='ghost'
															size='icon'
															className='h-8 w-8 text-muted-foreground hover:text-foreground'
														>
															<MoreHorizontal className='h-4 w-4' />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align='end' className='w-40'>
														{statusTab !== 'completed' && (
															<DropdownMenuItem
																className='cursor-pointer'
																onClick={() =>
																	router.push(
																		`/mentor/lessons/${lesson._id}/edit`,
																	)
																}
															>
																<Pencil className='h-4 w-4 mr-2' />
																Tahrirlash
															</DropdownMenuItem>
														)}

														{statusTab === 'live' && (
															<DropdownMenuItem
																onClick={() => handleEndClick(lesson)}
																className='cursor-pointer text-orange-600 focus:text-orange-600 focus:bg-orange-50'
															>
																<Square className='h-4 w-4 mr-2 fill-current' />
																Yakunlash
															</DropdownMenuItem>
														)}

														<DropdownMenuItem
															onClick={() => handleDeleteClick(lesson)}
															className='cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50'
														>
															<Trash2 className='h-4 w-4 mr-2' />
															O'chirish
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</div>
										</TableCell>
									</MotionTableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={6}
										className='h-32 text-center text-muted-foreground'
									>
										Bu bo'limda hech qanday dars topilmadi.
									</TableCell>
								</TableRow>
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
			className='w-full max-w-7xl mx-auto space-y-6 pb-12'
		>
			{/* END LESSON MODAL */}
			<Dialog open={isEndOpen} onOpenChange={setIsEndOpen}>
				<DialogContent className='sm:max-w-md border-orange-500/20'>
					<DialogHeader>
						<div className='flex items-center gap-3'>
							<div className='bg-orange-500/10 p-3 rounded-full shrink-0 flex items-center justify-center'>
								<Square className='h-6 w-6 text-orange-600 fill-current' />
							</div>
							<DialogTitle className='text-orange-600 text-lg font-bold'>
								Darsni yakunlash
							</DialogTitle>
						</div>
						<DialogDescription className='mt-3 text-base text-left'>
							Haqiqatdan ham{' '}
							<strong className='text-foreground'>
								"{actionLesson?.title}"
							</strong>{' '}
							darsini hozirdanoq yakunlashni tasdiqlaysizmi? Bu dars statusini
							"Yakunlangan" ga o'zgartiradi.
						</DialogDescription>
					</DialogHeader>
					{modalError && (
						<div className='bg-destructive/10 text-destructive text-sm font-medium px-4 py-3 rounded-lg mt-2'>
							{modalError}
						</div>
					)}
					<DialogFooter className='mt-4 flex flex-col sm:flex-row gap-2'>
						<Button
							variant='outline'
							onClick={() => setIsEndOpen(false)}
							disabled={isProcessing}
							className='w-full sm:w-auto font-medium'
						>
							Bekor qilish
						</Button>
						<Button
							onClick={confirmEndLesson}
							disabled={isProcessing}
							className='w-full sm:w-auto font-medium gap-2 bg-orange-600 hover:bg-orange-700 text-white shadow-sm'
						>
							{isProcessing ? (
								<Loader2 className='h-4 w-4 animate-spin' />
							) : (
								<Square className='h-4 w-4 fill-current' />
							)}
							Yakunlash
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* DELETE MODAL */}
			<Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
				<DialogContent className='sm:max-w-md border-destructive/20'>
					<DialogHeader>
						<div className='flex items-center gap-3'>
							<div className='bg-destructive/10 p-3 rounded-full shrink-0 flex items-center justify-center'>
								<AlertTriangle className='h-6 w-6 text-destructive' />
							</div>
							<DialogTitle className='text-destructive text-lg font-bold'>
								Darsni o'chirish
							</DialogTitle>
						</div>
						<DialogDescription className='mt-3 text-base text-left'>
							Haqiqatdan ham{' '}
							<strong className='text-foreground'>
								"{actionLesson?.title}"
							</strong>{' '}
							nomli darsni butunlay e'tibordan olib tashlamoqchimisiz? Bu amalni
							orqaga qaytarib bo'lmaydi va barcha yozilgan talabalar uziladi.
						</DialogDescription>
					</DialogHeader>
					{modalError && (
						<div className='bg-destructive/10 text-destructive text-sm font-medium px-4 py-3 rounded-lg mt-2'>
							{modalError}
						</div>
					)}
					<DialogFooter className='mt-4 flex flex-col sm:flex-row gap-2'>
						<Button
							variant='outline'
							onClick={() => setIsDeleteOpen(false)}
							disabled={isProcessing}
							className='w-full sm:w-auto font-medium'
						>
							Bekor qilish
						</Button>
						<Button
							variant='destructive'
							onClick={confirmDelete}
							disabled={isProcessing}
							className='w-full sm:w-auto font-medium gap-2 shadow-sm'
						>
							{isProcessing ? (
								<Loader2 className='h-4 w-4 animate-spin' />
							) : (
								<Trash2 className='h-4 w-4' />
							)}
							O'chirish
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

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
						Darslarni rejalashtiring, boshqaring va o'quvchilaringiz bilan
						ishlang.
					</p>
				</div>
				<div className='flex gap-3 w-full md:w-auto'>
					<Button
						onClick={() => router.push('/mentor/lessons/create')}
						className='gap-2 w-full md:w-auto rounded-xl px-4'
					>
						<Plus className='h-4 w-4' /> Yangi Dars Yaratish
					</Button>
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
						placeholder='Dars nomini qidirish...'
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

			{/* TABS */}
			<motion.div variants={itemVariants} className='w-full'>
				<Tabs
					value={activeTab}
					onValueChange={handleTabChange}
					className='w-full'
				>
					{/* Scrollable on small screens */}
					<div className='w-full overflow-x-auto pb-2 no-scrollbar'>
						<TabsList className='flex w-max min-w-full sm:w-full md:w-auto h-12 bg-muted/60 rounded-xl p-1'>
							<TabsTrigger
								value='live'
								className='flex-1 rounded-lg text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:text-red-600 data-[state=active]:shadow-sm font-medium px-3 gap-1.5'
							>
								<Radio className='w-4 h-4' /> Hozirgi (Live)
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
