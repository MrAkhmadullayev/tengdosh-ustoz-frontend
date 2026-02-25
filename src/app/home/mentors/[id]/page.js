import Navbar from '@/components/landing/Navbar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
	ArrowLeft,
	BookOpen,
	Briefcase,
	CheckCircle,
	Clock,
	Globe,
	GraduationCap,
	MessageSquare,
	PlayCircle,
	Star,
	UserPlus,
} from 'lucide-react'
import Link from 'next/link'

// Vaqtinchalik ma'lumotlar (Mock Data)
const MENTORS = [
	{
		id: 1,
		name: 'Sardor R.',
		course: '2-kurs',
		specialty: 'Full-Stack Dasturlash',
		skills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'Next.js'],
		rating: 4.9,
		reviewsCount: 124,
		isOnline: true,
		avatar: 'SR',
		about:
			"Salom! Men Sardor, yosh va g'ayratli Full-Stack dasturchiman. 2 yildan beri web dasturlash sohasida yirik loyihalar ustida ishlab kelaman. Menga eng yoqadigan narsa - bu qiyin muammolarni oddiy va samarali yo'llar bilan hal etish.",
		experience: '2 yil',
		price: '150 000 UZS / soat',
		availability: ['Dushanba', 'Chorshanba', 'Juma'],
		languages: ["O'zbek tili", 'Rus tili', 'Ingliz tili (B1)'],
	},
	{
		id: 2,
		name: 'Malika B.',
		course: '3-kurs',
		specialty: 'Mobil Dasturlash',
		skills: ['Kotlin', 'Android SDK', 'Java', 'Jetpack Compose'],
		rating: 4.8,
		reviewsCount: 89,
		isOnline: false,
		avatar: 'MB',
		about:
			"Men Malika, Android dasturchisi bo'lib, mobil ilovalar yaratish sirlarini siz bilan o'rtoqlashishga tayyorman. Kotlin tilining kuchini o'rganamiz va sizning birinchi ilovangizni Play Store'ga joylaymiz.",
		experience: '3 yil',
		price: '200 000 UZS / soat',
		availability: ['Seshaba', 'Payshanba', 'Shanba'],
		languages: ["O'zbek tili", 'Ingliz tili (C1)'],
	},
	{
		id: 3,
		name: 'Javohir T.',
		course: '4-kurs',
		specialty: "Algoritmlar va Ma'lumotlar",
		skills: ['C++', 'Python', 'LeetCode', 'Data Structures'],
		rating: 5.0,
		reviewsCount: 210,
		isOnline: true,
		avatar: 'JT',
		about:
			"Algoritmlash va ma'lumotlar tuzilmalari bo'yicha kuchli bilimga ega bo'lmoqchimisiz? Men sizga texnik intervyulardan muvaffaqiyatli o'tish sirlarini o'rgataman. LeetCode musobaqalarida yuqori natijalar qayd etilgan.",
		experience: '4 yil',
		price: '300 000 UZS / soat',
		availability: ['Dam olish kunlari'],
		languages: ["O'zbek tili", 'Rus tili (Ona tili)'],
	},
	{
		id: 4,
		name: 'Aziza K.',
		course: '2-kurs',
		specialty: 'IT Menejment va Tahlil',
		skills: ['BPM', 'UML', 'Agile', 'Scrum', 'Jira'],
		rating: 4.7,
		reviewsCount: 56,
		isOnline: true,
		avatar: 'AK',
		about:
			"Loyihalar qanday boshqarilishiga qiziqasizmi? Men IT loyihalarni biznes tahlil qilish va samarali boshqarish yo'llarini o'rgataman. Agile va Scrum metodologiyalari bilan yaqindan tanishamiz.",
		experience: '1.5 yil',
		price: '120 000 UZS / soat',
		availability: ['Dushanba', 'Seshaba', 'Chorshanba'],
		languages: ["O'zbek tili", 'Ingliz tili (IELTS 7.5)'],
	},
	{
		id: 5,
		name: 'Bekzod O.',
		course: '3-kurs',
		specialty: 'Backend Dasturlash',
		skills: ['Go', 'Docker', 'Linux', 'Microservices', 'Kubernetes'],
		rating: 4.6,
		reviewsCount: 42,
		isOnline: false,
		avatar: 'BO',
		about:
			"Men asosan katta va murakkab tizimlar uchun xavfsiz backend arxitekturalarini yarataman. Agar siz ham serverlar, ma'lumotlar bazalari va API lar qanday ishlashiga qiziqsangiz, to'g'ri odamni topdingiz.",
		experience: '3 yil',
		price: '250 000 UZS / soat',
		availability: ['Payshanba', 'Juma'],
		languages: ["O'zbek tili", 'Rus tili'],
	},
	{
		id: 6,
		name: 'Diyora S.',
		course: '1-kurs (Magistr)',
		specialty: 'UI/UX Dizayn',
		skills: ['Figma', 'Design Systems', 'UX Research', 'Prototyping'],
		rating: 4.9,
		reviewsCount: 178,
		isOnline: true,
		avatar: 'DS',
		about:
			"Foydalanuvchilar sevuvchi mahsulotlar yaratish men uchun ehtiros. Figma'ni mukammal o'rganamiz, ux tadqiqotlar o'tkazamiz va dizayn tizimlarini qurishni amaliyotda ko'ramiz.",
		experience: '4 yil',
		price: '180 000 UZS / soat',
		availability: ['Kelishilgan holda'],
		languages: ["O'zbek tili", 'Ingliz tili (C1)'],
	},
]

