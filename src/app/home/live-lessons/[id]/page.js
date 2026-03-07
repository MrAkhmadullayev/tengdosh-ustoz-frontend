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

export default function LiveLessonDetailsPage() {
	const params = useParams()
	const router = useRouter()
	const [lesson, setLesson] = useState(null)
	const [loading, setLoading] = useState(true)

	const [currentUser, setCurrentUser] = useState(null)

	const [isRegistered, setIsRegistered] = useState(false)
	const [viewers, setViewers] = useState(0)
	const [joinLoading, setJoinLoading] = useState(false)

	const [showAuthModal, setShowAuthModal] = useState(false)
	const [showSuccessModal, setShowSuccessModal] = useState(false)
	const [successMessage, setSuccessMessage] = useState('')

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const { data } = await api.get('/auth/me')
				if (data.success && data.user) {
					setCurrentUser(data.user)
				}
			} catch {}
		}
		checkAuth()
	}, [])

	useEffect(() => {
		const fetchLesson = async () => {
			try {
				const res = await api.get(`/public/lessons/${params.id}`)
				if (res?.data?.success) {
					setLesson(res.data.lesson)
					setIsRegistered(res.data.lesson.isRegistered || false)
					setViewers(res.data.lesson.viewers || 0)
				}
			} catch (error) {
				console.error(error)
			} finally {
				setLoading(false)
			}
		}
		if (params.id) fetchLesson()
	}, [params.id])

	const handleJoin = async () => {
		if (!currentUser) {
			setShowAuthModal(true)
			return
		}

		setJoinLoading(true)
		try {
			if (isRegistered) {
				const res = await api.delete(`/public/lessons/${params.id}/join`)
				if (res.data.success) {
					setIsRegistered(false)
					setViewers(res.data.viewers)
				}
			} else {
				const res = await api.post(`/public/lessons/${params.id}/join`)
				if (res.data.success) {
					setIsRegistered(true)
					setViewers(res.data.viewers)

					let dateStr = ''
					if (lesson.date) {
						const d = new Date(lesson.date)
						if (!isNaN(d.getTime())) {
							dateStr = `${d.getDate()}-${MONTHS[d.getMonth()]}, ${d.getFullYear()}`
						}
					}

					setSuccessMessage(
						`🎉 Darsga muvaffaqiyatli yozildingiz!\n\n📅 ${dateStr}\n⏰ ${lesson.time}\n\nDars boshlanishi arafasida eslatma yuboriladi!`,
					)
					setShowSuccessModal(true)
				}
			}
		} catch (error) {
			if (error.response?.status === 401) {
				setShowAuthModal(true)
			} else if (error.response?.status === 400) {
				setSuccessMessage(error.response.data.message || "Joylar to'lgan")
				setShowSuccessModal(true)
			}
		} finally {
			setJoinLoading(false)
		}
	}

	const formattedDate = useMemo(() => {
		if (!lesson?.date) return ''
		try {
			const d = new Date(lesson.date)
			if (isNaN(d.getTime())) return lesson.date
			return `${d.getDate()}-${MONTHS[d.getMonth()]}, ${d.getFullYear()}`
		} catch {
			return lesson.date
		}
	}, [lesson?.date])

	if (loading) {
		return (
			<div className='min-h-screen bg-background pb-16'>
				<Navbar />
				<div className='container mx-auto px-4 py-6 md:py-8 max-w-6xl'>
					<Skeleton className='h-5 w-48 mb-6' />
					<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
						<div className='lg:col-span-2 space-y-6'>
							<Skeleton className='w-full aspect-video rounded-2xl shadow-lg' />
							<div>
								<div className='flex flex-wrap items-center gap-3 mb-4'>
									<Skeleton className='h-6 w-24 rounded-full' />
									<Skeleton className='h-6 w-20 rounded-full' />
									<Skeleton className='h-6 w-32 rounded-full' />
								</div>
								<Skeleton className='h-10 w-3/4 mb-4' />
								<Separator className='my-6' />
								<div className='space-y-4'>
									<Skeleton className='h-7 w-40' />
									<Skeleton className='h-4 w-full' />
									<Skeleton className='h-4 w-full' />
									<Skeleton className='h-4 w-5/6' />
								</div>
							</div>
						</div>
						<div className='space-y-6'>
							<Card className='border-border/50 shadow-sm'>
								<CardContent className='p-6'>
									<Skeleton className='h-4 w-16 mb-4' />
									<div className='flex items-center gap-4 mb-6'>
										<Skeleton className='h-16 w-16 rounded-full shrink-0' />
										<div className='space-y-2 w-full'>
											<Skeleton className='h-5 w-3/4' />
											<Skeleton className='h-4 w-1/2' />
										</div>
									</div>
									<div className='space-y-3'>
										<Skeleton className='h-10 w-full rounded-md' />
										<Skeleton className='h-10 w-full rounded-md' />
									</div>
									<Separator className='my-6' />
									<div className='space-y-4'>
										<Skeleton className='h-4 w-32 mb-2' />
										<Skeleton className='h-12 w-full rounded-md' />
										<Skeleton className='h-4 w-full' />
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>
		)
	}

	if (!lesson) {
		return (
			<div className='min-h-screen bg-background flex flex-col'>
				<Navbar />
				<div className='flex-1 container mx-auto px-4 py-8 flex flex-col items-center justify-center'>
					<h1 className='text-3xl font-bold mb-4'>Dars topilmadi</h1>
					<p className='text-muted-foreground mb-8 text-center'>
						Siz qidirayotgan dars mavjud emas yoki o'chirilgan.
					</p>
					<Link href='/home/live-lessons'>
						<Button className='gap-2'>
							<ArrowLeft className='h-4 w-4' /> Darslarga qaytish
						</Button>
					</Link>
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-background pb-16'>
			<Navbar />

			<Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
				<DialogContent className='sm:max-w-md'>
					<DialogHeader className='text-center space-y-4'>
						<div className='mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center'>
							<LogIn className='h-8 w-8 text-primary' />
						</div>
						<DialogTitle className='text-xl font-bold'>
							Tizimga kiring
						</DialogTitle>
						<DialogDescription className='text-base leading-relaxed'>
							Darsga yozilish uchun avval tizimga kirishingiz kerak. Telegram
							bot orqali tezkor ro'yxatdan o'ting — bu atigi 30 soniya davom
							etadi!
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className='flex flex-col sm:flex-row gap-3 pt-4'>
						<Button
							variant='outline'
							className='flex-1 h-11 rounded-xl'
							onClick={() => setShowAuthModal(false)}
						>
							Keyinroq
						</Button>
						<Button
							className='flex-1 h-11 rounded-xl font-semibold gap-2'
							onClick={() => {
								setShowAuthModal(false)
								router.push('/authentication')
							}}
						>
							<LogIn className='h-4 w-4' />
							Tizimga kirish
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
				<DialogContent className='sm:max-w-md'>
					<DialogHeader className='text-center space-y-4'>
						<div className='mx-auto bg-green-500/10 w-16 h-16 rounded-full flex items-center justify-center'>
							<CheckCircle className='h-8 w-8 text-green-500' />
						</div>
						<DialogTitle className='text-xl font-bold'>
							Muvaffaqiyatli!
						</DialogTitle>
						<DialogDescription className='text-base leading-relaxed whitespace-pre-line'>
							{successMessage}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className='pt-4'>
						<Button
							className='w-full h-11 rounded-xl font-semibold'
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
				className='container mx-auto px-4 py-6 md:py-8 max-w-6xl'
			>
				<motion.div variants={itemVariants}>
					<Link
						href='/home/live-lessons'
						className='inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6 group'
					>
						<ArrowLeft className='h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform' />
						Jonli darslar ro'yxatiga qaytish
					</Link>
				</motion.div>

				<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
					<motion.div
						variants={itemVariants}
						className='lg:col-span-2 space-y-6'
					>
						<div className='w-full aspect-video bg-slate-900 rounded-2xl overflow-hidden relative flex items-center justify-center shadow-lg group'>
							<div className='absolute top-4 left-4 z-10'>
								{lesson.status === 'live' ? (
									<Badge
										variant='destructive'
										className='flex items-center gap-2 px-3 py-1.5 text-sm'
									>
										<span className='relative flex h-2.5 w-2.5'>
											<span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75'></span>
											<span className='relative inline-flex rounded-full h-2.5 w-2.5 bg-white'></span>
										</span>
										JONLI EFIR
									</Badge>
								) : (
									<Badge
										variant='secondary'
										className='flex items-center gap-2 px-3 py-1.5 text-sm bg-background/90 backdrop-blur'
									>
										<Calendar className='h-4 w-4' /> KUTILMOQDA
									</Badge>
								)}
							</div>

							{viewers > 0 && (
								<div className='absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-md text-white text-sm font-medium px-3 py-1.5 rounded-lg flex items-center gap-2'>
									<Users className='h-4 w-4' /> {viewers} qatnashuvchi
								</div>
							)}

							<div className='h-20 w-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 transition-transform group-hover:scale-110 cursor-pointer z-10'>
								<PlayCircle className='h-10 w-10 text-white ml-1 opacity-90' />
							</div>

							{lesson.status === 'upcoming' && (
								<div className='absolute bottom-6 left-0 right-0 text-center z-10'>
									<p className='text-white/80 font-medium bg-black/40 backdrop-blur-sm inline-block px-4 py-2 rounded-lg'>
										Dars {formattedDate && `${formattedDate}, `}
										{lesson.time} da boshlanadi
									</p>
								</div>
							)}
						</div>

						<div>
							<div className='flex flex-wrap items-center gap-3 mb-4'>
								{lesson.mentorSpecialty && (
									<Badge
										variant='secondary'
										className='bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary text-sm px-3 py-1 border-none'
									>
										{lesson.mentorSpecialty}
									</Badge>
								)}
								<Badge variant='outline' className='text-sm px-3 py-1'>
									{lesson.format || 'online'}
								</Badge>
								<div className='flex items-center text-sm font-medium text-muted-foreground gap-1.5 bg-muted px-3 py-1 rounded-full'>
									<Clock className='h-4 w-4' />
									{formattedDate && <span>{formattedDate}</span>}
									{formattedDate && lesson.time && <span>, </span>}
									{lesson.time && <span>{lesson.time}</span>}
								</div>
							</div>

							<h1 className='text-2xl md:text-3xl font-extrabold text-foreground leading-tight mb-4'>
								{lesson.title}
							</h1>

							<Separator className='my-6' />

							<div className='space-y-4'>
								<h3 className='text-xl font-bold flex items-center gap-2'>
									<BookOpen className='h-5 w-5 text-primary' />
									Dars haqida
								</h3>
								<p className='text-muted-foreground leading-relaxed text-[15px] sm:text-base'>
									{lesson.description ||
										"Ushbu dars haqida to'liq ma'lumot tez orada taqdim etiladi. Eng so'nggi va zamonaviy texnologiyalarni amaliyotda biz bilan o'rganing."}
								</p>
							</div>
						</div>
					</motion.div>

					<motion.div variants={itemVariants} className='space-y-6'>
						<Card className='border-border/50 shadow-sm sticky top-24'>
							<CardContent className='p-6'>
								<h3 className='text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4'>
									Ustoz
								</h3>

								<div className='flex items-center gap-4 mb-6'>
									<Avatar className='h-16 w-16 border-2 border-background shadow-sm'>
										<AvatarFallback className='bg-primary/10 text-primary text-xl font-bold'>
											{lesson.mentorInitials}
										</AvatarFallback>
									</Avatar>
									<div>
										<h4 className='font-bold text-lg leading-none mb-1'>
											{lesson.mentorName}
										</h4>
										{lesson.mentorSpecialty && (
											<p className='text-sm text-primary font-medium'>
												{lesson.mentorSpecialty}
											</p>
										)}
									</div>
								</div>

								<div className='space-y-3'>
									<Link
										href={`/home/mentors/${lesson.mentorId}`}
										className='block w-full'
									>
										<Button variant='outline' className='w-full font-medium'>
											Profiliga o'tish
										</Button>
									</Link>
									{lesson.mentorUsername && (
										<a
											href={`https://t.me/${lesson.mentorUsername}`}
											target='_blank'
											rel='noopener noreferrer'
											className='block w-full'
										>
											<Button
												variant='secondary'
												className='w-full font-medium gap-2'
											>
												<MessageSquare className='h-4 w-4' /> Telegramda yozish
											</Button>
										</a>
									)}
								</div>

								<Separator className='my-6' />

								<div className='space-y-4'>
									<h3 className='text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2'>
										Darsga qatnashish
									</h3>

									{isRegistered ? (
										<div className='space-y-3'>
											<div className='bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center'>
												<UserCheck className='h-8 w-8 text-green-500 mx-auto mb-2' />
												<p className='text-sm font-semibold text-green-700 dark:text-green-400'>
													Siz bu darsga yozilgansiz! ✅
												</p>
												<p className='text-xs text-muted-foreground mt-1'>
													Dars boshlanishi arafasida eslatma yuboriladi
												</p>
											</div>
											<Button
												variant='outline'
												className='w-full h-11 text-base font-medium text-destructive border-destructive/30 hover:bg-destructive/10 gap-2'
												onClick={handleJoin}
												disabled={joinLoading}
											>
												{joinLoading ? (
													<Loader2 className='h-5 w-5 animate-spin' />
												) : (
													<>
														<UserMinus className='h-5 w-5' />
														Darsdan chiqish
													</>
												)}
											</Button>
										</div>
									) : lesson.status === 'live' ? (
										<Button
											className='w-full h-12 text-base font-bold bg-red-600 hover:bg-red-700 text-white gap-2 shadow-md'
											onClick={handleJoin}
											disabled={joinLoading}
										>
											{joinLoading ? (
												<Loader2 className='h-5 w-5 animate-spin' />
											) : (
												<>
													<MonitorPlay className='h-5 w-5' /> Jonli darsga
													qo'shilish
												</>
											)}
										</Button>
									) : (
										<Button
											className='w-full h-12 text-base font-bold gap-2 shadow-md'
											onClick={handleJoin}
											disabled={joinLoading}
										>
											{joinLoading ? (
												<Loader2 className='h-5 w-5 animate-spin' />
											) : (
												<>
													<Calendar className='h-5 w-5' /> Darsga yozilish
												</>
											)}
										</Button>
									)}

									{lesson.maxStudents && (
										<div className='flex justify-between text-xs text-muted-foreground px-1'>
											<span>
												{viewers} / {lesson.maxStudents} ta joy band
											</span>
											{viewers >= lesson.maxStudents && (
												<span className='text-destructive font-medium'>
													Joylar to'lgan
												</span>
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
