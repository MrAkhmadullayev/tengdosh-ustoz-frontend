'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { PageHeader } from '@/components/ui/page-header'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import api from '@/lib/api'
import { useTranslation } from '@/lib/i18n'
// 🔥 Markazlashgan utilitalar chaqirildi
import { formatPhone, getErrorMessage, getInitials } from '@/lib/utils'
import { motion } from 'framer-motion'
import { BookOpen, GraduationCap, Mail, Phone, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner' // 🔥 Toast ishlatamiz

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
function MentorStudentsContent() {
	const router = useRouter()
	const { t } = useTranslation()

	const [students, setStudents] = useState([])
	const [isLoading, setIsLoading] = useState(true)

	// 1. API dan ma'lumot yuklash
	const fetchStudents = useCallback(async () => {
		try {
			setIsLoading(true)
			const res = await api.get('/mentor/students')
			if (res?.data?.success) {
				const mapped = res.data.students.map((s, idx) => ({
					...s,
					id: s._id || s.id, // Xavfsiz ID
					index: idx + 1,
					fullName:
						`${s.firstName || ''} ${s.lastName || ''}`.trim() || "Noma'lum",
					phoneNumber: s.phoneNumber || '',
				}))
				setStudents(mapped)
			}
		} catch (error) {
			toast.error(
				getErrorMessage(
					error,
					t('errors.fetchFailed') || 'Talabalarni yuklashda xatolik',
				),
			)
		} finally {
			setIsLoading(false)
		}
	}, [t])

	useEffect(() => {
		fetchStudents()
	}, [fetchStudents])

	// 2. Xabar yozish
	const handleMessageClick = useCallback(
		studentId => {
			if (!studentId) return
			sessionStorage.setItem('selectedContact', studentId)
			router.push('/users/messages')
		},
		[router],
	)

	// 3. Jadval ustunlari (Toza Shadcn uslubi)
	const columns = useMemo(
		() => [
			{
				header: 'T/R',
				key: 'index',
				headerClassName: 'w-[60px]',
				cellClassName: 'font-medium text-muted-foreground',
			},
			{
				header: t('sidebar.students') || 'Talaba F.I.O',
				render: row => (
					<div className='flex items-center gap-3'>
						<Avatar className='h-9 w-9 border shadow-sm'>
							<AvatarFallback className='bg-primary/5 text-primary text-xs font-bold uppercase'>
								{getInitials(row.firstName, row.lastName)}
							</AvatarFallback>
						</Avatar>
						<div>
							<p className='font-semibold text-foreground leading-none mb-1'>
								{row.fullName}
							</p>
							<p className='text-xs text-muted-foreground font-medium md:hidden mt-1'>
								{row.course || t('common.notEntered')} •{' '}
								{row.group || t('common.notEntered')}
							</p>
						</div>
					</div>
				),
			},
			{
				header: t('mentors.phone') || 'Aloqa',
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
							{t('common.notEntered')}
						</span>
					),
			},
			{
				header: t('mentors.group') || "O'quv bosqichi / Guruh",
				headerClassName: 'hidden md:table-cell',
				cellClassName: 'hidden md:table-cell',
				render: row => (
					<div className='flex flex-wrap items-center gap-2'>
						<Badge
							variant='outline'
							className='font-medium bg-muted/50 text-foreground'
						>
							{row.course || t('common.notEntered')}
						</Badge>
						<Badge
							variant='secondary'
							className='font-medium bg-muted/50 text-foreground'
						>
							{row.group || t('common.notEntered')}
						</Badge>
					</div>
				),
			},
			{
				header: t('dashboard.attended') || 'Qatnashishi',
				headerClassName: 'text-center',
				cellClassName: 'text-center',
				render: row => (
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Badge
									variant='secondary'
									className='font-medium cursor-help flex items-center gap-1.5 mx-auto w-fit bg-primary/10 text-primary hover:bg-primary/20 transition-colors shadow-none border-transparent'
								>
									<BookOpen className='h-3.5 w-3.5' />
									{row.lessonsAttended || 0} ta dars
								</Badge>
							</TooltipTrigger>
							<TooltipContent>
								{t('dashboard.attendanceDesc') ||
									"Umumiy ro'yxatdan o'tgan yoki qatnashgan darslar soni"}
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				),
			},
			{
				header: t('common.actions') || 'Harakatlar',
				headerClassName: 'text-right',
				cellClassName: 'text-right',
				render: row => (
					<Button
						size='sm'
						variant='outline'
						className='gap-2 font-medium'
						onClick={e => {
							e.stopPropagation()
							handleMessageClick(row.id)
						}}
					>
						<Mail className='h-4 w-4' />
						<span className='hidden sm:inline'>
							{t('dashboard.sendMessage') || 'Xabar yozish'}
						</span>
					</Button>
				),
			},
		],
		[t, handleMessageClick],
	)

	return (
		<motion.div
			variants={containerVariants}
			initial='hidden'
			animate='show'
			className='space-y-6 max-w-7xl mx-auto pb-12 pt-6 px-4 sm:px-6'
		>
			{/* 🏷️ HEADER */}
			<PageHeader
				title={
					<span className='flex items-center gap-3'>
						<GraduationCap className='h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground' />
						{t('sidebar.students') || "Mening O'quvchilarim"}
					</span>
				}
				description={
					t('dashboard.myStudentsDesc') ||
					"Sizning darslaringizga yozilgan va qatnashgan barcha talabalar ro'yxati."
				}
			/>

			{/* 📊 QISQACHA STATISTIKA */}
			{!isLoading && (
				<motion.div
					variants={itemVariants}
					className='flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4'
				>
					<Badge
						variant='secondary'
						className='px-3 py-1.5 text-sm font-medium flex items-center gap-2 w-fit'
					>
						<Users className='h-4 w-4 text-muted-foreground' />
						{t('common.all') || 'Jami'}: {students.length} ta
					</Badge>
				</motion.div>
			)}

			{/* 🗂️ JADVAL */}
			<motion.div variants={itemVariants}>
				<DataTable
					columns={columns}
					data={students}
					isLoading={isLoading}
					searchPlaceholder={
						t('dashboard.searchStudentPlaceholder') ||
						"Ism, telefon yoki kurs bo'yicha qidiruv..."
					}
					searchKey={row =>
						`${row.fullName} ${row.course} ${row.group} ${row.phoneNumber}`
					}
					emptyProps={{
						title: t('common.noResults') || 'Talaba topilmadi',
						description:
							t('dashboard.noStudentsFound') ||
							"Sizning darslaringizga hali hech kim yozilmagan yoki qidiruvga mos talaba yo'q.",
					}}
				/>
			</motion.div>
		</motion.div>
	)
}

// Suspense Layout (Next.js qoidasi)
export default function MentorStudentsPage() {
	return (
		<Suspense fallback={<LoadingSpinner fullScreen />}>
			<MentorStudentsContent />
		</Suspense>
	)
}
