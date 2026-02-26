'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	ArrowLeft,
	Calendar,
	Clock,
	Loader2,
	MapPin,
	MessagesSquare,
	Pencil,
	PlayCircle,
	User,
	Users,
	Video,
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// Tasodifiy Mock Data
const MOCK_FETCH_LESSON = id => ({
	id,
	title:
		id === 'LSN-101' ? 'Frontend arxitekturasi asosi (React)' : 'Dars Tahlili',
	mentor: id === 'LSN-101' ? "Javohir To'rayev" : "Olimjon G'aniyev",
	date: '2026-03-01',
	time: '15:00',
	format: 'hybrid',
	allowComments: true,
	roomNumber: 'A-404 xonasi',
	enrolled: 45,
	description:
		"Bu dars React.js va Next.js kutubxonalarining asosiy strukturaviy dizayn prinsiplarini yoritib beradi. O'quvchilar real amaliyot orqali Component Based arxitekturasi nimaga kerakligini o'rganadilar.",
	zoomLink: 'https://zoom.us/j/4249129491',
	maxStudents: '100',
})

export default function ViewLessonPage() {
	const router = useRouter()
	const { id } = useParams()
	const [isFetching, setIsFetching] = useState(true)
	const [lesson, setLesson] = useState(null)

	useEffect(() => {
		setTimeout(() => {
			setLesson(MOCK_FETCH_LESSON(id))
			setIsFetching(false)
		}, 400)
	}, [id])

	if (isFetching || !lesson) {
		return (
			<div className='flex flex-col items-center justify-center h-96 gap-4 text-muted-foreground w-full'>
				<Loader2 className='h-8 w-8 animate-spin' />
				<p>Dars ma'lumotlari yuklanmoqda...</p>
			</div>
		)
	}

	return (
		<div className='max-w-5xl mx-auto space-y-6 pb-12 w-full'>
			{/* HEADER */}
			<div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
				<div className='flex items-center gap-4'>
					<Button
						variant='ghost'
						size='icon'
						onClick={() => router.push('/admin/lessons')}
						className='rounded-full hover:bg-muted shrink-0'
					>
						<ArrowLeft className='h-5 w-5' />
					</Button>
					<div>
						<div className='flex items-center gap-3'>
							<h1 className='text-3xl font-bold tracking-tight'>
								{lesson.title}
							</h1>
						</div>
						<p className='text-muted-foreground text-sm mt-1 flex items-center gap-2'>
							ID:{' '}
							<span className='font-mono text-foreground font-medium'>
								{lesson.id}
							</span>
						</p>
					</div>
				</div>
				<Button
					onClick={() => router.push(`/admin/lessons/${id}/edit`)}
					className='gap-2 shrink-0 group'
				>
					<Pencil className='w-4 h-4 group-hover:rotate-12 transition-transform' />{' '}
					Tahrirlash
				</Button>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-3 gap-6 pt-4'>
				{/* ASOSIY DARS HAQIDA (CHAP TOMON) */}
				<div className='md:col-span-2 space-y-6'>
					{/* VIDEO/STREAM PLACEHOLDER */}
					<Card className='shadow-sm border-muted overflow-hidden'>
						<div className='w-full h-[300px] sm:h-[400px] bg-black/95 flex flex-col items-center justify-center relative group'>
							{(lesson.format === 'online' || lesson.format === 'hybrid') && (
								<Badge className='absolute top-4 left-4 bg-blue-600 hover:bg-blue-600 text-white border-none gap-2 px-3'>
									<Video className='w-3 h-3' /> STREAM
								</Badge>
							)}
							<Badge
								variant='outline'
								className='absolute top-4 right-4 bg-black/50 text-white border-white/20 backdrop-blur-md'
							>
								<Users className='w-3.5 h-3.5 mr-2' /> {lesson.enrolled}{' '}
								Ko'rmoqda
							</Badge>

							<PlayCircle className='w-20 h-20 text-white/50 group-hover:text-white transition-colors cursor-pointer group-hover:scale-110 duration-300' />
							<p className='text-white/60 mt-4 text-sm font-medium'>
								Player Preview
							</p>
						</div>
						<CardContent className='p-6 space-y-4'>
							<div>
								<h3 className='text-lg font-bold mb-2'>Tavsif</h3>
								<p className='text-muted-foreground text-sm leading-relaxed'>
									{lesson.description ||
										"Ushbu dars uchun qo'shimcha ma'lumot kiritilmagan."}
								</p>
							</div>

							<div className='pt-4 border-t flex flex-col sm:flex-row gap-6'>
								<div className='space-y-1'>
									<p className='text-xs text-muted-foreground font-medium uppercase tracking-wider'>
										O'qituvchi / Mentor
									</p>
									<p className='font-medium flex items-center gap-2'>
										<User className='w-4 h-4 text-primary' /> {lesson.mentor}
									</p>
								</div>
								{(lesson.format === 'online' || lesson.format === 'hybrid') && (
									<div className='space-y-1'>
										<p className='text-xs text-muted-foreground font-medium uppercase tracking-wider'>
											Havola (Zoom/YT)
										</p>
										<a
											href={lesson.zoomLink}
											target='_blank'
											rel='noreferrer'
											className='font-medium font-mono text-blue-500 hover:underline text-sm break-all'
										>
											{lesson.zoomLink || 'Mavjud emas'}
										</a>
									</div>
								)}
								{(lesson.format === 'offline' ||
									lesson.format === 'hybrid') && (
									<div className='space-y-1'>
										<p className='text-xs text-muted-foreground font-medium uppercase tracking-wider'>
											Xona raqami
										</p>
										<p className='font-medium font-mono text-sm flex items-center gap-1'>
											<MapPin className='w-3.5 h-3.5 text-red-500' />{' '}
											{lesson.roomNumber || 'Kiritilmagan'}
										</p>
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* YON PANEL (VAQT VA STATISTIKA) */}
				<div className='space-y-6'>
					<Card className='shadow-sm border-muted overflow-hidden'>
						<CardHeader className='bg-muted/30 border-b p-4'>
							<CardTitle className='text-base uppercase text-muted-foreground tracking-wide text-xs'>
								Dars vaqti va turi
							</CardTitle>
						</CardHeader>
						<CardContent className='p-0'>
							<div className='divide-y'>
								<div className='p-4 flex items-center justify-between hover:bg-muted/10'>
									<div className='flex items-center gap-3 text-sm font-medium text-foreground'>
										<Calendar className='w-4 h-4 text-primary' /> Sana
									</div>
									<span className='text-sm text-muted-foreground'>
										{lesson.date}
									</span>
								</div>
								<div className='p-4 flex items-center justify-between hover:bg-muted/10'>
									<div className='flex items-center gap-3 text-sm font-medium text-foreground'>
										<Clock className='w-4 h-4 text-primary' /> Boshlanish
									</div>
									<span className='text-sm text-muted-foreground'>
										{lesson.time}
									</span>
								</div>
								<div className='p-4 flex items-center justify-between hover:bg-muted/10'>
									<div className='flex items-center gap-3 text-sm font-medium text-foreground'>
										<Video className='w-4 h-4 text-primary' /> Format
									</div>
									<span className='text-sm text-muted-foreground capitalize'>
										{lesson.format === 'online'
											? 'Masofaviy (Online)'
											: lesson.format === 'offline'
												? 'Markazda (Offline)'
												: 'Gibrid (Aralash)'}
									</span>
								</div>
								<div className='p-4 flex items-center justify-between hover:bg-muted/10'>
									<div className='flex items-center gap-3 text-sm font-medium text-foreground'>
										<MessagesSquare className='w-4 h-4 text-primary' /> Izohlar
										(Sharhlar)
									</div>
									<span className='text-sm text-muted-foreground'>
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
												className='text-muted-foreground'
											>
												O'chirilgan
											</Badge>
										)}
									</span>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className='shadow-sm border-muted overflow-hidden'>
						<CardHeader className='bg-muted/30 border-b p-4'>
							<CardTitle className='text-base uppercase text-muted-foreground tracking-wide text-xs'>
								Auditoriya
							</CardTitle>
						</CardHeader>
						<CardContent className='p-6 text-center space-y-2'>
							<div className='text-4xl font-bold font-mono text-primary flex items-center justify-center gap-2'>
								{lesson.enrolled}{' '}
								<span className='text-lg text-muted-foreground'>
									/ {lesson.maxStudents}
								</span>
							</div>
							<p className='text-sm text-muted-foreground'>
								Platforma orqali ro'yxatdan o'tgan o'quvchilar soni
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}
