'use client'

import Navbar from '@/components/landing/Navbar'
import { Button } from '@/components/ui/button'
import {
	Card,
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
import { Skeleton } from '@/components/ui/skeleton'
import api from '@/lib/api'
// 🔥 utils'dan markaziy funksiyalar
import { cn, getErrorMessage } from '@/lib/utils'
import {
	ArrowLeft,
	ArrowRight,
	Briefcase,
	CheckCircle,
	GraduationCap,
	Loader2,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

// ==========================================
// 🚀 ASOSIY KOMPONENT (Wizard Wrapper)
// ==========================================
export default function ConfirmRegistration() {
	const router = useRouter()

	const [currentStep, setCurrentStep] = useState(1)
	const [role, setRole] = useState('')
	const [isLoading, setIsLoading] = useState(true)
	const [isSubmitting, setIsSubmitting] = useState(false)

	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		course: '',
		groupFirst: '',
		groupSecond: '',
	})

	// Profilni o'qish (Prefill)
	const fetchMe = useCallback(async () => {
		try {
			const { data } = await api.get('/auth/me')
			if (data?.success && data.user) {
				let initialFirstName = data.user.firstName || ''
				let initialLastName = data.user.lastName || ''

				// Agar familiya bo'lmasa, uni ismdan ajratish (fallback)
				if (!initialLastName && initialFirstName.trim().includes(' ')) {
					const parts = initialFirstName.trim().split(' ')
					initialLastName = parts.pop()
					initialFirstName = parts.join(' ')
				}

				const [gFirst, gSecond] = (data.user.group || '-').split('-')

				setFormData(prev => ({
					...prev,
					firstName: initialFirstName,
					lastName: initialLastName,
					course: data.user.course || '',
					groupFirst: gFirst || '',
					groupSecond: gSecond || '',
				}))

				if (data.user.role && data.user.role !== 'student') {
					setRole(data.user.role)
				}
			}
		} catch (err) {
			console.error('Fetch me warning:', err)
		} finally {
			setIsLoading(false)
		}
	}, [])

	useEffect(() => {
		fetchMe()
	}, [fetchMe])

	// Jo'natish
	const handleConfirm = async () => {
		setIsSubmitting(true)

		try {
			const payload = {
				firstName: formData.firstName,
				lastName: formData.lastName,
				role: role,
				course: formData.course,
				group: `${formData.groupFirst}-${formData.groupSecond}`,
			}

			const res = await api.post('/auth/register', payload)

			if (!res.data?.success) {
				throw new Error(res.data?.message || 'Xatolik yuz berdi')
			}

			toast.success('Muvaffaqiyatli saqlandi!')

			// Role bo'yicha yo'naltirish
			if (res.data.user.role === 'admin') {
				window.location.href = '/admin/dashboard'
			} else if (res.data.user.role === 'mentor') {
				window.location.href = '/mentor/dashboard'
			} else {
				window.location.href = '/student/dashboard'
			}
		} catch (err) {
			toast.error(getErrorMessage(err, 'Server bilan ulanishda xatolik'))
			setIsSubmitting(false)
		}
	}

	return (
		<div className='min-h-screen bg-muted/30 flex flex-col'>
			<Navbar />

			<main className='flex-1 flex items-center justify-center p-4'>
				<Card className='w-full max-w-lg shadow-lg border-border'>
					{isLoading ? (
						<div className='p-8 space-y-8 animate-pulse'>
							<div className='space-y-3 flex flex-col items-center'>
								<Skeleton className='h-8 w-48' />
								<Skeleton className='h-4 w-[80%]' />
							</div>
							<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
								<Skeleton className='h-32 w-full rounded-xl' />
								<Skeleton className='h-32 w-full rounded-xl' />
							</div>
						</div>
					) : (
						<div className='animate-in fade-in slide-in-from-bottom-2 duration-300'>
							{currentStep === 1 && (
								<Step1Role
									onNext={selectedRole => {
										setRole(selectedRole)
										setCurrentStep(2)
									}}
								/>
							)}

							{currentStep === 2 && (
								<Step2Details
									formData={formData}
									setFormData={setFormData}
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
								/>
							)}
						</div>
					)}
				</Card>
			</main>
		</div>
	)
}

