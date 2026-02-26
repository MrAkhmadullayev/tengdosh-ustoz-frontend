'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
	ArrowLeft,
	Award,
	BookOpen,
	Calendar,
	CheckCircle2,
	Clock,
	MessageCircle,
	Share2,
	Star,
	UserPlus,
	Users,
	Video,
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'

const MOCK_MENTOR_DETAILS = {
	id: 1,
	name: 'Jahongir Taylokov',
	specialty: 'Senior React Developer',
	rating: 4.9,
	reviews: 124,
	students: 1250,
	coursesCount: 12,
	experience: '6 yil',
	image:
		'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60',
	bio: "Salom! Men Jahongir Taylokov, React va Next.js ekotizimida 6 yildan ortiq tajribaga ega senior dasturchiman. Hozirda yirik softver kompaniyasida Frontend Architecture bo'yicha maslahatchi sifatida faoliyat yuritaman. Mening darslarimda faqat nazariya emas, balki real loyihalarda ishlatiladigan eng yaxshi amaliyotlarni o'rganasiz.",
	skills: [
		'React',
		'Next.js',
		'Typescript',
		'Tailwind CSS',
		'Redux',
		'Architecture',
	],
	lessons: [
		{
			id: 101,
			title: 'React Advanced: Performance Optimization',
			date: 'Bugun',
			time: '10:00',
			status: 'live',
			image:
				'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60',
		},
		{
			id: 102,
			title: 'Modern Architecture in Next.js',
			date: 'Sharshanba',
			time: '18:30',
			status: 'upcoming',
			image:
				'https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=800&auto=format&fit=crop&q=60',
		},
		{
			id: 103,
			title: 'Typescript for Senior Devs',
			date: '24-Fevral',
			time: '20:00',
			status: 'completed',
			image:
				'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&auto=format&fit=crop&q=60',
		},
	],
}

