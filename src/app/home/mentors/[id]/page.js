'use client'

import Navbar from '@/components/landing/Navbar'
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
import { motion } from 'framer-motion'
import {
	ArrowLeft,
	BookOpen,
	Briefcase,
	Calendar,
	CheckCircle,
	CheckCircle2,
	Clock,
	ExternalLink,
	Globe,
	GraduationCap,
	Heart,
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

export default function MentorDetailsPage() {
	const params = useParams()
	const router = useRouter()
	const [mentor, setMentor] = useState(null)
	const [lessons, setLessons] = useState([])
	const [loading, setLoading] = useState(true)

	const [currentUser, setCurrentUser] = useState(null)
	const [authChecked, setAuthChecked] = useState(false)

	const [hoveredStar, setHoveredStar] = useState(0)
	const [userRating, setUserRating] = useState(0)
	const [avgRating, setAvgRating] = useState(0)
	const [ratingsCount, setRatingsCount] = useState(0)
	const [ratingLoading, setRatingLoading] = useState(false)

	const [isFollowing, setIsFollowing] = useState(false)
	const [followersCount, setFollowersCount] = useState(0)
	const [followLoading, setFollowLoading] = useState(false)

	const [showAuthModal, setShowAuthModal] = useState(false)
	const [authModalAction, setAuthModalAction] = useState('')

	const [showSuccessModal, setShowSuccessModal] = useState(false)
	const [successMessage, setSuccessMessage] = useState('')

	useEffect(() => {
		const fetchMentor = async () => {
			try {
				const res = await api.get(`/public/mentors/${params.id}`)
				if (res.data.success) {
					setMentor(res.data.mentor)
					setLessons(res.data.lessons || [])
					setAvgRating(res.data.mentor.rating || 0)
					setRatingsCount(res.data.mentor.ratingsCount || 0)
					setFollowersCount(res.data.mentor.followersCount || 0)
					setIsFollowing(res.data.mentor.isFollowing || false)
					setUserRating(res.data.mentor.userRating || 0)
				}
			} catch (error) {
				console.error(error)
			} finally {
				setLoading(false)
			}
		}

		if (params.id) fetchMentor()
	}, [params.id])

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const { data } = await api.get('/auth/me')
				if (data.success && data.user) {
					setCurrentUser(data.user)
				}
			} catch {
			} finally {
				setAuthChecked(true)
			}
		}
		checkAuth()
	}, [])

	const getInitials = m => {
		const first = m?.firstName ? m.firstName[0] : ''
		const last = m?.lastName ? m.lastName[0] : ''
		return (first + last).toUpperCase()
	}

	const getLanguageDisplay = languages => {
		if (!languages || languages.length === 0) return null
		return languages.map(l => {
			let text = l.lang || ''
			if (l.level) text += ` (${l.level})`
			if (l.isNative) text += ' — Ona tili'
			return text
		})
	}

	const getScheduleDisplay = schedule => {
		if (!schedule || schedule.length === 0) return []
		return schedule.map(s => `${s.day}: ${s.from} - ${s.to}`)
	}

	const requireAuth = actionName => {
		if (!currentUser) {
			setAuthModalAction(actionName)
			setShowAuthModal(true)
			return false
		}
		return true
	}

	const handleRate = async score => {
		if (!requireAuth('baho berish')) return

		setRatingLoading(true)
		try {
			const res = await api.post(`/public/mentors/${params.id}/rate`, { score })
			if (res.data.success) {
				setUserRating(res.data.userRating)
				setAvgRating(res.data.rating)
				setRatingsCount(res.data.ratingsCount)
				setSuccessMessage(`Siz mentorga ${score} ⭐ baho berdingiz. Rahmat!`)
				setShowSuccessModal(true)
			}
		} catch (error) {
			if (error.response?.status === 401) {
				setAuthModalAction('baho berish')
				setShowAuthModal(true)
			}
		} finally {
			setRatingLoading(false)
		}
	}

	const handleFollow = async () => {
		if (!requireAuth("obuna bo'lish")) return

		setFollowLoading(true)
		try {
			if (isFollowing) {
				const res = await api.delete(`/public/mentors/${params.id}/follow`)
				if (res.data.success) {
					setIsFollowing(false)
					setFollowersCount(res.data.followersCount)
				}
			} else {
				const res = await api.post(`/public/mentors/${params.id}/follow`)
				if (res.data.success) {
					setIsFollowing(true)
					setFollowersCount(res.data.followersCount)
					setSuccessMessage(
						`Siz ${mentor.firstName} ${mentor.lastName} ga muvaffaqiyatli obuna bo'ldingiz!`,
					)
					setShowSuccessModal(true)
				}
			}
		} catch (error) {
			if (error.response?.status === 401) {
				setAuthModalAction("obuna bo'lish")
				setShowAuthModal(true)
			}
		} finally {
			setFollowLoading(false)
		}
	}

	const handleMessage = () => {
		if (!requireAuth('xabar yuborish')) return

		sessionStorage.setItem(
			'selectedContact',
			JSON.stringify({
				id: `contact_${mentor._id}`,
				contactTargetId: mentor._id,
				name: `${mentor.firstName} ${mentor.lastName}`,
				role: 'mentor',
			}),
		)
		router.push('/users/messages')
	}

	if (loading) {
		return (
			<div className='bg-muted/30 min-h-screen pb-16'>
				<Navbar />
				<div className='container mx-auto px-4 py-6 max-w-6xl'>
					<div className='inline-block mb-4'>
						<Skeleton className='h-10 w-40' />
					</div>
					<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
						<div className='lg:col-span-2 space-y-6'>
							<Card className='overflow-hidden border-none shadow-sm'>
								<Skeleton className='h-32 sm:h-40 w-full rounded-none' />
								<div className='px-6 sm:px-8 pb-8 relative'>
									<div className='flex flex-col sm:flex-row gap-5 sm:items-end -mt-16 sm:-mt-20 mb-6'>
										<Skeleton className='h-32 w-32 rounded-full border-4 border-background shrink-0' />
										<div className='flex-1 pb-1 sm:pb-3 space-y-3 w-full'>
											<div className='flex flex-col sm:flex-row justify-between gap-4'>
												<div className='space-y-2 w-full'>
													<Skeleton className='h-8 w-3/4 sm:w-1/2' />
													<Skeleton className='h-5 w-1/2 sm:w-1/3' />
												</div>
												<Skeleton className='h-8 w-24 rounded-full' />
											</div>
										</div>
									</div>
									<div className='flex flex-wrap gap-4 mb-8 p-4 bg-muted/40 rounded-xl'>
										<Skeleton className='h-6 w-24' />
										<Skeleton className='h-6 w-32' />
										<Skeleton className='h-6 w-28' />
										<Skeleton className='h-6 w-32' />
									</div>
									<div className='space-y-3 mb-6'>
										<Skeleton className='h-6 w-32' />
										<div className='space-y-2'>
											<Skeleton className='h-4 w-full' />
											<Skeleton className='h-4 w-[90%]' />
											<Skeleton className='h-4 w-[80%]' />
										</div>
									</div>
								</div>
							</Card>
							<Card className='border-none shadow-sm'>
								<CardHeader className='pb-3'>
									<Skeleton className='h-6 w-40' />
								</CardHeader>
								<CardContent>
									<div className='flex flex-wrap gap-2.5'>
										<Skeleton className='h-8 w-20 rounded-full' />
										<Skeleton className='h-8 w-24 rounded-full' />
										<Skeleton className='h-8 w-16 rounded-full' />
										<Skeleton className='h-8 w-28 rounded-full' />
									</div>
								</CardContent>
							</Card>
						</div>
						<div className='space-y-6'>
							<Card className='sticky top-24 border-none shadow-sm'>
								<CardContent className='p-6'>
									<div className='space-y-3 mb-6'>
										<Skeleton className='h-12 w-full rounded-md' />
										<Skeleton className='h-11 w-full rounded-md' />
										<Skeleton className='h-11 w-full rounded-md' />
									</div>
									<Separator className='my-6' />
									<div className='space-y-4 mb-6'>
										<Skeleton className='h-5 w-32' />
										<Skeleton className='h-8 w-full rounded-md' />
										<Skeleton className='h-8 w-full rounded-md' />
									</div>
									<Separator className='my-6' />
									<Skeleton className='h-36 w-full rounded-xl' />
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>
		)
	}

	if (!mentor) {
		return (
			<div className='flex flex-col min-h-screen'>
				<Navbar />
				<div className='flex-1 container mx-auto px-4 py-8 flex flex-col items-center justify-center'>
					<h1 className='text-3xl font-bold mb-4'>Mentor topilmadi</h1>
					<p className='text-muted-foreground mb-8 text-center'>
						Siz qidirayotgan mentor sahifasi mavjud emas yoki o'chirilgan.
					</p>
					<Link href='/home/mentors'>
						<Button className='gap-2'>
							<ArrowLeft className='h-4 w-4' /> Mentorlar ro'yxatiga qaytish
						</Button>
					</Link>
				</div>
			</div>
		)
	}

	const scheduleItems = getScheduleDisplay(mentor.schedule)
	const languageItems = getLanguageDisplay(mentor.languages)

	return (
		<div className='bg-muted/30 min-h-screen pb-16'>
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
							<strong className='text-foreground capitalize'>
								{authModalAction}
							</strong>{' '}
							uchun avval tizimga kirishingiz kerak.
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
						<DialogDescription className='text-base leading-relaxed'>
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
				className='container mx-auto px-4 py-6 max-w-6xl'
			>
				<motion.div variants={itemVariants} className='inline-block mb-4'>
					<Link href='/home/mentors'>
						<Button
							variant='ghost'
							className='px-0 hover:bg-transparent text-muted-foreground hover:text-foreground gap-2'
						>
							<ArrowLeft className='h-4 w-4' /> Mentorlar ro'yxati
						</Button>
					</Link>
				</motion.div>

				<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
					<div className='lg:col-span-2 space-y-6'>
						<motion.div variants={itemVariants}>
							<Card className='overflow-hidden border-none shadow-sm'>
								<div className='h-32 sm:h-40 bg-gradient-to-r from-primary/20 via-primary/10 to-muted relative'></div>

								<div className='px-6 sm:px-8 pb-8 relative'>
									<div className='flex flex-col sm:flex-row gap-5 sm:items-end -mt-16 sm:-mt-20 mb-6'>
										<div className='relative inline-block'>
											<Avatar className='h-32 w-32 border-4 border-background shadow-md'>
												<AvatarImage
													src={mentor.avatarUrl || ''}
													alt={`${mentor.firstName} ${mentor.lastName}`}
												/>
												<AvatarFallback className='bg-primary/10 text-primary text-4xl font-bold'>
													{getInitials(mentor)}
												</AvatarFallback>
											</Avatar>
										</div>

										<div className='flex-1 pb-1 sm:pb-3'>
											<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
												<div>
													<h1 className='text-2xl sm:text-3xl font-extrabold text-foreground'>
														{mentor.firstName} {mentor.lastName}
													</h1>
													<p className='text-primary font-medium flex items-center gap-1.5 mt-1.5 text-sm sm:text-base'>
														<BookOpen className='h-4.5 w-4.5' />
														{mentor.specialty || 'Mentor'}
													</p>
												</div>
												<Badge
													variant='secondary'
													className='px-3 py-1.5 rounded-full flex items-center gap-1.5 w-fit'
												>
													<Star className='h-4 w-4 text-yellow-500 fill-yellow-500' />
													<span className='font-bold text-sm'>
														{avgRating > 0 ? avgRating : '—'}
													</span>
													<span className='text-muted-foreground font-normal'>
														({ratingsCount})
													</span>
												</Badge>
											</div>
										</div>
									</div>

									<div className='flex flex-wrap gap-4 text-sm text-muted-foreground mb-8 p-4 bg-muted/40 rounded-xl'>
										{mentor.course && (
											<div className='flex items-center gap-2'>
												<GraduationCap className='h-4 w-4 text-primary' />
												<span className='font-medium'>{mentor.course}</span>
											</div>
										)}
										{mentor.experience && (
											<div className='flex items-center gap-2'>
												<Briefcase className='h-4 w-4 text-primary' />
												<span className='font-medium'>
													{mentor.experience} tajriba
												</span>
											</div>
										)}
										<div className='flex items-center gap-2'>
											<Users className='h-4 w-4 text-primary' />
											<span className='font-medium'>
												{mentor.studentsCount || 0} ta o'quvchi
											</span>
										</div>
										<div className='flex items-center gap-2'>
											<Heart className='h-4 w-4 text-primary' />
											<span className='font-medium'>
												{followersCount} ta obunachi
											</span>
										</div>
										{mentor.username && (
											<a
												href={`https://t.me/${mentor.username}`}
												target='_blank'
												rel='noopener noreferrer'
												className='flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors'
											>
												<Send className='h-4 w-4' />
												<span className='font-medium'>@{mentor.username}</span>
												<ExternalLink className='h-3 w-3' />
											</a>
										)}
									</div>

									{languageItems && languageItems.length > 0 && (
										<div className='flex flex-wrap gap-4 text-sm text-muted-foreground mb-6 p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-100/50 dark:border-blue-900/30'>
											<div className='flex items-center gap-2 w-full mb-1'>
												<Globe className='h-4 w-4 text-blue-500' />
												<span className='font-semibold text-foreground text-xs uppercase tracking-wider'>
													Tillar
												</span>
											</div>
											{languageItems.map((lang, idx) => (
												<Badge
													key={idx}
													variant='outline'
													className='bg-background font-normal'
												>
													{lang}
												</Badge>
											))}
										</div>
									)}

									{mentor.about && (
										<div className='space-y-3'>
											<h3 className='text-lg font-bold text-foreground'>
												Men haqimda
											</h3>
											<p className='text-muted-foreground leading-relaxed text-[15px]'>
												{mentor.about}
											</p>
										</div>
									)}
								</div>
							</Card>
						</motion.div>

						{mentor.skills && mentor.skills.length > 0 && (
							<motion.div variants={itemVariants}>
								<Card className='border-none shadow-sm'>
									<CardHeader className='pb-3'>
										<CardTitle className='text-lg'>
											Texnik Ko'nikmalar
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className='flex flex-wrap gap-2.5'>
											{mentor.skills.map((skill, idx) => (
												<Badge
													key={idx}
													variant='outline'
													className='px-3 py-1.5 text-sm bg-background'
												>
													{skill}
												</Badge>
											))}
										</div>
									</CardContent>
								</Card>
							</motion.div>
						)}

						{lessons.length > 0 && (
							<motion.div variants={itemVariants} className='pt-4'>
								<h3 className='text-xl font-bold flex items-center gap-2 mb-4 px-1'>
									<PlayCircle className='h-6 w-6 text-primary' />
									Mentorning Darslari
								</h3>
								<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
									{lessons.map(lesson => (
										<Card
											key={lesson._id}
											className='hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group border-muted'
										>
											<CardContent className='p-5 flex flex-col h-full'>
												<h4 className='font-semibold text-lg mb-3 group-hover:text-primary transition-colors line-clamp-2'>
													{lesson.title}
												</h4>
												{lesson.description && (
													<p className='text-sm text-muted-foreground mb-3 line-clamp-2'>
														{lesson.description}
													</p>
												)}
												<div className='flex items-center gap-3 text-sm text-muted-foreground mt-auto pt-4 border-t'>
													{lesson.date && (
														<div className='flex items-center gap-1.5'>
															<Calendar className='h-4 w-4' />
															<span>
																{new Date(lesson.date).toLocaleDateString(
																	'uz-UZ',
																)}
															</span>
														</div>
													)}
													{lesson.time && (
														<>
															<div className='bg-border w-1 h-1 rounded-full'></div>
															<div className='flex items-center gap-1.5'>
																<Clock className='h-4 w-4' />
																<span>{lesson.time}</span>
															</div>
														</>
													)}
												</div>
												<div className='flex items-center gap-2 mt-3'>
													<Badge
														variant='secondary'
														className='w-fit text-xs font-medium'
													>
														{lesson.format || 'online'}
													</Badge>
													<Badge
														variant={
															lesson.status === 'completed'
																? 'default'
																: 'outline'
														}
														className='w-fit text-xs font-medium'
													>
														{lesson.status === 'upcoming'
															? 'Kutilmoqda'
															: lesson.status === 'live'
																? 'Jonli'
																: 'Tugallangan'}
													</Badge>
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							</motion.div>
						)}
					</div>

					<motion.div variants={itemVariants} className='space-y-6'>
						<Card className='sticky top-24 border-none shadow-sm'>
							<CardContent className='p-6'>
								<div className='space-y-3 mb-6'>
									<Button
										className={`w-full h-12 text-base font-semibold shadow-sm transition-all ${
											isFollowing
												? 'bg-secondary text-secondary-foreground hover:bg-destructive hover:text-destructive-foreground'
												: ''
										}`}
										onClick={handleFollow}
										disabled={followLoading}
									>
										{followLoading ? (
											<Loader2 className='mr-2 h-5 w-5 animate-spin' />
										) : isFollowing ? (
											<>
												<CheckCircle2 className='mr-2 h-5 w-5' />
												Obuna bo'lindi
											</>
										) : (
											<>
												<UserPlus className='mr-2 h-5 w-5' />
												Obuna bo'lish
											</>
										)}
									</Button>

									<Button
										variant='outline'
										className='w-full h-11 text-base font-medium'
										onClick={handleMessage}
									>
										<MessageSquare className='mr-2 h-4 w-4' /> Xabar yozish
									</Button>

									{mentor.username && (
										<a
											href={`https://t.me/${mentor.username}`}
											target='_blank'
											rel='noopener noreferrer'
											className='block w-full'
										>
											<Button
												variant='outline'
												className='w-full h-11 text-base font-medium text-blue-500 border-blue-200 hover:bg-blue-50 hover:text-blue-600 dark:border-blue-800 dark:hover:bg-blue-950'
											>
												<Send className='mr-2 h-4 w-4' /> Telegramda yozish
											</Button>
										</a>
									)}
								</div>

								<Separator className='my-6' />

								{scheduleItems.length > 0 && (
									<>
										<div className='space-y-4 mb-6'>
											<h4 className='font-semibold text-sm text-foreground uppercase tracking-wider flex items-center gap-2'>
												<Clock className='h-4 w-4 text-primary' />
												Bo'sh vaqtlari
											</h4>
											<div className='space-y-2.5'>
												{scheduleItems.map((item, idx) => (
													<div
														key={idx}
														className='flex items-center gap-3 text-sm bg-muted/50 p-2 rounded-md'
													>
														<CheckCircle className='h-4 w-4 text-green-500' />
														<span className='font-medium text-muted-foreground'>
															{item}
														</span>
													</div>
												))}
											</div>
										</div>
										<Separator className='my-6' />
									</>
								)}

								<div className='p-5 bg-background rounded-xl border shadow-sm text-center space-y-3'>
									<h4 className='font-semibold text-sm text-foreground'>
										Mentorni Baholash
									</h4>
									<div className='flex justify-center gap-1.5'>
										{[1, 2, 3, 4, 5].map(star => (
											<button
												key={star}
												disabled={ratingLoading}
												className='p-1 hover:scale-125 transition-all focus:outline-none disabled:opacity-50'
												onMouseEnter={() => setHoveredStar(star)}
												onMouseLeave={() => setHoveredStar(0)}
												onClick={() => handleRate(star)}
											>
												<Star
													className={`h-7 w-7 transition-colors ${
														star <= (hoveredStar || userRating)
															? 'text-yellow-400 fill-yellow-400'
															: 'text-muted hover:text-yellow-300'
													}`}
												/>
											</button>
										))}
									</div>
									{userRating > 0 ? (
										<p className='text-xs text-green-600 font-medium'>
											Siz {userRating} ⭐ baho berdingiz
										</p>
									) : (
										<p className='text-xs text-muted-foreground font-medium'>
											Baho berish uchun yulduzlarni bosing
										</p>
									)}
									{avgRating > 0 && (
										<p className='text-xs text-muted-foreground'>
											O'rtacha reyting: {avgRating} ({ratingsCount} ta baho)
										</p>
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
