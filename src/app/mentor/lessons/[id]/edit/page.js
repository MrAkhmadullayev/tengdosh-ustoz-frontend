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
// 🔥 Markazlashgan utilitalar va xato formatterlar
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
	Save,
	Users,
	Video,
} from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner' // 🔥 Toast import qilindi

// ==========================================
// 🚀 ASOSIY KOMPONENT
// ==========================================
export default function EditMentorLessonPage() {
	const { id } = useParams()
	const router = useRouter()

	const [isLoading, setIsLoading] = useState(false)
	const [isDataLoading, setIsDataLoading] = useState(true)

	const [formData, setFormData] = useState({
		title: '',
		date: '',
		time: '',
		format: 'online',
		description: '',
		roomNumber: '',
		maxStudents: '100',
		allowComments: true,
		status: 'upcoming',
	})

	// 1. API dan ma'lumotlarni yuklash
	const fetchLesson = useCallback(async () => {
		try {
			setIsDataLoading(true)
			const res = await api.get(`/mentor/lessons/${id}`)
			if (res?.data?.success) {
				const l = res.data.lesson
				setFormData({
					title: l.title || '',
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
					"Dars ma'lumotlarini yuklashda xatolik yuz berdi.",
				),
			)
		} finally {
			setIsDataLoading(false)
		}
	}, [id])

	useEffect(() => {
		if (id) fetchLesson()
	}, [fetchLesson, id])

	// 2. Inputlarni boshqarish (Optimallashtirilgan)
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

	// 3. O'zgarishlarni Saqlash
	const handleSave = async e => {
		e.preventDefault()

		if (!formData.title || !formData.date || !formData.time) {
			toast.warning('Iltimos, dars mavzusi, sanasi va vaqtini kiriting.')
			return
		}

		if (
			(formData.format === 'offline' || formData.format === 'hybrid') &&
			!formData.roomNumber
		) {
			toast.warning('Offline darslar uchun xona raqamini kiritish shart.')
			return
		}

		setIsLoading(true)
		try {
			// Backend Number qabul qiladi
			const payload = {
				...formData,
				maxStudents: Number(formData.maxStudents) || 100,
			}

			const res = await api.put(`/mentor/lessons/${id}`, payload)

			if (res?.data?.success) {
				toast.success("O'zgarishlar muvaffaqiyatli saqlandi!")
				router.push('/mentor/lessons')
				router.refresh()
			}
		} catch (error) {
			toast.error(getErrorMessage(error, 'Darsni saqlashda xatolik yuz berdi.'))
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
		<div className='max-w-5xl mx-auto space-y-6 pb-12 pt-6 px-4 sm:px-6 w-full'>
			{/* 🏷️ HEADER */}
			<div className='flex items-center gap-4 border-b pb-6'>
				<Button variant='outline' size='icon' className='shrink-0' asChild>
					<Link href='/mentor/lessons'>
						<ArrowLeft className='h-4 w-4' />
					</Link>
				</Button>
				<div>
					<h1 className='text-2xl font-bold tracking-tight'>
						Darsni Tahrirlash
					</h1>
					<p className='text-muted-foreground text-sm mt-1'>
						Darsingiz qoidasi, mavzusi yoki joylashuvini o'zgartirish
					</p>
				</div>
			</div>

			<form
				onSubmit={handleSave}
				className='grid grid-cols-1 lg:grid-cols-3 gap-6 items-start'
			>
				{/* ========================================== */}
				{/* ASOSIY FORMA (Chap qism) */}
				{/* ========================================== */}
				<div className='lg:col-span-2 space-y-6'>
					<Card>
						<CardHeader>
							<div className='flex items-center gap-2'>
								<BookOpen className='w-5 h-5 text-muted-foreground' />
								<CardTitle className='text-lg'>Asosiy ma'lumotlar</CardTitle>
							</div>
							<CardDescription>
								O'quvchilarga ko'rinadigan darsning nomi va tavsifi.
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='space-y-2'>
								<Label htmlFor='title'>
									Dars mavzusi <span className='text-destructive'>*</span>
								</Label>
								<Input
									id='title'
									placeholder="Masalan: JavaScript dagi closure'lar"
									value={formData.title}
									onChange={e => handleChange('title', e.target.value)}
								/>
							</div>

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

							<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<Label className='flex items-center gap-1.5'>
										<Users className='w-4 h-4 text-muted-foreground' /> Limit
										(O'quvchilar soni)
									</Label>
									<Input
										type='number'
										placeholder='Masalan: 100'
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

							{(formData.format === 'offline' ||
								formData.format === 'hybrid') && (
								<div className='space-y-2 pt-2'>
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
								</div>
							)}
						</CardContent>
					</Card>
				</div>

				{/* ========================================== */}
				{/* YON PANEL (Vaqt va Sana) */}
				{/* ========================================== */}
				<div className='space-y-6 lg:sticky lg:top-24'>
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
											className='font-medium text-primary'
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
											className='font-medium text-green-600 dark:text-green-500'
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

						<CardFooter>
							<Button
								type='submit'
								className='w-full font-semibold'
								disabled={
									isLoading ||
									!formData.title ||
									!formData.date ||
									!formData.time
								}
							>
								{isLoading ? (
									<Loader2 className='mr-2 h-4 w-4 animate-spin' />
								) : (
									<Save className='mr-2 h-4 w-4' />
								)}
								O'zgarishlarni Saqlash
							</Button>
						</CardFooter>
					</Card>
				</div>
			</form>
		</div>
	)
}