export default function StudentMentorDetailPage() {
	const { id } = useParams()
	const router = useRouter()
	const [isFollowed, setIsFollowed] = useState(false)

	// Real ilovada bu yerdagi ma'lumotlar API orqali id asosida keladi
	const mentor = MOCK_MENTOR_DETAILS

	return (
		<div className='max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500'>
			{/* Header / Breadcrumb */}
			<div className='flex items-center justify-between'>
				<Button
					variant='ghost'
					onClick={() => router.back()}
					className='rounded-xl gap-2 hover:bg-muted/50 -ml-2 font-bold px-4'
				>
					<ArrowLeft className='w-5 h-5' /> Orqaga
				</Button>
				<div className='flex gap-2'>
					<Button
						variant='outline'
						size='icon'
						className='rounded-xl border-muted/60'
					>
						<Share2 className='w-4 h-4' />
					</Button>
				</div>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
				{/* Left Column: Profile Card */}
				<div className='lg:col-span-1 space-y-6'>
					<Card className='rounded-[2.5rem] border-muted/60 overflow-hidden shadow-xl shadow-primary/5 bg-background/50 backdrop-blur-md sticky top-6'>
						<CardContent className='p-8 space-y-8'>
							<div className='relative mx-auto w-40 h-40'>
								<div className='absolute inset-0 bg-primary/20 rounded-full blur-2xl scale-125' />
								<Avatar className='w-full h-full border-4 border-background shadow-2xl relative z-10'>
									<AvatarImage
										src={mentor.image}
										alt={mentor.name}
										className='object-cover'
									/>
									<AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
								</Avatar>
								<div className='absolute bottom-1 right-1 bg-yellow-400 text-black border-4 border-background font-bold px-3 py-1 rounded-2xl z-20 text-sm shadow-xl flex items-center gap-1'>
									<Star className='w-4 h-4 fill-current' /> {mentor.rating}
								</div>
							</div>

							<div className='text-center space-y-2'>
								<h1 className='text-2xl font-black tracking-tight'>
									{mentor.name}
								</h1>
								<p className='text-primary font-bold text-sm tracking-wide uppercase px-4 py-1.5 bg-primary/5 rounded-full inline-block'>
									{mentor.specialty}
								</p>
							</div>

							<div className='grid grid-cols-3 gap-3'>
								<div className='bg-muted/30 rounded-2xl p-3 text-center'>
									<p className='text-[10px] text-muted-foreground font-bold uppercase'>
										Talabalar
									</p>
									<p className='font-black text-sm'>{mentor.students}+</p>
								</div>
								<div className='bg-muted/30 rounded-2xl p-3 text-center'>
									<p className='text-[10px] text-muted-foreground font-bold uppercase'>
										Sharhlar
									</p>
									<p className='font-black text-sm'>{mentor.reviews}</p>
								</div>
								<div className='bg-muted/30 rounded-2xl p-3 text-center'>
									<p className='text-[10px] text-muted-foreground font-bold uppercase'>
										Staj
									</p>
									<p className='font-black text-sm'>{mentor.experience}</p>
								</div>
							</div>

							<div className='space-y-3'>
								<Button
									className={cn(
										'w-full rounded-2xl h-14 font-black text-base shadow-lg transition-all',
										isFollowed
											? 'bg-secondary text-secondary-foreground'
											: 'bg-primary text-white shadow-primary/20 hover:scale-[1.02]',
									)}
									onClick={() => setIsFollowed(!isFollowed)}
								>
									{isFollowed ? (
										<>
											<CheckCircle2 className='w-5 h-5 mr-2' /> Obuna bo'lindi
										</>
									) : (
										<>
											<UserPlus className='w-5 h-5 mr-2' /> Obuna bo'lish
										</>
									)}
								</Button>
								<Button
									variant='outline'
									className='w-full rounded-2xl h-14 font-black border-muted/60 hover:bg-muted/10'
								>
									<MessageCircle className='w-5 h-5 mr-2 text-primary' /> Xabar
									yuborish
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Right Column: Content */}
				<div className='lg:col-span-2 space-y-8'>
					{/* Bio Section */}
					<div className='space-y-4'>
						<h2 className='text-2xl font-black flex items-center gap-3'>
							<Users className='w-6 h-6 text-primary' /> Mentor haqida
						</h2>
						<Card className='rounded-3xl border-muted/60 bg-muted/10 border-none shadow-none'>
							<CardContent className='p-6'>
								<p className='text-lg leading-relaxed text-muted-foreground font-medium'>
									{mentor.bio}
								</p>
							</CardContent>
						</Card>
					</div>

					{/* Skills Section */}
					<div className='space-y-4'>
						<h2 className='text-2xl font-black flex items-center gap-3'>
							<Award className='w-6 h-6 text-primary' /> Ko'nikmalar
						</h2>
						<div className='flex flex-wrap gap-2'>
							{mentor.skills.map(skill => (
								<Badge
									key={skill}
									variant='secondary'
									className='rounded-xl px-4 py-2 font-bold bg-background border-muted/60 text-foreground'
								>
									{skill}
								</Badge>
							))}
						</div>
					</div>

					{/* Lessons Section */}
					<div className='space-y-6'>
						<div className='flex items-center justify-between'>
							<h2 className='text-2xl font-black flex items-center gap-3'>
								<BookOpen className='w-6 h-6 text-primary' /> Mentor darslari
							</h2>
							<Button variant='link' className='font-bold text-primary px-0'>
								Barchasini ko'rish
							</Button>
						</div>

						<div className='space-y-4'>
							{mentor.lessons.map(lesson => (
								<Card
									key={lesson.id}
									className='rounded-3xl border-muted/60 overflow-hidden hover:shadow-xl transition-all group bg-background/50'
								>
									<CardContent className='p-0 flex flex-col sm:flex-row items-center'>
										<div className='w-full sm:w-48 h-32 overflow-hidden shrink-0'>
											<img
												src={lesson.image}
												className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
											/>
										</div>
										<div className='p-6 flex-1 flex flex-col sm:flex-row justify-between items-center gap-4 w-full'>
											<div className='space-y-1.5 text-center sm:text-left'>
												<h3 className='font-bold text-lg leading-tight'>
													{lesson.title}
												</h3>
												<div className='flex items-center justify-center sm:justify-start gap-4 text-xs font-bold text-muted-foreground tracking-tight'>
													<span className='flex items-center gap-1.5'>
														<Calendar className='w-3.5 h-3.5 text-primary' />{' '}
														{lesson.date}
													</span>
													<span className='flex items-center gap-1.5'>
														<Clock className='w-3.5 h-3.5 text-primary' />{' '}
														{lesson.time}
													</span>
												</div>
											</div>

											<div className='shrink-0'>
												{lesson.status === 'live' ? (
													<Button
														className='rounded-xl bg-red-500 hover:bg-red-600 animate-pulse text-white font-black px-6'
														onClick={() =>
															router.push(`/student/courses/${lesson.id}/watch`)
														}
													>
														<Video className='w-4 h-4 mr-2' /> Efirga qo'shilish
													</Button>
												) : lesson.status === 'upcoming' ? (
													<Button
														variant='outline'
														className='rounded-xl border-primary/20 text-primary hover:bg-primary/5 font-black px-6'
														onClick={() => alert('Ariza yuborildi!')}
													>
														Yozilish
													</Button>
												) : (
													<Button
														variant='secondary'
														className='rounded-xl font-black px-6'
														onClick={() =>
															router.push(`/student/courses/${lesson.id}/watch`)
														}
													>
														Ko'rish
													</Button>
												)}
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
