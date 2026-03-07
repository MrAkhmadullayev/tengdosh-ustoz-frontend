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
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { uz } from 'date-fns/locale'
import {
	ArrowLeft,
	Calendar as CalendarIcon,
	Clock,
	Loader2,
	MessagesSquare,
	Rocket,
	Video,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

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

	const handleSave = async () => {
		if (!formData.title || !formData.date || !formData.time) {
			return alert('Iltimos, dars mavzusi, sanasi va vaqtini kiriting')
		}

		setIsLoading(true)
		try {
			const res = await api.post('/mentor/lessons', formData)
			if (res.data.success) {
				alert(res.data.message)
				router.push('/mentor/lessons')
			}
		} catch (error) {
			console.error(error)
			alert(error.response?.data?.message || 'Xatolik yuz berdi')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className='max-w-4xl mx-auto space-y-6 pb-12 w-full'>
			{/* HEADER */}
			<div className='flex items-center gap-4'>
				<Button
					variant='ghost'
					size='icon'
					onClick={() => router.push('/mentor/lessons')}
					className='rounded-full hover:bg-muted'
				>
					<ArrowLeft className='h-5 w-5' />
				</Button>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>
						Yangi Dars Yaratish
					</h1>
					<p className='text-muted-foreground text-sm mt-1'>
						Ushbu dars bot orqali o'quvchilarga e'lon qilinadi.
					</p>
				</div>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				{/* ASOSIY FORMA */}
				<div className='md:col-span-2 space-y-6'>
					<Card className='shadow-sm border-muted overflow-hidden'>
						<CardHeader className='bg-muted/30 border-b pb-5'>
							<CardTitle className='text-lg'>Asosiy ma'lumotlar</CardTitle>
							<CardDescription>
								O'quvchilar ko'radigan asosiy dars tavsifi. Jadvallingiz botga
								yuboriladi.
							</CardDescription>
						</CardHeader>
						<CardContent className='p-6 space-y-6'>
							<div className='space-y-4'>
								<div className='space-y-2'>
									<Label>
										Dars mavzusi <span className='text-red-500'>*</span>
									</Label>
									<Input
										placeholder="Masalan: JavaScript dagi closure'lar"
										value={formData.title}
										onChange={e =>
											setFormData({ ...formData, title: e.target.value })
										}
										className='bg-background focus-visible:ring-primary/20'
									/>
								</div>

								<div className='space-y-2'>
									<Label>Dars haqida batafsil ma'lumot</Label>
									<Textarea
										placeholder="Bu dars nima haqida bo'ladi va nimalar o'rganiladi?"
										className='min-h-[120px] bg-background resize-none focus-visible:ring-primary/20'
										value={formData.description}
										onChange={e =>
											setFormData({ ...formData, description: e.target.value })
										}
									/>
								</div>

								<div className='grid grid-cols-1 gap-4'>
									<div className='space-y-2'>
										<Label>Maksimal o'quvchilar soni (Limit)</Label>
										<Input
											type='number'
											placeholder='Odatiy: 100'
											value={formData.maxStudents}
											onChange={e =>
												setFormData({
													...formData,
													maxStudents: e.target.value,
												})
											}
											className='bg-background max-w-xs'
										/>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className='shadow-sm border-muted overflow-hidden'>
						<CardHeader className='bg-muted/30 border-b pb-5'>
							<CardTitle className='text-lg flex items-center gap-2'>
								<Video className='w-5 h-5 text-blue-500' /> Translatsiya va
								Manzil sozlamalari
							</CardTitle>
						</CardHeader>
						<CardContent className='p-6 space-y-6'>
							<div className='space-y-2'>
								<Label>Dars qay formatda o'tiladi?</Label>
								<Select
									value={formData.format}
									onValueChange={v => setFormData({ ...formData, format: v })}
								>
									<SelectTrigger className='bg-background max-w-xs'>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='online'>
											Online (Platformada / Zoom)
										</SelectItem>
										<SelectItem value='offline'>Offline (Markazda)</SelectItem>
										<SelectItem value='hybrid'>
											Online ham, Offline ham (Gibrid)
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className='grid grid-cols-1 gap-6'>
								{(formData.format === 'offline' ||
									formData.format === 'hybrid') && (
									<div className='space-y-2'>
										<Label>
											Xona raqami / Nomi <span className='text-red-500'>*</span>
										</Label>
										<Input
											placeholder='Masalan: 401-xona, Google xonasi'
											value={formData.roomNumber}
											onChange={e =>
												setFormData({ ...formData, roomNumber: e.target.value })
											}
											className='bg-background'
										/>
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* YON PANEL (VAQT VA SANA) */}
				<div className='space-y-6'>
					<Card className='shadow-sm border-muted overflow-hidden'>
						<CardHeader className='bg-muted/30 border-b p-4'>
							<CardTitle className='text-base'>Vaqt va Format</CardTitle>
						</CardHeader>
						<CardContent className='p-4 space-y-5 flex flex-col'>
							<div className='space-y-2 flex flex-col'>
								<Label className='flex items-center gap-2'>
									<CalendarIcon className='w-4 h-4 text-muted-foreground' />{' '}
									Sana <span className='text-red-500'>*</span>
								</Label>
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant={'outline'}
											className={cn(
												'w-full justify-start text-left font-normal bg-background',
												!formData.date && 'text-muted-foreground',
											)}
										>
											{formData.date ? (
												format(new Date(formData.date), 'PPP', { locale: uz })
											) : (
												<span>Sanani tanlang</span>
											)}
										</Button>
									</PopoverTrigger>
									<PopoverContent className='w-auto p-0' align='start'>
										<Calendar
											mode='single'
											selected={
												formData.date ? new Date(formData.date) : undefined
											}
											onSelect={d =>
												setFormData({
													...formData,
													date: d ? format(d, 'yyyy-MM-dd') : '',
												})
											}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
							</div>

							<div className='space-y-2'>
								<Label className='flex items-center gap-2'>
									<Clock className='w-4 h-4 text-muted-foreground' /> Soat{' '}
									<span className='text-red-500'>*</span>
								</Label>
								<div className='grid grid-cols-2 gap-2'>
									<Select
										value={formData.time?.split(':')[0] || ''}
										onValueChange={h =>
											setFormData({
												...formData,
												time: `${h}:${formData.time?.split(':')[1] || '00'}`,
											})
										}
									>
										<SelectTrigger className='bg-background'>
											<SelectValue placeholder='Soat' />
										</SelectTrigger>
										<SelectContent>
											{Array.from({ length: 24 }).map((_, i) => {
												const hour = i.toString().padStart(2, '0')
												return (
													<SelectItem key={hour} value={hour}>
														{hour}
													</SelectItem>
												)
											})}
										</SelectContent>
									</Select>
									<Select
										value={formData.time?.split(':')[1] || ''}
										onValueChange={m =>
											setFormData({
												...formData,
												time: `${formData.time?.split(':')[0] || '15'}:${m}`,
											})
										}
									>
										<SelectTrigger className='bg-background'>
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

							<div className='border-t border-border/50 my-2' />

							<div className='flex items-center justify-between gap-4'>
								<div className='space-y-0.5'>
									<Label
										className='text-sm flex items-center gap-1.5 cursor-pointer'
										htmlFor='comments-toggle'
									>
										<MessagesSquare className='w-4 h-4 text-muted-foreground' />{' '}
										Izohlar (Sharhlar)
									</Label>
									<p className='text-[12px] text-muted-foreground leading-tight'>
										O'quvchilarga muhokama uchun ruxsat
									</p>
								</div>
								<Switch
									id='comments-toggle'
									checked={formData.allowComments}
									onCheckedChange={c =>
										setFormData({ ...formData, allowComments: c })
									}
								/>
							</div>
						</CardContent>
						<CardFooter className='p-4 pt-0'>
							<Button
								className='w-full gap-2 font-medium'
								size='lg'
								onClick={handleSave}
								disabled={
									isLoading ||
									!formData.title ||
									!formData.date ||
									!formData.time
								}
							>
								{isLoading ? (
									<Loader2 className='h-4 w-4 animate-spin' />
								) : (
									<Rocket className='h-4 w-4' />
								)}
								Yaratish va E'lon qilish
							</Button>
						</CardFooter>
					</Card>
				</div>
			</div>
		</div>
	)
}
