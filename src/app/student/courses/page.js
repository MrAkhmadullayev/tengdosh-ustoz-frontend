'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { PageHeader } from '@/components/ui/page-header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import api from '@/lib/api'
import { useTranslation } from '@/lib/i18n'
// 🔥 Markazlashgan utilitalar
import { formatUzDate, getErrorMessage, getInitials } from '@/lib/utils'
import {
	Calendar,
	ClipboardList,
	Clock,
	MapPin,
	Play,
	Radio,
	Users,
	Video,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

// ==========================================
// 🚀 ASOSIY KOMPONENT
// ==========================================
function StudentLessonsContent() {
	const router = useRouter()
	const { t } = useTranslation()
	const [lessons, setLessons] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const [activeTab, setActiveTab] = useState('live')

	const fetchLessons = useCallback(async () => {
		try {
			setIsLoading(true)
			const res = await api.get('/student/lessons')
			if (res?.data?.success) {
				const mapped = res.data.lessons.map((l, index) => ({
					...l,
					id: l._id || l.id,
					index: index + 1,
					mentorSearch:
						`${l.mentor?.firstName || ''} ${l.mentor?.lastName || ''}`.trim(),
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
		const savedTab = localStorage.getItem('studentLessonsTab')
		if (savedTab && ['live', 'upcoming', 'completed'].includes(savedTab)) {
			setActiveTab(savedTab)
		}
	}, [fetchLessons])

	const handleTabChange = useCallback(value => {
		setActiveTab(value)
		localStorage.setItem('studentLessonsTab', value)
	}, [])

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
			if (timeDiff < -10800000) return 'completed' // 3 soatdan keyin o'tgan darsga o'tkazish
			return 'upcoming'
		} catch {
			return 'upcoming'
		}
	}, [])

	const columns = useMemo(
		() => [
			{
				header: 'T/R',
				key: 'index',
				headerClassName: 'w-[60px] whitespace-nowrap',
				cellClassName: 'font-medium text-muted-foreground text-center',
			},
			{
				header: t('dashboard.lessonName') || 'Dars Nomi',
				headerClassName: 'min-w-[200px]',
				render: row => (
					<div className='flex flex-col gap-1'>
						<p className='font-medium text-foreground leading-tight line-clamp-2'>
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
				header: t('dashboard.mentor') || 'Ustoz',
				headerClassName: 'whitespace-nowrap',
				render: row => (
					<div className='flex items-center gap-3'>
						<Avatar className='h-8 w-8 border'>
							<AvatarFallback className='bg-muted text-xs font-bold text-foreground'>
								{getInitials(row.mentor?.firstName, row.mentor?.lastName)}
							</AvatarFallback>
						</Avatar>
						<span className='font-semibold text-sm capitalize'>
							{row.mentor?.firstName} {row.mentor?.lastName}
						</span>
					</div>
				),
			},
			{
				header: t('dashboard.dateTime') || 'Sana va Vaqt',
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
				header: t('dashboard.format') || 'Format',
				headerClassName: 'whitespace-nowrap',
				render: row => getFormatBadge(row.format),
			},
			{
				header: t('common.actions') || 'Amallar',
				headerClassName: 'text-right whitespace-nowrap',
				cellClassName: 'text-right',
				render: row => (
					<div className='flex items-center justify-end gap-2'>
						{activeTab === 'live' ? (
							<Button
								size='sm'
								className='gap-2 bg-destructive hover:bg-destructive/90 text-white font-bold animate-pulse shadow-sm'
								onClick={e => {
									e.stopPropagation()
									router.push(`/student/courses/${row.id}/watch`)
								}}
							>
								<Play className='w-3.5 h-3.5 fill-current' />{' '}
								{t('dashboard.join') || "Qo'shilish"}
							</Button>
						) : (
							<Badge
								variant='outline'
								className='text-muted-foreground font-medium uppercase tracking-wider text-[10px]'
							>
								{activeTab === 'upcoming'
									? t('dashboard.upcoming') || 'Kutilmoqda'
									: t('dashboard.completed') || 'Yakunlangan'}
							</Badge>
						)}
					</div>
				),
			},
		],
		[activeTab, router, t, getFormatBadge],
	)

	const tabLessons = useMemo(() => {
		return lessons.filter(l => checkStatus(l) === activeTab)
	}, [lessons, activeTab, checkStatus])

	return (
		<div className='w-full max-w-7xl mx-auto space-y-6 pb-12 pt-6 px-4 sm:px-6'>
			<PageHeader
				title={t('sidebar.lessons') || 'Mening Darslarim'}
				description={
					t('dashboard.myLessonsDesc') ||
					"Jonli efirlarga qo'shiling va ustozlaringiz bilan birga o'rganing."
				}
			/>

			<Tabs
				value={activeTab}
				onValueChange={handleTabChange}
				className='w-full'
			>
				<div className='w-full overflow-x-auto pb-2 no-scrollbar border-b'>
					<TabsList className='w-max min-w-full sm:w-full md:w-auto h-auto p-0 bg-transparent rounded-none mb-0'>
						<TabsTrigger
							value='live'
							className='rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 gap-2 text-sm'
						>
							<Radio
								className={`w-4 h-4 ${activeTab === 'live' ? 'text-destructive animate-pulse' : 'text-muted-foreground'}`}
							/>
							{t('dashboard.liveLessons') || 'Jonli (Live)'} (
							{lessons.filter(l => checkStatus(l) === 'live').length})
						</TabsTrigger>
						<TabsTrigger
							value='upcoming'
							className='rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 gap-2 text-sm'
						>
							<Calendar className='w-4 h-4 text-muted-foreground' />
							{t('dashboard.upcomingLessons') || 'Kelasi Darslar'} (
							{lessons.filter(l => checkStatus(l) === 'upcoming').length})
						</TabsTrigger>
						<TabsTrigger
							value='completed'
							className='rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 gap-2 text-sm'
						>
							<ClipboardList className='w-4 h-4 text-muted-foreground' />
							{t('dashboard.completedLessons') || "O'tgan Darslar"} (
							{lessons.filter(l => checkStatus(l) === 'completed').length})
						</TabsTrigger>
					</TabsList>
				</div>

				{['live', 'upcoming', 'completed'].map(tab => (
					<TabsContent
						key={tab}
						value={tab}
						className='m-0 pt-6 focus-visible:outline-none'
					>
						<DataTable
							columns={columns}
							data={tabLessons}
							isLoading={isLoading}
							searchPlaceholder={
								t('dashboard.searchLessonsPlaceholder') ||
								'Dars nomi yoki ustoz ismini qidirish...'
							}
							searchKey={row => `${row.title} ${row.mentorSearch}`}
							onRowClick={
								tab === 'live'
									? row => router.push(`/student/courses/${row.id}/watch`)
									: undefined
							}
							emptyProps={{
								title: t('common.noResults') || 'Darslar topilmadi',
								description:
									t('dashboard.noLessonsFound') ||
									"Bu bo'limda hech qanday dars mavjud emas.",
							}}
						/>
					</TabsContent>
				))}
			</Tabs>
		</div>
	)
}

// Suspense Layout (Next.js qoidasi)
export default function StudentLessonsPage() {
	return (
		<Suspense fallback={<LoadingSpinner fullScreen />}>
			<StudentLessonsContent />
		</Suspense>
	)
}
