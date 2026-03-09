'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import api from '@/lib/api'
import { useTranslation } from '@/lib/i18n'
import {
	formatPhone,
	formatUzDate,
	getErrorMessage,
	getInitials,
} from '@/lib/utils'
import { motion } from 'framer-motion'
import {
	ArrowLeft,
	BookOpen,
	Briefcase,
	Calendar,
	CheckCircle2,
	Clock,
	Edit,
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

// ==========================================
// 🎨 ANIMATSIYALAR
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
export default function MentorViewPage() {
	const { id } = useParams()
	const router = useRouter()
	const { t } = useTranslation()

	// State'lar
	const [mentor, setMentor] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [lessonTab, setLessonTab] = useState('upcoming')
	const [followerSearch, setFollowerSearch] = useState('')
	const [showAllFollowers, setShowAllFollowers] = useState(false)

	// Dars turlari (i18n ga ulangan holda)
	const LESSON_TABS = useMemo(
		() => [
			{
				key: 'upcoming',
				label: t('mentors.upcomingLessons') || 'Keladigan darslar',
				icon: Calendar,
			},
			{
				key: 'live',
				label: t('mentors.liveLessons') || 'Jonli darslar',
				icon: Play,
			},
			{
				key: 'completed',
				label: t('mentors.completedLessons') || "O'tgan darslar",
				icon: CheckCircle2,
			},
		],
		[t],
	)

	// 1. API dan Mentor ma'lumotlarini yuklash
	useEffect(() => {
		const fetchMentor = async () => {
			try {
				const res = await api.get(`/admin/mentors/${id}`)
				if (res?.data?.success) {
					setMentor(res.data.mentor)
				} else {
					setError(
						t('errors.notFound') || "Mentor ma'lumotlarini yuklashda xatolik",
					)
				}
			} catch (err) {
				setError(
					getErrorMessage(err, t('errors.serverError') || 'Server xatosi'),
				)
			} finally {
				setLoading(false)
			}
		}
		if (id) fetchMentor()
	}, [id, t])

	// 2. Mantiqiy hisob-kitoblar (useMemo bilan tezlashtirilgan)
	const filteredLessons = useMemo(() => {
		return mentor?.lessons?.filter(l => l.status === lessonTab) || []
	}, [mentor?.lessons, lessonTab])

	const lessonCounts = useMemo(() => {
		const counts = { upcoming: 0, live: 0, completed: 0 }
		if (!mentor?.lessons) return counts
		mentor.lessons.forEach(l => {
			if (counts[l.status] !== undefined) counts[l.status]++
		})
		return counts
	}, [mentor?.lessons])

	const filteredFollowers = useMemo(() => {
		if (!mentor?.followers) return []
		const search = followerSearch.toLowerCase().trim()
		if (!search) return mentor.followers

		return mentor.followers.filter(f => {
			const fullName = `${f.firstName || ''} ${f.lastName || ''}`.toLowerCase()
			return fullName.includes(search) || (f.phoneNumber || '').includes(search)
		})
	}, [mentor?.followers, followerSearch])

	const visibleFollowers = showAllFollowers
		? filteredFollowers
		: filteredFollowers.slice(0, 3)
	const hasResume = Boolean(mentor?.isResumeCompleted)

	// 3. UI: Yuklanish holati (SKELETON)
	if (loading) {
		return (
			<div className='max-w-6xl mx-auto space-y-6 pb-12 animate-pulse pt-4'>
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
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6'>
					<Skeleton className='h-[450px] rounded-xl' />
					<div className='lg:col-span-2 space-y-6'>
						<Skeleton className='h-[200px] rounded-xl' />
						<Skeleton className='h-[200px] rounded-xl' />
					</div>
				</div>
				<Skeleton className='h-[200px] rounded-xl mb-6' />
				<Skeleton className='h-[300px] rounded-xl' />
			</div>
		)
	}

	// 4. UI: Xatolik holati
	if (error || !mentor) {
		return (
			<div className='flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4'>
				<div className='bg-destructive/10 text-destructive p-5 rounded-full'>
					<XCircle className='h-12 w-12' />
				</div>
				<h2 className='text-2xl font-bold'>
					{t('errors.errorOccurred') || 'Xatolik yuz berdi'}
				</h2>
				<p className='text-muted-foreground max-w-md'>{error}</p>
				<Button
					onClick={() => router.push('/admin/mentors')}
					variant='outline'
					className='mt-4'
				>
					<ArrowLeft className='mr-2 h-4 w-4' />{' '}
					{t('common.goBack') || 'Ortga qaytish'}
				</Button>
			</div>
		)
	}

	// 5. UI: ASOSIY SAHIFA
	return (
		<motion.div
			variants={containerVariants}
			initial='hidden'
			animate='show'
			className='max-w-6xl mx-auto space-y-6 pb-12 pt-2'
		>
			{/* 🏷️ Tepa qism (Header & Actions) */}
			<motion.div
				variants={itemVariants}
				className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4'
			>
				<div className='flex items-center gap-4'>
					<Button
						variant='outline'
						size='icon'
						className='h-10 w-10 rounded-full shrink-0 shadow-sm'
						onClick={() => router.push('/admin/mentors')}
					>
						<ArrowLeft className='h-5 w-5' />
					</Button>
					<div>
						<h1 className='text-2xl font-bold tracking-tight'>
							{t('mentors.profileTitle') || 'Mentor Profili'}
						</h1>
						<p className='text-sm text-muted-foreground font-medium'>
							{mentor.firstName} {mentor.lastName}
						</p>
					</div>
				</div>
				<div className='flex items-center gap-3 flex-wrap'>
					<Badge
						variant={mentor.status === 'active' ? 'default' : 'destructive'}
						className='px-3 py-1 shadow-sm text-sm'
					>
						{mentor.status === 'active'
							? t('common.active') || 'Faol'
							: t('common.blocked') || 'Bloklangan'}
					</Badge>
					<Badge
						variant={mentor.isMentor ? 'default' : 'secondary'}
						className={`px-3 py-1 text-sm shadow-sm ${mentor.isMentor ? 'bg-green-500 hover:bg-green-600 text-white border-none' : ''}`}
					>
						{mentor.isMentor
							? t('mentors.approvedMentor') || 'Tasdiqlangan Mentor'
							: t('mentors.pendingApproval') || 'Tasdiq Kutilmoqda'}
					</Badge>
					{/* Senior UX: To'g'ridan-to'g'ri tahrirlashga o'tish tugmasi */}
					<Button
						variant='outline'
						size='sm'
						className='ml-2 hidden sm:flex'
						onClick={() => router.push(`/admin/mentors/${id}/edit`)}
					>
						<Edit className='h-4 w-4 mr-2' /> {t('common.edit') || 'Tahrirlash'}
					</Button>
				</div>
			</motion.div>

			{/* 📊 Statistika Kartalari */}
			<motion.div
				variants={containerVariants}
				className='grid grid-cols-2 sm:grid-cols-4 gap-4'
			>
				{[
					{
						title: t('mentors.rating') || 'Reyting',
						value: mentor.rating || '-',
						sub: mentor.ratingCount
							? `${mentor.ratingCount} ta baho`
							: 'Hali baholanmagan',
						icon: Star,
						color: 'text-yellow-500',
						bg: 'bg-yellow-500/10',
					},
					{
						title: t('mentors.students') || 'Talabalar',
						value: mentor.followersCount || 0,
						sub: 'Obunachi (follower)',
						icon: Users,
						color: 'text-blue-500',
						bg: 'bg-blue-500/10',
					},
					{
						title: t('mentors.totalLessons') || 'Jami darslar',
						value: mentor.lessons?.length || 0,
						sub: 'Barcha darslar',
						icon: BookOpen,
						color: 'text-green-500',
						bg: 'bg-green-500/10',
					},
					{
						title: t('mentors.experience') || 'Tajriba',
						value: mentor.experience || '-',
						sub: 'yillik tajriba',
						icon: Briefcase,
						color: 'text-purple-500',
						bg: 'bg-purple-500/10',
					},
				].map((stat, idx) => (
					<motion.div key={idx} variants={itemVariants}>
						<Card className='border-border shadow-sm h-full hover:shadow-md transition-shadow bg-card'>
							<CardContent className='p-5 flex items-center gap-4 h-full'>
								<div className={`${stat.bg} p-3 rounded-xl shrink-0`}>
									<stat.icon
										className={`h-5 w-5 ${stat.color} ${stat.icon === Star && mentor.rating > 0 ? 'fill-yellow-500 dark:fill-yellow-400' : ''}`}
									/>
								</div>
								<div>
									<p className='text-xs text-muted-foreground font-medium'>
										{stat.title}
									</p>
									<p className='text-xl font-bold'>{stat.value}</p>
									<p className='text-[10px] text-muted-foreground'>
										{stat.sub}
									</p>
								</div>
							</CardContent>
						</Card>
					</motion.div>
				))}
			</motion.div>

			{/* 🗂️ Asosiy ma'lumotlar qismi */}
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* CHAP PANEL: Shaxsiy vizitka */}
				<motion.div variants={itemVariants} className='lg:col-span-1'>
					<Card className='border-border shadow-sm overflow-hidden bg-card h-full'>
						<div className='h-32 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-900 w-full' />
						<CardContent className='pt-0 flex flex-col items-center px-6 relative'>
							<Avatar className='h-28 w-28 border-4 border-background shadow-lg -mt-14 mb-4 ring-2 ring-primary/10 bg-muted'>
								<AvatarFallback className='text-4xl font-bold bg-primary/10 text-primary'>
									{getInitials(mentor.firstName, mentor.lastName)}
								</AvatarFallback>
							</Avatar>
							<h2 className='text-2xl font-bold text-center tracking-tight'>
								{mentor.firstName} {mentor.lastName}
							</h2>
							<p className='text-primary font-medium mt-1 text-center'>
								{mentor.specialty || mentor.course || t('common.notEntered')}
							</p>

							<div className='w-full space-y-4 py-6 border-b border-border mt-2'>
								{[
									{
										icon: Briefcase,
										label: t('mentors.group') || 'Guruh',
										value: mentor.group || '-',
									},
									{
										icon: Phone,
										label: t('mentors.phone') || 'Telefon raqam',
										value: mentor.phoneNumber ? (
											<a
												href={`tel:${mentor.phoneNumber.replace(/\D/g, '')}`}
												className='text-primary hover:underline font-medium block'
											>
												{formatPhone(mentor.phoneNumber)}
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
										value: mentor.username ? (
											<a
												href={`https://t.me/${mentor.username}`}
												target='_blank'
												rel='noopener noreferrer'
												className='text-blue-500 hover:underline font-medium block'
											>
												@{mentor.username}
											</a>
										) : (
											'Ulanmagan'
										),
									},
									{
										icon: CheckCircle2,
										label: 'Rezyume holati',
										value: hasResume ? (
											<Badge className='bg-green-500/15 text-green-700 dark:text-green-400 border-none shadow-none font-medium text-[10px] uppercase'>
												To'ldirilgan
											</Badge>
										) : (
											<Badge
												variant='secondary'
												className='bg-orange-500/15 text-orange-700 dark:text-orange-400 border-none shadow-none font-medium text-[10px] uppercase'
											>
												To'ldirilmagan
											</Badge>
										),
									},
								].map((item, i) => (
									<div key={i} className='flex items-center gap-3 text-sm'>
										<div
											className={`${item.bg || 'bg-muted'} p-2 rounded-md shrink-0`}
										>
											<item.icon
												className={`h-4 w-4 ${item.color || 'text-muted-foreground'}`}
											/>
										</div>
										<div className='flex-1 min-w-0'>
											<p className='text-[11px] text-muted-foreground mb-0.5 uppercase tracking-wider font-semibold'>
												{item.label}
											</p>
											<div className='text-foreground truncate'>
												{item.value}
											</div>
										</div>
									</div>
								))}
							</div>
							<div className='w-full pt-5 text-center'>
								<p className='text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold'>
									Qo'shilgan sana
								</p>
								<p className='font-semibold text-sm'>
									{formatUzDate(mentor.createdAt)}
								</p>
							</div>
						</CardContent>
					</Card>
				</motion.div>

				{/* O'NG PANEL: Rezyume va Ko'nikmalar */}
				<div className='lg:col-span-2 space-y-6 flex flex-col'>
					{!hasResume ? (
						<motion.div variants={itemVariants} className='flex-1 h-full'>
							<Card className='border-dashed border-2 shadow-none bg-muted/10 h-full flex flex-col items-center justify-center p-12 text-center'>
								<UserIcon className='h-16 w-16 mb-4 text-muted-foreground/30' />
								<h3 className='text-xl font-semibold mb-2'>
									Rezyume to'ldirilmagan
								</h3>
								<p className='text-muted-foreground max-w-md text-sm'>
									Ushbu foydalanuvchi tizimga kirgan, lekin o'zining
									mutaxassisligi, tajribasi va dars jadvali to'g'risidagi
									so'rovnomani yakunlamagan.
								</p>
							</Card>
						</motion.div>
					) : (
						<>
							<motion.div variants={itemVariants}>
								<Card className='shadow-sm border-border bg-card'>
									<CardHeader className='pb-3 border-b bg-muted/20'>
										<CardTitle className='text-lg flex items-center gap-2'>
											<UserIcon className='h-5 w-5 text-primary' /> Ustoz haqida
											(Biografiya)
										</CardTitle>
									</CardHeader>
									<CardContent className='p-5'>
										<p className='text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap'>
											{mentor.about || (
												<span className='italic'>Ma'lumot kiritilmagan.</span>
											)}
										</p>
									</CardContent>
								</Card>
							</motion.div>

							<motion.div
								variants={itemVariants}
								className='grid grid-cols-1 md:grid-cols-2 gap-6 flex-1'
							>
								<Card className='shadow-sm border-border flex flex-col bg-card'>
									<CardHeader className='pb-3 border-b bg-muted/20'>
										<CardTitle className='text-base flex items-center gap-2'>
											<Languages className='h-4 w-4 text-primary' /> Tillarni
											bilishi
										</CardTitle>
									</CardHeader>
									<CardContent className='p-5 flex-1 flex flex-wrap gap-2 content-start'>
										{mentor.languages?.length > 0 ? (
											mentor.languages.map((lang, idx) => (
												<Badge
													key={idx}
													variant='secondary'
													className='px-3 py-1.5 bg-secondary/50 hover:bg-secondary/70 transition-colors border-transparent'
												>
													<span className='font-semibold'>{lang.lang}</span>
													<span className='text-[10px] text-muted-foreground border-l pl-1.5 ml-1.5 border-border/50'>
														{lang.level}
													</span>
													{lang.isNative && (
														<span className='text-[9px] text-green-700 dark:text-green-400 bg-green-500/10 px-1 rounded ml-1.5 uppercase tracking-wider font-bold'>
															Ona tili
														</span>
													)}
												</Badge>
											))
										) : (
											<span className='text-sm text-muted-foreground italic w-full text-center py-4'>
												Tillar belgilanmagan
											</span>
										)}
									</CardContent>
								</Card>

								<Card className='shadow-sm border-border flex flex-col bg-card'>
									<CardHeader className='pb-3 border-b bg-muted/20'>
										<CardTitle className='text-base flex items-center gap-2'>
											<Briefcase className='h-4 w-4 text-primary' /> Texnik
											ko'nikmalar
										</CardTitle>
									</CardHeader>
									<CardContent className='p-5 flex-1 flex flex-wrap gap-2 content-start'>
										{mentor.skills?.length > 0 ? (
											mentor.skills.map((skill, idx) => (
												<Badge
													key={idx}
													variant='outline'
													className='bg-primary/5 hover:bg-primary/10 border-primary/20 text-foreground py-1 px-3'
												>
													{skill}
												</Badge>
											))
										) : (
											<span className='text-sm text-muted-foreground italic w-full text-center py-4'>
												Ko'nikmalar belgilanmagan
											</span>
										)}
									</CardContent>
								</Card>
							</motion.div>
						</>
					)}
				</div>
			</div>

			{/* 📅 Bo'sh vaqtlar (Schedule) */}
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
							{mentor.schedule?.length > 0 && hasResume ? (
								mentor.schedule.map((time, index) => (
									<div
										key={index}
										className='bg-muted/30 border border-border/50 rounded-xl p-3 text-center flex flex-col justify-center gap-1.5 hover:border-primary/30 hover:bg-muted/50 transition-colors'
									>
										<p className='font-bold text-sm text-foreground'>
											{time.day}
										</p>
										<Badge
											variant='outline'
											className='bg-background font-mono text-xs text-muted-foreground mx-auto border-dashed shadow-sm'
										>
											{time.from} - {time.to}
										</Badge>
									</div>
								))
							) : (
								<div className='col-span-full text-center text-sm py-10 text-muted-foreground italic border border-dashed rounded-xl bg-muted/10'>
									<Clock className='h-8 w-8 mx-auto mb-2 opacity-20' />
									Dars jadvali kiritilmagan
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</motion.div>

			{/* 👥 Talabalar (Followers) */}
			<motion.div variants={itemVariants} className='w-full'>
				<Card className='shadow-sm border-border w-full bg-card'>
					<CardHeader className='border-b flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-muted/20'>
						<CardTitle className='text-lg flex items-center gap-2'>
							<Users className='h-5 w-5 text-blue-500' /> Talabalar
							(Followerlar)
							{mentor.followersCount > 0 && (
								<Badge
									variant='secondary'
									className='text-xs ml-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 border-none'
								>
									{mentor.followersCount} ta
								</Badge>
							)}
						</CardTitle>
						<div className='relative w-full sm:w-64'>
							<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
							<Input
								placeholder='Ism yoki raqam...'
								className='pl-9 h-9 text-sm bg-background shadow-sm border-muted'
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
										className='flex items-center justify-between p-3 rounded-xl border bg-muted/10 hover:bg-muted/30 transition-colors'
									>
										<div className='flex items-center gap-3'>
											<Avatar className='h-10 w-10 border shadow-sm'>
												<AvatarFallback className='bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold'>
													{getInitials(f.firstName, f.lastName)}
												</AvatarFallback>
											</Avatar>
											<div>
												<p className='font-semibold text-sm leading-none mb-1'>
													{f.firstName} {f.lastName}
												</p>
												{f.phoneNumber && (
													<a
														href={`tel:${f.phoneNumber.replace(/\D/g, '')}`}
														className='text-xs text-muted-foreground hover:text-primary transition-colors font-medium'
													>
														{formatPhone(f.phoneNumber)}
													</a>
												)}
											</div>
										</div>
										<Badge
											variant='outline'
											className='text-[10px] uppercase font-bold tracking-wider bg-background shadow-sm'
										>
											{f.role === 'student'
												? 'Talaba'
												: f.role === 'mentor'
													? 'Mentor'
													: f.role}
										</Badge>
									</div>
								))}
								{filteredFollowers.length > 3 && (
									<Button
										variant='ghost'
										className='w-full mt-3 text-sm text-primary hover:text-primary hover:bg-primary/5 border border-transparent hover:border-primary/10'
										onClick={() => setShowAllFollowers(!showAllFollowers)}
									>
										{showAllFollowers
											? "Kamroq ko'rsatish"
											: `Yana ${filteredFollowers.length - 3} ta o'quvchini ko'rish`}
									</Button>
								)}
							</div>
						) : (
							<div className='text-center py-10 text-muted-foreground bg-muted/10 rounded-xl border border-dashed'>
								<Users className='h-10 w-10 mx-auto mb-3 opacity-20' />
								<p className='text-sm font-medium'>
									Qidiruv bo'yicha o'quvchi topilmadi
								</p>
							</div>
						)}
					</CardContent>
				</Card>
			</motion.div>

			{/* 📚 Darslar (Lessons Tabs) */}
			<motion.div variants={itemVariants} className='w-full'>
				<Card className='shadow-sm border-border w-full bg-card'>
					<CardHeader className='border-b flex flex-col lg:flex-row justify-between lg:items-center gap-4 bg-muted/20'>
						<CardTitle className='text-lg flex items-center gap-2'>
							<BookOpen className='h-5 w-5 text-green-500' /> Mentor darslari
						</CardTitle>
						<div className='flex flex-wrap gap-2'>
							{LESSON_TABS.map(tab => (
								<Button
									key={tab.key}
									variant={lessonTab === tab.key ? 'default' : 'outline'}
									size='sm'
									className={`gap-2 text-xs h-9 ${lessonTab === tab.key ? 'shadow-md' : 'bg-background hover:bg-muted'}`}
									onClick={() => setLessonTab(tab.key)}
								>
									<tab.icon className='h-3.5 w-3.5' />
									{tab.label}
									{lessonCounts[tab.key] > 0 && (
										<Badge
											variant={
												lessonTab === tab.key ? 'secondary' : 'secondary'
											}
											className={`text-[10px] ml-1 px-1.5 shadow-none ${lessonTab === tab.key ? 'bg-primary-foreground text-primary hover:bg-primary-foreground' : 'bg-muted-foreground/10 text-muted-foreground border-transparent'}`}
										>
											{lessonCounts[tab.key]}
										</Badge>
									)}
								</Button>
							))}
						</div>
					</CardHeader>
					<CardContent className='p-5 bg-muted/5 rounded-b-xl'>
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
										className='block h-full outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl'
									>
										<div className='p-4 h-full flex flex-col justify-between rounded-xl border bg-card hover:border-primary/40 hover:bg-primary/5 hover:shadow-md transition-all cursor-pointer group'>
											<div className='flex items-start justify-between gap-3 mb-4'>
												<h4 className='font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight'>
													{lesson.title}
												</h4>
												<div className='flex flex-col items-end shrink-0'>
													<Badge
														variant={
															lesson.status === 'live'
																? 'destructive'
																: lesson.status === 'upcoming'
																	? 'default'
																	: 'secondary'
														}
														className='text-[9px] uppercase tracking-wider whitespace-nowrap shadow-none font-bold'
													>
														{lesson.status === 'live'
															? '🔴 Jonli'
															: lesson.status === 'upcoming'
																? 'Kutilmoqda'
																: 'Yakunlangan'}
													</Badge>
												</div>
											</div>
											<div className='mt-auto space-y-4'>
												{lesson.description && (
													<p className='text-xs text-muted-foreground line-clamp-2'>
														{lesson.description}
													</p>
												)}
												<div className='flex flex-wrap items-center justify-between gap-2 text-xs pt-3 border-t border-border/50'>
													<div className='flex items-center gap-3 text-muted-foreground'>
														<span className='flex items-center gap-1 font-medium bg-muted px-2 py-1 rounded-md'>
															<Calendar className='h-3.5 w-3.5' />
															{formatUzDate(lesson.date).split(',')[0]}
														</span>
														<span className='flex items-center gap-1 font-medium bg-muted px-2 py-1 rounded-md'>
															<Clock className='h-3.5 w-3.5' />
															{lesson.time}
														</span>
													</div>
													<Badge
														variant='outline'
														className='text-[10px] font-bold tracking-wider uppercase bg-background border-dashed shadow-sm'
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
							<div className='text-center py-12 text-muted-foreground bg-card border border-dashed rounded-xl'>
								<BookOpen className='h-10 w-10 mx-auto mb-3 opacity-20' />
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
