'use client'

import { Card, CardContent } from '@/components/ui/card'
import api from '@/lib/api'
import { CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
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
			if (res.data.success) {
				// Muvaffaqiyatli saqlandi. User obyektidagi isResumeCompleted ham true bo'ldi.
				// Endi uni Dashboard ga yo'naltiramiz
				router.push('/mentor/dashboard')
				router.refresh()
			}
		} catch (error) {
			console.error('Rezyumeni yuborishda xatolik:', error)
			alert(
				error.response?.data?.message ||
					"Xatolik yuz berdi. Iltimos qayta urinib ko'ring.",
			)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className='w-full max-w-3xl mx-auto'>
			{/* Progress Indicator */}
			<div className='mb-8'>
				<div className='flex items-center justify-between relative'>
					<div className='absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted rounded-full -z-10'></div>
					<div
						className='absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full -z-10 transition-all duration-500 ease-in-out'
						style={{ width: `${((step - 1) / 2) * 100}%` }}
					/>

					{[1, 2, 3].map(s => (
						<div
							key={s}
							className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
								step > s
									? 'bg-primary text-primary-foreground scale-110 shadow-md'
									: step === s
										? 'bg-primary text-primary-foreground ring-4 ring-primary/20 scale-110'
										: 'bg-background border-2 border-muted text-muted-foreground'
							}`}
						>
							{step > s ? <CheckCircle2 className='h-5 w-5' /> : s}
						</div>
					))}
				</div>
				<div className='flex justify-between mt-2 text-xs font-semibold text-muted-foreground px-1'>
					<span className={step >= 1 ? 'text-primary' : ''}>Asosiy</span>
					<span className={step >= 2 ? 'text-primary' : ''}>Ko'nikmalar</span>
					<span className={step >= 3 ? 'text-primary' : ''}>Jadval</span>
				</div>
			</div>

			<Card className='shadow-lg border-primary/10'>
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
