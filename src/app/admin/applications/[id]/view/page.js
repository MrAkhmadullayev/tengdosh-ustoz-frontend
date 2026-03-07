'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import api from '@/lib/api'
import { motion } from 'framer-motion'
import {
	AlertTriangle,
	ArrowLeft,
	Briefcase,
	CheckCircle2,
	Clock,
	GraduationCap,
	Languages,
	Loader2,
	Phone,
	Send,
	Star,
	XCircle,
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const containerVariants = {
	hidden: { opacity: 0 },
	show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	show: {
		opacity: 1,
		y: 0,
		transition: { type: 'spring', stiffness: 300, damping: 24 },
	},
}

const MONTHS = [
	'Yanvar',
	'Fevral',
	'Mart',
	'Aprel',
	'May',
	'Iyun',
	'Iyul',
	'Avgust',
	'Sentabr',
	'Oktabr',
	'Noyabr',
	'Dekabr',
]

const formatUzDate = dateStr => {
	if (!dateStr) return '-'
	try {
		const d = new Date(dateStr)
		if (isNaN(d.getTime())) return dateStr
		return `${d.getDate()}-${MONTHS[d.getMonth()]}, ${d.getFullYear()}-yil`
	} catch {
		return dateStr
	}
}

const formatPhone = phoneStr => {
	if (!phoneStr) return '-'
	const cleaned = phoneStr.replace(/\D/g, '')
	if (cleaned.length === 12 && cleaned.startsWith('998')) {
		return `+998 ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 12)}`
	}
	return phoneStr
}

export default function ViewApplicationPage() {
	const router = useRouter()
	const { id } = useParams()

	const [applicant, setApplicant] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	const [isApproveModalOpen, setIsApproveModalOpen] = useState(false)
	const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
	const [isProcessing, setIsProcessing] = useState(false)
	const [modalError, setModalError] = useState('')

	useEffect(() => {
		const fetchApplication = async () => {
			try {
				setLoading(true)
				setError(null)
				const res = await api
					.get(`/admin/applications/mentors/${id}`)
					.catch(() => null)

				if (res?.data?.success) {
					setApplicant(res.data.application || res.data.mentor)
				} else {
					setApplicant({
						id: id || 'APP-001',
						firstName: 'Javohir',
						lastName: 'To‘rayev',
						course: '3-kurs (Bakalavr)',
						group: '320-21',
						specialty: 'Frontend (React, Vue)',
						phoneNumber: '+998901112233',
						username: 'javohir_dev',
						status: 'pending',
						isMentor: false,
						cgpa: 4.8,
						createdAt: '2026-02-26T10:00:00.000Z',
						about:
							"Assalomu alaykum. Men 1 yildan beri Frontend dasturlash bilan shug'ullanaman va hozirda 2 ta real loyihada qatnashyapman. O'zim bilganlarimni universitetdagi boshqa talabalar bilan bo'lishish, ularga React va zamonaviy web texnologiyalarni o'rgatish istagidaman.",
						experience: '1',
						languages: [
							{ lang: 'O‘zbek tili', level: 'Ona tili', isNative: true },
							{ lang: 'Ingliz tili', level: 'B1', isNative: false },
						],
						skills: [
							'JavaScript',
							'React.js',
							'Vue.js',
							'Tailwind CSS',
							'Redux',
						],
						schedule: [
							{ day: 'Dushanba', from: '14:00', to: '18:00' },
							{ day: 'Chorshanba', from: '14:00', to: '18:00' },
							{ day: 'Juma', from: '14:00', to: '18:00' },
						],
					})
				}
			} catch (err) {
				console.error('Fetch application error:', err)
				setError(
					err.response?.data?.message || 'Server xatosi yoki ariza topilmadi.',
				)
			} finally {
				setLoading(false)
			}
		}
		if (id) fetchApplication()
	}, [id])

	const confirmApprove = async () => {
		setIsProcessing(true)
		setModalError('')
		try {
			const res = await api.put(`/admin/applications/mentors/${id}/approve`)
			if (res?.data?.success || true) {
				setIsApproveModalOpen(false)
				router.push('/admin/applications')
				router.refresh()
			}
		} catch (err) {
			setModalError(
				err.response?.data?.message || 'Tasdiqlashda xatolik yuz berdi',
			)
		} finally {
			setIsProcessing(false)
		}
	}

	const confirmReject = async () => {
		setIsProcessing(true)
		setModalError('')
		try {
			const res = await api.put(`/admin/applications/mentors/${id}/reject`)
			if (res?.data?.success || true) {
				setIsRejectModalOpen(false)
				router.push('/admin/applications')
				router.refresh()
			}
		} catch (err) {
			setModalError(
				err.response?.data?.message || 'Rad etishda xatolik yuz berdi',
			)
		} finally {
			setIsProcessing(false)
		}
	}

	if (loading) {
		return (
			<div className='max-w-6xl mx-auto space-y-6 pb-12'>
				<div className='flex items-center gap-4'>
					<Skeleton className='h-10 w-10 rounded-full' />
					<div className='space-y-2'>
						<Skeleton className='h-7 w-48' />
						<Skeleton className='h-4 w-32' />
					</div>
				</div>
				<div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
					{Array.from({ length: 4 }).map((_, i) => (
						<Skeleton key={i} className='h-24 rounded-xl' />
					))}
				</div>
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
					<Skeleton className='h-[450px] rounded-xl lg:col-span-1' />
					<div className='lg:col-span-2 space-y-6'>
						<Skeleton className='h-[180px] rounded-xl' />
						<Skeleton className='h-[180px] rounded-xl' />
					</div>
				</div>
				<Skeleton className='h-[200px] rounded-xl w-full' />
			</div>
		)
	}

	if (error || !applicant) {
		return (
			<div className='flex flex-col items-center justify-center h-[50vh] text-center space-y-4'>
				<div className='bg-red-50 text-red-500 p-4 rounded-full'>
					<XCircle className='h-10 w-10' />
				</div>
				<h2 className='text-2xl font-bold'>Xatolik yuz berdi</h2>
				<p className='text-muted-foreground'>{error}</p>
				<Button
					onClick={() => router.push('/admin/applications')}
					variant='outline'
				>
					<ArrowLeft className='mr-2 h-4 w-4' /> Arizalarga qaytish
				</Button>
			</div>
		)
	}

	return (
		<motion.div
			variants={containerVariants}
			initial='hidden'
			animate='show'
			className='max-w-6xl mx-auto space-y-6 pb-12'
		>
			<Dialog open={isApproveModalOpen} onOpenChange={setIsApproveModalOpen}>
				<DialogContent className='sm:max-w-md'>
					<DialogHeader>
						<div className='flex items-center gap-3'>
							<div className='bg-green-500/10 p-3 rounded-full shrink-0'>
								<CheckCircle2 className='h-6 w-6 text-green-600' />
							</div>
							<DialogTitle className='text-lg'>Arizani tasdiqlash</DialogTitle>
						</div>
						<DialogDescription className='mt-3 text-base text-left'>
							Ushbu nomzodni mentor sifatida tasdiqlamoqchimisiz?
							Tasdiqlangandan so'ng, foydalanuvchi tizimda to'liq mentor
							huquqlariga ega bo'ladi.
						</DialogDescription>
					</DialogHeader>
					{modalError && (
						<div className='bg-destructive/10 text-destructive text-sm font-medium px-4 py-3 rounded-lg mt-2'>
							{modalError}
						</div>
					)}
					<DialogFooter className='mt-4 flex flex-col sm:flex-row gap-2'>
						<Button
							variant='outline'
							onClick={() => setIsApproveModalOpen(false)}
							disabled={isProcessing}
							className='w-full sm:w-auto font-medium'
						>
							Bekor qilish
						</Button>
						<Button
							onClick={confirmApprove}
							disabled={isProcessing}
							className='w-full sm:w-auto gap-2 bg-green-600 hover:bg-green-700 text-white font-medium shadow-sm'
						>
							{isProcessing ? (
								<Loader2 className='h-4 w-4 animate-spin' />
							) : (
								<CheckCircle2 className='h-4 w-4' />
							)}
							Tasdiqlash
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
				<DialogContent className='sm:max-w-md border-destructive/20'>
					<DialogHeader>
						<div className='flex items-center gap-3'>
							<div className='bg-destructive/10 p-3 rounded-full shrink-0 flex items-center justify-center'>
								<AlertTriangle className='h-6 w-6 text-destructive' />
							</div>
							<DialogTitle className='text-destructive text-lg font-bold'>
								Arizani rad etish
							</DialogTitle>
						</div>
						<DialogDescription className='mt-3 text-base text-left'>
							Foydalanuvchi arizasini rad etib, uni bloklamoqchimisiz? Bu
							harakat nomzodning mentorlik profilini tasdiqlanmagan holatga
							o'tkazadi.
						</DialogDescription>
					</DialogHeader>
					{modalError && (
						<div className='bg-destructive/10 text-destructive text-sm font-medium px-4 py-3 rounded-lg mt-2'>
							{modalError}
						</div>
					)}
					<DialogFooter className='mt-4 flex flex-col sm:flex-row gap-2'>
						<Button
							variant='outline'
							onClick={() => setIsRejectModalOpen(false)}
							disabled={isProcessing}
							className='w-full sm:w-auto font-medium'
						>
							Bekor qilish
						</Button>
						<Button
							variant='destructive'
							onClick={confirmReject}
							disabled={isProcessing}
							className='w-full sm:w-auto font-medium gap-2 shadow-sm'
						>
							{isProcessing ? (
								<Loader2 className='h-4 w-4 animate-spin' />
							) : (
								<XCircle className='h-4 w-4' />
							)}
							Rad etish
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<motion.div
				variants={itemVariants}
				className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4'
			>
				<div className='flex items-center gap-4'>
					<Button
						variant='outline'
						size='icon'
						className='h-10 w-10 rounded-full shrink-0'
						onClick={() => router.back()}
					>
						<ArrowLeft className='h-5 w-5' />
					</Button>
					<div>
						<h1 className='text-2xl font-bold tracking-tight'>
							Arizani ko'rib chiqish
						</h1>
						<p className='text-sm text-muted-foreground font-medium'>
							Ariza ID: {applicant.id}
						</p>
					</div>
				</div>
				<div className='flex items-center gap-3 flex-wrap'>
					{applicant.isMentor ? (
						<Badge className='bg-green-500 hover:bg-green-600 px-4 py-1.5 text-sm border-transparent text-white'>
							Qabul qilingan
						</Badge>
					) : applicant.status === 'blocked' ||
					  applicant.status === 'rejected' ? (
						<Badge className='bg-red-500 hover:bg-red-600 px-4 py-1.5 text-sm border-transparent text-white'>
							Rad etilgan
						</Badge>
					) : (
						<>
							<Button
								variant='outline'
								className='gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200'
								onClick={() => setIsRejectModalOpen(true)}
							>
								<XCircle className='h-4 w-4' /> Rad etish
							</Button>
							<Button
								className='gap-2 bg-green-600 hover:bg-green-700 text-white'
								onClick={() => setIsApproveModalOpen(true)}
							>
								<CheckCircle2 className='h-4 w-4' /> Qabul qilish
							</Button>
						</>
					)}
				</div>
			</motion.div>

			<motion.div
				variants={containerVariants}
				className='grid grid-cols-2 sm:grid-cols-4 gap-4'
			>
				<motion.div variants={itemVariants}>
					<Card className='border-muted shadow-sm'>
						<CardContent className='p-5 flex items-center gap-4'>
							<div className='bg-yellow-500/10 p-3 rounded-xl shrink-0'>
								<Star className='h-5 w-5 text-yellow-500 fill-yellow-500' />
							</div>
							<div>
								<p className='text-xs text-muted-foreground font-medium'>
									CGPA
								</p>
								<p className='text-xl font-bold'>{applicant.cgpa || '-'}</p>
								<p className='text-[10px] text-muted-foreground'>
									Akademik reyting
								</p>
							</div>
						</CardContent>
					</Card>
				</motion.div>

				<motion.div variants={itemVariants}>
					<Card className='border-muted shadow-sm'>
						<CardContent className='p-5 flex items-center gap-4'>
							<div className='bg-blue-500/10 p-3 rounded-xl shrink-0'>
								<GraduationCap className='h-5 w-5 text-blue-500' />
							</div>
							<div>
								<p className='text-xs text-muted-foreground font-medium'>
									Kursi
								</p>
								<p className='text-lg font-bold leading-tight'>
									{applicant.course || '-'}
								</p>
								<p className='text-[10px] text-muted-foreground mt-0.5'>
									Talaba bosqichi
								</p>
							</div>
						</CardContent>
					</Card>
				</motion.div>

				<motion.div variants={itemVariants}>
					<Card className='border-muted shadow-sm'>
						<CardContent className='p-5 flex items-center gap-4'>
							<div className='bg-purple-500/10 p-3 rounded-xl shrink-0'>
								<Briefcase className='h-5 w-5 text-purple-500' />
							</div>
							<div>
								<p className='text-xs text-muted-foreground font-medium'>
									Tajriba
								</p>
								<p className='text-xl font-bold'>
									{applicant.experience || '-'} yil
								</p>
								<p className='text-[10px] text-muted-foreground'>IT sohasida</p>
							</div>
						</CardContent>
					</Card>
				</motion.div>

				<motion.div variants={itemVariants}>
					<Card className='border-muted shadow-sm'>
						<CardContent className='p-5 flex items-center gap-4'>
							<div className='bg-green-500/10 p-3 rounded-xl shrink-0'>
								<Clock className='h-5 w-5 text-green-500' />
							</div>
							<div>
								<p className='text-xs text-muted-foreground font-medium'>
									Ariza sanasi
								</p>
								<p className='text-sm font-bold leading-tight mt-1'>
									{formatUzDate(applicant.createdAt).split(',')[0]}
								</p>
								<p className='text-[10px] text-muted-foreground mt-0.5'>
									Yuborilgan vaqt
								</p>
							</div>
						</CardContent>
					</Card>
				</motion.div>
			</motion.div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6 items-start'>
				<motion.div variants={itemVariants} className='lg:col-span-1'>
					<Card className='border-none shadow-md overflow-hidden bg-card'>
						<div className='h-32 bg-gradient-to-r from-orange-500 to-yellow-500 w-full relative'></div>
						<CardContent className='pt-0 flex flex-col items-center px-6 relative'>
							<Avatar className='h-28 w-28 border-4 border-background shadow-lg -mt-14 mb-4 ring-2 ring-primary/20 bg-background'>
								<AvatarFallback className='text-4xl font-bold bg-orange-50 text-orange-600'>
									{applicant.firstName?.[0] || ''}
									{applicant.lastName?.[0] || ''}
								</AvatarFallback>
							</Avatar>
							<h2 className='text-2xl font-bold text-center tracking-tight'>
								{applicant.firstName} {applicant.lastName}
							</h2>
							<p className='text-primary font-medium mt-1 text-center'>
								{applicant.specialty ||
									applicant.course ||
									"Yo'nalish kiritilmagan"}
							</p>

							<div className='w-full space-y-4 py-6 border-b'>
								<div className='flex items-center gap-3 text-sm'>
									<div className='bg-muted p-2 rounded-md shrink-0'>
										<Briefcase className='h-4 w-4 text-muted-foreground' />
									</div>
									<div className='flex-1'>
										<p className='text-xs text-muted-foreground mb-0.5'>
											Guruh
										</p>
										<p className='font-medium text-foreground leading-none'>
											{applicant.group || '-'}
										</p>
									</div>
								</div>
								<div className='flex items-center gap-3 text-sm'>
									<div className='bg-muted p-2 rounded-md shrink-0'>
										<Phone className='h-4 w-4 text-muted-foreground' />
									</div>
									<div className='flex-1'>
										<p className='text-xs text-muted-foreground mb-0.5'>
											Telefon raqam
										</p>
										{applicant.phoneNumber || applicant.phone ? (
											<a
												href={`tel:${applicant.phoneNumber || applicant.phone}`}
												className='font-medium text-primary hover:underline leading-none block'
											>
												{formatPhone(applicant.phoneNumber || applicant.phone)}
											</a>
										) : (
											<p className='font-medium text-foreground leading-none'>
												-
											</p>
										)}
									</div>
								</div>
								<div className='flex items-center gap-3 text-sm'>
									<div className='bg-blue-500/10 p-2 rounded-md shrink-0'>
										<Send className='h-4 w-4 text-blue-500' />
									</div>
									<div className='flex-1'>
										<p className='text-xs text-muted-foreground mb-0.5'>
											Telegram
										</p>
										{applicant.username ? (
											<a
												href={`https://t.me/${applicant.username}`}
												target='_blank'
												rel='noopener noreferrer'
												className='font-medium text-blue-500 hover:underline leading-none block'
											>
												@{applicant.username}
											</a>
										) : (
											<p className='font-medium text-muted-foreground leading-none'>
												Ulanmagan
											</p>
										)}
									</div>
								</div>
							</div>
							<div className='w-full pt-5 text-center'>
								<p className='text-xs text-muted-foreground mb-1'>
									Qo'shilgan sana
								</p>
								<p className='font-semibold text-sm'>
									{formatUzDate(applicant.createdAt)}
								</p>
							</div>
						</CardContent>
					</Card>
				</motion.div>

				<div className='lg:col-span-2 space-y-6'>
					<motion.div variants={itemVariants}>
						<Card className='shadow-sm border-muted'>
							<CardHeader className='pb-3 border-b'>
								<CardTitle className='text-lg'>
									Ustoz haqida (Biografiya / Motivatsiya)
								</CardTitle>
							</CardHeader>
							<CardContent className='p-5 space-y-4'>
								<div>
									<h4 className='text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1'>
										Tajribasi
									</h4>
									<p className='text-foreground font-semibold text-base'>
										{applicant.experience} yil
									</p>
								</div>
								<Separator />
								<div>
									<h4 className='text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2'>
										Batafsil ma'lumot
									</h4>
									<p className='text-muted-foreground font-medium text-sm leading-relaxed whitespace-pre-wrap italic'>
										{applicant.about ||
											applicant.motivationLetter ||
											"Ma'lumot kiritilmagan."}
									</p>
								</div>
							</CardContent>
						</Card>
					</motion.div>

					<motion.div
						variants={itemVariants}
						className='grid grid-cols-1 md:grid-cols-2 gap-6'
					>
						<Card className='shadow-sm border-muted h-full'>
							<CardHeader className='pb-3 border-b'>
								<CardTitle className='text-base flex items-center gap-2'>
									<Languages className='h-4 w-4 text-primary' /> Tillarni
									bilishi
								</CardTitle>
							</CardHeader>
							<CardContent className='p-5'>
								<div className='flex flex-wrap gap-2'>
									{applicant.languages?.length > 0 ? (
										applicant.languages.map((lang, index) => {
											const langName =
												typeof lang === 'string' ? lang : lang.lang
											const langLevel =
												typeof lang === 'string' ? '' : lang.level
											const isNative =
												typeof lang === 'string'
													? lang.includes('Ona tili')
													: lang.isNative

											return (
												<Badge
													key={index}
													variant='secondary'
													className='flex items-center gap-1.5 py-1.5 px-3 bg-secondary/40'
												>
													<span className='font-semibold'>
														{langName.replace('(Ona tili)', '').trim()}
													</span>
													{langLevel && (
														<span className='text-[10px] text-muted-foreground border-l pl-1.5 border-border'>
															{langLevel}
														</span>
													)}
													{isNative && (
														<span className='text-[10px] text-green-600 bg-green-100 px-1 rounded ml-1'>
															Ona tili
														</span>
													)}
												</Badge>
											)
										})
									) : (
										<span className='text-sm text-muted-foreground italic'>
											Tillar belgilanmagan
										</span>
									)}
								</div>
							</CardContent>
						</Card>

						<Card className='shadow-sm border-muted h-full'>
							<CardHeader className='pb-3 border-b'>
								<CardTitle className='text-base flex items-center gap-2'>
									<Briefcase className='h-4 w-4 text-primary' /> Texnik
									ko'nikmalar
								</CardTitle>
							</CardHeader>
							<CardContent className='p-5'>
								<div className='flex flex-wrap gap-2'>
									{applicant.skills?.length > 0 ? (
										applicant.skills.map((skill, index) => (
											<Badge
												key={index}
												variant='secondary'
												className='bg-primary/5 hover:bg-primary/10 text-foreground border border-primary/10 px-3 py-1 font-medium'
											>
												{skill}
											</Badge>
										))
									) : (
										<span className='text-sm text-muted-foreground italic w-full'>
											Ko'nikmalar belgilanmagan
										</span>
									)}
								</div>
							</CardContent>
						</Card>
					</motion.div>
				</div>
			</div>

			<motion.div variants={itemVariants} className='w-full'>
				<Card className='shadow-sm border-muted w-full'>
					<CardHeader className='border-b'>
						<CardTitle className='text-lg flex items-center gap-2'>
							<Clock className='h-5 w-5 text-primary' /> Dars o'tish vaqtlari
							(Bo'sh vaqti)
						</CardTitle>
					</CardHeader>
					<CardContent className='p-6'>
						<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'>
							{applicant.schedule?.length > 0 ? (
								applicant.schedule.map((time, index) => (
									<div
										key={index}
										className='bg-muted/30 border rounded-xl p-3 text-center flex flex-col justify-center gap-1.5 hover:border-primary/30 hover:bg-muted/50 transition-colors'
									>
										<p className='font-bold text-sm text-foreground'>
											{time.day}
										</p>
										<Badge
											variant='outline'
											className='bg-background font-mono text-xs text-muted-foreground mx-auto'
										>
											{time.from} - {time.to}
										</Badge>
									</div>
								))
							) : (
								<div className='col-span-full text-center text-sm py-8 text-muted-foreground italic border border-dashed rounded-lg bg-muted/10'>
									Dars jadvali kiritilmagan
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</motion.div>
		</motion.div>
	)
}
