'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import api from '@/lib/api'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import {
	ArrowLeft,
	Award,
	BookOpen,
	Calendar,
	CheckCircle2,
	Clock,
	GraduationCap,
	Heart,
	Languages,
	MessageSquare,
	PlusCircle,
	Share2,
	Star,
	Users,
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
		<div className='max-w-6xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500'>
			<div className='flex justify-between'>
				<Skeleton className='h-9 w-24 rounded-lg' />
				<Skeleton className='h-9 w-10 rounded-lg' />
			</div>
			<div className='h-48 sm:h-56 bg-muted rounded-2xl'></div>
			<div className='flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 sm:-mt-20 px-6 sm:px-8'>
				<Skeleton className='w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-background' />
				<div className='flex-1 space-y-3 mb-2 w-full text-center sm:text-left'>
					<Skeleton className='h-8 w-48 mx-auto sm:mx-0' />
					<Skeleton className='h-4 w-64 mx-auto sm:mx-0' />
				</div>
				<div className='flex gap-2 mb-2 w-full sm:w-auto'>
					<Skeleton className='h-10 flex-1 sm:w-32 rounded-xl' />
					<Skeleton className='h-10 flex-1 sm:w-32 rounded-xl' />
				</div>
			</div>
			<div className='grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4'>
				<div className='lg:col-span-4 space-y-6'>
					<Skeleton className='h-[350px] w-full rounded-xl' />
					<Skeleton className='h-[200px] w-full rounded-xl' />
				</div>
				<div className='lg:col-span-8 space-y-6'>
					<Skeleton className='h-[250px] w-full rounded-xl' />
					<Skeleton className='h-[400px] w-full rounded-xl' />
				</div>
			</div>
		</div>
	)
}

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
			if (response.data.success) {
				setMentor(response.data.mentor)
				setLessons(response.data.lessons)
				setIsFollowed(response.data.mentor.isFollowing)
			}
		} catch (error) {
			console.error('Fetch mentor error:', error)
			toast.error("Mentor ma'lumotlarini yuklashda xatolik yuz berdi")
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
				toast.success('Obuna bekor qilindi')
			} else {
				await api.post(`/public/mentors/${id}/follow`)
				setIsFollowed(true)
				toast.success("Muvaffaqiyatli obuna bo'ldingiz")
			}

			const res = await api.get(`/public/mentors/${id}`)
			if (res.data.success) {
				setMentor(res.data.mentor)
			}
		} catch (error) {
			toast.error(error.response?.data?.message || "Amalni bajarib bo'lmadi")
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
				toast.success('Darsga muvaffaqiyatli yozildingiz')
			}

			const res = await api.get(`/public/mentors/${id}`)
			if (res.data.success) {
				setLessons(res.data.lessons)
			}
		} catch (error) {
			toast.error(error.response?.data?.message || 'Darsga yozilishda xatolik')
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
			className='max-w-6xl mx-auto space-y-6 pb-12'
		>
			{/* HEADER / ACTIONS */}
			<motion.div
				variants={itemVars}
				className='flex items-center justify-between'
			>
				<Button
					variant='ghost'
					onClick={() => router.back()}
					className='gap-2 -ml-2 text-muted-foreground hover:text-foreground font-semibold'
				>
					<ArrowLeft className='w-4 h-4' /> Orqaga
				</Button>
				<Button variant='outline' size='icon' className='rounded-xl shadow-sm'>
					<Share2 className='w-4 h-4 text-muted-foreground' />
				</Button>
			</motion.div>

			{/* COVER & PROFILE HEADER */}
			<motion.div variants={itemVars} className='relative'>
				<div className='h-48 sm:h-56 w-full bg-gradient-to-r from-primary/20 via-primary/10 to-transparent rounded-2xl border shadow-sm' />

				<div className='flex flex-col sm:flex-row items-center sm:items-end gap-5 -mt-16 sm:-mt-20 px-4 sm:px-8 relative z-10'>
					<div className='relative'>
						<Avatar className='w-32 h-32 sm:w-40 sm:h-40 border-[6px] border-background shadow-md bg-background'>
							<AvatarImage
								src={mentor.image}
								alt={mentor.name}
								className='object-cover'
							/>
							<AvatarFallback className='text-3xl font-black bg-primary/5 text-primary uppercase'>
								{mentor.firstName?.[0]}
								{mentor.lastName?.[0]}
							</AvatarFallback>
						</Avatar>
						<Badge className='absolute bottom-2 right-2 bg-background border shadow-sm text-foreground px-2 py-0.5 text-xs font-bold flex items-center gap-1'>
							<Star className='w-3 h-3 text-amber-500 fill-current' />{' '}
							{mentor.rating || '4.9'}
						</Badge>
					</div>

					<div className='flex-1 text-center sm:text-left space-y-1.5 mb-2'>
						<div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3'>
							<h1 className='text-2xl sm:text-3xl font-black tracking-tight text-foreground'>
								{mentor.firstName} {mentor.lastName}
							</h1>
							<Badge
								variant='secondary'
								className='w-fit mx-auto sm:mx-0 font-semibold uppercase tracking-wider text-[10px]'
							>
								{mentor.specialty}
							</Badge>
						</div>
						<div className='flex flex-wrap justify-center sm:justify-start gap-4 text-xs font-medium text-muted-foreground pt-1'>
							<span className='flex items-center gap-1.5'>
								<Star className='h-3.5 w-3.5 text-amber-500 fill-amber-500' />
								<span className='text-foreground font-bold'>
									{mentor.rating || '4.9'}
								</span>
								({mentor.ratingsCount || 0} baho)
							</span>
							<span className='flex items-center gap-1.5'>
								<Users className='h-3.5 w-3.5 text-primary' />
								<span className='text-foreground font-bold'>
									{mentor.followersCount || 0}
								</span>{' '}
								obunachi
							</span>
							<span className='flex items-center gap-1.5'>
								<BookOpen className='h-3.5 w-3.5 text-emerald-500' />
								<span className='text-foreground font-bold'>
									{mentor.lessonsCount || 0}
								</span>{' '}
								darslar
							</span>
						</div>
					</div>

					<div className='flex w-full sm:w-auto gap-3 mb-2 shrink-0'>
						<Button
							onClick={handleFollowToggle}
							variant={isFollowed ? 'secondary' : 'default'}
							disabled={actionLoading}
							className={cn(
								'flex-1 sm:flex-none rounded-xl px-6 font-bold transition-all h-11',
								isFollowed
									? 'hover:bg-destructive hover:text-destructive-foreground'
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
							className='flex-1 sm:flex-none rounded-xl px-5 h-11 border-muted/60 bg-card hover:bg-muted/50 font-bold'
						>
							<MessageSquare className='h-4 w-4 sm:mr-2 text-primary' />
							<span className='hidden sm:inline'>Xabar yuborish</span>
						</Button>
					</div>
				</div>
			</motion.div>

			{/* MAIN CONTENT GRID */}
			<div className='grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4'>
				{/* SIDEBAR INFO */}
				<div className='lg:col-span-4 space-y-6'>
					<motion.div variants={itemVars}>
						<Card className='shadow-sm border-muted h-full flex flex-col'>
							<CardHeader className='pb-4 border-b bg-muted/20'>
								<CardTitle className='text-base flex items-center gap-2 font-bold'>
									<Award className='h-4 w-4 text-primary' /> Ma'lumotlar
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4 pt-5'>
								<div className='space-y-1.5'>
									<p className='text-[10px] font-bold uppercase tracking-wider text-muted-foreground'>
										Yo'nalish
									</p>
									<p className='font-semibold text-sm bg-muted/30 p-2.5 rounded-lg border border-transparent'>
										{mentor.specialty}
									</p>
								</div>

								<div className='space-y-1.5'>
									<p className='text-[10px] font-bold uppercase tracking-wider text-muted-foreground'>
										Tajriba
									</p>
									<p className='font-semibold text-sm bg-muted/30 p-2.5 rounded-lg border border-transparent flex items-center gap-2'>
										<Clock className='h-4 w-4 text-primary' />{' '}
										{mentor.experience} yil
									</p>
								</div>

								<div className='space-y-1.5'>
									<p className='text-[10px] font-bold uppercase tracking-wider text-muted-foreground'>
										O'quv bosqichi
									</p>
									<p className='font-semibold text-sm bg-muted/30 p-2.5 rounded-lg border border-transparent flex items-center gap-2'>
										<GraduationCap className='h-4 w-4 text-primary' />{' '}
										{mentor.course}
									</p>
								</div>

								<div className='space-y-1.5'>
									<p className='text-[10px] font-bold uppercase tracking-wider text-muted-foreground'>
										Tillar
									</p>
									<div className='flex flex-wrap gap-2 pt-1'>
										{mentor.languages && mentor.languages.length > 0 ? (
											mentor.languages.map((lang, idx) => (
												<Badge
													key={idx}
													variant='secondary'
													className='font-medium bg-muted hover:bg-muted/80 gap-1.5'
												>
													<Languages className='h-3 w-3 text-muted-foreground' />
													{lang.name}{' '}
													{lang.level && (
														<span className='opacity-50'>({lang.level})</span>
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
						<Card className='shadow-sm border-muted h-full flex flex-col'>
							<CardHeader className='pb-4 border-b bg-muted/20'>
								<CardTitle className='text-base flex items-center gap-2 font-bold'>
									<Calendar className='h-4 w-4 text-primary' /> Dars vaqtlari
								</CardTitle>
							</CardHeader>
							<CardContent className='pt-5'>
								<div className='space-y-2'>
									{mentor.schedule && mentor.schedule.length > 0 ? (
										mentor.schedule.map((item, idx) => (
											<div
												key={idx}
												className='flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-transparent hover:border-border transition-colors'
											>
												<div className='flex items-center gap-2'>
													<div className='h-2 w-2 rounded-full bg-primary/50' />
													<span className='text-sm font-bold'>{item.day}</span>
												</div>
												<Badge
													variant='outline'
													className='text-xs font-mono font-bold bg-background shadow-sm'
												>
													{item.from} - {item.to}
												</Badge>
											</div>
										))
									) : (
										<div className='text-sm text-muted-foreground text-center py-6 bg-muted/20 rounded-xl border border-dashed'>
											Hozircha bo'sh
										</div>
									)}
								</div>
							</CardContent>
						</Card>
					</motion.div>
				</div>

				{/* MAIN CONTENT AREA */}
				<div className='lg:col-span-8 space-y-6'>
					{/* About & Skills */}
					<motion.div variants={itemVars}>
						<Card className='shadow-sm border-muted'>
							<CardContent className='p-6 sm:p-8 space-y-8'>
								{/* About */}
								<div className='space-y-3'>
									<h3 className='text-lg font-bold flex items-center gap-2 border-b pb-2'>
										<Users className='h-4 w-4 text-primary' /> Mentor haqida
									</h3>
									<div className='text-muted-foreground text-sm sm:text-base leading-relaxed whitespace-pre-wrap'>
										{mentor.about || (
											<span className='italic'>
												Mentor o'zi haqida batafsil ma'lumot kiritmagan.
											</span>
										)}
									</div>
								</div>

								{/* Skills */}
								<div className='space-y-3'>
									<h3 className='text-lg font-bold flex items-center gap-2 border-b pb-2'>
										<CheckCircle2 className='h-4 w-4 text-primary' /> Texnik
										ko'nikmalar
									</h3>
									<div className='flex flex-wrap gap-2 pt-1'>
										{mentor.skills && mentor.skills.length > 0 ? (
											mentor.skills.map((skill, idx) => (
												<Badge
													key={idx}
													variant='secondary'
													className='px-3.5 py-1.5 rounded-lg font-medium text-sm'
												>
													{skill}
												</Badge>
											))
										) : (
											<p className='text-sm text-muted-foreground italic'>
												Ma'lumotlar yo'q
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
							<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 px-1'>
								<h3 className='text-lg font-bold flex items-center gap-2'>
									<BookOpen className='h-5 w-5 text-primary' /> Mentor Darslari
								</h3>
								<TabsList className='bg-muted/60 p-1 rounded-xl h-11 border'>
									<TabsTrigger
										value='upcoming'
										className='rounded-lg px-4 h-9 text-xs sm:text-sm font-semibold'
									>
										Kelgusi ({upcomingLessons.length})
									</TabsTrigger>
									<TabsTrigger
										value='past'
										className='rounded-lg px-4 h-9 text-xs sm:text-sm font-semibold'
									>
										Yakunlangan ({pastLessons.length})
									</TabsTrigger>
								</TabsList>
							</div>

							<TabsContent
								value='upcoming'
								className='mt-0 focus-visible:outline-none'
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
												className='col-span-full py-16 text-center bg-muted/10 rounded-2xl border border-dashed'
											>
												<div className='p-4 bg-muted inline-block rounded-full mb-3'>
													<Calendar className='h-8 w-8 text-muted-foreground opacity-50' />
												</div>
												<p className='font-medium text-foreground'>
													Hozircha darslar belgilanmagan
												</p>
											</motion.div>
										)}
									</AnimatePresence>
								</div>
							</TabsContent>

							<TabsContent
								value='past'
								className='mt-0 focus-visible:outline-none'
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
										<div className='col-span-full py-12 text-center bg-muted/10 rounded-2xl border border-dashed'>
											<p className='text-muted-foreground text-sm font-medium'>
												Yakunlangan darslar yo'q
											</p>
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

// --- LESSON CARD COMPONENT ---
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
					'overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col group',
					isPast ? 'bg-muted/30 border-transparent' : 'border-muted bg-card',
				)}
			>
				{/* Card Header Image/Color */}
				<div className='h-28 bg-muted relative overflow-hidden shrink-0'>
					{lesson.image ? (
						<img
							src={lesson.image}
							alt={lesson.title}
							className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
						/>
					) : (
						<div className='absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center'>
							<BookOpen className='w-8 h-8 text-primary/30' />
						</div>
					)}
					<Badge
						className={cn(
							'absolute top-3 right-3 shadow-sm font-bold capitalize text-[10px]',
							lesson.status === 'live'
								? 'bg-red-500 text-white animate-pulse border-none'
								: 'bg-background text-foreground',
						)}
					>
						{lesson.format}
					</Badge>
				</div>

				{/* Card Content */}
				<CardContent className='p-4 flex-1 flex flex-col justify-between gap-4'>
					<div className='space-y-3'>
						<h4
							className={cn(
								'font-bold text-base leading-tight line-clamp-2',
								isPast && 'text-muted-foreground',
							)}
						>
							{lesson.title}
						</h4>
						<div className='flex flex-wrap gap-3 text-xs font-semibold text-muted-foreground'>
							<span className='flex items-center gap-1.5'>
								<Calendar className='h-3.5 w-3.5 text-primary' /> {lesson.date}
							</span>
							<span className='flex items-center gap-1.5'>
								<Clock className='h-3.5 w-3.5 text-primary' /> {lesson.time}
							</span>
							<span className='flex items-center gap-1.5'>
								<Users className='h-3.5 w-3.5 text-primary' />{' '}
								{lesson.studentsCount || 0}
							</span>
						</div>
					</div>

					{/* Action Button */}
					{!isPast && (
						<Button
							size='sm'
							variant={lesson.isRegistered ? 'secondary' : 'default'}
							onClick={onToggleEnroll}
							disabled={actionLoading}
							className={cn(
								'w-full rounded-xl font-bold h-10 transition-colors',
								lesson.isRegistered
									? 'bg-muted hover:bg-destructive hover:text-destructive-foreground'
									: 'shadow-sm',
							)}
						>
							{lesson.isRegistered ? (
								<>
									<CheckCircle2 className='h-4 w-4 mr-2 text-emerald-500 group-hover:hidden' />
									<span className='group-hover:hidden'>Yozilgansiz</span>
									<span className='hidden group-hover:inline'>
										Bekor qilish
									</span>
								</>
							) : (
								<>
									<PlusCircle className='h-4 w-4 mr-2' /> Darsga yozilish
								</>
							)}
						</Button>
					)}
				</CardContent>
			</Card>
		</motion.div>
	)
}
