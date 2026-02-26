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
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { uz } from 'date-fns/locale'
import {
	ArrowLeft,
	Calendar as CalendarIcon,
	Clock,
	Loader2,
	Save,
	Video,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function MentorCreateLessonPage() {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)

	const [formData, setFormData] = useState({
		title: '',
		date: '',
		time: '',
		format: 'online', // online, offline, hybrid
		description: '',
		zoomLink: '',
		roomNumber: '',
		maxStudents: '100',
		allowComments: true,
	})

	const handleSave = () => {
		setIsLoading(true)
		// API Call Simulation
		setTimeout(() => {
			setIsLoading(false)
			router.push('/mentor/schedule')
		}, 600)
	}

	return (
		<div className='max-w-4xl mx-auto space-y-6 pb-12 w-full'>
			{/* HEADER */}
			<div className='flex items-center gap-4'>
				<Button
					variant='ghost'
					size='icon'
					onClick={() => router.push('/mentor/schedule')}
					className='rounded-full hover:bg-muted'
				>
					<ArrowLeft className='h-5 w-5' />
				</Button>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>
						Yangi dars yaratish
					</h1>
					<p className='text-muted-foreground text-sm mt-1'>
						O'quvchilaringiz uchun yangi dars sessiyasini belgilang.
					</p>
				</div>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				<div className='md:col-span-2 space-y-6'>
					<Card className='shadow-sm border-muted overflow-hidden rounded-2xl'>
						<CardHeader className='bg-muted/30 border-b pb-5'>
							<CardTitle className='text-lg'>Dars ma'lumotlari</CardTitle>
							<CardDescription>
								Dars mavzusi va batafsil tavsifini kiriting.
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
										className='bg-background focus-visible:ring-primary/20 rounded-xl h-11'
									/>
								</div>

								<div className='space-y-2'>
									<Label>Tavsif</Label>
									<Textarea
										placeholder='Bu darsda nimalar haqida gaplashamiz?'
										className='min-h-[120px] bg-background resize-none focus-visible:ring-primary/20 rounded-xl'
										value={formData.description}
										onChange={e =>
											setFormData({ ...formData, description: e.target.value })
										}
									/>
								</div>

								<div className='space-y-2'>
									<Label>Maksimal o'quvchilar soni</Label>
									<Input
										type='number'
										min='1'
										placeholder='100'
										value={formData.maxStudents}
										onChange={e =>
											setFormData({
												...formData,
												maxStudents: e.target.value,
											})
										}
										className='bg-background max-w-[150px] h-11 rounded-xl'
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className='shadow-sm border-muted overflow-hidden rounded-2xl'>
						<CardHeader className='bg-muted/30 border-b pb-5'>
							<CardTitle className='text-lg flex items-center gap-2'>
								<Video className='w-5 h-5 text-blue-500' /> Translatsiya
								sozlamalari
							</CardTitle>
						</CardHeader>
						<CardContent className='p-6 space-y-6'>
							<div className='space-y-2'>
								<Label>Dars formati</Label>
								<Select
									value={formData.format}
									onValueChange={v => setFormData({ ...formData, format: v })}
								>
									<SelectTrigger className='bg-background max-w-xs h-11 rounded-xl'>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='online'>Online (Masofaviy)</SelectItem>
										<SelectItem value='offline'>Offline (Markazda)</SelectItem>
										<SelectItem value='hybrid'>Gibrid</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								{(formData.format === 'online' ||
									formData.format === 'hybrid') && (
									<div className='space-y-2'>
										<Label>Zoom/Link</Label>
										<Input
											placeholder='Havolani kiriting'
											value={formData.zoomLink}
											onChange={e =>
												setFormData({ ...formData, zoomLink: e.target.value })
											}
											className='bg-background font-mono text-sm h-11 rounded-xl'
										/>
									</div>
								)}

								{(formData.format === 'offline' ||
									formData.format === 'hybrid') && (
									<div className='space-y-2'>
										<Label>Xona raqami</Label>
										<Input
											placeholder='Masalan: 401'
											value={formData.roomNumber}
											onChange={e =>
												setFormData({ ...formData, roomNumber: e.target.value })
											}
											className='bg-background h-11 rounded-xl'
										/>
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				</div>

				<div className='space-y-6'>
					<Card className='shadow-sm border-muted overflow-hidden rounded-2xl'>
						<CardHeader className='bg-muted/30 border-b p-4'>
							<CardTitle className='text-base'>Vaqt va Sana</CardTitle>
						</CardHeader>
						<CardContent className='p-4 space-y-5'>
							<div className='space-y-2'>
								<Label className='flex items-center gap-2'>
									<CalendarIcon className='w-4 h-4' /> Sana
								</Label>
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant='outline'
											className={cn(
												'w-full justify-start text-left font-normal h-11 rounded-xl',
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
									<PopoverContent
										className='w-auto p-0 rounded-2xl overflow-hidden'
										align='start'
									>
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
									<Clock className='w-4 h-4' /> Soat
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
										<SelectTrigger className='h-11 rounded-xl'>
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
												time: `${formData.time?.split(':')[0] || '00'}:${m}`,
											})
										}
									>
										<SelectTrigger className='h-11 rounded-xl'>
											<SelectValue placeholder='Daq' />
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

							<div className='flex items-center justify-between pt-4 border-t'>
								<Label className='cursor-pointer' htmlFor='comments'>
									Izohlarga ruxsat berish
								</Label>
								<Switch
									id='comments'
									checked={formData.allowComments}
									onCheckedChange={c =>
										setFormData({ ...formData, allowComments: c })
									}
								/>
							</div>
						</CardContent>
						<CardFooter className='p-4 pt-0'>
							<Button
								className='w-full gap-2 h-11 rounded-xl'
								onClick={handleSave}
								disabled={isLoading || !formData.title || !formData.date}
							>
								{isLoading ? (
									<Loader2 className='h-4 w-4 animate-spin' />
								) : (
									<Save className='h-4 w-4' />
								)}
								Saqlash
							</Button>
						</CardFooter>
					</Card>
				</div>
			</div>
		</div>
	)
}
