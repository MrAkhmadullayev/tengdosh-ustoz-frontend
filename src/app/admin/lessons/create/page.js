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
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import api from '@/lib/api'
import { useTranslation } from '@/lib/i18n'
import { cn, getErrorMessage } from '@/lib/utils'
import { format } from 'date-fns'
import { uz } from 'date-fns/locale'
import {
	ArrowLeft,
	BookOpen,
	Calendar as CalendarIcon,
	Clock,
	Loader2,
	MapPin,
	MessagesSquare,
	Users,
	Video,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

// ==========================================
// 🚀 ASOSIY KOMPONENT
// ==========================================
export default function CreateLessonPage() {
	const router = useRouter()
	const { t } = useTranslation()

	const [isLoading, setIsLoading] = useState(false)
	const [isFetchingMentors, setIsFetchingMentors] = useState(true)
	const [mentors, setMentors] = useState([])

	// Form holati
	const [formData, setFormData] = useState({
		title: '',
		mentor: '',
		date: '',
		time: '',
		format: 'online', // online, offline, hybrid
		description: '',
		roomNumber: '',
		maxStudents: '100',
		allowComments: true,
	})

	// 1. Mentorlarni yuklash
	useEffect(() => {
		const fetchMentors = async () => {
			try {
				setIsFetchingMentors(true)
				const res = await api.get('/admin/lessons/mentors')
				if (res?.data?.success) {
					const safeMentors = res.data.mentors.map(m => ({
						id: String(m._id || m.id),
						name:
							m.name ||
							`${m.firstName || ''} ${m.lastName || ''}`.trim() ||
							"Noma'lum Mentor",
					}))
					setMentors(safeMentors)
				}
			} catch (error) {
				toast.error(
					getErrorMessage(
						error,
						t('errors.fetchFailed') || 'Mentorlarni yuklashda xatolik',
					),
				)
			} finally {
				setIsFetchingMentors(false)
			}
		}
		fetchMentors()
	}, [t])

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
		e.preventDefault()

		if (
			!formData.title ||
			!formData.date ||
			!formData.time ||
			!formData.mentor
		) {
			toast.warning(
				t('errors.fillRequiredFields') ||
					'Iltimos, dars mavzusi, sanasi, vaqti va mentorni kiriting.',
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
			const payload = {
				...formData,
				maxStudents: Number(formData.maxStudents) || 100,
			}

			const res = await api.post('/admin/lessons', payload)

			if (res?.data?.success) {
				toast.success(
					t('dashboard.lessonCreatedSuccess') ||
						'Dars muvaffaqiyatli yaratildi!',
				)
				router.push('/admin/lessons')
				router.refresh()
			}
		} catch (error) {
			toast.error(
				getErrorMessage(
					error,
					t('errors.createFailed') || 'Dars yaratishda xatolik yuz berdi.',
				),
			)
		} finally {
			setIsLoading(false)
		}
	}

	// UI: Asosiy Forma (Sof Shadcn dizaynida)
	return (
		<div className='max-w-5xl mx-auto space-y-6 pb-12 pt-6 px-4 sm:px-6'>
			{/* 🏷️ HEADER */}
			<div className='flex items-center gap-4 border-b pb-4'>
				<Button variant='outline' size='icon' asChild>
					<Link href='/admin/lessons'>
						<ArrowLeft className='h-4 w-4' />
					</Link>
				</Button>
				<div>
					<h1 className='text-2xl font-bold tracking-tight'>
						{t('dashboard.createNewLesson') || "Yangi dars qo'shish"}
					</h1>
					<p className='text-muted-foreground text-sm'>
						Platformaga yangi jonli efir yoki markazda dars belgilash.
					</p>
				</div>
			</div>

			<form
				onSubmit={handleSave}
				className='grid grid-cols-1 lg:grid-cols-3 gap-6 items-start'
			>
				{/* ========================================== */}
				{/* ASOSIY FORMA (Chap tomon) */}
				{/* ========================================== */}
				<div className='lg:col-span-2 space-y-6'>
					<Card>
						<CardHeader>
							<div className='flex items-center gap-2'>
								<BookOpen className='w-5 h-5 text-muted-foreground' />
								<CardTitle className='text-lg'>
									{t('mentors.basicInfo') || "Asosiy ma'lumotlar"}
								</CardTitle>
							</div>
							<CardDescription>
								O'quvchilar ko'radigan asosiy dars tavsifi.
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
									placeholder="Masalan: JavaScript dagi closure'lar"
									value={formData.title}
									onChange={e => handleChange('title', e.target.value)}
								/>
							</div>

							{/* Dars haqida ma'lumot */}
							<div className='space-y-2'>
								<Label htmlFor='description'>
									Dars haqida batafsil ma'lumot
								</Label>
								<Textarea
									id='description'
									placeholder="Bu dars nima haqida bo'ladi va nimalar o'rganiladi?"
									className='min-h-[100px] resize-y'
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
										disabled={isFetchingMentors}
									>
										<SelectTrigger>
											<SelectValue
												placeholder={
													isFetchingMentors
														? 'Yuklanmoqda...'
														: 'Mentorni tanlang'
												}
											/>
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
										placeholder='Odatiy: 100'
										value={formData.maxStudents}
										onChange={e => handleChange('maxStudents', e.target.value)}
										min='1'
									/>
								</div>
							</div>
						</CardContent>
					</Card>

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
								<Label>Dars qay formatda o'tiladi?</Label>
								<Select
									value={formData.format}
									onValueChange={v => handleChange('format', v)}
								>
									<SelectTrigger className='sm:max-w-xs'>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='online'>
											🌐 Online (Platformada / Zoom)
										</SelectItem>
										<SelectItem value='offline'>
											🏢 Offline (Markazda)
										</SelectItem>
										<SelectItem value='hybrid'>
											🔄 Gibrid (Online + Offline)
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/* Manzil (Faqat Offline va Hybrid uchun) */}
							{(formData.format === 'offline' ||
								formData.format === 'hybrid') && (
								<div className='space-y-2 pt-2 animate-in fade-in slide-in-from-top-2'>
									<Label className='flex items-center gap-1.5'>
										<MapPin className='w-4 h-4 text-muted-foreground' /> Xona
										raqami / Nomi <span className='text-destructive'>*</span>
									</Label>
									<Input
										placeholder='Masalan: 401-xona, Google xonasi'
										value={formData.roomNumber}
										onChange={e => handleChange('roomNumber', e.target.value)}
										className='sm:max-w-xs'
									/>
								</div>
							)}
						</CardContent>
					</Card>
				</div>

				{/* ========================================== */}
				{/* YON PANEL (VAQT VA SANA - O'ng tomon) */}
				{/* ========================================== */}
				<div className='space-y-6 lg:sticky lg:top-24'>
					<Card>
						<CardHeader>
							<div className='flex items-center gap-2'>
								<CalendarIcon className='w-4 h-4 text-muted-foreground' />
								<CardTitle className='text-base'>Vaqt va Sana</CardTitle>
							</div>
						</CardHeader>
						<CardContent className='space-y-4'>
							{/* Sana Popover */}
							<div className='space-y-2 flex flex-col'>
								<Label className='flex items-center gap-2'>
									Dars sanasi <span className='text-destructive'>*</span>
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
									Boshlanish vaqti <span className='text-destructive'>*</span>
								</Label>
								<div className='grid grid-cols-2 gap-3'>
									<Select
										value={formData.time?.split(':')[0] || ''}
										onValueChange={v => handleTimeChange('hour', v)}
									>
										<SelectTrigger>
											<Clock className='w-4 h-4 text-muted-foreground mr-2' />
											<SelectValue placeholder='Soat' />
										</SelectTrigger>
										<SelectContent className='max-h-[200px]'>
											{Array.from({ length: 24 }).map((_, i) => {
												const hour = i.toString().padStart(2, '0')
												return (
													<SelectItem key={hour} value={hour}>
														{hour}:00
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
											<SelectValue placeholder='Daqiqa' />
										</SelectTrigger>
										<SelectContent>
											{[
												'00',
												'05',
												'10',
												'15',
												'20',
												'25',
												'30',
												'35',
												'40',
												'45',
												'50',
												'55',
											].map(m => (
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
										className='flex items-center gap-1.5 cursor-pointer'
									>
										<MessagesSquare className='w-4 h-4 text-muted-foreground' />{' '}
										Izohlar qoldirish
									</Label>
									<p className='text-xs text-muted-foreground'>
										O'quvchilarga muhokama ruxsati
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
								className='w-full'
								disabled={
									isLoading ||
									!formData.title ||
									!formData.date ||
									!formData.time ||
									!formData.mentor
								}
							>
								{isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
								{!isLoading && 'Darsni saqlash'}
							</Button>
						</CardFooter>
					</Card>
				</div>
			</form>
		</div>
	)
}
