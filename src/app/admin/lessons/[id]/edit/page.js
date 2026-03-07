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
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { uz } from 'date-fns/locale'
import { motion } from 'framer-motion'
import {
	ArrowLeft,
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
import { useParams, useRouter } from 'next/navigation'
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

export default function EditLessonPage() {
	const params = useParams()
	const { id } = params
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [isDataLoading, setIsDataLoading] = useState(true)
	const [mentors, setMentors] = useState([])
	const [errorMsg, setErrorMsg] = useState('')
	const [successMsg, setSuccessMsg] = useState('')

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

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsDataLoading(true)
				const [mentorRes, lessonRes] = await Promise.all([
					api.get('/admin/lessons/mentors'),
					api.get(`/admin/lessons/${id}`),
				])

				if (mentorRes?.data?.success) {
					setMentors(mentorRes.data.mentors)
				}

				if (lessonRes?.data?.success) {
					const l = lessonRes.data.lesson
					setFormData({
						title: l.title || '',
						mentor: l.mentor?._id || l.mentor || '',
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
				console.error("Ma'lumotlarni yuklashda xatolik:", error)
				setErrorMsg("Ma'lumotlarni yuklab bo'lmadi")
			} finally {
				setIsDataLoading(false)
			}
		}
		if (id) fetchData()
	}, [id])

	const handleSave = async e => {
		if (e) e.preventDefault()
		setErrorMsg('')
		setSuccessMsg('')

		if (
			!formData.title ||
			!formData.date ||
			!formData.time ||
			!formData.mentor
		) {
			setErrorMsg("Barcha majburiy maydonlarni to'ldiring.")
			return
		}

		setIsLoading(true)
		try {
			const res = await api.put(`/admin/lessons/${id}`, formData)
			if (res?.data?.success) {
				setSuccessMsg("O'zgarishlar saqlandi! Yo'naltirilmoqda...")
				setTimeout(() => {
					router.push('/admin/lessons')
					router.refresh()
				}, 1500)
			}
		} catch (error) {
			console.error(error)
			setErrorMsg(
				error.response?.data?.message || 'Saqlashda xatolik yuz berdi',
			)
		} finally {
			setIsLoading(false)
		}
	}

	if (isDataLoading) {
		return (
			<div className='max-w-5xl mx-auto space-y-6 pt-6 pb-20'>
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

	return (
		<motion.div
			variants={containerVariants}
			initial='hidden'
			animate='show'
			className='max-w-5xl mx-auto space-y-6 pb-24 pt-4 sm:pt-6 w-full'
		>
			<motion.div
				variants={itemVariants}
				className='flex items-center gap-4 border-b pb-4'
			>
				<Button
					type='button'
					variant='outline'
					size='icon'
					onClick={() => router.push('/admin/lessons')}
					className='h-10 w-10 rounded-full shrink-0 hover:bg-primary/5'
				>
					<ArrowLeft className='h-5 w-5' />
				</Button>
				<div>
					<h1 className='text-2xl sm:text-3xl font-bold tracking-tight text-foreground'>
						Darsni Tahrirlash
					</h1>
					<p className='text-muted-foreground text-sm mt-1'>
						Mavjud dars ma'lumotlarini yangilash va boshqarish.
					</p>
				</div>
			</motion.div>

			<form
				onSubmit={handleSave}
				className='grid grid-cols-1 lg:grid-cols-3 gap-6 items-start'
			>
				<div className='lg:col-span-2 space-y-6'>
					<motion.div variants={itemVariants}>
						<Card className='shadow-sm border-muted overflow-hidden'>
							<CardHeader className='bg-muted/30 border-b pb-5'>
								<CardTitle className='text-lg'>Asosiy ma'lumotlar</CardTitle>
								<CardDescription>
									Darsning nomi va o'quvchilarga ko'rinadigan tavsifi.
								</CardDescription>
							</CardHeader>
							<CardContent className='p-6 space-y-5'>
								<div className='space-y-2'>
									<Label className='font-semibold'>
										Dars mavzusi <span className='text-red-500'>*</span>
									</Label>
									<Input
										placeholder='Mavzuni kiriting...'
										value={formData.title}
										onChange={e =>
											setFormData({ ...formData, title: e.target.value })
										}
										className='h-11 focus-visible:ring-primary/20'
									/>
								</div>

								<div className='space-y-2'>
									<Label className='font-semibold'>Batafsil ma'lumot</Label>
									<Textarea
										placeholder='Dars haqida qisqacha...'
										className='min-h-[140px] resize-y focus-visible:ring-primary/20'
										value={formData.description}
										onChange={e =>
											setFormData({ ...formData, description: e.target.value })
										}
									/>
								</div>

								<div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
									<div className='space-y-2'>
										<Label className='font-semibold'>
											Mentor <span className='text-red-500'>*</span>
										</Label>
										<Select
											value={formData.mentor}
											onValueChange={v =>
												setFormData({ ...formData, mentor: v })
											}
										>
											<SelectTrigger className='h-11'>
												<SelectValue placeholder='Mentorni tanlang' />
											</SelectTrigger>
											<SelectContent>
												{mentors.map(m => (
													<SelectItem key={m.id} value={m.id}>
														{m.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<div className='space-y-2'>
										<Label className='font-semibold'>O'quvchilar limiti</Label>
										<div className='relative'>
											<Users className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
											<Input
												type='number'
												placeholder='100'
												value={formData.maxStudents}
												onChange={e =>
													setFormData({
														...formData,
														maxStudents: e.target.value,
													})
												}
												className='pl-9 h-11'
											/>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</motion.div>

					<motion.div variants={itemVariants}>
						<Card className='shadow-sm border-muted overflow-hidden'>
							<CardHeader className='bg-muted/30 border-b pb-5'>
								<CardTitle className='text-lg flex items-center gap-2'>
									<Video className='w-5 h-5 text-blue-500' /> Translatsiya va
									Manzil
								</CardTitle>
							</CardHeader>
							<CardContent className='p-6 space-y-6'>
								<div className='space-y-2'>
									<Label className='font-semibold'>Dars formati</Label>
									<Select
										value={formData.format}
										onValueChange={v => setFormData({ ...formData, format: v })}
									>
										<SelectTrigger className='max-w-xs h-11'>
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
									<motion.div
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										className='space-y-2'
									>
										<Label className='font-semibold flex items-center gap-1.5'>
											<MapPin className='w-4 h-4 text-muted-foreground' /> Xona
											nomi/raqami <span className='text-red-500'>*</span>
										</Label>
										<Input
											placeholder='Masalan: 401-xona'
											value={formData.roomNumber}
											onChange={e =>
												setFormData({ ...formData, roomNumber: e.target.value })
											}
											className='h-11'
										/>
									</motion.div>
								)}
							</CardContent>
						</Card>
					</motion.div>
				</div>

				<div className='space-y-6 lg:sticky lg:top-24'>
					<motion.div variants={itemVariants}>
						<Card className='shadow-sm border-muted overflow-hidden'>
							<CardHeader className='bg-muted/30 border-b p-4'>
								<CardTitle className='text-base flex items-center gap-2'>
									<Clock className='w-4 h-4 text-primary' /> Holat va Vaqt
								</CardTitle>
							</CardHeader>
							<CardContent className='p-5 space-y-5'>
								<div className='space-y-2'>
									<Label className='font-semibold'>Dars Holati</Label>
									<Select
										value={formData.status}
										onValueChange={v => setFormData({ ...formData, status: v })}
									>
										<SelectTrigger className='h-11'>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem
												value='upcoming'
												className='text-blue-600 font-medium'
											>
												Keladigan
											</SelectItem>
											<SelectItem
												value='live'
												className='text-red-600 font-medium font-bold'
											>
												Jonli (Live)
											</SelectItem>
											<SelectItem
												value='completed'
												className='text-green-600 font-medium'
											>
												Tugallangan
											</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className='space-y-2 flex flex-col'>
									<Label className='flex items-center gap-2 font-semibold'>
										<CalendarIcon className='w-4 h-4 text-muted-foreground' />{' '}
										Sana
									</Label>
									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant={'outline'}
												className={cn(
													'w-full justify-start text-left font-normal h-11 bg-background',
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
									<Label className='flex items-center gap-2 font-semibold'>
										<Clock className='w-4 h-4 text-muted-foreground' /> Soat
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
											<SelectTrigger className='h-11'>
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
											onValueChange={m =>
												setFormData({
													...formData,
													time: `${formData.time?.split(':')[0] || '00'}:${m}`,
												})
											}
										>
											<SelectTrigger className='h-11'>
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

								<div className='border-t pt-4'>
									<div className='flex items-center justify-between p-3 rounded-lg border bg-muted/20'>
										<div className='space-y-0.5'>
											<Label
												className='text-sm flex items-center gap-1.5 font-semibold cursor-pointer'
												htmlFor='comments-toggle'
											>
												<MessagesSquare className='w-4 h-4 text-muted-foreground' />{' '}
												Izohlar
											</Label>
											<p className='text-[10px] text-muted-foreground'>
												O'quvchilarga chat ruxsati
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
									className='w-full gap-2 h-12 font-bold shadow-sm'
									onClick={handleSave}
									disabled={isLoading}
								>
									{isLoading ? (
										<Loader2 className='h-5 w-5 animate-spin' />
									) : (
										<Save className='h-5 w-5' />
									)}
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
