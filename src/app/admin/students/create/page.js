'use client'

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
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CreateTalabaPage() {
	const router = useRouter()

	// Telefon raqami formatlashi (+998 99 999 9999)
	const [phone, setPhone] = useState('')

	const handlePhoneChange = e => {
		let input = e.target.value.replace(/\D/g, '') // Faqat raqamlarni olib qolish

		if (input.startsWith('998')) {
			input = input.slice(3) // 998 ni kesib tashlaymiz
		}

		// Maksimal raqamlar soni
		if (input.length > 9) {
			input = input.slice(0, 9)
		}

		// Formatlash: 99 999 99 99 -> 99 999 9999
		let formatted = ''
		if (input.length > 0) formatted += input.substring(0, 2)
		if (input.length >= 3) formatted += ' ' + input.substring(2, 5)
		if (input.length >= 6) formatted += ' ' + input.substring(5, 9)

		setPhone(formatted)
	}

	return (
		<div className='max-w-2xl mx-auto space-y-6 pb-8'>
			<div className='flex items-center gap-4'>
				<Button
					variant='ghost'
					size='icon'
					onClick={() => router.push('/admin/students')}
				>
					<ArrowLeft className='h-5 w-5' />
				</Button>
				<div>
					<h1 className='text-2xl font-bold tracking-tight'>
						Yangi talaba qo'shish
					</h1>
					<p className='text-muted-foreground text-sm'>
						Tizimga yangi ustoz ma'lumotlarini kiriting.
					</p>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Talaba ma'lumotlari</CardTitle>
				</CardHeader>
				<CardContent className='space-y-4'>
					{/* ISM */}
					<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<Label htmlFor='firstName'>Ism</Label>
							<Input id='firstName' placeholder='Masalan: Sardor' />
						</div>
						<div className='space-y-2'>
							<Label htmlFor='lastName'>Familiya</Label>
							<Input id='lastName' placeholder='Masalan: Rahmatov' />
						</div>
					</div>

					{/* TELEFON RAQAM */}
					<div className='space-y-2'>
						<Label htmlFor='phone'>Telefon raqami</Label>
						<div className='flex'>
							<div className='flex items-center justify-center px-4 bg-muted border border-r-0 rounded-l-md text-sm font-medium'>
								+998
							</div>
							<Input
								id='phone'
								type='tel'
								placeholder='99 999 9999'
								value={phone}
								onChange={handlePhoneChange}
								className='rounded-l-none'
							/>
						</div>
					</div>

					{/* KURS */}
					<div className='space-y-2'>
						<Label htmlFor='course'>Kursi</Label>
						<Select>
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

					{/* YO'NALISH */}
					<div className='space-y-2'>
						<Label htmlFor='specialty'>Mutaxassisligi (Yo'nalishi)</Label>
						<Select>
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

					{/* TUGMALAR */}
					<div className='flex justify-end gap-2 pt-4'>
						<Button
							variant='outline'
							onClick={() => router.push('/admin/students')}
						>
							Bekor qilish
						</Button>
						<Button
							className='bg-primary'
							onClick={() => router.push('/admin/students')}
						>
							Saqlash va qo'shish
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
