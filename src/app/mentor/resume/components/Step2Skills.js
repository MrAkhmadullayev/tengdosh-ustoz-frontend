'use client'

import { Button } from '@/components/ui/button'
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	ArrowLeft,
	ArrowRight,
	Code2,
	Languages,
	Plus,
	Trash2,
} from 'lucide-react'
import { useState } from 'react'

export default function Step2Skills({ formData, setFormData, onNext, onPrev }) {
	const [errors, setErrors] = useState({})
	const [newSkill, setNewSkill] = useState('')

	const addLanguage = () => {
		setFormData(prev => ({
			...prev,
			languages: [...prev.languages, { lang: '', level: '', isNative: false }],
		}))
	}

	const removeLanguage = index => {
		setFormData(prev => {
			const arr = [...prev.languages]
			arr.splice(index, 1)
			return { ...prev, languages: arr }
		})
	}

	const updateLanguage = (index, field, value) => {
		setFormData(prev => {
			const arr = [...prev.languages]
			arr[index][field] = value
			return { ...prev, languages: arr }
		})
	}

	const addSkill = () => {
		if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
			setFormData(prev => ({
				...prev,
				skills: [...prev.skills, newSkill.trim()],
			}))
			setNewSkill('')
		}
	}

	const removeSkill = skill => {
		setFormData(prev => ({
			...prev,
			skills: prev.skills.filter(s => s !== skill),
		}))
	}

	const validateAndNext = () => {
		const newErrors = {}

		if (formData.languages.length === 0) {
			newErrors.languages = 'Kamida bitta til kiritish majburiy'
		} else {
			formData.languages.forEach((l, i) => {
				if (!l.lang || !l.level) {
					newErrors.languages =
						"Barcha kiritilgan tillar va darajalarini to'ldiring"
				}
			})
		}

		if (formData.skills.length === 0) {
			newErrors.skills = "Kamida bitta texnik ko'nikma (skill) kiriting"
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors)
			return
		}

		onNext()
	}

	return (
		<div className='animate-in fade-in slide-in-from-right-4 duration-500'>
			<CardHeader className='text-center px-0 pt-0'>
				<div className='mx-auto bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-4'>
					<Languages className='h-8 w-8 text-primary' />
				</div>
				<CardTitle className='text-2xl font-bold'>Til va Ko'nikmalar</CardTitle>
				<CardDescription>
					Qaysi tillarni bilasiz va qanday texnik bilimlarga egasiz?
				</CardDescription>
			</CardHeader>

			<div className='space-y-6 mt-4'>
				{/* Languages Section */}
				<div className='space-y-4'>
					<div className='flex items-center justify-between'>
						<Label className='text-base font-semibold'>
							Tillar <span className='text-red-500'>*</span>
						</Label>
						<Button
							type='button'
							variant='outline'
							size='sm'
							onClick={addLanguage}
						>
							<Plus className='h-3 w-3 mr-1' /> Til qo'shish
						</Button>
					</div>

					{errors.languages && (
						<p className='text-xs text-red-500'>{errors.languages}</p>
					)}

					<div className='space-y-3'>
						{formData.languages.map((item, index) => (
							<div
								key={index}
								className='flex flex-col sm:flex-row gap-3 items-start sm:items-center p-3 bg-muted/30 rounded-lg border'
							>
								<div className='flex-1 w-full'>
									<Input
										placeholder='Til nomi (masalan: Ingliz tili)'
										value={item.lang}
										onChange={e =>
											updateLanguage(index, 'lang', e.target.value)
										}
									/>
								</div>
								<div className='w-full sm:w-[150px]'>
									<Select
										value={item.level}
										onValueChange={val => updateLanguage(index, 'level', val)}
									>
										<SelectTrigger className='h-10'>
											<SelectValue placeholder='Darajasi' />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="A1 - Boshlang'ich">
												A1 - Boshlang'ich
											</SelectItem>
											<SelectItem value='A2 - Elementar'>
												A2 - Elementar
											</SelectItem>
											<SelectItem value="B1 - O'rta">B1 - O'rta</SelectItem>
											<SelectItem value="B2 - O'rtadan yuqori">
												B2 - O'rtadan yuqori
											</SelectItem>
											<SelectItem value='C1 - Mukammal'>
												C1 - Mukammal
											</SelectItem>
											<SelectItem value='C2 - Ona tili'>
												C2 - Ona tili darajasida
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className='flex items-center gap-2 pt-2 sm:pt-0 w-full sm:w-auto'>
									<div className='flex items-center space-x-2 bg-background border px-3 h-10 rounded-md'>
										<Checkbox
											id={`native-${index}`}
											checked={item.isNative}
											onCheckedChange={checked =>
												updateLanguage(index, 'isNative', checked)
											}
										/>
										<label
											htmlFor={`native-${index}`}
											className='text-sm cursor-pointer select-none'
										>
											Ona tili
										</label>
									</div>
									<Button
										type='button'
										variant='ghost'
										size='icon'
										className='text-red-500 hover:text-red-600 hover:bg-red-50 ml-auto sm:ml-0'
										onClick={() => removeLanguage(index)}
									>
										<Trash2 className='h-4 w-4' />
									</Button>
								</div>
							</div>
						))}
						{formData.languages.length === 0 && (
							<div className='text-center p-4 border border-dashed rounded-lg text-muted-foreground text-sm'>
								Hozirda tillar kiritilmagan
							</div>
						)}
					</div>
				</div>

				<div className='border-t my-6'></div>

				{/* Skills Section */}
				<div className='space-y-4'>
					<Label className='text-base font-semibold flex items-center gap-2'>
						<Code2 className='h-4 w-4 text-primary' /> Texnik Ko'nikmalar
						(Skills) <span className='text-red-500'>*</span>
					</Label>
					<div className='flex gap-2'>
						<Input
							placeholder='Masalan: React, Node.js, Figma...'
							value={newSkill}
							onChange={e => setNewSkill(e.target.value)}
							onKeyDown={e => {
								if (e.key === 'Enter') {
									e.preventDefault()
									addSkill()
								}
							}}
						/>
						<Button type='button' onClick={addSkill} className='shrink-0'>
							Qo'shish
						</Button>
					</div>

					{errors.skills && (
						<p className='text-xs text-red-500'>{errors.skills}</p>
					)}

					<div className='flex flex-wrap gap-2 pt-2'>
						{formData.skills.map((skill, index) => (
							<div
								key={index}
								className='flex items-center bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium border border-primary/20'
							>
								{skill}
								<button
									type='button'
									onClick={() => removeSkill(skill)}
									className='ml-2 hover:text-red-500 transition-colors'
								>
									&times;
								</button>
							</div>
						))}
						{formData.skills.length === 0 && (
							<span className='text-sm text-muted-foreground italic'>
								Ko'nikmalar kiritilmagan
							</span>
						)}
					</div>
				</div>

				<div className='pt-6 flex flex-col-reverse sm:flex-row gap-3 justify-between'>
					<Button
						variant='outline'
						onClick={onPrev}
						className='w-full sm:w-auto'
					>
						<ArrowLeft className='mr-2 w-4' /> Orqaga
					</Button>
					<Button
						onClick={validateAndNext}
						className=' px-8 font-semibold w-full sm:w-auto'
					>
						Keyingisi <ArrowRight className='ml-2 w-4' />
					</Button>
				</div>
			</div>
		</div>
	)
}
