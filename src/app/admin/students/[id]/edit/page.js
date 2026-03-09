'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { useTranslation } from '@/lib/i18n'
// 🔥 Markazlashgan utilitalar chaqirildi
import { formatPhone, getErrorMessage } from '@/lib/utils'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2, Save, ShieldAlert } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner' // 🔥 Toast ulandi

// ==========================================
// 🎨 ANIMATSIYA VARIANTLARI
// ==========================================
const containerVariants = {
	hidden: { opacity: 0 },
	show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
	hidden: { opacity: 0, y: 15 },
	show: {
		opacity: 1,
		y: 0,
		transition: { type: 'spring', stiffness: 300, damping: 24 },
	},
}

// ==========================================
// 🚀 ASOSIY KOMPONENT
// ==========================================
export default function StudentEditPage() {
	const { id } = useParams()
	const router = useRouter()
	const { t } = useTranslation()

	const [loading, setLoading] = useState(true)
	const [isSaving, setIsSaving] = useState(false)
	const [error, setError] = useState(null)

	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		phoneNumber: '+998 ',
		course: '1-kurs (Bakalavr)',
		groupPrefix: '',
		groupSuffix: '',
		status: 'active',
	})

	// 1. Ma'lumotlarni yuklash
	const fetchStudent = useCallback(async () => {
		try {
			const res = await api.get(`/admin/students/${id}`)
			if (res?.data?.success) {
				const data = res.data.student
				const [gPref, gSuff] = (data.group || '-').split('-')

				setFormData({
					firstName: data.firstName || '',
					lastName: data.lastName || '',
					phoneNumber: formatPhone(data.phoneNumber), // utils orqali tozalash
					course: data.course || '1-kurs (Bakalavr)',
					groupPrefix: gPref || '',
					groupSuffix: gSuff || '',
					status: data.status || 'active',
				})
			} else {
				setError(t('errors.notFound') || 'Talaba topilmadi')
			}
		} catch (err) {
			setError(getErrorMessage(err, t('errors.serverError')))
		} finally {
			setLoading(false)
		}
	}, [id, t])

	useEffect(() => {
		if (id) fetchStudent()
	}, [fetchStudent])

	// 2. Form o'zgarishlari
	const handleChange = useCallback(e => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}, [])

	const handlePhoneChange = useCallback(e => {
		setFormData(p => ({ ...p, phoneNumber: formatPhone(e.target.value) }))
	}, [])

	// 3. Formni yuborish (Submit)
	const handleSubmit = async e => {
		e.preventDefault()
		setIsSaving(true)

		try {
			// Guruh nomini moslashtirish (Masalan: 320-22)
			const finalGroup =
				formData.groupPrefix && formData.groupSuffix
					? `${formData.groupPrefix}-${formData.groupSuffix}`
					: formData.groupPrefix || formData.groupSuffix || ''

			const payload = {
				...formData,
				group: finalGroup,
				phoneNumber: formData.phoneNumber.replace(/\D/g, ''), // Backend uchun toza raqam yuborish
			}

			const res = await api.put(`/admin/students/${id}`, payload)

			if (res?.data?.success) {
				toast.success(
					t('common.updateSuccess') || "Ma'lumotlar muvaffaqiyatli saqlandi",
				)
				router.push(`/admin/students/${id}/view`)
				router.refresh()
			}
		} catch (err) {
			toast.error(getErrorMessage(err, t('errors.updateFailed')))
		} finally {
			setIsSaving(false)
		}
	}

	// 4. UI: Loading Skeleton
	if (loading) {
		return (
			<div className='max-w-4xl mx-auto space-y-6 pt-6 pb-20 animate-pulse'>
				<div className='flex items-center gap-4 border-b pb-4'>
					<Skeleton className='h-10 w-10 rounded-full' />
					<div className='space-y-2'>
						<Skeleton className='h-8 w-64' />
						<Skeleton className='h-4 w-32' />
					</div>
				</div>
				<Skeleton className='h-[250px] rounded-xl w-full' />
				<Skeleton className='h-[180px] rounded-xl w-full' />
				<Skeleton className='h-[160px] rounded-xl w-full' />
			</div>
		)
	}

	// 5. UI: Xatolik holati
	if (error) {
		return (
			<div className='flex flex-col items-center justify-center min-h-[50vh] text-center p-12'>
				<div className='bg-destructive/10 text-destructive p-5 rounded-full mb-4'>
					<ShieldAlert className='h-12 w-12' />
				</div>
				<h2 className='text-2xl font-bold text-destructive'>
					{t('errors.errorOccurred') || 'Xatolik yuz berdi'}
				</h2>
				<p className='text-muted-foreground mt-2 max-w-sm mb-6'>{error}</p>
				<Button
					onClick={() => router.push('/admin/students')}
					variant='outline'
				>
					<ArrowLeft className='mr-2 h-4 w-4' />{' '}
					{t('common.goBack') || 'Ortga qaytish'}
				</Button>
			</div>
		)
	}

	// 6. UI: Asosiy Forma
	return (
		<motion.div
			variants={containerVariants}
			initial='hidden'
			animate='show'
			className='max-w-4xl mx-auto space-y-6 pb-24 pt-2 relative'
		>
			{/* 🏷️ PAGE HEADER */}
			<motion.div
				variants={itemVariants}
				className='flex items-center gap-4 border-b pb-4'
			>
				<Button
					variant='outline'
					size='icon'
					className='h-10 w-10 rounded-full shrink-0 shadow-sm'
					asChild
				>
					<Link href={`/admin/students/${id}/view`}>
						<ArrowLeft className='h-5 w-5' />
					</Link>
				</Button>
				<div>
					<h1 className='text-2xl font-bold tracking-tight'>
						{t('students.editStudent') || 'Talabani Tahrirlash'}
					</h1>
					<p className='text-muted-foreground text-sm font-medium font-mono mt-0.5'>
						ID: {id}
					</p>
				</div>
			</motion.div>

			<form onSubmit={handleSubmit} className='space-y-6'>
				{/* ASOSIY MA'LUMOTLAR */}
				<motion.div variants={itemVariants}>
					<Card className='shadow-sm border-border bg-card'>
						<CardHeader className='bg-muted/20 border-b pb-4'>
							<CardTitle className='text-lg'>
								{t('mentors.basicInfo') || "Asosiy ma'lumotlar"}
							</CardTitle>
						</CardHeader>
						<CardContent className='p-6 grid grid-cols-1 sm:grid-cols-2 gap-6'>
							<div className='space-y-2'>
								<Label htmlFor='firstName'>
									Ism <span className='text-destructive'>*</span>
								</Label>
								<Input
									id='firstName'
									name='firstName'
									value={formData.firstName}
									onChange={handleChange}
									required
									className='bg-background'
								/>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='lastName'>
									Familiya <span className='text-destructive'>*</span>
								</Label>
								<Input
									id='lastName'
									name='lastName'
									value={formData.lastName}
									onChange={handleChange}
									required
									className='bg-background'
								/>
							</div>
							<div className='space-y-2 sm:col-span-2 md:col-span-1'>
								<Label htmlFor='phoneNumber'>
									Telefon raqam <span className='text-destructive'>*</span>
								</Label>
								<Input
									id='phoneNumber'
									type='tel'
									value={formData.phoneNumber}
									onChange={handlePhoneChange}
									placeholder='+998 90 123 45 67'
									required
									className='bg-background font-mono'
								/>
							</div>
						</CardContent>
					</Card>
				</motion.div>

				{/* O'QUV KURSI VA GURUH */}
				<motion.div variants={itemVariants}>
					<Card className='shadow-sm border-border bg-card'>
						<CardHeader className='bg-muted/20 border-b pb-4'>
							<CardTitle className='text-lg'>O'quv kursi va Guruh</CardTitle>
						</CardHeader>
						<CardContent className='p-6 grid grid-cols-1 sm:grid-cols-2 gap-6'>
							<div className='space-y-2'>
								<Label>Kurs</Label>
								<Select
									value={formData.course}
									onValueChange={val =>
										setFormData(p => ({ ...p, course: val }))
									}
								>
									<SelectTrigger className='bg-background'>
										<SelectValue placeholder='Kursni tanlang' />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectLabel>Bakalavr</SelectLabel>
											{['1-kurs', '2-kurs', '3-kurs', '4-kurs'].map(k => (
												<SelectItem key={k} value={`${k} (Bakalavr)`}>
													{k} (Bakalavr)
												</SelectItem>
											))}
										</SelectGroup>
										<SelectGroup>
											<SelectLabel>Magistratura</SelectLabel>
											{['1-kurs', '2-kurs'].map(k => (
												<SelectItem key={k} value={`${k} (Magistratura)`}>
													{k} (Magistratura)
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
							</div>
							<div className='space-y-2'>
								<Label>Guruh</Label>
								<div className='flex items-center gap-2'>
									<Input
										name='groupPrefix'
										value={formData.groupPrefix}
										onChange={handleChange}
										placeholder='320'
										className='text-center bg-background'
									/>
									<span className='text-muted-foreground font-bold'>-</span>
									<Input
										name='groupSuffix'
										value={formData.groupSuffix}
										onChange={handleChange}
										placeholder='22'
										className='text-center bg-background'
									/>
								</div>
							</div>
						</CardContent>
					</Card>
				</motion.div>

				{/* TIZIM RUXSATLARI (STATUS) */}
				<motion.div variants={itemVariants}>
					<Card className='shadow-sm border-destructive/30 bg-destructive/5 dark:bg-destructive/10'>
						<CardHeader className='border-b border-destructive/10 pb-4 bg-transparent'>
							<CardTitle className='text-lg flex items-center gap-2 text-destructive'>
								<ShieldAlert className='h-5 w-5' /> Tizim ruxsatlari
							</CardTitle>
						</CardHeader>
						<CardContent className='p-6'>
							<div
								className={`flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-card transition-colors ${formData.status === 'blocked' ? 'border-destructive/50' : 'hover:border-primary/40'}`}
							>
								<div className='space-y-1 w-2/3 pr-4'>
									<Label
										className={`text-base font-bold ${formData.status === 'blocked' ? 'text-destructive' : 'text-foreground'}`}
									>
										Talaba holati
									</Label>
									<p className='text-xs text-muted-foreground w-full'>
										Bloklangan foydalanuvchi tizimga kira olmaydi.
									</p>
								</div>
								<Select
									value={formData.status}
									onValueChange={val =>
										setFormData(p => ({ ...p, status: val }))
									}
								>
									<SelectTrigger
										className={`w-[130px] font-semibold ${formData.status === 'blocked' ? 'text-destructive border-destructive/30 bg-destructive/10' : 'text-green-600 dark:text-green-400 border-green-500/30 bg-green-500/10'}`}
									>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem
											value='active'
											className='text-green-600 dark:text-green-400 font-medium'
										>
											Faol
										</SelectItem>
										<SelectItem
											value='blocked'
											className='text-destructive font-medium'
										>
											Bloklangan
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</CardContent>
					</Card>
				</motion.div>

				{/* 🔒 STICKY FOOTER (SAVE BUTTONS) */}
				<motion.div
					variants={itemVariants}
					className='flex justify-end gap-3 p-4 bg-background/80 backdrop-blur-xl rounded-xl border border-border/50 shadow-lg sticky bottom-4 z-50 transition-all hover:shadow-xl'
				>
					<Button
						type='button'
						variant='outline'
						onClick={() => router.back()}
						disabled={isSaving}
					>
						{t('common.cancel') || 'Bekor qilish'}
					</Button>
					<Button
						type='submit'
						disabled={isSaving}
						className='px-8 bg-primary font-semibold shadow-md'
					>
						{isSaving ? (
							<Loader2 className='mr-2 h-4 w-4 animate-spin' />
						) : (
							<Save className='mr-2 h-4 w-4' />
						)}
						{t('common.saveChanges') || "O'zgarishlarni saqlash"}
					</Button>
				</motion.div>
			</form>
		</motion.div>
	)
}
