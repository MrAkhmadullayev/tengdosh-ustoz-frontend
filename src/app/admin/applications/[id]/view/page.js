'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { useTranslation } from '@/lib/i18n'
// 🔥 Markazlashgan utilitalardan foydalanamiz
import {
	formatPhone,
	formatUzDate,
	getErrorMessage,
	getInitials,
} from '@/lib/utils'
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
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

// ==========================================
// 🎨 ANIMATSIYA VARIANTLARI
// ==========================================
const containerVariants = {
	hidden: { opacity: 0 },
	show: { opacity: 1, transition: { staggerChildren: 0.08 } },
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
export default function ViewApplicationPage() {
	const router = useRouter()
	const { id } = useParams()
	const { t } = useTranslation()

	const [applicant, setApplicant] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	// Modal va Loading statelar
	const [isApproveModalOpen, setIsApproveModalOpen] = useState(false)
	const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
	const [isProcessing, setIsProcessing] = useState(false)

	// 1. API dan ma'lumot yuklash
	const fetchApplication = useCallback(async () => {
		try {
			setLoading(true)
			setError(null)
			const res = await api.get(`/admin/applications/mentors/${id}`)

			if (res?.data?.success) {
				setApplicant(res.data.application || res.data.mentor)
			} else {
				setError(t('errors.notFound') || 'Ariza topilmadi')
			}
		} catch (err) {
			setError(
				getErrorMessage(
					err,
					t('errors.serverError') || 'Server xatosi yoki ariza topilmadi.',
				),
			)
		} finally {
			setLoading(false)
		}
	}, [id, t])

	useEffect(() => {
		if (id) fetchApplication()
	}, [fetchApplication])

	// 2. Qabul qilish (Approve) - Toast.promise bilan silliq ishlash
	const confirmApprove = async () => {
		setIsProcessing(true)

		const promise = api
			.put(`/admin/applications/mentors/${id}/approve`)
			.then(res => {
				if (res?.data?.success) {
					setIsApproveModalOpen(false)
					router.push('/admin/applications')
					router.refresh()
				}
			})

		toast.promise(promise, {
			loading: t('common.updating') || 'Tasdiqlanmoqda...',
			success:
				t('dashboard.approvedSuccess') || 'Ariza muvaffaqiyatli tasdiqlandi!',
			error: err => {
				setIsProcessing(false) // Xato bo'lsa tugmani ochamiz
				return getErrorMessage(
					err,
					t('errors.updateFailed') || 'Tasdiqlashda xatolik yuz berdi',
				)
			},
		})
	}

	// 3. Rad etish (Reject)
	const confirmReject = async () => {
		setIsProcessing(true)

		const promise = api
			.put(`/admin/applications/mentors/${id}/reject`)
			.then(res => {
				if (res?.data?.success) {
					setIsRejectModalOpen(false)
					router.push('/admin/applications')
					router.refresh()
				}
			})

		toast.promise(promise, {
			loading: t('common.updating') || 'Rad etilmoqda...',
			success: t('dashboard.rejectedSuccess') || 'Ariza rad etildi.',
			error: err => {
				setIsProcessing(false)
				return getErrorMessage(
					err,
					t('errors.updateFailed') || 'Rad etishda xatolik yuz berdi',
				)
			},
		})
	}

	// 4. UI: Loading Skeleton
	if (loading) {
		return (
			<div className='max-w-6xl mx-auto space-y-6 pb-12 pt-4 animate-pulse'>
				<div className='flex items-center gap-4 mb-8'>
					<Skeleton className='h-10 w-10 rounded-full' />
					<div className='space-y-2'>
						<Skeleton className='h-8 w-48' />
						<Skeleton className='h-4 w-32' />
					</div>
				</div>
				<div className='grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6'>
					{[...Array(4)].map((_, i) => (
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
			</div>
		)
	}

	// 5. UI: Error
	if (error || !applicant) {
		return (
			<div className='flex flex-col items-center justify-center h-[60vh] text-center space-y-4'>
				<div className='bg-destructive/10 text-destructive p-5 rounded-full'>
					<XCircle className='h-12 w-12' />
				</div>
				<h2 className='text-2xl font-bold'>
					{t('errors.errorOccurred') || 'Xatolik yuz berdi'}
				</h2>
				<p className='text-muted-foreground'>{error}</p>
				<Button
					onClick={() => router.push('/admin/applications')}
					variant='outline'
					className='mt-4'
				>
					<ArrowLeft className='mr-2 h-4 w-4' /> Arizalarga qaytish
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
			className='max-w-6xl mx-auto space-y-6 pb-12 pt-2 relative'
		>
			{/* 🛡️ TASDIQLASH MODALI */}
			<Dialog
				open={isApproveModalOpen}
				onOpenChange={val => !isProcessing && setIsApproveModalOpen(val)}
			>
				<DialogContent className='sm:max-w-md border-border'>
					<DialogHeader>
						<div className='flex items-center gap-3'>
							<div className='bg-green-500/10 p-3 rounded-full shrink-0'>
								<CheckCircle2 className='h-6 w-6 text-green-600 dark:text-green-500' />
							</div>
							<DialogTitle className='text-lg'>Arizani tasdiqlash</DialogTitle>
						</div>
						<DialogDescription className='mt-3 text-base text-left text-muted-foreground'>
							Ushbu nomzodni mentor sifatida tasdiqlamoqchimisiz?
							Tasdiqlangandan so'ng, foydalanuvchi tizimda to'liq mentor
							huquqlariga ega bo'ladi.
						</DialogDescription>
					</DialogHeader>
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

			{/* 🛡️ RAD ETISH MODALI */}
			<Dialog
				open={isRejectModalOpen}
				onOpenChange={val => !isProcessing && setIsRejectModalOpen(val)}
			>
				<DialogContent className='sm:max-w-md border-destructive/20 shadow-lg shadow-destructive/10'>
					<DialogHeader>
						<div className='flex items-center gap-3'>
							<div className='bg-destructive/10 p-3 rounded-full shrink-0 flex items-center justify-center'>
								<AlertTriangle className='h-6 w-6 text-destructive' />
							</div>
							<DialogTitle className='text-destructive text-lg font-bold'>
								Arizani rad etish
							</DialogTitle>
						</div>
						<DialogDescription className='mt-3 text-base text-left text-muted-foreground'>
							Foydalanuvchi arizasini rad etib, uni bloklamoqchimisiz? Bu
							harakat nomzodning mentorlik profilini tasdiqlanmagan holatga
							o'tkazadi.
						</DialogDescription>
					</DialogHeader>
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

			{/* 🏷️ PAGE HEADER */}
			<motion.div
				variants={itemVariants}
				className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4'
			>
				<div className='flex items-center gap-4'>
					<Button
						variant='outline'
						size='icon'
						className='h-10 w-10 rounded-full shrink-0 shadow-sm'
						onClick={() => router.back()}
					>
						<ArrowLeft className='h-5 w-5' />
					</Button>
					<div>
						<h1 className='text-2xl font-bold tracking-tight'>
							Arizani ko'rib chiqish
						</h1>
						<p className='text-sm text-muted-foreground font-medium font-mono mt-0.5'>
							ID: {applicant.id || applicant._id}
						</p>
					</div>
				</div>
				<div className='flex items-center gap-3 flex-wrap'>
					{applicant.isMentor ? (
						<Badge className='bg-green-500 hover:bg-green-600 px-4 py-1.5 text-sm border-transparent text-white shadow-none'>
							Qabul qilingan
						</Badge>
					) : applicant.status === 'blocked' ||
					  applicant.status === 'rejected' ? (
						<Badge
							variant='destructive'
							className='px-4 py-1.5 text-sm border-transparent shadow-none'
						>
							Rad etilgan
						</Badge>
					) : (
						<>
							<Button
								variant='outline'
								className='gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 transition-colors'
								onClick={() => setIsRejectModalOpen(true)}
							>
								<XCircle className='h-4 w-4' /> Rad etish
							</Button>
							<Button
								className='gap-2 bg-green-600 hover:bg-green-700 text-white shadow-sm'
								onClick={() => setIsApproveModalOpen(true)}
							>
								<CheckCircle2 className='h-4 w-4' /> Qabul qilish
							</Button>
						</>
					)}
				</div>
			</motion.div>

			{/* 📊 QISQACHA STATISTIKA */}
			<motion.div
				variants={containerVariants}
				className='grid grid-cols-2 sm:grid-cols-4 gap-4'
			>
				{[
					{
						title: 'CGPA',
						value: applicant.cgpa || '-',
						sub: 'Akademik reyting',
						icon: Star,
						color: 'text-yellow-500',
						bg: 'bg-yellow-500/10',
					},
					{
						title: 'Kursi',
						value: applicant.course || '-',
						sub: 'Talaba bosqichi',
						icon: GraduationCap,
						color: 'text-blue-500',
						bg: 'bg-blue-500/10',
					},
					{
						title: 'Tajriba',
						value: `${applicant.experience || '-'} yil`,
						sub: 'IT sohasida',
						icon: Briefcase,
						color: 'text-purple-500',
						bg: 'bg-purple-500/10',
					},
					{
						title: 'Ariza sanasi',
						value: formatUzDate(applicant.createdAt).split(',')[0],
						sub: 'Yuborilgan vaqt',
						icon: Clock,
						color: 'text-green-500',
						bg: 'bg-green-500/10',
					},
				].map((stat, idx) => (
					<motion.div key={idx} variants={itemVariants}>
						<Card className='border-border shadow-sm h-full hover:shadow-md transition-all bg-card'>
							<CardContent className='p-5 flex items-center gap-4 h-full'>
								<div className={`${stat.bg} p-3 rounded-xl shrink-0`}>
									<stat.icon
										className={`h-5 w-5 ${stat.color} ${stat.icon === Star ? 'fill-yellow-500 dark:fill-yellow-400' : ''}`}
									/>
								</div>
								<div className='flex-1 min-w-0'>
									<p className='text-[11px] uppercase tracking-wider text-muted-foreground font-bold truncate'>
										{stat.title}
									</p>
									<p className='text-xl font-bold truncate text-foreground'>
										{stat.value}
									</p>
									<p className='text-[10px] text-muted-foreground font-medium mt-0.5 truncate'>
										{stat.sub}
									</p>
								</div>
							</CardContent>
						</Card>
					</motion.div>
				))}
			</motion.div>

			{/* 🗂️ ASOSIY MA'LUMOTLAR */}
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6 items-start'>
				{/* CHAP PANEL: Shaxsiy vizitka */}
				<motion.div variants={itemVariants} className='lg:col-span-1'>
					<Card className='border-border shadow-md overflow-hidden bg-card'>
						<div className='h-32 bg-gradient-to-r from-orange-500 to-amber-500 dark:from-orange-700 dark:to-amber-800 w-full' />
						<CardContent className='pt-0 flex flex-col items-center px-6 relative'>
							<Avatar className='h-28 w-28 border-4 border-background shadow-lg -mt-14 mb-4 ring-2 ring-primary/10 bg-muted'>
								<AvatarImage
									src={applicant.avatar || ''}
									alt={applicant.firstName}
								/>
								<AvatarFallback className='text-4xl font-bold bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-500'>
									{getInitials(applicant.firstName, applicant.lastName)}
								</AvatarFallback>
							</Avatar>
							<h2 className='text-2xl font-bold text-center tracking-tight leading-tight mb-1'>
								{applicant.firstName} {applicant.lastName}
							</h2>
							<p className='text-primary font-bold text-[10px] bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider text-center'>
								{applicant.specialty ||
									applicant.course ||
									"Yo'nalish kiritilmagan"}
							</p>

							<div className='w-full space-y-4 py-6 border-b border-border/50 mt-2'>
								{[
									{
										icon: Briefcase,
										label: 'Guruh',
										value: applicant.group || '-',
									},
									{
										icon: Phone,
										label: 'Telefon raqam',
										value:
											applicant.phoneNumber || applicant.phone ? (
												<a
													href={`tel:${(applicant.phoneNumber || applicant.phone).replace(/\D/g, '')}`}
													className='text-primary hover:underline font-bold block'
												>
													{formatPhone(
														applicant.phoneNumber || applicant.phone,
													)}
												</a>
											) : (
												'-'
											),
									},
									{
										icon: Send,
										label: 'Telegram',
										color: 'text-blue-500',
										bg: 'bg-blue-500/10',
										value: applicant.username ? (
											<a
												href={`https://t.me/${applicant.username}`}
												target='_blank'
												rel='noopener noreferrer'
												className='text-blue-500 hover:underline font-bold block'
											>
												@{applicant.username}
											</a>
										) : (
											'Ulanmagan'
										),
									},
								].map((item, i) => (
									<div key={i} className='flex items-center gap-3 text-sm'>
										<div
											className={`${item.bg || 'bg-muted'} p-2 rounded-lg shrink-0`}
										>
											<item.icon
												className={`h-4 w-4 ${item.color || 'text-muted-foreground'}`}
											/>
										</div>
										<div className='flex-1 min-w-0'>
											<p className='text-[10px] text-muted-foreground font-bold uppercase tracking-tighter mb-0.5'>
												{item.label}
											</p>
											<div className='font-medium text-foreground truncate'>
												{item.value}
											</div>
										</div>
									</div>
								))}
							</div>
							<div className='w-full pt-5 text-center'>
								<p className='text-xs text-muted-foreground mb-1 uppercase tracking-wider font-bold'>
									Qo'shilgan sana
								</p>
								<p className='font-semibold text-sm'>
									{formatUzDate(applicant.createdAt)}
								</p>
							</div>
						</CardContent>
					</Card>
				</motion.div>

				{/* O'NG PANEL: Motivatsiya, Tillar, Ko'nikmalar */}
				<div className='lg:col-span-2 space-y-6'>
					<motion.div variants={itemVariants}>
						<Card className='shadow-sm border-border bg-card'>
							<CardHeader className='pb-3 border-b bg-muted/20'>
								<CardTitle className='text-lg'>
									Ustoz haqida (Biografiya / Motivatsiya)
								</CardTitle>
							</CardHeader>
							<CardContent className='p-5 space-y-4'>
								<div>
									<h4 className='text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1'>
										Tajribasi
									</h4>
									<p className='text-foreground font-bold text-base'>
										{applicant.experience} yil
									</p>
								</div>
								<Separator className='bg-border/50' />
								<div>
									<h4 className='text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2'>
										Batafsil ma'lumot
									</h4>
									<p className='text-muted-foreground font-medium text-sm leading-relaxed whitespace-pre-wrap'>
										{applicant.about || applicant.motivationLetter || (
											<span className='italic opacity-70'>
												Ma'lumot kiritilmagan.
											</span>
										)}
									</p>
								</div>
							</CardContent>
						</Card>
					</motion.div>

					<motion.div
						variants={itemVariants}
						className='grid grid-cols-1 md:grid-cols-2 gap-6'
					>
						<Card className='shadow-sm border-border h-full bg-card'>
							<CardHeader className='pb-3 border-b bg-muted/20'>
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
													className='px-3 py-1.5 bg-secondary/50 hover:bg-secondary/70 transition-colors border-transparent'
												>
													<span className='font-semibold'>
														{langName.replace('(Ona tili)', '').trim()}
													</span>
													{langLevel && (
														<span className='text-[10px] text-muted-foreground border-l pl-1.5 ml-1.5 border-border/50'>
															{langLevel}
														</span>
													)}
													{isNative && (
														<span className='text-[9px] text-green-700 dark:text-green-400 bg-green-500/10 px-1 rounded ml-1.5 uppercase tracking-wider font-bold'>
															Ona tili
														</span>
													)}
												</Badge>
											)
										})
									) : (
										<span className='text-sm text-muted-foreground italic w-full text-center py-2'>
											Tillar belgilanmagan
										</span>
									)}
								</div>
							</CardContent>
						</Card>

						<Card className='shadow-sm border-border h-full bg-card'>
							<CardHeader className='pb-3 border-b bg-muted/20'>
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
												variant='outline'
												className='bg-primary/5 hover:bg-primary/10 border-primary/20 text-foreground py-1 px-3'
											>
												{skill}
											</Badge>
										))
									) : (
										<span className='text-sm text-muted-foreground italic w-full text-center py-2'>
											Ko'nikmalar belgilanmagan
										</span>
									)}
								</div>
							</CardContent>
						</Card>
					</motion.div>
				</div>
			</div>

			{/* 📅 DARS JADVALI */}
			<motion.div variants={itemVariants} className='w-full'>
				<Card className='shadow-sm border-border w-full bg-card'>
					<CardHeader className='border-b bg-muted/20'>
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
										className='bg-muted/30 border border-border/50 rounded-xl p-3 text-center flex flex-col justify-center gap-1.5 hover:border-primary/30 hover:bg-muted/50 transition-colors shadow-sm'
									>
										<p className='font-bold text-sm text-foreground'>
											{time.day}
										</p>
										<Badge
											variant='outline'
											className='bg-background font-mono text-xs text-muted-foreground mx-auto border-dashed'
										>
											{time.from} - {time.to}
										</Badge>
									</div>
								))
							) : (
								<div className='col-span-full text-center text-sm py-10 text-muted-foreground bg-muted/10 border border-dashed rounded-xl flex flex-col items-center'>
									<Calendar className='h-10 w-10 mb-2 opacity-20' />
									<p className='italic font-medium'>
										Dars jadvali kiritilmagan
									</p>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</motion.div>
		</motion.div>
	)
}