// ==========================================
// 🧩 STEP 1: ROLE TANLASH
// ==========================================
function Step1Role({ onNext }) {
	return (
		<>
			<CardHeader className='text-center pt-8'>
				<CardTitle className='text-2xl font-bold tracking-tight'>
					Xush kelibsiz!
				</CardTitle>
				<CardDescription className='text-base'>
					Iltimos, platformadan foydalanuvchi sifatidagi rolingizni tanlang.
				</CardDescription>
			</CardHeader>
			<CardContent className='space-y-4 pb-8'>
				<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
					<Button
						variant='outline'
						className='h-32 flex flex-col items-center justify-center space-y-3 hover:bg-muted/50 border-2 hover:border-primary transition-all group'
						onClick={() => onNext('student')}
					>
						<GraduationCap className='h-10 w-10 text-muted-foreground group-hover:text-primary transition-colors' />
						<span className='text-lg font-semibold'>Talaba</span>
					</Button>

					<Button
						variant='outline'
						className='h-32 flex flex-col items-center justify-center space-y-3 hover:bg-muted/50 border-2 hover:border-primary transition-all group'
						onClick={() => onNext('mentor')}
					>
						<Briefcase className='h-10 w-10 text-muted-foreground group-hover:text-primary transition-colors' />
						<span className='text-lg font-semibold'>Mentor</span>
					</Button>
				</div>
			</CardContent>
		</>
	)
}

