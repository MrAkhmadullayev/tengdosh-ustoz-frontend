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
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { PageHeader } from '@/components/ui/page-header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import api from '@/lib/api'
import { useTranslation } from '@/lib/i18n'
import { formatUzDate, getErrorMessage, getInitials } from '@/lib/utils'
import {
	Calendar,
	ClipboardList,
	Clock,
	Eye,
	MapPin,
	MoreHorizontal,
	Pencil,
	Play,
	Plus,
	Radio,
	Square,
	Trash2,
	Users,
	Video,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

// ==========================================
// 🚀 ASOSIY KOMPONENT (Content)
// ==========================================
function AdminLessonsContent() {
	const router = useRouter()
	const { t } = useTranslation()

	const [lessons, setLessons] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const [activeTab, setActiveTab] = useState('upcoming')

	// Modal statelari
	const [actionLesson, setActionLesson] = useState(null)
	const [isDeleteOpen, setIsDeleteOpen] = useState(false)
	const [isEndOpen, setIsEndOpen] = useState(false)
	const [isProcessing, setIsProcessing] = useState(false)

	// 1. Tab holatini localStorage dan o'qish
	useEffect(() => {
		const savedTab = localStorage.getItem('adminLessonsTab')
		if (savedTab && ['live', 'upcoming', 'completed'].includes(savedTab)) {
			setActiveTab(savedTab)
		}
	}, [])

	const handleTabChange = useCallback(value => {
		setActiveTab(value)
		localStorage.setItem('adminLessonsTab', value)
	}, [])

	// 2. API dan darslarni yuklash
	const fetchLessons = useCallback(async () => {
		try {
			setIsLoading(true)
			const res = await api.get('/admin/lessons')
			if (res?.data?.success) {
				const mapped = res.data.lessons.map((l, index) => ({
					...l,
					id: l._id || l.id, // Xavfsiz ID
					index: index + 1,
				}))
				setLessons(mapped)
			}
		} catch (error) {
			toast.error(
				getErrorMessage(
					error,
					t('errors.fetchFailed') || 'Darslarni yuklashda xatolik',
				),
			)
		} finally {
			setIsLoading(false)
		}
	}, [t])

	useEffect(() => {
		fetchLessons()
	}, [fetchLessons])

	// 3. Dars holatini aniqlash mantiqi
	const checkStatus = useCallback(lesson => {
		if (lesson.status === 'live') return 'live'
		if (lesson.status === 'completed') return 'completed'

		try {
			const lessonDate = new Date(
				`${lesson.date.split('T')[0]}T${lesson.time}:00`,
			)
			const now = new Date()
			const timeDiff = lessonDate.getTime() - now.getTime()

			if (timeDiff > 0) return 'upcoming'
			if (timeDiff < -10800000) return 'completed' // 3 soatdan keyin o'tgan darsga aylanadi
			return 'upcoming'
		} catch {
			return lesson.status || 'upcoming'
		}
	}, [])

	const handleRowClick = useCallback(
		(lessonId, statusTab) => {
			if (statusTab === 'live') {
				router.push(`/admin/lessons/${lessonId}/watch`)
			} else {
				router.push(`/admin/lessons/${lessonId}/view`)
			}
		},
		[router],
	)

	// 4. DARSNI YAKUNLASH
	const confirmEndLesson = async () => {
		if (!actionLesson) return
		setIsProcessing(true)

		try {
			const res = await api.patch(`/admin/lessons/${actionLesson.id}/end`)
			if (res?.data?.success) {
				setLessons(prev =>
					prev.map(l =>
						l.id === actionLesson.id ? { ...l, status: 'completed' } : l,
					),
				)
				toast.success(
					t('dashboard.lessonEndedSuccess') || 'Dars muvaffaqiyatli yakunlandi',
				)
				setIsEndOpen(false)
			}
		} catch (error) {
			toast.error(
				getErrorMessage(
					error,
					t('errors.updateFailed') || 'Darsni yakunlashda xatolik',
				),
			)
		} finally {
			setIsProcessing(false)
		}
	}

	// 5. DARSNI O'CHIRISH
	const confirmDelete = async () => {
		if (!actionLesson) return
		setIsProcessing(true)

		try {
			const res = await api.delete(`/admin/lessons/${actionLesson.id}`)
			if (res?.data?.success) {
				setLessons(prev => {
					const filtered = prev.filter(l => l.id !== actionLesson.id)
					return filtered.map((l, idx) => ({ ...l, index: idx + 1 }))
				})
				toast.success(t('dashboard.lessonDeletedSuccess') || "Dars o'chirildi")
				setIsDeleteOpen(false)
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

	// 6. Format badge komponenti (Standart ranglarda)
	const getFormatBadge = useCallback(
		format => {
			switch (format) {
				case 'online':
					return (
						<Badge
							variant='secondary'
							className='flex w-fit items-center gap-1.5 font-normal capitalize'
						>
							<Video className='h-3.5 w-3.5' />{' '}
							{t('dashboard.remote') || 'Online'}
						</Badge>
					)
				case 'offline':
					return (
						<Badge
							variant='secondary'
							className='flex w-fit items-center gap-1.5 font-normal capitalize'
						>
							<MapPin className='h-3.5 w-3.5' />{' '}
							{t('dashboard.atCenter') || 'Offline'}
						</Badge>
					)
				case 'hybrid':
					return (
						<Badge
							variant='secondary'
							className='flex w-fit items-center gap-1.5 font-normal capitalize'
						>
							<Users className='h-3.5 w-3.5' />{' '}
							{t('dashboard.hybrid') || 'Hybrid'}
						</Badge>
					)
				default:
					return null
			}
		},
		[t],
	)

	// 7. JADVAL USTUNLARI
	const columns = useMemo(
		() => [
			{
				header: 'T/R',
				key: 'index',
				headerClassName: 'w-[60px]',
				cellClassName: 'font-medium text-muted-foreground',
			},
			{
				header: t('dashboard.lessonName') || 'Dars Nomi',
				render: row => (
					<div className='flex flex-col gap-1.5'>
						<div className='flex items-center gap-2'>
							<p
								className='font-medium text-foreground leading-tight line-clamp-1 cursor-pointer hover:text-primary transition-colors'
								onClick={e => {
									e.stopPropagation()
									handleRowClick(row.id, activeTab)
								}}
							>
								{row.title}
							</p>
							{activeTab === 'live' && (
								<span className='relative flex h-2 w-2 shrink-0'>
									<span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75'></span>
									<span className='relative inline-flex rounded-full h-2 w-2 bg-destructive'></span>
								</span>
							)}
						</div>
						<div className='flex items-center gap-2'>
							<Avatar className='h-5 w-5 border'>
								<AvatarFallback className='text-[10px] bg-muted text-foreground'>
									{getInitials(row.mentorName, '')}
								</AvatarFallback>
							</Avatar>
							<span className='text-xs text-muted-foreground capitalize'>
								{row.mentorName || "Noma'lum"}
							</span>
						</div>
					</div>
				),
			},
			{
				header: t('dashboard.dateTime') || 'Sana va Vaqt',
				render: row => (
					<div className='space-y-1.5 text-sm'>
						<div className='flex items-center gap-2'>
							<Calendar className='h-4 w-4 text-muted-foreground' />
							<span className='font-medium'>
								{formatUzDate(row.date).split(',')[0]}
							</span>
						</div>
						<div className='flex items-center gap-2 text-muted-foreground'>
							<Clock className='h-4 w-4' />
							<span>{row.time}</span>
						</div>
					</div>
				),
			},
			{
				header: t('dashboard.studentsCount') || "O'quvchilar",
				render: row => (
					<div className='flex items-center gap-1.5 text-sm'>
						<Users className='h-4 w-4 text-muted-foreground' />
						<span className='font-medium'>{row.registeredCount || 0}</span>
						<span className='text-muted-foreground'>
							/ {row.maxStudents || 0}
						</span>
					</div>
				),
			},
			{
				header: t('dashboard.format') || 'Format',
				render: row => getFormatBadge(row.format),
			},
			{
				header: t('common.actions') || 'Amallar',
				headerClassName: 'text-right',
				cellClassName: 'text-right',
				render: row => (
					<DropdownMenu>
						<DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
							<Button
								variant='ghost'
								size='icon'
								className='h-8 w-8 text-muted-foreground'
							>
								<MoreHorizontal className='h-4 w-4' />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align='end'
							className='w-48'
							onClick={e => e.stopPropagation()}
						>
							<DropdownMenuItem
								className='cursor-pointer'
								onClick={() => router.push(`/admin/lessons/${row.id}/view`)}
							>
								<Eye className='h-4 w-4 mr-2' /> {t('common.view') || "Ko'rish"}
							</DropdownMenuItem>

							{activeTab === 'live' && (
								<DropdownMenuItem
									className='cursor-pointer text-primary focus:text-primary'
									onClick={() => router.push(`/admin/lessons/${row.id}/watch`)}
								>
									<Play className='h-4 w-4 mr-2' />{' '}
									{t('dashboard.watch') || 'Kuzatish'}
								</DropdownMenuItem>
							)}

							<DropdownMenuItem
								className='cursor-pointer'
								onClick={() => router.push(`/admin/lessons/${row.id}/edit`)}
							>
								<Pencil className='h-4 w-4 mr-2' />{' '}
								{t('common.edit') || 'Tahrirlash'}
							</DropdownMenuItem>

							{activeTab === 'live' ? (
								<DropdownMenuItem
									className='cursor-pointer text-destructive focus:text-destructive'
									onClick={() => {
										setActionLesson(row)
										setIsEndOpen(true)
									}}
								>
									<Square className='h-4 w-4 mr-2 fill-current' />{' '}
									{t('dashboard.end') || 'Yakunlash'}
								</DropdownMenuItem>
							) : (
								<DropdownMenuItem
									className='cursor-pointer text-destructive focus:text-destructive'
									onClick={() => {
										setActionLesson(row)
										setIsDeleteOpen(true)
									}}
								>
									<Trash2 className='h-4 w-4 mr-2' />{' '}
									{t('common.delete') || "O'chirish"}
								</DropdownMenuItem>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				),
			},
		],
		[router, activeTab, t, getFormatBadge, handleRowClick],
	)

	const tabLessons = useMemo(
		() => lessons.filter(l => checkStatus(l) === activeTab),
		[lessons, activeTab, checkStatus],
	)

	return (
		<div className='max-w-6xl mx-auto space-y-6 pb-12 pt-6 px-4 sm:px-6'>
			<PageHeader
				title={t('dashboard.lessonsDatabase') || 'Darslar Bazasi'}
				description={
					t('dashboard.lessonsDatabaseDesc') ||
					"Barcha rejalashtirilgan, jonli va yakunlangan darslar ro'yxati."
				}
				actionText={t('dashboard.createNewLesson') || "Yangi dars qo'shish"}
				actionIcon={Plus}
				onAction={() => router.push('/admin/lessons/create')}
			/>

			<Tabs
				value={activeTab}
				onValueChange={handleTabChange}
				className='w-full'
			>
				<div className='w-full overflow-x-auto pb-2 no-scrollbar'>
					<TabsList className='w-max min-w-full sm:w-full md:w-auto h-auto p-0 bg-transparent border-b rounded-none mb-6'>
						<TabsTrigger
							value='live'
							className='rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2'
						>
							<Radio className='mr-2 h-4 w-4 text-destructive' />
							{t('dashboard.liveLessons') || 'Jonli darslar'} (
							{lessons.filter(l => checkStatus(l) === 'live').length})
						</TabsTrigger>
						<TabsTrigger
							value='upcoming'
							className='rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2'
						>
							<Calendar className='mr-2 h-4 w-4' />
							{t('dashboard.upcomingLessons') || 'Keladigan'} (
							{lessons.filter(l => checkStatus(l) === 'upcoming').length})
						</TabsTrigger>
						<TabsTrigger
							value='completed'
							className='rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2'
						>
							<ClipboardList className='mr-2 h-4 w-4' />
							{t('dashboard.completedLessons') || "O'tgan"} (
							{lessons.filter(l => checkStatus(l) === 'completed').length})
						</TabsTrigger>
					</TabsList>
				</div>

				<TabsContent
					value={activeTab}
					className='m-0 focus-visible:outline-none'
				>
					<DataTable
						columns={columns}
						data={tabLessons}
						isLoading={isLoading}
						searchPlaceholder={
							t('dashboard.searchLessonsPlaceholder') ||
							'Dars nomi yoki mentor ismini kiriting...'
						}
						searchKey={row => `${row.title} ${row.mentorName} ${row.id}`}
						onRowClick={row => handleRowClick(row.id, activeTab)}
						emptyProps={{
							title: t('common.noResults') || 'Natija topilmadi',
							description:
								t('dashboard.noLessonsFound') ||
								"Ushbu bo'limda hozircha darslar mavjud emas.",
						}}
					/>
				</TabsContent>
			</Tabs>

			<ConfirmDialog
				isOpen={isEndOpen}
				onClose={() => setIsEndOpen(false)}
				onConfirm={confirmEndLesson}
				title={t('dashboard.endLessonTitle') || 'Darsni yakunlash'}
				description={
					t('dashboard.endLessonDesc', { title: actionLesson?.title }) ||
					`Haqiqatan ham "${actionLesson?.title}" darsini yakunlamoqchimisiz?`
				}
				isLoading={isProcessing}
				mode='primary'
				confirmText={t('dashboard.end') || 'Yakunlash'}
			/>

			<ConfirmDialog
				isOpen={isDeleteOpen}
				onClose={() => setIsDeleteOpen(false)}
				onConfirm={confirmDelete}
				title={t('dashboard.deleteLessonTitle') || "Darsni o'chirish"}
				description={
					t('dashboard.deleteLessonDesc', { title: actionLesson?.title }) ||
					`Haqiqatan ham "${actionLesson?.title}" darsini butunlay o'chirib tashlamoqchimisiz?`
				}
				isLoading={isProcessing}
				mode='danger'
				confirmText={t('common.delete') || "O'chirish"}
			/>
		</div>
	)
}

// Suspense Layout (Next.js App Router qoidasi)
export default function AdminLessonsPage() {
	return (
		<Suspense fallback={<LoadingSpinner fullScreen />}>
			<AdminLessonsContent />
		</Suspense>
	)
}
