'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import api from '@/lib/api'
import { AnimatePresence, motion } from 'framer-motion'
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
import { useEffect, useState } from 'react'

const containerVariants = {
	hidden: { opacity: 0 },
	show: { opacity: 1, transition: { staggerChildren: 0.1 } },
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

const formatPhoneStr = str => {
	if (!str) return '-'
	let val = str.replace(/[^\d+]/g, '')
	if (!val.startsWith('+998')) val = '+998'
	const raw = val.slice(4).substring(0, 9)
	let formatted = '+998'
	if (raw.length > 0) formatted += ' ' + raw.substring(0, 2)
	if (raw.length > 2) formatted += ' ' + raw.substring(2, 5)
	if (raw.length > 5) formatted += ' ' + raw.substring(5, 9)
	return formatted
}

const StatCard = ({ title, value, icon: Icon, colorClass, subtitle }) => (
	<motion.div variants={itemVariants} className='h-full'>
		<Card className='border-muted shadow-sm overflow-hidden h-full hover:shadow-md transition-shadow'>
			<CardContent className='p-5 flex items-center gap-4 h-full'>
				<div className={`p-3 rounded-xl shrink-0 ${colorClass}`}>
					<Icon className='h-5 w-5' />
				</div>
				<div className='flex-1 min-w-0'>
					<p className='text-xs text-muted-foreground font-medium truncate'>
						{title}
					</p>
					<p className='text-xl font-bold truncate'>{value}</p>
					{subtitle && (
						<p className='text-[10px] text-muted-foreground mt-0.5 truncate'>
							{subtitle}
						</p>
					)}
				</div>
			</CardContent>
		</Card>
	</motion.div>
)

const LessonCard = ({ lesson }) => (
	<motion.div
		layout
		initial={{ opacity: 0, y: 10 }}
		animate={{ opacity: 1, y: 0 }}
		exit={{ opacity: 0, scale: 0.95 }}
		transition={{ duration: 0.2 }}
	>
		<Card className='hover:shadow-md hover:border-primary/30 transition-all duration-300 border-muted/60 overflow-hidden group'>
			<div className='flex flex-col sm:flex-row h-full'>
				<div
					className={`w-full sm:w-1.5 h-1.5 sm:h-auto shrink-0 ${
						lesson.status === 'live'
							? 'bg-red-500 animate-pulse'
							: lesson.status === 'upcoming'
								? 'bg-blue-500'
								: 'bg-green-500'
					}`}
				/>
				<CardContent className='p-4 flex-1'>
					<div className='flex flex-col sm:flex-row justify-between gap-3'>
						<div className='space-y-1.5 flex-1 min-w-0'>
							<div className='flex flex-wrap items-center gap-2'>
								<h3 className='font-bold text-base sm:text-lg leading-tight group-hover:text-primary transition-colors truncate'>
									{lesson.title}
								</h3>
								{lesson.status === 'live' && (
									<Badge className='bg-red-500 hover:bg-red-600 text-[10px] h-5 px-1.5 uppercase tracking-wider animate-bounce shrink-0'>
										Live
									</Badge>
								)}
							</div>
							<div className='flex items-center gap-2 text-sm text-muted-foreground'>
								<Avatar className='h-5 w-5 shrink-0'>
									<AvatarFallback className='text-[10px] bg-primary/10 text-primary'>
										{lesson.mentor?.[0] || 'M'}
									</AvatarFallback>
								</Avatar>
								<span className='truncate'>
									Mentor:{' '}
									<span className='font-medium text-foreground'>
										{lesson.mentor || "Noma'lum"}
									</span>
								</span>
							</div>
						</div>
						<div className='flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:gap-1 shrink-0 mt-2 sm:mt-0'>
							<div className='flex items-center gap-1.5 text-sm font-semibold'>
								<Calendar className='h-3.5 w-3.5 text-primary' />
								{formatUzDate(lesson.date).split(',')[0]}
							</div>
							<div className='flex items-center gap-1.5 text-xs text-muted-foreground font-medium'>
								<Clock className='h-3.5 w-3.5' />
								{lesson.time}
							</div>
						</div>
					</div>

					<div className='mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-muted/40'>
						<Badge
							variant='outline'
							className='capitalize flex items-center gap-1.5 font-medium bg-muted/20'
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
							className='h-8 text-xs gap-1.5 hover:bg-primary/5 hover:text-primary'
							asChild
						>
							<Link href={`/admin/lessons/${lesson.id}/view`}>
								Batafsil <ExternalLink className='h-3 w-3' />
							</Link>
						</Button>
					</div>
				</CardContent>
			</div>
		</Card>
	</motion.div>
)

export default function StudentViewPage() {
	const params = useParams()
	const router = useRouter()
	const { id } = params
	const [student, setStudent] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		const fetchStudent = async () => {
			try {
				const res = await api.get(`/admin/students/${id}`)
				if (res?.data?.success) {
					setStudent(res.data.student)
				} else {
					setError('Talaba topilmadi')
				}
			} catch (err) {
				console.error(err)
				setError("Server xatosi: Ma'lumotni yuklash imkonsiz")
			} finally {
				setLoading(false)
			}
		}
		if (id) fetchStudent()
	}, [id])

	if (loading) {
		return (
			<div className='max-w-6xl mx-auto space-y-6 pb-12 p-4 sm:p-6 lg:p-8'>
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
			<div className='flex flex-col items-center justify-center p-12 text-center h-[60vh]'>
				<motion.div
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					className='bg-red-50 text-red-500 p-4 rounded-full mb-4'
				>
					<ShieldBan className='h-12 w-12' />
				</motion.div>
				<h2 className='text-2xl font-bold'>Xatolik</h2>
				<p className='text-muted-foreground'>{error}</p>
				<Button
					onClick={() => router.push('/admin/students')}
					className='mt-6'
					variant='outline'
				>
					<ArrowLeft className='mr-2 h-4 w-4' /> Ortga qaytish
				</Button>
			</div>
		)
	}

	return (
		<motion.div
			variants={containerVariants}
			initial='hidden'
			animate='show'
			className='max-w-6xl mx-auto space-y-6 pb-12 p-4 sm:p-6 lg:p-8'
		>
			<motion.div
				variants={itemVariants}
				className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4'
			>
				<div className='flex items-center gap-4'>
					<Button
						variant='outline'
						size='icon'
						className='h-10 w-10 rounded-full hover:bg-primary/5 hover:border-primary/30 transition-all shrink-0'
						onClick={() => router.back()}
					>
						<ArrowLeft className='h-5 w-5' />
					</Button>
					<div>
						<h1 className='text-2xl font-bold tracking-tight'>
							Talaba Profilini Ko'rish
						</h1>
						<p className='text-sm text-muted-foreground font-medium'>
							Foydalanuvchi ID: {student._id || student.id}
						</p>
					</div>
				</div>
				<div className='flex gap-2 w-full sm:w-auto'>
					<Button className='w-full sm:w-auto gap-2' asChild>
						<Link href={`/admin/students/${student._id || student.id}/edit`}>
							<Edit className='h-4 w-4' /> Tahrirlash
						</Link>
					</Button>
				</div>
			</motion.div>

			<motion.div
				variants={containerVariants}
				className='grid grid-cols-2 sm:grid-cols-4 gap-4'
			>
				<StatCard
					title='Obunalar'
					value={
						student.stats?.mentorsCount || student.followedMentors?.length || 0
					}
					icon={Users}
					colorClass='bg-purple-500/10 text-purple-600'
					subtitle='Mentorlarni kuzatadi'
				/>
				<StatCard
					title='Jami Darslar'
					value={
						student.stats?.totalLessons ||
						(student.lessons ? Object.values(student.lessons).flat().length : 0)
					}
					icon={BookOpen}
					colorClass='bg-blue-500/10 text-blue-600'
					subtitle='Darslarga yozilgan'
				/>
				<StatCard
					title='Tugallangan'
					value={
						student.stats?.completedLessons ||
						student.lessons?.completed?.length ||
						0
					}
					icon={CheckCircle2}
					colorClass='bg-green-500/10 text-green-600'
					subtitle='Darslarda qatnashgan'
				/>
				<StatCard
					title='Keladigan'
					value={
						student.stats?.upcomingLessons ||
						student.lessons?.upcoming?.length ||
						0
					}
					icon={Clock}
					colorClass='bg-orange-500/10 text-orange-600'
					subtitle='Navbatdagi darslar'
				/>
			</motion.div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6 items-start'>
				<motion.div variants={itemVariants} className='lg:col-span-1'>
					<Card className='border-none shadow-md overflow-hidden bg-card'>
						<div className='h-24 bg-gradient-to-r from-primary/20 to-primary/5 w-full'></div>
						<CardContent className='pt-0 flex flex-col items-center px-6 relative'>
							<Avatar className='h-24 w-24 border-4 border-background shadow-lg -mt-12 mb-4 ring-2 ring-primary/20 bg-background'>
								<AvatarImage
									src={student.avatar || ''}
									alt={student.firstName}
								/>
								<AvatarFallback className='text-3xl font-bold bg-primary/10 text-primary uppercase'>
									{student.firstName?.[0] || ''}
									{student.lastName?.[0] || ''}
								</AvatarFallback>
							</Avatar>
							<h2 className='text-xl font-bold text-center tracking-tight capitalize leading-tight mb-1'>
								{student.firstName} {student.lastName}
							</h2>
							<p className='text-primary font-semibold text-xs bg-primary/5 px-3 py-1 rounded-full uppercase tracking-wider'>
								Talaba
							</p>

							<div className='w-full space-y-4 py-6 border-b mt-2'>
								<div className='flex items-center gap-3 text-sm'>
									<div className='bg-muted p-2 rounded-md shrink-0'>
										<GraduationCap className='h-4 w-4 text-muted-foreground' />
									</div>
									<div className='flex-1 min-w-0'>
										<p className='text-xs text-muted-foreground mb-0.5'>
											Kurs / Guruh
										</p>
										<p className='font-medium text-foreground leading-none truncate'>
											{student.course || '-'} / {student.group || '-'}
										</p>
									</div>
								</div>
								<div className='flex items-center gap-3 text-sm'>
									<div className='bg-muted p-2 rounded-md shrink-0'>
										<Phone className='h-4 w-4 text-muted-foreground' />
									</div>
									<div className='flex-1 min-w-0'>
										<p className='text-xs text-muted-foreground mb-0.5'>
											Telefon raqami
										</p>
										{student.phoneNumber ? (
											<a
												href={`tel:${student.phoneNumber}`}
												className='font-medium text-primary hover:underline leading-none truncate block'
											>
												{formatPhoneStr(student.phoneNumber)}
											</a>
										) : (
											<p className='font-medium leading-none'>-</p>
										)}
									</div>
								</div>
								{student.username && (
									<div className='flex items-center gap-3 text-sm'>
										<div className='bg-muted p-2 rounded-md shrink-0'>
											<Send className='h-4 w-4 text-muted-foreground' />
										</div>
										<div className='flex-1 min-w-0'>
											<p className='text-xs text-muted-foreground mb-0.5'>
												Username
											</p>
											<Link
												href={`https://t.me/${student.username}`}
												target='_blank'
												className='font-medium text-blue-500 hover:underline leading-none truncate block'
											>
												@{student.username}
											</Link>
										</div>
									</div>
								)}
							</div>

							<div className='w-full pt-5 space-y-3'>
								<div className='flex justify-between items-center text-sm'>
									<span className='text-muted-foreground font-medium'>
										Status
									</span>
									{student.status === 'active' ? (
										<Badge className='bg-green-500/10 text-green-600 border-none hover:bg-green-500/10 font-bold'>
											Faol
										</Badge>
									) : (
										<Badge
											variant='secondary'
											className='bg-red-50 text-red-600 border-red-100 hover:bg-red-50 font-bold'
										>
											Bloklangan
										</Badge>
									)}
								</div>
								<div className='flex justify-between items-center text-sm pb-2'>
									<span className='text-muted-foreground text-xs uppercase tracking-wider font-semibold'>
										Qo'shilgan sana
									</span>
									<span className='font-semibold text-xs'>
										{formatUzDate(student.createdAt)}
									</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</motion.div>

				<motion.div variants={itemVariants} className='lg:col-span-2'>
					<Tabs defaultValue='obunalar' className='w-full'>
						<TabsList className='w-full grid grid-cols-2 p-1 bg-muted/50 rounded-xl mb-6 h-12'>
							<TabsTrigger
								value='obunalar'
								className='rounded-lg font-bold data-[state=active]:shadow-sm'
							>
								Obunalar (
								{student.stats?.mentorsCount ||
									student.followedMentors?.length ||
									0}
								)
							</TabsTrigger>
							<TabsTrigger
								value='darslar'
								className='rounded-lg font-bold data-[state=active]:shadow-sm'
							>
								Darslar (
								{student.stats?.totalLessons ||
									(student.lessons
										? Object.values(student.lessons).flat().length
										: 0)}
								)
							</TabsTrigger>
						</TabsList>

						<div className='w-full overflow-hidden'>
							<TabsContent
								value='obunalar'
								className='m-0 focus-visible:outline-none'
							>
								<AnimatePresence mode='popLayout'>
									<motion.div
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										transition={{ duration: 0.2 }}
										className='space-y-4'
									>
										{student.followedMentors?.length > 0 ? (
											<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
												{student.followedMentors.map(mentor => (
													<Card
														key={mentor.id || mentor._id}
														className='overflow-hidden border-muted/60 hover:shadow-md transition-shadow group'
													>
														<CardContent className='p-4 flex items-center gap-4'>
															<Avatar className='h-12 w-12 shrink-0 border-2 border-background group-hover:border-primary/20 transition-colors'>
																<AvatarImage src={mentor.avatar || ''} />
																<AvatarFallback className='bg-primary/5 text-primary text-sm font-bold uppercase'>
																	{mentor.name
																		?.split(' ')
																		.map(n => n[0])
																		.join('') || 'M'}
																</AvatarFallback>
															</Avatar>
															<div className='min-w-0 flex-1'>
																<h4 className='font-bold text-sm truncate group-hover:text-primary transition-colors'>
																	{mentor.name}
																</h4>
																<p className='text-[10px] text-muted-foreground truncate mb-1'>
																	{mentor.specialty || "Yo'nalish kiritilmagan"}
																</p>
																<Link
																	href={`/admin/mentors/${mentor.id || mentor._id}/view`}
																	className='text-[10px] text-primary hover:underline flex items-center gap-1 font-semibold w-fit'
																>
																	Profilni ko'rish{' '}
																	<ExternalLink className='h-2.5 w-2.5' />
																</Link>
															</div>
														</CardContent>
													</Card>
												))}
											</div>
										) : (
											<Card className='border-dashed border-2 bg-muted/5 shadow-none'>
												<CardContent className='flex flex-col items-center justify-center p-12 text-center text-muted-foreground'>
													<Users className='h-10 w-10 mb-3 opacity-20' />
													<p className='font-medium text-sm'>
														Talaba hali hech qaysi mentorga obuna bo'lmagan.
													</p>
												</CardContent>
											</Card>
										)}
									</motion.div>
								</AnimatePresence>
							</TabsContent>

							<TabsContent
								value='darslar'
								className='m-0 focus-visible:outline-none'
							>
								<AnimatePresence mode='popLayout'>
									<motion.div
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										transition={{ duration: 0.2 }}
									>
										<Tabs defaultValue='upcoming' className='w-full'>
											<TabsList className='mb-4 bg-muted/30 p-1 rounded-lg w-full flex overflow-x-auto no-scrollbar'>
												<TabsTrigger
													value='live'
													className='text-xs font-bold flex-1 min-w-[100px]'
												>
													Jonli ({student.lessons?.live?.length || 0})
												</TabsTrigger>
												<TabsTrigger
													value='upcoming'
													className='text-xs font-bold flex-1 min-w-[100px]'
												>
													Keladigan ({student.lessons?.upcoming?.length || 0})
												</TabsTrigger>
												<TabsTrigger
													value='completed'
													className='text-xs font-bold flex-1 min-w-[100px]'
												>
													O'tgan ({student.lessons?.completed?.length || 0})
												</TabsTrigger>
											</TabsList>

											<div className='w-full'>
												<TabsContent
													value='live'
													className='mt-0 space-y-3 focus-visible:outline-none'
												>
													<AnimatePresence>
														{student.lessons?.live?.length > 0 ? (
															student.lessons.live.map(l => (
																<LessonCard key={l.id || l._id} lesson={l} />
															))
														) : (
															<motion.div
																initial={{ opacity: 0 }}
																animate={{ opacity: 1 }}
																className='p-8 text-center text-sm font-medium text-muted-foreground bg-muted/10 border border-dashed rounded-lg'
															>
																Hozirda jonli darslar yo'q
															</motion.div>
														)}
													</AnimatePresence>
												</TabsContent>
												<TabsContent
													value='upcoming'
													className='mt-0 space-y-3 focus-visible:outline-none'
												>
													<AnimatePresence>
														{student.lessons?.upcoming?.length > 0 ? (
															student.lessons.upcoming.map(l => (
																<LessonCard key={l.id || l._id} lesson={l} />
															))
														) : (
															<motion.div
																initial={{ opacity: 0 }}
																animate={{ opacity: 1 }}
																className='p-8 text-center text-sm font-medium text-muted-foreground bg-muted/10 border border-dashed rounded-lg'
															>
																Kelgusi darslar mavjud emas
															</motion.div>
														)}
													</AnimatePresence>
												</TabsContent>
												<TabsContent
													value='completed'
													className='mt-0 space-y-3 focus-visible:outline-none'
												>
													<AnimatePresence>
														{student.lessons?.completed?.length > 0 ? (
															student.lessons.completed.map(l => (
																<LessonCard key={l.id || l._id} lesson={l} />
															))
														) : (
															<motion.div
																initial={{ opacity: 0 }}
																animate={{ opacity: 1 }}
																className='p-8 text-center text-sm font-medium text-muted-foreground bg-muted/10 border border-dashed rounded-lg'
															>
																O'tilgan darslar topilmadi
															</motion.div>
														)}
													</AnimatePresence>
												</TabsContent>
											</div>
										</Tabs>
									</motion.div>
								</AnimatePresence>
							</TabsContent>
						</div>
					</Tabs>
				</motion.div>
			</div>
		</motion.div>
	)
}
