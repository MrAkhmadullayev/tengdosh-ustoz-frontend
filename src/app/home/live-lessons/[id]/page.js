'use client'

import Navbar from '@/components/landing/Navbar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
	ArrowLeft,
	BookOpen,
	Calendar,
	Clock,
	MessageSquare,
	MonitorPlay,
	PlayCircle,
	Users,
} from 'lucide-react'
import Link from 'next/link'
import { use, useEffect, useState } from 'react'

// Mock Data (Live-Lessons page bilan bir xil, server bazasi yo'qligi sababli mock olinadi)
const LIVE_CLASSES = [
	{
		id: 1,
		title: 'React Hooks: useEffect ni mukammal tushunish',
		mentor: 'Sardor R.',
		mentorSpecialty: 'Full-Stack Developer',
		mentorId: 1,
		avatar: 'SR',
		category: 'Frontend',
		viewers: 124,
		status: 'live',
		time: 'Hozir',
		tags: ['React', 'JavaScript', 'Hooks', 'Web Development'],
		description:
			"Ushbu darsda React kutubxonasining eng muhim va biroz murakkab tushunchalaridan biri bo'lgan useEffect hookini chuqur o'rganamiz. Real loyihalardagi muammolarni qanday hal etish, side-effectlar bilan to'g'ri ishlash va xotira sizib chiqishini (memory leak) oldini olish kabi muhim jihatlarga to'xtalib o'tamiz. Dars amaliy mashg'ulotlarga boy bo'ladi.",
		color: 'from-blue-500/20 to-cyan-500/20',
	},
	{
		id: 2,
		title: "PostgreSQL arxitekturasi va ma'lumotlar bazasini loyihalash",
		mentor: 'Bekzod O.',
		mentorSpecialty: 'Backend Developer',
		mentorId: 5,
		avatar: 'BO',
		category: 'Backend',
		viewers: 85,
		status: 'live',
		time: 'Hozir',
		tags: ['PostgreSQL', 'Database', 'SQL', 'Architecture'],
		description:
			"Ma'lumotlar bazasini to'g'ri loyihalash loyihaning uzoq muddatli yashashi uchun eng muhim omillardan biridir. Bu darsda PostgreSQL imkoniyatlaridan to'liq foydalangan holda relatsion ma'lumotlar bazasini qanday qilib to'g'ri va samarali loyihalashni o'rganamiz. Shuningdek normallashtirish va indexlar bilan ishlash muhokama qilinadi.",
	},
	{
		id: 3,
		title: "Figma'da Design System qurish sirlari",
		mentor: 'Diyora S.',
		mentorSpecialty: 'UI/UX Designer',
		mentorId: 6,
		avatar: 'DS',
		category: 'Dizayn',
		viewers: 210,
		status: 'live',
		time: 'Hozir',
		tags: ['UI/UX', 'Figma', 'Design System', 'Components'],
		description:
			"Katta loyihalarda jamoa bilan ishlashda Design System ning o'rni beqiyos. Bu darsimizda Figma'da qanday qilib barqaror va moslashuvchan dizayn tizimini noldan boshlab qurishni ko'rib chiqamiz. Komponentlar, variantlar, va ranglar tizimi bilan ishlash bo'yicha amaliy maslahatlar beriladi.",
	},
	{
		id: 4,
		title: 'LeetCode: Array va String masalalarini ishlash',
		mentor: 'Javohir T.',
		mentorSpecialty: 'Software Engineer',
		mentorId: 3,
		avatar: 'JT',
		category: 'Algoritmlar',
		viewers: 0,
		status: 'upcoming',
		time: 'Bugun, 18:00',
		tags: ['C++', 'Algoritmlar', 'LeetCode', 'Interview Prep'],
		description:
			"Texnik intervyularda eng ko'p so'raladigan mavzulardan biri bo'lgan Array va String ma'lumotlar tuzilmalariga oid qiziqarli masalalarni birgalikda ishlaymiz. Har bir masalaning turli xil yechimlari tahlil qilinadi va Eng yaxshi vaqt va xotira murakkabliklariga erishish yo'llari o'rgatiladi.",
	},
	{
		id: 5,
		title: 'Android: Jetpack Compose asoslari',
		mentor: 'Malika B.',
		mentorSpecialty: 'Android Developer',
		mentorId: 2,
		avatar: 'MB',
		category: 'Mobil',
		viewers: 0,
		status: 'upcoming',
		time: 'Ertaga, 15:00',
		tags: ['Kotlin', 'Android', 'Jetpack Compose', 'Mobile UI'],
		description:
			"Zamonaviy Android UI yaratish vositasi bo'lgan Jetpack Compose bilan tanishamiz. XML dan farqli o'laroq, Compose da deklarativ usulda UI yaratish qanchalik oson va qulay ekanligini ko'rib chiqamiz. Birinchi Compose ilovangizni biz bilan birga yarating!",
	},
]

