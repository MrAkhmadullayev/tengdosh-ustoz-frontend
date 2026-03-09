'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { DataTable } from '@/components/ui/data-table'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { PageHeader } from '@/components/ui/page-header'
import api from '@/lib/api'
import { useTranslation } from '@/lib/i18n'
// 🔥 utils'dan kerakli yordamchi funksiyalarni chaqiramiz
import { formatPhone, getErrorMessage, getInitials } from '@/lib/utils'
import { motion } from 'framer-motion'
import {
	CheckCircle2,
	Download,
	Edit,
	Eye,
	Loader2,
	MoreHorizontal,
	ShieldBan,
	Trash2,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

// ==========================================
// 🎨 ANIMATSIYA VARIANTLARI
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
// 🚀 ASOSIY KOMPONENT (Content)
// ==========================================
function AdminStudentsContent() {
	const router = useRouter()
	const { t } = useTranslation()

	const [students, setStudents] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const [isExporting, setIsExporting] = useState(false)

	// Modal holatlari (States)
	const [selectedStudent, setSelectedStudent] = useState(null)
	const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
	const [isProcessing, setIsProcessing] = useState(false)

	// 1. API dan ma'lumotlarni xavfsiz yuklash
	const fetchStudents = useCallback(async () => {
		try {
			setIsLoading(true)
			const res = await api.get('/admin/students')
			if (res?.data?.success) {
				const mapped = res.data.students.map((st, index) => ({
					...st,
					id: st._id || st.id, // Mongo ID larini xavfsizlashtirish
					index: index + 1,
					fullName: `${st.firstName || ''} ${st.lastName || ''}`.trim(),
				}))
				setStudents(mapped)
			}
		} catch (error) {
			toast.error(
				getErrorMessage(
					error,
					t('errors.fetchFailed') || "Ma'lumotlarni yuklashda xatolik",
				),
			)
		} finally {
			setIsLoading(false)
		}
	}, [t])

	useEffect(() => {
		fetchStudents()
	}, [fetchStudents])

	// 2. STATUS YANGILASH MANTIQI (Optimistik)
	const handleStatusClick = student => {
		setSelectedStudent(student)
		setIsStatusModalOpen(true)
	}

	const confirmStatusUpdate = async () => {
		if (!selectedStudent) return
		setIsProcessing(true)

		const newStatus = selectedStudent.status === 'active' ? 'blocked' : 'active'

		try {
			const res = await api.put(
				`/admin/students/${selectedStudent.id}/status`,
				{ status: newStatus },
			)
			if (res?.data?.success) {
				// UI ni darhol yangilash (Refreshsiz)
				setStudents(prev =>
					prev.map(st =>
						st.id === selectedStudent.id ? { ...st, status: newStatus } : st,
					),
				)
				toast.success(
					t('common.updateSuccess') || "Status muvaffaqiyatli o'zgartirildi",
				)
				setIsStatusModalOpen(false)
			}
		} catch (error) {
			toast.error(
				getErrorMessage(
					error,
					t('errors.updateFailed') || "Statusni o'zgartirishda xatolik",
				),
			)
		} finally {
			setIsProcessing(false)
		}
	}

	// 3. O'CHIRISH MANTIQI (Optimistik va Qayta raqamlash)
	const handleDeleteClick = student => {
		setSelectedStudent(student)
		setIsDeleteModalOpen(true)
	}

	const confirmDelete = async () => {
		if (!selectedStudent) return
		setIsProcessing(true)

		try {
			const res = await api.delete(`/admin/students/${selectedStudent.id}`)
			if (res?.data?.success) {
				// O'chirilgandan so'ng qolganlarini indexlarini to'g'irlaymiz
				setStudents(prev => {
					const filtered = prev.filter(st => st.id !== selectedStudent.id)
					return filtered.map((st, idx) => ({ ...st, index: idx + 1 }))
				})
				toast.success(
					t('dashboard.deleteStudentSuccess') || "Talaba tizimdan o'chirildi",
				)
				setIsDeleteModalOpen(false)
			}
		} catch (error) {
			toast.error(
				getErrorMessage(
					error,
					t('errors.deleteFailed') || "O'chirishda xatolik yuz berdi",
				),
			)
		} finally {
			setIsProcessing(false)
		}
	}

	const activeCount = useMemo(
		() => students.filter(st => st.status === 'active').length,
		[students],
	)
	const isTableEmpty = students.length === 0

	// 4. EXCEL GA YUKLASH (Xavfsiz UTF-8)
	const handleExportExcel = async () => {
		if (isTableEmpty) return toast.warning("Eksport qilish uchun ma'lumot yo'q")

		setIsExporting(true)
		try {
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
				...students.map(st =>
					[
						st.index,
						`"${st.fullName}"`,
						`"${formatPhone(st.phoneNumber)}"`,
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
			link.setAttribute(
				'download',
				`Talabalar_${new Date().toLocaleDateString('uz-UZ')}.csv`,
			)
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)

			toast.success(t('common.exportSuccess') || 'Muvaffaqiyatli yuklab olindi')
		} catch (error) {
			toast.error(
				t('errors.exportFailed') || 'Yuklab olishda xatolik yuz berdi',
			)
		} finally {
			setIsExporting(false)
		}
	}

	// 5. JADVAL USTUNLARI (Columns config)
	const columns = useMemo(
		() => [
			{
				header: 'T/R',
				key: 'index',
				headerClassName: 'w-[60px]',
				cellClassName: 'font-medium text-muted-foreground',
			},
			{
				header: t('sidebar.allStudents') || 'Talabalar',
				key: 'fullName',
				render: row => (
					<div className='flex items-center gap-3'>
						<Avatar className='h-9 w-9 border border-border shadow-sm'>
							<AvatarFallback className='bg-primary/10 text-primary font-bold text-xs uppercase'>
								{getInitials(row.firstName, row.lastName)}
							</AvatarFallback>
						</Avatar>
						<div>
							<p
								className='font-semibold text-foreground leading-none mb-1 group-hover:text-primary transition-colors cursor-pointer'
								onClick={e => {
									e.stopPropagation()
									router.push(`/admin/students/${row.id}/view`)
								}}
							>
								{row.fullName}
							</p>
							<p className='text-[10px] text-muted-foreground font-mono'>
								ID: {row.id?.substring(0, 8) || '-'}
							</p>
						</div>
					</div>
				),
			},
			{
				header: t('mentors.phone') || 'Telefon',
				key: 'phoneNumber',
				render: row =>
					row.phoneNumber ? (
						<a
							href={`tel:${row.phoneNumber.replace(/\D/g, '')}`}
							className='font-medium whitespace-nowrap text-primary hover:underline flex items-center gap-1.5 w-fit'
							onClick={e => e.stopPropagation()}
						>
							{formatPhone(row.phoneNumber)}
						</a>
					) : (
						<span className='text-muted-foreground text-sm'>
							{t('common.notEntered') || '-'}
						</span>
					),
			},
			{
				header: t('mentors.group') || 'Guruh / Kurs',
				key: 'group',
				render: row => (
					<span className='text-sm font-medium text-muted-foreground'>
						{row.course || t('common.notEntered') || '-'}
						{row.group ? ` / ${row.group}` : ''}
					</span>
				),
			},
			{
				header: t('common.status') || 'Status',
				key: 'status',
				render: row =>
					row.status === 'active' ? (
						<Badge className='bg-green-500/15 text-green-700 dark:text-green-400 border-none shadow-none font-medium flex w-fit items-center gap-1.5'>
							<CheckCircle2 className='h-3.5 w-3.5' />{' '}
							{t('common.active') || 'Faol'}
						</Badge>
					) : (
						<Badge
							variant='secondary'
							className='text-destructive bg-destructive/15 border-none shadow-none font-medium flex w-fit items-center gap-1.5'
						>
							<ShieldBan className='h-3.5 w-3.5' />{' '}
							{t('common.blocked') || 'Bloklangan'}
						</Badge>
					),
			},
			{
				header: t('common.actions') || 'Amallar',
				key: 'actions',
				headerClassName: 'text-right',
				cellClassName: 'text-right',
				render: row => (
					<DropdownMenu>
						<DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
							<Button
								variant='ghost'
								size='icon'
								className='h-8 w-8 text-muted-foreground hover:text-foreground'
							>
								<MoreHorizontal className='h-4 w-4' />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align='end'
							className='w-48'
							onClick={e => e.stopPropagation()}
						>
							<DropdownMenuLabel>
								{t('common.actions') || 'Amallar'}
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className='cursor-pointer'
								onClick={() => router.push(`/admin/students/${row.id}/view`)}
							>
								<Eye className='h-4 w-4 mr-2 text-muted-foreground' />{' '}
								{t('common.view') || "Ko'rish"}
							</DropdownMenuItem>
							<DropdownMenuItem
								className='cursor-pointer'
								onClick={() => router.push(`/admin/students/${row.id}/edit`)}
							>
								<Edit className='h-4 w-4 mr-2 text-muted-foreground' />{' '}
								{t('common.edit') || 'Tahrirlash'}
							</DropdownMenuItem>

							<DropdownMenuSeparator />

							{row.status === 'active' ? (
								<DropdownMenuItem
									className='cursor-pointer text-orange-600 focus:text-orange-600'
									onClick={() => handleStatusClick(row)}
								>
									<ShieldBan className='h-4 w-4 mr-2' />{' '}
									{t('mentors.block') || 'Bloklash'}
								</DropdownMenuItem>
							) : (
								<DropdownMenuItem
									className='cursor-pointer text-green-600 focus:text-green-600'
									onClick={() => handleStatusClick(row)}
								>
									<CheckCircle2 className='h-4 w-4 mr-2' />{' '}
									{t('mentors.unblock') || 'Blokdan chiqarish'}
								</DropdownMenuItem>
							)}

							<DropdownMenuSeparator />

							<DropdownMenuItem
								className='cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10'
								onClick={() => handleDeleteClick(row)}
							>
								<Trash2 className='h-4 w-4 mr-2' />{' '}
								{t('common.delete') || "O'chirish"}
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				),
			},
		],
		[t, router],
	)

	return (
		<motion.div
			variants={containerVariants}
			initial='hidden'
			animate='show'
			className='space-y-6 max-w-7xl mx-auto pb-8 pt-2'
		>
			<PageHeader
				title={t('sidebar.allStudents') || 'Talabalar'}
				description={
					t('dashboard.adminPanel') || 'Barcha talabalarni boshqarish'
				}
				actionText={
					isExporting
						? t('common.exporting') || 'Yuklanmoqda...'
						: t('common.export') || 'Excel ga yuklash'
				}
				actionIcon={isExporting ? Loader2 : Download}
				onAction={handleExportExcel}
				buttonClassName='bg-background text-foreground border shadow-sm hover:bg-accent transition-colors'
				disabled={isExporting || isLoading || isTableEmpty}
			/>

			{/* 📊 Qisqacha statistika */}
			{!isLoading && !isTableEmpty && (
				<motion.div
					variants={itemVariants}
					className='flex flex-col sm:flex-row sm:items-center bg-card p-4 rounded-xl border shadow-sm gap-4 justify-between'
				>
					<div className='flex items-center gap-2 w-full'>
						<Badge
							variant='secondary'
							className='px-3 py-1 text-sm font-medium'
						>
							{t('common.all') || 'Barchasi'}: {students.length}
						</Badge>
						<Badge className='bg-green-500/15 text-green-700 dark:text-green-400 hover:bg-green-500/20 border-none px-3 py-1 text-sm font-medium shadow-none'>
							{t('common.active') || 'Faol'}: {activeCount}
						</Badge>
					</div>
				</motion.div>
			)}

			{/* 🗂️ JADVAL */}
			<motion.div variants={itemVariants}>
				<DataTable
					columns={columns}
					data={students}
					isLoading={isLoading}
					searchPlaceholder={
						t('common.search') || "Ism yoki raqam bo'yicha qidirish..."
					}
					searchKey={row =>
						`${row.fullName} ${row.course} ${row.group} ${row.phoneNumber}`
					}
					onRowClick={row => router.push(`/admin/students/${row.id}/view`)}
					emptyProps={{
						title: t('common.noResults') || 'Natija topilmadi',
						description: "Talabalar ro'yxati hozircha bo'sh.",
					}}
				/>
			</motion.div>

			{/* 🛡️ MODALS (ConfirmDialogs) */}
			<ConfirmDialog
				isOpen={isStatusModalOpen}
				onClose={() => setIsStatusModalOpen(false)}
				onConfirm={confirmStatusUpdate}
				title={t('common.status') || "Statusni o'zgartirish"}
				description={
					selectedStudent?.status === 'active'
						? t('dashboard.blockStudentDesc') ||
							'Haqiqatan ham ushbu talabani bloklamoqchimisiz?'
						: t('dashboard.unblockStudentDesc') ||
							'Haqiqatan ham ushbu talabani blokdan chiqarmoqchimisiz?'
				}
				isLoading={isProcessing}
				mode={selectedStudent?.status === 'active' ? 'danger' : 'primary'}
			/>

			<ConfirmDialog
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				onConfirm={confirmDelete}
				title={t('common.delete') || "O'chirish"}
				description={
					t('dashboard.deleteStudentDesc') ||
					"Haqiqatan ham ushbu talabani tizimdan butunlay o'chirib tashlamoqchimisiz? Bu amalni orqaga qaytarib bo'lmaydi."
				}
				isLoading={isProcessing}
				mode='danger'
			/>
		</motion.div>
	)
}

// Suspense Layout
export default function AdminStudentsPage() {
	return (
		<Suspense fallback={<LoadingSpinner fullScreen />}>
			<AdminStudentsContent />
		</Suspense>
	)
}
