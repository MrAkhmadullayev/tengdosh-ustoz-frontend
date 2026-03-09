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
import { useTranslation } from '@/lib/i18n'
import { formatPhone, getErrorMessage } from '@/lib/utils'
import { motion } from 'framer-motion'
import {
	ArrowLeft,
	Calendar,
	Loader2,
	Plus,
	Save,
	ShieldAlert,
	Trash2,
	X,
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

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
// 🚀 ASOSIY KOMPONENT
// ==========================================
export default function EditMentorPage() {
	const router = useRouter()
	const { id } = useParams()
	const { t } = useTranslation()

	// 1. Holat (State) boshqaruvi
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

	// 2. API orqali dastlabki ma'lumotlarni tortish
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
						phoneNumber: formatPhone(data.phoneNumber),
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
					setError(t('errors.notFound') || "Ma'lumot topilmadi")
				}
			} catch (err) {
				setError(
					getErrorMessage(err, t('errors.serverError') || 'Server xatosi'),
				)
			} finally {
				setLoading(false)
			}
		}
		if (id) fetchMentor()
	}, [id, t])

	// 3. Input o'zgarishlari
	const handleTextChange = useCallback(e => {
		const { name, value } = e.target
		setFormData(p => ({ ...p, [name]: value }))
	}, [])

	const handlePhoneChange = useCallback(e => {
		setFormData(p => ({ ...p, phoneNumber: formatPhone(e.target.value) }))
	}, [])

	// 4. Dinamik ro'yxatlar (Tillar)
	const addLanguage = () => {
		const name = newLangName.trim()
		if (!name)
			return toast.error(t('mentors.enterLangName') || 'Til nomini kiriting')

		if (languages.some(l => l.lang.toLowerCase() === name.toLowerCase())) {
			return toast.warning(t('mentors.langExists') || "Bu til avval qo'shilgan")
		}

		setLanguages([
			...languages,
			{ lang: name, level: newLangLevel, isNative: newLangNative },
		])
		setNewLangName('')
		setNewLangNative(false)
	}
	const removeLanguage = index =>
		setLanguages(languages.filter((_, i) => i !== index))

	// 5. Dinamik ro'yxatlar (Ko'nikmalar)
	const addSkill = () => {
		const skill = newSkill.trim()
		if (!skill) return

		if (skills.some(s => s.toLowerCase() === skill.toLowerCase())) {
			return toast.warning(
				t('mentors.skillExists') || "Bu ko'nikma avval qo'shilgan",
			)
		}

		setSkills([...skills, skill])
		setNewSkill('')
	}
	const removeSkill = skillToRemove =>
		setSkills(skills.filter(s => s !== skillToRemove))

	// 6. Dars jadvali (Schedule)
	const addScheduleRow = () => {
		setSchedule([...schedule, { day: 'Dushanba', from: '09:00', to: '18:00' }])
	}
	const handleScheduleChange = (index, field, value) => {
		const newSchedule = [...schedule]
		newSchedule[index][field] = value
		setSchedule(newSchedule)
	}
	const removeScheduleRow = index =>
		setSchedule(schedule.filter((_, i) => i !== index))

	// 7. Backendga yuborish (Submit)
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
				phoneNumber: formData.phoneNumber.replace(/\D/g, ''), // Backendga toza raqam
				experience: Number(formData.experience) || 0, // Raqamga o'tkazish
				languages,
				skills,
				schedule,
			}

			const res = await api.put(`/admin/mentors/${id}`, payload)

			if (res?.data?.success) {
				toast.success(
					t('mentors.updateSuccess') || "Ma'lumotlar muvaffaqiyatli saqlandi",
				)
				router.push(`/admin/mentors/${id}/view`)
				router.refresh()
			}
		} catch (err) {
			toast.error(
				getErrorMessage(
					err,
					t('errors.updateFailed') || 'Saqlashda xatolik yuz berdi',
				),
			)
		} finally {
			setIsSaving(false)
		}
	}

	// 8. Yuklanish holati (SKELETON)
	if (loading) {
		return (
			<div className='max-w-5xl mx-auto space-y-6 pt-6 pb-20 animate-pulse'>
				<div className='flex items-center gap-4 border-b pb-4'>
					<Skeleton className='h-10 w-10 rounded-full' />
					<div className='space-y-2'>
						<Skeleton className='h-8 w-64' />
						<Skeleton className='h-4 w-32' />
					</div>
				</div>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
					<Skeleton className='h-[450px] rounded-xl' />
					<div className='space-y-6'>
						<Skeleton className='h-[200px] rounded-xl' />
						<Skeleton className='h-[226px] rounded-xl' />
					</div>
				</div>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
					<Skeleton className='h-[300px] rounded-xl' />
					<Skeleton className='h-[300px] rounded-xl' />
				</div>
				<Skeleton className='h-[200px] rounded-xl' />
			</div>
		)
	}

	// 9. Xatolik holati
	if (error) {
		return (
			<div className='flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4'>
				<div className='bg-destructive/10 text-destructive p-5 rounded-full'>
					<ShieldAlert className='h-12 w-12' />
				</div>
				<h2 className='text-2xl font-bold'>
					{t('errors.errorOccurred') || 'Xatolik yuz berdi'}
				</h2>
				<p className='text-muted-foreground max-w-md'>{error}</p>
				<Button
					onClick={() => router.push(`/admin/mentors/${id}/view`)}
					variant='outline'
					className='mt-4'
				>
					<ArrowLeft className='mr-2 h-4 w-4' />{' '}
					{t('common.goBack') || 'Ortga qaytish'}
				</Button>
			</div>
		)
	}

	// 10. ASOSIY FORMA
	return (
		<motion.div
			variants={containerVariants}
			initial='hidden'
			animate='show'
			className='max-w-5xl mx-auto space-y-6 pb-24 relative pt-2'
		>
			{/* 🏷️ Tepa qism */}
			<motion.div
				variants={itemVariants}
				className='flex items-center gap-4 border-b pb-4'
			>
				<Button
					variant='outline'
					size='icon'
					onClick={() => router.push(`/admin/mentors/${id}/view`)}
					className='h-10 w-10 rounded-full shrink-0 shadow-sm'
				>
					<ArrowLeft className='h-5 w-5' />
				</Button>
				<div>
					<h1 className='text-2xl font-bold tracking-tight'>
						{t('mentors.editMentor') || 'Mentorni Tahrirlash'}
					</h1>
					<p className='text-muted-foreground text-sm font-medium font-mono mt-0.5'>
						ID: {id}
					</p>
				</div>
			</motion.div>

			<form onSubmit={handleSubmit} className='space-y-6'>
				{/* ========================================== */}
				{/* 1-QATOR: Asosiy ma'lumotlar & Ruxsatlar */}
				{/* ========================================== */}
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch'>
					<motion.div variants={itemVariants} className='flex flex-col'>
						<Card className='shadow-sm border-border flex-1 flex flex-col bg-card'>
							<CardHeader className='bg-muted/20 border-b pb-4'>
								<CardTitle className='text-lg'>
									{t('mentors.basicInfo') || "Asosiy ma'lumotlar"}
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4 pt-6 flex-1'>
								<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
									<div className='space-y-2'>
										<Label htmlFor='firstName'>
											Ism <span className='text-destructive'>*</span>
										</Label>
										<Input
											id='firstName'
											name='firstName'
											value={formData.firstName}
											onChange={handleTextChange}
											required
											className='bg-background'
										/>
									</div>
									<div className='space-y-2'>
										<Label htmlFor='lastName'>
											Familiya <span className='text-destructive'>*</span>
										</Label>
										<Input
											id='lastName'
											name='lastName'
											value={formData.lastName}
											onChange={handleTextChange}
											required
											className='bg-background'
										/>
									</div>
								</div>

								<div className='space-y-2'>
									<Label htmlFor='phone'>
										Telefon raqami <span className='text-destructive'>*</span>
									</Label>
									<Input
										id='phone'
										type='tel'
										value={formData.phoneNumber}
										onChange={handlePhoneChange}
										placeholder='+998 90 123 45 67'
										required
										className='bg-background font-mono'
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
											<SelectTrigger className='bg-background'>
												<SelectValue placeholder='Kursni tanlang' />
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													<SelectLabel>Bakalavr</SelectLabel>
													{['1-kurs', '2-kurs', '3-kurs', '4-kurs'].map(k => (
														<SelectItem key={k} value={`${k} (Bakalavr)`}>
															{k} (Bakalavr)
														</SelectItem>
													))}
												</SelectGroup>
												<SelectGroup>
													<SelectLabel>Magistratura</SelectLabel>
													{['1-kurs', '2-kurs'].map(k => (
														<SelectItem key={k} value={`${k} (Magistratura)`}>
															{k} (Magistratura)
														</SelectItem>
													))}
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
												className='text-center bg-background'
											/>
											<span className='text-muted-foreground font-bold'>-</span>
											<Input
												name='groupSuffix'
												value={formData.groupSuffix}
												onChange={handleTextChange}
												placeholder='21'
												className='text-center bg-background'
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
											className='bg-background'
										/>
									</div>
									<div className='space-y-2'>
										<Label htmlFor='experience'>Tajriba (yil)</Label>
										<Input
											id='experience'
											name='experience'
											type='number'
											min='0'
											value={formData.experience}
											onChange={handleTextChange}
											placeholder='Masalan: 2'
											className='bg-background'
										/>
									</div>
								</div>
							</CardContent>
						</Card>
					</motion.div>

					<motion.div variants={itemVariants} className='flex flex-col gap-6'>
						<Card className='shadow-sm border-blue-500/20 bg-blue-500/5 dark:bg-blue-500/10'>
							<CardHeader className='border-b border-blue-500/10 pb-4 bg-transparent'>
								<CardTitle className='text-lg flex items-center gap-2 text-blue-600 dark:text-blue-400'>
									<ShieldAlert className='h-5 w-5' /> Tizim ruxsatlari
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4 pt-6'>
								<div className='flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-card hover:border-primary/40 transition-colors'>
									<div className='space-y-1 pr-4'>
										<Label
											className='text-base font-bold cursor-pointer'
											htmlFor='mentorSwitch'
										>
											Mentor ruxsati
										</Label>
										<p className='text-xs text-muted-foreground'>
											Foydalanuvchiga mentor paneliga to'liq kirish huquqini
											beradi.
										</p>
									</div>
									<Switch
										id='mentorSwitch'
										checked={formData.isMentor}
										onCheckedChange={val =>
											setFormData(p => ({ ...p, isMentor: val }))
										}
									/>
								</div>

								<div
									className={`flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-card transition-colors ${formData.status === 'blocked' ? 'border-destructive/50' : 'hover:border-primary/40'}`}
								>
									<div className='space-y-1 pr-4'>
										<Label
											className={`text-base font-bold ${formData.status === 'blocked' ? 'text-destructive' : 'text-foreground'}`}
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
											className={`w-[130px] font-semibold ${formData.status === 'blocked' ? 'text-destructive border-destructive/30 bg-destructive/10' : 'text-green-600 dark:text-green-400 border-green-500/30 bg-green-500/10'}`}
										>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem
												value='active'
												className='text-green-600 dark:text-green-400 font-medium'
											>
												Faol
											</SelectItem>
											<SelectItem
												value='blocked'
												className='text-destructive font-medium'
											>
												Bloklangan
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</CardContent>
						</Card>

						<Card className='shadow-sm border-border flex-1 flex flex-col bg-card'>
							<CardHeader className='bg-muted/20 border-b pb-4'>
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
									className='flex-1 min-h-[120px] resize-y bg-background'
									placeholder='Assalomu alaykum, men...'
								/>
							</CardContent>
						</Card>
					</motion.div>
				</div>

				{/* ========================================== */}
				{/* 2-QATOR: Tillar va Ko'nikmalar */}
				{/* ========================================== */}
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch'>
					<motion.div variants={itemVariants} className='flex flex-col'>
						<Card className='shadow-sm border-border flex-1 flex flex-col bg-card'>
							<CardHeader className='bg-muted/20 border-b pb-4'>
								<CardTitle className='text-lg'>Tillarni bilishi</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4 pt-6 flex-1 flex flex-col'>
								<div className='flex flex-col sm:flex-row gap-2'>
									<Input
										className='flex-1 bg-background'
										placeholder='Til nomi (mas: Ingliz tili)'
										value={newLangName}
										onChange={e => setNewLangName(e.target.value)}
										onKeyDown={e =>
											e.key === 'Enter' && (e.preventDefault(), addLanguage())
										}
									/>
									<Select value={newLangLevel} onValueChange={setNewLangLevel}>
										<SelectTrigger className='w-full sm:w-[100px] bg-background'>
											<SelectValue placeholder='Daraja' />
										</SelectTrigger>
										<SelectContent>
											{['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(lvl => (
												<SelectItem key={lvl} value={lvl}>
													{lvl}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<div className='flex items-center space-x-2 border border-border rounded-md px-3 h-10 w-full sm:w-auto shrink-0 bg-muted/30 text-sm'>
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
											className='flex items-center justify-between p-2 rounded-md border border-border bg-background shadow-sm hover:border-primary/20 transition-colors'
										>
											<div className='flex items-center gap-2'>
												<span className='font-semibold text-sm'>
													{lang.lang}
												</span>
												<Badge
													variant='secondary'
													className='text-[10px] font-mono shadow-none'
												>
													{lang.level}
												</Badge>
												{lang.isNative && (
													<Badge
														variant='outline'
														className='text-[10px] bg-green-500/10 text-green-600 border-green-500/20 shadow-none uppercase tracking-wider'
													>
														Ona tili
													</Badge>
												)}
											</div>
											<Button
												type='button'
												variant='ghost'
												size='icon'
												className='h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10'
												onClick={() => removeLanguage(index)}
											>
												<Trash2 className='h-4 w-4' />
											</Button>
										</div>
									))}
									{languages.length === 0 && (
										<p className='text-sm text-muted-foreground text-center py-6 italic border border-dashed rounded-lg bg-muted/10'>
											Tillar hali qo'shilmagan.
										</p>
									)}
								</div>
							</CardContent>
						</Card>
					</motion.div>

					<motion.div variants={itemVariants} className='flex flex-col'>
						<Card className='shadow-sm border-border flex-1 flex flex-col bg-card'>
							<CardHeader className='bg-muted/20 border-b pb-4'>
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
										className='bg-background'
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
								<div className='flex flex-wrap gap-2 flex-1 content-start mt-4'>
									{skills.map((skill, idx) => (
										<Badge
											key={idx}
											variant='outline'
											className='pl-3 pr-1 py-1 flex items-center gap-1.5 text-sm bg-primary/5 hover:bg-primary/10 border-primary/20 text-foreground transition-colors shadow-sm'
										>
											{skill}
											<button
												type='button'
												onClick={() => removeSkill(skill)}
												className='hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5 transition-colors'
											>
												<X className='h-3.5 w-3.5' />
											</button>
										</Badge>
									))}
									{skills.length === 0 && (
										<p className='text-sm text-muted-foreground text-center py-6 italic border border-dashed rounded-lg bg-muted/10 w-full'>
											Texnik ko'nikmalar qo'shilmagan.
										</p>
									)}
								</div>
							</CardContent>
						</Card>
					</motion.div>
				</div>

				{/* ========================================== */}
				{/* 3-QATOR: Dars Jadvali */}
				{/* ========================================== */}
				<motion.div variants={itemVariants}>
					<Card className='shadow-sm border-border bg-card'>
						<CardHeader className='flex flex-col sm:flex-row sm:items-center justify-between border-b bg-muted/20 pb-4 gap-4'>
							<div>
								<CardTitle className='text-lg'>Dars o'tish vaqtlari</CardTitle>
								<CardDescription>
									Mentoring qilish uchun mavjud vaqtlar
								</CardDescription>
							</div>
							<Button
								type='button'
								size='sm'
								variant='outline'
								onClick={addScheduleRow}
								className='h-9 font-semibold bg-background shadow-sm hover:border-primary/50'
							>
								<Plus className='h-4 w-4 mr-1.5' /> Vaqt qo'shish
							</Button>
						</CardHeader>
						<CardContent className='space-y-3 pt-6'>
							{schedule.map((slot, idx) => (
								<div
									key={idx}
									className='flex items-center gap-2 sm:gap-4 flex-wrap sm:flex-nowrap p-4 border border-border/50 rounded-xl bg-muted/10 hover:bg-muted/30 transition-colors shadow-sm'
								>
									<div className='w-full sm:w-1/3'>
										<Label className='text-xs text-muted-foreground mb-1 block uppercase tracking-wider font-semibold'>
											Hafta kuni
										</Label>
										<Select
											value={slot.day}
											onValueChange={v => handleScheduleChange(idx, 'day', v)}
										>
											<SelectTrigger className='bg-background'>
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
										<Label className='text-xs text-muted-foreground mb-1 block uppercase tracking-wider font-semibold'>
											Boshlanish vaqti
										</Label>
										<Input
											type='time'
											value={slot.from}
											onChange={e =>
												handleScheduleChange(idx, 'from', e.target.value)
											}
											className='bg-background'
										/>
									</div>
									<div className='w-full sm:w-1/3 flex items-end gap-3'>
										<div className='flex-1'>
											<Label className='text-xs text-muted-foreground mb-1 block uppercase tracking-wider font-semibold'>
												Tugash vaqti
											</Label>
											<Input
												type='time'
												value={slot.to}
												onChange={e =>
													handleScheduleChange(idx, 'to', e.target.value)
												}
												className='bg-background'
											/>
										</div>
										<Button
											type='button'
											variant='outline'
											size='icon'
											onClick={() => removeScheduleRow(idx)}
											className='text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0 h-10 w-10 border-destructive/20 shadow-sm'
										>
											<Trash2 className='h-4 w-4' />
										</Button>
									</div>
								</div>
							))}
							{schedule.length === 0 && (
								<div className='text-center py-10 bg-muted/10 border border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground'>
									<Calendar className='h-10 w-10 mb-2 opacity-20' />
									<p className='text-sm italic'>
										Hozircha bo'sh vaqtlar jadvali kiritilmagan.
									</p>
								</div>
							)}
						</CardContent>
					</Card>
				</motion.div>

				{/* 🔒 STICKY FOOTER (Save Actions) */}
				<motion.div
					variants={itemVariants}
					className='flex justify-end gap-3 p-4 bg-background/80 backdrop-blur-xl rounded-xl border border-border/50 shadow-lg sticky bottom-4 z-50 transition-all hover:shadow-xl'
				>
					<Button
						type='button'
						variant='outline'
						disabled={isSaving}
						onClick={() => router.push(`/admin/mentors/${id}/view`)}
					>
						{t('common.cancel') || 'Bekor qilish'}
					</Button>
					<Button
						type='submit'
						disabled={isSaving}
						className='bg-primary px-8 font-semibold shadow-md'
					>
						{isSaving ? (
							<Loader2 className='mr-2 h-4 w-4 animate-spin' />
						) : (
							<Save className='mr-2 h-4 w-4' />
						)}
						{t('common.saveChanges') || "O'zgarishlarni saqlash"}
					</Button>
				</motion.div>
			</form>
		</motion.div>
	)
}
