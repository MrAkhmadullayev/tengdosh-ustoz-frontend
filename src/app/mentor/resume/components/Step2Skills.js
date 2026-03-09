'use client'

import { Badge } from '@/components/ui/badge'
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
	X,
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
			setErrors(prev => ({ ...prev, skills: null }))
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
			formData.languages.forEach(l => {
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
		<div className='animate-in fade-in slide-in-from-right-4 duration-300'>
			<CardHeader className='text-center px-0 pt-0 pb-6'>
				<div className='mx-auto bg-muted w-14 h-14 rounded-2xl flex items-center justify-center mb-3 border shadow-sm'>
					<Languages className='h-6 w-6 text-foreground' />
				</div>
				<CardTitle className='text-2xl font-bold tracking-tight'>
					Til va Ko'nikmalar
				</CardTitle>
				<CardDescription>
					Qaysi tillarni bilasiz va qanday texnik bilimlarga egasiz?
				</CardDescription>
			</CardHeader>

			<div className='space-y-8'>
				{/* Languages Section */}
				<div className='space-y-4'>
					<div className='flex items-center justify-between'>
						<Label className='text-sm font-bold flex items-center gap-2'>
							<Languages className='w-4 h-4 text-muted-foreground' /> Tillar{' '}
							<span className='text-destructive'>*</span>
						</Label>
						<Button
							type='button'
							variant='outline'
							size='sm'
							onClick={addLanguage}
							className='h-8'
						>
							<Plus className='h-3.5 w-3.5 mr-1.5' /> Til qo'shish
						</Button>
					</div>

					<div className='space-y-3'>
						{formData.languages.map((item, index) => (
							<div
								key={index}
								className='flex flex-col sm:flex-row gap-3 items-start sm:items-center p-3 bg-muted/20 rounded-xl border'
							>
								<Input
									placeholder='Masalan: Ingliz tili'
									value={item.lang}
									onChange={e => updateLanguage(index, 'lang', e.target.value)}
									className='flex-1 bg-background'
								/>
								<Select
									value={item.level}
									onValueChange={val => updateLanguage(index, 'level', val)}
								>
									<SelectTrigger className='w-full sm:w-[150px] bg-background'>
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
										<SelectItem value='C1 - Mukammal'>C1 - Mukammal</SelectItem>
										<SelectItem value='C2 - Ona tili'>C2 - Ona tili</SelectItem>
									</SelectContent>
								</Select>
								<div className='flex items-center gap-2 w-full sm:w-auto'>
									<div className='flex flex-1 sm:flex-none items-center space-x-2 bg-background border px-3 h-10 rounded-md'>
										<Checkbox
											id={`native-${index}`}
											checked={item.isNative}
											onCheckedChange={c =>
												updateLanguage(index, 'isNative', c)
											}
										/>
										<label
											htmlFor={`native-${index}`}
											className='text-sm font-medium cursor-pointer'
										>
											Ona tili
										</label>
									</div>
									<Button
										type='button'
										variant='ghost'
										size='icon'
										className='text-muted-foreground hover:text-destructive shrink-0'
										onClick={() => removeLanguage(index)}
									>
										<Trash2 className='h-4 w-4' />
									</Button>
								</div>
							</div>
						))}
						{formData.languages.length === 0 && (
							<div className='text-center p-6 border border-dashed rounded-xl text-muted-foreground text-sm'>
								Hozirda tillar kiritilmagan
							</div>
						)}
						{errors.languages && (
							<p className='text-[11px] font-medium text-destructive'>
								{errors.languages}
							</p>
						)}
					</div>
				</div>

				{/* Skills Section */}
				<div className='space-y-4'>
					<Label className='text-sm font-bold flex items-center gap-2'>
						<Code2 className='h-4 w-4 text-muted-foreground' /> Texnik
						Ko'nikmalar <span className='text-destructive'>*</span>
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
						<Button
							type='button'
							variant='secondary'
							onClick={addSkill}
							className='shrink-0'
						>
							Qo'shish
						</Button>
					</div>

					<div className='flex flex-wrap gap-2 pt-2'>
						{formData.skills.map((skill, index) => (
							<Badge
								key={index}
								variant='secondary'
								className='px-3 py-1.5 font-medium text-sm gap-1.5 group'
							>
								{skill}
								<button
									type='button'
									onClick={() => removeSkill(skill)}
									className='text-muted-foreground group-hover:text-foreground'
								>
									<X className='h-3.5 w-3.5' />
								</button>
							</Badge>
						))}
						{formData.skills.length === 0 && (
							<span className='text-sm text-muted-foreground italic w-full'>
								Ko'nikmalar kiritilmagan
							</span>
						)}
					</div>
					{errors.skills && (
						<p className='text-[11px] font-medium text-destructive'>
							{errors.skills}
						</p>
					)}
				</div>

				<div className='pt-6 flex flex-col-reverse sm:flex-row gap-3 justify-between border-t'>
					<Button
						variant='outline'
						onClick={onPrev}
						className='w-full sm:w-auto font-medium'
					>
						<ArrowLeft className='mr-2 h-4 w-4' /> Orqaga
					</Button>
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
