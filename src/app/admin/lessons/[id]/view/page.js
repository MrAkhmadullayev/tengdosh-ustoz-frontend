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
import { useTranslation } from '@/lib/i18n'
import {
	formatPhone,
	formatUzDate,
	getErrorMessage,
	getInitials,
} from '@/lib/utils'
import { format } from 'date-fns'
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
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

export default function LessonViewPage() {
	const { id } = useParams()
	const router = useRouter()
	const { t } = useTranslation()

	const [lesson, setLesson] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	// 1. API dan ma'lumot yuklash
	const fetchLesson = useCallback(async () => {
		try {
			const res = await api.get(`/admin/lessons/${id}`)
			if (res?.data?.success) {
				setLesson(res.data.lesson)
			} else {
				setError(t('errors.notFound') || "Dars ma'lumotlari topilmadi")
			}
		} catch (error) {
			setError(getErrorMessage(error, t('errors.serverError')))
		} finally {
			setLoading(false)
		}
	}, [id, t])

	useEffect(() => {
		if (id) fetchLesson()
	}, [fetchLesson])

	// 2. Yordamchi render funksiyalari (Faqat standart Shadcn variantlari)
	const getFormatBadge = format => {
		switch (format) {
			case 'online':
				return (
					<Badge
						variant='secondary'
						className='flex w-fit items-center gap-1.5 font-normal capitalize'
					>
						<Video className='w-3.5 h-3.5' /> Online
					</Badge>
				)
			case 'offline':
				return (
					<Badge
						variant='secondary'
						className='flex w-fit items-center gap-1.5 font-normal capitalize'
					>
						<MapPin className='w-3.5 h-3.5' /> Offline
					</Badge>
				)
			case 'hybrid':
				return (
					<Badge
						variant='secondary'
						className='flex w-fit items-center gap-1.5 font-normal capitalize'
					>
						<Users className='w-3.5 h-3.5' /> Hybrid
					</Badge>
				)
			default:
				return <Badge variant='outline'>{format}</Badge>
		}
	}

	const getStatusBadge = status => {
		switch (status) {
			case 'live':
				return (
					<Badge variant='destructive' className='animate-pulse'>
						Jonli (Live)
					</Badge>
				)
			case 'upcoming':
				return <Badge variant='default'>Keladigan</Badge>
			case 'completed':
				return <Badge variant='secondary'>Tugallangan</Badge>
			default:
				return (
					<Badge variant='outline' className='capitalize'>
						{status}
					</Badge>
				)
		}
	}

	// 3. UI: Loading State
	if (loading) {
		return (
			<div className='max-w-6xl mx-auto space-y-6 pb-12 pt-6 px-4 sm:px-6 w-full animate-pulse'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-4'>
						<Skeleton className='h-10 w-10 rounded-full' />
						<div className='space-y-2'>
							<Skeleton className='h-8 w-64' />
							<Skeleton className='h-4 w-32' />
						</div>
					</div>
				</div>
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6'>
					<div className='lg:col-span-2 space-y-6'>
						<Skeleton className='h-[250px] w-full rounded-xl' />
						<Skeleton className='h-[400px] w-full rounded-xl' />
					</div>
					<Skeleton className='h-[300px] w-full rounded-xl' />
				</div>
			</div>
		)
	}

	// 4. UI: Error State
	if (error || !lesson) {
		return (
			<div className='flex flex-col items-center justify-center min-h-[50vh] text-center p-6'>
				<ShieldBan className='h-12 w-12 text-destructive mb-4' />
				<h2 className='text-2xl font-bold tracking-tight mb-2'>
					Xatolik yuz berdi
				</h2>
				<p className='text-muted-foreground mb-6 max-w-md'>{error}</p>
				<Button onClick={() => router.push('/admin/lessons')} variant='outline'>
					<ArrowLeft className='mr-2 h-4 w-4' /> Darslarga qaytish
				</Button>
			</div>
		)
	}

	// 5. UI: Main Layout (Strict Shadcn/ui Default)
	return (
		<div className='max-w-6xl mx-auto space-y-6 pb-12 pt-6 px-4 sm:px-6 w-full'>
			{/* HEADER */}
			<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6'>
				<div className='flex items-center gap-4'>
					<Button
						variant='outline'
						size='icon'
						onClick={() => router.push('/admin/lessons')}
					>
						<ArrowLeft className='h-4 w-4' />
					</Button>
					<div>
						<div className='flex items-center gap-3'>
							<h1 className='text-2xl font-bold tracking-tight'>
								{lesson.title}
							</h1>
							{getStatusBadge(lesson.status)}
						</div>
						<p className='text-sm text-muted-foreground mt-1 capitalize'>
							Dars formati: {lesson.format}
						</p>
					</div>
				</div>
				<Button asChild>
					<Link href={`/admin/lessons/${id}/edit`}>
						<Pencil className='h-4 w-4 mr-2' /> Tahrirlash
					</Link>
				</Button>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* ASOSIY QISM */}
				<div className='lg:col-span-2 space-y-6'>
					<Card>
						<CardHeader>
							<CardTitle className='text-lg'>Dars Tafsilotlari</CardTitle>
						</CardHeader>
						<CardContent className='space-y-6'>
							<p className='text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap'>
								{lesson.description || (
									<span className='italic'>Dars tavsifi kiritilmagan.</span>
								)}
							</p>

							<div className='grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t'>
								<div className='space-y-1'>
									<p className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
										<User className='h-4 w-4' /> Mentor
									</p>
									<div className='flex items-center gap-2'>
										<Avatar className='h-5 w-5'>
											<AvatarFallback className='text-[10px]'>
												{getInitials(
													lesson.mentor?.firstName,
													lesson.mentor?.lastName,
												)}
											</AvatarFallback>
										</Avatar>
										<span className='text-sm font-medium truncate'>
											{lesson.mentor?.firstName} {lesson.mentor?.lastName}
										</span>
									</div>
								</div>

								<div className='space-y-1'>
									<p className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
										<Calendar className='w-4 h-4' /> Sana
									</p>
									<p className='text-sm font-medium'>
										{lesson.date
											? formatUzDate(lesson.date).split(',')[0]
											: '-'}
									</p>
								</div>

								<div className='space-y-1'>
									<p className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
										<Clock className='w-4 h-4' /> Vaqt
									</p>
									<p className='text-sm font-medium'>{lesson.time || '-'}</p>
								</div>

								<div className='space-y-1'>
									<p className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
										<Video className='w-4 h-4' /> Ulanish
									</p>
									<div>{getFormatBadge(lesson.format)}</div>
								</div>
							</div>
						</CardContent>
					</Card>

					<Tabs defaultValue='registered' className='w-full'>
						<TabsList className='grid w-full grid-cols-3 mb-4'>
							<TabsTrigger value='registered'>
								Ro'yxatdan o'tganlar ({lesson.registeredUsers?.length || 0})
							</TabsTrigger>
							<TabsTrigger value='attended'>
								Qatnashganlar ({lesson.attendance?.length || 0})
							</TabsTrigger>
							<TabsTrigger value='comments' disabled={!lesson.allowComments}>
								Izohlar ({lesson.messages?.length || 0})
							</TabsTrigger>
						</TabsList>

						{/* TAB: RO'YXATDAN O'TGANLAR */}
						<TabsContent value='registered'>
							<Card>
								<CardHeader className='flex flex-row items-center justify-between pb-2'>
									<CardTitle className='text-sm font-medium'>
										Ro'yxatdan o'tgan o'quvchilar
									</CardTitle>
									<Badge variant='outline'>
										{lesson.registeredUsers?.length || 0} / {lesson.maxStudents}
									</Badge>
								</CardHeader>
								<CardContent className='p-0'>
									<Table>
										<TableHeader>
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
											{lesson.registeredUsers?.length > 0 ? (
												lesson.registeredUsers.map((user, idx) => (
													<TableRow key={user._id || idx}>
														<TableCell className='text-center text-muted-foreground'>
															{idx + 1}
														</TableCell>
														<TableCell className='font-medium capitalize'>
															{user.firstName} {user.lastName}
														</TableCell>
														<TableCell>
															{formatPhone(user.phoneNumber)}
														</TableCell>
														<TableCell>
															{user.username ? (
																<a
																	href={`https://t.me/${user.username}`}
																	target='_blank'
																	rel='noreferrer'
																	className='text-primary hover:underline'
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
														Darsga hali hech kim yozilmagan.
													</TableCell>
												</TableRow>
											)}
										</TableBody>
									</Table>
								</CardContent>
							</Card>
						</TabsContent>

						{/* TAB: QATNASHGANLAR */}
						<TabsContent value='attended'>
							<Card>
								<CardHeader className='pb-2'>
									<CardTitle className='text-sm font-medium'>
										Darsda qatnashganlar
									</CardTitle>
								</CardHeader>
								<CardContent className='p-0'>
									<Table>
										<TableHeader>
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
											{lesson.attendance?.length > 0 ? (
												lesson.attendance.map((record, idx) => (
													<TableRow key={record._id || idx}>
														<TableCell className='text-center text-muted-foreground'>
															{idx + 1}
														</TableCell>
														<TableCell className='font-medium capitalize'>
															{record.userId?.firstName || "O'chirilgan"}{' '}
															{record.userId?.lastName || ''}
														</TableCell>
														<TableCell>
															<Badge
																variant={
																	record.isGuest ? 'secondary' : 'default'
																}
															>
																{record.isGuest ? 'Mehmon' : 'Kelgan'}
															</Badge>
														</TableCell>
														<TableCell className='text-muted-foreground'>
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
														Hech kim darsga kirmagan yoki ma'lumot yo'q.
													</TableCell>
												</TableRow>
											)}
										</TableBody>
									</Table>
								</CardContent>
							</Card>
						</TabsContent>

						{/* TAB: IZOHLAR */}
						{lesson.allowComments && (
							<TabsContent value='comments'>
								<Card>
									<CardHeader className='pb-2'>
										<CardTitle className='text-sm font-medium flex items-center gap-2'>
											<MessagesSquare className='h-4 w-4' /> Jonli Muhokama
										</CardTitle>
									</CardHeader>
									<CardContent className='p-0'>
										<ScrollArea className='h-[400px] p-6'>
											{lesson.messages?.length > 0 ? (
												<div className='space-y-4'>
													{lesson.messages.map((msg, idx) => (
														<div
															key={msg._id || idx}
															className='flex flex-col space-y-1'
														>
															<div className='flex items-center gap-2 text-sm text-muted-foreground'>
																<span className='font-medium text-foreground capitalize'>
																	{msg.senderId?.firstName || "O'chirilgan"}{' '}
																	{msg.senderId?.lastName || ''}
																</span>
																<span>
																	{format(new Date(msg.createdAt), 'HH:mm')}
																</span>
															</div>
															<div className='text-sm bg-muted px-4 py-2 rounded-md w-fit max-w-[85%]'>
																{msg.text}
															</div>
														</div>
													))}
												</div>
											) : (
												<div className='flex flex-col items-center justify-center h-full text-muted-foreground space-y-2'>
													<MessagesSquare className='h-8 w-8 opacity-50' />
													<p className='text-sm'>Yozishmalar mavjud emas</p>
												</div>
											)}
										</ScrollArea>
									</CardContent>
								</Card>
							</TabsContent>
						)}
					</Tabs>
				</div>

				{/* YON PANEL */}
				<div className='space-y-6'>
					<Card className='sticky top-6'>
						<CardHeader>
							<CardTitle className='text-lg'>Muhit Sozlamalari</CardTitle>
						</CardHeader>
						<CardContent className='space-y-6'>
							{['offline', 'hybrid'].includes(lesson.format) && (
								<div className='space-y-1'>
									<p className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
										<MapPin className='w-4 h-4' /> Manzil (Xona)
									</p>
									<p className='font-medium text-sm'>
										{lesson.roomNumber || 'Markaz asosiy binosi'}
									</p>
								</div>
							)}

							<div className='space-y-1'>
								<p className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
									<Users className='w-4 h-4' /> Limit (O'rinlar soni)
								</p>
								<div className='flex items-center justify-between text-sm'>
									<span>Maksimal:</span>
									<Badge variant='outline'>{lesson.maxStudents} ta</Badge>
								</div>
							</div>

							<div className='space-y-1'>
								<p className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
									<MessagesSquare className='w-4 h-4' /> Izohlar (Chat)
								</p>
								<div className='flex justify-between items-center text-sm'>
									<span>Holati:</span>
									{lesson.allowComments ? (
										<Badge
											variant='default'
											className='bg-green-600 hover:bg-green-600'
										>
											Yoqilgan
										</Badge>
									) : (
										<Badge variant='destructive'>O'chirilgan</Badge>
									)}
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}
