'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import api from '@/lib/api'
// 🔥 utils'dan markaziy funksiyalarni olamiz
import { cn, formatUzDate, getErrorMessage, getInitials } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import {
	ArrowLeft,
	Award,
	BookOpen,
	Calendar,
	Clock,
	GraduationCap,
	Heart,
	Languages,
	MessageSquare,
	PlusCircle,
	Share2,
	Star,
	Users,
	X,
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

// --- ANIMATION VARIANTS ---
const containerVars = {
	hidden: { opacity: 0 },
	show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVars = {
	hidden: { opacity: 0, y: 15 },
	show: {
		opacity: 1,
		y: 0,
		transition: { type: 'spring', stiffness: 300, damping: 24 },
	},
}

// --- SKELETON LOADER ---
function MentorDetailSkeleton() {
	return (
		<div className='max-w-6xl mx-auto space-y-6 pb-12 animate-pulse pt-6 px-4 sm:px-6'>
			<div className='flex justify-between'>
				<Skeleton className='h-9 w-24 rounded-md' />
				<Skeleton className='h-9 w-10 rounded-md' />
			</div>
			<div className='h-48 sm:h-56 bg-muted rounded-xl' />
			<div className='flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 sm:-mt-20 px-6 sm:px-8'>
				<Skeleton className='w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-background' />
				<div className='flex-1 space-y-3 mb-2 w-full text-center sm:text-left'>
					<Skeleton className='h-8 w-48 mx-auto sm:mx-0' />
					<Skeleton className='h-4 w-64 mx-auto sm:mx-0' />
				</div>
				<div className='flex gap-2 mb-2 w-full sm:w-auto'>
					<Skeleton className='h-10 flex-1 sm:w-32' />
					<Skeleton className='h-10 flex-1 sm:w-32' />
				</div>
			</div>
		</div>
	)
}

// ==========================================
// 🚀 ASOSIY KOMPONENT
// ==========================================
export default function StudentMentorDetailPage() {
	const { id } = useParams()
	const router = useRouter()

	const [mentor, setMentor] = useState(null)
	const [lessons, setLessons] = useState([])
	const [loading, setLoading] = useState(true)
	const [isFollowed, setIsFollowed] = useState(false)
	const [actionLoading, setActionLoading] = useState(false)

	const fetchMentor = useCallback(async () => {
		try {
			setLoading(true)
			const response = await api.get(`/public/mentors/${id}`)
			if (response?.data?.success) {
				setMentor(response.data.mentor)
				setLessons(response.data.lessons || [])
				setIsFollowed(response.data.mentor.isFollowing)
			}
		} catch (error) {
			toast.error(
				getErrorMessage(error, "Mentor ma'lumotlarini yuklashda xatolik"),
			)
			router.push('/student/mentors')
		} finally {
			setLoading(false)
		}
	}, [id, router])

	useEffect(() => {
		if (id) fetchMentor()
	}, [id, fetchMentor])

	const handleFollowToggle = async () => {
		try {
			setActionLoading(true)
			if (isFollowed) {
				await api.delete(`/public/mentors/${id}/follow`)
				setIsFollowed(false)
				toast.success("Kuzatish to'xtatildi")
			} else {
				await api.post(`/public/mentors/${id}/follow`)
				setIsFollowed(true)
				toast.success("Muvaffaqiyatli obuna bo'ldingiz")
			}

			// Orqa fonda raqamlarni yangilash
			const res = await api.get(`/public/mentors/${id}`)
			if (res?.data?.success) setMentor(res.data.mentor)
		} catch (error) {
			toast.error(getErrorMessage(error, "Amalni bajarib bo'lmadi"))
		} finally {
			setActionLoading(false)
		}
	}

	const handleEnrollmentToggle = async (lessonId, currentStatus) => {
		try {
			setActionLoading(true)
			if (currentStatus) {
				await api.delete(`/public/lessons/${lessonId}/join`)
				toast.success('Darsdan chiqdingiz')
			} else {
				await api.post(`/public/lessons/${lessonId}/join`)
				toast.success('Darsga yozildingiz')
			}

			// Orqa fonda ro'yxatni yangilash
			const res = await api.get(`/public/mentors/${id}`)
			if (res?.data?.success) setLessons(res.data.lessons)
		} catch (error) {
			toast.error(getErrorMessage(error, 'Darsga yozilishda xatolik'))
		} finally {
			setActionLoading(false)
		}
	}

	if (loading) return <MentorDetailSkeleton />
	if (!mentor) return null

	const upcomingLessons = lessons.filter(
		l => l.status === 'upcoming' || l.status === 'live',
	)
	const pastLessons = lessons.filter(l => l.status === 'completed')

	return (
		<motion.div
			variants={containerVars}
			initial='hidden'
			animate='show'
			className='max-w-6xl mx-auto space-y-6 pb-12 pt-6 px-4 sm:px-6'
		>
			{/* 🏷️ HEADER / ACTIONS */}
			<motion.div
				variants={itemVars}
				className='flex items-center justify-between'
			>
				<Button
					variant='ghost'
					onClick={() => router.back()}
					className='gap-2 -ml-2 text-muted-foreground hover:text-foreground'
				>
					<ArrowLeft className='w-4 h-4' /> Orqaga
				</Button>
				<Button
					variant='outline'
					size='icon'
					className='shadow-sm'
					onClick={() => {
						navigator.clipboard.writeText(window.location.href)
						toast.success('Profil havolasi nusxalandi')
					}}
				>
					<Share2 className='w-4 h-4 text-muted-foreground' />
				</Button>
			</motion.div>

			{/* 🖼️ COVER & PROFILE HEADER */}
			<motion.div variants={itemVars} className='relative'>
				<div className='h-48 sm:h-56 w-full bg-muted rounded-xl border border-border shadow-sm flex items-center justify-center overflow-hidden'>
					<BookOpen className='h-24 w-24 text-muted-foreground opacity-10' />
				</div>

				<div className='flex flex-col sm:flex-row items-center sm:items-end gap-5 -mt-16 sm:-mt-20 px-4 sm:px-8 relative z-10'>
					<div className='relative'>
						<Avatar className='w-32 h-32 sm:w-40 sm:h-40 border-4 border-background shadow-md bg-muted'>
							<AvatarImage
								src={mentor.image}
								alt={mentor.firstName}
								className='object-cover'
							/>
							<AvatarFallback className='text-4xl font-bold bg-primary/5 text-primary'>
								{getInitials(mentor.firstName, mentor.lastName)}
							</AvatarFallback>
						</Avatar>
						<Badge
							variant='secondary'
							className='absolute bottom-2 right-2 border shadow-sm text-[10px] font-bold flex items-center gap-1 bg-background text-foreground'
						>
							<Star className='w-3 h-3 text-amber-500 fill-amber-500' />{' '}
							{mentor.rating || 'N/A'}
						</Badge>
					</div>

					<div className='flex-1 text-center sm:text-left space-y-1 mb-2'>
						<div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3'>
							<h1 className='text-2xl sm:text-3xl font-bold tracking-tight text-foreground capitalize'>
								{mentor.firstName} {mentor.lastName}
							</h1>
							<Badge
								variant='outline'
								className='w-fit mx-auto sm:mx-0 font-medium bg-muted/50 uppercase tracking-wider text-[10px] border-transparent'
							>
								{mentor.specialty || "Yo'nalish kiritilmagan"}
							</Badge>
						</div>
						<div className='flex flex-wrap justify-center sm:justify-start gap-4 text-xs font-medium text-muted-foreground pt-1.5'>
							<span className='flex items-center gap-1.5'>
								<Users className='h-3.5 w-3.5' />
								<span className='text-foreground'>
									{mentor.followersCount || 0}
								</span>{' '}
								obunachi
							</span>
							<span className='flex items-center gap-1.5'>
								<BookOpen className='h-3.5 w-3.5' />
								<span className='text-foreground'>
									{mentor.lessonsCount || 0}
								</span>{' '}
								darslar
							</span>
						</div>
					</div>

					<div className='flex w-full sm:w-auto gap-2 mb-2 shrink-0'>
						<Button
							onClick={handleFollowToggle}
							variant={isFollowed ? 'secondary' : 'default'}
							disabled={actionLoading}
							className={cn(
								'flex-1 sm:flex-none font-medium h-10',
								isFollowed
									? 'hover:bg-destructive hover:text-destructive-foreground shadow-none'
									: 'shadow-sm',
							)}
						>
							<Heart
								className={cn('h-4 w-4 mr-2', isFollowed ? 'fill-current' : '')}
							/>
							{isFollowed ? "Kuzatishni to'xtatish" : 'Kuzatish'}
						</Button>
						<Button
							variant='outline'
							onClick={() => {
								sessionStorage.setItem('selectedContact', mentor.id)
								router.push('/users/messages')
							}}
							className='flex-1 sm:flex-none h-10 font-medium'
						>
							<MessageSquare className='h-4 w-4 sm:mr-2' />
							<span className='hidden sm:inline'>Xabar yuborish</span>
						</Button>
					</div>
				</div>
			</motion.div>

			{/* 🗂️ MAIN CONTENT GRID */}
			<div className='grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6'>
				{/* CHAP PANEL (INFO) */}
				<div className='lg:col-span-4 space-y-6'>
					<motion.div variants={itemVars}>
						<Card className='shadow-sm bg-card'>
							<CardHeader className='pb-4 border-b bg-muted/20'>
								<CardTitle className='text-base flex items-center gap-2'>
									<Award className='h-4 w-4 text-muted-foreground' />{' '}
									Ma'lumotlar
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4 pt-5'>
								<div className='space-y-1'>
									<p className='text-[10px] font-bold uppercase tracking-wider text-muted-foreground'>
										Tajriba
									</p>
									<p className='font-medium text-sm flex items-center gap-2'>
										<Clock className='h-4 w-4 text-muted-foreground' />{' '}
										{mentor.experience || 0} yil
									</p>
								</div>

								<div className='space-y-1'>
									<p className='text-[10px] font-bold uppercase tracking-wider text-muted-foreground'>
										O'quv bosqichi
									</p>
									<p className='font-medium text-sm flex items-center gap-2'>
										<GraduationCap className='h-4 w-4 text-muted-foreground' />{' '}
										{mentor.course || 'Kiritilmagan'}
									</p>
								</div>

								<div className='space-y-1'>
									<p className='text-[10px] font-bold uppercase tracking-wider text-muted-foreground'>
										Tillar
									</p>
									<div className='flex flex-wrap gap-2 pt-1'>
										{mentor.languages?.length > 0 ? (
											mentor.languages.map((lang, idx) => (
												<Badge
													key={idx}
													variant='secondary'
													className='font-medium gap-1.5 shadow-none'
												>
													<Languages className='h-3 w-3 text-muted-foreground' />
													{lang.name}{' '}
													{lang.level && (
														<span className='opacity-60 font-normal'>
															({lang.level})
														</span>
													)}
												</Badge>
											))
										) : (
											<p className='text-xs text-muted-foreground italic'>
												Kiritilmagan
											</p>
										)}
									</div>
								</div>
							</CardContent>
						</Card>
					</motion.div>

					<motion.div variants={itemVars}>
						<Card className='shadow-sm bg-card'>
							<CardHeader className='pb-4 border-b bg-muted/20'>
								<CardTitle className='text-base flex items-center gap-2'>
									<Calendar className='h-4 w-4 text-muted-foreground' /> Dars
									vaqtlari
								</CardTitle>
							</CardHeader>
							<CardContent className='pt-5'>
								<div className='space-y-2'>
									{mentor.schedule?.length > 0 ? (
										mentor.schedule.map((item, idx) => (
											<div
												key={idx}
												className='flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors'
											>
												<span className='text-sm font-medium'>{item.day}</span>
												<Badge
													variant='outline'
													className='text-[10px] font-mono shadow-none'
												>
													{item.from} - {item.to}
												</Badge>
											</div>
										))
									) : (
										<div className='text-sm text-muted-foreground text-center py-4 italic opacity-70'>
											Vaqtlar belgilanmagan
										</div>
									)}
								</div>
							</CardContent>
						</Card>
					</motion.div>
				</div>

				{/* O'NG PANEL (ABOUT & LESSONS) */}
				<div className='lg:col-span-8 space-y-6'>
					<motion.div variants={itemVars}>
						<Card className='shadow-sm bg-card'>
							<CardContent className='p-6 space-y-6'>
								{/* About */}
								<div className='space-y-2'>
									<h3 className='text-sm font-bold uppercase tracking-wider text-muted-foreground border-b pb-2'>
										Ustoz haqida
									</h3>
									<p className='text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap'>
										{mentor.about || (
											<span className='italic'>Ma'lumot kiritilmagan.</span>
										)}
									</p>
								</div>

								{/* Skills */}
								<div className='space-y-2'>
									<h3 className='text-sm font-bold uppercase tracking-wider text-muted-foreground border-b pb-2'>
										Texnik ko'nikmalar
									</h3>
									<div className='flex flex-wrap gap-2 pt-1'>
										{mentor.skills?.length > 0 ? (
											mentor.skills.map((skill, idx) => (
												<Badge
													key={idx}
													variant='outline'
													className='font-medium bg-muted/20 shadow-none'
												>
													{skill}
												</Badge>
											))
										) : (
											<p className='text-xs text-muted-foreground italic'>
												Ko'nikmalar yo'q
											</p>
										)}
									</div>
								</div>
							</CardContent>
						</Card>
					</motion.div>

					{/* Lessons Section */}
					<motion.div variants={itemVars}>
						<Tabs defaultValue='upcoming' className='w-full'>
							<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 border-b pb-2'>
								<h3 className='text-lg font-bold flex items-center gap-2'>
									<BookOpen className='h-5 w-5 text-muted-foreground' /> Mentor
									Darslari
								</h3>
								<TabsList className='bg-transparent p-0 h-auto gap-4'>
									<TabsTrigger
										value='upcoming'
										className='rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-1 text-sm font-medium'
									>
										Kelgusi ({upcomingLessons.length})
									</TabsTrigger>
									<TabsTrigger
										value='past'
										className='rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-1 text-sm font-medium'
									>
										Yakunlangan ({pastLessons.length})
									</TabsTrigger>
								</TabsList>
							</div>

							<TabsContent
								value='upcoming'
								className='mt-4 focus-visible:outline-none'
							>
								<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
									<AnimatePresence mode='popLayout'>
										{upcomingLessons.length > 0 ? (
											upcomingLessons.map((lesson, idx) => (
												<LessonCard
													key={lesson._id}
													lesson={lesson}
													idx={idx}
													onToggleEnroll={() =>
														handleEnrollmentToggle(
															lesson._id,
															lesson.isRegistered,
														)
													}
													actionLoading={actionLoading}
												/>
											))
										) : (
											<motion.div
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												className='col-span-full py-12 text-center text-muted-foreground'
											>
												<Calendar className='h-8 w-8 mx-auto mb-2 opacity-20' />
												<p className='font-medium text-sm'>
													Hozircha darslar belgilanmagan
												</p>
											</motion.div>
										)}
									</AnimatePresence>
								</div>
							</TabsContent>

							<TabsContent
								value='past'
								className='mt-4 focus-visible:outline-none'
							>
								<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
									{pastLessons.map((lesson, idx) => (
										<LessonCard
											key={lesson._id}
											lesson={lesson}
											idx={idx}
											isPast
										/>
									))}
									{pastLessons.length === 0 && (
										<div className='col-span-full py-12 text-center text-muted-foreground text-sm font-medium'>
											Yakunlangan darslar yo'q
										</div>
									)}
								</div>
							</TabsContent>
						</Tabs>
					</motion.div>
				</div>
			</div>
		</motion.div>
	)
}

// --- LESSON CARD COMPONENT (Toza Shadcn) ---
function LessonCard({
	lesson,
	idx,
	isPast = false,
	onToggleEnroll,
	actionLoading,
}) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: idx * 0.05 }}
			layout
			className='h-full'
		>
			<Card
				className={cn(
					'overflow-hidden flex flex-col h-full bg-card hover:border-muted-foreground/30 transition-colors shadow-sm',
					isPast && 'opacity-70 grayscale-[20%]',
				)}
			>
				{/* Thumbnail */}
				<div className='h-24 bg-muted relative shrink-0 flex items-center justify-center border-b'>
					{lesson.image ? (
						<img
							src={lesson.image}
							alt={lesson.title}
							className='w-full h-full object-cover'
						/>
					) : (
						<BookOpen className='w-8 h-8 text-muted-foreground opacity-20' />
					)}
					<Badge
						variant={lesson.status === 'live' ? 'destructive' : 'secondary'}
						className={cn(
							'absolute top-2 right-2 text-[9px] uppercase font-bold shadow-none',
							lesson.status === 'live' && 'animate-pulse',
						)}
					>
						{lesson.format}
					</Badge>
				</div>

				{/* Info */}
				<CardContent className='p-4 flex-1 flex flex-col justify-between gap-4'>
					<div className='space-y-2'>
						<h4 className='font-bold text-sm leading-tight line-clamp-2'>
							{lesson.title}
						</h4>
						<div className='flex flex-wrap gap-x-3 gap-y-1 text-xs font-medium text-muted-foreground pt-1'>
							<span className='flex items-center gap-1.5'>
								<Calendar className='h-3 w-3' />{' '}
								{formatUzDate(lesson.date).split(',')[0]}
							</span>
							<span className='flex items-center gap-1.5'>
								<Clock className='h-3 w-3' /> {lesson.time}
							</span>
							<span className='flex items-center gap-1.5'>
								<Users className='h-3 w-3' /> {lesson.studentsCount || 0}
							</span>
						</div>
					</div>

					{/* Action */}
					{!isPast && (
						<Button
							size='sm'
							variant={lesson.isRegistered ? 'outline' : 'default'}
							onClick={onToggleEnroll}
							disabled={actionLoading}
							className={cn(
								'w-full text-xs font-semibold',
								lesson.isRegistered &&
									'border-destructive/30 text-destructive hover:bg-destructive hover:text-white',
							)}
						>
							{lesson.isRegistered ? (
								<>
									<X className='h-3.5 w-3.5 mr-1.5' /> Bekor qilish
								</>
							) : (
								<>
									<PlusCircle className='h-3.5 w-3.5 mr-1.5' /> Darsga yozilish
								</>
							)}
						</Button>
					)}
				</CardContent>
			</Card>
		</motion.div>
	)
}
