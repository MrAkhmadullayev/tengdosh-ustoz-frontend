'use client'

import { Button } from '@/components/ui/button'
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, CalendarDays, CheckCircle2, Loader2 } from 'lucide-react'
import { useState } from 'react'

const DAYS = [
	'Dushanba',
	'Seshanba',
	'Chorshanba',
	'Payshanba',
	'Juma',
	'Shanba',
	'Yakshanba',
]
const HOURS = Array.from({ length: 15 }, (_, i) => `${i + 8}:00`) // 08:00 dan 22:00 gacha

export default function Step3Schedule({
	formData,
	setFormData,
	onPrev,
	onSubmit,
	isSubmitting,
}) {
	const [errors, setErrors] = useState({})

	const toggleDay = day => {
		setFormData(prev => {
			const existing = prev.schedule.find(s => s.day === day)
			if (existing) {
				return { ...prev, schedule: prev.schedule.filter(s => s.day !== day) }
			} else {
				return {
					...prev,
					schedule: [...prev.schedule, { day, from: '14:00', to: '18:00' }],
				}
			}
		})
	}

	const updateTime = (day, field, value) => {
		setFormData(prev => ({
			...prev,
			schedule: prev.schedule.map(s =>
				s.day === day ? { ...s, [field]: value } : s,
			),
		}))
	}

	const validateAndSubmit = () => {
		if (formData.schedule.length === 0) {
			setErrors({
				schedule: "Iltimos, dars uchun kamida bitta bo'sh kuningizni belgilang",
			})
			return
		}

		// Validating logical times
		for (const slot of formData.schedule) {
			const fromHour = parseInt(slot.from)
			const toHour = parseInt(slot.to)
			if (fromHour >= toHour) {
				setErrors({
					schedule: `${slot.day} kungi vaqtni to'g'ri belgilang (tugash vaqti boshlanishidan keyin bo'lishi kerak)`,
				})
				return
			}
		}

		setErrors({})
		onSubmit()
	}

	return (
		<div className='animate-in fade-in slide-in-from-right-4 duration-500'>
			<CardHeader className='text-center px-0 pt-0'>
				<div className='mx-auto bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-4'>
					<CalendarDays className='h-8 w-8 text-primary' />
				</div>
				<CardTitle className='text-2xl font-bold'>Dars Jadvali</CardTitle>
				<CardDescription>
					O'quvchilaringizga dars o'tish uchun haftaning qaysi kunlari va
					soatlarida bo'shsiz?
				</CardDescription>
			</CardHeader>

			<div className='space-y-6 mt-4'>
				{errors.schedule && (
					<div className='p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm text-center font-medium'>
						{errors.schedule}
					</div>
				)}

				<div className='space-y-3'>
					{DAYS.map(day => {
						const slot = formData.schedule.find(s => s.day === day)
						const isSelected = !!slot

						return (
							<div
								key={day}
								className={`
									flex flex-col sm:flex-row sm:items-center justify-between px-6 py-2 rounded-xl border transition-all
									${isSelected ? 'bg-primary/5 border-primary/30 ring-1 ring-primary/20' : 'bg-card hover:bg-muted/50'}
								`}
							>
								<div className='flex items-center space-x-3 mb-3 sm:mb-0'>
									<Checkbox
										id={`day-${day}`}
										checked={isSelected}
										onCheckedChange={() => toggleDay(day)}
										className='h-5 w-5'
									/>
									<label
										htmlFor={`day-${day}`}
										className={`text-base cursor-pointer select-none font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}
									>
										{day}
									</label>
								</div>

								{isSelected && (
									<div className='flex items-center gap-2 pl-8 sm:pl-0 animate-in fade-in slide-in-from-left-2'>
										<Select
											value={slot.from}
											onValueChange={val => updateTime(day, 'from', val)}
										>
											<SelectTrigger className='w-[100px] h-9 bg-background'>
												<SelectValue placeholder='Dan' />
											</SelectTrigger>
											<SelectContent>
												{HOURS.map(h => (
													<SelectItem key={`from-${h}`} value={h}>
														{h}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<span className='text-muted-foreground'>-</span>
										<Select
											value={slot.to}
											onValueChange={val => updateTime(day, 'to', val)}
										>
											<SelectTrigger className='w-[100px] h-9 bg-background'>
												<SelectValue placeholder='Gacha' />
											</SelectTrigger>
											<SelectContent>
												{HOURS.map(h => (
													<SelectItem key={`to-${h}`} value={h}>
														{h}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								)}
							</div>
						)
					})}
				</div>

				<div className='pt-6 flex flex-col-reverse sm:flex-row gap-3 justify-between'>
					<Button
						variant='outline'
						onClick={onPrev}
						className='w-full sm:w-auto'
						disabled={isSubmitting}
					>
						<ArrowLeft className='mr-2 w-4' /> Orqaga
					</Button>
					<Button
						onClick={validateAndSubmit}
						disabled={isSubmitting}
						className='px-8 font-semibold w-full sm:w-auto bg-green-600 hover:bg-green-700'
					>
						{isSubmitting ? (
							<>
								<Loader2 className='mr-2 h-4 w-4 animate-spin' />{' '}
								Yuborilmoqda...
							</>
						) : (
							<>
								<CheckCircle2 className='mr-2 h-4 w-4' /> Yakunlash
							</>
						)}
					</Button>
				</div>
			</div>
		</div>
	)
}
