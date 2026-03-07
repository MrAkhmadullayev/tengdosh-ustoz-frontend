'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import api from '@/lib/api'
import { motion } from 'framer-motion'
import {
	ArrowLeft,
	BookOpen,
	Briefcase,
	Calendar,
	CheckCircle2,
	Clock,
	Languages,
	Phone,
	Play,
	Search,
	Send,
	Star,
	User as UserIcon,
	Users,
	XCircle,
} from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

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

const LESSON_TABS = [
	{
		key: 'upcoming',
		label: 'Keladigan darslar',
		icon: <Calendar className='h-4 w-4' />,
	},
	{ key: 'live', label: 'Jonli darslar', icon: <Play className='h-4 w-4' /> },
	{
		key: 'completed',
		label: "O'tgan darslar",
		icon: <CheckCircle2 className='h-4 w-4' />,
	},
]

export default function MentorViewPage() {
	const params = useParams()
	const router = useRouter()
	const { id } = params
	const [mentor, setMentor] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [lessonTab, setLessonTab] = useState('upcoming')
	const [followerSearch, setFollowerSearch] = useState('')
	const [showAllFollowers, setShowAllFollowers] = useState(false)

	useEffect(() => {
		const fetchMentor = async () => {
			try {
				const res = await api.get(`/admin/mentors/${id}`)
				if (res?.data?.success) {
					setMentor(res.data.mentor)
				} else {
					setError("Mentor ma'lumotlarini yuklashda xatolik")
				}
			} catch (err) {
				console.error(err)
				setError(err.response?.data?.message || 'Server xatosi')
			} finally {
				setLoading(false)
			}
		}
		if (id) fetchMentor()
	}, [id])

	const filteredLessons = useMemo(() => {
		if (!mentor?.lessons) return []
		return mentor.lessons.filter(l => l.status === lessonTab)
	}, [mentor?.lessons, lessonTab])

	const lessonCounts = useMemo(() => {
		if (!mentor?.lessons) return { upcoming: 0, live: 0, completed: 0 }
		return {
			upcoming: mentor.lessons.filter(l => l.status === 'upcoming').length,
			live: mentor.lessons.filter(l => l.status === 'live').length,
			completed: mentor.lessons.filter(l => l.status === 'completed').length,
		}
	}, [mentor?.lessons])

	const filteredFollowers = useMemo(() => {
		if (!mentor?.followers) return []
		return mentor.followers.filter(f => {
			const fullName = `${f.firstName || ''} ${f.lastName || ''}`.toLowerCase()
			return (
				fullName.includes(followerSearch.toLowerCase()) ||
				(f.phoneNumber || '').includes(followerSearch)
			)
		})
	}, [mentor?.followers, followerSearch])

	const visibleFollowers = showAllFollowers
		? filteredFollowers
		: filteredFollowers.slice(0, 2)

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
					<Skeleton className='h-[450px] rounded-xl' />
					<div className='lg:col-span-2 space-y-6'>
						<Skeleton className='h-[180px] rounded-xl' />
						<Skeleton className='h-[180px] rounded-xl' />
					</div>
				</div>
				<Skeleton className='h-[200px] rounded-xl' />
				<Skeleton className='h-[300px] rounded-xl' />
			</div>
		)
	}

	if (error || !mentor) {
		return (
			<div className='flex flex-col items-center justify-center h-[50vh] text-center space-y-4'>
				<div className='bg-red-50 text-red-500 p-4 rounded-full'>
					<XCircle className='h-10 w-10' />
				</div>
				<h2 className='text-2xl font-bold'>Xatolik yuz berdi</h2>
				<p className='text-muted-foreground'>{error}</p>
				<Button onClick={() => router.push('/admin/mentors')} variant='outline'>
					<ArrowLeft className='mr-2 h-4 w-4' /> Ortga qaytish
				</Button>
			</div>
		)
	}

	const hasResume = mentor.isResumeCompleted

	return (
		<motion.div
			variants={containerVariants}
			initial='hidden'
			animate='show'
			className='max-w-6xl mx-auto space-y-6 pb-12'
		>
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
							Mentor Profili
						</h1>
						<p className='text-sm text-muted-foreground font-medium'>
							{mentor.firstName} {mentor.lastName}
						</p>
					</div>
				</div>
				<div className='flex items-center gap-3 flex-wrap'>
					<Badge
						variant={mentor.status === 'active' ? 'default' : 'destructive'}
						className='px-3 py-1 shadow-sm'
					>
						{mentor.status === 'active' ? 'Faol' : 'Bloklangan'}
					</Badge>
					<Badge
						variant={mentor.isMentor ? 'default' : 'secondary'}
						className={
							mentor.isMentor
								? 'bg-green-500 hover:bg-green-600 px-3 py-1 text-white border-transparent'
								: 'px-3 py-1'
						}
					>
						{mentor.isMentor ? 'Tasdiqlangan Mentor' : 'Tasdiq Kutilmoqda'}
					</Badge>
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
									Reyting
								</p>
								<p className='text-xl font-bold'>
									{mentor.rating > 0 ? mentor.rating : '-'}
								</p>
								<p className='text-[10px] text-muted-foreground'>
									{mentor.ratingCount > 0
										? `${mentor.ratingCount} ta baho`
										: 'Hali baholanmagan'}
								</p>
							</div>
						</CardContent>
					</Card>
				</motion.div>

				<motion.div variants={itemVariants}>
					<Card className='border-muted shadow-sm'>
						<CardContent className='p-5 flex items-center gap-4'>
							<div className='bg-blue-500/10 p-3 rounded-xl shrink-0'>
								<Users className='h-5 w-5 text-blue-500' />
							</div>
							<div>
								<p className='text-xs text-muted-foreground font-medium'>
									Talabalar
								</p>
								<p className='text-xl font-bold'>
									{mentor.followersCount || 0}
								</p>
								<p className='text-[10px] text-muted-foreground'>
									Obunachi (follower)
								</p>
							</div>
						</CardContent>
					</Card>
				</motion.div>

				<motion.div variants={itemVariants}>
					<Card className='border-muted shadow-sm'>
						<CardContent className='p-5 flex items-center gap-4'>
							<div className='bg-green-500/10 p-3 rounded-xl shrink-0'>
								<BookOpen className='h-5 w-5 text-green-500' />
							</div>
							<div>
								<p className='text-xs text-muted-foreground font-medium'>
									Jami darslar
								</p>
								<p className='text-xl font-bold'>
									{mentor.lessons?.length || 0}
								</p>
								<p className='text-[10px] text-muted-foreground'>
									Barcha darslar
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
								<p className='text-xl font-bold'>{mentor.experience || '-'}</p>
								<p className='text-[10px] text-muted-foreground'>
									yillik tajriba
								</p>
							</div>
						</CardContent>
					</Card>
				</motion.div>
			</motion.div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				<motion.div variants={itemVariants} className='lg:col-span-1'>
					<Card className='border-none shadow-md overflow-hidden bg-card h-full'>
						<div className='h-32 bg-gradient-to-r from-blue-600 to-primary w-full relative'></div>
						<CardContent className='pt-0 flex flex-col items-center px-6 relative'>
							<Avatar className='h-28 w-28 border-4 border-background shadow-lg -mt-14 mb-4 ring-2 ring-primary/20 bg-background'>
								<AvatarFallback className='text-4xl font-bold bg-primary/10 text-primary'>
									{mentor.firstName?.[0] || ''}
									{mentor.lastName?.[0] || ''}
								</AvatarFallback>
							</Avatar>
							<h2 className='text-2xl font-bold text-center tracking-tight'>
								{mentor.firstName} {mentor.lastName}
							</h2>
							<p className='text-primary font-medium mt-1 text-center'>
								{mentor.specialty || mentor.course || "Yo'nalish kiritilmagan"}
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
											{mentor.group || '-'}
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
										{mentor.phoneNumber ? (
											<a
												href={`tel:${mentor.phoneNumber}`}
												className='font-medium text-primary hover:underline leading-none block'
											>
												{formatPhone(mentor.phoneNumber)}
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
										{mentor.username ? (
											<a
												href={`https://t.me/${mentor.username}`}
												target='_blank'
												rel='noopener noreferrer'
												className='font-medium text-blue-500 hover:underline leading-none block'
											>
												@{mentor.username}
											</a>
										) : (
											<p className='font-medium text-muted-foreground leading-none'>
												Ulanmagan
											</p>
										)}
									</div>
								</div>
								<div className='flex items-center gap-3 text-sm'>
									<div className='bg-muted p-2 rounded-md shrink-0'>
										<CheckCircle2 className='h-4 w-4 text-muted-foreground' />
									</div>
									<div className='flex-1'>
										<p className='text-xs text-muted-foreground mb-1'>
											Rezyume holati
										</p>
										<div className='leading-none'>
											{hasResume ? (
												<Badge
													variant='outline'
													className='text-green-600 border-green-200 bg-green-50'
												>
													To'ldirilgan
												</Badge>
											) : (
												<Badge
													variant='outline'
													className='text-orange-600 border-orange-200 bg-orange-50'
												>
													To'ldirilmagan
												</Badge>
											)}
										</div>
									</div>
								</div>
							</div>
							<div className='w-full pt-5 text-center'>
								<p className='text-xs text-muted-foreground mb-1'>
									Qo'shilgan sana
								</p>
								<p className='font-semibold text-sm'>
									{formatUzDate(mentor.createdAt)}
								</p>
							</div>
						</CardContent>
					</Card>
				</motion.div>

				<div className='lg:col-span-2 space-y-6 flex flex-col'>
					{!hasResume ? (
						<motion.div variants={itemVariants} className='flex-1'>
							<Card className='border-dashed border-2 shadow-none bg-muted/10 h-full flex flex-col items-center justify-center p-12 text-center text-muted-foreground'>
								<UserIcon className='h-16 w-16 mb-4 opacity-30' />
								<h3 className='text-xl font-semibold text-foreground mb-2'>
									Rezyume hali to'ldirilmagan
								</h3>
								<p className='max-w-md'>
									Ushbu foydalanuvchi tizimga kirgan, lekin o'zining
									mutaxassisligi, tajribasi va dars jadvali to'g'risidagi
									so'rovnomani to'ldirib yubormagan.
								</p>
							</Card>
						</motion.div>
					) : (
						<>
							<motion.div variants={itemVariants}>
								<Card className='shadow-sm border-muted'>
									<CardHeader className='pb-3 border-b'>
										<CardTitle className='text-lg'>
											Ustoz haqida (Biografiya)
										</CardTitle>
									</CardHeader>
									<CardContent className='p-5 space-y-4'>
										<div>
											<h4 className='text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1'>
												Tajribasi
											</h4>
											<p className='text-foreground font-semibold text-base'>
												{mentor.experience} yil
											</p>
										</div>
										<Separator />
										<div>
											<h4 className='text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2'>
												Batafsil ma'lumot
											</h4>
											<p className='text-muted-foreground font-medium text-sm leading-relaxed whitespace-pre-wrap'>
												{mentor.about}
											</p>
										</div>
									</CardContent>
								</Card>
							</motion.div>

							<motion.div
								variants={itemVariants}
								className='grid grid-cols-1 md:grid-cols-2 gap-6 flex-1'
							>
								<Card className='shadow-sm border-muted flex flex-col'>
									<CardHeader className='pb-3 border-b'>
										<CardTitle className='text-base flex items-center gap-2'>
											<Languages className='h-4 w-4 text-primary' /> Tillarni
											bilishi
										</CardTitle>
									</CardHeader>
									<CardContent className='p-5 flex-1'>
										<div className='flex flex-wrap gap-2'>
											{mentor.languages?.length > 0 ? (
												mentor.languages.map((lang, index) => (
													<Badge
														key={index}
														variant='secondary'
														className='flex items-center gap-1.5 py-1.5 px-3 bg-secondary/40'
													>
														<span className='font-semibold'>{lang.lang}</span>
														<span className='text-[10px] text-muted-foreground border-l pl-1.5 border-border'>
															{lang.level}
														</span>
														{lang.isNative && (
															<span className='text-[10px] text-green-600 bg-green-100 px-1 rounded ml-1'>
																Ona tili
															</span>
														)}
													</Badge>
												))
											) : (
												<span className='text-sm text-muted-foreground italic'>
													Tillar belgilanmagan
												</span>
											)}
										</div>
									</CardContent>
								</Card>

								<Card className='shadow-sm border-muted flex flex-col'>
									<CardHeader className='pb-3 border-b'>
										<CardTitle className='text-base flex items-center gap-2'>
											<Briefcase className='h-4 w-4 text-primary' /> Texnik
											ko'nikmalar
										</CardTitle>
									</CardHeader>
									<CardContent className='p-5 flex-1'>
										<div className='flex flex-wrap gap-2'>
											{mentor.skills?.length > 0 ? (
												mentor.skills.map((skill, index) => (
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
						</>
					)}
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
							{mentor.schedule?.length > 0 && hasResume ? (
								mentor.schedule.map((time, index) => (
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

			<motion.div variants={itemVariants} className='w-full'>
				<Card className='shadow-sm border-muted w-full'>
					<CardHeader className='border-b flex flex-col sm:flex-row justify-between sm:items-center gap-4'>
						<CardTitle className='text-lg flex items-center gap-2'>
							<Users className='h-5 w-5 text-blue-500' /> Talabalar
							(Followerlar)
							{mentor.followersCount > 0 && (
								<Badge variant='secondary' className='text-xs ml-2'>
									{mentor.followersCount} ta
								</Badge>
							)}
						</CardTitle>
						<div className='relative w-full sm:w-64'>
							<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
							<Input
								placeholder='Ism yoki raqam...'
								className='pl-9 h-9 text-sm bg-background'
								value={followerSearch}
								onChange={e => setFollowerSearch(e.target.value)}
							/>
						</div>
					</CardHeader>
					<CardContent className='p-5'>
						{filteredFollowers.length > 0 ? (
							<div className='space-y-3'>
								{visibleFollowers.map((f, i) => (
									<div
										key={f.id || i}
										className='flex items-center justify-between p-3 rounded-xl border bg-muted/20 hover:bg-muted/40 transition-colors'
									>
										<div className='flex items-center gap-3'>
											<Avatar className='h-10 w-10 border'>
												<AvatarFallback className='bg-blue-500/10 text-blue-600 text-xs font-bold'>
													{(f.firstName?.[0] || '') + (f.lastName?.[0] || '')}
												</AvatarFallback>
											</Avatar>
											<div>
												<p className='font-semibold text-sm leading-none mb-1'>
													{f.firstName} {f.lastName}
												</p>
												{f.phoneNumber && (
													<a
														href={`tel:${f.phoneNumber}`}
														className='text-xs text-muted-foreground hover:text-primary transition-colors'
													>
														{formatPhone(f.phoneNumber)}
													</a>
												)}
											</div>
										</div>
										<Badge variant='outline' className='text-[10px] capitalize'>
											{f.role === 'student'
												? 'Talaba'
												: f.role === 'mentor'
													? 'Mentor'
													: f.role}
										</Badge>
									</div>
								))}
								{filteredFollowers.length > 2 && (
									<Button
										variant='ghost'
										className='w-full mt-2 text-sm text-muted-foreground hover:text-foreground'
										onClick={() => setShowAllFollowers(!showAllFollowers)}
									>
										{showAllFollowers
											? "Kamroq ko'rsatish"
											: `Yana ${filteredFollowers.length - 2} ta o'quvchini ko'rish`}
									</Button>
								)}
							</div>
						) : (
							<div className='text-center py-8 text-muted-foreground'>
								<Users className='h-10 w-10 mx-auto mb-3 opacity-30' />
								<p className='text-sm'>Natija topilmadi</p>
							</div>
						)}
					</CardContent>
				</Card>
			</motion.div>

			<motion.div variants={itemVariants} className='w-full'>
				<Card className='shadow-sm border-muted w-full'>
					<CardHeader className='border-b'>
						<div className='flex flex-col sm:flex-row justify-between sm:items-center gap-4'>
							<CardTitle className='text-lg flex items-center gap-2'>
								<BookOpen className='h-5 w-5 text-green-500' /> Mentor darslari
							</CardTitle>
							<div className='flex flex-wrap gap-2'>
								{LESSON_TABS.map(tab => (
									<Button
										key={tab.key}
										variant={lessonTab === tab.key ? 'default' : 'outline'}
										size='sm'
										className='gap-2 text-xs h-9'
										onClick={() => setLessonTab(tab.key)}
									>
										{tab.icon}
										{tab.label}
										{lessonCounts[tab.key] > 0 && (
											<Badge
												variant={
													lessonTab === tab.key ? 'secondary' : 'outline'
												}
												className='text-[10px] ml-1 px-1.5'
											>
												{lessonCounts[tab.key]}
											</Badge>
										)}
									</Button>
								))}
							</div>
						</div>
					</CardHeader>
					<CardContent className='p-5'>
						{filteredLessons.length > 0 ? (
							<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
								{filteredLessons.map(lesson => (
									<Link
										key={lesson.id || lesson._id}
										href={
											lesson.status === 'live'
												? `/admin/lessons/${lesson.id || lesson._id}/watch`
												: `/admin/lessons/${lesson.id || lesson._id}/view`
										}
										className='block h-full'
									>
										<div className='p-4 h-full flex flex-col justify-between rounded-xl border hover:border-primary/40 hover:bg-muted/30 hover:shadow-sm transition-all cursor-pointer group'>
											<div className='flex items-start justify-between gap-3 mb-3'>
												<h4 className='font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2'>
													{lesson.title}
												</h4>
												<div className='flex flex-col items-end gap-1.5 shrink-0'>
													<Badge
														variant={
															lesson.status === 'live'
																? 'destructive'
																: lesson.status === 'upcoming'
																	? 'default'
																	: 'secondary'
														}
														className='text-[10px] uppercase whitespace-nowrap'
													>
														{lesson.status === 'live'
															? '🔴 Jonli'
															: lesson.status === 'upcoming'
																? 'Kutilmoqda'
																: 'Yakunlangan'}
													</Badge>
												</div>
											</div>
											<div className='mt-auto space-y-3'>
												{lesson.description && (
													<p className='text-xs text-muted-foreground line-clamp-2'>
														{lesson.description}
													</p>
												)}
												<div className='flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground pt-3 border-t'>
													<div className='flex items-center gap-3'>
														<span className='flex items-center gap-1 font-medium'>
															<Calendar className='h-3.5 w-3.5' />
															{formatUzDate(lesson.date).split(',')[0]}
														</span>
														<span className='flex items-center gap-1 font-medium'>
															<Clock className='h-3.5 w-3.5' />
															{lesson.time}
														</span>
													</div>
													<Badge
														variant='outline'
														className='text-[10px] font-medium bg-background'
													>
														{lesson.format === 'online'
															? '🌐 Online'
															: lesson.format === 'offline'
																? '🏢 Offline'
																: '🔄 Hybrid'}
													</Badge>
												</div>
											</div>
										</div>
									</Link>
								))}
							</div>
						) : (
							<div className='text-center py-10 text-muted-foreground'>
								<BookOpen className='h-10 w-10 mx-auto mb-3 opacity-30' />
								<p className='text-sm font-medium'>
									{lessonTab === 'upcoming'
										? "Keladigan darslar yo'q"
										: lessonTab === 'live'
											? "Hozir jonli dars yo'q"
											: "O'tgan darslar yo'q"}
								</p>
							</div>
						)}
					</CardContent>
				</Card>
			</motion.div>
		</motion.div>
	)
}
