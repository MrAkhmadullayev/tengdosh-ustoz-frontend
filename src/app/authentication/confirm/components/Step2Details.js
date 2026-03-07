import { Button } from '@/components/ui/button'
import {
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
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
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useState } from 'react'

export default function Step2Details({
	formData,
	setFormData,
	onNext,
	onBack,
	role,
}) {
	const [errors, setErrors] = useState({})

	const [groupFirst, setGroupFirst] = useState(
		formData.group ? formData.group.split('-')[0] : '',
	)
	const [groupSecond, setGroupSecond] = useState(
		formData.group ? formData.group.split('-')[1] : '',
	)

	const handleNext = () => {
		const newErrors = {}
		if (!formData.firstName.trim()) newErrors.firstName = 'Ismni kiriting'
		if (!formData.lastName.trim()) newErrors.lastName = 'Familiyani kiriting'

		if (!formData.course) newErrors.course = 'Kursni tanlang'
		if (!groupFirst || !groupSecond) newErrors.group = "Guruhni to'liq kiriting"

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors)
			return
		}

		setFormData(prev => ({ ...prev, group: `${groupFirst}-${groupSecond}` }))

		onNext()
	}

	return (
		<>
			<CardHeader className='text-center pt-8'>
				<CardTitle className='text-2xl font-bold'>
					Shaxsiy Ma'lumotlar
				</CardTitle>
				<CardDescription className='text-base'>
					O'zingiz haqingizdagi ma'lumotlarni to'ldiring.
				</CardDescription>
			</CardHeader>

			<CardContent className='space-y-6'>
				<div className='space-y-4'>
					<div className='grid grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<Label
								htmlFor='firstName'
								className={errors.firstName && 'text-red-500'}
							>
								Ism
							</Label>
							<Input
								id='firstName'
								placeholder='Masalan: Ali'
								value={formData.firstName}
								onChange={e => {
									setFormData(prev => ({ ...prev, firstName: e.target.value }))
									setErrors(prev => ({ ...prev, firstName: undefined }))
								}}
								className={
									errors.firstName &&
									'border-red-500 focus-visible:ring-red-500'
								}
							/>
						</div>
						<div className='space-y-2'>
							<Label
								htmlFor='lastName'
								className={errors.lastName && 'text-red-500'}
							>
								Familiya
							</Label>
							<Input
								id='lastName'
								placeholder='Masalan: Valiyev'
								value={formData.lastName}
								onChange={e => {
									setFormData(prev => ({ ...prev, lastName: e.target.value }))
									setErrors(prev => ({ ...prev, lastName: undefined }))
								}}
								className={
									errors.lastName && 'border-red-500 focus-visible:ring-red-500'
								}
							/>
						</div>
					</div>

					<div className='space-y-2'>
						<Label className={errors.course && 'text-red-500'}>Kurs</Label>
						<Select
							value={formData.course}
							onValueChange={val => {
								setFormData(prev => ({ ...prev, course: val }))
								setErrors(prev => ({ ...prev, course: undefined }))
							}}
						>
							<SelectTrigger
								className={errors.course && 'border-red-500 focus:ring-red-500'}
							>
								<SelectValue placeholder='Kursni tanlang' />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectLabel>Bakalavr</SelectLabel>
									<SelectItem value='1-kurs (Bakalavr)'>1-kurs</SelectItem>
									<SelectItem value='2-kurs (Bakalavr)'>2-kurs</SelectItem>
									<SelectItem value='3-kurs (Bakalavr)'>3-kurs</SelectItem>
									<SelectItem value='4-kurs (Bakalavr)'>4-kurs</SelectItem>
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

					<div className='space-y-2'>
						<Label className={errors.group && 'text-red-500'}>Guruh</Label>
						<div className='flex items-center gap-3'>
							<Input
								placeholder='Masalan: 25'
								className={`flex-1 ${errors.group && 'border-red-500 focus-visible:ring-red-500'}`}
								value={groupFirst}
								onChange={e => {
									setGroupFirst(e.target.value)
									setErrors(prev => ({ ...prev, group: undefined }))
								}}
							/>
							<span className='text-2xl text-muted-foreground'>-</span>
							<Input
								placeholder='Masalan: 101'
								className={`flex-1 ${errors.group && 'border-red-500 focus-visible:ring-red-500'}`}
								value={groupSecond}
								onChange={e => {
									setGroupSecond(e.target.value)
									setErrors(prev => ({ ...prev, group: undefined }))
								}}
							/>
						</div>
					</div>
				</div>

				<div className='flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t'>
					<Button variant='ghost' className='w-full sm:w-auto' onClick={onBack}>
						<ArrowLeft className='mr-2 h-4 w-4' /> Orqaga
					</Button>
					<Button className='w-full sm:w-auto' onClick={handleNext}>
						Davom etish <ArrowRight className='ml-2 h-4 w-4' />
					</Button>
				</div>
			</CardContent>
		</>
	)
}
