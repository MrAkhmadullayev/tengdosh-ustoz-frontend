'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
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
import api from '@/lib/api'
import { motion } from 'framer-motion'
import {
	CheckCircle2,
	Download,
	Edit,
	Eye,
	MoreHorizontal,
	Phone,
	Search,
	ShieldBan,
	Star,
	Trash2,
	Users,
} from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import DeleteMentorModal from './actions/DeleteMentor'

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

// Framer motion bilan TableRow ishlashi uchun maxsus wrapper
const MotionTableRow = motion(TableRow)

// Telefon raqamini formatlash: +998XXXXXXXXX -> +998 XX XXX XXXX
const formatPhone = phoneStr => {
	if (!phoneStr || phoneStr === 'Kiritilmagan') return phoneStr
	const cleaned = phoneStr.replace(/\D/g, '')
	if (cleaned.length === 12 && cleaned.startsWith('998')) {
		return `+998 ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 12)}`
	}
	return phoneStr
}

function AdminMentorsContent() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const actionType = searchParams.get('action')

	const [searchQuery, setSearchQuery] = useState('')
	const [mentors, setMentors] = useState([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const fetchMentors = async () => {
			try {
				const res = await api.get('/admin/mentors')
				if (res?.data?.success) {
					const mapped = res.data.mentors.map((m, index) => ({
						id: m.id || m._id,
						index: index + 1,
						name: `${m.firstName} ${m.lastName}`,
						course: m.course || 'Kurs kiritilmagan',
						group: m.group || 'Kiritilmagan',
						phoneNumber: m.phoneNumber || 'Kiritilmagan',
						rating: m.rating || 0,
						ratingCount: m.ratingCount || 0,
						followersCount: m.followersCount || 0,
						status: m.status || 'active',
						joinedDate: new Date(m.createdAt).toLocaleDateString('uz-UZ'),
						avatar:
							(m.firstName?.charAt(0) || '') + (m.lastName?.charAt(0) || ''),
					}))
					setMentors(mapped)
				}
			} catch (err) {
				console.error('Failed to fetch mentors', err)
			} finally {
				setIsLoading(false)
			}
		}

		fetchMentors()
	}, [])

	const handleToggleStatus = async (id, currentStatus) => {
		try {
			const newStatus = currentStatus === 'active' ? 'blocked' : 'active'
			const res = await api.put(`/admin/mentors/${id}/status`, {
				status: newStatus,
			})
			if (res.data.success) {
				setMentors(prev =>
					prev.map(m => (m.id === id ? { ...m, status: newStatus } : m)),
				)
			}
		} catch (err) {
			console.error('Status yangilashda xatolik:', err)
			alert('Statusni yangilashda xatolik yuz berdi')
		}
	}

	const filteredMentors = mentors.filter(
		mentor =>
			mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			mentor.course.toLowerCase().includes(searchQuery.toLowerCase()),
	)

	const activeFilteredCount = filteredMentors.filter(
		m => m.status === 'active',
	).length

	const handleExportExcel = () => {
		const headers = [
			'T/R',
			'Ism va Familiya',
			"Yo'nalish",
			'Telefon raqami',
			'Guruh',
			'Reyting',
			'Talabalar',
			'Status',
			"Qo'shilgan sana",
		]
		const csvContent = [
			headers.join(','),
			...filteredMentors.map(m =>
				[
					m.index,
					`"${m.name}"`,
					`"${m.course}"`,
					`"${formatPhone(m.phoneNumber)}"`,
					`"${m.group}"`,
					m.rating > 0 ? m.rating : 'Yangi',
					m.followersCount,
					m.status === 'active' ? 'Faol' : 'Bloklangan',
					`"${m.joinedDate}"`,
				].join(','),
			),
		].join('\n')

		const blob = new Blob(['\ufeff' + csvContent], {
			type: 'text/csv;charset=utf-8;',
		})
		const url = URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.href = url
		link.setAttribute('download', 'Mentorlar_royxati.xlsx')
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
	}

	return (
		<motion.div
			variants={containerVariants}
			initial='hidden'
			animate='show'
			className='space-y-6 max-w-7xl mx-auto pb-8'
		>
			<motion.div
				variants={itemVariants}
				className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'
			>
				<div>
					<h1 className='text-2xl sm:text-3xl font-bold tracking-tight text-foreground'>
						Mentorlar ro'yxati
					</h1>
					<p className='text-muted-foreground mt-1'>
						Tizimda tasdiqlangan va faoliyat yuritayotgan barcha ustozlarni
						boshqarish.
					</p>
				</div>
				<div className='flex w-full sm:w-auto gap-2'>
					<Button
						variant='outline'
						className='shrink-0 gap-2 hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-colors'
						onClick={handleExportExcel}
						disabled={isLoading || filteredMentors.length === 0}
					>
						<Download className='h-4 w-4' /> Export (Excel)
					</Button>
				</div>
			</motion.div>

			<motion.div
				variants={itemVariants}
				className='flex flex-col sm:flex-row sm:items-center justify-between bg-card p-4 rounded-xl border shadow-sm gap-4'
			>
				<div className='relative w-full max-w-sm'>
					<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
					<Input
						placeholder="Ism, ID yoki yo'nalish bo'yicha qidiruv..."
						className='pl-9 bg-background'
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
					/>
				</div>
				<div className='flex items-center gap-2'>
					<Badge variant='secondary' className='px-3 py-1 text-sm font-medium'>
						Barchasi: {filteredMentors.length}
					</Badge>
					<Badge className='bg-green-500/10 text-green-600 hover:bg-green-500/20 border-none px-3 py-1 text-sm font-medium'>
						Faol: {activeFilteredCount}
					</Badge>
				</div>
			</motion.div>

			<motion.div
				variants={itemVariants}
				className='bg-card rounded-xl border shadow-sm overflow-hidden'
			>
				<div className='overflow-x-auto'>
					<Table>
						<TableHeader className='bg-muted/50'>
							<TableRow>
								<TableHead className='w-[80px]'>T/R</TableHead>
								<TableHead>Mentor</TableHead>
								<TableHead>Telefon raqami</TableHead>
								<TableHead>Guruh</TableHead>
								<TableHead className='text-center'>Reyting</TableHead>
								<TableHead className='text-center'>Talabalar</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className='text-right'>Harakatlar</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{isLoading ? (
								Array.from({ length: 4 }).map((_, idx) => (
									<TableRow key={idx}>
										<TableCell>
											<Skeleton className='h-4 w-6' />
										</TableCell>
										<TableCell>
											<div className='flex items-center gap-3'>
												<Skeleton className='h-9 w-9 rounded-full shrink-0' />
												<div className='space-y-2'>
													<Skeleton className='h-4 w-32' />
													<Skeleton className='h-3 w-24' />
												</div>
											</div>
										</TableCell>
										<TableCell>
											<Skeleton className='h-4 w-28' />
										</TableCell>
										<TableCell>
											<Skeleton className='h-4 w-16' />
										</TableCell>
										<TableCell>
											<Skeleton className='h-5 w-16 mx-auto rounded-full' />
										</TableCell>
										<TableCell>
											<Skeleton className='h-5 w-12 mx-auto rounded-full' />
										</TableCell>
										<TableCell>
											<Skeleton className='h-5 w-20 rounded-full' />
										</TableCell>
										<TableCell className='text-right'>
											<Skeleton className='h-8 w-8 ml-auto rounded-md' />
										</TableCell>
									</TableRow>
								))
							) : filteredMentors.length > 0 ? (
								filteredMentors.map(mentor => (
									<MotionTableRow
										key={mentor.id}
										variants={itemVariants}
										className='hover:bg-muted/30 transition-colors cursor-pointer'
										onClick={() =>
											router.push(`/admin/mentors/${mentor.id}/view`)
										}
									>
										<TableCell className='font-medium text-muted-foreground'>
											{mentor.index}
										</TableCell>

										<TableCell>
											<div className='flex items-center gap-3'>
												<Avatar className='h-9 w-9 border border-background shadow-sm'>
													<AvatarFallback className='bg-primary/10 text-primary font-bold text-xs'>
														{mentor.avatar}
													</AvatarFallback>
												</Avatar>
												<div>
													<p className='font-semibold text-foreground leading-none mb-1 group-hover:text-primary transition-colors'>
														{mentor.name}
													</p>
													<p className='text-xs text-muted-foreground'>
														{mentor.course}
													</p>
												</div>
											</div>
										</TableCell>

										<TableCell onClick={e => e.stopPropagation()}>
											{mentor.phoneNumber &&
											mentor.phoneNumber !== 'Kiritilmagan' ? (
												<a
													href={`tel:${mentor.phoneNumber.replace(/\s+/g, '')}`}
													className='font-medium whitespace-nowrap text-primary hover:underline flex items-center gap-1.5 w-fit'
												>
													<Phone className='h-3.5 w-3.5' />
													{formatPhone(mentor.phoneNumber)}
												</a>
											) : (
												<span className='text-muted-foreground text-sm'>
													Kiritilmagan
												</span>
											)}
										</TableCell>

										<TableCell>
											<span className='font-medium'>{mentor.group}</span>
										</TableCell>

										<TableCell className='text-center'>
											{mentor.rating > 0 ? (
												<Badge
													variant='secondary'
													className='bg-yellow-500/10 text-yellow-600 border-none font-bold'
												>
													<Star className='h-3 w-3 mr-1 fill-yellow-600' />
													{mentor.rating}
													<span className='text-[10px] font-normal ml-1 opacity-70'>
														({mentor.ratingCount})
													</span>
												</Badge>
											) : (
												<Badge
													variant='outline'
													className='text-muted-foreground font-medium'
												>
													Yangi
												</Badge>
											)}
										</TableCell>

										<TableCell className='text-center'>
											<div className='flex items-center justify-center gap-1.5'>
												<Users className='h-3.5 w-3.5 text-muted-foreground' />
												<span className='font-semibold'>
													{mentor.followersCount}
												</span>
											</div>
										</TableCell>

										<TableCell>
											{mentor.status === 'active' ? (
												<Badge className='bg-green-500/10 text-green-600 border-green-500/20 shadow-none font-medium flex w-fit items-center gap-1.5'>
													<CheckCircle2 className='h-3.5 w-3.5' /> Faol
												</Badge>
											) : (
												<Badge
													variant='secondary'
													className='text-red-500 bg-red-500/10 border-red-500/20 shadow-none font-medium flex w-fit items-center gap-1.5'
												>
													<ShieldBan className='h-3.5 w-3.5' /> Bloklangan
												</Badge>
											)}
										</TableCell>

										<TableCell
											className='text-right'
											onClick={e => e.stopPropagation()}
										>
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
												<DropdownMenuContent align='end' className='w-48'>
													<DropdownMenuLabel>Harakatlar</DropdownMenuLabel>
													<DropdownMenuSeparator />
													<DropdownMenuItem
														className='cursor-pointer'
														onClick={() =>
															router.push(`/admin/mentors/${mentor.id}/view`)
														}
													>
														<Eye className='h-4 w-4 mr-2 text-muted-foreground' />{' '}
														Ko'rish
													</DropdownMenuItem>
													<DropdownMenuItem
														className='cursor-pointer'
														onClick={() =>
															router.push(`/admin/mentors/${mentor.id}/edit`)
														}
													>
														<Edit className='h-4 w-4 mr-2 text-muted-foreground' />{' '}
														Tahrirlash
													</DropdownMenuItem>
													{mentor.status === 'active' ? (
														<DropdownMenuItem
															className='cursor-pointer text-orange-600 focus:text-orange-600'
															onClick={() =>
																handleToggleStatus(mentor.id, mentor.status)
															}
														>
															<ShieldBan className='h-4 w-4 mr-2' /> Bloklash
														</DropdownMenuItem>
													) : (
														<DropdownMenuItem
															className='cursor-pointer text-green-600 focus:text-green-600'
															onClick={() =>
																handleToggleStatus(mentor.id, mentor.status)
															}
														>
															<CheckCircle2 className='h-4 w-4 mr-2' /> Blokdan
															chiqarish
														</DropdownMenuItem>
													)}
													<DropdownMenuSeparator />
													<DropdownMenuItem
														className='cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50'
														onClick={() =>
															router.push(
																`/admin/mentors?action=delete&id=${mentor.id}`,
															)
														}
													>
														<Trash2 className='h-4 w-4 mr-2' /> Mentorlikdan
														chetlatish
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</MotionTableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={8}
										className='h-32 text-center text-muted-foreground'
									>
										Hech narsa topilmadi. Qidiruv so'zini o'zgartirib ko'ring.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>

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
			</motion.div>

			{actionType === 'delete' && <DeleteMentorModal />}
		</motion.div>
	)
}

export default function AdminMentorsPage() {
	return (
		<Suspense
			fallback={
				<div className='space-y-6 max-w-7xl mx-auto pb-8 p-6'>
					<div className='flex justify-between'>
						<div className='space-y-2'>
							<Skeleton className='h-8 w-48' />
							<Skeleton className='h-4 w-64' />
						</div>
						<Skeleton className='h-10 w-32' />
					</div>
					<Skeleton className='h-20 w-full rounded-xl' />
					<Skeleton className='h-96 w-full rounded-xl' />
				</div>
			}
		>
			<AdminMentorsContent />
		</Suspense>
	)
}
