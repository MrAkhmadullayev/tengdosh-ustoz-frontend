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
// 🔥 Markazlashgan xato tekshirgich
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
	Rocket,
	Users,
	Video,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { toast } from 'sonner' // 🔥 Toast import qilindi

export default function CreateMentorLessonPage() {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)

	const [formData, setFormData] = useState({
		title: '',
		date: '',
		time: '',
		format: 'online',
		description: '',
		roomNumber: '',
		maxStudents: '100',
		allowComments: true,
	})

	// Inputlarni boshqarish (useCallback orqali)
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

	// Darsni saqlash
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
			// Backend (API) Number formatini kutadi
			const payload = {
				...formData,
				maxStudents: Number(formData.maxStudents) || 100,
			}

			const res = await api.post('/mentor/lessons', payload)
			if (res?.data?.success) {
				toast.success(res.data.message || 'Dars muvaffaqiyatli yaratildi!')
				router.push('/mentor/lessons')
				router.refresh()
			}
		} catch (error) {
			toast.error(getErrorMessage(error, 'Dars yaratishda xatolik yuz berdi.'))
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className='max-w-5xl mx-auto space-y-6 pb-12 w-full pt-6 px-4 sm:px-6'>
			{/* 🏷️ HEADER */}
			<div className='flex items-center gap-4 border-b pb-6'>
				<Button variant='outline' size='icon' className='shrink-0' asChild>
					<Link href='/mentor/lessons'>
						<ArrowLeft className='h-4 w-4' />
					</Link>
				</Button>
				<div>
					<h1 className='text-2xl font-bold tracking-tight'>
						Yangi Dars Yaratish
					</h1>
					<p className='text-muted-foreground text-sm mt-1'>
						Ushbu dars bot orqali o'quvchilarga e'lon qilinadi.
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
								O'quvchilar ko'radigan asosiy dars tavsifi. Jadvalingiz botga
								yuboriladi.
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
								<Label htmlFor='description'>
									Dars haqida batafsil ma'lumot
								</Label>
								<Textarea
									id='description'
									placeholder="Bu dars nima haqida bo'ladi va nimalar o'rganiladi?"
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
				{/* YON PANEL (Vaqt va Sana) */}
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
								className='w-full font-medium'
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
									<Rocket className='mr-2 h-4 w-4' />
								)}
								Yaratish va E'lon qilish
							</Button>
						</CardFooter>
					</Card>
				</div>
			</form>
		</div>
	)
}