export default function LiveLessonDetailsPage({ params }) {
	// React `use` hookini ishlatamiz Next 15+ xavfsizligi uchun
	const unwrappedParams = use(params)
	const lessonId = parseInt(unwrappedParams.id)

	const [lesson, setLesson] = useState(null)

	useEffect(() => {
		const foundLesson = LIVE_CLASSES.find(l => l.id === lessonId)
		if (foundLesson) {
			setLesson(foundLesson)
		}
	}, [lessonId])

	if (!lesson) {
		return (
			<div className='min-h-screen bg-muted/10 flex flex-col'>
				<Navbar />
				<div className='flex-1 container mx-auto px-4 py-8 flex flex-col items-center justify-center'>
					<div className='animate-pulse flex flex-col items-center space-y-4'>
						<div className='h-64 w-full max-w-4xl bg-muted-foreground/10 rounded-2xl mb-8'></div>
						<div className='h-8 w-64 bg-muted-foreground/20 rounded-md mb-4'></div>
						<div className='h-4 w-96 bg-muted-foreground/10 rounded-md'></div>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-background pb-16'>
			<Navbar />

			<div className='container mx-auto px-4 py-6 md:py-8 max-w-6xl'>
				{/* BACK BUTTON */}
				<Link
					href='/home/live-lessons'
					className='inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6 group'
				>
					<ArrowLeft className='h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform' />
					Jonli darslar ro'yxatiga qaytish
				</Link>

				<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
					{/* ASOSIY QISM (CHAP) */}
					<div className='lg:col-span-2 space-y-6'>
						{/* VIDEO PLACEHOLDER YOKI BANNER */}
						<div className='w-full aspect-video bg-slate-900 rounded-2xl overflow-hidden relative flex items-center justify-center shadow-lg group'>
							{/* Status Badge */}
							<div className='absolute top-4 left-4 z-10'>
								{lesson.status === 'live' ? (
									<Badge
										variant='destructive'
										className='flex items-center gap-2 px-3 py-1.5 text-sm'
									>
										<span className='relative flex h-2.5 w-2.5'>
											<span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75'></span>
											<span className='relative inline-flex rounded-full h-2.5 w-2.5 bg-white'></span>
										</span>
										JONLI EFIR
									</Badge>
								) : (
									<Badge
										variant='secondary'
										className='flex items-center gap-2 px-3 py-1.5 text-sm bg-background/90 backdrop-blur'
									>
										<Calendar className='h-4 w-4' /> KUTILMOQDA
									</Badge>
								)}
							</div>

							{/* Viewers */}
							{lesson.status === 'live' && (
								<div className='absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-md text-white text-sm font-medium px-3 py-1.5 rounded-lg flex items-center gap-2'>
									<Users className='h-4 w-4' /> {lesson.viewers} kuzatuvchi
								</div>
							)}

							{/* Play Button Mock */}
							<div className='h-20 w-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 transition-transform group-hover:scale-110 cursor-pointer z-10'>
								<PlayCircle className='h-10 w-10 text-white ml-1 opacity-90' />
							</div>

							{/* Kutilayotgan dars bo'lsa ma'lumot yozish */}
							{lesson.status === 'upcoming' && (
								<div className='absolute bottom-6 left-0 right-0 text-center z-10'>
									<p className='text-white/80 font-medium bg-black/40 backdrop-blur-sm inline-block px-4 py-2 rounded-lg'>
										Dars {lesson.time} da boshlanadi
									</p>
								</div>
							)}
						</div>

						{/* DARS MA'LUMOTLARI */}
						<div>
							<div className='flex flex-wrap items-center gap-3 mb-4'>
								<Badge
									variant='secondary'
									className='bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary text-sm px-3 py-1 border-none'
								>
									{lesson.category}
								</Badge>
								<div className='flex items-center text-sm font-medium text-muted-foreground gap-1.5 bg-muted px-3 py-1 rounded-full'>
									<Clock className='h-4 w-4' />
									{lesson.time}
								</div>
							</div>

							<h1 className='text-2xl md:text-3xl font-extrabold text-foreground leading-tight mb-4'>
								{lesson.title}
							</h1>

							<div className='flex flex-wrap gap-2 mb-6'>
								{lesson.tags.map((tag, idx) => (
									<Badge
										key={idx}
										variant='outline'
										className='bg-background text-muted-foreground font-medium'
									>
										{tag}
									</Badge>
								))}
							</div>

							<Separator className='my-6' />

							<div className='space-y-4'>
								<h3 className='text-xl font-bold flex items-center gap-2'>
									<BookOpen className='h-5 w-5 text-primary' />
									Dars haqida
								</h3>
								<p className='text-muted-foreground leading-relaxed text-[15px] sm:text-base'>
									{lesson.description ||
										"Ushbu dars haqida to'liq ma'lumot tez orada taqdim etiladi. Eng so'nggi va zamonaviy texnologiyalarni amaliyotda biz bilan o'rganing."}
								</p>
							</div>
						</div>
					</div>

					{/* YON QISM (O'NG TOMON SIDEBAR) */}
					<div className='space-y-6'>
						{/* MENTOR KARTASI */}
						<Card className='border-border/50 shadow-sm sticky top-24'>
							<CardContent className='p-6'>
								<h3 className='text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4'>
									Ustoz
								</h3>

								<div className='flex items-center gap-4 mb-6'>
									<Avatar className='h-16 w-16 border-2 border-background shadow-sm'>
										<AvatarFallback className='bg-primary/10 text-primary text-xl font-bold'>
											{lesson.avatar}
										</AvatarFallback>
									</Avatar>
									<div>
										<h4 className='font-bold text-lg leading-none mb-1'>
											{lesson.mentor}
										</h4>
										<p className='text-sm text-primary font-medium'>
											{lesson.mentorSpecialty}
										</p>
									</div>
								</div>

								<div className='space-y-3'>
									<Link
										href={`/home/mentors/${lesson.mentorId}`}
										className='block w-full'
									>
										<Button variant='outline' className='w-full font-medium'>
											Profiliga o'tish
										</Button>
									</Link>
									<Link
										href={`/home/mentors/${lesson.mentorId}/messages`}
										className='block w-full'
									>
										<Button
											variant='secondary'
											className='w-full font-medium gap-2'
										>
											<MessageSquare className='h-4 w-4' /> Xabar yozish
										</Button>
									</Link>
								</div>

								<Separator className='my-6' />

								{/* AKSILAR */}
								<div className='space-y-4'>
									<h3 className='text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2'>
										Darsga qatnashish
									</h3>

									{lesson.status === 'live' ? (
										<Button className='w-full h-12 text-base font-bold bg-red-600 hover:bg-red-700 text-white gap-2 shadow-md'>
											<MonitorPlay className='h-5 w-5' /> Jonli darsga
											qo'shilish
										</Button>
									) : (
										<Button className='w-full h-12 text-base font-bold gap-2 shadow-md'>
											<Calendar className='h-5 w-5' /> Eslatma o'rnatish
										</Button>
									)}
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	)
}
