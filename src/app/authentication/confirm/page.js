'use client'

import Navbar from '@/components/landing/Navbar'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import api from '@/lib/api'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import Step1Role from './components/Step1Role'
import Step2Details from './components/Step2Details'
import Step3Confirm from './components/Step3Confirm'

export default function ConfirmRegistration() {
	const router = useRouter()

	const [currentStep, setCurrentStep] = useState(1)
	const [role, setRole] = useState('')
	const [isLoading, setIsLoading] = useState(true)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [error, setError] = useState('')

	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		course: '',
		group: '',
	})

	useEffect(() => {
		// Fetch user info to prefill
		const fetchMe = async () => {
			try {
				const { data } = await api.get('/auth/me')
				if (data.success && data.user) {
					let initialFirstName = data.user.firstName || ''
					let initialLastName = data.user.lastName || ''

					// Agar familiya bo'lmasa va ism probel bilan xozirgi holatdek To'liq Ism bo'lsa, ajratamiz
					if (!initialLastName && initialFirstName.trim().includes(' ')) {
						const parts = initialFirstName.trim().split(' ')
						initialLastName = parts.pop()
						initialFirstName = parts.join(' ')
					}

					setFormData(prev => ({
						...prev,
						firstName: initialFirstName,
						lastName: initialLastName,
						course: data.user.course || '',
						group: data.user.group || '',
					}))
					if (data.user.role !== 'student') {
						// Mentor or Admin defaults
						setRole(data.user.role)
					}
				}
			} catch (err) {
				console.error('Fetch me warning:', err)
			} finally {
				setIsLoading(false)
			}
		}
		fetchMe()
	}, [])

	const handleRoleSelect = selectedRole => {
		setRole(selectedRole)
		setCurrentStep(2)
	}

	const handleConfirm = async () => {
		setIsSubmitting(true)
		setError('')

		try {
			const payload = {
				firstName: formData.firstName,
				lastName: formData.lastName,
				role: role,
				course: formData.course,
				group: formData.group,
			}

			const res = await api.post('/auth/register', payload)
			const data = res.data

			if (!data.success) {
				setError(data.message || 'Xatolik yuz berdi')
				setIsSubmitting(false)
				return
			}

			// Muvaffaqiyatli saqlandi
			if (data.user.role === 'admin') {
				router.push('/admin/dashboard')
			} else if (data.user.role === 'mentor') {
				router.push('/mentor/dashboard')
			} else {
				router.push('/student/dashboard')
			}
		} catch (err) {
			console.error(err)
			setError(err.response?.data?.message || 'Server bilan ulanishda xatolik')
			setIsSubmitting(false)
		}
	}

	return (
		<div className='min-h-screen bg-muted/20 flex flex-col'>
			<Navbar />
			<main className='flex-1 flex items-center justify-center p-4 relative overflow-hidden'>
				<div className='absolute top-0 right-0 p-32 bg-primary/5 blur-3xl rounded-full' />
				<div className='absolute bottom-0 left-0 p-32 bg-secondary/5 blur-3xl rounded-full' />

				<Card className='w-full max-w-lg shadow-xl border-muted z-10'>
					{isLoading ? (
						// Spinner o'rniga Step 1 ga mos keluvchi Skeleton
						<div className='animate-in fade-in duration-500'>
							<CardHeader className='text-center pt-8 pb-8 flex flex-col items-center space-y-3'>
								<Skeleton className='h-8 w-48' />
								<Skeleton className='h-4 w-[80%] max-w-[300px]' />
							</CardHeader>
							<CardContent className='space-y-4 pb-8'>
								<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
									<Skeleton className='h-32 w-full rounded-2xl' />
									<Skeleton className='h-32 w-full rounded-2xl' />
								</div>
							</CardContent>
						</div>
					) : (
						<div className='transition-all animate-in fade-in slide-in-from-bottom-2 duration-300'>
							{currentStep === 1 && <Step1Role onNext={handleRoleSelect} />}
							{currentStep === 2 && (
								<Step2Details
									formData={formData}
									setFormData={setFormData}
									role={role}
									onBack={() => setCurrentStep(1)}
									onNext={() => setCurrentStep(3)}
								/>
							)}
							{currentStep === 3 && (
								<Step3Confirm
									formData={formData}
									role={role}
									onBack={() => setCurrentStep(2)}
									onConfirm={handleConfirm}
									isLoading={isSubmitting}
									error={error}
								/>
							)}
						</div>
					)}
				</Card>
			</main>
		</div>
	)
}
