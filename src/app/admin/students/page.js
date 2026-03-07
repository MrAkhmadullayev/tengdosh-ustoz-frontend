'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
	AlertTriangle,
	CheckCircle2,
	Download,
	Edit,
	Eye,
	Loader2,
	MoreHorizontal,
	Search,
	ShieldBan,
	Trash2,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

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

const formatPhoneStr = str => {
	if (!str) return '-'
	let val = str.replace(/[^\d+]/g, '')
	if (!val.startsWith('+998')) val = '+998'
	const raw = val.slice(4).substring(0, 9)
	let formatted = '+998'
	if (raw.length > 0) formatted += ' ' + raw.substring(0, 2)
	if (raw.length > 2) formatted += ' ' + raw.substring(2, 5)
	if (raw.length > 5) formatted += ' ' + raw.substring(5, 9)
	return formatted
}

function AdminStudentsContent() {
	const router = useRouter()
	const [searchQuery, setSearchQuery] = useState('')
	const [students, setStudents] = useState([])
	const [loading, setLoading] = useState(true)

	// Modal states
	const [selectedStudent, setSelectedStudent] = useState(null)
	const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
	const [isProcessing, setIsProcessing] = useState(false)
	const [modalError, setModalError] = useState('')

	const fetchStudents = async () => {
		try {
			setLoading(true)
			const res = await api.get('/admin/students')
			if (res?.data?.success) {
				const mapped = res.data.students.map((st, index) => ({
					...st,
					index: index + 1,
				}))
				setStudents(mapped)
			}
		} catch (error) {
			console.error('Talabalarni yuklashda xatolik:', error)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchStudents()
	}, [])

	// --- STATUS O'ZGARTIRISH ---
	const handleStatusClick = student => {
		setSelectedStudent(student)
		setModalError('')
		setIsStatusModalOpen(true)
	}

	const confirmStatusUpdate = async () => {
		if (!selectedStudent) return
		setIsProcessing(true)
		setModalError('')
		const newStatus = selectedStudent.status === 'active' ? 'blocked' : 'active'

		try {
			const res = await api.put(
				`/admin/students/${selectedStudent.id}/status`,
				{
					status: newStatus,
				},
			)
			if (res?.data?.success) {
				setStudents(prev =>
					prev.map(st =>
						st.id === selectedStudent.id ? { ...st, status: newStatus } : st,
					),
				)
				setIsStatusModalOpen(false)
			}
		} catch (error) {
			console.error(error)
			setModalError(
				error.response?.data?.message ||
					'Statusni yangilashda xatolik yuz berdi',
			)
		} finally {
			setIsProcessing(false)
		}
	}

	// --- O'CHIRISH ---
	const handleDeleteClick = student => {
		setSelectedStudent(student)
		setModalError('')
		setIsDeleteModalOpen(true)
	}

	const confirmDelete = async () => {
		if (!selectedStudent) return
		setIsProcessing(true)
		setModalError('')

		try {
			const res = await api.delete(`/admin/students/${selectedStudent.id}`)
			if (res?.data?.success) {
				setStudents(prev => prev.filter(st => st.id !== selectedStudent.id))
				setIsDeleteModalOpen(false)
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

	// --- QIDIRUV VA FILTER ---
	const filteredStudents = students.filter(st => {
		const searchLower = searchQuery.toLowerCase()
		return (
			(st.firstName + ' ' + st.lastName).toLowerCase().includes(searchLower) ||
			(st.course || '').toLowerCase().includes(searchLower) ||
			(st.phoneNumber || '').includes(searchLower)
		)
	})

	const activeFilteredCount = filteredStudents.filter(
		st => st.status === 'active',
	).length

	// --- EXCEL EXPORT ---
	const handleExportExcel = () => {
		const headers = [
			'T/R',
			'Talaba Ism-Familiyasi',
			'Telefon raqam',
			'Kurs',
			'Guruh',
			'Status',
		]
		const csvContent = [
			headers.join(','),
			...filteredStudents.map(st =>
				[
					st.index,
					`"${st.firstName} ${st.lastName}"`,
					`"${formatPhoneStr(st.phoneNumber)}"`,
					`"${st.course || '-'}"`,
					`"${st.group || '-'}"`,
					st.status === 'active' ? 'Faol' : 'Bloklangan',
				].join(','),
			),
		].join('\n')

		const blob = new Blob(['\ufeff' + csvContent], {
			type: 'text/csv;charset=utf-8;',
		})
		const url = URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.href = url
		link.setAttribute('download', 'Talabalar_royxati.csv')
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
			{/* STATUS MODALI */}
			<Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
				<DialogContent className='sm:max-w-md'>
					<DialogHeader>
						<div className='flex items-center gap-3'>
							<div
								className={`p-3 rounded-full shrink-0 ${selectedStudent?.status === 'active' ? 'bg-orange-500/10' : 'bg-green-500/10'}`}
							>
								{selectedStudent?.status === 'active' ? (
									<ShieldBan className='h-6 w-6 text-orange-600' />
								) : (
									<CheckCircle2 className='h-6 w-6 text-green-600' />
								)}
							</div>
							<DialogTitle className='text-lg'>
								Statusni o'zgartirish
							</DialogTitle>
						</div>
						<DialogDescription className='mt-3 text-base text-left'>
							{selectedStudent?.status === 'active'
								? 'Rostan ham ushbu talabani tizimdan bloklamoqchimisiz? Bloklangan talaba tizimga kira olmaydi.'
								: "Ushbu talabani qayta faollashtirmoqchimisiz? U yana tizimdan foydalanishi mumkin bo'ladi."}
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
							onClick={() => setIsStatusModalOpen(false)}
							disabled={isProcessing}
							className='w-full sm:w-auto font-medium'
						>
							Bekor qilish
						</Button>
						<Button
							onClick={confirmStatusUpdate}
							disabled={isProcessing}
							className={`w-full sm:w-auto font-medium gap-2 shadow-sm ${selectedStudent?.status === 'active' ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}
						>
							{isProcessing ? (
								<Loader2 className='h-4 w-4 animate-spin' />
							) : selectedStudent?.status === 'active' ? (
								<ShieldBan className='h-4 w-4' />
							) : (
								<CheckCircle2 className='h-4 w-4' />
							)}
							Tasdiqlash
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* O'CHIRISH MODALI */}
			<Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
				<DialogContent className='sm:max-w-md border-destructive/20'>
					<DialogHeader>
						<div className='flex items-center gap-3'>
							<div className='bg-destructive/10 p-3 rounded-full shrink-0 flex items-center justify-center'>
								<AlertTriangle className='h-6 w-6 text-destructive' />
							</div>
							<DialogTitle className='text-destructive text-lg font-bold'>
								Talabani o'chirish
							</DialogTitle>
						</div>
						<DialogDescription className='mt-3 text-base text-left'>
							Diqqat! Ushbu talaba tizimdan butunlay o'chirib yuboriladi. Bu
							harakatni orqaga qaytarib bo'lmaydi. Davom etasizmi?
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
							onClick={() => setIsDeleteModalOpen(false)}
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
							O'chirishni tasdiqlash
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* HEADER VA QIDIRUV SECTION */}
			<motion.div
				variants={itemVariants}
				className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'
			>
				<div>
					<h1 className='text-2xl sm:text-3xl font-bold tracking-tight text-foreground'>
						Talabalar ro'yxati
					</h1>
					<p className='text-muted-foreground mt-1'>
						Tizimga a'zo bo'lgan barcha talabalar.
					</p>
				</div>
				<div className='flex w-full sm:w-auto gap-2'>
					<Button
						variant='outline'
						className='shrink-0 gap-2 hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-colors'
						onClick={handleExportExcel}
						disabled={loading || filteredStudents.length === 0}
					>
						<Download className='h-4 w-4' /> Export (Excel)
					</Button>
				</div>
			</motion.div>

			{/* FILTERLAR */}
			<motion.div
				variants={itemVariants}
				className='flex flex-col sm:flex-row sm:items-center justify-between bg-card p-4 rounded-xl border shadow-sm gap-4'
			>
				<div className='relative w-full max-w-sm'>
					<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
					<Input
						placeholder="Ism, raqam yoki kursi bo'yicha..."
						className='pl-9 bg-background'
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
					/>
				</div>
				<div className='flex items-center gap-2'>
					<Badge variant='secondary' className='px-3 py-1 text-sm font-medium'>
						Barchasi: {filteredStudents.length}
					</Badge>
					<Badge className='bg-green-500/10 text-green-600 hover:bg-green-500/20 border-none px-3 py-1 text-sm font-medium'>
						Faol: {activeFilteredCount}
					</Badge>
				</div>
			</motion.div>

			{/* JADVAL (TABLE) */}
			<motion.div
				variants={itemVariants}
				className='bg-card rounded-xl border shadow-sm overflow-hidden'
			>
				<div className='overflow-x-auto'>
					<Table>
						<TableHeader className='bg-muted/50'>
							<TableRow>
								<TableHead className='w-[80px]'>T/R</TableHead>
								<TableHead>Talaba</TableHead>
								<TableHead>Telefon raqam</TableHead>
								<TableHead>Yo'nalishi (Kurs/Guruh)</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className='text-right'>Harakatlar</TableHead>
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
													<Skeleton className='h-3 w-24' />
												</div>
											</div>
										</TableCell>
										<TableCell>
											<Skeleton className='h-4 w-28' />
										</TableCell>
										<TableCell>
											<Skeleton className='h-4 w-32' />
										</TableCell>
										<TableCell>
											<Skeleton className='h-5 w-20 rounded-full' />
										</TableCell>
										<TableCell className='text-right'>
											<Skeleton className='h-8 w-8 ml-auto rounded-md' />
										</TableCell>
									</TableRow>
								))
							) : filteredStudents.length > 0 ? (
								filteredStudents.map(st => (
									<MotionTableRow
										key={st.id}
										variants={itemVariants}
										className='hover:bg-muted/30 transition-colors cursor-pointer'
										onClick={() => router.push(`/admin/students/${st.id}/view`)}
									>
										<TableCell className='font-medium text-muted-foreground'>
											{st.index}
										</TableCell>

										<TableCell>
											<div className='flex items-center gap-3'>
												<Avatar className='h-9 w-9 border border-background shadow-sm'>
													<AvatarFallback className='bg-primary/10 text-primary font-bold text-xs uppercase'>
														{st.firstName?.[0]}
														{st.lastName?.[0]}
													</AvatarFallback>
												</Avatar>
												<div>
													<p className='font-semibold text-foreground leading-none mb-1 group-hover:text-primary transition-colors'>
														{st.firstName} {st.lastName}
													</p>
													<p className='text-[10px] text-muted-foreground'>
														ID: {st.id.substring(0, 8)}
													</p>
												</div>
											</div>
										</TableCell>

										<TableCell>
											<span className='font-medium whitespace-nowrap'>
												{formatPhoneStr(st.phoneNumber)}
											</span>
										</TableCell>

										<TableCell>
											<span className='text-sm font-medium text-muted-foreground'>
												{st.course ? `${st.course}` : "Noma'lum"}
												{st.group ? ` / ${st.group}` : ''}
											</span>
										</TableCell>

										<TableCell>
											{st.status === 'active' ? (
												<Badge className='bg-green-500/10 text-green-600 border-green-500/20 shadow-none font-medium flex w-fit items-center gap-1.5'>
													<CheckCircle2 className='h-3.5 w-3.5' /> Faol
												</Badge>
											) : (
												<Badge
													variant='secondary'
													className='text-red-500 bg-red-50 border-red-200 shadow-none font-medium flex w-fit items-center gap-1.5'
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
															router.push(`/admin/students/${st.id}/view`)
														}
													>
														<Eye className='h-4 w-4 mr-2 text-muted-foreground' />{' '}
														Ko'rish
													</DropdownMenuItem>

													<DropdownMenuItem
														className='cursor-pointer'
														onClick={() =>
															router.push(`/admin/students/${st.id}/edit`)
														}
													>
														<Edit className='h-4 w-4 mr-2 text-muted-foreground' />{' '}
														Tahrirlash
													</DropdownMenuItem>

													{st.status === 'active' ? (
														<DropdownMenuItem
															className='cursor-pointer text-orange-600 focus:text-orange-600'
															onClick={() => handleStatusClick(st)}
														>
															<ShieldBan className='h-4 w-4 mr-2' /> Bloklash
														</DropdownMenuItem>
													) : (
														<DropdownMenuItem
															className='cursor-pointer text-green-600 focus:text-green-600'
															onClick={() => handleStatusClick(st)}
														>
															<CheckCircle2 className='h-4 w-4 mr-2' />{' '}
															Faollashtirish
														</DropdownMenuItem>
													)}
													<DropdownMenuSeparator />
													<DropdownMenuItem
														className='cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50'
														onClick={() => handleDeleteClick(st)}
													>
														<Trash2 className='h-4 w-4 mr-2' /> O'chirib
														yuborish
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</MotionTableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={6}
										className='h-32 text-center text-muted-foreground'
									>
										Talabalar topilmadi. Qidiruvni o'zgartirib ko'ring.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>

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

export default function AdminStudentsPage() {
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
			<AdminStudentsContent />
		</Suspense>
	)
}
