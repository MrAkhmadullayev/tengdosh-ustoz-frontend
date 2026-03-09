'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import api from '@/lib/api'
import { useTranslation } from '@/lib/i18n'
// 🔥 Markazlashgan utilitalar
import { cn, getErrorMessage } from '@/lib/utils'
import { format } from 'date-fns'
import { uz } from 'date-fns/locale'
import { motion } from 'framer-motion'
import {
	ArrowLeft,
	BookOpen,
	Calendar as CalendarIcon,
	Clock,
	Loader2,
	MapPin,
	MessagesSquare,
	Save,
	Users,
	Video,
} from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
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
// 🚀 ASOSIY KOMPONENT
// ==========================================
export default function EditLessonPage() {
	const { id } = useParams()
	const router = useRouter()
	const { t } = useTranslation()

	const [isLoading, setIsLoading] = useState(false)
	const [isDataLoading, setIsDataLoading] = useState(true)
	const [mentors, setMentors] = useState([])

	// Form holati
	const [formData, setFormData] = useState({
		title: '',
		mentor: '',
		date: '',
		time: '',
		format: 'online',
		description: '',
		roomNumber: '',
		maxStudents: '100',
		allowComments: true,
		status: 'upcoming',
	})

	// 1. API dan ma'lumotlarni yuklash (Parallel request)
	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsDataLoading(true)
				const [mentorRes, lessonRes] = await Promise.all([
					api.get('/admin/lessons/mentors'),
					api.get(`/admin/lessons/${id}`),
				])

				if (mentorRes?.data?.success) {
					// 🔥 CRASH FIX: Mentorlar ID sini string qilish va formatlash
					const safeMentors = mentorRes.data.mentors.map(m => ({
						id: String(m._id || m.id),
						name:
							m.name ||
							`${m.firstName || ''} ${m.lastName || ''}`.trim() ||
							"Noma'lum Mentor",
					}))
					setMentors(safeMentors)
				}

				if (lessonRes?.data?.success) {
					const l = lessonRes.data.lesson
					setFormData({
						title: l.title || '',
						mentor: String(l.mentor?._id || l.mentor || ''), // 🔥 Mentor ID string bo'lishi shart
						date: l.date ? new Date(l.date).toISOString().split('T')[0] : '',
						time: l.time || '',
						format: l.format || 'online',
						description: l.description || '',
						roomNumber: l.roomNumber || '',
						maxStudents: l.maxStudents?.toString() || '100',
						allowComments: l.allowComments ?? true,
						status: l.status || 'upcoming',
					})
				}
			} catch (error) {
				toast.error(
					getErrorMessage(
						error,
						t('errors.fetchFailed') || "Ma'lumotlarni yuklashda xatolik",
					),
				)
			} finally {
				setIsDataLoading(false)
			}
		}

		if (id) fetchData()
	}, [id, t])

	// 2. Input o'zgarishlarini kuzatish
	const handleChange = useCallback((field, value) => {
		setFormData(prev => ({ ...prev, [field]: value }))
	}, [])

	const handleTimeChange = useCallback((type, value) => {
		setFormData(prev => {
			const currentHours = prev.time?.split(':')[0] || '15'
			const currentMinutes = prev.time?.split(':')[1] || '00'
			return {
				...prev,
				time:
					type === 'hour'
						? `${value}:${currentMinutes}`
						: `${currentHours}:${value}`,
			}
		})
	}, [])

	// 3. Formni yuborish (Saqlash)
	const handleSave = async e => {
		if (e) e.preventDefault()

		if (
			!formData.title ||
			!formData.date ||
			!formData.time ||
			!formData.mentor
		) {
			toast.warning(
				t('errors.fillRequiredFields') ||
					"Barcha majburiy maydonlarni to'ldiring.",
			)
			return
		}

		if (
			(formData.format === 'offline' || formData.format === 'hybrid') &&
			!formData.roomNumber
		) {
			toast.warning(
				t('errors.roomRequired') ||
					'Offline darslar uchun xona raqamini kiritish shart.',
			)
			return
		}

		setIsLoading(true)
		try {
			// 🔥 CRASH FIX: maxStudents string emas, raqam bo'lishi shart!
			const payload = {
				...formData,
				maxStudents: Number(formData.maxStudents) || 100,
			}

			const res = await api.put(`/admin/lessons/${id}`, payload)

			if (res?.data?.success) {
				toast.success(
					t('common.updateSuccess') || "O'zgarishlar muvaffaqiyatli saqlandi!",
				)
				router.push('/admin/lessons')
				router.refresh()
			}
		} catch (error) {
			toast.error(
				getErrorMessage(
					error,
					t('errors.updateFailed') || 'Saqlashda xatolik yuz berdi',
				),
			)
		} finally {
			setIsLoading(false)
		}
	}

	// 4. UI: Loading Skeleton
	if (isDataLoading) {
		return (
			<div className='max-w-5xl mx-auto space-y-6 pt-6 pb-20 px-4 sm:px-6 animate-pulse'>
				<div className='flex items-center gap-4 border-b pb-4'>
					<Skeleton className='h-10 w-10 rounded-full' />
					<div className='space-y-2'>
						<Skeleton className='h-8 w-64' />
						<Skeleton className='h-4 w-32' />
					</div>
				</div>
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
					<div className='lg:col-span-2 space-y-6'>
						<Skeleton className='h-[400px] w-full rounded-xl' />
						<Skeleton className='h-[250px] w-full rounded-xl' />
					</div>
					<Skeleton className='h-[500px] w-full rounded-xl' />
				</div>
			</div>
		)
	}

	// 5. UI: Asosiy Forma
	return (
		<motion.div
			variants={containerVariants}
			initial='hidden'
			animate='show'
			className='max-w-5xl mx-auto space-y-6 pb-24 pt-6 px-4 sm:px-6 w-full'
		>
			{/* 🏷️ HEADER */}
			<motion.div
				variants={itemVariants}
				className='flex items-center gap-4 border-b pb-4'
			>
				<Button variant='outline' size='icon' asChild>
					<Link href='/admin/lessons'>
						<ArrowLeft className='h-4 w-4' />
					</Link>
				</Button>
				<div>
					<h1 className='text-2xl font-bold tracking-tight'>
						{t('dashboard.editLesson') || 'Darsni Tahrirlash'}
					</h1>
					<p className='text-muted-foreground text-sm font-mono mt-0.5'>
						ID: {id}
					</p>
				</div>
			</motion.div>

			<form
				onSubmit={handleSave}
				className='grid grid-cols-1 lg:grid-cols-3 gap-6 items-start'
			>
				{/* ========================================== */}
				{/* ASOSIY FORMA (Chap tomon) */}
				{/* ========================================== */}
				<div className='lg:col-span-2 space-y-6'>
					<motion.div variants={itemVariants}>
						<Card>
							<CardHeader>
								<div className='flex items-center gap-2'>
									<BookOpen className='w-5 h-5 text-muted-foreground' />
									<CardTitle className='text-lg'>
										{t('mentors.basicInfo') || "Asosiy ma'lumotlar"}
									</CardTitle>
								</div>
								<CardDescription>
									Darsning nomi va o'quvchilarga ko'rinadigan tavsifi.
								</CardDescription>
							</CardHeader>
							<CardContent className='space-y-4'>
								{/* Dars Mavzusi */}
								<div className='space-y-2'>
									<Label htmlFor='title'>
										{t('dashboard.lessonName') || 'Dars mavzusi'}{' '}
										<span className='text-destructive'>*</span>
									</Label>
									<Input
										id='title'
										placeholder='Mavzuni kiriting...'
										value={formData.title}
										onChange={e => handleChange('title', e.target.value)}
									/>
								</div>

								{/* Dars haqida ma'lumot */}
								<div className='space-y-2'>
									<Label htmlFor='description'>Batafsil ma'lumot</Label>
									<Textarea
										id='description'
										placeholder='Dars haqida qisqacha...'
										className='min-h-[120px] resize-y'
										value={formData.description}
										onChange={e => handleChange('description', e.target.value)}
									/>
								</div>

								{/* Mentor va Limit */}
								<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
									<div className='space-y-2'>
										<Label>
											Mentor <span className='text-destructive'>*</span>
										</Label>
										<Select
											value={formData.mentor}
											onValueChange={v => handleChange('mentor', v)}
										>
											<SelectTrigger>
												<SelectValue placeholder='Mentorni tanlang' />
											</SelectTrigger>
											<SelectContent>
												{mentors.length > 0 ? (
													mentors.map(m => (
														<SelectItem key={m.id} value={m.id}>
															{m.name}
														</SelectItem>
													))
												) : (
													<div className='p-2 text-sm text-muted-foreground text-center'>
														Mentorlar topilmadi
													</div>
												)}
											</SelectContent>
										</Select>
									</div>

									<div className='space-y-2'>
										<Label className='flex items-center gap-1.5'>
											<Users className='w-4 h-4 text-muted-foreground' /> Limit
											(O'quvchilar soni)
										</Label>
										<Input
											type='number'
											placeholder='Masalan: 100'
											value={formData.maxStudents}
											onChange={e =>
												handleChange('maxStudents', e.target.value)
											}
											min='1'
										/>
									</div>
								</div>
							</CardContent>
						</Card>
					</motion.div>

					<motion.div variants={itemVariants}>
						<Card>
							<CardHeader>
								<div className='flex items-center gap-2'>
									<Video className='w-5 h-5 text-muted-foreground' />
									<CardTitle className='text-lg'>
										Translatsiya va Manzil
									</CardTitle>
								</div>
							</CardHeader>
							<CardContent className='space-y-4'>
								{/* Formatni tanlash */}
								<div className='space-y-2'>
									<Label>Dars formati</Label>
									<Select
										value={formData.format}
										onValueChange={v => handleChange('format', v)}
									>
										<SelectTrigger className='sm:max-w-xs'>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='online'>
												🌐 Online (Platformada)
											</SelectItem>
											<SelectItem value='offline'>
												🏢 Offline (Markazda)
											</SelectItem>
											<SelectItem value='hybrid'>
												🔄 Gibrid (Ikkalasi ham)
											</SelectItem>
										</SelectContent>
									</Select>
								</div>

								{/* Manzil (Faqat Offline va Hybrid uchun) */}
								{(formData.format === 'offline' ||
									formData.format === 'hybrid') && (
									<motion.div
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										className='space-y-2 pt-2'
									>
										<Label className='flex items-center gap-1.5'>
											<MapPin className='w-4 h-4 text-muted-foreground' /> Xona
											nomi/raqami <span className='text-destructive'>*</span>
										</Label>
										<Input
											placeholder='Masalan: 401-xona'
											value={formData.roomNumber}
											onChange={e => handleChange('roomNumber', e.target.value)}
											className='sm:max-w-xs'
										/>
									</motion.div>
								)}
							</CardContent>
						</Card>
					</motion.div>
				</div>

				{/* ========================================== */}
				{/* YON PANEL (VAQT VA SANA - O'ng tomon) */}
				{/* ========================================== */}
				<div className='space-y-6 lg:sticky lg:top-24'>
					<motion.div variants={itemVariants}>
						<Card>
							<CardHeader>
								<div className='flex items-center gap-2'>
									<Clock className='w-4 h-4 text-muted-foreground' />
									<CardTitle className='text-base'>Holat va Vaqt</CardTitle>
								</div>
							</CardHeader>
							<CardContent className='space-y-4'>
								{/* Dars Holati */}
								<div className='space-y-2'>
									<Label>Dars Holati</Label>
									<Select
										value={formData.status}
										onValueChange={v => handleChange('status', v)}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem
												value='upcoming'
												className='font-medium text-blue-600 dark:text-blue-400'
											>
												Keladigan
											</SelectItem>
											<SelectItem
												value='live'
												className='font-bold text-destructive'
											>
												Jonli (Live)
											</SelectItem>
											<SelectItem
												value='completed'
												className='font-medium text-green-600 dark:text-green-400'
											>
												Tugallangan
											</SelectItem>
										</SelectContent>
									</Select>
								</div>

								{/* Sana Popover */}
								<div className='space-y-2 flex flex-col'>
									<Label className='flex items-center gap-2'>
										<CalendarIcon className='w-4 h-4 text-muted-foreground' />{' '}
										Sana <span className='text-destructive'>*</span>
									</Label>
									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant='outline'
												className={cn(
													'w-full justify-start text-left font-normal',
													!formData.date && 'text-muted-foreground',
												)}
											>
												<CalendarIcon className='mr-2 h-4 w-4' />
												{formData.date ? (
													format(new Date(formData.date), 'PPP', { locale: uz })
												) : (
													<span>Sanani tanlang</span>
												)}
											</Button>
										</PopoverTrigger>
										<PopoverContent className='w-auto p-0' align='center'>
											<Calendar
												mode='single'
												selected={
													formData.date ? new Date(formData.date) : undefined
												}
												onSelect={d =>
													handleChange('date', d ? format(d, 'yyyy-MM-dd') : '')
												}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
								</div>

								{/* Vaqt (Soat:Daqiqa) */}
								<div className='space-y-2'>
									<Label className='flex items-center gap-2'>
										<Clock className='w-4 h-4 text-muted-foreground' /> Soat{' '}
										<span className='text-destructive'>*</span>
									</Label>
									<div className='grid grid-cols-2 gap-3'>
										<Select
											value={formData.time?.split(':')[0] || ''}
											onValueChange={v => handleTimeChange('hour', v)}
										>
											<SelectTrigger>
												<SelectValue placeholder='Soat' />
											</SelectTrigger>
											<SelectContent className='max-h-[200px]'>
												{Array.from({ length: 24 }).map((_, i) => {
													const h = i.toString().padStart(2, '0')
													return (
														<SelectItem key={h} value={h}>
															{h}:00
														</SelectItem>
													)
												})}
											</SelectContent>
										</Select>

										<Select
											value={formData.time?.split(':')[1] || ''}
											onValueChange={v => handleTimeChange('minute', v)}
										>
											<SelectTrigger>
												<SelectValue placeholder='Min' />
											</SelectTrigger>
											<SelectContent>
												{['00', '15', '30', '45'].map(m => (
													<SelectItem key={m} value={m}>
														{m}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</div>

								<div className='border-t my-4' />

								{/* Izohlar Switch */}
								<div className='flex items-center justify-between gap-4'>
									<div className='space-y-1'>
										<Label
											htmlFor='comments-toggle'
											className='flex items-center gap-1.5 cursor-pointer font-medium'
										>
											<MessagesSquare className='w-4 h-4 text-muted-foreground' />{' '}
											Izohlar
										</Label>
										<p className='text-xs text-muted-foreground'>
											O'quvchilarga chat ruxsati
										</p>
									</div>
									<Switch
										id='comments-toggle'
										checked={formData.allowComments}
										onCheckedChange={c => handleChange('allowComments', c)}
									/>
								</div>
							</CardContent>

							{/* Saqlash tugmasi */}
							<CardFooter>
								<Button
									type='submit'
									className='w-full font-semibold'
									disabled={
										isLoading ||
										!formData.title ||
										!formData.date ||
										!formData.time ||
										!formData.mentor
									}
								>
									{isLoading && (
										<Loader2 className='mr-2 h-4 w-4 animate-spin' />
									)}
									{!isLoading && <Save className='mr-2 h-4 w-4' />}
									O'zgarishlarni Saqlash
								</Button>
							</CardFooter>
						</Card>
					</motion.div>
				</div>
			</form>
		</motion.div>
	)
}
