'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import api from '@/lib/api'
import { format } from 'date-fns'
import { uz } from 'date-fns/locale'
import { motion } from 'framer-motion'
import {
	ArrowLeft,
	Calendar,
	Clock,
	MapPin,
	MessagesSquare,
	Pencil,
	ShieldBan,
	User,
	Users,
	Video,
} from 'lucide-react'
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

export default function LessonViewPage() {
	const params = useParams()
	const { id } = params
	const router = useRouter()
	const [lesson, setLesson] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		const fetchLesson = async () => {
			try {
				const res = await api.get(`/admin/lessons/${id}`)
				if (res?.data?.success) {
					setLesson(res.data.lesson)
				} else {
					setError("Dars ma'lumotlari topilmadi")
				}
			} catch (error) {
				console.error('Darsni yuklashda xatolik:', error)
				setError("Server xatosi: Ma'lumotlarni yuklash imkonsiz")
			} finally {
				setLoading(false)
			}
		}
		if (id) fetchLesson()
	}, [id])

	if (loading) {
		return (
			<div className='max-w-5xl mx-auto space-y-6 pb-12 w-full pt-4 sm:pt-6'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-4'>
						<Skeleton className='h-10 w-10 rounded-full' />
						<div className='space-y-2'>
							<Skeleton className='h-8 w-64' />
							<Skeleton className='h-4 w-32' />
						</div>
					</div>
					<Skeleton className='h-10 w-32' />
				</div>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
					<div className='md:col-span-2 space-y-6'>
						<Skeleton className='h-[250px] w-full rounded-xl' />
						<Skeleton className='h-[400px] w-full rounded-xl' />
					</div>
					<Skeleton className='h-[300px] w-full rounded-xl' />
				</div>
			</div>
		)
	}

	if (error || !lesson) {
		return (
			<div className='flex flex-col items-center justify-center p-12 text-center h-[60vh]'>
				<motion.div
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					className='bg-red-50 text-red-500 p-4 rounded-full mb-4'
				>
					<ShieldBan className='h-12 w-12' />
				</motion.div>
				<h2 className='text-2xl font-bold'>Xatolik yuz berdi</h2>
				<p className='text-muted-foreground mt-2 mb-6'>{error}</p>
				<Button onClick={() => router.push('/admin/lessons')} variant='outline'>
					<ArrowLeft className='mr-2 h-4 w-4' /> Darslarga qaytish
				</Button>
			</div>
		)
	}

	const getFormatBadge = format => {
		switch (format) {
			case 'online':
				return (
					<Badge
						variant='outline'
						className='bg-blue-50 text-blue-600 border-blue-200 gap-1.5 shadow-sm'
					>
						<Video className='w-3.5 h-3.5' /> Masofaviy
					</Badge>
				)
			case 'offline':
				return (
					<Badge
						variant='outline'
						className='bg-orange-50 text-orange-600 border-orange-200 gap-1.5 shadow-sm'
					>
						<MapPin className='w-3.5 h-3.5' /> Markazda
					</Badge>
				)
			case 'hybrid':
				return (
					<Badge
						variant='outline'
						className='bg-purple-50 text-purple-600 border-purple-200 gap-1.5 shadow-sm'
					>
						<Users className='w-3.5 h-3.5' /> Gibrid
					</Badge>
				)
			default:
				return null
		}
	}

	const getStatusBadge = status => {
		switch (status) {
			case 'live':
				return (
					<Badge className='bg-red-500 hover:bg-red-600 text-[10px] sm:text-xs uppercase tracking-wider animate-pulse'>
						Live
					</Badge>
				)
			case 'upcoming':
				return (
					<Badge className='bg-blue-500 hover:bg-blue-600 text-[10px] sm:text-xs'>
						Kelayotgan
					</Badge>
				)
			case 'completed':
				return (
					<Badge className='bg-green-500 hover:bg-green-600 text-[10px] sm:text-xs'>
						Tugallangan
					</Badge>
				)
			default:
				return (
					<Badge
						variant='outline'
						className='text-[10px] sm:text-xs capitalize'
					>
						{status}
					</Badge>
				)
		}
	}

	return (
		<motion.div
			variants={containerVariants}
			initial='hidden'
			animate='show'
			className='max-w-5xl mx-auto space-y-6 pb-12 pt-4 sm:pt-6 w-full'
		>
			<motion.div
				variants={itemVariants}
				className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4'
			>
				<div className='flex items-center gap-4'>
					<Button
						variant='outline'
						size='icon'
						onClick={() => router.push('/admin/lessons')}
						className='rounded-full hover:bg-primary/5 hover:border-primary/30 transition-all shrink-0 h-10 w-10'
					>
						<ArrowLeft className='h-5 w-5' />
					</Button>
					<div className='flex-1 min-w-0'>
						<div className='flex items-center gap-3 flex-wrap'>
							<h1 className='text-2xl sm:text-3xl font-bold tracking-tight truncate max-w-md'>
								{lesson.title}
							</h1>
							{getStatusBadge(lesson.status)}
						</div>
						<p className='text-muted-foreground text-sm mt-1 font-medium capitalize'>
							Dars formati: {lesson.format}
						</p>
					</div>
				</div>
				<Button
					onClick={() => router.push(`/admin/lessons/${id}/edit`)}
					className='gap-2 w-full sm:w-auto shadow-sm'
				>
					<Pencil className='h-4 w-4' /> Tahrirlash
				</Button>
			</motion.div>

			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				<div className='md:col-span-2 space-y-6 flex flex-col'>
					<motion.div variants={itemVariants}>
						<Card className='shadow-sm border-muted'>
							<CardHeader className='pb-3 border-b bg-muted/30'>
								<CardTitle className='text-lg'>Dars Tafsilotlari</CardTitle>
							</CardHeader>
							<CardContent className='pt-5 space-y-5'>
								<div>
									<p className='text-muted-foreground whitespace-pre-wrap leading-relaxed text-sm font-medium'>
										{lesson.description || 'Dars tavsifi mavjud emas.'}
									</p>
								</div>

								<div className='grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 border-t'>
									<div className='space-y-1.5'>
										<p className='text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5'>
											<User className='h-3.5 w-3.5' /> Mentor
										</p>
										<div className='flex items-center gap-2'>
											<Avatar className='h-6 w-6'>
												<AvatarFallback className='text-[10px] bg-primary/10 text-primary font-bold'>
													{lesson.mentor?.firstName?.[0] || 'M'}
												</AvatarFallback>
											</Avatar>
											<p className='text-sm font-semibold truncate'>
												{lesson.mentor?.firstName} {lesson.mentor?.lastName}
											</p>
										</div>
									</div>
									<div className='space-y-1.5'>
										<p className='text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5'>
											<Calendar className='w-3.5 h-3.5' /> Sana
										</p>
										<p className='text-sm font-semibold'>
											{lesson.date
												? format(new Date(lesson.date), 'dd MMMM, yyyy', {
														locale: uz,
													})
												: '-'}
										</p>
									</div>
									<div className='space-y-1.5'>
										<p className='text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5'>
											<Clock className='w-3.5 h-3.5' /> Vaqt
										</p>
										<p className='text-sm font-semibold'>
											{lesson.time || '-'}
										</p>
									</div>
									<div className='space-y-1.5'>
										<p className='text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5'>
											<Video className='w-3.5 h-3.5' /> Ulanish
										</p>
										<div>{getFormatBadge(lesson.format)}</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</motion.div>

					<motion.div variants={itemVariants} className='flex-1 flex flex-col'>
						<Tabs
							defaultValue='registered'
							className='w-full flex-1 flex flex-col'
						>
							<div className='w-full overflow-x-auto no-scrollbar pb-2'>
								<TabsList className='flex w-max min-w-full sm:w-full md:w-auto bg-muted/60 p-1 rounded-xl mb-2'>
									<TabsTrigger
										value='registered'
										className='flex-1 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs sm:text-sm font-medium'
									>
										Ro'yxatdan o'tganlar ({lesson.registeredUsers?.length || 0})
									</TabsTrigger>
									<TabsTrigger
										value='attended'
										className='flex-1 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs sm:text-sm font-medium'
									>
										Qatnashganlar ({lesson.attendance?.length || 0})
									</TabsTrigger>
									{lesson.allowComments && (
										<TabsTrigger
											value='comments'
											className='flex-1 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs sm:text-sm font-medium'
										>
											Izohlar ({lesson.messages?.length || 0})
										</TabsTrigger>
									)}
								</TabsList>
							</div>

							<div className='flex-1 relative'>
								<TabsContent
									value='registered'
									className='m-0 focus-visible:outline-none'
								>
									<Card className='shadow-sm overflow-hidden border-muted h-[400px] flex flex-col'>
										<CardHeader className='bg-muted/30 border-b pb-3 py-3 shrink-0'>
											<CardTitle className='text-base flex items-center justify-between'>
												<span>Ro'yxatdan o'tgan o'quvchilar</span>
												<Badge variant='outline' className='bg-background'>
													{lesson.registeredUsers?.length || 0} /{' '}
													{lesson.maxStudents}
												</Badge>
											</CardTitle>
										</CardHeader>
										<CardContent className='p-0 flex-1 overflow-auto'>
											<Table>
												<TableHeader className='bg-muted/20 sticky top-0 z-10 backdrop-blur-md'>
													<TableRow>
														<TableHead className='w-[50px] text-center'>
															T/R
														</TableHead>
														<TableHead>F.I.O</TableHead>
														<TableHead>Telefon</TableHead>
														<TableHead>Username</TableHead>
													</TableRow>
												</TableHeader>
												<TableBody>
													{lesson.registeredUsers &&
													lesson.registeredUsers.length > 0 ? (
														lesson.registeredUsers.map((user, idx) => (
															<TableRow
																key={user._id || idx}
																className='hover:bg-muted/30'
															>
																<TableCell className='text-center text-muted-foreground font-medium'>
																	{idx + 1}
																</TableCell>
																<TableCell className='font-medium capitalize'>
																	{user.firstName} {user.lastName}
																</TableCell>
																<TableCell className='font-medium whitespace-nowrap'>
																	{formatPhoneStr(user.phoneNumber)}
																</TableCell>
																<TableCell>
																	{user.username ? (
																		<a
																			href={`https://t.me/${user.username}`}
																			target='_blank'
																			rel='noreferrer'
																			className='text-blue-500 hover:underline'
																		>
																			@{user.username}
																		</a>
																	) : (
																		'-'
																	)}
																</TableCell>
															</TableRow>
														))
													) : (
														<TableRow>
															<TableCell
																colSpan={4}
																className='h-32 text-center text-muted-foreground'
															>
																<Users className='w-8 h-8 mx-auto mb-2 opacity-20' />
																Darsga hali hech kim yozilmagan.
															</TableCell>
														</TableRow>
													)}
												</TableBody>
											</Table>
										</CardContent>
									</Card>
								</TabsContent>

								<TabsContent
									value='attended'
									className='m-0 focus-visible:outline-none'
								>
									<Card className='shadow-sm overflow-hidden border-muted h-[400px] flex flex-col'>
										<CardHeader className='bg-muted/30 border-b pb-3 py-3 shrink-0'>
											<CardTitle className='text-base flex items-center justify-between'>
												<span>Darsda qatnashganlar</span>
												<Badge variant='outline' className='bg-background'>
													{lesson.attendance?.length || 0} kishi
												</Badge>
											</CardTitle>
										</CardHeader>
										<CardContent className='p-0 flex-1 overflow-auto'>
											<Table>
												<TableHeader className='bg-muted/20 sticky top-0 z-10 backdrop-blur-md'>
													<TableRow>
														<TableHead className='w-[50px] text-center'>
															T/R
														</TableHead>
														<TableHead>F.I.O</TableHead>
														<TableHead>Holat</TableHead>
														<TableHead>Guruh</TableHead>
													</TableRow>
												</TableHeader>
												<TableBody>
													{lesson.attendance && lesson.attendance.length > 0 ? (
														lesson.attendance.map((record, idx) => (
															<TableRow
																key={record._id || idx}
																className='hover:bg-muted/30'
															>
																<TableCell className='text-center text-muted-foreground font-medium'>
																	{idx + 1}
																</TableCell>
																<TableCell className='font-medium capitalize'>
																	{record.userId?.firstName || "O'chirilgan"}{' '}
																	{record.userId?.lastName || ''}
																</TableCell>
																<TableCell className='capitalize'>
																	<Badge
																		variant='outline'
																		className={record.isGuest ? 'text-[10px] bg-blue-50 text-blue-600 border-blue-200' : 'text-[10px] bg-green-50 text-green-600 border-green-200'}
																	>
																		{record.isGuest ? 'Mehmon' : 'Kelgan'}
																	</Badge>
																</TableCell>
																<TableCell>
																	{record.group || '-'}
																</TableCell>
															</TableRow>
														))
													) : (
														<TableRow>
															<TableCell
																colSpan={4}
																className='h-32 text-center text-muted-foreground'
															>
																<Video className='w-8 h-8 mx-auto mb-2 opacity-20' />
																Hech kim darsga kirmagan yoki ma'lumot yo'q.
															</TableCell>
														</TableRow>
													)}
												</TableBody>
											</Table>
										</CardContent>
									</Card>
								</TabsContent>

								{lesson.allowComments && (
									<TabsContent
										value='comments'
										className='m-0 focus-visible:outline-none'
									>
										<Card className='shadow-sm overflow-hidden border-muted h-[400px] flex flex-col'>
											<CardHeader className='bg-muted/30 border-b py-3 shrink-0'>
												<CardTitle className='text-base flex items-center gap-2'>
													<MessagesSquare className='w-4 h-4 text-primary' />
													Jonli Muhokama (Chat)
												</CardTitle>
											</CardHeader>
											<CardContent className='p-0 flex-1 overflow-hidden bg-muted/10'>
												<ScrollArea className='h-full p-4 sm:p-6'>
													{lesson.messages && lesson.messages.length > 0 ? (
														<div className='space-y-4'>
															{lesson.messages.map((msg, idx) => (
																<div
																	key={msg._id || idx}
																	className='flex flex-col items-start max-w-[85%] sm:max-w-[75%]'
																>
																	<span className='text-xs text-muted-foreground mb-1 ml-1 flex flex-wrap items-center gap-1.5'>
																		<strong className='text-foreground capitalize'>
																			{msg.senderId?.firstName || "O'chirilgan"}{' '}
																			{msg.senderId?.lastName || ''}
																		</strong>
																		<span className='opacity-60 text-[10px] capitalize'>
																			({msg.senderId?.role || "Noma'lum"})
																		</span>
																		<span className='opacity-50 ml-1 flex items-center gap-0.5 font-medium'>
																			<Clock className='w-3 h-3' />
																			{format(new Date(msg.createdAt), 'HH:mm')}
																		</span>
																	</span>
																	<div className='px-4 py-2.5 rounded-2xl text-sm bg-card text-foreground rounded-tl-sm border shadow-sm'>
																		{msg.text}
																	</div>
																</div>
															))}
														</div>
													) : (
														<div className='flex flex-col items-center justify-center h-full text-muted-foreground space-y-3 opacity-60'>
															<MessagesSquare className='h-12 w-12' />
															<p className='text-sm'>Yozishmalar mavjud emas</p>
														</div>
													)}
												</ScrollArea>
											</CardContent>
										</Card>
									</TabsContent>
								)}
							</div>
						</Tabs>
					</motion.div>
				</div>

				<motion.div variants={itemVariants} className='space-y-6'>
					<Card className='shadow-sm border-muted sticky top-24'>
						<CardHeader className='pb-4 border-b bg-muted/30'>
							<CardTitle className='text-lg'>Muhit Sozlamalari</CardTitle>
						</CardHeader>
						<CardContent className='space-y-6 pt-6'>
							{['offline', 'hybrid'].includes(lesson.format) && (
								<div className='space-y-2'>
									<p className='text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5'>
										<MapPin className='w-4 h-4' /> Manzil (Xona)
									</p>
									<p className='font-semibold text-foreground bg-muted/30 p-3 rounded-lg border'>
										{lesson.roomNumber || 'Markaz asosiy binosi'}
									</p>
								</div>
							)}

							<div className='space-y-2'>
								<p className='text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5'>
									<Users className='w-4 h-4' /> Limit (O'rinlar soni)
								</p>
								<div className='font-semibold text-foreground bg-muted/30 p-3 rounded-lg border flex items-center justify-between'>
									<span>Maksimal:</span>
									<Badge
										variant='secondary'
										className='font-bold text-sm bg-background'
									>
										{lesson.maxStudents} ta
									</Badge>
								</div>
							</div>

							<div className='space-y-2'>
								<p className='text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5'>
									<MessagesSquare className='w-4 h-4' /> Izohlar (Chat)
								</p>
								<div className='bg-muted/30 p-3 rounded-lg border flex justify-between items-center'>
									<span className='text-sm font-medium'>Holati:</span>
									{lesson.allowComments ? (
										<Badge
											variant='outline'
											className='text-green-600 bg-green-50 border-green-200'
										>
											Yoqilgan
										</Badge>
									) : (
										<Badge
											variant='outline'
											className='text-red-600 bg-red-50 border-red-200'
										>
											O'chirilgan
										</Badge>
									)}
								</div>
							</div>
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</motion.div>
	)
}
