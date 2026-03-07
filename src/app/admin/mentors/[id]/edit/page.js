'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import api from '@/lib/api'
import { motion } from 'framer-motion'
import {
	ArrowLeft,
	Loader2,
	Plus,
	Save,
	ShieldAlert,
	Trash2,
	X,
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

const formatPhoneStr = str => {
	let val = (str || '').replace(/[^\d+]/g, '')
	if (!val.startsWith('+998')) val = '+998'
	const raw = val.slice(4).substring(0, 9)
	let formatted = '+998'
	if (raw.length > 0) formatted += ' ' + raw.substring(0, 2)
	if (raw.length > 2) formatted += ' ' + raw.substring(2, 5)
	if (raw.length > 5) formatted += ' ' + raw.substring(5, 9)
	return formatted
}

export default function EditMentorPage() {
	const router = useRouter()
	const { id } = useParams()

	const [loading, setLoading] = useState(true)
	const [isSaving, setIsSaving] = useState(false)
	const [error, setError] = useState(null)

	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		phoneNumber: '+998 ',
		course: '1-kurs (Bakalavr)',
		groupPrefix: '',
		groupSuffix: '',
		specialty: '',
		experience: '',
		about: '',
		isMentor: false,
		status: 'active',
	})

	const [languages, setLanguages] = useState([])
	const [newLangName, setNewLangName] = useState('')
	const [newLangLevel, setNewLangLevel] = useState('B2')
	const [newLangNative, setNewLangNative] = useState(false)

	const [skills, setSkills] = useState([])
	const [newSkill, setNewSkill] = useState('')

	const [schedule, setSchedule] = useState([])

	useEffect(() => {
		const fetchMentor = async () => {
			try {
				const res = await api.get(`/admin/mentors/${id}`)
				if (res?.data?.success) {
					const data = res.data.mentor
					const [gPref, gSuff] = (data.group || '-').split('-')

					setFormData({
						firstName: data.firstName || '',
						lastName: data.lastName || '',
						phoneNumber: formatPhoneStr(data.phoneNumber),
						course: data.course || '1-kurs (Bakalavr)',
						groupPrefix: gPref || '',
						groupSuffix: gSuff || '',
						specialty: data.specialty || '',
						experience: data.experience || '',
						about: data.about || '',
						isMentor: !!data.isMentor,
						status: data.status || 'active',
					})
					setLanguages(data.languages || [])
					setSkills(data.skills || [])
					setSchedule(data.schedule || [])
				} else {
					setError("Ma'lumot topilmadi")
				}
			} catch (err) {
				console.error(err)
				setError('Serverda xatolik yuz berdi')
			} finally {
				setLoading(false)
			}
		}
		if (id) fetchMentor()
	}, [id])

	const handlePhoneChange = e => {
		setFormData(p => ({ ...p, phoneNumber: formatPhoneStr(e.target.value) }))
	}

	const handleTextChange = e => {
		const { name, value } = e.target
		setFormData(p => ({ ...p, [name]: value }))
	}

	const addLanguage = () => {
		if (newLangName.trim()) {
			setLanguages([
				...languages,
				{
					lang: newLangName.trim(),
					level: newLangLevel,
					isNative: newLangNative,
				},
			])
			setNewLangName('')
			setNewLangNative(false)
		}
	}

	const removeLanguage = index => {
		setLanguages(languages.filter((_, i) => i !== index))
	}

	const addSkill = () => {
		if (newSkill.trim() && !skills.includes(newSkill.trim())) {
			setSkills([...skills, newSkill.trim()])
			setNewSkill('')
		}
	}

	const removeSkill = skill => {
		setSkills(skills.filter(s => s !== skill))
	}

	const handleScheduleChange = (index, field, value) => {
		const newSchedule = [...schedule]
		newSchedule[index][field] = value
		setSchedule(newSchedule)
	}

	const addScheduleRow = () => {
		setSchedule([...schedule, { day: 'Dushanba', from: '09:00', to: '18:00' }])
	}

	const removeScheduleRow = index => {
		setSchedule(schedule.filter((_, i) => i !== index))
	}

	const handleSubmit = async e => {
		e.preventDefault()
		setIsSaving(true)
		try {
			const finalGroup =
				formData.groupPrefix && formData.groupSuffix
					? `${formData.groupPrefix}-${formData.groupSuffix}`
					: formData.groupPrefix || formData.groupSuffix || ''

			const payload = {
				...formData,
				group: finalGroup,
				phoneNumber: formData.phoneNumber.replace(/\s+/g, ''),
				languages,
				skills,
				schedule,
			}

			const res = await api.put(`/admin/mentors/${id}`, payload)
			if (res?.data?.success) {
				router.push(`/admin/mentors/${id}/view`)
				router.refresh()
			}
		} catch (err) {
			console.error(err)
		} finally {
			setIsSaving(false)
		}
	}

	if (loading) {
		return (
			<div className='max-w-5xl mx-auto space-y-6 pt-6 pb-20'>
				<div className='flex items-center gap-4 border-b pb-4'>
					<Skeleton className='h-10 w-10 rounded-full' />
					<div className='space-y-2'>
						<Skeleton className='h-8 w-64' />
						<Skeleton className='h-4 w-32' />
					</div>
				</div>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<Skeleton className='h-[450px] rounded-xl' />
					<div className='space-y-6'>
						<Skeleton className='h-[200px] rounded-xl' />
						<Skeleton className='h-[226px] rounded-xl' />
					</div>
				</div>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<Skeleton className='h-[300px] rounded-xl' />
					<Skeleton className='h-[300px] rounded-xl' />
				</div>
				<Skeleton className='h-[200px] rounded-xl' />
			</div>
		)
	}

	if (error) {
		return (
			<div className='flex flex-col items-center justify-center h-[50vh] text-center space-y-4'>
				<div className='bg-red-50 text-red-500 p-4 rounded-full'>
					<ShieldAlert className='h-10 w-10' />
				</div>
				<h2 className='text-2xl font-bold'>Xatolik yuz berdi</h2>
				<p className='text-muted-foreground'>{error}</p>
				<Button
					onClick={() => router.push(`/admin/mentors/${id}/view`)}
					variant='outline'
				>
					<ArrowLeft className='mr-2 h-4 w-4' /> Ortga qaytish
				</Button>
			</div>
		)
	}

	return (
		<motion.div
			variants={containerVariants}
			initial='hidden'
			animate='show'
			className='max-w-5xl mx-auto space-y-6 pb-24 relative'
		>
			<motion.div
				variants={itemVariants}
				className='flex items-center gap-4 border-b pb-4'
			>
				<Button
					variant='outline'
					size='icon'
					onClick={() => router.push(`/admin/mentors/${id}/view`)}
					className='h-10 w-10 rounded-full shrink-0'
				>
					<ArrowLeft className='h-5 w-5' />
				</Button>
				<div>
					<h1 className='text-2xl font-bold tracking-tight'>
						Mentorni Tahrirlash
					</h1>
					<p className='text-muted-foreground text-sm font-medium'>
						Tizimdagi ID: {id}
					</p>
				</div>
			</motion.div>

			<form onSubmit={handleSubmit} className='space-y-6'>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch'>
					<motion.div variants={itemVariants} className='flex flex-col'>
						<Card className='shadow-sm border-muted flex-1 flex flex-col'>
							<CardHeader className='bg-muted/30 border-b pb-4'>
								<CardTitle className='text-lg'>Asosiy ma'lumotlar</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4 pt-6 flex-1'>
								<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
									<div className='space-y-2'>
										<Label htmlFor='firstName'>Ism</Label>
										<Input
											id='firstName'
											name='firstName'
											value={formData.firstName}
											onChange={handleTextChange}
											required
										/>
									</div>
									<div className='space-y-2'>
										<Label htmlFor='lastName'>Familiya</Label>
										<Input
											id='lastName'
											name='lastName'
											value={formData.lastName}
											onChange={handleTextChange}
											required
										/>
									</div>
								</div>

								<div className='space-y-2'>
									<Label htmlFor='phone'>Telefon raqami</Label>
									<Input
										id='phone'
										type='tel'
										value={formData.phoneNumber}
										onChange={handlePhoneChange}
										placeholder='+998 90 123 4567'
										required
									/>
								</div>

								<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
									<div className='space-y-2'>
										<Label>Kursi</Label>
										<Select
											value={formData.course}
											onValueChange={val =>
												setFormData(p => ({ ...p, course: val }))
											}
										>
											<SelectTrigger>
												<SelectValue placeholder='Kursni tanlang' />
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													<SelectLabel>Bakalavr</SelectLabel>
													<SelectItem value='1-kurs (Bakalavr)'>
														1-kurs (Bakalavr)
													</SelectItem>
													<SelectItem value='2-kurs (Bakalavr)'>
														2-kurs (Bakalavr)
													</SelectItem>
													<SelectItem value='3-kurs (Bakalavr)'>
														3-kurs (Bakalavr)
													</SelectItem>
													<SelectItem value='4-kurs (Bakalavr)'>
														4-kurs (Bakalavr)
													</SelectItem>
												</SelectGroup>
												<SelectGroup>
													<SelectLabel>Magistratura</SelectLabel>
													<SelectItem value='1-kurs (Magistratura)'>
														1-kurs (Magistratura)
													</SelectItem>
													<SelectItem value='2-kurs (Magistratura)'>
														2-kurs (Magistratura)
													</SelectItem>
												</SelectGroup>
											</SelectContent>
										</Select>
									</div>
									<div className='space-y-2'>
										<Label>Guruhi</Label>
										<div className='flex items-center gap-2'>
											<Input
												name='groupPrefix'
												value={formData.groupPrefix}
												onChange={handleTextChange}
												placeholder='320'
												className='text-center'
											/>
											<span className='text-muted-foreground font-bold'>-</span>
											<Input
												name='groupSuffix'
												value={formData.groupSuffix}
												onChange={handleTextChange}
												placeholder='21'
												className='text-center'
											/>
										</div>
									</div>
								</div>

								<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
									<div className='space-y-2'>
										<Label htmlFor='specialty'>
											Mutaxassisligi (Yo'nalishi)
										</Label>
										<Input
											id='specialty'
											name='specialty'
											value={formData.specialty}
											onChange={handleTextChange}
											placeholder='Masalan: Full-Stack'
										/>
									</div>
									<div className='space-y-2'>
										<Label htmlFor='experience'>Tajriba (yil)</Label>
										<Input
											id='experience'
											name='experience'
											type='number'
											value={formData.experience}
											onChange={handleTextChange}
											placeholder='Masalan: 2'
										/>
									</div>
								</div>
							</CardContent>
						</Card>
					</motion.div>

					<motion.div variants={itemVariants} className='flex flex-col gap-6'>
						<Card className='shadow-sm border-blue-500/20 bg-blue-50/10'>
							<CardHeader className='border-b border-blue-500/10 pb-4'>
								<CardTitle className='text-lg flex items-center gap-2'>
									<ShieldAlert className='h-5 w-5 text-blue-500' /> Tizim
									ruxsatlari
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4 pt-6'>
								<div className='flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-card hover:border-primary/50 transition-colors'>
									<div className='space-y-1 pr-4'>
										<Label className='text-base font-bold'>
											Mentor ruxsati
										</Label>
										<p className='text-xs text-muted-foreground'>
											Foydalanuvchiga mentor dashboardiga to'liq kirish huquqini
											beradi.
										</p>
									</div>
									<Switch
										checked={formData.isMentor}
										onCheckedChange={val =>
											setFormData(p => ({ ...p, isMentor: val }))
										}
									/>
								</div>

								<div className='flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-card hover:border-red-500/50 transition-colors'>
									<div className='space-y-1 pr-4'>
										<Label
											className={`text-base font-bold ${formData.status === 'blocked' ? 'text-red-500' : 'text-foreground'}`}
										>
											Tizimga kirish
										</Label>
										<p className='text-xs text-muted-foreground'>
											Mentorni bloklasangiz, u tizimdan foydalana olmaydi.
										</p>
									</div>
									<Select
										value={formData.status}
										onValueChange={val =>
											setFormData(p => ({ ...p, status: val }))
										}
									>
										<SelectTrigger
											className={`w-[130px] font-semibold ${
												formData.status === 'blocked'
													? 'text-red-500 border-red-200 bg-red-50'
													: 'text-green-600 border-green-200 bg-green-50'
											}`}
										>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem
												value='active'
												className='text-green-600 font-medium'
											>
												Faol
											</SelectItem>
											<SelectItem
												value='blocked'
												className='text-red-500 font-medium'
											>
												Bloklangan
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</CardContent>
						</Card>

						<Card className='shadow-sm border-muted flex-1 flex flex-col'>
							<CardHeader className='bg-muted/30 border-b pb-4'>
								<CardTitle className='text-lg'>
									Ustoz haqida (Biografiya)
								</CardTitle>
								<CardDescription>
									O'quvchilarga ko'rinadigan qisqacha ma'lumot
								</CardDescription>
							</CardHeader>
							<CardContent className='pt-6 flex-1 flex flex-col'>
								<Textarea
									id='about'
									name='about'
									value={formData.about}
									onChange={handleTextChange}
									className='flex-1 min-h-[120px] resize-y'
									placeholder='Assalomu alaykum...'
								/>
							</CardContent>
						</Card>
					</motion.div>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch'>
					<motion.div variants={itemVariants} className='flex flex-col'>
						<Card className='shadow-sm flex-1 flex flex-col'>
							<CardHeader className='bg-muted/30 border-b pb-4'>
								<CardTitle className='text-lg'>Tillarni bilishi</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4 pt-6 flex-1 flex flex-col'>
								<div className='flex flex-col sm:flex-row gap-2'>
									<Input
										className='flex-1'
										placeholder='Til nomi (mas: Ingliz tili)'
										value={newLangName}
										onChange={e => setNewLangName(e.target.value)}
										onKeyDown={e =>
											e.key === 'Enter' && (e.preventDefault(), addLanguage())
										}
									/>
									<Select value={newLangLevel} onValueChange={setNewLangLevel}>
										<SelectTrigger className='w-full sm:w-[100px]'>
											<SelectValue placeholder='Daraja' />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='A1'>A1</SelectItem>
											<SelectItem value='A2'>A2</SelectItem>
											<SelectItem value='B1'>B1</SelectItem>
											<SelectItem value='B2'>B2</SelectItem>
											<SelectItem value='C1'>C1</SelectItem>
											<SelectItem value='C2'>C2</SelectItem>
										</SelectContent>
									</Select>
									<div className='flex items-center space-x-2 border rounded-md px-3 h-10 w-full sm:w-auto shrink-0 bg-muted/20 text-sm'>
										<Checkbox
											id='isNative'
											checked={newLangNative}
											onCheckedChange={setNewLangNative}
										/>
										<label
											htmlFor='isNative'
											className='font-medium cursor-pointer'
										>
											Ona tili
										</label>
									</div>
									<Button
										type='button'
										onClick={addLanguage}
										size='icon'
										className='shrink-0 h-10 w-10'
									>
										<Plus className='h-4 w-4' />
									</Button>
								</div>

								<div className='space-y-2 mt-4 flex-1'>
									{languages.map((lang, index) => (
										<div
											key={index}
											className='flex items-center justify-between p-2 rounded-md border bg-card'
										>
											<div className='flex items-center gap-2'>
												<span className='font-medium text-sm'>{lang.lang}</span>
												<Badge
													variant='secondary'
													className='text-xs font-mono'
												>
													{lang.level}
												</Badge>
												{lang.isNative && (
													<Badge
														variant='outline'
														className='text-[10px] bg-green-50 text-green-600 border-green-200'
													>
														Ona tili
													</Badge>
												)}
											</div>
											<Button
												type='button'
												variant='ghost'
												size='icon'
												className='h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50'
												onClick={() => removeLanguage(index)}
											>
												<Trash2 className='h-4 w-4' />
											</Button>
										</div>
									))}
									{languages.length === 0 && (
										<p className='text-sm text-muted-foreground text-center py-4 italic border border-dashed rounded-md bg-muted/10'>
											Tillar hali qo'shilmagan.
										</p>
									)}
								</div>
							</CardContent>
						</Card>
					</motion.div>

					<motion.div variants={itemVariants} className='flex flex-col'>
						<Card className='shadow-sm flex-1 flex flex-col'>
							<CardHeader className='bg-muted/30 border-b pb-4'>
								<CardTitle className='text-lg'>Texnik ko'nikmalar</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4 pt-6 flex-1 flex flex-col'>
								<div className='flex gap-2'>
									<Input
										placeholder='Masalan: ReactJS'
										value={newSkill}
										onChange={e => setNewSkill(e.target.value)}
										onKeyDown={e =>
											e.key === 'Enter' && (e.preventDefault(), addSkill())
										}
									/>
									<Button
										type='button'
										onClick={addSkill}
										size='icon'
										className='shrink-0'
									>
										<Plus className='h-4 w-4' />
									</Button>
								</div>
								<div className='flex flex-wrap gap-2 flex-1 content-start'>
									{skills.map((skill, idx) => (
										<Badge
											key={idx}
											variant='secondary'
											className='pl-3 pr-1 py-1 flex items-center gap-1.5 text-sm bg-primary/5 hover:bg-primary/10 border-primary/20'
										>
											{skill}
											<button
												type='button'
												onClick={() => removeSkill(skill)}
												className='hover:bg-muted rounded-full p-0.5 transition-colors'
											>
												<X className='h-3.5 w-3.5' />
											</button>
										</Badge>
									))}
									{skills.length === 0 && (
										<p className='text-sm text-muted-foreground text-center py-4 italic border border-dashed rounded-md bg-muted/10 w-full'>
											Texnik ko'nikmalar qo'shilmagan.
										</p>
									)}
								</div>
							</CardContent>
						</Card>
					</motion.div>
				</div>

				<motion.div variants={itemVariants}>
					<Card className='shadow-sm'>
						<CardHeader className='flex flex-row items-center justify-between border-b bg-muted/30 pb-4'>
							<CardTitle className='text-lg'>Dars o'tish vaqtlari</CardTitle>
							<Button
								type='button'
								size='sm'
								variant='secondary'
								onClick={addScheduleRow}
								className='h-9 font-semibold'
							>
								<Plus className='h-4 w-4 mr-1' /> Vaqt qo'shish
							</Button>
						</CardHeader>
						<CardContent className='space-y-3 pt-6'>
							{schedule.map((slot, idx) => (
								<div
									key={idx}
									className='flex items-center gap-2 sm:gap-4 flex-wrap sm:flex-nowrap p-3 border rounded-lg bg-card/60'
								>
									<div className='w-full sm:w-1/3'>
										<Label className='text-xs text-muted-foreground mb-1 block'>
											Hafta kuni
										</Label>
										<Select
											value={slot.day}
											onValueChange={v => handleScheduleChange(idx, 'day', v)}
										>
											<SelectTrigger>
												<SelectValue placeholder='Kunni tanlang' />
											</SelectTrigger>
											<SelectContent>
												{[
													'Dushanba',
													'Seshanba',
													'Chorshanba',
													'Payshanba',
													'Juma',
													'Shanba',
													'Yakshanba',
												].map(d => (
													<SelectItem key={d} value={d}>
														{d}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<div className='w-full sm:w-1/3'>
										<Label className='text-xs text-muted-foreground mb-1 block'>
											Boshlanish vaqti
										</Label>
										<Input
											type='time'
											value={slot.from}
											onChange={e =>
												handleScheduleChange(idx, 'from', e.target.value)
											}
										/>
									</div>
									<div className='w-full sm:w-1/3 flex items-end gap-2'>
										<div className='flex-1'>
											<Label className='text-xs text-muted-foreground mb-1 block'>
												Tugash vaqti
											</Label>
											<Input
												type='time'
												value={slot.to}
												onChange={e =>
													handleScheduleChange(idx, 'to', e.target.value)
												}
											/>
										</div>
										<Button
											type='button'
											variant='ghost'
											size='icon'
											onClick={() => removeScheduleRow(idx)}
											className='text-red-500 hover:text-red-600 hover:bg-red-50 shrink-0 h-10 w-10 border border-transparent hover:border-red-200'
										>
											<Trash2 className='h-5 w-5' />
										</Button>
									</div>
								</div>
							))}
							{schedule.length === 0 && (
								<p className='text-sm text-muted-foreground text-center py-8 bg-muted/20 border border-dashed rounded-lg italic'>
									Hozircha bo'sh vaqtlar jadvali kiritilmagan.
								</p>
							)}
						</CardContent>
					</Card>
				</motion.div>

				<motion.div
					variants={itemVariants}
					className='flex justify-end gap-3 p-4 bg-background/90 backdrop-blur-md rounded-xl border shadow-lg sticky bottom-4 z-50'
				>
					<Button
						type='button'
						variant='outline'
						disabled={isSaving}
						onClick={() => router.push(`/admin/mentors/${id}/view`)}
					>
						Bekor qilish
					</Button>
					<Button
						type='submit'
						disabled={isSaving}
						className='bg-primary px-8 font-semibold'
					>
						{isSaving ? (
							<Loader2 className='mr-2 h-4 w-4 animate-spin' />
						) : (
							<Save className='mr-2 h-4 w-4' />
						)}
						O'zgarishlarni saqlash
					</Button>
				</motion.div>
			</form>
		</motion.div>
	)
}
