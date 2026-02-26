'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Plus, X } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'

export default function EditMentorPage() {
	const router = useRouter()
	const { id } = useParams()

	// Asosiy ma'lumotlar state
	const [phone, setPhone] = useState('90 123 4567')

	// Ko'p qiymatli array state'lar
	const [languages, setLanguages] = useState([
		'O‘zbek tili',
		'Ingliz tili (B2)',
		'Rus tili (A2)',
	])
	const [newLang, setNewLang] = useState('')

	const [skills, setSkills] = useState([
		'JavaScript',
		'React.js',
		'Node.js',
		'Tailwind CSS',
	])
	const [newSkill, setNewSkill] = useState('')

	const [schedule, setSchedule] = useState([
		{ day: 'Dushanba', hours: '18:00 - 21:00' },
		{ day: 'Chorshanba', hours: '18:00 - 21:00' },
		{ day: 'Juma', hours: '19:00 - 22:00' },
		{ day: 'Shanba', hours: '14:00 - 18:00' },
	])

	// Telefon formatlash
	const handlePhoneChange = e => {
		let input = e.target.value.replace(/\D/g, '')
		if (input.startsWith('998')) input = input.slice(3)
		if (input.length > 9) input = input.slice(0, 9)

		let formatted = ''
		if (input.length > 0) formatted += input.substring(0, 2)
		if (input.length >= 3) formatted += ' ' + input.substring(2, 5)
		if (input.length >= 6) formatted += ' ' + input.substring(5, 9)

		setPhone(formatted)
	}

	// Tillar
	const addLanguage = () => {
		if (newLang.trim() && !languages.includes(newLang.trim())) {
			setLanguages([...languages, newLang.trim()])
			setNewLang('')
		}
	}
	const removeLanguage = lang => {
		setLanguages(languages.filter(l => l !== lang))
	}

	// Ko'nikmalar
	const addSkill = () => {
		if (newSkill.trim() && !skills.includes(newSkill.trim())) {
			setSkills([...skills, newSkill.trim()])
			setNewSkill('')
		}
	}
	const removeSkill = skill => {
		setSkills(skills.filter(s => s !== skill))
	}

	// Jadval
	const handleScheduleChange = (index, field, value) => {
		const newSchedule = [...schedule]
		newSchedule[index][field] = value
		setSchedule(newSchedule)
	}
	const addScheduleRow = () => {
		setSchedule([...schedule, { day: 'Yangi kun', hours: '00:00 - 00:00' }])
	}
	const removeScheduleRow = index => {
		setSchedule(schedule.filter((_, i) => i !== index))
	}

	return (
		<div className='max-w-4xl mx-auto space-y-6 pb-8'>
			{/* HEADER */}
			<div className='flex items-center gap-4'>
				<Button
					variant='ghost'
					size='icon'
					onClick={() => router.push(`/admin/mentors/${id}/view`)}
				>
					<ArrowLeft className='h-5 w-5' />
				</Button>
				<div>
					<h1 className='text-2xl font-bold tracking-tight'>
						Mentorni tahrirlash ({id})
					</h1>
					<p className='text-muted-foreground text-sm'>
						Mavjud mentor profilining barcha ma'lumotlarini o'zgartirish.
					</p>
				</div>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-1 gap-6'>
				{/* 1. ASOSIY MA'LUMOTLAR */}
				<Card>
					<CardHeader>
						<CardTitle>Asosiy ma'lumotlar</CardTitle>
					</CardHeader>
					<CardContent className='space-y-4'>
						<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
							<div className='space-y-2'>
								<Label htmlFor='firstName'>Ism</Label>
								<Input id='firstName' defaultValue='Sardor' />
							</div>
							<div className='space-y-2'>
								<Label htmlFor='lastName'>Familiya</Label>
								<Input id='lastName' defaultValue='Rahmatov' />
							</div>
						</div>

						<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
							<div className='space-y-2'>
								<Label htmlFor='phone'>Telefon raqami</Label>
								<div className='flex'>
									<div className='flex items-center justify-center px-4 bg-muted border border-r-0 rounded-l-md text-sm font-medium'>
										+998
									</div>
									<Input
										id='phone'
										type='tel'
										value={phone}
										onChange={handlePhoneChange}
										className='rounded-l-none'
									/>
								</div>
							</div>

							<div className='grid grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<Label htmlFor='experience'>Tajriba</Label>
									<Input id='experience' defaultValue='2 yil' />
								</div>
								<div className='space-y-2'>
									<Label htmlFor='totalLessons'>O'tilgan darslar (soat)</Label>
									<Input id='totalLessons' type='number' defaultValue='142' />
								</div>
							</div>
						</div>

						<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
							<div className='space-y-2'>
								<Label htmlFor='course'>Kursi</Label>
								<Select defaultValue='3-kurs_bakalavr'>
									<SelectTrigger>
										<SelectValue placeholder='Kursni tanlang' />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectLabel>Bakalavr</SelectLabel>
											<SelectItem value='1-kurs_bakalavr'>
												1-kurs (Bakalavr)
											</SelectItem>
											<SelectItem value='2-kurs_bakalavr'>
												2-kurs (Bakalavr)
											</SelectItem>
											<SelectItem value='3-kurs_bakalavr'>
												3-kurs (Bakalavr)
											</SelectItem>
											<SelectItem value='4-kurs_bakalavr'>
												4-kurs (Bakalavr)
											</SelectItem>
										</SelectGroup>
										<SelectGroup>
											<SelectLabel>Magistratura</SelectLabel>
											<SelectItem value='1-kurs_magistr'>
												1-kurs (Magistr)
											</SelectItem>
											<SelectItem value='2-kurs_magistr'>
												2-kurs (Magistr)
											</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='specialty'>Mutaxassisligi (Yo'nalishi)</Label>
								<Select defaultValue='fullstack'>
									<SelectTrigger>
										<SelectValue placeholder='Yo`nalishni tanlang' />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectLabel>Asosiy yo'nalishlar</SelectLabel>
											<SelectItem value='ai'>Introduction to AI</SelectItem>
											<SelectItem value='bigdata'>Big Data</SelectItem>
											<SelectItem value='bpm'>BPM</SelectItem>
											<SelectItem value='fullstack'>
												Full-Stack (React, Node.js)
											</SelectItem>
										</SelectGroup>
										<SelectGroup>
											<SelectLabel>Qo'shimcha yo'nalishlar</SelectLabel>
											<SelectItem value='dinshunoslik'>Dinshunoslik</SelectItem>
											<SelectItem value='studyskills'>Study-Skills</SelectItem>
											<SelectItem value='english'>Ingliz tili</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* 2. STATISTIK RAQAMLAR */}
				<Card>
					<CardHeader>
						<CardTitle>Ijtimoiy ko'rsatkichlar & Statistika</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
							<div className='space-y-2'>
								<Label htmlFor='rating'>Reyting (maks 5.0)</Label>
								<Input
									id='rating'
									type='number'
									step='0.1'
									max='5'
									defaultValue='4.9'
								/>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='followers'>Obunachilar soni</Label>
								<Input id='followers' type='number' defaultValue='1250' />
							</div>
							<div className='space-y-2'>
								<Label htmlFor='studentsCount'>Hozirgi o'quvchilari</Label>
								<Input id='studentsCount' type='number' defaultValue='34' />
							</div>
						</div>
					</CardContent>
				</Card>

				{/* 3. BIOGRAFIYA */}
				<Card>
					<CardHeader>
						<CardTitle>Ustoz haqida (Biografiya)</CardTitle>
					</CardHeader>
					<CardContent>
						<Textarea
							className='min-h-[120px]'
							defaultValue="Assalomu alaykum! Men Sardor Rahmatov. PDP Universitetida 3-kurs talabasiman. Men dasturlash sohasiga qiziqaman va hozirda bir qancha haqiqiy loyihalarda ishtirok etyapman. Asosiy e'tiborim Backend va Frontend qismlarini birlashtirish hamda optimallashtirishga qaratilgan. O'z bilimimni tengdoshlarim bilan bo'lishishdan xursandman!"
						/>
						<p className='text-xs text-muted-foreground mt-2'>
							Ushbu ma'lumot mentor sahifasida keng ko'rinishda o'quvchilarga
							ko'rsatiladi.
						</p>
					</CardContent>
				</Card>

				{/* 4. TILLAR VA KO'NIKMALAR */}
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<Card>
						<CardHeader>
							<CardTitle>Tillarni bilishi</CardTitle>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='flex gap-2'>
								<Input
									placeholder='Masalan: Ingliz tili (B2)'
									value={newLang}
									onChange={e => setNewLang(e.target.value)}
									onKeyDown={e =>
										e.key === 'Enter' && (e.preventDefault(), addLanguage())
									}
								/>
								<Button onClick={addLanguage} size='icon' className='shrink-0'>
									<Plus className='h-4 w-4' />
								</Button>
							</div>
							<div className='flex flex-wrap gap-2'>
								{languages.map((lang, idx) => (
									<Badge
										key={idx}
										variant='secondary'
										className='pl-3 pr-1 py-1 flex items-center gap-1.5'
									>
										{lang}
										<button
											onClick={() => removeLanguage(lang)}
											className='hover:bg-muted rounded-full p-0.5 transition-colors'
										>
											<X className='h-3 w-3' />
										</button>
									</Badge>
								))}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Texnik ko'nikmalar</CardTitle>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='flex gap-2'>
								<Input
									placeholder='Masalan: ReactJS'
									value={newSkill}
									onChange={e => setNewSkill(e.target.value)}
									onKeyDown={e =>
										e.key === 'Enter' && (e.preventDefault(), addSkill())
									}
								/>
								<Button onClick={addSkill} size='icon' className='shrink-0'>
									<Plus className='h-4 w-4' />
								</Button>
							</div>
							<div className='flex flex-wrap gap-2'>
								{skills.map((skill, idx) => (
									<Badge
										key={idx}
										variant='secondary'
										className='pl-3 pr-1 py-1 flex items-center gap-1.5'
									>
										{skill}
										<button
											onClick={() => removeSkill(skill)}
											className='hover:bg-muted rounded-full p-0.5 transition-colors'
										>
											<X className='h-3 w-3' />
										</button>
									</Badge>
								))}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* 5. JADVAL */}
				<Card>
					<CardHeader className='flex flex-row items-center justify-between'>
						<CardTitle>Dars o'tish vaqtlari</CardTitle>
						<Button
							size='sm'
							variant='outline'
							onClick={addScheduleRow}
							className='h-8'
						>
							<Plus className='h-4 w-4 mr-1' /> Qator qo'shish
						</Button>
					</CardHeader>
					<CardContent className='space-y-3'>
						{schedule.map((slot, idx) => (
							<div
								key={idx}
								className='flex items-center gap-2 sm:gap-4 flex-wrap sm:flex-nowrap'
							>
								<div className='w-full sm:w-1/3'>
									<Input
										value={slot.day}
										onChange={e =>
											handleScheduleChange(idx, 'day', e.target.value)
										}
										placeholder='Hafta kuni'
									/>
								</div>
								<div className='w-full sm:w-1/2 flex items-center gap-2'>
									<Input
										value={slot.hours}
										onChange={e =>
											handleScheduleChange(idx, 'hours', e.target.value)
										}
										placeholder='Soat oraliqlari (18:00 - 20:00)'
									/>
								</div>
								<Button
									variant='ghost'
									size='icon'
									onClick={() => removeScheduleRow(idx)}
									className='text-red-500 hover:text-red-600 hover:bg-red-50 shrink-0 ml-auto'
								>
									<X className='h-4 w-4' />
								</Button>
							</div>
						))}
						{schedule.length === 0 && (
							<p className='text-sm text-muted-foreground text-center py-4 bg-muted/30 rounded-lg'>
								Hozircha bo'sh vaqtlar kiritilmagan.
							</p>
						)}
					</CardContent>
				</Card>

				{/* SAQLASH TUGMALARI */}
				<div className='flex justify-end gap-3 pt-4 border-t'>
					<Button
						variant='outline'
						onClick={() => router.push(`/admin/mentors/${id}/view`)}
					>
						Bekor qilish
					</Button>
					<Button
						className='bg-primary px-8'
						onClick={() => router.push(`/admin/mentors/${id}/view`)}
					>
						O'zgarishlarni saqlash
					</Button>
				</div>
			</div>
		</div>
	)
}
