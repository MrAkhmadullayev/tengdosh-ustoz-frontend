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
	Clock,
	Download,
	Eye,
	Loader2,
	MoreHorizontal,
	Search,
	XCircle,
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
		return `${d.getDate()}-${MONTHS[d.getMonth()]}, ${d.getFullYear()}-yil`
	} catch {
		return dateStr
	}
}

function AdminApplicationsContent() {
	const router = useRouter()
	const [searchQuery, setSearchQuery] = useState('')
	const [applications, setApplications] = useState([])
	const [loading, setLoading] = useState(true)

	// Modal states
	const [selectedAppId, setSelectedAppId] = useState(null)
	const [isApproveModalOpen, setIsApproveModalOpen] = useState(false)
	const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
	const [isProcessing, setIsProcessing] = useState(false)
	const [modalError, setModalError] = useState('')

	const fetchApplications = async () => {
		try {
			setLoading(true)
			const res = await api.get('/admin/applications/mentors')
			if (res?.data?.success) {
				const mappedApplications = res.data.applications.map((app, idx) => ({
					...app,
					index: idx + 1,
				}))
				setApplications(mappedApplications)
			}
		} catch (error) {
			console.error('Arizalarni yuklashda xatolik:', error)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchApplications()
	}, [])

	const handleApproveClick = id => {
		setSelectedAppId(id)
		setModalError('')
		setIsApproveModalOpen(true)
	}

	const handleRejectClick = id => {
		setSelectedAppId(id)
		setModalError('')
		setIsRejectModalOpen(true)
	}

	const confirmApprove = async () => {
		if (!selectedAppId) return
		setIsProcessing(true)
		setModalError('')

		try {
			const res = await api.put(
				`/admin/applications/mentors/${selectedAppId}/approve`,
			)
			if (res?.data?.success) {
				// Ekranni qayta yuklamasdan ro'yxatdan olib tashlash (tezkor ishlashi uchun)
				setApplications(prev => prev.filter(app => app.id !== selectedAppId))
				setIsApproveModalOpen(false)
			}
		} catch (error) {
			console.error(error)
			setModalError(
				error.response?.data?.message || 'Tasdiqlashda xatolik yuz berdi',
			)
		} finally {
			setIsProcessing(false)
		}
	}

	const confirmReject = async () => {
		if (!selectedAppId) return
		setIsProcessing(true)
		setModalError('')

		try {
			const res = await api.put(
				`/admin/applications/mentors/${selectedAppId}/reject`,
			)
			if (res?.data?.success) {
				// Ekranni qayta yuklamasdan ro'yxatdan olib tashlash
				setApplications(prev => prev.filter(app => app.id !== selectedAppId))
				setIsRejectModalOpen(false)
			}
		} catch (error) {
			console.error(error)
			setModalError(
				error.response?.data?.message || 'Rad etishda xatolik yuz berdi',
			)
		} finally {
			setIsProcessing(false)
		}
	}

	const filteredApps = applications.filter(app => {
		const searchLower = searchQuery.toLowerCase()
		return (
			(app.firstName + ' ' + app.lastName)
				.toLowerCase()
				.includes(searchLower) ||
			(app.specialty || '').toLowerCase().includes(searchLower) ||
			(app.id || '').toLowerCase().includes(searchLower)
		)
	})

	const handleExportExcel = () => {
		const headers = [
			'T/R',
			'Ism va Familiya',
			"Yo'nalish",
			'Kurs',
			'Ariza Sanasi',
			'Status',
		]
		const csvContent = [
			headers.join(','),
			...filteredApps.map((app, index) =>
				[
					index + 1,
					`"${app.firstName} ${app.lastName}"`,
					`"${app.specialty || '-'}"`,
					`"${app.course || '-'}"`,
					`"${formatUzDate(app.createdAt)}"`,
					'Kutilmoqda',
				].join(','),
			),
		].join('\n')

		const blob = new Blob(['\ufeff' + csvContent], {
			type: 'text/csv;charset=utf-8;',
		})
		const url = URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.href = url
		link.setAttribute('download', 'Mentorlik_arizalari.csv')
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
			{/* TASDIQLASH MODALI */}
			<Dialog open={isApproveModalOpen} onOpenChange={setIsApproveModalOpen}>
				<DialogContent className='sm:max-w-md'>
					<DialogHeader>
						<div className='flex items-center gap-3'>
							<div className='bg-green-500/10 p-3 rounded-full shrink-0'>
								<CheckCircle2 className='h-6 w-6 text-green-600' />
							</div>
							<DialogTitle className='text-lg'>Mentorni tasdiqlash</DialogTitle>
						</div>
						<DialogDescription className='mt-3 text-base text-left'>
							Siz ushbu foydalanuvchini mentor sifatida tasdiqlamoqchimisiz?
							Tasdiqlangandan so'ng, foydalanuvchi tizimdan mentor sifatida
							to'liq foydalanishi mumkin bo'ladi.
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
							onClick={() => setIsApproveModalOpen(false)}
							disabled={isProcessing}
							className='w-full sm:w-auto font-medium'
						>
							Bekor qilish
						</Button>
						<Button
							onClick={confirmApprove}
							disabled={isProcessing}
							className='w-full sm:w-auto gap-2 bg-green-600 hover:bg-green-700 text-white font-medium shadow-sm'
						>
							{isProcessing ? (
								<Loader2 className='h-4 w-4 animate-spin' />
							) : (
								<CheckCircle2 className='h-4 w-4' />
							)}
							Tasdiqlash
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* RAD ETISH MODALI */}
			<Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
				<DialogContent className='sm:max-w-md border-destructive/20'>
					<DialogHeader>
						<div className='flex items-center gap-3'>
							<div className='bg-destructive/10 p-3 rounded-full shrink-0 flex items-center justify-center'>
								<AlertTriangle className='h-6 w-6 text-destructive' />
							</div>
							<DialogTitle className='text-destructive text-lg font-bold'>
								Arizani rad etish
							</DialogTitle>
						</div>
						<DialogDescription className='mt-3 text-base text-left'>
							Foydalanuvchi arizasini rad etib, uni bloklamoqchimisiz? Bu
							harakatni orqaga qaytarish uchun faqat admin panel orqali qayta
							faollashtirish kerak bo'ladi.
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
							onClick={() => setIsRejectModalOpen(false)}
							disabled={isProcessing}
							className='w-full sm:w-auto font-medium'
						>
							Bekor qilish
						</Button>
						<Button
							variant='destructive'
							onClick={confirmReject}
							disabled={isProcessing}
							className='w-full sm:w-auto font-medium gap-2 shadow-sm'
						>
							{isProcessing ? (
								<Loader2 className='h-4 w-4 animate-spin' />
							) : (
								<XCircle className='h-4 w-4' />
							)}
							Rad etish
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<motion.div
				variants={itemVariants}
				className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'
			>
				<div>
					<h1 className='text-2xl sm:text-3xl font-bold tracking-tight text-foreground'>
						Mentorlikka Arizalar
					</h1>
					<p className='text-muted-foreground mt-1'>
						Rezyumeni to'ldirgan, lekin hali admin tomonidan tasdiqlanmagan
						shaxslar ro'yxati.
					</p>
				</div>
				<div className='flex w-full sm:w-auto gap-2'>
					<Button
						variant='outline'
						className='shrink-0 gap-2 hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-colors'
						onClick={handleExportExcel}
						disabled={loading || filteredApps.length === 0}
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
						placeholder="Ismi, ID yoki mutaxassisligi bo'yicha..."
						className='pl-9 bg-background'
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
					/>
				</div>
				<div className='flex items-center gap-2'>
					<Badge variant='secondary' className='px-3 py-1 text-sm font-medium'>
						Barchasi: {filteredApps.length}
					</Badge>
					<Badge className='bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 border-none px-3 py-1 text-sm font-medium'>
						Kutilmoqda: {filteredApps.length}
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
								<TableHead>Nomzod (Ism-Familiyasi)</TableHead>
								<TableHead>Yo'nalishi / Mutaxassisligi</TableHead>
								<TableHead>Ariza Sanasi</TableHead>
								<TableHead className='text-center'>Status</TableHead>
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
											<Skeleton className='h-4 w-24' />
										</TableCell>
										<TableCell>
											<Skeleton className='h-5 w-24 mx-auto rounded-full' />
										</TableCell>
										<TableCell className='text-right'>
											<Skeleton className='h-8 w-8 ml-auto rounded-md' />
										</TableCell>
									</TableRow>
								))
							) : filteredApps.length > 0 ? (
								filteredApps.map((app, index) => (
									<MotionTableRow
										key={app.id}
										variants={itemVariants}
										className='hover:bg-muted/30 transition-colors cursor-pointer'
										onClick={() =>
											router.push(`/admin/applications/${app.id}/view`)
										}
									>
										<TableCell className='font-medium text-muted-foreground'>
											{index + 1}
										</TableCell>

										<TableCell>
											<div className='flex items-center gap-3'>
												<Avatar className='h-9 w-9 border border-background shadow-sm'>
													<AvatarFallback className='bg-primary/10 text-primary font-bold text-xs'>
														{app.firstName?.[0]}
														{app.lastName?.[0]}
													</AvatarFallback>
												</Avatar>
												<div>
													<p className='font-semibold text-foreground leading-none mb-1 group-hover:text-primary transition-colors'>
														{app.firstName} {app.lastName}
													</p>
													<p className='text-xs text-muted-foreground'>
														{app.course || '-'}
													</p>
												</div>
											</div>
										</TableCell>

										<TableCell>
											<span className='text-sm font-medium'>
												{app.specialty || '-'}
											</span>
										</TableCell>

										<TableCell className='text-sm text-muted-foreground'>
											{formatUzDate(app.createdAt)}
										</TableCell>

										<TableCell className='text-center'>
											<Badge className='bg-orange-500/10 text-orange-600 border-orange-500/20 shadow-none font-medium flex mx-auto w-fit items-center gap-1.5'>
												<Clock className='h-3.5 w-3.5' /> Kutilmoqda
											</Badge>
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
													<DropdownMenuLabel>
														Arizani boshqarish
													</DropdownMenuLabel>
													<DropdownMenuSeparator />
													<DropdownMenuItem
														className='cursor-pointer'
														onClick={() =>
															router.push(`/admin/applications/${app.id}/view`)
														}
													>
														<Eye className='h-4 w-4 mr-2 text-primary' />{' '}
														Rezyumeni ko'rish
													</DropdownMenuItem>
													<DropdownMenuSeparator />
													<DropdownMenuItem
														className='cursor-pointer text-green-600 focus:text-green-600 focus:bg-green-50'
														onClick={() => handleApproveClick(app.id)}
													>
														<CheckCircle2 className='h-4 w-4 mr-2' /> Qabul
														qilish
													</DropdownMenuItem>
													<DropdownMenuItem
														className='cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50'
														onClick={() => handleRejectClick(app.id)}
													>
														<XCircle className='h-4 w-4 mr-2' /> Rad etish
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
										Arizalar topilmadi.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>

				<div className='p-4 border-t flex items-center justify-between text-sm text-muted-foreground bg-muted/20'>
					<p>
						Jami {filteredApps.length} ta natijadan 1-{filteredApps.length} tasi
						ko'rsatilmoqda.
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

export default function AdminApplicationsPage() {
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
			<AdminApplicationsContent />
		</Suspense>
	)
}
