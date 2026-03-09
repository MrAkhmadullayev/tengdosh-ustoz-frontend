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
import { useTranslation } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import {
	Check,
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
import { useCallback, useEffect, useMemo, useState } from 'react'

export default function SettingsPage() {
	const { t } = useTranslation()
	const { theme, setTheme } = useTheme()

	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [saved, setSaved] = useState(false)
	const [form, setForm] = useState({})

	const [languages, setLanguages] = useState([])
	const [newLangName, setNewLangName] = useState('')
	const [newLangLevel, setNewLangLevel] = useState('B2')
	const [newLangNative, setNewLangNative] = useState(false)
	const [skills, setSkills] = useState([])
	const [newSkill, setNewSkill] = useState('')
	const [schedule, setSchedule] = useState([])

	const daysList = useMemo(
		() => [
			{ key: 'monday', label: t('days.monday') },
			{ key: 'tuesday', label: t('days.tuesday') },
			{ key: 'wednesday', label: t('days.wednesday') },
			{ key: 'thursday', label: t('days.thursday') },
			{ key: 'friday', label: t('days.friday') },
			{ key: 'saturday', label: t('days.saturday') },
			{ key: 'sunday', label: t('days.sunday') },
		],
		[t],
	)
	const roleLabel = useMemo(
		() => ({
			admin: t('auth.roleAdmin'),
			mentor: t('auth.roleMentor'),
			student: t('auth.roleStudent'),
		}),
		[t],
	)

	const fetchUser = useCallback(async () => {
		try {
			const res = await api.get('/auth/me')
			if (res.data.success) {
				const d = res.data.user
				const [gPref, gSuff] = (d.group || '-').split('-')

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

	const updateField = useCallback((key, value) => {
		setForm(prev => ({ ...prev, [key]: value }))
		setSaved(false)
	}, [])

	const handlePhoneChange = useCallback(
		val => {
			let digits = val.replace(/\D/g, '').substring(0, 9)
			updateField('phoneNumber', digits)
		},
		[updateField],
	)

	const formatPhoneDisplay = useCallback(digits => {
		if (!digits) return ''
		let res = digits.substring(0, 2)
		if (digits.length > 2) res += ' ' + digits.substring(2, 5)
		if (digits.length > 5) res += ' ' + digits.substring(5, 7)
		if (digits.length > 7) res += ' ' + digits.substring(7, 9)
		return res
	}, [])

	const handleSave = async () => {
		try {
			setSaving(true)
			const finalGroup =
				form.groupPrefix && form.groupSuffix
					? `${form.groupPrefix}-${form.groupSuffix}`
					: form.groupPrefix || form.groupSuffix || ''

			const fullPhoneNumber = form.phoneNumber ? `+998${form.phoneNumber}` : ''

			const payload = {
				...form,
				group: finalGroup,
				phoneNumber: fullPhoneNumber,
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
			alert(t('settings.saveError'))
		} finally {
			setSaving(false)
		}
	}

	const themes = [
		{ key: 'light', label: t('settings.light'), icon: Sun },
		{ key: 'dark', label: t('settings.dark'), icon: Moon },
		{ key: 'system', label: t('settings.systemTheme'), icon: Monitor },
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
					{t('settings.title')}
				</h1>
				<p className='text-muted-foreground text-sm'>
					{t('settings.description')}
				</p>
			</div>

			<Tabs defaultValue='profile' className='w-full'>
				<TabsList className='grid w-full sm:w-[400px] grid-cols-2 mb-8'>
					<TabsTrigger value='profile' className='gap-2'>
						<User className='h-4 w-4' /> {t('profile.title')}
					</TabsTrigger>
					<TabsTrigger value='system' className='gap-2'>
						<Settings2 className='h-4 w-4' /> {t('settings.system')}
					</TabsTrigger>
				</TabsList>

				<TabsContent value='profile' className='space-y-6 outline-none'>
					<Card>
						<CardHeader>
							<CardTitle>{t('settings.profileInfo')}</CardTitle>
							<CardDescription>{t('settings.profileInfoDesc')}</CardDescription>
						</CardHeader>
						<CardContent className='space-y-6'>
							<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<Label htmlFor='firstName'>{t('settings.firstName')}</Label>
									<Input
										id='firstName'
										value={form.firstName}
										onChange={e => updateField('firstName', e.target.value)}
										placeholder={t('settings.firstNamePlaceholder')}
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='lastName'>{t('settings.lastName')}</Label>
									<Input
										id='lastName'
										value={form.lastName}
										onChange={e => updateField('lastName', e.target.value)}
										placeholder={t('settings.lastNamePlaceholder')}
									/>
								</div>
							</div>

							<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<Label htmlFor='phoneNumber'>
										{t('settings.phoneNumber')}
									</Label>
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

								{(role === 'student' || role === 'mentor') && (
									<div className='space-y-2'>
										<Label>{t('settings.selectCourse')}</Label>
										<Select
											value={form.course}
											onValueChange={val => updateField('course', val)}
										>
											<SelectTrigger>
												<SelectValue placeholder={t('settings.selectCourse')} />
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													<SelectLabel>{t('settings.bachelor')}</SelectLabel>
													{[1, 2, 3, 4].map(c => (
														<SelectItem
															key={c}
															value={`${c}-kurs (${t('settings.bachelor')})`}
														>
															{c}-kurs
														</SelectItem>
													))}
												</SelectGroup>
												<SelectGroup>
													<SelectLabel>{t('settings.master')}</SelectLabel>
													{[1, 2].map(c => (
														<SelectItem
															key={c}
															value={`${c}-kurs (${t('settings.master')})`}
														>
															{c}-kurs
														</SelectItem>
													))}
												</SelectGroup>
											</SelectContent>
										</Select>
									</div>
								)}
							</div>

							{(role === 'student' || role === 'mentor') && (
								<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
									<div className='space-y-2'>
										<Label>{t('profile.group')}</Label>
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

									{role === 'mentor' && (
										<div className='space-y-2'>
											<Label htmlFor='specialty'>
												{t('profile.specialty')}
											</Label>
											<Input
												id='specialty'
												value={form.specialty}
												onChange={e => updateField('specialty', e.target.value)}
												placeholder={t('settings.specialtyPlaceholder')}
											/>
										</div>
									)}
								</div>
							)}

							{role === 'mentor' && (
								<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
									<div className='space-y-2'>
										<Label htmlFor='experience'>
											{t('settings.experienceYears')}
										</Label>
										<Input
											id='experience'
											type='number'
											min='0'
											value={form.experience}
											onChange={e => updateField('experience', e.target.value)}
											placeholder={t('settings.experiencePlaceholder')}
										/>
									</div>
								</div>
							)}

							<div className='space-y-2'>
								<Label htmlFor='about' className='flex justify-between'>
									{t('settings.aboutYou')}
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
									placeholder={t('settings.aboutPlaceholder')}
								/>
							</div>

							<div className='flex items-center gap-2 pt-2 text-sm text-muted-foreground'>
								<span>{t('settings.role')}:</span>
								<Badge variant='outline' className='capitalize'>
									{roleLabel[role] || role}
								</Badge>
							</div>
						</CardContent>
						<CardFooter className='border-t px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 bg-muted/20'>
							<div className='text-sm text-muted-foreground w-full sm:w-auto text-center sm:text-left'>
								{saved ? (
									<span className='text-emerald-600 font-medium flex items-center justify-center sm:justify-start gap-1'>
										<Check className='w-4 h-4' /> {t('settings.saveSuccess')}
									</span>
								) : (
									t('settings.saveReminder')
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
								{t('common.save')}
							</Button>
						</CardFooter>
					</Card>

					{role === 'mentor' && (
						<div className='space-y-6'>
							<Card>
								<CardHeader>
									<CardTitle className='text-base'>
										{t('settings.languages')}
									</CardTitle>
								</CardHeader>
								<CardContent className='space-y-4'>
									<div className='flex flex-col sm:flex-row gap-3'>
										<Input
											className='flex-1'
											placeholder={t('settings.languagePlaceholder')}
											value={newLangName}
											onChange={e => setNewLangName(e.target.value)}
											onKeyDown={e =>
												e.key === 'Enter' &&
												(e.preventDefault(),
												setLanguages([
													...languages,
													{
														lang: newLangName,
														level: newLangLevel,
														isNative: newLangNative,
													},
												]))
											}
										/>
										<div className='flex gap-2 w-full sm:w-auto'>
											<Select
												value={newLangLevel}
												onValueChange={setNewLangLevel}
											>
												<SelectTrigger className='w-full sm:w-[110px]'>
													<SelectValue placeholder={t('settings.level')} />
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
													{t('profile.nativeLanguage')}
												</label>
											</div>
											<Button
												type='button'
												onClick={() => {
													if (newLangName) {
														setLanguages([
															...languages,
															{
																lang: newLangName,
																level: newLangLevel,
																isNative: newLangNative,
															},
														])
														setNewLangName('')
													}
												}}
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
															{t('profile.nativeLanguage')}
														</Badge>
													)}
												</div>
												<Button
													type='button'
													variant='ghost'
													size='icon'
													className='h-8 w-8 text-destructive'
													onClick={() =>
														setLanguages(
															languages.filter((_, idx) => idx !== i),
														)
													}
												>
													<Trash2 className='h-4 w-4' />
												</Button>
											</div>
										))}
										{languages.length === 0 && (
											<p className='text-sm text-muted-foreground text-center py-4 italic border border-dashed rounded-md'>
												{t('settings.noLanguages')}
											</p>
										)}
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className='text-base'>
										{t('settings.technicalSkills')}
									</CardTitle>
								</CardHeader>
								<CardContent className='space-y-4'>
									<div className='flex gap-2'>
										<Input
											placeholder={t('settings.skillPlaceholder')}
											value={newSkill}
											onChange={e => setNewSkill(e.target.value)}
											onKeyDown={e =>
												e.key === 'Enter' &&
												(e.preventDefault(), setSkills([...skills, newSkill]))
											}
										/>
										<Button
											type='button'
											onClick={() => {
												if (newSkill) {
													setSkills([...skills, newSkill])
													setNewSkill('')
												}
											}}
											className='shrink-0 px-4'
										>
											{t('settings.add')}
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
													onClick={() =>
														setSkills(skills.filter(s => s !== skill))
													}
													className='text-muted-foreground hover:text-foreground rounded-full transition-colors'
												>
													<X className='h-3.5 w-3.5' />
												</button>
											</Badge>
										))}
										{skills.length === 0 && (
											<p className='text-sm text-muted-foreground text-center py-4 italic border border-dashed rounded-md w-full'>
												{t('settings.noSkills')}
											</p>
										)}
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className='flex flex-row items-center justify-between pb-4 border-b'>
									<div>
										<CardTitle className='text-base'>
											{t('settings.lessonTimes')}
										</CardTitle>
										<CardDescription className='mt-1'>
											{t('settings.lessonTimesDesc')}
										</CardDescription>
									</div>
									<Button
										type='button'
										size='sm'
										variant='outline'
										onClick={() =>
											setSchedule([
												...schedule,
												{ day: t('days.monday'), from: '09:00', to: '18:00' },
											])
										}
										className='h-9 shrink-0'
									>
										<Plus className='h-4 w-4 sm:mr-2' />{' '}
										<span className='hidden sm:inline'>
											{t('settings.addTime')}
										</span>
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
													{t('settings.day')}
												</Label>
												<Select
													value={slot.day}
													onValueChange={v => {
														const n = [...schedule]
														n[idx].day = v
														setSchedule(n)
													}}
												>
													<SelectTrigger>
														<SelectValue placeholder={t('common.search')} />
													</SelectTrigger>
													<SelectContent>
														{daysList.map(d => (
															<SelectItem key={d.key} value={d.label}>
																{d.label}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</div>
											<div className='sm:col-span-3 space-y-1.5'>
												<Label className='text-xs text-muted-foreground'>
													{t('settings.start')}
												</Label>
												<Input
													type='time'
													value={slot.from}
													onChange={e => {
														const n = [...schedule]
														n[idx].from = e.target.value
														setSchedule(n)
													}}
												/>
											</div>
											<div className='sm:col-span-5 flex items-end gap-3'>
												<div className='flex-1 space-y-1.5'>
													<Label className='text-xs text-muted-foreground'>
														{t('settings.end')}
													</Label>
													<Input
														type='time'
														value={slot.to}
														onChange={e => {
															const n = [...schedule]
															n[idx].to = e.target.value
															setSchedule(n)
														}}
													/>
												</div>
												<Button
													type='button'
													variant='outline'
													size='icon'
													onClick={() =>
														setSchedule(schedule.filter((_, i) => i !== idx))
													}
													className='shrink-0 text-destructive border-destructive/20 hover:bg-destructive hover:text-destructive-foreground'
												>
													<Trash2 className='h-4 w-4' />
												</Button>
											</div>
										</div>
									))}
									{schedule.length === 0 && (
										<p className='text-sm text-muted-foreground text-center py-8 border border-dashed rounded-lg italic'>
											{t('settings.noSchedule')}
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
									{t('settings.saveAll')}
								</Button>
							</div>
						</div>
					)}
				</TabsContent>

				<TabsContent value='system' className='space-y-6 outline-none'>
					<Card>
						<CardHeader>
							<CardTitle className='text-base flex items-center gap-2'>
								<Sun className='w-4 h-4' /> {t('settings.themeTitle')}
							</CardTitle>
							<CardDescription>{t('settings.themeDesc')}</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
								{themes.map(ti => {
									const Icon = ti.icon
									const isActive = theme === ti.key
									return (
										<button
											key={ti.key}
											onClick={() => setTheme(ti.key)}
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
												{ti.label}
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
