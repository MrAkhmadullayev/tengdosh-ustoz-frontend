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
import { motion } from 'framer-motion'
import {
	ArrowLeft,
	BookOpen,
	Calendar as CalendarIcon,
	CheckCircle2,
	Clock,
	Loader2,
	MapPin,
	MessagesSquare,
	Save,
	ShieldAlert,
	Users,
	Video,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const containerVariants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: { staggerChildren: 0.1 },
	},
}

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	show: {
		opacity: 1,
		y: 0,
		transition: { type: 'spring', stiffness: 300, damping: 24 },
	},
}

export default function CreateLessonPage() {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [isFetchingMentors, setIsFetchingMentors] = useState(true)
	const [mentors, setMentors] = useState([])

	// Xabar va xatoliklar uchun state
	const [errorMsg, setErrorMsg] = useState('')
	const [successMsg, setSuccessMsg] = useState('')

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

	useEffect(() => {
		const fetchMentors = async () => {
			try {
				setIsFetchingMentors(true)
				const res = await api.get('/admin/lessons/mentors')
				if (res?.data?.success) {
					setMentors(res.data.mentors)
				}
			} catch (error) {
				console.error('Mentorlarni yuklashda xatolik:', error)
			} finally {
				setIsFetchingMentors(false)
			}
		}
		fetchMentors()
	}, [])

	const handleSave = async e => {
		e.preventDefault() // Form submit bo'lganda sahifa yangilanishini oldini olish
		setErrorMsg('')
		setSuccessMsg('')

		if (
			!formData.title ||
			!formData.date ||
			!formData.time ||
			!formData.mentor
		) {
			setErrorMsg('Iltimos, dars mavzusi, sanasi, vaqti va mentorni kiriting.')
			return
		}

		setIsLoading(true)
		try {
			const res = await api.post('/admin/lessons', formData)
			if (res?.data?.success) {
				setSuccessMsg("Dars muvaffaqiyatli yaratildi! Yo'naltirilmoqda...")
				setTimeout(() => {
					router.push('/admin/lessons')
					router.refresh()
				}, 1500)
			}
		} catch (error) {
			console.error(error)
			setErrorMsg(
				error.response?.data?.message ||
					"Xatolik yuz berdi. Qaytadan urinib ko'ring.",
			)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<motion.div
			variants={containerVariants}
			initial='hidden'
			animate='show'
			className='max-w-5xl mx-auto space-y-6 pb-20 pt-4 sm:pt-6 w-full'
		>
			{/* HEADER */}
			<motion.div
				variants={itemVariants}
				className='flex items-center gap-4 border-b pb-4'
			>
				<Button
					type='button'
					variant='outline'
					size='icon'
					onClick={() => router.push('/admin/lessons')}
					className='h-10 w-10 rounded-full shrink-0 hover:bg-primary/5 hover:border-primary/30 transition-all'
				>
					<ArrowLeft className='h-5 w-5' />
				</Button>
				<div>
					<h1 className='text-2xl sm:text-3xl font-bold tracking-tight text-foreground'>
						Yangi dars qo'shish
					</h1>
					<p className='text-muted-foreground text-sm mt-1'>
						Platformaga yangi jonli efir yoki markazda dars belgilash.
					</p>
				</div>
			</motion.div>

			<form
				onSubmit={handleSave}
				className='grid grid-cols-1 lg:grid-cols-3 gap-6 items-start'
			>
				{/* ASOSIY FORMA (Chap tomon) */}
				<div className='lg:col-span-2 space-y-6'>
					<motion.div variants={itemVariants}>
						<Card className='shadow-sm border-muted overflow-hidden'>
							<CardHeader className='bg-muted/30 border-b pb-4'>
								<CardTitle className='text-lg flex items-center gap-2'>
									<BookOpen className='w-5 h-5 text-primary' /> Asosiy
									ma'lumotlar
								</CardTitle>
								<CardDescription>
									O'quvchilar ko'radigan asosiy dars tavsifi.
								</CardDescription>
							</CardHeader>
							<CardContent className='p-6 space-y-5'>
								<div className='space-y-2'>
									<Label className='font-semibold text-foreground'>
										Dars mavzusi <span className='text-red-500'>*</span>
									</Label>
									<Input
										placeholder="Masalan: JavaScript dagi closure'lar"
										value={formData.title}
										onChange={e =>
											setFormData({ ...formData, title: e.target.value })
										}
										className='bg-background focus-visible:ring-primary/20 h-11'
									/>
								</div>

								<div className='space-y-2'>
									<Label className='font-semibold text-foreground'>
										Dars haqida batafsil ma'lumot
									</Label>
									<Textarea
										placeholder="Bu dars nima haqida bo'ladi va nimalar o'rganiladi?"
										className='min-h-[120px] bg-background resize-y focus-visible:ring-primary/20'
										value={formData.description}
										onChange={e =>
											setFormData({ ...formData, description: e.target.value })
										}
									/>
								</div>

								<div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
									<div className='space-y-2'>
										<Label className='font-semibold text-foreground'>
											Mentor <span className='text-red-500'>*</span>
										</Label>
										<Select
											value={formData.mentor}
											onValueChange={v =>
												setFormData({ ...formData, mentor: v })
											}
											disabled={isFetchingMentors}
										>
											<SelectTrigger className='bg-background h-11'>
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
										<Label className='font-semibold text-foreground flex items-center gap-1.5'>
											<Users className='w-4 h-4 text-muted-foreground' /> Limit
											(O'quvchilar soni)
										</Label>
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
											className='bg-background h-11'
										/>
									</div>
								</div>
							</CardContent>
						</Card>
					</motion.div>

					<motion.div variants={itemVariants}>
						<Card className='shadow-sm border-muted overflow-hidden'>
							<CardHeader className='bg-muted/30 border-b pb-4'>
								<CardTitle className='text-lg flex items-center gap-2'>
									<Video className='w-5 h-5 text-blue-500' /> Translatsiya va
									Manzil
								</CardTitle>
							</CardHeader>
							<CardContent className='p-6 space-y-5'>
								<div className='space-y-2'>
									<Label className='font-semibold text-foreground'>
										Dars qay formatda o'tiladi?
									</Label>
									<Select
										value={formData.format}
										onValueChange={v => setFormData({ ...formData, format: v })}
									>
										<SelectTrigger className='bg-background sm:max-w-xs h-11'>
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

								<div className='grid grid-cols-1 gap-6'>
									{(formData.format === 'offline' ||
										formData.format === 'hybrid') && (
										<motion.div
											initial={{ opacity: 0, height: 0 }}
											animate={{ opacity: 1, height: 'auto' }}
											className='space-y-2'
										>
											<Label className='font-semibold text-foreground flex items-center gap-1.5'>
												<MapPin className='w-4 h-4 text-muted-foreground' />{' '}
												Xona raqami / Nomi{' '}
												<span className='text-red-500'>*</span>
											</Label>
											<Input
												placeholder='Masalan: 401-xona, Google xonasi'
												value={formData.roomNumber}
												onChange={e =>
													setFormData({
														...formData,
														roomNumber: e.target.value,
													})
												}
												className='bg-background h-11 sm:max-w-md'
											/>
										</motion.div>
									)}
								</div>
							</CardContent>
						</Card>
					</motion.div>
				</div>

				{/* YON PANEL (VAQT VA SANA - O'ng tomon) */}
				<div className='space-y-6 lg:sticky lg:top-24'>
					<motion.div variants={itemVariants}>
						<Card className='shadow-sm border-muted overflow-hidden'>
							<CardHeader className='bg-muted/30 border-b p-4'>
								<CardTitle className='text-base flex items-center gap-2'>
									<CalendarIcon className='w-4 h-4 text-primary' /> Vaqt va
									Format
								</CardTitle>
							</CardHeader>
							<CardContent className='p-5 space-y-5'>
								<div className='space-y-2 flex flex-col'>
									<Label className='flex items-center gap-2 font-semibold text-foreground'>
										Dars sanasi <span className='text-red-500'>*</span>
									</Label>
									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant={'outline'}
												className={cn(
													'w-full justify-start text-left font-normal bg-background h-11',
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
									<Label className='flex items-center gap-2 font-semibold text-foreground'>
										Boshlanish vaqti <span className='text-red-500'>*</span>
									</Label>
									<div className='grid grid-cols-2 gap-3'>
										<Select
											value={formData.time?.split(':')[0] || ''}
											onValueChange={h =>
												setFormData({
													...formData,
													time: `${h}:${formData.time?.split(':')[1] || '00'}`,
												})
											}
										>
											<SelectTrigger className='bg-background h-11'>
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
											onValueChange={m =>
												setFormData({
													...formData,
													time: `${formData.time?.split(':')[0] || '15'}:${m}`,
												})
											}
										>
											<SelectTrigger className='bg-background h-11'>
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

								<div className='border-t border-border/50 my-4' />

								<div className='flex items-center justify-between gap-4 p-3 rounded-lg border bg-muted/20'>
									<div className='space-y-0.5'>
										<Label
											className='text-sm flex items-center gap-1.5 font-semibold cursor-pointer'
											htmlFor='comments-toggle'
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
										onCheckedChange={c =>
											setFormData({ ...formData, allowComments: c })
										}
									/>
								</div>
							</CardContent>

							<CardFooter className='p-5 pt-0 flex flex-col gap-3'>
								{errorMsg && (
									<div className='w-full p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium flex items-start gap-2'>
										<ShieldAlert className='w-4 h-4 shrink-0 mt-0.5' />
										<p>{errorMsg}</p>
									</div>
								)}
								{successMsg && (
									<div className='w-full p-3 rounded-md bg-green-50 text-green-600 border border-green-200 text-sm font-medium flex items-start gap-2'>
										<CheckCircle2 className='w-4 h-4 shrink-0 mt-0.5' />
										<p>{successMsg}</p>
									</div>
								)}

								<Button
									type='submit'
									className='w-full gap-2 font-semibold h-12 shadow-sm'
									disabled={
										isLoading ||
										!formData.title ||
										!formData.date ||
										!formData.time ||
										!formData.mentor
									}
								>
									{isLoading ? (
										<Loader2 className='h-5 w-5 animate-spin' />
									) : (
										<Save className='h-5 w-5' />
									)}
									Darsni saqlash va e'lon qilish
								</Button>
							</CardFooter>
						</Card>
					</motion.div>
				</div>
			</form>
		</motion.div>
	)
}