// ==========================================
// 🧩 STEP 2: MA'LUMOTLARNI KIRITISH
// ==========================================
function Step2Details({ formData, setFormData, onNext, onBack }) {
	const [errors, setErrors] = useState({})

	const handleNext = () => {
		const newErrors = {}
		if (!formData.firstName.trim()) newErrors.firstName = 'Ismni kiriting'
		if (!formData.lastName.trim()) newErrors.lastName = 'Familiyani kiriting'
		if (!formData.course) newErrors.course = 'Kursni tanlang'
		if (!formData.groupFirst || !formData.groupSecond)
			newErrors.group = "Guruhni to'liq kiriting"

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors)
			return
		}
		onNext()
	}

	return (
		<>
			<CardHeader className='text-center pt-8'>
				<CardTitle className='text-2xl font-bold tracking-tight'>
					Shaxsiy Ma'lumotlar
				</CardTitle>
				<CardDescription className='text-base'>
					O'zingiz haqingizdagi ma'lumotlarni to'ldiring.
				</CardDescription>
			</CardHeader>
			<CardContent className='space-y-6 pb-6'>
				<div className='space-y-5'>
					<div className='grid grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<Label
								htmlFor='firstName'
								className={cn(errors.firstName && 'text-destructive')}
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
								className={cn(
									errors.firstName &&
										'border-destructive focus-visible:ring-destructive',
								)}
							/>
							{errors.firstName && (
								<p className='text-[10px] text-destructive font-medium'>
									{errors.firstName}
								</p>
							)}
						</div>
						<div className='space-y-2'>
							<Label
								htmlFor='lastName'
								className={cn(errors.lastName && 'text-destructive')}
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
								className={cn(
									errors.lastName &&
										'border-destructive focus-visible:ring-destructive',
								)}
							/>
							{errors.lastName && (
								<p className='text-[10px] text-destructive font-medium'>
									{errors.lastName}
								</p>
							)}
						</div>
					</div>

					<div className='space-y-2'>
						<Label className={cn(errors.course && 'text-destructive')}>
							Kurs
						</Label>
						<Select
							value={formData.course}
							onValueChange={val => {
								setFormData(prev => ({ ...prev, course: val }))
								setErrors(prev => ({ ...prev, course: undefined }))
							}}
						>
							<SelectTrigger
								className={cn(
									errors.course && 'border-destructive focus:ring-destructive',
								)}
							>
								<SelectValue placeholder='Kursni tanlang' />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectLabel>Bakalavr</SelectLabel>
									{['1', '2', '3', '4'].map(c => (
										<SelectItem key={`bak-${c}`} value={`${c}-kurs (Bakalavr)`}>
											{c}-kurs
										</SelectItem>
									))}
								</SelectGroup>
								<SelectGroup>
									<SelectLabel>Magistratura</SelectLabel>
									{['1', '2'].map(c => (
										<SelectItem
											key={`mag-${c}`}
											value={`${c}-kurs (Magistratura)`}
										>
											{c}-kurs (Mag.)
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
						{errors.course && (
							<p className='text-[10px] text-destructive font-medium'>
								{errors.course}
							</p>
						)}
					</div>

					<div className='space-y-2'>
						<Label className={cn(errors.group && 'text-destructive')}>
							Guruh
						</Label>
						<div className='flex items-center gap-3'>
							<Input
								placeholder='25'
								value={formData.groupFirst}
								onChange={e => {
									setFormData(prev => ({ ...prev, groupFirst: e.target.value }))
									setErrors(prev => ({ ...prev, group: undefined }))
								}}
								className={cn(
									'flex-1 text-center',
									errors.group &&
										'border-destructive focus-visible:ring-destructive',
								)}
							/>
							<span className='text-muted-foreground font-medium'>-</span>
							<Input
								placeholder='101'
								value={formData.groupSecond}
								onChange={e => {
									setFormData(prev => ({
										...prev,
										groupSecond: e.target.value,
									}))
									setErrors(prev => ({ ...prev, group: undefined }))
								}}
								className={cn(
									'flex-1 text-center',
									errors.group &&
										'border-destructive focus-visible:ring-destructive',
								)}
							/>
						</div>
						{errors.group && (
							<p className='text-[10px] text-destructive font-medium'>
								{errors.group}
							</p>
						)}
					</div>
				</div>

				<div className='flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-6 border-t'>
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

// ==========================================
// 🧩 STEP 3: TASDIQLASH
// ==========================================
function Step3Confirm({ formData, role, onBack, onConfirm, isLoading }) {
	return (
		<>
			<CardHeader className='text-center pt-8'>
				<div className='mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4'>
					<CheckCircle className='h-8 w-8 text-primary' />
				</div>
				<CardTitle className='text-2xl font-bold tracking-tight'>
					Tasdiqlash
				</CardTitle>
				<CardDescription className='text-base'>
					Kiritilgan ma'lumotlarni tekshiring va tasdiqlang.
				</CardDescription>
			</CardHeader>

			<CardContent className='space-y-8 pb-6'>
				<div className='bg-muted/30 rounded-xl p-5 border border-border/50 shadow-sm space-y-4'>
					<div className='flex justify-between items-center border-b pb-3'>
						<span className='text-sm text-muted-foreground'>Rol:</span>
						<span className='font-semibold capitalize text-foreground'>
							{role === 'student' ? 'Talaba' : 'Mentor'}
						</span>
					</div>
					<div className='flex justify-between items-center border-b pb-3'>
						<span className='text-sm text-muted-foreground'>
							Ism va Familiya:
						</span>
						<span className='font-semibold text-foreground'>
							{formData.firstName} {formData.lastName}
						</span>
					</div>
					<div className='flex justify-between items-center border-b pb-3'>
						<span className='text-sm text-muted-foreground'>Kurs:</span>
						<span className='font-semibold text-foreground'>
							{formData.course}
						</span>
					</div>
					<div className='flex justify-between items-center'>
						<span className='text-sm text-muted-foreground'>Guruh:</span>
						<span className='font-semibold text-primary'>
							{formData.groupFirst}-{formData.groupSecond}
						</span>
					</div>
				</div>

				<div className='flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-2'>
					<Button
						variant='outline'
						className='w-full sm:w-auto'
						onClick={onBack}
						disabled={isLoading}
					>
						O'zgartirish
					</Button>
					<Button
						className='w-full sm:w-auto'
						onClick={onConfirm}
						disabled={isLoading}
					>
						{isLoading ? (
							<Loader2 className='mr-2 h-4 w-4 animate-spin' />
						) : (
							<CheckCircle className='mr-2 h-4 w-4' />
						)}
						{isLoading ? 'Saqlanmoqda...' : 'Tasdiqlash'}
					</Button>
				</div>
			</CardContent>
		</>
	)
}
