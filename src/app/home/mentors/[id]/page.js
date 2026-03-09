'use client'

import Navbar from '@/components/landing/Navbar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import api from '@/lib/api'
import { useAuth } from '@/lib/auth-context'
import { useTranslation } from '@/lib/i18n'
// 🔥 Markazlashgan utils
import { cn, formatUzDate, getErrorMessage, getInitials } from '@/lib/utils'
import { motion } from 'framer-motion'
import {
	ArrowLeft,
	BookOpen,
	Briefcase,
	Calendar,
	CheckCircle,
	CheckCircle2,
	Clock,
	Globe,
	GraduationCap,
	Heart,
	Loader2,
	LogIn,
	MessageSquare,
	PlayCircle,
	Send,
	Star,
	UserPlus,
	Users,
} from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

// ==========================================
// 🎨 ANIMATSIYALAR
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
export default function MentorDetailsPage() {
	const { id } = useParams()
	const router = useRouter()
	const { t, locale } = useTranslation()
	const { user: currentUser } = useAuth()

	const [mentor, setMentor] = useState(null)
	const [lessons, setLessons] = useState([])
	const [loading, setLoading] = useState(true)

	// States
	const [hoveredStar, setHoveredStar] = useState(0)
	const [userRating, setUserRating] = useState(0)
	const [avgRating, setAvgRating] = useState(0)
	const [ratingsCount, setRatingsCount] = useState(0)
	const [ratingLoading, setRatingLoading] = useState(false)

	const [isFollowing, setIsFollowing] = useState(false)
	const [followersCount, setFollowersCount] = useState(0)
	const [followLoading, setFollowLoading] = useState(false)

	// Modals
	const [showAuthModal, setShowAuthModal] = useState(false)
	const [authModalAction, setAuthModalAction] = useState('')
	const [showSuccessModal, setShowSuccessModal] = useState(false)
	const [successMessage, setSuccessMessage] = useState('')

	// API Fetch
	useEffect(() => {
		const fetchMentor = async () => {
			try {
				const res = await api.get(`/public/mentors/${id}`)
				if (res?.data?.success) {
					const m = res.data.mentor
					setMentor(m)
					setLessons(res.data.lessons || [])
					setAvgRating(m.rating || 0)
					setRatingsCount(m.ratingsCount || 0)
					setFollowersCount(m.followersCount || 0)
					setIsFollowing(m.isFollowing || false)
					setUserRating(m.userRating || 0)
				}
			} catch (error) {
				toast.error(
					getErrorMessage(error, "Mentor haqida ma'lumot yuklashda xatolik"),
				)
			} finally {
				setLoading(false)
			}
		}
		if (id) fetchMentor()
	}, [id])

	// Auth checker
	const requireAuth = actionKey => {
		if (!currentUser) {
			setAuthModalAction(t(`mentorsPage.${actionKey}`) || 'Amalni bajarish')
			setShowAuthModal(true)
			return false
		}
		return true
	}

	// Actions
	const handleRate = async score => {
		if (!requireAuth('authActionRate')) return
		setRatingLoading(true)
		try {
			const res = await api.post(`/public/mentors/${id}/rate`, { score })
			if (res?.data?.success) {
				setUserRating(res.data.userRating)
				setAvgRating(res.data.rating)
				setRatingsCount(res.data.ratingsCount)
				setSuccessMessage(
					t('mentorsPage.rateSuccess', { score }) ||
						`Siz ${score} yulduz qo'ydingiz!`,
				)
				setShowSuccessModal(true)
			}
		} catch (error) {
			if (error.response?.status === 401) {
				setAuthModalAction(t('mentorsPage.authActionRate') || 'Baholash')
				setShowAuthModal(true)
			} else {
				toast.error(getErrorMessage(error, 'Baho berishda xatolik'))
			}
		} finally {
			setRatingLoading(false)
		}
	}

	const handleFollow = async () => {
		if (!requireAuth('authActionFollow')) return
		setFollowLoading(true)
		try {
			if (isFollowing) {
				const res = await api.delete(`/public/mentors/${id}/follow`)
				if (res?.data?.success) {
					setIsFollowing(false)
					setFollowersCount(res.data.followersCount)
					toast.success("Kuzatish to'xtatildi")
				}
			} else {
				const res = await api.post(`/public/mentors/${id}/follow`)
				if (res?.data?.success) {
					setIsFollowing(true)
					setFollowersCount(res.data.followersCount)
					setSuccessMessage(
						t('mentorsPage.followSuccess', { name: `${mentor.firstName}` }) ||
							"Muvaffaqiyatli obuna bo'ldingiz!",
					)
					setShowSuccessModal(true)
				}
			}
		} catch (error) {
			if (error.response?.status === 401) {
				setAuthModalAction(t('mentorsPage.authActionFollow') || 'Kuzatish')
				setShowAuthModal(true)
			} else {
				toast.error(getErrorMessage(error, 'Amalni bajarishda xatolik'))
			}
		} finally {
			setFollowLoading(false)
		}
	}

	const handleMessage = () => {
		if (!requireAuth('authActionMessage')) return
		sessionStorage.setItem(
			'selectedContact',
			JSON.stringify({
				id: `contact_${mentor._id || mentor.id}`,
				contactTargetId: mentor._id || mentor.id,
				name: `${mentor.firstName} ${mentor.lastName}`,
				role: 'mentor',
			}),
		)
		router.push('/users/messages')
	}

	// UI: Loading Skeleton
	if (loading) {
		return (
			<div className='bg-background min-h-screen pb-16 flex flex-col'>
				<Navbar />
				<div className='container mx-auto px-4 py-8 max-w-6xl animate-pulse flex-1'>
					<Skeleton className='h-10 w-40 mb-8 rounded-md' />
					<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
						<div className='lg:col-span-2 space-y-6'>
							<Skeleton className='h-[400px] w-full rounded-xl' />
						</div>
						<div>
							<Skeleton className='h-[300px] w-full rounded-xl' />
						</div>
					</div>
				</div>
			</div>
		)
	}

	// UI: Not found
	if (!mentor) {
		return (
			<div className='flex flex-col min-h-screen bg-background'>
				<Navbar />
				<div className='flex-1 container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center'>
					<h1 className='text-2xl font-bold mb-3'>
						{t('mentorsPage.mentorNotFound') || 'Mentor topilmadi'}
					</h1>
					<p className='text-muted-foreground mb-8'>
						{t('mentorsPage.mentorNotFoundDesc') ||
							"Bunday profil tizimda mavjud emas yoki o'chirilgan."}
					</p>
					<Button variant='outline' asChild>
						<Link href='/home/mentors'>
							<ArrowLeft className='h-4 w-4 mr-2' />{' '}
							{t('mentorsPage.backToMentors') || 'Mentorlarga qaytish'}
						</Link>
					</Button>
				</div>
			</div>
		)
	}

	return (
		<div className='bg-muted/10 min-h-screen pb-16'>
			<Navbar />

			{/* 🛑 Modals */}
			<Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
				<DialogContent className='sm:max-w-md rounded-xl'>
					<DialogHeader className='text-center pt-4'>
						<div className='mx-auto bg-muted w-14 h-14 rounded-xl flex items-center justify-center mb-4'>
							<LogIn className='h-6 w-6 text-foreground' />
						</div>
						<DialogTitle className='text-xl font-bold'>
							{t('mentorsPage.authRequired') || 'Tizimga kiring'}
						</DialogTitle>
						<DialogDescription className='pt-2 text-balance'>
							{t('mentorsPage.authRequiredDesc', { action: authModalAction }) ||
								"Bu amalni bajarish uchun ro'yxatdan o'tishingiz yoki tizimga kirishingiz kerak."}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className='flex flex-col sm:flex-row gap-2 pt-4'>
						<Button
							variant='outline'
							className='w-full sm:flex-1'
							onClick={() => setShowAuthModal(false)}
						>
							{t('mentorsPage.later') || 'Keyinroq'}
						</Button>
						<Button
							className='w-full sm:flex-1 font-semibold'
							onClick={() => router.push('/authentication')}
						>
							<LogIn className='h-4 w-4 mr-2' /> Kirish
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
				<DialogContent className='sm:max-w-md rounded-xl'>
					<DialogHeader className='text-center pt-4'>
						<div className='mx-auto bg-green-500/10 w-14 h-14 rounded-full flex items-center justify-center mb-4'>
							<CheckCircle className='h-6 w-6 text-green-600' />
						</div>
						<DialogTitle className='text-xl font-bold'>
							{t('mentorsPage.success') || 'Muvaffaqiyatli'}
						</DialogTitle>
						<DialogDescription className='pt-2'>
							{successMessage}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className='pt-4'>
						<Button
							className='w-full font-semibold'
							onClick={() => setShowSuccessModal(false)}
						>
							{t('mentorsPage.understand') || 'Tushunarli'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* 🚀 Main Layout */}
			<motion.div
				variants={containerVariants}
				initial='hidden'
				animate='show'
				className='container mx-auto px-4 py-8 max-w-6xl'
			>
				<motion.div variants={itemVariants} className='mb-6'>
					<Button
						variant='ghost'
						onClick={() => router.back()}
						className='pl-0 text-muted-foreground hover:text-foreground'
					>
						<ArrowLeft className='h-4 w-4 mr-2' />{' '}
						{t('mentorsPage.mentorsList') || 'Orqaga qaytish'}
					</Button>
				</motion.div>

				<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
					{/* CHAP: Asosiy Ma'lumotlar */}
					<div className='lg:col-span-2 space-y-6'>
						<motion.div variants={itemVariants}>
							<Card className='shadow-sm border-border bg-card'>
								{/* Header (Profil rasmi) */}
								<CardHeader className='pb-6 border-b bg-muted/10'>
									<div className='flex flex-col sm:flex-row gap-5 items-center sm:items-start text-center sm:text-left'>
										<Avatar className='h-24 w-24 border shadow-sm shrink-0'>
											<AvatarImage
												src={mentor.avatarUrl || ''}
												alt={mentor.firstName}
												className='object-cover'
											/>
											<AvatarFallback className='bg-primary/5 text-primary text-2xl font-bold'>
												{getInitials(mentor.firstName, mentor.lastName)}
											</AvatarFallback>
										</Avatar>

										<div className='flex-1 space-y-2 mt-2 sm:mt-0'>
											<h1 className='text-2xl font-bold tracking-tight text-foreground leading-none'>
												{mentor.firstName} {mentor.lastName}
											</h1>
											<div className='flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-sm font-medium'>
												<span className='flex items-center gap-1.5 text-muted-foreground'>
													<BookOpen className='h-4 w-4' />{' '}
													{mentor.specialty || 'Mentor'}
												</span>
												<span className='text-muted-foreground opacity-30 hidden sm:inline'>
													•
												</span>
												<span className='flex items-center gap-1'>
													<Star className='h-4 w-4 text-amber-500 fill-amber-500' />
													<span className='text-foreground'>
														{avgRating > 0 ? avgRating : 'N/A'}
													</span>
													<span className='text-muted-foreground font-normal'>
														({ratingsCount})
													</span>
												</span>
											</div>
										</div>
									</div>
								</CardHeader>

								{/* About Content */}
								<CardContent className='p-6 space-y-8'>
									{/* Info Grid */}
									<div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
										{mentor.course && (
											<div className='p-3 rounded-lg border bg-muted/20 flex flex-col items-center text-center'>
												<GraduationCap className='h-5 w-5 text-muted-foreground mb-1.5' />
												<span className='text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-0.5'>
													Bosqich
												</span>
												<span className='text-sm font-semibold text-foreground truncate w-full'>
													{mentor.course}
												</span>
											</div>
										)}
										<div className='p-3 rounded-lg border bg-muted/20 flex flex-col items-center text-center'>
											<Briefcase className='h-5 w-5 text-muted-foreground mb-1.5' />
											<span className='text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-0.5'>
												Tajriba
											</span>
											<span className='text-sm font-semibold text-foreground'>
												{mentor.experience || 0} yil
											</span>
										</div>
										<div className='p-3 rounded-lg border bg-muted/20 flex flex-col items-center text-center'>
											<Users className='h-5 w-5 text-muted-foreground mb-1.5' />
											<span className='text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-0.5'>
												O'quvchilar
											</span>
											<span className='text-sm font-semibold text-foreground'>
												{mentor.studentsCount || 0}
											</span>
										</div>
										<div className='p-3 rounded-lg border bg-muted/20 flex flex-col items-center text-center'>
											<Heart className='h-5 w-5 text-muted-foreground mb-1.5' />
											<span className='text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-0.5'>
												Obunachilar
											</span>
											<span className='text-sm font-semibold text-foreground'>
												{followersCount}
											</span>
										</div>
									</div>

									{/* Languages */}
									{mentor.languages?.length > 0 && (
										<div className='space-y-3'>
											<h3 className='text-sm font-bold flex items-center gap-2'>
												<Globe className='h-4 w-4 text-muted-foreground' />{' '}
												{t('mentorsPage.languages') || 'Tillar'}
											</h3>
											<div className='flex flex-wrap gap-2'>
												{mentor.languages.map((l, idx) => (
													<Badge
														key={idx}
														variant='secondary'
														className='px-2.5 py-1 font-medium shadow-none border-transparent'
													>
														{l.lang}{' '}
														{l.level && (
															<span className='opacity-60 font-normal ml-1'>
																({l.level})
															</span>
														)}{' '}
														{l.isNative && '— Ona tili'}
													</Badge>
												))}
											</div>
										</div>
									)}

									{/* About */}
									{mentor.about && (
										<div className='space-y-3'>
											<h3 className='text-sm font-bold uppercase tracking-wider text-muted-foreground border-b pb-2'>
												{t('mentorsPage.aboutMe') || 'Men haqimda'}
											</h3>
											<p className='text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap'>
												{mentor.about}
											</p>
										</div>
									)}

									{/* Skills */}
									{mentor.skills?.length > 0 && (
										<div className='space-y-3'>
											<h3 className='text-sm font-bold uppercase tracking-wider text-muted-foreground border-b pb-2'>
												{t('mentorsPage.technicalSkills') || "Ko'nikmalar"}
											</h3>
											<div className='flex flex-wrap gap-2'>
												{mentor.skills.map((skill, idx) => (
													<Badge
														key={idx}
														variant='outline'
														className='px-3 py-1 font-medium bg-muted/20 shadow-none'
													>
														{skill}
													</Badge>
												))}
											</div>
										</div>
									)}
								</CardContent>
							</Card>
						</motion.div>

						{/* Darslar */}
						{lessons.length > 0 && (
							<motion.div variants={itemVariants} className='space-y-4'>
								<h3 className='text-lg font-bold flex items-center gap-2'>
									<PlayCircle className='h-5 w-5 text-muted-foreground' />{' '}
									{t('mentorsPage.mentorLessons') || 'Ustoz darslari'}
								</h3>
								<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
									{lessons.map(lesson => (
										<Card
											key={lesson._id}
											className='shadow-sm border-border bg-card'
										>
											<CardContent className='p-5 flex flex-col h-full'>
												<h4 className='font-semibold text-base mb-1.5 leading-tight line-clamp-1'>
													{lesson.title}
												</h4>
												<p className='text-xs text-muted-foreground mb-4 line-clamp-2 leading-relaxed'>
													{lesson.description}
												</p>
												<div className='mt-auto space-y-3 pt-4 border-t'>
													<div className='flex items-center gap-3 text-xs font-medium text-muted-foreground'>
														<span className='flex items-center gap-1.5'>
															<Calendar className='h-3.5 w-3.5' />{' '}
															{formatUzDate(lesson.date).split(',')[0]}
														</span>
														<span className='flex items-center gap-1.5'>
															<Clock className='h-3.5 w-3.5' /> {lesson.time}
														</span>
													</div>
													<div className='flex gap-2'>
														<Badge
															variant='outline'
															className='text-[9px] uppercase tracking-wider shadow-none'
														>
															{lesson.format}
														</Badge>
														<Badge
															variant={
																lesson.status === 'completed'
																	? 'secondary'
																	: 'default'
															}
															className='text-[9px] uppercase tracking-wider shadow-none'
														>
															{t(`mentorsPage.${lesson.status}`) ||
																lesson.status}
														</Badge>
													</div>
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							</motion.div>
						)}
					</div>

					{/* O'NG: Actions Panel */}
					<motion.div variants={itemVariants} className='space-y-6'>
						<Card className='sticky top-24 shadow-sm border-border bg-card'>
							<CardContent className='p-6 space-y-6'>
								<div className='space-y-3'>
									<Button
										onClick={handleFollow}
										disabled={followLoading}
										variant={isFollowing ? 'secondary' : 'default'}
										className={cn(
											'w-full font-semibold transition-colors',
											isFollowing && 'hover:bg-destructive hover:text-white',
										)}
									>
										{followLoading ? (
											<Loader2 className='h-4 w-4 animate-spin' />
										) : isFollowing ? (
											<>
												<CheckCircle2 className='mr-2 h-4 w-4' />{' '}
												{t('mentorsPage.subscribed') || 'Kuzatilyapti'}
											</>
										) : (
											<>
												<UserPlus className='mr-2 h-4 w-4' />{' '}
												{t('mentorsPage.subscribe') || 'Kuzatish'}
											</>
										)}
									</Button>

									<Button
										variant='outline'
										className='w-full font-medium'
										onClick={handleMessage}
									>
										<MessageSquare className='mr-2 h-4 w-4' />{' '}
										{t('mentorsPage.message') || 'Xabar yuborish'}
									</Button>

									{mentor.username && (
										<Button
											variant='secondary'
											className='w-full text-blue-600 bg-blue-500/10 hover:bg-blue-500/20 border-transparent font-medium'
											asChild
										>
											<a
												href={`https://t.me/${mentor.username.replace('@', '')}`}
												target='_blank'
												rel='noopener noreferrer'
											>
												<Send className='mr-2 h-4 w-4' />{' '}
												{t('mentorsPage.sendTelegram') || 'Telegram orqali'}
											</a>
										</Button>
									)}
								</div>

								{mentor.schedule?.length > 0 && (
									<div className='space-y-3 pt-6 border-t'>
										<h4 className='text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5'>
											<Clock className='h-3.5 w-3.5' />{' '}
											{t('mentorsPage.availableTime') || "Bo'sh vaqtlari"}
										</h4>
										<div className='grid gap-2'>
											{mentor.schedule.map((item, idx) => (
												<div
													key={idx}
													className='text-sm p-2 rounded-md bg-muted/30 border flex items-center justify-between'
												>
													<span className='font-medium text-foreground ml-2'>
														{item.day}
													</span>
													<Badge
														variant='outline'
														className='text-[10px] shadow-none bg-background font-mono'
													>
														{item.from} - {item.to}
													</Badge>
												</div>
											))}
										</div>
									</div>
								)}

								{/* Rating UI */}
								<div className='pt-6 border-t text-center space-y-3'>
									<h4 className='text-xs font-bold uppercase tracking-wider text-muted-foreground'>
										{t('mentorsPage.rateMentor') || 'Baholash'}
									</h4>
									<div className='flex justify-center gap-1'>
										{[1, 2, 3, 4, 5].map(star => (
											<button
												key={star}
												disabled={ratingLoading}
												className='transition-transform hover:scale-110 focus:outline-none disabled:opacity-50 outline-none'
												onMouseEnter={() => setHoveredStar(star)}
												onMouseLeave={() => setHoveredStar(0)}
												onClick={() => handleRate(star)}
											>
												<Star
													className={cn(
														'h-6 w-6 transition-colors',
														star <= (hoveredStar || userRating)
															? 'text-amber-500 fill-amber-500'
															: 'text-muted-foreground/30',
													)}
												/>
											</button>
										))}
									</div>
									<div className='text-xs font-medium min-h-[1.5rem]'>
										{userRating > 0 ? (
											<span className='text-green-600'>
												{t('mentorsPage.youRated', { score: userRating }) ||
													`Sizning bahoingiz: ${userRating}`}
											</span>
										) : (
											<span className='text-muted-foreground'>
												{t('mentorsPage.rateInstructions') ||
													'Ustozga baho bering'}
											</span>
										)}
									</div>
								</div>
							</CardContent>
						</Card>
					</motion.div>
				</div>
			</motion.div>
		</div>
	)
}
