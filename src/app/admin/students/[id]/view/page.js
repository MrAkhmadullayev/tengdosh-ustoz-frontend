'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import api from '@/lib/api'
import { useTranslation } from '@/lib/i18n'
import {
	formatPhone,
	formatUzDate,
	getErrorMessage,
	getInitials,
} from '@/lib/utils'
import {
	ArrowLeft,
	BookOpen,
	Calendar,
	CheckCircle2,
	Clock,
	Edit,
	ExternalLink,
	GraduationCap,
	MapPin,
	Phone,
	Send,
	ShieldBan,
	Users,
	Video,
} from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'

// ==========================================
// 🧩 SHADCN STANDART KOMPONENTLARI
// ==========================================

const StatCard = ({ title, value, icon: Icon, subtitle }) => (
	<Card>
		<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
			<CardTitle className='text-sm font-medium'>{title}</CardTitle>
			<Icon className='h-4 w-4 text-muted-foreground' />
		</CardHeader>
		<CardContent>
			<div className='text-2xl font-bold'>{value}</div>
			{subtitle && (
				<p className='text-xs text-muted-foreground mt-1'>{subtitle}</p>
			)}
		</CardContent>
	</Card>
)

const LessonCard = ({ lesson }) => {
	// 🔥 XAVFSIZLIK: API dan `lesson.mentor` object bo'lib kelishi ehtimoli bor
	const mentorName =
		typeof lesson.mentor === 'object' && lesson.mentor !== null
			? `${lesson.mentor.firstName || ''} ${lesson.mentor.lastName || ''}`.trim()
			: lesson.mentor || "Noma'lum"

	return (
		<Card>
			<CardHeader className='pb-3'>
				<div className='flex justify-between items-start gap-4'>
					<div className='space-y-1'>
						<CardTitle className='text-base'>{lesson.title}</CardTitle>
						<CardDescription className='flex items-center gap-2'>
							<Avatar className='h-5 w-5 border'>
								<AvatarFallback className='text-[10px] bg-muted'>
									{getInitials(mentorName, '')}
								</AvatarFallback>
							</Avatar>
							Mentor: {mentorName}
						</CardDescription>
					</div>
					<Badge
						variant={
							lesson.status === 'live'
								? 'destructive'
								: lesson.status === 'upcoming'
									? 'default'
									: 'secondary'
						}
					>
						{lesson.status === 'live'
							? 'Jonli'
							: lesson.status === 'upcoming'
								? 'Keladigan'
								: 'Tugallangan'}
					</Badge>
				</div>
			</CardHeader>
			<CardContent>
				<div className='flex items-center gap-4 text-sm text-muted-foreground mb-4'>
					<div className='flex items-center gap-1.5'>
						<Calendar className='h-4 w-4' />{' '}
						{formatUzDate(lesson.date).split(',')[0]}
					</div>
					<div className='flex items-center gap-1.5'>
						<Clock className='h-4 w-4' /> {lesson.time}
					</div>
				</div>
				<div className='flex items-center justify-between pt-3 border-t'>
					<Badge
						variant='outline'
						className='capitalize flex items-center gap-1.5 font-normal'
					>
						{lesson.format === 'online' ? (
							<Video className='h-3 w-3' />
						) : (
							<MapPin className='h-3 w-3' />
						)}
						{lesson.format || 'online'}
					</Badge>
					<Button
						variant='ghost'
						size='sm'
						className='h-8 text-xs gap-1'
						asChild
					>
						<Link href={`/admin/lessons/${lesson.id || lesson._id}/view`}>
							Batafsil <ExternalLink className='h-3 w-3' />
						</Link>
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}

// ==========================================
// 🚀 ASOSIY SAHIFA KOMPONENTI
// ==========================================
export default function StudentViewPage() {
	const { id } = useParams()
	const router = useRouter()
	const { t } = useTranslation()

	const [student, setStudent] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	const fetchStudent = useCallback(async () => {
		try {
			const res = await api.get(`/admin/students/${id}`)
			if (res?.data?.success) {
				setStudent(res.data.student)
			} else {
				setError(t('errors.notFound') || 'Talaba topilmadi')
			}
		} catch (err) {
			setError(getErrorMessage(err, t('errors.serverError')))
		} finally {
			setLoading(false)
		}
	}, [id, t])

	useEffect(() => {
		if (id) fetchStudent()
	}, [fetchStudent])

	const stats = useMemo(() => {
		if (!student) return { followed: 0, total: 0, completed: 0, upcoming: 0 }
		return {
			followed:
				student.stats?.mentorsCount || student.followedMentors?.length || 0,
			total:
				student.stats?.totalLessons ||
				(student.lessons ? Object.values(student.lessons).flat().length : 0),
			completed:
				student.stats?.completedLessons ||
				student.lessons?.completed?.length ||
				0,
			upcoming:
				student.stats?.upcomingLessons ||
				student.lessons?.upcoming?.length ||
				0,
		}
	}, [student])

	if (loading) {
		return (
			<div className='max-w-6xl mx-auto space-y-6 pb-12 animate-pulse'>
				<div className='flex items-center gap-4 mb-8'>
					<Skeleton className='h-10 w-10 rounded-full' />
					<div className='space-y-2'>
						<Skeleton className='h-6 w-48' />
						<Skeleton className='h-4 w-32' />
					</div>
				</div>
				<div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
					{[...Array(4)].map((_, i) => (
						<Skeleton key={i} className='h-32 rounded-xl' />
					))}
				</div>
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
					<Skeleton className='h-[450px] rounded-xl lg:col-span-1' />
					<div className='lg:col-span-2 space-y-4'>
						<Skeleton className='h-12 rounded-xl' />
						<Skeleton className='h-[400px] rounded-xl' />
					</div>
				</div>
			</div>
		)
	}

	if (error || !student) {
		return (
			<div className='flex flex-col items-center justify-center p-12 text-center min-h-[50vh]'>
				<ShieldBan className='h-12 w-12 text-destructive mb-4' />
				<h2 className='text-2xl font-bold'>
					{t('errors.errorOccurred') || 'Xatolik yuz berdi'}
				</h2>
				<p className='text-muted-foreground mt-2 max-w-sm'>{error}</p>
				<Button
					onClick={() => router.push('/admin/students')}
					className='mt-6'
					variant='outline'
				>
					<ArrowLeft className='mr-2 h-4 w-4' />{' '}
					{t('common.goBack') || 'Ortga qaytish'}
				</Button>
			</div>
		)
	}

	return (
		<div className='max-w-6xl mx-auto space-y-6 pb-12 pt-2'>
			{/* 🏷️ Header */}
			<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4'>
				<div className='flex items-center gap-4'>
					<Button
						variant='outline'
						size='icon'
						onClick={() => router.push('/admin/students')}
					>
						<ArrowLeft className='h-4 w-4' />
					</Button>
					<div>
						<h1 className='text-2xl font-bold tracking-tight'>
							{t('students.profileTitle') || "Talaba Profilini Ko'rish"}
						</h1>
						<p className='text-sm text-muted-foreground'>
							ID: {student._id || student.id}
						</p>
					</div>
				</div>
				<Button asChild>
					<Link href={`/admin/students/${student._id || student.id}/edit`}>
						<Edit className='h-4 w-4 mr-2' /> {t('common.edit') || 'Tahrirlash'}
					</Link>
				</Button>
			</div>

			{/* 📊 Statistika (Shadcn default) */}
			<div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
				<StatCard
					title='Obunalar'
					value={stats.followed}
					icon={Users}
					subtitle='Mentorlarni kuzatadi'
				/>
				<StatCard
					title='Jami Darslar'
					value={stats.total}
					icon={BookOpen}
					subtitle='Darslarga yozilgan'
				/>
				<StatCard
					title='Tugallangan'
					value={stats.completed}
					icon={CheckCircle2}
					subtitle='Darslarda qatnashgan'
				/>
				<StatCard
					title='Keladigan'
					value={stats.upcoming}
					icon={Clock}
					subtitle='Navbatdagi darslar'
				/>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6 items-start'>
				{/* CHAP PANEL: Shaxsiy vizitka */}
				<div className='lg:col-span-1'>
					<Card>
						<CardContent className='pt-6'>
							<div className='flex flex-col items-center text-center pb-6 border-b'>
								<Avatar className='h-24 w-24 mb-4 border'>
									<AvatarImage
										src={student.avatar || ''}
										alt={student.firstName}
									/>
									<AvatarFallback className='text-2xl bg-muted text-foreground'>
										{getInitials(student.firstName, student.lastName)}
									</AvatarFallback>
								</Avatar>
								<CardTitle className='text-xl mb-1'>
									{student.firstName} {student.lastName}
								</CardTitle>
								<Badge variant='secondary' className='font-normal mt-1'>
									Talaba
								</Badge>
							</div>

							<div className='space-y-4 py-6 text-sm border-b'>
								<div className='flex items-center gap-3'>
									<GraduationCap className='h-4 w-4 text-muted-foreground' />
									<div>
										<p className='text-muted-foreground text-xs'>
											Kurs / Guruh
										</p>
										<p className='font-medium'>
											{student.course || '-'} / {student.group || '-'}
										</p>
									</div>
								</div>
								<div className='flex items-center gap-3'>
									<Phone className='h-4 w-4 text-muted-foreground' />
									<div>
										<p className='text-muted-foreground text-xs'>
											Telefon raqami
										</p>
										{student.phoneNumber ? (
											<a
												href={`tel:${student.phoneNumber.replace(/\D/g, '')}`}
												className='font-medium hover:underline text-foreground'
											>
												{formatPhone(student.phoneNumber)}
											</a>
										) : (
											<p className='font-medium'>-</p>
										)}
									</div>
								</div>
								{student.username && (
									<div className='flex items-center gap-3'>
										<Send className='h-4 w-4 text-muted-foreground' />
										<div>
											<p className='text-muted-foreground text-xs'>Username</p>
											<a
												href={`https://t.me/${student.username}`}
												target='_blank'
												rel='noopener noreferrer'
												className='font-medium hover:underline text-primary'
											>
												@{student.username}
											</a>
										</div>
									</div>
								)}
							</div>

							<div className='w-full pt-6 space-y-3'>
								<div className='flex justify-between items-center text-sm'>
									<span className='text-muted-foreground'>Status</span>
									<Badge
										variant={
											student.status === 'active' ? 'default' : 'destructive'
										}
										className={
											student.status === 'active'
												? 'bg-green-500 hover:bg-green-600'
												: ''
										}
									>
										{student.status === 'active' ? 'Faol' : 'Bloklangan'}
									</Badge>
								</div>
								<div className='flex justify-between items-center text-sm'>
									<span className='text-muted-foreground'>Qo'shilgan sana</span>
									<span className='font-medium'>
										{formatUzDate(student.createdAt)}
									</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* O'NG PANEL: Tabs (Obunalar va Darslar) */}
				<div className='lg:col-span-2'>
					<Tabs defaultValue='obunalar' className='w-full'>
						<TabsList className='grid w-full grid-cols-2 mb-4'>
							<TabsTrigger value='obunalar'>
								Obunalar ({stats.followed})
							</TabsTrigger>
							<TabsTrigger value='darslar'>Darslar ({stats.total})</TabsTrigger>
						</TabsList>

						<div className='w-full'>
							{/* TAB 1: OBUNALAR */}
							<TabsContent value='obunalar' className='space-y-4'>
								{student.followedMentors?.length > 0 ? (
									<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
										{student.followedMentors.map(mentor => (
											<Card key={mentor.id || mentor._id}>
												<CardHeader className='p-4 flex flex-row items-center gap-4 space-y-0'>
													<Avatar className='h-10 w-10 border'>
														<AvatarImage src={mentor.avatar || ''} />
														<AvatarFallback className='bg-muted text-sm font-medium'>
															{getInitials(mentor.name, '')}
														</AvatarFallback>
													</Avatar>
													<div className='flex-1 min-w-0'>
														<CardTitle className='text-sm truncate'>
															{mentor.name}
														</CardTitle>
														<CardDescription className='text-xs truncate mb-1'>
															{mentor.specialty || "Yo'nalish kiritilmagan"}
														</CardDescription>
														<Link
															href={`/admin/mentors/${mentor.id || mentor._id}/view`}
															className='text-xs text-primary hover:underline flex items-center gap-1 w-fit font-medium'
														>
															Profilni ko'rish{' '}
															<ExternalLink className='h-3 w-3' />
														</Link>
													</div>
												</CardHeader>
											</Card>
										))}
									</div>
								) : (
									<div className='p-12 text-center border rounded-lg bg-muted/50'>
										<Users className='h-8 w-8 mx-auto text-muted-foreground mb-3' />
										<p className='text-sm text-muted-foreground'>
											Talaba hali hech qaysi mentorga obuna bo'lmagan.
										</p>
									</div>
								)}
							</TabsContent>

							{/* TAB 2: DARSLAR */}
							<TabsContent value='darslar'>
								<Tabs defaultValue='upcoming' className='w-full'>
									<TabsList className='w-full justify-start mb-4 h-auto p-0 bg-transparent border-b rounded-none'>
										<TabsTrigger
											value='live'
											className='rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2'
										>
											Jonli ({student.lessons?.live?.length || 0})
										</TabsTrigger>
										<TabsTrigger
											value='upcoming'
											className='rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2'
										>
											Keladigan ({student.lessons?.upcoming?.length || 0})
										</TabsTrigger>
										<TabsTrigger
											value='completed'
											className='rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2'
										>
											O'tgan ({student.lessons?.completed?.length || 0})
										</TabsTrigger>
									</TabsList>

									{['live', 'upcoming', 'completed'].map(tabKey => (
										<TabsContent
											key={tabKey}
											value={tabKey}
											className='space-y-4 m-0'
										>
											{student.lessons?.[tabKey]?.length > 0 ? (
												student.lessons[tabKey].map(l => (
													<LessonCard key={l.id || l._id} lesson={l} t={t} />
												))
											) : (
												<div className='p-12 text-center border rounded-lg bg-muted/50'>
													<BookOpen className='h-8 w-8 mx-auto text-muted-foreground mb-3' />
													<p className='text-sm text-muted-foreground'>
														{tabKey === 'live'
															? "Hozirda jonli darslar yo'q"
															: tabKey === 'upcoming'
																? 'Kelgusi darslar mavjud emas'
																: "O'tilgan darslar topilmadi"}
													</p>
												</div>
											)}
										</TabsContent>
									))}
								</Tabs>
							</TabsContent>
						</div>
					</Tabs>
				</div>
			</div>
		</div>
	)
}
