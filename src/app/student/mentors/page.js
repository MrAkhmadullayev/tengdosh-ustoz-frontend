'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { PageHeader } from '@/components/ui/page-header'
import api from '@/lib/api'
import { useTranslation } from '@/lib/i18n'
// 🔥 Markazlashgan utilitalar
import { getErrorMessage, getInitials } from '@/lib/utils'
import { motion } from 'framer-motion'
import { BookOpen, ChevronRight, Star, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

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
// 🚀 ASOSIY KOMPONENT
// ==========================================
function StudentMentorsContent() {
	const router = useRouter()
	const { t } = useTranslation()

	const [mentors, setMentors] = useState([])
	const [isLoading, setIsLoading] = useState(true)

	// 1. API dan mentorlarni yuklash
	const fetchMentors = useCallback(async () => {
		try {
			setIsLoading(true)
			const res = await api.get('/student/mentors')
			if (res?.data?.success) {
				const mapped = res.data.mentors.map((m, idx) => ({
					...m,
					id: m._id || m.id, // Xavfsiz ID
					index: idx + 1,
				}))
				setMentors(mapped)
			}
		} catch (error) {
			toast.error(
				getErrorMessage(
					error,
					t('errors.fetchFailed') || 'Mentorlarni yuklashda xatolik yuz berdi',
				),
			)
		} finally {
			setIsLoading(false)
		}
	}, [t])

	useEffect(() => {
		fetchMentors()
	}, [fetchMentors])

	// 2. Jadval ustunlari (Shadcn minimalizmi)
	const columns = useMemo(
		() => [
			{
				header: 'T/R',
				key: 'index',
				headerClassName: 'w-[60px]',
				cellClassName: 'font-medium text-muted-foreground',
			},
			{
				header: t('dashboard.mentor') || 'Mentor',
				headerClassName: 'min-w-[250px]',
				render: row => (
					<div className='flex items-center gap-3'>
						<Avatar className='h-9 w-9 border shadow-sm'>
							<AvatarImage
								src={row.image}
								alt={row.name}
								className='object-cover'
							/>
							<AvatarFallback className='bg-muted text-xs font-bold text-foreground'>
								{getInitials(row.name, '')}
							</AvatarFallback>
						</Avatar>
						<div>
							<p className='font-semibold text-foreground leading-none mb-1 group-hover:text-primary transition-colors'>
								{row.name}
							</p>
							<p className='text-xs text-muted-foreground font-medium truncate max-w-[200px]'>
								{row.specialty || t('common.notEntered')}
							</p>
						</div>
					</div>
				),
			},
			{
				header: t('mentors.rating') || 'Reyting',
				headerClassName: 'text-center whitespace-nowrap',
				cellClassName: 'text-center',
				render: row => (
					<Badge variant='secondary' className='font-medium gap-1 shadow-none'>
						<Star className='h-3.5 w-3.5 text-amber-500 fill-amber-500' />
						{row.rating || t('common.new') || 'Yangi'}
					</Badge>
				),
			},
			{
				header: t('sidebar.students') || "O'quvchilar",
				headerClassName: 'text-center whitespace-nowrap',
				cellClassName: 'text-center',
				render: row => (
					<div className='flex items-center justify-center gap-1.5 text-sm font-medium'>
						<Users className='h-4 w-4 text-muted-foreground' />
						{row.students || 0}
					</div>
				),
			},
			{
				header: t('sidebar.lessons') || 'Darslar',
				headerClassName: 'text-center whitespace-nowrap',
				cellClassName: 'text-center',
				render: row => (
					<div className='flex items-center justify-center gap-1.5 text-sm font-medium'>
						<BookOpen className='h-4 w-4 text-muted-foreground' />
						{row.courses || 0}
					</div>
				),
			},
			{
				header: t('common.actions') || 'Harakatlar',
				headerClassName: 'text-right whitespace-nowrap',
				cellClassName: 'text-right',
				render: row => (
					<Button
						size='sm'
						variant='outline'
						className='gap-1.5 font-medium'
						onClick={e => {
							e.stopPropagation()
							router.push(`/student/mentors/${row.id}`)
						}}
					>
						{t('common.view') || "Ko'rish"} <ChevronRight className='h-4 w-4' />
					</Button>
				),
			},
		],
		[router, t],
	)

	return (
		<motion.div
			variants={containerVariants}
			initial='hidden'
			animate='show'
			className='max-w-7xl mx-auto space-y-6 pb-12 pt-6 px-4 sm:px-6'
		>
			{/* 🏷️ HEADER */}
			<PageHeader
				title={t('mentors.listTitle') || "Mentorlar ro'yxati"}
				description={
					t('mentors.listDesc') ||
					"Sohangiz bo'yicha eng tajribali mutaxassislarni toping va bilim oling."
				}
			/>

			{/* 📊 QISQACHA STATISTIKA */}
			{!isLoading && (
				<motion.div
					variants={itemVariants}
					className='flex flex-col sm:flex-row items-center justify-between border-b pb-4'
				>
					<Badge
						variant='secondary'
						className='px-3 py-1.5 text-sm font-medium'
					>
						{t('common.all') || 'Jami'}: {mentors.length}{' '}
						{t('dashboard.mentor').toLowerCase()}
					</Badge>
				</motion.div>
			)}

			{/* 🗂️ JADVAL */}
			<motion.div variants={itemVariants}>
				<DataTable
					columns={columns}
					data={mentors}
					isLoading={isLoading}
					searchPlaceholder={
						t('dashboard.searchMentorPlaceholder') ||
						'Mentor ismi yoki mutaxassisligi...'
					}
					searchKey={row => `${row.name} ${row.specialty}`}
					onRowClick={row => router.push(`/student/mentors/${row.id}`)}
					emptyProps={{
						title: t('common.noResults') || 'Mentorlar topilmadi',
						description:
							t('dashboard.noMentorsFound') ||
							"Sizning qidiruvingizga mos keladigan mentorlar hozircha ro'yxatda yo'q.",
					}}
				/>
			</motion.div>
		</motion.div>
	)
}

// Suspense Layout (Next.js qoidasi)
export default function StudentMentorsPage() {
	return (
		<Suspense fallback={<LoadingSpinner fullScreen />}>
			<StudentMentorsContent />
		</Suspense>
	)
}
