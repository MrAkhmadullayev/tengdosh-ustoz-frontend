'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import { formatPhone, getErrorMessage, getInitials } from '@/lib/utils'
import { motion } from 'framer-motion'
import {
	CheckCircle2,
	Download,
	Edit,
	Eye,
	Loader2,
	MoreHorizontal,
	Phone,
	ShieldBan,
	Star,
	Trash2,
	Users,
} from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import DeleteMentorModal from './actions/DeleteMentor'

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
// 🚀 ASOSIY KOMPONENT (Content)
// ==========================================
function AdminMentorsContent() {
	const router = useRouter()
	const { t } = useTranslation()
	const searchParams = useSearchParams()
	const actionType = searchParams.get('action')

	const [mentors, setMentors] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const [isExporting, setIsExporting] = useState(false)

	// 1. API dan ma'lumotlarni tortish
	const fetchMentors = useCallback(async () => {
		try {
			const res = await api.get('/admin/mentors')
			if (res?.data?.success) {
				const mapped = res.data.mentors.map((m, index) => ({
					id: m.id || m._id,
					index: index + 1,
					firstName: m.firstName || '',
					lastName: m.lastName || '',
					name: `${m.firstName || ''} ${m.lastName || ''}`.trim(),
					course: m.course || t('common.notEntered') || 'Kiritilmagan',
					group: m.group || t('common.notEntered') || '-',
					phoneNumber: m.phoneNumber || '',
					rating: m.rating || 0,
					ratingCount: m.ratingCount || 0,
					followersCount: m.followersCount || 0,
					status: m.status || 'active',
					joinedDate: new Date(m.createdAt).toLocaleDateString('uz-UZ'),
				}))
				setMentors(mapped)
			}
		} catch (err) {
			toast.error(
				getErrorMessage(
					err,
					t('errors.fetchFailed') || "Ma'lumotlarni yuklashda xatolik",
				),
			)
		} finally {
			setIsLoading(false)
		}
	}, [t])

	useEffect(() => {
		fetchMentors()
	}, [fetchMentors])

	// 🔥 2. OPTIMISTIK STATUS O'ZGARTIRISH (Refreshsiz)
	const handleToggleStatus = async (id, currentStatus) => {
		const newStatus = currentStatus === 'active' ? 'blocked' : 'active'

		const promise = api
			.put(`/admin/mentors/${id}/status`, { status: newStatus })
			.then(res => {
				if (res.data.success) {
					// UI darhol yangilanadi
					setMentors(prev =>
						prev.map(m => (m.id === id ? { ...m, status: newStatus } : m)),
					)
				}
			})

		toast.promise(promise, {
			loading: t('common.updating') || 'Yangilanmoqda...',
			success: t('common.updateSuccess') || 'Muvaffaqiyatli yangilandi',
			error: err =>
				getErrorMessage(err, t('errors.updateFailed') || 'Xatolik yuz berdi'),
		})
	}

	// 🔥 3. OPTIMISTIK O'CHIRISH (Modal ichidan chaqiriladi, refresh qilinmaydi)
	const handleDeleteSuccess = useCallback(deletedId => {
		setMentors(prev => {
			const filtered = prev.filter(m => m.id !== deletedId)
			// T/R (Index) larni qayta tartiblaymiz
			return filtered.map((m, idx) => ({ ...m, index: idx + 1 }))
		})
	}, [])

	// 4. EXCEL GA YUKLASH (Xavfsiz)
	const isTableEmpty = mentors.length === 0

	const handleExportExcel = async () => {
		if (isTableEmpty) return toast.warning("Eksport qilish uchun ma'lumot yo'q")

		setIsExporting(true)
		try {
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
				...mentors.map(m =>
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
			link.setAttribute(
				'download',
				`Mentorlar_${new Date().toLocaleDateString('uz-UZ')}.csv`,
			)
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)

			toast.success(t('common.exportSuccess') || 'Muvaffaqiyatli yuklab olindi')
		} catch (error) {
			toast.error(t('errors.exportFailed') || 'Yuklab olishda xatolik')
		} finally {
			setIsExporting(false)
		}
	}

	const activeCount = useMemo(
		() => mentors.filter(m => m.status === 'active').length,
		[mentors],
	)

	// 5. JADVAL USTUNLARI (Columns)
	const columns = useMemo(
		() => [
			{
				header: 'T/R',
				key: 'index',
				headerClassName: 'w-[60px]',
				cellClassName: 'font-medium text-muted-foreground',
			},
			{
				header: t('sidebar.mentors') || 'Mentorlar',
				key: 'name',
				render: row => (
					<div className='flex items-center gap-3'>
						<Avatar className='h-9 w-9 border border-border shadow-sm'>
							<AvatarFallback className='bg-primary/10 text-primary font-bold text-xs'>
								{getInitials(row.firstName, row.lastName)}
							</AvatarFallback>
						</Avatar>
						<div>
							<p
								className='font-semibold text-foreground leading-none mb-1 cursor-pointer hover:text-primary transition-colors'
								onClick={e => {
									e.stopPropagation()
									router.push(`/admin/mentors/${row.id}/view`)
								}}
							>
								{row.name}
							</p>
							<p className='text-xs text-muted-foreground'>{row.course}</p>
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
							<Phone className='h-3.5 w-3.5' />
							{formatPhone(row.phoneNumber)}
						</a>
					) : (
						<span className='text-muted-foreground text-sm'>
							{t('common.notEntered') || '-'}
						</span>
					),
			},
			{
				header: t('mentors.group') || 'Guruh',
				key: 'group',
				render: row => <span className='font-medium'>{row.group}</span>,
			},
			{
				header: t('mentors.rating') || 'Reyting',
				key: 'rating',
				headerClassName: 'text-center',
				cellClassName: 'text-center',
				render: row =>
					row.rating > 0 ? (
						<Badge
							variant='secondary'
							className='bg-yellow-500/15 text-yellow-600 dark:text-yellow-500 border-none font-bold'
						>
							<Star className='h-3.5 w-3.5 mr-1 fill-yellow-600 dark:fill-yellow-500' />
							{row.rating}
							<span className='text-[10px] font-normal ml-1 opacity-70'>
								({row.ratingCount})
							</span>
						</Badge>
					) : (
						<Badge
							variant='outline'
							className='text-muted-foreground font-medium bg-muted/50'
						>
							{t('common.new') || 'Yangi'}
						</Badge>
					),
			},
			{
				header: t('mentors.students') || 'Talabalar',
				key: 'followersCount',
				headerClassName: 'text-center',
				cellClassName: 'text-center',
				render: row => (
					<div className='flex items-center justify-center gap-1.5'>
						<Users className='h-4 w-4 text-muted-foreground' />
						<span className='font-semibold'>{row.followersCount}</span>
					</div>
				),
			},
			{
				header: t('common.status') || 'Status',
				key: 'status',
				render: row =>
					row.status === 'active' ? (
						<Badge className='bg-green-500/15 text-green-700 dark:text-green-400 border-none font-medium flex w-fit items-center gap-1.5 shadow-none'>
							<CheckCircle2 className='h-3.5 w-3.5' />{' '}
							{t('common.active') || 'Faol'}
						</Badge>
					) : (
						<Badge
							variant='secondary'
							className='bg-destructive/15 text-destructive border-none font-medium flex w-fit items-center gap-1.5 shadow-none'
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
								onClick={() => router.push(`/admin/mentors/${row.id}/view`)}
							>
								<Eye className='h-4 w-4 mr-2 text-muted-foreground' />{' '}
								{t('common.view') || "Ko'rish"}
							</DropdownMenuItem>
							<DropdownMenuItem
								className='cursor-pointer'
								onClick={() => router.push(`/admin/mentors/${row.id}/edit`)}
							>
								<Edit className='h-4 w-4 mr-2 text-muted-foreground' />{' '}
								{t('common.edit') || 'Tahrirlash'}
							</DropdownMenuItem>

							<DropdownMenuSeparator />

							{row.status === 'active' ? (
								<DropdownMenuItem
									className='cursor-pointer text-orange-600 focus:text-orange-600'
									onClick={() => handleToggleStatus(row.id, row.status)}
								>
									<ShieldBan className='h-4 w-4 mr-2' />{' '}
									{t('mentors.block') || 'Bloklash'}
								</DropdownMenuItem>
							) : (
								<DropdownMenuItem
									className='cursor-pointer text-green-600 focus:text-green-600'
									onClick={() => handleToggleStatus(row.id, row.status)}
								>
									<CheckCircle2 className='h-4 w-4 mr-2' />{' '}
									{t('mentors.unblock') || 'Blokdan chiqarish'}
								</DropdownMenuItem>
							)}

							<DropdownMenuSeparator />
							<DropdownMenuItem
								className='cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10'
								onClick={() =>
									router.push(`/admin/mentors?action=delete&id=${row.id}`)
								}
							>
								<Trash2 className='h-4 w-4 mr-2' />{' '}
								{t('mentors.removeMentor') || "O'chirish"}
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
				title={t('mentors.title') || 'Mentorlar'}
				description={
					t('mentors.description') || 'Barcha mentorlarni boshqarish'
				}
				actionText={
					isExporting
						? t('common.exporting') || 'Yuklanmoqda...'
						: t('mentors.exportExcel') || 'Excel ga yuklash'
				}
				actionIcon={isExporting ? Loader2 : Download}
				onAction={handleExportExcel}
				buttonClassName='bg-background text-foreground border shadow-sm hover:bg-accent transition-colors'
				disabled={isExporting || isLoading || isTableEmpty}
			/>

			{/* 📊 Qisqacha statistika (Skelet yuklanayotganda yashiramiz) */}
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
							{t('common.all') || 'Barchasi'}: {mentors.length}
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
					data={mentors}
					isLoading={isLoading}
					searchPlaceholder={
						t('mentors.searchPlaceholder') ||
						"Ism yoki raqam bo'yicha qidirish..."
					}
					searchKey={row =>
						`${row.name} ${row.course} ${row.group} ${row.phoneNumber}`
					}
					onRowClick={row => router.push(`/admin/mentors/${row.id}/view`)}
					emptyProps={{
						title: t('common.noResults') || 'Natija topilmadi',
						description:
							t('mentors.noResults') || "Mentorlar ro'yxati hozircha bo'sh.",
					}}
				/>
			</motion.div>

			{/* 🗑️ DELETE MODAL (Optimistik onSuccess yuboriladi) */}
			{actionType === 'delete' && (
				<DeleteMentorModal onSuccess={handleDeleteSuccess} />
			)}
		</motion.div>
	)
}

// Suspense Layout (Next.js App Router qoidasi)
export default function AdminMentorsPage() {
	return (
		<Suspense fallback={<LoadingSpinner fullScreen />}>
			<AdminMentorsContent />
		</Suspense>
	)
}
