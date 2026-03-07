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
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2, Save, ShieldAlert } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const containerVariants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: { staggerChildren: 0.1 },
	},
}

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	show: {
		opacity: 1,
		y: 0,
		transition: { type: 'spring', stiffness: 300, damping: 24 },
	},
}

const formatPhoneStr = str => {
	let val = (str || '').replace(/[^\d+]/g, '')
	if (!val.startsWith('+998')) val = '+998'
	const raw = val.slice(4).substring(0, 9)
	let formatted = '+998'
	if (raw.length > 0) formatted += ' ' + raw.substring(0, 2)
	if (raw.length > 2) formatted += ' ' + raw.substring(2, 5)
	if (raw.length > 5) formatted += ' ' + raw.substring(5, 9)
	return formatted
}

export default function StudentEditPage() {
	const params = useParams()
	const router = useRouter()
	const { id } = params
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

	useEffect(() => {
		const fetchStudent = async () => {
			try {
				const res = await api.get(`/admin/students/${id}`)
				if (res?.data?.success) {
					const data = res.data.student
					const [gPref, gSuff] = (data.group || '-').split('-')

					setFormData({
						firstName: data.firstName || '',
						lastName: data.lastName || '',
						phoneNumber: formatPhoneStr(data.phoneNumber),
						course: data.course || '1-kurs (Bakalavr)',
						groupPrefix: gPref || '',
						groupSuffix: gSuff || '',
						status: data.status || 'active',
					})
				} else {
					setError('Talaba topilmadi')
				}
			} catch (err) {
				console.error(err)
				setError("Server xatosi: Ma'lumot yuklanmadi")
			} finally {
				setLoading(false)
			}
		}

		if (id) fetchStudent()
	}, [id])

	const handleChange = e => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handlePhoneChange = e => {
		setFormData(p => ({ ...p, phoneNumber: formatPhoneStr(e.target.value) }))
	}

	const handleSubmit = async e => {
		e.preventDefault()
		setIsSaving(true)
		try {
			const finalGroup =
				formData.groupPrefix && formData.groupSuffix
					? `${formData.groupPrefix}-${formData.groupSuffix}`
					: formData.groupPrefix || formData.groupSuffix || ''

			const payload = {
				...formData,
				group: finalGroup,
				phoneNumber: formData.phoneNumber.replace(/\s+/g, ''),
			}

			const res = await api.put(`/admin/students/${id}`, payload)
			if (res?.data?.success) {
				router.push(`/admin/students/${id}/view`)
				router.refresh()
			}
		} catch (err) {
			console.error(err)
		} finally {
			setIsSaving(false)
		}
	}

	if (loading) {
		return (
			<div className='max-w-4xl mx-auto space-y-6 pt-6 pb-20'>
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

	if (error) {
		return (
			<div className='flex flex-col items-center justify-center p-12 text-center h-[60vh]'>
				<div className='bg-red-50 text-red-500 p-4 rounded-full mb-4'>
					<ShieldAlert className='h-10 w-10' />
				</div>
				<h2 className='text-2xl font-bold text-red-500'>Xatolik yuz berdi</h2>
				<p className='text-muted-foreground mt-2 mb-6'>{error}</p>
				<Button
					onClick={() => router.push('/admin/students')}
					variant='outline'
				>
					<ArrowLeft className='mr-2 h-4 w-4' /> Ortga qaytish
				</Button>
			</div>
		)
	}

	return (
		<motion.div
			variants={containerVariants}
			initial='hidden'
			animate='show'
			className='max-w-4xl mx-auto space-y-6 pb-20 relative'
		>
			<motion.div
				variants={itemVariants}
				className='flex items-center gap-4 border-b pb-4'
			>
				<Button
					variant='outline'
					size='icon'
					className='h-10 w-10 rounded-full shrink-0'
					asChild
				>
					<Link href={`/admin/students/${id}/view`}>
						<ArrowLeft className='h-5 w-5' />
					</Link>
				</Button>
				<div>
					<h1 className='text-2xl font-bold tracking-tight'>
						Talabani Tahrirlash
					</h1>
					<p className='text-sm text-muted-foreground font-medium'>
						Tizimdagi ID: {id}
					</p>
				</div>
			</motion.div>

			<form onSubmit={handleSubmit} className='space-y-6'>
				<motion.div variants={itemVariants}>
					<Card className='shadow-sm border-muted'>
						<CardHeader className='bg-muted/30 border-b pb-4'>
							<CardTitle className='text-lg'>Asosiy ma'lumotlar</CardTitle>
						</CardHeader>
						<CardContent className='p-6 grid grid-cols-1 sm:grid-cols-2 gap-6'>
							<div className='space-y-2'>
								<Label htmlFor='firstName'>Ism</Label>
								<Input
									id='firstName'
									name='firstName'
									value={formData.firstName}
									onChange={handleChange}
									required
								/>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='lastName'>Familiya</Label>
								<Input
									id='lastName'
									name='lastName'
									value={formData.lastName}
									onChange={handleChange}
									required
								/>
							</div>
							<div className='space-y-2 sm:col-span-2 md:col-span-1'>
								<Label htmlFor='phoneNumber'>Telefon raqam</Label>
								<Input
									id='phoneNumber'
									type='tel'
									value={formData.phoneNumber}
									onChange={handlePhoneChange}
									placeholder='+998 90 123 4567'
									required
								/>
							</div>
						</CardContent>
					</Card>
				</motion.div>

				<motion.div variants={itemVariants}>
					<Card className='shadow-sm border-muted'>
						<CardHeader className='bg-muted/30 border-b pb-4'>
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
									<SelectTrigger>
										<SelectValue placeholder='Kursni tanlang' />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectLabel>Bakalavr</SelectLabel>
											<SelectItem value='1-kurs (Bakalavr)'>
												1-kurs (Bakalavr)
											</SelectItem>
											<SelectItem value='2-kurs (Bakalavr)'>
												2-kurs (Bakalavr)
											</SelectItem>
											<SelectItem value='3-kurs (Bakalavr)'>
												3-kurs (Bakalavr)
											</SelectItem>
											<SelectItem value='4-kurs (Bakalavr)'>
												4-kurs (Bakalavr)
											</SelectItem>
										</SelectGroup>
										<SelectGroup>
											<SelectLabel>Magistratura</SelectLabel>
											<SelectItem value='1-kurs (Magistratura)'>
												1-kurs (Magistratura)
											</SelectItem>
											<SelectItem value='2-kurs (Magistratura)'>
												2-kurs (Magistratura)
											</SelectItem>
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
										className='text-center'
									/>
									<span className='text-muted-foreground font-bold'>-</span>
									<Input
										name='groupSuffix'
										value={formData.groupSuffix}
										onChange={handleChange}
										placeholder='22'
										className='text-center'
									/>
								</div>
							</div>
						</CardContent>
					</Card>
				</motion.div>

				<motion.div variants={itemVariants}>
					<Card className='shadow-sm border-red-500/20 bg-red-50/10'>
						<CardHeader className='border-b border-red-500/10 pb-4'>
							<CardTitle className='text-lg flex items-center gap-2'>
								<ShieldAlert className='h-5 w-5 text-red-500' /> Tizim
								ruxsatlari
							</CardTitle>
						</CardHeader>
						<CardContent className='p-6'>
							<div className='flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-card hover:border-red-500/50 transition-colors'>
								<div className='space-y-1 w-2/3 pr-4'>
									<Label
										className={`text-base font-bold ${formData.status === 'blocked' ? 'text-red-500' : 'text-foreground'}`}
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
										className={`w-[130px] font-semibold ${
											formData.status === 'blocked'
												? 'text-red-500 border-red-200 bg-red-50'
												: 'text-green-600 border-green-200 bg-green-50'
										}`}
									>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem
											value='active'
											className='text-green-600 font-medium'
										>
											Faol
										</SelectItem>
										<SelectItem
											value='blocked'
											className='text-red-500 font-medium'
										>
											Bloklangan
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</CardContent>
					</Card>
				</motion.div>

				<motion.div
					variants={itemVariants}
					className='flex justify-end gap-3 p-4 bg-background/90 backdrop-blur-md rounded-xl border shadow-lg sticky bottom-4 z-50'
				>
					<Button
						type='button'
						variant='outline'
						onClick={() => router.back()}
						disabled={isSaving}
					>
						Bekor qilish
					</Button>
					<Button
						type='submit'
						disabled={isSaving}
						className='px-8 bg-primary font-semibold'
					>
						{isSaving ? (
							<Loader2 className='mr-2 h-4 w-4 animate-spin' />
						) : (
							<Save className='mr-2 h-4 w-4' />
						)}
						O'zgarishlarni saqlash
					</Button>
				</motion.div>
			</form>
		</motion.div>
	)
}
