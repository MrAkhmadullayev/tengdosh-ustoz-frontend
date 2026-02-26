'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	ArrowLeft,
	BookOpen,
	Briefcase,
	Calendar,
	CheckCircle2,
	Clock,
	Edit,
	Globe,
	Heart,
	MessageSquare,
	Phone,
	PlayCircle,
	Star,
	Users,
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

export default function ViewMentorPage() {
	const router = useRouter()
	const { id } = useParams()

	// Mock Data
	const mentor = {
		id: id || 'M-001',
		firstName: 'Sardor',
		lastName: 'Rahmatov',
		course: '3-kurs (Bakalavr)',
		specialty: 'Full-Stack (React, Node.js)',
		phone: '+998 90 123 4567',
		status: 'active',
		rating: 4.9,
		studentsCount: 34,
		followers: 1250,
		totalLessons: 142,
		experience: '2 yil',
		about:
			"Assalomu alaykum! Men Sardor Rahmatov. PDP Universitetida 3-kurs talabasiman. Men dasturlash sohasiga qiziqaman va hozirda bir qancha haqiqiy loyihalarda ishtirok etyapman. Asosiy e'tiborim Backend va Frontend qismlarini birlashtirish hamda optimallashtirishga qaratilgan. O'z bilimimni tengdoshlarim bilan bo'lishishdan xursandman!",
		languages: ['O‘zbek tili (Ona tili)', 'Ingliz tili (B2)', 'Rus tili (A2)'],
		skills: [
			'JavaScript',
			'TypeScript',
			'React.js',
			'Next.js',
			'Node.js',
			'Express',
			'PostgreSQL',
			'Prisma ORM',
			'Tailwind CSS',
		],
		schedule: [
			{ day: 'Dushanba', hours: '18:00 - 21:00' },
			{ day: 'Chorshanba', hours: '18:00 - 21:00' },
			{ day: 'Juma', hours: '19:00 - 22:00' },
			{ day: 'Shanba', hours: '14:00 - 18:00' },
		],
	}

	return (
		<div className='max-w-5xl mx-auto space-y-6 pb-12'>
			{/* HEADER */}
			<div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
				<div className='flex items-center gap-4'>
					<Button
						variant='ghost'
						size='icon'
						onClick={() => router.push('/admin/mentors')}
						className='rounded-full hover:bg-muted'
					>
						<ArrowLeft className='h-5 w-5' />
					</Button>
					<div>
						<h1 className='text-2xl font-bold tracking-tight'>
							Mentor Profili
						</h1>
						<p className='text-muted-foreground text-sm font-medium'>
							Tizimdagi ID: <span className='text-primary'>{mentor.id}</span>
						</p>
					</div>
				</div>
				<div className='flex w-full sm:w-auto gap-2'>
					<Button
						variant='outline'
						className='w-full sm:w-auto gap-2'
						onClick={() => router.push(`/admin/mentors/${mentor.id}/message`)}
					>
						<MessageSquare className='h-4 w-4' /> Xabar yozish
					</Button>
					<Button
						className='w-full sm:w-auto gap-2 bg-primary'
						onClick={() => router.push(`/admin/mentors/${mentor.id}/edit`)}
					>
						<Edit className='h-4 w-4' /> Tahrirlash
					</Button>
				</div>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* CHAP TOMON: ASOSIY PROFIL KARTASI (1/3 QISM) */}
				<div className='lg:col-span-1 space-y-6'>
					<Card className='border-none shadow-md bg-card overflow-hidden'>
						{/* Orqa fon cover uchun */}
						<div className='h-32 bg-gradient-to-r from-blue-600 to-primary w-full relative'></div>
						<CardContent className='pt-0 flex flex-col items-center px-6 relative'>
							<Avatar className='h-28 w-28 border-4 border-background shadow-lg -mt-14 mb-4 ring-2 ring-primary/20 bg-background'>
								<AvatarFallback className='bg-primary/10 text-primary font-bold text-3xl'>
									{mentor.firstName[0]}
									{mentor.lastName[0]}
								</AvatarFallback>
							</Avatar>

							<Badge className='bg-green-500/10 text-green-600 hover:bg-green-500/20 border-none font-medium mb-2 px-3 flex items-center gap-1.5'>
								<CheckCircle2 className='h-3.5 w-3.5' /> Faol Mentor
							</Badge>

							<h2 className='text-2xl font-bold text-center tracking-tight'>
								{mentor.firstName} {mentor.lastName}
							</h2>
							<p className='text-primary font-medium text-sm text-center mt-1'>
								{mentor.specialty}
							</p>

							{/* Ijtimoiy Raqamlar */}
							<div className='flex items-center justify-center gap-6 mt-6 w-full pb-6 border-b border-muted'>
								<div className='flex flex-col items-center'>
									<p className='font-bold text-lg'>{mentor.followers}</p>
									<p className='text-xs text-muted-foreground flex items-center gap-1 font-medium'>
										<Heart className='h-3 w-3' /> Obunachi
									</p>
								</div>
								<div className='flex flex-col items-center'>
									<p className='font-bold text-lg'>{mentor.studentsCount}</p>
									<p className='text-xs text-muted-foreground flex items-center gap-1 font-medium'>
										<Users className='h-3 w-3' /> O'quvchi
									</p>
								</div>
								<div className='flex flex-col items-center'>
									<p className='font-bold text-lg flex items-center text-yellow-600'>
										{mentor.rating}{' '}
										<Star className='h-4 w-4 fill-yellow-600 ml-1' />
									</p>
									<p className='text-xs text-muted-foreground font-medium'>
										Reyting
									</p>
								</div>
							</div>

							{/* Shaxsiy qisqacha ma'lumot qatorlari */}
							<div className='w-full space-y-4 py-6'>
								<div className='flex items-center gap-3 text-sm'>
									<div className='bg-muted p-2 rounded-md shrink-0'>
										<Phone className='h-4 w-4 text-muted-foreground' />
									</div>
									<div className='flex-1'>
										<p className='text-xs text-muted-foreground'>
											Telefon raqam
										</p>
										<p className='font-medium'>{mentor.phone}</p>
									</div>
								</div>
								<div className='flex items-center gap-3 text-sm'>
									<div className='bg-muted p-2 rounded-md shrink-0'>
										<Briefcase className='h-4 w-4 text-muted-foreground' />
									</div>
									<div className='flex-1'>
										<p className='text-xs text-muted-foreground'>Tajriba</p>
										<p className='font-medium'>{mentor.experience}</p>
									</div>
								</div>
								<div className='flex items-center gap-3 text-sm'>
									<div className='bg-muted p-2 rounded-md shrink-0'>
										<BookOpen className='h-4 w-4 text-muted-foreground' />
									</div>
									<div className='flex-1'>
										<p className='text-xs text-muted-foreground'>
											O'tilgan darslar
										</p>
										<p className='font-medium'>{mentor.totalLessons} soat</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* O'NG TOMON: BOSHQA MA'LUMOTLAR (2/3 QISM) */}
				<div className='lg:col-span-2 space-y-6'>
					{/* BIOGRAFIYA */}
					<Card className='shadow-sm border-muted'>
						<CardHeader>
							<CardTitle className='text-lg'>Ustoz haqida</CardTitle>
						</CardHeader>
						<CardContent>
							<p className='text-muted-foreground leading-relaxed text-sm md:text-base'>
								{mentor.about}
							</p>
						</CardContent>
					</Card>

					{/* TILLAR VA KO'NIKMALAR */}
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<Card className='shadow-sm border-muted'>
							<CardHeader className='pb-3'>
								<CardTitle className='text-base flex items-center gap-2'>
									<Globe className='h-4 w-4 text-primary' /> Tillarni bilishi
								</CardTitle>
							</CardHeader>
							<CardContent>
								<ul className='space-y-3'>
									{mentor.languages.map((lang, idx) => (
										<li
											key={idx}
											className='flex items-center gap-2 text-sm font-medium'
										>
											<div className='h-1.5 w-1.5 rounded-full bg-primary/70 shrink-0' />
											{lang}
										</li>
									))}
								</ul>
							</CardContent>
						</Card>

						<Card className='shadow-sm border-muted'>
							<CardHeader className='pb-3'>
								<CardTitle className='text-base flex items-center gap-2'>
									<Briefcase className='h-4 w-4 text-primary' /> Texnik
									ko'nikmalar
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='flex flex-wrap gap-2'>
									{mentor.skills.map((skill, idx) => (
										<Badge
											key={idx}
											variant='secondary'
											className='bg-primary/5 hover:bg-primary/10 text-foreground border border-primary/10'
										>
											{skill}
										</Badge>
									))}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* BO'SH VAQTLAR (JADVAL) */}
					<Card className='shadow-sm border-muted'>
						<CardHeader>
							<CardTitle className='text-lg flex items-center gap-2'>
								<Clock className='h-5 w-5 text-primary' /> Dars o'tish vaqtlari
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3'>
								{mentor.schedule.map((slot, idx) => (
									<div
										key={idx}
										className='bg-muted/50 border rounded-xl p-3 text-center flex flex-col items-center justify-center gap-1 hover:border-primary/40 transition-colors'
									>
										<p className='font-bold text-sm text-foreground'>
											{slot.day}
										</p>
										<Badge
											variant='outline'
											className='bg-background font-mono text-xs text-muted-foreground'
										>
											{slot.hours}
										</Badge>
									</div>
								))}
							</div>
							<p className='text-xs text-muted-foreground mt-4 italic'>
								* Mentor jadvalini individual darslar uchun oldindan kelishish
								orqali o'zgartirish mumkin.
							</p>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* DARS RO'YXATI (JONLI DARSLAR) - FULL WIDTH */}
			<div className='mt-8 max-w-5xl mx-auto w-full'>
				<h3 className='text-xl font-bold mb-4 flex items-center gap-2'>
					<PlayCircle className='h-5 w-5 text-primary' /> Mentorning jonli
					darslari
				</h3>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
					{[
						{
							title: 'React Hooks chuqur tahlili',
							date: 'Bugun, 18:00',
							students: 15,
							status: 'live',
						},
						{
							title: 'Next.js App Router amaliyot',
							date: 'Ertaga, 19:30',
							students: 24,
							status: 'upcoming',
						},
						{
							title: 'Redux Toolkit bilan state management',
							date: '28-Fevral, 17:00',
							students: 31,
							status: 'upcoming',
						},
					].map((lesson, idx) => (
						<Card
							key={idx}
							className='shadow-sm hover:border-primary/50 transition-colors'
						>
							<CardContent className='p-4 xl:p-5 flex flex-col justify-between h-full'>
								<div>
									<div className='flex justify-between items-start mb-3'>
										<Badge
											variant={
												lesson.status === 'live' ? 'default' : 'secondary'
											}
											className={
												lesson.status === 'live'
													? 'bg-red-500 hover:bg-red-600 animate-pulse px-2 py-0.5'
													: 'px-2 py-0.5 text-xs'
											}
										>
											{lesson.status === 'live' ? 'LIVE' : 'Kelgusi'}
										</Badge>
										<span className='text-xs text-muted-foreground flex items-center gap-1.5 font-medium'>
											<Users className='h-3.5 w-3.5' /> {lesson.students}{' '}
											o'quvchi
										</span>
									</div>
									<h4 className='font-bold text-base mb-2 leading-snug line-clamp-2 min-h-[2.5rem]'>
										{lesson.title}
									</h4>
									<p className='text-sm text-muted-foreground flex items-center gap-1.5 mb-5 font-medium'>
										<Calendar className='h-4 w-4 text-primary/70' />{' '}
										{lesson.date}
									</p>
								</div>

								<Button
									className='w-full text-sm font-semibold h-10 mt-auto'
									variant={lesson.status === 'live' ? 'default' : 'outline'}
								>
									{lesson.status === 'live'
										? "Qo'shilish"
										: "Eslatma o'rnatish"}
								</Button>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</div>
	)
}
