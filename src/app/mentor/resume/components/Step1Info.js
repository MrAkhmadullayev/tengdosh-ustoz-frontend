'use client'

import { Button } from '@/components/ui/button'
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { ArrowRight, Briefcase } from 'lucide-react'
import { useState } from 'react'

export default function Step1Info({ formData, setFormData, onNext }) {
	const [errors, setErrors] = useState({})

	const validateAndNext = () => {
		const newErrors = {}
		if (!formData.specialty) newErrors.specialty = "Yo'nalishni tanlang"
		if (!formData.experience) newErrors.experience = 'Tajribangizni kiriting'
		if (!formData.about || formData.about.length < 10)
			newErrors.about =
				"O'zingiz haqingizda to'liqroq ma'lumot bering (kamida 10 belgi)"

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors)
			return
		}
		onNext()
	}

	return (
		<div className='animate-in fade-in slide-in-from-right-4 duration-300'>
			<CardHeader className='text-center px-0 pt-0 pb-6'>
				<div className='mx-auto bg-muted w-14 h-14 rounded-2xl flex items-center justify-center mb-3 border shadow-sm'>
					<Briefcase className='h-6 w-6 text-foreground' />
				</div>
				<CardTitle className='text-2xl font-bold tracking-tight'>
					Asosiy ma'lumotlar
				</CardTitle>
				<CardDescription>
					Qaysi yo'nalishda dars berasiz va tajribangiz haqida ma'lumot
					kiriting.
				</CardDescription>
			</CardHeader>

			<div className='space-y-6'>
				<div className='space-y-2'>
					<Label
						htmlFor='specialty'
						className={cn(errors.specialty && 'text-destructive')}
					>
						Mutaxassislik (Yo'nalish){' '}
						<span className='text-destructive'>*</span>
					</Label>
					<Select
						value={formData.specialty}
						onValueChange={val => {
							setFormData(p => ({ ...p, specialty: val }))
							if (errors.specialty) setErrors(e => ({ ...e, specialty: null }))
						}}
					>
						<SelectTrigger
							id='specialty'
							className={cn(
								'w-full',
								errors.specialty && 'border-destructive focus:ring-destructive',
							)}
						>
							<SelectValue placeholder="Yo'nalishni tanlang" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='Frontend Dasturlash'>
								Frontend Dasturlash
							</SelectItem>
							<SelectItem value='Backend Dasturlash'>
								Backend Dasturlash
							</SelectItem>
							<SelectItem value='Full-Stack Dasturlash'>
								Full-Stack Dasturlash
							</SelectItem>
							<SelectItem value='Mobile Dasturlash'>
								Mobile Dasturlash
							</SelectItem>
							<SelectItem value='UI/UX Dizayn'>UI/UX Dizayn</SelectItem>
							<SelectItem value='Grafik Dizayn'>Grafik Dizayn</SelectItem>
							<SelectItem value="Sun'iy Intellekt / Data Science">
								Sun'iy Intellekt / Data Science
							</SelectItem>
							<SelectItem value='Kiberxavfsizlik'>Kiberxavfsizlik</SelectItem>
							<SelectItem value='SMM / Marketing'>SMM / Marketing</SelectItem>
							<SelectItem value='Menejment / HR'>Menejment / HR</SelectItem>
						</SelectContent>
					</Select>
					{errors.specialty && (
						<p className='text-[11px] font-medium text-destructive'>
							{errors.specialty}
						</p>
					)}
				</div>

				<div className='space-y-2'>
					<Label
						htmlFor='experience'
						className={cn(errors.experience && 'text-destructive')}
					>
						Tajriba (yil) <span className='text-destructive'>*</span>
					</Label>
					<Input
						id='experience'
						type='number'
						placeholder='Masalan: 3'
						min={0}
						className={cn(
							errors.experience &&
								'border-destructive focus-visible:ring-destructive',
						)}
						value={formData.experience}
						onChange={e => {
							setFormData(p => ({ ...p, experience: e.target.value }))
							if (errors.experience)
								setErrors(err => ({ ...err, experience: null }))
						}}
					/>
					{errors.experience && (
						<p className='text-[11px] font-medium text-destructive'>
							{errors.experience}
						</p>
					)}
				</div>

				<div className='space-y-2'>
					<Label
						htmlFor='about'
						className={cn(
							'flex justify-between',
							errors.about && 'text-destructive',
						)}
					>
						<span>
							O'zingiz haqingizda <span className='text-destructive'>*</span>
						</span>
						<span className='text-[11px] text-muted-foreground font-normal'>
							{formData.about?.length || 0} belgi
						</span>
					</Label>
					<Textarea
						id='about'
						placeholder='Men Senior darajadagi dasturchiman. 5 yillik tajribaga egaman va startaplarda ishlaganman...'
						className={cn(
							'min-h-[120px] resize-y',
							errors.about &&
								'border-destructive focus-visible:ring-destructive',
						)}
						value={formData.about}
						onChange={e => {
							setFormData(p => ({ ...p, about: e.target.value }))
							if (errors.about && e.target.value.length >= 10)
								setErrors(err => ({ ...err, about: null }))
						}}
					/>
					{errors.about && (
						<p className='text-[11px] font-medium text-destructive'>
							{errors.about}
						</p>
					)}
				</div>

				<div className='pt-4 flex justify-end border-t'>
					<Button
						onClick={validateAndNext}
						className='w-full sm:w-auto font-medium'
					>
						Keyingisi <ArrowRight className='ml-2 h-4 w-4' />
					</Button>
				</div>
			</div>
		</div>
	)
}
