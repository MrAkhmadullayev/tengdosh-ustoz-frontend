'use client'

import Navbar from '@/components/landing/Navbar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
import { useAuth } from '@/lib/auth-context'
import { useTranslation } from '@/lib/i18n'
// 🔥 Markazlashgan utils
import { cn, formatUzDate, getErrorMessage } from '@/lib/utils'
import { motion } from 'framer-motion'
import {
	ArrowLeft,
	BookOpen,
	Calendar,
	CheckCircle,
	Clock,
	Loader2,
	LogIn,
	MessageSquare,
	MonitorPlay,
	PlayCircle,
	UserCheck,
	UserMinus,
	Users,
} from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

// --- ANIMATION VARIANTS ---
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

export default function LiveLessonDetailsPage() {
	const { id } = useParams()
	const router = useRouter()
	const { t } = useTranslation()
	const { user: currentUser } = useAuth()

	const [lesson, setLesson] = useState(null)
	const [loading, setLoading] = useState(true)
	const [isRegistered, setIsRegistered] = useState(false)
	const [viewers, setViewers] = useState(0)
	const [joinLoading, setJoinLoading] = useState(false)

	const [showAuthModal, setShowAuthModal] = useState(false)
	const [showSuccessModal, setShowSuccessModal] = useState(false)

	// 1. Ma'lumotlarni yuklash
	useEffect(() => {
		const fetchLesson = async () => {
			try {
				const res = await api.get(`/public/lessons/${id}`)
				if (res?.data?.success) {
					setLesson(res.data.lesson)
					setIsRegistered(res.data.lesson.isRegistered || false)
					setViewers(res.data.lesson.viewers || 0)
				}
			} catch (error) {
				toast.error(
					getErrorMessage(error, "Dars ma'lumotlarini yuklab bo'lmadi"),
				)
			} finally {
				setLoading(false)
			}
		}
		if (id) fetchLesson()
	}, [id])

	// 2. Darsga yozilish/chiqish mantiqi
	const handleJoin = async () => {
		if (!currentUser) {
			setShowAuthModal(true)
			return
		}

		setJoinLoading(true)
		try {
			if (isRegistered) {
				const res = await api.delete(`/public/lessons/${id}/join`)
				if (res.data?.success) {
					setIsRegistered(false)
					setViewers(res.data.viewers)
					toast.info('Darsga yozilish bekor qilindi')
				}
			} else {
				const res = await api.post(`/public/lessons/${id}/join`)
				if (res.data?.success) {
					setIsRegistered(true)
					setViewers(res.data.viewers)
					setShowSuccessModal(true)
				}
			}
		} catch (error) {
			if (error.response?.status === 401) {
				setShowAuthModal(true)
			} else {
				toast.error(error.response?.data?.message || "Amalni bajarib bo'lmadi")
			}
		} finally {
			setJoinLoading(false)
		}
	}

	const formattedDate = useMemo(() => {
		if (!lesson?.date) return ''
		return formatUzDate(lesson.date).split(',')[0]
	}, [lesson?.date])

	// UI: Loading Skeleton
	if (loading) {
		return (
			<div className='min-h-screen bg-background flex flex-col'>
				<Navbar />
				<div className='container mx-auto px-4 py-8 max-w-6xl animate-pulse'>
					<Skeleton className='h-5 w-48 mb-6' />
					<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
						<div className='lg:col-span-2 space-y-6'>
							<Skeleton className='w-full aspect-video rounded-xl' />
							<div className='space-y-4'>
								<Skeleton className='h-10 w-3/4' />
								<Skeleton className='h-4 w-full' />
								<Skeleton className='h-4 w-[90%]' />
							</div>
						</div>
						<Skeleton className='h-[300px] w-full rounded-xl' />
					</div>
				</div>
			</div>
		)
	}

	// UI: Not found
	if (!lesson) {
		return (
			<div className='min-h-screen bg-background flex flex-col'>
				<Navbar />
				<div className='flex-1 container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center'>
					<h1 className='text-2xl font-bold mb-3'>Dars topilmadi</h1>
					<p className='text-muted-foreground mb-8'>
						Siz qidirayotgan dars mavjud emas yoki o'chirilgan.
					</p>
					<Button asChild>
						<Link href='/home/live-lessons'>
							<ArrowLeft className='h-4 w-4 mr-2' /> Darslarga qaytish
						</Link>
					</Button>
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-muted/10 pb-16'>
			<Navbar />

			{/* 🛑 Auth Modal */}
			<Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
				<DialogContent className='sm:max-w-md rounded-xl'>
					<DialogHeader className='text-center pt-4'>
						<div className='mx-auto bg-muted w-14 h-14 rounded-xl flex items-center justify-center mb-4'>
							<LogIn className='h-6 w-6 text-foreground' />
						</div>
						<DialogTitle className='text-xl font-bold'>
							Tizimga kiring
						</DialogTitle>
						<DialogDescription className='text-balance pt-2'>
							Darsga yozilish uchun avval tizimga kirishingiz kerak. Ro'yxatdan
							o'tish atigi 30 soniya vaqt oladi.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className='flex flex-col sm:flex-row gap-2 pt-4'>
						<Button
							variant='outline'
							className='w-full sm:flex-1'
							onClick={() => setShowAuthModal(false)}
						>
							Keyinroq
						</Button>
						<Button
							className='w-full sm:flex-1 font-semibold'
							onClick={() => router.push('/authentication')}
						>
							Kirish
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* ✅ Success Modal */}
			<Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
				<DialogContent className='sm:max-w-md rounded-xl'>
					<DialogHeader className='text-center pt-4'>
						<div className='mx-auto bg-green-500/10 w-14 h-14 rounded-full flex items-center justify-center mb-4'>
							<CheckCircle className='h-6 w-6 text-green-600' />
						</div>
						<DialogTitle className='text-xl font-bold'>
							Muvaffaqiyatli!
						</DialogTitle>
						<div className='pt-2 text-center space-y-3'>
							<p className='text-sm text-muted-foreground'>
								Siz ushbu darsga muvaffaqiyatli yozildingiz.
							</p>
							<div className='bg-muted/50 p-3 rounded-lg border text-xs font-medium space-y-1'>
								<p className='flex justify-between'>
									<span>Sana:</span> <span>{formattedDate}</span>
								</p>
								<p className='flex justify-between'>
									<span>Vaqt:</span> <span>{lesson.time}</span>
								</p>
							</div>
							<p className='text-[11px] text-muted-foreground italic'>
								Eslatma: Dars boshlanishidan oldin xabarnoma yuboriladi.
							</p>
						</div>
					</DialogHeader>
					<DialogFooter className='pt-4'>
						<Button
							className='w-full font-semibold'
							onClick={() => setShowSuccessModal(false)}
						>
							Tushunarli
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<motion.div
				variants={containerVariants}
				initial='hidden'
				animate='show'
				className='container mx-auto px-4 py-8 max-w-6xl'
			>
				{/* Breadcrumb back */}
				<motion.div variants={itemVariants} className='mb-6'>
					<Button
						variant='ghost'
						asChild
						className='pl-0 text-muted-foreground hover:text-foreground'
					>
						<Link href='/home/live-lessons'>
							<ArrowLeft className='h-4 w-4 mr-2' /> Darslar ro'yxatiga qaytish
						</Link>
					</Button>
				</motion.div>

				<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
					{/* 📺 CHAP: Dars ma'lumotlari */}
					<motion.div
						variants={itemVariants}
						className='lg:col-span-2 space-y-6'
					>
						{/* Video Placeholder */}
						<div className='w-full aspect-video bg-zinc-950 rounded-xl overflow-hidden relative flex items-center justify-center border shadow-sm group'>
							<div className='absolute top-4 left-4 z-10 flex gap-2'>
								{lesson.status === 'live' ? (
									<Badge
										variant='destructive'
										className='flex items-center gap-1.5 animate-pulse shadow-none'
									>
										<span className='h-1.5 w-1.5 rounded-full bg-white' /> JONLI
										EFIR
									</Badge>
								) : (
									<Badge
										variant='secondary'
										className='bg-background/90 backdrop-blur border shadow-none'
									>
										KUTILMOQDA
									</Badge>
								)}
							</div>

							{viewers > 0 && (
								<div className='absolute top-4 right-4 z-10 bg-black/40 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-2'>
									<Users className='h-3 w-3' /> {viewers} qatnashuvchi
								</div>
							)}

							<div className='h-16 w-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 transition-transform group-hover:scale-110'>
								<PlayCircle className='h-8 w-8 text-white opacity-80' />
							</div>

							{lesson.status === 'upcoming' && (
								<div className='absolute bottom-6 w-full text-center'>
									<p className='text-white/60 text-xs font-medium bg-black/40 backdrop-blur-sm inline-block px-4 py-1.5 rounded-full'>
										Dars {formattedDate}, {lesson.time} da boshlanadi
									</p>
								</div>
							)}
						</div>

						<div className='space-y-4'>
							<div className='flex flex-wrap items-center gap-2'>
								<Badge
									variant='secondary'
									className='bg-primary/5 text-primary border-transparent shadow-none capitalize'
								>
									{lesson.mentorSpecialty}
								</Badge>
								<Badge variant='outline' className='capitalize shadow-none'>
									{lesson.format || 'online'}
								</Badge>
								<Badge
									variant='outline'
									className='flex items-center gap-1.5 bg-muted/30 border-transparent shadow-none'
								>
									<Clock className='h-3.5 w-3.5' /> {formattedDate},{' '}
									{lesson.time}
								</Badge>
							</div>

							<h1 className='text-2xl sm:text-3xl font-bold text-foreground leading-tight'>
								{lesson.title}
							</h1>

							<Separator />

							<div className='space-y-3'>
								<h3 className='text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2'>
									<BookOpen className='h-4 w-4' /> Dars haqida
								</h3>
								<p className='text-muted-foreground leading-relaxed text-sm sm:text-base'>
									{lesson.description ||
										"Ushbu dars haqida ma'lumot tez orada taqdim etiladi."}
								</p>
							</div>
						</div>
					</motion.div>

					{/* 👤 O'NG: Sidebar (Ustoz & Yozilish) */}
					<motion.div variants={itemVariants} className='space-y-6'>
						<Card className='shadow-sm border-border bg-card sticky top-24'>
							<CardContent className='p-6'>
								{/* Ustoz bloki */}
								<h4 className='text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4'>
									Dars ustozi
								</h4>
								<div className='flex items-center gap-4 mb-6'>
									<Avatar className='h-14 w-14 border shadow-sm'>
										<AvatarFallback className='bg-primary/5 text-primary text-lg font-bold'>
											{lesson.mentorInitials}
										</AvatarFallback>
									</Avatar>
									<div className='min-w-0'>
										<h5 className='font-bold text-base truncate leading-none mb-1'>
											{lesson.mentorName}
										</h5>
										<p className='text-xs text-primary font-medium truncate'>
											{lesson.mentorSpecialty}
										</p>
									</div>
								</div>

								<div className='grid gap-2'>
									<Button
										variant='outline'
										size='sm'
										className='w-full font-medium'
										asChild
									>
										<Link href={`/home/mentors/${lesson.mentorId}`}>
											Profilni ko'rish
										</Link>
									</Button>
									{lesson.mentorUsername && (
										<Button
											variant='secondary'
											size='sm'
											className='w-full font-medium gap-2 text-blue-600 bg-blue-50 hover:bg-blue-100'
											asChild
										>
											<a
												href={`https://t.me/${lesson.mentorUsername.replace('@', '')}`}
												target='_blank'
												rel='noopener noreferrer'
											>
												<MessageSquare className='h-4 w-4' /> Telegram
											</a>
										</Button>
									)}
								</div>

								<Separator className='my-6' />

								{/* Yozilish bloki */}
								<div className='space-y-4'>
									{isRegistered ? (
										<div className='space-y-3'>
											<div className='bg-green-500/5 border border-green-500/10 rounded-xl p-4 text-center'>
												<UserCheck className='h-6 w-6 text-green-600 mx-auto mb-2' />
												<p className='text-sm font-bold text-green-700'>
													Darsga yozilgansiz
												</p>
											</div>
											<Button
												variant='ghost'
												size='sm'
												className='w-full text-destructive hover:bg-destructive/5 font-medium'
												onClick={handleJoin}
												disabled={joinLoading}
											>
												{joinLoading ? (
													<Loader2 className='h-4 w-4 animate-spin' />
												) : (
													<>
														<UserMinus className='h-4 w-4 mr-2' /> Ro'yxatdan
														chiqish
													</>
												)}
											</Button>
										</div>
									) : (
										<div className='space-y-3'>
											<Button
												className={cn(
													'w-full h-11 font-bold shadow-md',
													lesson.status === 'live'
														? 'bg-destructive hover:bg-destructive/90'
														: '',
												)}
												onClick={handleJoin}
												disabled={
													joinLoading ||
													(lesson.maxStudents && viewers >= lesson.maxStudents)
												}
											>
												{joinLoading ? (
													<Loader2 className='h-4 w-4 animate-spin' />
												) : lesson.status === 'live' ? (
													<>
														<MonitorPlay className='h-4 w-4 mr-2' /> Qo'shilish
													</>
												) : (
													<>
														<Calendar className='h-4 w-4 mr-2' /> Darsga
														yozilish
													</>
												)}
											</Button>

											{lesson.maxStudents && (
												<div className='px-1 space-y-1'>
													<div className='flex justify-between text-[10px] font-bold text-muted-foreground uppercase'>
														<span>Joylar</span>
														<span>
															{viewers} / {lesson.maxStudents}
														</span>
													</div>
													<div className='h-1 w-full bg-muted rounded-full overflow-hidden'>
														<div
															className='h-full bg-primary transition-all'
															style={{
																width: `${(viewers / lesson.maxStudents) * 100}%`,
															}}
														/>
													</div>
													{viewers >= lesson.maxStudents && (
														<p className='text-[10px] text-destructive font-bold text-center mt-1'>
															Hamma joylar band
														</p>
													)}
												</div>
											)}
										</div>
									)}
								</div>
							</CardContent>
						</Card>
					</motion.div>
				</div>
			</motion.div>
		</div>
	)
}