// Darslar mock datasi
const MOCK_COURSES = [
	{
		id: 1,
		title: 'React.js Noldan Pro gacha',
		lessons: 24,
		duration: '32 soat',
		level: "Boshlang'ich",
	},
	{
		id: 2,
		title: 'Next.js 14 va Server Actions',
		lessons: 16,
		duration: '18 soat',
		level: "O'rta maxsus",
	},
	{
		id: 3,
		title: 'Zamonaviy Frontend Arxitekturasi',
		lessons: 10,
		duration: '12 soat',
		level: 'Murakkab',
	},
]

export default async function MentorDetailsPage({ params }) {
	const props = await params
	const mentor = MENTORS.find(m => m.id === parseInt(props.id))

	if (!mentor) {
		return (
			<div className='flex flex-col min-h-screen'>
				<Navbar />
				<div className='flex-1 container mx-auto px-4 py-8 flex flex-col items-center justify-center'>
					<h1 className='text-3xl font-bold mb-4'>Mentor topilmadi</h1>
					<p className='text-muted-foreground mb-8 text-center'>
						Siz qidirayotgan mentor sahifasi mavjud emas yoki o'chirilgan.
					</p>
					<Link href='/home/mentors'>
						<Button className='gap-2'>
							<ArrowLeft className='h-4 w-4' /> Mentorlar ro'yxatiga qaytish
						</Button>
					</Link>
				</div>
			</div>
		)
	}

	return (
		<div className='bg-muted/30 min-h-screen pb-16'>
			<Navbar />

			{/* HEADER / ORQAGA QAYTISH */}
			<div className='container mx-auto px-4 py-6 max-w-6xl'>
				<Link href='/home/mentors' className='inline-block mb-4'>
					<Button
						variant='ghost'
						className='px-0 hover:bg-transparent text-muted-foreground hover:text-foreground gap-2'
					>
						<ArrowLeft className='h-4 w-4' /> Mentorlar ro'yxati
					</Button>
				</Link>

				<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
					{/* ASOSIY QISM (CHAP TOMON - 2 USTUN) */}
					<div className='lg:col-span-2 space-y-6'>
						{/* 1. MENTOR PROFIL KARTASI */}
						<Card className='overflow-hidden border-none shadow-sm'>
							{/* Banner qismi */}
							<div className='h-32 sm:h-40 bg-gradient-to-r from-primary/20 via-primary/10 to-muted relative'></div>

							<div className='px-6 sm:px-8 pb-8 relative'>
								{/* Avatar va Ism/Reyting bloki */}
								<div className='flex flex-col sm:flex-row gap-5 sm:items-end -mt-16 sm:-mt-20 mb-6'>
									<div className='relative inline-block'>
										<Avatar className='h-32 w-32 border-4 border-background shadow-md'>
											<AvatarImage src='' alt={mentor.name} />
											<AvatarFallback className='bg-primary/10 text-primary text-4xl font-bold'>
												{mentor.avatar}
											</AvatarFallback>
										</Avatar>
										{mentor.isOnline && (
											<div className='absolute bottom-2 right-2 flex h-5 w-5 rounded-full border-4 border-background bg-green-500'></div>
										)}
									</div>

									<div className='flex-1 pb-1 sm:pb-3'>
										<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
											<div>
												<h1 className='text-2xl sm:text-3xl font-extrabold text-foreground'>
													{mentor.name}
												</h1>
												<p className='text-primary font-medium flex items-center gap-1.5 mt-1.5 text-sm sm:text-base'>
													<BookOpen className='h-4.5 w-4.5' />
													{mentor.specialty}
												</p>
											</div>
											<Badge
												variant='secondary'
												className='px-3 py-1.5 rounded-full flex items-center gap-1.5 w-fit'
											>
												<Star className='h-4 w-4 text-yellow-500 fill-yellow-500' />
												<span className='font-bold text-sm'>
													{mentor.rating}
												</span>
												<span className='text-muted-foreground font-normal'>
													({mentor.reviewsCount})
												</span>
											</Badge>
										</div>
									</div>
								</div>

								{/* Qisqacha teglar */}
								<div className='flex flex-wrap gap-4 text-sm text-muted-foreground mb-8 p-4 bg-muted/40 rounded-xl'>
									<div className='flex items-center gap-2'>
										<GraduationCap className='h-4 w-4 text-primary' />
										<span className='font-medium'>{mentor.course} bosqich</span>
									</div>
									<div className='flex items-center gap-2'>
										<Briefcase className='h-4 w-4 text-primary' />
										<span className='font-medium'>
											{mentor.experience} tajriba
										</span>
									</div>
									<div className='flex items-center gap-2'>
										<Globe className='h-4 w-4 text-primary' />
										<span className='font-medium'>
											{mentor.languages.join(', ')}
										</span>
									</div>
								</div>

								{/* Men haqimda */}
								<div className='space-y-3'>
									<h3 className='text-lg font-bold text-foreground'>
										Men haqimda
									</h3>
									<p className='text-muted-foreground leading-relaxed text-[15px]'>
										{mentor.about}
									</p>
								</div>
							</div>
						</Card>

						{/* 2. KO'NIKMALAR */}
						<Card className='border-none shadow-sm'>
							<CardHeader className='pb-3'>
								<CardTitle className='text-lg'>Texnik Ko'nikmalar</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='flex flex-wrap gap-2.5'>
									{mentor.skills.map((skill, idx) => (
										<Badge
											key={idx}
											variant='outline'
											className='px-3 py-1.5 text-sm bg-background'
										>
											{skill}
										</Badge>
									))}
								</div>
							</CardContent>
						</Card>

						{/* 3. DARSLAR RO'YXATI */}
						<div className='pt-4'>
							<h3 className='text-xl font-bold flex items-center gap-2 mb-4 px-1'>
								<PlayCircle className='h-6 w-6 text-primary' />
								Mentorning Darslari
							</h3>
							<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
								{MOCK_COURSES.map(course => (
									<Card
										key={course.id}
										className='hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group border-muted'
									>
										<CardContent className='p-5 flex flex-col h-full'>
											<h4 className='font-semibold text-lg mb-3 group-hover:text-primary transition-colors line-clamp-2'>
												{course.title}
											</h4>
											<div className='flex items-center gap-3 text-sm text-muted-foreground mt-auto pt-4 border-t'>
												<div className='flex items-center gap-1.5'>
													<BookOpen className='h-4 w-4' />
													<span>{course.lessons} dars</span>
												</div>
												<div className='bg-border w-1 h-1 rounded-full'></div>
												<div className='flex items-center gap-1.5'>
													<Clock className='h-4 w-4' />
													<span>{course.duration}</span>
												</div>
											</div>
											<Badge
												variant='secondary'
												className='mt-4 w-fit text-xs font-medium'
											>
												{course.level}
											</Badge>
										</CardContent>
									</Card>
								))}
							</div>
						</div>
					</div>

					{/* YON QISM (O'NG TOMON - SIDEBAR) */}
					<div className='space-y-6'>
						<Card className='sticky top-24 border-none shadow-sm'>
							<CardContent className='p-6'>
								{/* Narx qismi (Oldin yo'q edi) */}

								<div className='space-y-3 mb-6'>
									<Button className='w-full h-11 text-base font-semibold shadow-sm'>
										<UserPlus className='mr-2 h-5 w-5' /> Darsga yozilish
									</Button>

									<Link
										href={`/home/mentors/${mentor.id}/messages`}
										className='block w-full'
									>
										<Button
											variant='outline'
											className='w-full h-11 text-base font-medium'
										>
											<MessageSquare className='mr-2 h-4 w-4' /> Xabar yozish
										</Button>
									</Link>
								</div>

								<Separator className='my-6' />

								{/* BO'SH VAQTLARI */}
								<div className='space-y-4 mb-6'>
									<h4 className='font-semibold text-sm text-foreground uppercase tracking-wider flex items-center gap-2'>
										<Clock className='h-4 w-4 text-primary' />
										Bo'sh vaqtlari
									</h4>
									<div className='space-y-2.5'>
										{mentor.availability.map((day, idx) => (
											<div
												key={idx}
												className='flex items-center gap-3 text-sm bg-muted/50 p-2 rounded-md'
											>
												<CheckCircle className='h-4 w-4 text-green-500' />
												<span className='font-medium text-muted-foreground'>
													{day}
												</span>
											</div>
										))}
									</div>
								</div>

								<Separator className='my-6' />

								{/* REYTING */}
								<div className='p-5 bg-background rounded-xl border shadow-sm text-center space-y-3'>
									<h4 className='font-semibold text-sm text-foreground'>
										Mentorni Baholash
									</h4>
									<div className='flex justify-center gap-1.5'>
										{[1, 2, 3, 4, 5].map(star => (
											<button
												key={star}
												className='p-1 hover:scale-110 transition-transform focus:outline-none'
											>
												<Star className='h-7 w-7 text-muted hover:text-yellow-400 hover:fill-yellow-400 transition-colors' />
											</button>
										))}
									</div>
									<p className='text-xs text-muted-foreground font-medium'>
										Dars o'tgach baho qoldiring
									</p>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	)
}
