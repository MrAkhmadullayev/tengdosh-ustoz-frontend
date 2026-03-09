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
// 🔥 Markazlashgan utilitalar
import { formatUzDate, getErrorMessage, getInitials } from '@/lib/utils'
import { motion } from 'framer-motion'
import {
	CheckCircle2,
	Clock,
	Download,
	Eye,
	Loader2,
	MoreHorizontal,
	XCircle,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner' // 🔥 Toast import qilindi

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
function AdminApplicationsContent() {
	const router = useRouter()
	const { t } = useTranslation()

	const [applications, setApplications] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const [isExporting, setIsExporting] = useState(false)

	// Modal holatlari
	const [selectedApp, setSelectedApp] = useState(null)
	const [isApproveModalOpen, setIsApproveModalOpen] = useState(false)
	const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
	const [isProcessing, setIsProcessing] = useState(false)

	// 1. API dan arizalarni yuklash
	const fetchApplications = useCallback(async () => {
		try {
			setIsLoading(true)
			const res = await api.get('/admin/applications/mentors')
			if (res?.data?.success) {
				const mappedApplications = res.data.applications.map((app, idx) => ({
					...app,
					id: app._id || app.id, // Mongo ID xavfsizligi
					index: idx + 1,
					fullName: `${app.firstName || ''} ${app.lastName || ''}`.trim(),
				}))
				setApplications(mappedApplications)
			}
		} catch (error) {
			toast.error(
				getErrorMessage(
					error,
					t('errors.fetchFailed') || 'Arizalarni yuklashda xatolik',
				),
			)
		} finally {
			setIsLoading(false)
		}
	}, [t])

	useEffect(() => {
		fetchApplications()
	}, [fetchApplications])

	// 2. ARIZANI QABUL QILISH (Optimistik Update + Toast)
	const handleApproveClick = app => {
		setSelectedApp(app)
		setIsApproveModalOpen(true)
	}

	const confirmApprove = async () => {
		if (!selectedApp) return
		setIsProcessing(true)

		try {
			const res = await api.put(
				`/admin/applications/mentors/${selectedApp.id}/approve`,
			)
			if (res?.data?.success) {
				// Optimistik ro'yxatdan olib tashlash va qayta raqamlash (index)
				setApplications(prev => {
					const filtered = prev.filter(app => app.id !== selectedApp.id)
					return filtered.map((app, idx) => ({ ...app, index: idx + 1 }))
				})
				toast.success(
					t('dashboard.approvedSuccess') || 'Mentor muvaffaqiyatli tasdiqlandi',
				)
				setIsApproveModalOpen(false)
			}
		} catch (error) {
			toast.error(
				getErrorMessage(
					error,
					t('errors.updateFailed') || 'Tasdiqlashda xatolik yuz berdi',
				),
			)
		} finally {
			setIsProcessing(false)
		}
	}

	// 3. ARIZANI RAD ETISH (Optimistik Update + Toast)
	const handleRejectClick = app => {
		setSelectedApp(app)
		setIsRejectModalOpen(true)
	}

	const confirmReject = async () => {
		if (!selectedApp) return
		setIsProcessing(true)

		try {
			const res = await api.put(
				`/admin/applications/mentors/${selectedApp.id}/reject`,
			)
			if (res?.data?.success) {
				// Optimistik ro'yxatdan olib tashlash va qayta raqamlash (index)
				setApplications(prev => {
					const filtered = prev.filter(app => app.id !== selectedApp.id)
					return filtered.map((app, idx) => ({ ...app, index: idx + 1 }))
				})
				toast.success(t('dashboard.rejectedSuccess') || 'Ariza rad etildi')
				setIsRejectModalOpen(false)
			}
		} catch (error) {
			toast.error(
				getErrorMessage(
					error,
					t('errors.updateFailed') || 'Rad etishda xatolik yuz berdi',
				),
			)
		} finally {
			setIsProcessing(false)
		}
	}

	// 4. EXCEL GA YUKLASH (Xavfsiz)
	const isTableEmpty = applications.length === 0

	const handleExportExcel = async () => {
		if (isTableEmpty) return toast.warning("Eksport qilish uchun ma'lumot yo'q")

		setIsExporting(true)
		try {
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
				...applications.map(app =>
					[
						app.index,
						`"${app.fullName}"`,
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
			link.setAttribute(
				'download',
				`Mentorlik_Arizalari_${new Date().toLocaleDateString('uz-UZ')}.csv`,
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
				header: t('dashboard.mentorApplications') || 'Nomzod (Ism-Familiyasi)',
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
									router.push(`/admin/applications/${row.id}/view`)
								}}
							>
								{row.fullName}
							</p>
							<p className='text-xs text-muted-foreground'>
								{row.course || '-'}
							</p>
						</div>
					</div>
				),
			},
			{
				header: t('dashboard.specialtyLabel') || "Yo'nalishi / Mutaxassisligi",
				key: 'specialty',
				render: row => (
					<span className='text-sm font-medium'>{row.specialty || '-'}</span>
				),
			},
			{
				header: 'Ariza Sanasi',
				key: 'createdAt',
				render: row => (
					<span className='text-sm text-muted-foreground whitespace-nowrap'>
						{formatUzDate(row.createdAt)}
					</span>
				),
			},
			{
				header: 'Status',
				key: 'status',
				headerClassName: 'text-center',
				cellClassName: 'text-center',
				render: () => (
					<Badge className='bg-orange-500/15 text-orange-600 dark:text-orange-400 border-none shadow-none font-bold text-[10px] uppercase tracking-wider flex mx-auto w-fit items-center gap-1.5'>
						<Clock className='h-3.5 w-3.5' /> Kutilmoqda
					</Badge>
				),
			},
			{
				header: t('common.actions') || 'Harakatlar',
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
							<DropdownMenuLabel>Arizani boshqarish</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className='cursor-pointer font-medium'
								onClick={() =>
									router.push(`/admin/applications/${row.id}/view`)
								}
							>
								<Eye className='h-4 w-4 mr-2 text-primary' /> Rezyumeni ko'rish
							</DropdownMenuItem>

							<DropdownMenuSeparator />

							<DropdownMenuItem
								className='cursor-pointer text-green-600 dark:text-green-500 focus:text-green-700 dark:focus:text-green-400 focus:bg-green-500/10 font-medium'
								onClick={() => handleApproveClick(row)}
							>
								<CheckCircle2 className='h-4 w-4 mr-2' />{' '}
								{t('dashboard.approve') || 'Qabul qilish'}
							</DropdownMenuItem>
							<DropdownMenuItem
								className='cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 font-medium'
								onClick={() => handleRejectClick(row)}
							>
								<XCircle className='h-4 w-4 mr-2' />{' '}
								{t('dashboard.reject') || 'Rad etish'}
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
				title={t('dashboard.mentorApplications') || 'Mentorlikka Arizalar'}
				description="Rezyumeni to'ldirgan, lekin hali admin tomonidan tasdiqlanmagan shaxslar ro'yxati."
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
					className='flex flex-col sm:flex-row sm:items-center justify-between bg-card p-4 rounded-xl border shadow-sm gap-4'
				>
					<div className='flex items-center gap-2 w-full'>
						<Badge
							variant='secondary'
							className='px-3 py-1 text-sm font-medium'
						>
							{t('common.all') || 'Barchasi'}: {applications.length}
						</Badge>
						<Badge className='bg-orange-500/15 text-orange-600 dark:text-orange-400 hover:bg-orange-500/20 border-none shadow-none px-3 py-1 text-sm font-medium'>
							Kutilmoqda: {applications.length}
						</Badge>
					</div>
				</motion.div>
			)}

			{/* 🗂️ JADVAL */}
			<motion.div variants={itemVariants}>
				<DataTable
					columns={columns}
					data={applications}
					isLoading={isLoading}
					searchPlaceholder="Ismi, ID yoki mutaxassisligi bo'yicha..."
					searchKey={row => `${row.fullName} ${row.specialty} ${row.id}`}
					onRowClick={row => router.push(`/admin/applications/${row.id}/view`)}
					emptyProps={{
						title: 'Arizalar topilmadi.',
						description: "Hozircha tizimda kutilayotgan arizalar yo'q.",
					}}
				/>
			</motion.div>

			{/* 🛡️ MODALS (ConfirmDialogs) */}
			<ConfirmDialog
				isOpen={isApproveModalOpen}
				onClose={() => setIsApproveModalOpen(false)}
				onConfirm={confirmApprove}
				title={t('dashboard.approve') || 'Mentorni tasdiqlash'}
				description={
					<>
						Siz{' '}
						<strong className='text-foreground'>
							"{selectedApp?.fullName}"
						</strong>{' '}
						ismli foydalanuvchini mentor sifatida tasdiqlamoqchimisiz?
						Tasdiqlangandan so'ng, foydalanuvchi tizimdan mentor sifatida to'liq
						foydalanishi mumkin bo'ladi.
					</>
				}
				isLoading={isProcessing}
				mode='primary'
				confirmText={t('common.confirm') || 'Tasdiqlash'}
			/>

			<ConfirmDialog
				isOpen={isRejectModalOpen}
				onClose={() => setIsRejectModalOpen(false)}
				onConfirm={confirmReject}
				title={t('dashboard.reject') || 'Arizani rad etish'}
				description={
					<>
						<strong className='text-foreground'>
							"{selectedApp?.fullName}"
						</strong>{' '}
						arizasini rad etib, uni bloklamoqchimisiz? Bu harakatni orqaga
						qaytarish uchun faqat admin panel orqali qayta faollashtirish kerak
						bo'ladi.
					</>
				}
				isLoading={isProcessing}
				mode='danger'
				confirmText={t('common.reject') || 'Rad etish'}
			/>
		</motion.div>
	)
}

// Suspense Layout (Next.js App Router qoidasi)
export default function AdminApplicationsPage() {
	return (
		<Suspense fallback={<LoadingSpinner fullScreen />}>
			<AdminApplicationsContent />
		</Suspense>
	)
}
