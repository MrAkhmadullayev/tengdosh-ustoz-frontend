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
import { ArrowLeft, CalendarDays, Loader2, Send } from 'lucide-react'
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
		setErrors({})
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

		// Logic validation
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
		<div className='animate-in fade-in slide-in-from-right-4 duration-300'>
			<CardHeader className='text-center px-0 pt-0 pb-6'>
				<div className='mx-auto bg-muted w-14 h-14 rounded-2xl flex items-center justify-center mb-3 border shadow-sm'>
					<CalendarDays className='h-6 w-6 text-foreground' />
				</div>
				<CardTitle className='text-2xl font-bold tracking-tight'>
					Dars Jadvali
				</CardTitle>
				<CardDescription>
					O'quvchilaringizga dars o'tish uchun haftaning qaysi kunlari va
					soatlarida bo'shsiz?
				</CardDescription>
			</CardHeader>

			<div className='space-y-6'>
				{errors.schedule && (
					<div className='p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm font-medium text-center'>
						{errors.schedule}
					</div>
				)}

				<div className='space-y-2'>
					{DAYS.map(day => {
						const slot = formData.schedule.find(s => s.day === day)
						const isSelected = !!slot

						return (
							<div
								key={day}
								className={`
                  flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all duration-200
                  ${isSelected ? 'bg-primary/5 border-primary shadow-sm' : 'bg-card hover:bg-muted/50'}
                `}
							>
								<div className='flex items-center space-x-3 mb-3 sm:mb-0'>
									<Checkbox
										id={`day-${day}`}
										checked={isSelected}
										onCheckedChange={() => toggleDay(day)}
										className='h-5 w-5 rounded-md'
									/>
									<label
										htmlFor={`day-${day}`}
										className={`text-sm cursor-pointer select-none font-bold ${isSelected ? 'text-primary' : 'text-foreground'}`}
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
											<SelectTrigger className='w-[100px] h-9 bg-background font-medium'>
												<SelectValue placeholder='Dan' />
											</SelectTrigger>
											<SelectContent className='max-h-[200px]'>
												{HOURS.map(h => (
													<SelectItem key={`from-${h}`} value={h}>
														{h}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<span className='text-muted-foreground font-medium'>-</span>
										<Select
											value={slot.to}
											onValueChange={val => updateTime(day, 'to', val)}
										>
											<SelectTrigger className='w-[100px] h-9 bg-background font-medium'>
												<SelectValue placeholder='Gacha' />
											</SelectTrigger>
											<SelectContent className='max-h-[200px]'>
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

				<div className='pt-6 flex flex-col-reverse sm:flex-row gap-3 justify-between border-t'>
					<Button
						variant='outline'
						onClick={onPrev}
						className='w-full sm:w-auto font-medium'
						disabled={isSubmitting}
					>
						<ArrowLeft className='mr-2 h-4 w-4' /> Orqaga
					</Button>
					<Button
						onClick={validateAndSubmit}
						disabled={isSubmitting}
						className='w-full sm:w-auto font-medium px-8'
					>
						{isSubmitting ? (
							<Loader2 className='mr-2 h-4 w-4 animate-spin' />
						) : (
							<Send className='mr-2 h-4 w-4' />
						)}
						{isSubmitting ? 'Saqlanmoqda...' : 'Yuborish va Yakunlash'}
					</Button>
				</div>
			</div>
		</div>
	)
}
