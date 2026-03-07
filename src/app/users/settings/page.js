'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import api from '@/lib/api'
import { cn } from '@/lib/utils'
import {
	Check,
	Globe,
	Loader2,
	Monitor,
	Moon,
	Plus,
	Save,
	Settings2,
	Sun,
	Trash2,
	User,
	X,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useCallback, useEffect, useState } from 'react'

export default function SettingsPage() {
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [saved, setSaved] = useState(false)
	const [form, setForm] = useState({})
	const { theme, setTheme } = useTheme()

	// Mentor-specific states
	const [languages, setLanguages] = useState([])
	const [newLangName, setNewLangName] = useState('')
	const [newLangLevel, setNewLangLevel] = useState('B2')
	const [newLangNative, setNewLangNative] = useState(false)
	const [skills, setSkills] = useState([])
	const [newSkill, setNewSkill] = useState('')
	const [schedule, setSchedule] = useState([])

	const fetchUser = useCallback(async () => {
		try {
			const res = await api.get('/auth/me')
			if (res.data.success) {
				const d = res.data.user
				const [gPref, gSuff] = (d.group || '-').split('-')

				// Telefon raqamdan +998 ni olib tashlash (faqat 9 xonali qismini saqlaymiz)
				let phoneStr = d.phoneNumber || ''
				phoneStr = phoneStr.replace(/\D/g, '')
				if (phoneStr.startsWith('998')) {
					phoneStr = phoneStr.substring(3)
				}

				setUser(d)
				setForm({
					firstName: d.firstName || '',
					lastName: d.lastName || '',
					phoneNumber: phoneStr,
					about: d.about || '',
					course: d.course || '',
					groupPrefix: gPref || '',
					groupSuffix: gSuff || '',
					specialty: d.specialty || '',
					experience: d.experience || '',
					language: d.language || 'uz',
				})
				setLanguages(d.languages || [])
				setSkills(d.skills || [])
				setSchedule(d.schedule || [])
			}
		} catch (e) {
			console.error(e)
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		fetchUser()
	}, [fetchUser])

	const updateField = (key, value) => {
		setForm(prev => ({ ...prev, [key]: value }))
		setSaved(false)
	}

	// --- Phone Number Handlers ---
	const handlePhoneChange = val => {
		// Faqat raqamlarni olib qolish va max 9 ta raqam
		let digits = val.replace(/\D/g, '').substring(0, 9)
		updateField('phoneNumber', digits)
	}

	const formatPhoneDisplay = digits => {
		if (!digits) return ''
		let res = digits.substring(0, 2)
		if (digits.length > 2) res += ' ' + digits.substring(2, 5)
		if (digits.length > 5) res += ' ' + digits.substring(5, 7)
		if (digits.length > 7) res += ' ' + digits.substring(7, 9)
		return res
	}

	// --- Array field helpers ---
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
			setSaved(false)
		}
	}

	const removeLanguage = i => {
		setLanguages(languages.filter((_, idx) => idx !== i))
		setSaved(false)
	}

	const addSkill = () => {
		if (newSkill.trim() && !skills.includes(newSkill.trim())) {
			setSkills([...skills, newSkill.trim()])
			setNewSkill('')
			setSaved(false)
		}
	}

	const removeSkill = s => {
		setSkills(skills.filter(x => x !== s))
		setSaved(false)
	}

	const addScheduleRow = () => {
		setSchedule([...schedule, { day: 'Dushanba', from: '09:00', to: '18:00' }])
		setSaved(false)
	}

	const removeScheduleRow = i => {
		setSchedule(schedule.filter((_, idx) => idx !== i))
		setSaved(false)
	}

	const handleScheduleChange = (i, field, val) => {
		const n = [...schedule]
		n[i][field] = val
		setSchedule(n)
		setSaved(false)
	}

	// --- Save Handler ---
	const handleSave = async () => {
		try {
			setSaving(true)
			const finalGroup =
				form.groupPrefix && form.groupSuffix
					? `${form.groupPrefix}-${form.groupSuffix}`
					: form.groupPrefix || form.groupSuffix || ''

			const fullPhoneNumber = form.phoneNumber ? `+998${form.phoneNumber}` : ''

			const payload = {
				firstName: form.firstName,
				lastName: form.lastName,
				phoneNumber: fullPhoneNumber,
				about: form.about,
				course: form.course,
				group: finalGroup,
				specialty: form.specialty,
				experience: form.experience,
				language: form.language,
				languages,
				skills,
				schedule,
			}
			const res = await api.put('/auth/profile', payload)
			if (res.data.success) {
				setSaved(true)
				setTimeout(() => setSaved(false), 3000)
			}
		} catch (e) {
			console.error(e)
			alert("Ma'lumotlarni saqlashda xatolik yuz berdi")
		} finally {
			setSaving(false)
		}
	}

	const themes = [
		{ key: 'light', label: "Yorug'", icon: Sun },
		{ key: 'dark', label: "Qorong'i", icon: Moon },
		{ key: 'system', label: 'Tizim', icon: Monitor },
	]

	const langs = [
		{ key: 'uz', label: "O'zbek tili", flag: '🇺🇿' },
		{ key: 'ru', label: 'Русский', flag: '🇷🇺' },
		{ key: 'en', label: 'English', flag: '🇬🇧' },
	]

	if (loading) {
		return (
			<div className='w-full max-w-4xl mx-auto space-y-6 pb-12'>
				<div className='space-y-2'>
					<Skeleton className='h-8 w-48' />
					<Skeleton className='h-4 w-72' />
				</div>
				<Skeleton className='h-12 w-full max-w-[400px]' />
				<Skeleton className='h-[500px] w-full' />
			</div>
		)
	}

	const role = user?.role

	return (
		<div className='w-full max-w-4xl mx-auto space-y-6 pb-12'>
			<div className='flex flex-col gap-1.5 pb-2'>
				<h1 className='text-2xl sm:text-3xl font-bold tracking-tight'>
					Sozlamalar
				</h1>
				<p className='text-muted-foreground text-sm'>
					Shaxsiy ma&apos;lumotlaringiz va tizim sozlamalari.
				</p>
			</div>

			<Tabs defaultValue='profile' className='w-full'>
				<TabsList className='grid w-full sm:w-[400px] grid-cols-2 mb-8'>
					<TabsTrigger value='profile' className='gap-2'>
						<User className='h-4 w-4' /> Profil
					</TabsTrigger>
					<TabsTrigger value='system' className='gap-2'>
						<Settings2 className='h-4 w-4' /> Tizim
					</TabsTrigger>
				</TabsList>

				{/* ===== PROFILE TAB ===== */}
				<TabsContent value='profile' className='space-y-6 outline-none'>
					<Card>
						<CardHeader>
							<CardTitle>Profil ma&apos;lumotlari</CardTitle>
							<CardDescription>
								Shaxsiy ma&apos;lumotlaringizni tahrirlang va yangilang.
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-6'>
							{/* Ism, Familiya */}
							<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<Label htmlFor='firstName'>Ism</Label>
									<Input
										id='firstName'
										value={form.firstName}
										onChange={e => updateField('firstName', e.target.value)}
										placeholder='Ismingizni kiriting'
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='lastName'>Familiya</Label>
									<Input
										id='lastName'
										value={form.lastName}
										onChange={e => updateField('lastName', e.target.value)}
										placeholder='Familiyangizni kiriting'
									/>
								</div>
							</div>

							{/* Telefon va Kurs */}
							<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<Label htmlFor='phoneNumber'>Telefon raqam</Label>
									<div className='flex rounded-md shadow-sm'>
										<span className='inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm'>
											+998
										</span>
										<Input
											id='phoneNumber'
											type='tel'
											className='rounded-l-none'
											value={formatPhoneDisplay(form.phoneNumber)}
											onChange={e => handlePhoneChange(e.target.value)}
											placeholder='90 123 45 67'
										/>
									</div>
								</div>

								{/* Kurs — faqat mentor & student uchun */}
								{(role === 'student' || role === 'mentor') && (
									<div className='space-y-2'>
										<Label>Kurs</Label>
										<Select
											value={form.course}
											onValueChange={val => updateField('course', val)}
										>
											<SelectTrigger>
												<SelectValue placeholder='Kursni tanlang' />
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													<SelectLabel>Bakalavr</SelectLabel>
													<SelectItem value='1-kurs (Bakalavr)'>
														1-kurs
													</SelectItem>
													<SelectItem value='2-kurs (Bakalavr)'>
														2-kurs
													</SelectItem>
													<SelectItem value='3-kurs (Bakalavr)'>
														3-kurs
													</SelectItem>
													<SelectItem value='4-kurs (Bakalavr)'>
														4-kurs
													</SelectItem>
												</SelectGroup>
												<SelectGroup>
													<SelectLabel>Magistratura</SelectLabel>
													<SelectItem value='1-kurs (Magistratura)'>
														1-kurs (Mag.)
													</SelectItem>
													<SelectItem value='2-kurs (Magistratura)'>
														2-kurs (Mag.)
													</SelectItem>
												</SelectGroup>
											</SelectContent>
										</Select>
									</div>
								)}
							</div>

							{/* Guruh va Yo'nalish */}
							{(role === 'student' || role === 'mentor') && (
								<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
									<div className='space-y-2'>
										<Label>Guruh</Label>
										<div className='flex items-center gap-2'>
											<Input
												value={form.groupPrefix}
												onChange={e =>
													updateField('groupPrefix', e.target.value)
												}
												placeholder='320'
												className='text-center w-full'
											/>
											<span className='text-muted-foreground'>-</span>
											<Input
												value={form.groupSuffix}
												onChange={e =>
													updateField('groupSuffix', e.target.value)
												}
												placeholder='21'
												className='text-center w-full'
											/>
										</div>
									</div>

									{/* Mentor uchun: Yo'nalish */}
									{role === 'mentor' && (
										<div className='space-y-2'>
											<Label htmlFor='specialty'>Yo&apos;nalish</Label>
											<Input
												id='specialty'
												value={form.specialty}
												onChange={e => updateField('specialty', e.target.value)}
												placeholder='masalan: Frontend'
											/>
										</div>
									)}
								</div>
							)}

							{/* Mentor: Tajriba */}
							{role === 'mentor' && (
								<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
									<div className='space-y-2'>
										<Label htmlFor='experience'>Tajriba (yil)</Label>
										<Input
											id='experience'
											type='number'
											min='0'
											value={form.experience}
											onChange={e => updateField('experience', e.target.value)}
											placeholder='masalan: 2'
										/>
									</div>
								</div>
							)}

							{/* About */}
							<div className='space-y-2'>
								<Label htmlFor='about' className='flex justify-between'>
									O&apos;zingiz haqingizda
									<span className='text-xs text-muted-foreground'>
										{(form.about || '').length} / 500
									</span>
								</Label>
								<Textarea
									id='about'
									className='min-h-[100px] resize-y'
									value={form.about}
									onChange={e => updateField('about', e.target.value)}
									maxLength={500}
									placeholder="O'zingiz haqingizda qisqacha ma'lumot qoldiring..."
								/>
							</div>

							{/* Role badge */}
							<div className='flex items-center gap-2 pt-2 text-sm text-muted-foreground'>
								<span>Rol:</span>
								<Badge variant='outline' className='capitalize'>
									{role}
								</Badge>
								{user?.username && (
									<>
										<span className='mx-1 opacity-50'>|</span>
										<span>@{user.username}</span>
									</>
								)}
							</div>
						</CardContent>
						<CardFooter className='border-t px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 bg-muted/20'>
							<div className='text-sm text-muted-foreground w-full sm:w-auto text-center sm:text-left'>
								{saved ? (
									<span className='text-emerald-600 font-medium flex items-center justify-center sm:justify-start gap-1'>
										<Check className='w-4 h-4' /> Muvaffaqiyatli saqlandi!
									</span>
								) : (
									"So'nggi o'zgarishlarni saqlashni unutmang."
								)}
							</div>
							<Button
								className='w-full sm:w-auto gap-2'
								onClick={handleSave}
								disabled={saving}
							>
								{saving ? (
									<Loader2 className='h-4 w-4 animate-spin' />
								) : (
									<Save className='h-4 w-4' />
								)}
								Saqlash
							</Button>
						</CardFooter>
					</Card>

					{/* ===== MENTOR TABLARI: Tillar, Ko'nikmalar, Jadval ===== */}
					{role === 'mentor' && (
						<div className='space-y-6'>
							{/* Tillar */}
							<Card>
								<CardHeader>
									<CardTitle className='text-base'>Tillarni bilishi</CardTitle>
								</CardHeader>
								<CardContent className='space-y-4'>
									<div className='flex flex-col sm:flex-row gap-3'>
										<Input
											className='flex-1'
											placeholder='Til nomi (mas: Ingliz tili)'
											value={newLangName}
											onChange={e => setNewLangName(e.target.value)}
											onKeyDown={e =>
												e.key === 'Enter' && (e.preventDefault(), addLanguage())
											}
										/>
										<div className='flex gap-2 w-full sm:w-auto'>
											<Select
												value={newLangLevel}
												onValueChange={setNewLangLevel}
											>
												<SelectTrigger className='w-full sm:w-[110px]'>
													<SelectValue placeholder='Daraja' />
												</SelectTrigger>
												<SelectContent>
													{['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(l => (
														<SelectItem key={l} value={l}>
															{l}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<div className='flex items-center space-x-2 border rounded-md px-3 bg-muted/20 text-sm'>
												<Checkbox
													id='isNative'
													checked={newLangNative}
													onCheckedChange={setNewLangNative}
												/>
												<label
													htmlFor='isNative'
													className='font-medium cursor-pointer whitespace-nowrap'
												>
													Ona tili
												</label>
											</div>
											<Button
												type='button'
												onClick={addLanguage}
												size='icon'
												className='shrink-0'
											>
												<Plus className='h-4 w-4' />
											</Button>
										</div>
									</div>
									<div className='space-y-2'>
										{languages.map((lang, i) => (
											<div
												key={i}
												className='flex items-center justify-between p-3 rounded-md border bg-card'
											>
												<div className='flex items-center gap-3'>
													<span className='font-medium text-sm'>
														{lang.lang}
													</span>
													<Badge variant='secondary' className='text-xs'>
														{lang.level}
													</Badge>
													{lang.isNative && (
														<Badge
															variant='outline'
															className='text-xs border-emerald-200 text-emerald-600 bg-emerald-50 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-400'
														>
															Ona tili
														</Badge>
													)}
												</div>
												<Button
													type='button'
													variant='ghost'
													size='icon'
													className='h-8 w-8 text-destructive'
													onClick={() => removeLanguage(i)}
												>
													<Trash2 className='h-4 w-4' />
												</Button>
											</div>
										))}
										{languages.length === 0 && (
											<p className='text-sm text-muted-foreground text-center py-4 italic border border-dashed rounded-md'>
												Tillar hali qo&apos;shilmagan.
											</p>
										)}
									</div>
								</CardContent>
							</Card>

							{/* Texnik ko'nikmalar */}
							<Card>
								<CardHeader>
									<CardTitle className='text-base'>
										Texnik ko&apos;nikmalar
									</CardTitle>
								</CardHeader>
								<CardContent className='space-y-4'>
									<div className='flex gap-2'>
										<Input
											placeholder='Masalan: ReactJS, Figma, Python...'
											value={newSkill}
											onChange={e => setNewSkill(e.target.value)}
											onKeyDown={e =>
												e.key === 'Enter' && (e.preventDefault(), addSkill())
											}
										/>
										<Button
											type='button'
											onClick={addSkill}
											className='shrink-0 px-4'
										>
											Qo'shish
										</Button>
									</div>
									<div className='flex flex-wrap gap-2 pt-2'>
										{skills.map((skill, i) => (
											<Badge
												key={i}
												variant='secondary'
												className='px-3 py-1.5 flex items-center gap-2 text-sm font-normal'
											>
												{skill}
												<button
													type='button'
													onClick={() => removeSkill(skill)}
													className='text-muted-foreground hover:text-foreground rounded-full transition-colors'
												>
													<X className='h-3.5 w-3.5' />
												</button>
											</Badge>
										))}
										{skills.length === 0 && (
											<p className='text-sm text-muted-foreground text-center py-4 italic border border-dashed rounded-md w-full'>
												Texnik ko&apos;nikmalar qo&apos;shilmagan.
											</p>
										)}
									</div>
								</CardContent>
							</Card>

							{/* Dars vaqtlari */}
							<Card>
								<CardHeader className='flex flex-row items-center justify-between pb-4 border-b'>
									<div>
										<CardTitle className='text-base'>
											Dars o&apos;tish vaqtlari
										</CardTitle>
										<CardDescription className='mt-1'>
											Qaysi kunlari va qaysi vaqtda dars o'tishingizni
											belgilang.
										</CardDescription>
									</div>
									<Button
										type='button'
										size='sm'
										variant='outline'
										onClick={addScheduleRow}
										className='h-9 shrink-0'
									>
										<Plus className='h-4 w-4 sm:mr-2' />{' '}
										<span className='hidden sm:inline'>Vaqt qo&apos;shish</span>
									</Button>
								</CardHeader>
								<CardContent className='space-y-4 pt-6'>
									{schedule.map((slot, idx) => (
										<div
											key={idx}
											className='grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 border rounded-lg bg-muted/10'
										>
											<div className='sm:col-span-4 space-y-1.5'>
												<Label className='text-xs text-muted-foreground'>
													Hafta kuni
												</Label>
												<Select
													value={slot.day}
													onValueChange={v =>
														handleScheduleChange(idx, 'day', v)
													}
												>
													<SelectTrigger>
														<SelectValue placeholder='Tanlang' />
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
											<div className='sm:col-span-3 space-y-1.5'>
												<Label className='text-xs text-muted-foreground'>
													Boshlanish
												</Label>
												<Input
													type='time'
													value={slot.from}
													onChange={e =>
														handleScheduleChange(idx, 'from', e.target.value)
													}
												/>
											</div>
											<div className='sm:col-span-5 flex items-end gap-3'>
												<div className='flex-1 space-y-1.5'>
													<Label className='text-xs text-muted-foreground'>
														Tugash
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
													variant='outline'
													size='icon'
													onClick={() => removeScheduleRow(idx)}
													className='shrink-0 text-destructive border-destructive/20 hover:bg-destructive hover:text-destructive-foreground'
												>
													<Trash2 className='h-4 w-4' />
												</Button>
											</div>
										</div>
									))}
									{schedule.length === 0 && (
										<p className='text-sm text-muted-foreground text-center py-8 border border-dashed rounded-lg italic'>
											Hozircha dars vaqtlari kiritilmagan.
										</p>
									)}
								</CardContent>
							</Card>

							<div className='flex justify-end pt-2'>
								<Button
									className='w-full sm:w-auto gap-2 px-8'
									onClick={handleSave}
									disabled={saving}
								>
									{saving ? (
										<Loader2 className='h-4 w-4 animate-spin' />
									) : (
										<Save className='h-4 w-4' />
									)}
									Barchasini saqlash
								</Button>
							</div>
						</div>
					)}
				</TabsContent>

				{/* ===== SYSTEM SETTINGS TAB ===== */}
				<TabsContent value='system' className='space-y-6 outline-none'>
					{/* Theme */}
					<Card>
						<CardHeader>
							<CardTitle className='text-base flex items-center gap-2'>
								<Sun className='w-4 h-4' /> Mavzu
							</CardTitle>
							<CardDescription>
								Tizimning vizual ko'rinishini tanlang.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
								{themes.map(t => {
									const Icon = t.icon
									const isActive = theme === t.key
									return (
										<button
											key={t.key}
											onClick={() => setTheme(t.key)}
											className={cn(
												'flex sm:flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all text-left sm:text-center',
												isActive
													? 'border-primary bg-primary/5'
													: 'border-muted hover:border-muted-foreground/30',
											)}
										>
											<div
												className={cn(
													'p-2.5 rounded-lg',
													isActive
														? 'bg-primary/10 text-primary'
														: 'bg-muted text-muted-foreground',
												)}
											>
												<Icon className='w-5 h-5' />
											</div>
											<span
												className={cn(
													'flex-1 text-sm font-medium',
													isActive ? 'text-primary' : 'text-muted-foreground',
												)}
											>
												{t.label}
											</span>
											{isActive && (
												<Check className='w-4 h-4 text-primary sm:hidden' />
											)}
										</button>
									)
								})}
							</div>
						</CardContent>
					</Card>

					{/* Language */}
					<Card>
						<CardHeader>
							<CardTitle className='text-base flex items-center gap-2'>
								<Globe className='w-4 h-4' /> Interfeys tili
							</CardTitle>
							<CardDescription>
								Platformadan foydalanish tilini o'zgartiring.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
								{langs.map(l => {
									const isActive = form.language === l.key
									return (
										<button
											key={l.key}
											onClick={() => {
												updateField('language', l.key)
												api
													.put('/auth/profile', { language: l.key })
													.catch(() => {})
											}}
											className={cn(
												'flex sm:flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all text-left sm:text-center',
												isActive
													? 'border-primary bg-primary/5'
													: 'border-muted hover:border-muted-foreground/30',
											)}
										>
											<span className='text-2xl p-1 bg-muted rounded-lg'>
												{l.flag}
											</span>
											<span
												className={cn(
													'flex-1 text-sm font-medium',
													isActive ? 'text-primary' : 'text-muted-foreground',
												)}
											>
												{l.label}
											</span>
											{isActive && (
												<Check className='w-4 h-4 text-primary sm:hidden' />
											)}
										</button>
									)
								})}
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	)
}
