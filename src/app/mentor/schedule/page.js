'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
	Calendar,
	Clock,
	Eye,
	Layout,
	MapPin,
	MoreVertical,
	Pencil,
	Plus,
	Trash2,
	Users,
	Users2,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const MOCK_LESSONS = [
	{
		id: 1,
		title: 'React Advanced: Performance Optimization',
		mentor: "Javohir To'rayev",
		date: '2024-03-26',
		time: '18:00',
		format: 'online',
		status: 'live',
		attendees: 12,
		zoomLink: 'https://zoom.us/j/123456',
	},
	{
		id: 2,
		title: 'Next.js 14 Server Actions',
		mentor: "Javohir To'rayev",
		date: '2024-03-27',
		time: '20:00',
		format: 'hybrid',
		status: 'upcoming',
		attendees: null,
		roomNumber: '401-xona',
	},
	{
		id: 3,
		title: 'Tailwind CSS for Premium UI',
		mentor: "Javohir To'rayev",
		date: '2024-03-24',
		time: '15:00',
		format: 'offline',
		status: 'completed',
		attendees: 24,
		roomNumber: 'Google xonasi',
	},
]

export default function MentorSchedulePage() {
	const router = useRouter()
	const [lessons, setLessons] = useState(MOCK_LESSONS)

	const filteredLessons = status => lessons.filter(l => l.status === status)

	const LessonCard = ({ lesson }) => (
		<Card className='group hover:shadow-md transition-all border-muted/60 rounded-2xl overflow-hidden'>
			<CardContent className='p-5'>
				<div className='flex justify-between items-start gap-4'>
					<div className='space-y-3 flex-1'>
						<div className='flex items-center gap-2'>
							{lesson.status === 'live' && (
								<Badge className='bg-red-500 hover:bg-red-600 animate-pulse'>
									JONLI
								</Badge>
							)}
							<Badge variant='outline' className='capitalize'>
								{lesson.format}
							</Badge>
						</div>
						<h3 className='font-bold text-lg leading-tight group-hover:text-primary transition-colors'>
							{lesson.title}
						</h3>
						<div className='flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-muted-foreground font-medium'>
							<span className='flex items-center gap-1.5'>
								<Calendar className='w-4 h-4' /> {lesson.date}
							</span>
							<span className='flex items-center gap-1.5'>
								<Clock className='w-4 h-4' /> {lesson.time}
							</span>
							{lesson.format !== 'online' && (
								<span className='flex items-center gap-1.5'>
									<MapPin className='w-4 h-4' /> {lesson.roomNumber}
								</span>
							)}
							{lesson.attendees !== null && (
								<span className='flex items-center gap-1.5 text-primary'>
									<Users className='w-4 h-4' /> {lesson.attendees} kishi
								</span>
							)}
						</div>
					</div>

					<div className='flex items-center gap-2'>
						{lesson.status === 'live' ? (
							<Button
								size='sm'
								className='rounded-xl gap-2 font-bold px-4 bg-primary text-white h-9'
								onClick={() =>
									router.push(`/mentor/lessons/${lesson.id}/broadcast`)
								}
							>
								<Layout className='w-4 h-4' /> Boshqarish
							</Button>
						) : lesson.status === 'completed' ? (
							<Button
								variant='outline'
								size='sm'
								className='rounded-xl gap-2 font-bold px-4'
								onClick={() =>
									router.push(`/admin/lessons/${lesson.id}/students`)
								}
							>
								<Users2 className='w-4 h-4' /> O'quvchilar
							</Button>
						) : (
							<Button
								variant='secondary'
								size='sm'
								className='rounded-xl gap-2 font-bold px-4'
								onClick={() =>
									router.push(`/mentor/schedule/${lesson.id}/edit`)
								}
							>
								<Pencil className='w-4 h-4' /> Tahrirlash
							</Button>
						)}

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant='ghost' size='icon' className='rounded-full'>
									<MoreVertical className='h-4 w-4' />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align='end' className='rounded-xl w-40'>
								<DropdownMenuItem
									onClick={() =>
										router.push(
											lesson.status === 'live'
												? `/mentor/lessons/${lesson.id}/broadcast`
												: `/admin/lessons/${lesson.id}/watch`,
										)
									}
								>
									<Eye className='w-4 h-4 mr-2' />{' '}
									{lesson.status === 'live' ? 'Boshqarish' : "Ko'rish"}
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() =>
										router.push(`/mentor/schedule/${lesson.id}/edit`)
									}
								>
									<Pencil className='w-4 h-4 mr-2' /> Tahrirlash
								</DropdownMenuItem>
								<DropdownMenuItem className='text-red-500 focus:text-red-600 focus:bg-red-50'>
									<Trash2 className='w-4 h-4 mr-2' /> O'chirish
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</CardContent>
		</Card>
	)

	return (
		<div className='max-w-5xl mx-auto space-y-8 pb-12'>
			{/* Header */}
			<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight text-foreground'>
						Darslar jadvali
					</h1>
					<p className='text-muted-foreground mt-1'>
						Siz o'tadigan barcha darslarni shu yerdan boshqarishingiz mumkin.
					</p>
				</div>
				<Button
					className='rounded-xl gap-2 shadow-lg shadow-primary/20 h-11 px-6'
					onClick={() => router.push('/mentor/schedule/create')}
				>
					<Plus className='h-5 w-5' /> Yangi dars yaratish
				</Button>
			</div>

			<Tabs defaultValue='live' className='w-full space-y-6'>
				<TabsList className='bg-muted/50 p-1 rounded-2xl h-12 w-full sm:w-auto grid grid-cols-3 sm:flex'>
					<TabsTrigger value='live' className='rounded-xl px-6 h-10 font-bold'>
						Jonli
					</TabsTrigger>
					<TabsTrigger
						value='upcoming'
						className='rounded-xl px-6 h-10 font-bold'
					>
						Kelgusi
					</TabsTrigger>
					<TabsTrigger
						value='completed'
						className='rounded-xl px-6 h-10 font-bold'
					>
						Yakunlangan
					</TabsTrigger>
				</TabsList>

				<TabsContent value='live' className='space-y-4 outline-none'>
					{filteredLessons('live').length > 0 ? (
						filteredLessons('live').map(lesson => (
							<LessonCard key={lesson.id} lesson={lesson} />
						))
					) : (
						<div className='text-center py-12 bg-muted/20 rounded-3xl border-2 border-dashed border-muted'>
							<p className='text-muted-foreground'>
								Hozirda jonli darslar mavjud emas.
							</p>
						</div>
					)}
				</TabsContent>

				<TabsContent value='upcoming' className='space-y-4 outline-none'>
					{filteredLessons('upcoming').length > 0 ? (
						filteredLessons('upcoming').map(lesson => (
							<LessonCard key={lesson.id} lesson={lesson} />
						))
					) : (
						<div className='text-center py-12 bg-muted/20 rounded-3xl border-2 border-dashed border-muted'>
							<p className='text-muted-foreground'>
								Yaqin orada darslar rejalashtirilmagan.
							</p>
						</div>
					)}
				</TabsContent>

				<TabsContent value='completed' className='space-y-4 outline-none'>
					{filteredLessons('completed').length > 0 ? (
						filteredLessons('completed').map(lesson => (
							<LessonCard key={lesson.id} lesson={lesson} />
						))
					) : (
						<div className='text-center py-12 bg-muted/20 rounded-3xl border-2 border-dashed border-muted'>
							<p className='text-muted-foreground'>
								Tugallangan darslar mavjud emas.
							</p>
						</div>
					)}
				</TabsContent>
			</Tabs>
		</div>
	)
}
