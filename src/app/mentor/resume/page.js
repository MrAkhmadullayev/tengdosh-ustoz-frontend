'use client'

import { Card, CardContent } from '@/components/ui/card'
import api from '@/lib/api'
import { getErrorMessage } from '@/lib/utils'
import { Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import Step1Info from './components/Step1Info'
import Step2Skills from './components/Step2Skills'
import Step3Schedule from './components/Step3Schedule'

export default function MentorResumePage() {
	const router = useRouter()
	const [step, setStep] = useState(1)
	const [isSubmitting, setIsSubmitting] = useState(false)

	const [formData, setFormData] = useState({
		specialty: '',
		experience: '',
		about: '',
		languages: [{ lang: '', level: '', isNative: false }],
		skills: [],
		schedule: [],
	})

	const handleNext = () => setStep(prev => Math.min(prev + 1, 3))
	const handlePrev = () => setStep(prev => Math.max(prev - 1, 1))

	const handleSubmit = async () => {
		setIsSubmitting(true)
		try {
			const res = await api.post('/mentor/resume', formData)
			if (res?.data?.success) {
				toast.success('Rezyume muvaffaqiyatli saqlandi!')
				router.push('/mentor/dashboard')
				router.refresh()
			}
		} catch (error) {
			toast.error(
				getErrorMessage(
					error,
					"Xatolik yuz berdi. Iltimos qayta urinib ko'ring.",
				),
			)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className='w-full max-w-2xl mx-auto space-y-8'>
			{/* Progress Indicator (Toza Vercel style) */}
			<div className='relative mb-8 px-2 sm:px-6'>
				<div className='absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted rounded-full -z-10' />
				<div
					className='absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full -z-10 transition-all duration-500 ease-in-out'
					style={{ width: `${((step - 1) / 2) * 100}%` }}
				/>

				<div className='flex justify-between w-full'>
					{[1, 2, 3].map(s => (
						<div key={s} className='flex flex-col items-center gap-2'>
							<div
								className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
									step > s
										? 'bg-primary text-primary-foreground'
										: step === s
											? 'bg-background border-2 border-primary text-primary ring-4 ring-primary/10'
											: 'bg-background border-2 border-muted text-muted-foreground'
								}`}
							>
								{step > s ? <Check className='h-4 w-4' /> : s}
							</div>
							<span
								className={`text-[11px] font-semibold uppercase tracking-wider ${step >= s ? 'text-foreground' : 'text-muted-foreground'}`}
							>
								{s === 1 ? 'Asosiy' : s === 2 ? "Ko'nikma" : 'Jadval'}
							</span>
						</div>
					))}
				</div>
			</div>

			<Card className='shadow-lg border-border'>
				<CardContent className='p-6 sm:p-10'>
					{step === 1 && (
						<Step1Info
							formData={formData}
							setFormData={setFormData}
							onNext={handleNext}
						/>
					)}
					{step === 2 && (
						<Step2Skills
							formData={formData}
							setFormData={setFormData}
							onNext={handleNext}
							onPrev={handlePrev}
						/>
					)}
					{step === 3 && (
						<Step3Schedule
							formData={formData}
							setFormData={setFormData}
							onPrev={handlePrev}
							onSubmit={handleSubmit}
							isSubmitting={isSubmitting}
						/>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
