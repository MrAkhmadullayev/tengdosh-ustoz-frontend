'use client'

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
import { formatUzDate, getErrorMessage } from '@/lib/utils'
import {
	Calendar,
	ClipboardList,
	Clock,
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
// 🚀 ASOSIY KOMPONENT
// ==========================================
function MentorLessonsContent() {
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

	// Tabni localStorage dan o'qish
	useEffect(() => {
		const savedTab = localStorage.getItem('mentorLessonsTab')
		if (savedTab && ['live', 'upcoming', 'completed'].includes(savedTab)) {
			setActiveTab(savedTab)
		}
	}, [])

	const handleTabChange = useCallback(value => {
		setActiveTab(value)
		localStorage.setItem('mentorLessonsTab', value)
	}, [])

	const fetchLessons = useCallback(async () => {
		try {
			setIsLoading(true)
			const res = await api.get('/mentor/lessons')
			if (res?.data?.success) {
				setLessons(res.data.lessons)
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
			if (timeDiff < -10800000) return 'completed' // 3 soat
			return 'upcoming'
		} catch {
			return lesson.status || 'upcoming'
		}
	}, [])

	const handleStartLive = async id => {
		try {
			const res = await api.patch(`/mentor/lessons/${id}/status`, {
				status: 'live',
			})
			if (res?.data?.success) {
				toast.success(
					t('dashboard.lessonStartedSuccess') ||
						'Dars muvaffaqiyatli boshlandi',
				)
				router.push(`/mentor/lessons/${id}/broadcast`)
			}
		} catch (error) {
			toast.error(
				getErrorMessage(
					error,
					t('errors.updateFailed') || 'Darsni boshlashda xatolik yuz berdi',
				),
			)
		}
	}

	const handleEndClick = lesson => {
		setActionLesson(lesson)
		setIsEndOpen(true)
	}

	const confirmEndLesson = async () => {
		if (!actionLesson) return
		setIsProcessing(true)
		try {
			const res = await api.patch(
				`/mentor/lessons/${actionLesson._id}/status`,
				{ status: 'completed' },
			)
			if (res?.data?.success) {
				setLessons(prev =>
					prev.map(l =>
						l._id === actionLesson._id ? { ...l, status: 'completed' } : l,
					),
				)
				toast.success(t('dashboard.lessonEndedSuccess') || 'Dars yakunlandi')
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

	const handleDeleteClick = lesson => {
		setActionLesson(lesson)
		setIsDeleteOpen(true)
	}

	const confirmDelete = async () => {
		if (!actionLesson) return
		setIsProcessing(true)
		try {
			const res = await api.delete(`/mentor/lessons/${actionLesson._id}`)
			if (res?.data?.success) {
				setLessons(prev => prev.filter(l => l._id !== actionLesson._id))
				toast.success(t('dashboard.lessonDeletedSuccess') || "Dars o'chirildi")
				setIsDeleteOpen(false)
			}
		} catch (error) {
			toast.error(
				getErrorMessage(
					error,
					t('errors.deleteFailed') || "O'chirishda xatolik",
				),
			)
		} finally {
			setIsProcessing(false)
		}
	}

	const getFormatBadge = useCallback(format => {
		switch (format) {
			case 'online':
				return (
					<Badge
						variant='secondary'
						className='flex items-center gap-1.5 font-normal capitalize'
					>
						<Video className='h-3.5 w-3.5' /> Masofaviy
					</Badge>
				)
			case 'offline':
				return (
					<Badge
						variant='secondary'
						className='flex items-center gap-1.5 font-normal capitalize'
					>
						<MapPin className='h-3.5 w-3.5' /> Markazda
					</Badge>
				)
			case 'hybrid':
				return (
					<Badge
						variant='secondary'
						className='flex items-center gap-1.5 font-normal capitalize'
					>
						<Users className='h-3.5 w-3.5' /> Gibrid
					</Badge>
				)
			default:
				return null
		}
	}, [])

	const columns = useMemo(
		() => [
			{
				header: 'T/R',
				key: 'index',
				headerClassName: 'w-[50px] whitespace-nowrap',
				cellClassName: 'font-medium text-muted-foreground text-center',
				render: (_, i) => i + 1,
			},
			{
				header: 'Dars Nomi',
				headerClassName: 'min-w-[200px]',
				render: row => (
					<div className='flex flex-col gap-1'>
						<p className='font-medium text-foreground leading-tight line-clamp-1'>
							{row.title}
						</p>
						{activeTab === 'live' && (
							<Badge
								variant='destructive'
								className='animate-pulse px-1.5 py-0 text-[10px] uppercase w-fit tracking-wider shadow-none'
							>
								Live
							</Badge>
						)}
					</div>
				),
			},
			{
				header: 'Sana va Vaqt',
				headerClassName: 'whitespace-nowrap',
				render: row => (
					<div className='space-y-1 text-sm'>
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
				header: "O'quvchilar",
				headerClassName: 'whitespace-nowrap',
				render: row => (
					<div className='flex items-center gap-1.5 text-sm'>
						<Users className='h-4 w-4 text-muted-foreground' />
						<span className='font-medium'>
							{row.registeredUsers?.length || 0}
						</span>
						<span className='text-muted-foreground'>
							/ {row.maxStudents || 0}
						</span>
					</div>
				),
			},
			{
				header: 'Format',
				headerClassName: 'whitespace-nowrap',
				render: row => getFormatBadge(row.format),
			},
			{
				header: 'Amallar',
				headerClassName: 'text-right',
				cellClassName: 'text-right',
				render: row => (
					<div className='flex items-center justify-end gap-2'>
						{activeTab === 'upcoming' && (
							<Button
								size='sm'
								className='gap-2 font-medium'
								onClick={e => {
									e.stopPropagation()
									handleStartLive(row._id)
								}}
							>
								<Play className='w-3.5 h-3.5 fill-current' /> Boshlash
							</Button>
						)}
						{activeTab === 'live' && (
							<Button
								size='sm'
								className='gap-2 font-medium'
								onClick={e => {
									e.stopPropagation()
									router.push(`/mentor/lessons/${row._id}/broadcast`)
								}}
							>
								<Video className='w-4 h-4' /> Darsga kirish
							</Button>
						)}

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
								className='w-40'
								onClick={e => e.stopPropagation()}
							>
								{activeTab !== 'completed' && (
									<DropdownMenuItem
										className='cursor-pointer'
										onClick={() =>
											router.push(`/mentor/lessons/${row._id}/edit`)
										}
									>
										<Pencil className='h-4 w-4 mr-2' /> Tahrirlash
									</DropdownMenuItem>
								)}

								{activeTab === 'live' && (
									<DropdownMenuItem
										onClick={() => handleEndClick(row)}
										className='cursor-pointer text-destructive focus:text-destructive'
									>
										<Square className='h-4 w-4 mr-2 fill-current' /> Yakunlash
									</DropdownMenuItem>
								)}

								<DropdownMenuItem
									onClick={() => handleDeleteClick(row)}
									className='cursor-pointer text-destructive focus:text-destructive'
								>
									<Trash2 className='h-4 w-4 mr-2' /> O'chirish
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				),
			},
		],
		[activeTab, router, getFormatBadge],
	)

	const tabLessons = useMemo(() => {
		return lessons.filter(l => checkStatus(l) === activeTab)
	}, [lessons, activeTab, checkStatus])

	return (
		<div className='w-full max-w-7xl mx-auto space-y-6 pb-12 pt-6 px-4 sm:px-6'>
			<PageHeader
				title='Mening Darslarim'
				description="Darslarni rejalashtiring, boshqaring va o'quvchilaringiz bilan ishlang."
				actionText='Yangi Dars'
				actionIcon={Plus}
				onAction={() => router.push('/mentor/lessons/create')}
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
							className='rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2 gap-2 text-sm'
						>
							<Radio
								className={`w-4 h-4 ${activeTab === 'live' ? 'text-destructive animate-pulse' : 'text-muted-foreground'}`}
							/>
							Jonli darslar
						</TabsTrigger>
						<TabsTrigger
							value='upcoming'
							className='rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2 gap-2 text-sm'
						>
							<Calendar className='w-4 h-4 text-muted-foreground' />
							Kelasi Darslar
						</TabsTrigger>
						<TabsTrigger
							value='completed'
							className='rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2 gap-2 text-sm'
						>
							<ClipboardList className='w-4 h-4 text-muted-foreground' />
							O'tgan Darslar
						</TabsTrigger>
					</TabsList>
				</div>

				{['live', 'upcoming', 'completed'].map(tab => (
					<TabsContent
						key={tab}
						value={tab}
						className='m-0 focus-visible:outline-none'
					>
						<DataTable
							columns={columns}
							data={tabLessons}
							isLoading={isLoading}
							searchPlaceholder='Dars nomini qidirish...'
							searchKey='title'
							emptyProps={{
								title: 'Dars topilmadi',
								description: "Bu bo'limda hech qanday dars topilmadi.",
							}}
						/>
					</TabsContent>
				))}
			</Tabs>

			{/* 🛡️ MODALS */}
			<ConfirmDialog
				isOpen={isEndOpen}
				onClose={() => setIsEndOpen(false)}
				onConfirm={confirmEndLesson}
				title='Darsni yakunlash'
				description={
					<>
						Haqiqatdan ham{' '}
						<strong className='text-foreground'>"{actionLesson?.title}"</strong>{' '}
						darsini yakunlashni tasdiqlaysizmi?
					</>
				}
				isLoading={isProcessing}
				mode='primary'
				confirmText='Yakunlash'
			/>

			<ConfirmDialog
				isOpen={isDeleteOpen}
				onClose={() => setIsDeleteOpen(false)}
				onConfirm={confirmDelete}
				title="Darsni o'chirish"
				description={
					<>
						Haqiqatdan ham{' '}
						<strong className='text-foreground'>"{actionLesson?.title}"</strong>{' '}
						nomli darsni butunlay o'chirmoqchimisiz? Bu amalni orqaga qaytarib
						bo'lmaydi.
					</>
				}
				isLoading={isProcessing}
				mode='danger'
				confirmText="O'chirish"
			/>
		</div>
	)
}

// Suspense Layout
export default function MentorLessonsPage() {
	return (
		<Suspense fallback={<LoadingSpinner fullScreen />}>
			<MentorLessonsContent />
		</Suspense>
	)
}
