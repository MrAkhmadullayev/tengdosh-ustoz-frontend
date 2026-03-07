'use client'

import Footer from '@/components/landing/Footer'
import Navbar from '@/components/landing/Navbar'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { motion, useScroll, useSpring } from 'framer-motion'
import {
	AlertCircle,
	BookOpen,
	ChevronRight,
	Scale,
	ScrollText,
	ShieldAlert,
	UserCheck,
} from 'lucide-react'
import { useEffect, useState } from 'react'

const TOC_SECTIONS = [
	{ id: 'general', title: 'Umumiy qoidalar', icon: ScrollText },
	{ id: 'accounts', title: 'Hisob va Xavfsizlik', icon: UserCheck },
	{ id: 'mentors', title: 'Mentorlar huquq va majburiyatlari', icon: BookOpen },
	{ id: 'conduct', title: 'Taqiqlangan harakatlar', icon: ShieldAlert },
	{ id: 'liability', title: 'Javobgarlikni cheklash', icon: Scale },
]

export default function TermsPage() {
	const lastUpdated = '25-Fevral, 2026-yil'
	const [activeSection, setActiveSection] = useState('general')

	// O'qish jarayonini ko'rsatuvchi chiziq (Progress Bar) uchun hook'lar
	const { scrollYProgress } = useScroll()
	const scaleX = useSpring(scrollYProgress, {
		stiffness: 100,
		damping: 30,
		restDelta: 0.001,
	})

	// ScrollSpy: Skroll qilinganda qaysi bo'limda ekanligimizni aniqlash
	useEffect(() => {
		const handleScroll = () => {
			const sectionElements = TOC_SECTIONS.map(s =>
				document.getElementById(s.id),
			)

			let currentActiveId = TOC_SECTIONS[0].id

			// Hozirgi ko'rinayotgan bo'limni hisoblash
			for (const el of sectionElements) {
				if (el) {
					const rect = el.getBoundingClientRect()
					// Agar elementning tepasi ekranning yuqori qismidan 150px gacha tushsa, uni faol qilamiz
					if (rect.top <= 150) {
						currentActiveId = el.id
					}
				}
			}

			setActiveSection(currentActiveId)
		}

		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	// Silliq skroll funksiyasi
	const scrollToSection = id => {
		const element = document.getElementById(id)
		if (element) {
			const y = element.getBoundingClientRect().top + window.scrollY - 100
			window.scrollTo({ top: y, behavior: 'smooth' })
			setActiveSection(id)
		}
	}

	// Animatsiya sozlamalari
	const fadeUpVariants = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
	}

	const containerVariants = {
		hidden: { opacity: 0 },
		show: { opacity: 1, transition: { staggerChildren: 0.1 } },
	}

	return (
		<div className='min-h-screen bg-background flex flex-col relative'>
			{/* O'qish Progress Bari (Ekranning eng tepasida) */}
			<motion.div
				className='fixed top-16 left-0 right-0 h-1 bg-primary z-50 origin-left'
				style={{ scaleX }}
			/>

			<Navbar />

			<main className='flex-1 container mx-auto px-4 py-12 md:py-20 max-w-7xl'>
				{/* HEADER SECTION */}
				<motion.div
					initial='hidden'
					animate='show'
					variants={containerVariants}
					className='max-w-3xl mb-12 md:mb-16'
				>
					<motion.div
						variants={fadeUpVariants}
						className='flex items-center text-sm font-medium text-muted-foreground bg-primary/10 w-fit px-4 py-1.5 rounded-full mb-6'
					>
						<AlertCircle className='h-4 w-4 mr-2 text-primary' />
						Oxirgi yangilanish:{' '}
						<span className='text-primary font-bold ml-1'>{lastUpdated}</span>
					</motion.div>
					<motion.h1
						variants={fadeUpVariants}
						className='text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-foreground text-balance'
					>
						Foydalanish shartlari
					</motion.h1>
					<motion.p
						variants={fadeUpVariants}
						className='text-muted-foreground text-xl mb-4 leading-relaxed text-balance'
					>
						TengdoshUstoz platformasiga xush kelibsiz! Ushbu shartlar sizning
						platformamizdan foydalanish tartibingizni belgilab beradi. Iltimos,
						ro'yxatdan o'tishdan oldin ularni diqqat bilan o'qib chiqing.
					</motion.p>
				</motion.div>

				<div className='flex flex-col lg:flex-row gap-12 relative items-start'>
					{/* CHAP TOMON: STICKY MUNDARIJA (ScrollSpy bilan) */}
					<aside className='hidden lg:block w-72 shrink-0 sticky top-28'>
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.3, duration: 0.5 }}
						>
							<Card className='border-border/50 shadow-sm bg-background/50 backdrop-blur-sm'>
								<CardContent className='p-6'>
									<h3 className='font-bold text-lg mb-4 text-foreground'>
										Mundarija
									</h3>
									<nav className='flex flex-col space-y-1 relative'>
										{/* Active element orqasidagi harakatlanuvchi fon */}
										<div
											className='absolute left-0 w-1 bg-primary rounded-full transition-all duration-300'
											style={{
												height: '32px',
												top: `${TOC_SECTIONS.findIndex(s => s.id === activeSection) * 40}px`,
											}}
										/>

										{TOC_SECTIONS.map(section => {
											const Icon = section.icon
											const isActive = activeSection === section.id

											return (
												<button
													key={section.id}
													onClick={() => scrollToSection(section.id)}
													className={`flex items-center gap-3 text-sm font-medium transition-all duration-300 text-left px-4 py-2 rounded-lg ${
														isActive
															? 'text-primary bg-primary/5'
															: 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
													}`}
												>
													<Icon
														className={`h-4 w-4 ${isActive ? 'text-primary' : 'opacity-70'}`}
													/>
													<span className='flex-1'>{section.title}</span>
													{isActive && (
														<ChevronRight className='h-4 w-4 text-primary' />
													)}
												</button>
											)
										})}
									</nav>
								</CardContent>
							</Card>
						</motion.div>
					</aside>

					{/* O'NG TOMON: ASOSIY MATN (CONTENT) */}
					<motion.div
						initial='hidden'
						animate='show'
						variants={containerVariants}
						className='flex-1 space-y-16 max-w-4xl text-foreground'
					>
						{/* 1. UMUMIY QOIDALAR */}
						<motion.section
							variants={fadeUpVariants}
							id='general'
							className='scroll-mt-32'
						>
							<h2 className='text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3'>
								<div className='p-2 rounded-xl bg-primary/10 text-primary'>
									<ScrollText className='h-6 w-6' />
								</div>
								1. Umumiy qoidalar
							</h2>
							<div className='space-y-4 text-muted-foreground text-lg leading-relaxed'>
								<p>
									1.1. Ushbu Foydalanish shartlari (keyingi o'rinlarda
									"Shartlar") "TengdoshUstoz" veb-platformasi va unga tegishli
									barcha xizmatlar, jumladan Telegram bot va video-aloqa
									tizimidan foydalanishni tartibga soladi.
								</p>
								<p>
									1.2. Platformadan ro'yxatdan o'tish, tizimga kirish yoki
									xizmatlardan foydalanish orqali siz ushbu Shartlarga to'liq
									rozi ekanligingizni tasdiqlaysiz. Agar biron bir qoidaga rozi
									bo'lmasangiz, xizmatlardan foydalanishni to'xtatishingiz
									so'raladi.
								</p>
								<p>
									1.3. Ma'muriyat (Adminlar) istalgan vaqtda ushbu Shartlarga
									o'zgartirish kiritish huquqiga ega. O'zgarishlar saytda e'lon
									qilingan paytdan boshlab kuchga kiradi.
								</p>
							</div>
						</motion.section>

						<Separator className='bg-border/50' />

						{/* 2. HISOB VA XAVFSIZLIK */}
						<motion.section
							variants={fadeUpVariants}
							id='accounts'
							className='scroll-mt-32'
						>
							<h2 className='text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3'>
								<div className='p-2 rounded-xl bg-primary/10 text-primary'>
									<UserCheck className='h-6 w-6' />
								</div>
								2. Hisob va Xavfsizlik
							</h2>
							<div className='space-y-4 text-muted-foreground text-lg leading-relaxed'>
								<p>
									2.1. Platformada ro'yxatdan o'tish uchun foydalanuvchi
									o'zining haqiqiy ism-sharifi, talabalik ma'lumotlari (kurs,
									yo'nalish) va ishchi Telegram raqamini taqdim etishi shart.
								</p>
								<p>
									2.2. Foydalanuvchi o'z hisobining (akkount) xavfsizligi,
									jumladan OTP (bir martalik parol) kodlarini uchinchi
									shaxslarga bermaslik uchun shaxsan javobgar hisoblanadi.
								</p>
								<p>
									2.3. Bitta hisobdan faqat bir kishi foydalanishi mumkin.
									Hisobni sotish, ijaraga berish yoki boshqalarga uzatish
									qat'iyan man etiladi va hisobning bloklanishiga olib keladi.
								</p>
							</div>
						</motion.section>

						<Separator className='bg-border/50' />

						{/* 3. MENTORLAR HUQUQ VA MAJBURIYATLARI */}
						<motion.section
							variants={fadeUpVariants}
							id='mentors'
							className='scroll-mt-32'
						>
							<h2 className='text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3'>
								<div className='p-2 rounded-xl bg-primary/10 text-primary'>
									<BookOpen className='h-6 w-6' />
								</div>
								3. Mentorlar huquq va majburiyatlari
							</h2>
							<div className='space-y-4 text-muted-foreground text-lg leading-relaxed'>
								<p>
									3.1.{' '}
									<strong className='text-foreground'>Mentor statusi:</strong>{' '}
									Platformada dars o'tish huquqiga ega bo'lish uchun talaba
									ma'muriyat tomonidan tasdiqlanishi kerak. Yolg'on ma'lumot
									yoki qalbaki sertifikat taqdim etgan foydalanuvchilar tizimdan
									chetlatiladi.
								</p>
								<p>
									3.2.{' '}
									<strong className='text-foreground'>Sifat kafolati:</strong>{' '}
									Mentor o'ziga biriktirilgan darslarni vaqtida, sifatli va
									e'lon qilingan dastur (syllabus) asosida o'tishga majbur.
									Sababsiz darsni bekor qilish reytingning tushishiga olib
									keladi.
								</p>
								<p>
									3.3.{' '}
									<strong className='text-foreground'>O'zaro hurmat:</strong>{' '}
									Mentor o'quvchilarga nisbatan kamsituvchi, haqoratli yoki
									nojo'ya so'zlarni ishlatmasligi shart. Dars jarayoni faqat
									ta'lim maqsadlarida bo'lishi kerak.
								</p>
							</div>
						</motion.section>

						<Separator className='bg-border/50' />

						{/* 4. XULQ-ATVOR QOIDALARI */}
						<motion.section
							variants={fadeUpVariants}
							id='conduct'
							className='scroll-mt-32'
						>
							<h2 className='text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3'>
								<div className='p-2 rounded-xl bg-destructive/10 text-destructive'>
									<ShieldAlert className='h-6 w-6' />
								</div>
								4. Taqiqlangan harakatlar
							</h2>
							<div className='space-y-4 text-muted-foreground text-lg leading-relaxed'>
								<p>
									TengdoshUstoz platformasida quyidagi harakatlar qat'iyan man
									etiladi va{' '}
									<strong className='text-destructive'>
										profilning umrbod bloklanishiga
									</strong>{' '}
									sabab bo'lishi mumkin:
								</p>
								<ul className='list-none space-y-3 bg-destructive/5 p-6 rounded-2xl border border-destructive/10'>
									{[
										'Platformadan tashqarida (Telegram, pul ishlari orqali) kelishishga urinish.',
										"Boshqa foydalanuvchilarning shaxsiy ma'lumotlarini (telefon raqami, manzili) ularning ruxsatisiz yig'ish va tarqatish.",
										"Spam, reklama xabarlari yoki ta'limga aloqador bo'lmagan havolalarni yuborish.",
										"Video-darslar vaqtida pornografik, zo'ravonlik yoki siyosiy materiallarni namoyish etish.",
										'Tizim ishiga xalaqit berish (DDoS hujumlar, kodni buzishga urinishlar).',
									].map((item, idx) => (
										<li
											key={idx}
											className='flex items-start gap-3 text-foreground/80'
										>
											<div className='h-2 w-2 rounded-full bg-destructive mt-2.5 flex-shrink-0'></div>
											<span>{item}</span>
										</li>
									))}
								</ul>
							</div>
						</motion.section>

						<Separator className='bg-border/50' />

						{/* 5. JAVOBGARLIKNI CHEKLASH */}
						<motion.section
							variants={fadeUpVariants}
							id='liability'
							className='scroll-mt-32'
						>
							<h2 className='text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3'>
								<div className='p-2 rounded-xl bg-primary/10 text-primary'>
									<Scale className='h-6 w-6' />
								</div>
								5. Javobgarlikni cheklash
							</h2>
							<div className='space-y-4 text-muted-foreground text-lg leading-relaxed'>
								<p>
									5.1. Platforma foydalanuvchilar o'rtasidagi bilim almashish
									uchun vositachi (ko'prik) hisoblanadi. Biz mentorlar tomonidan
									berilayotgan ma'lumotlarning 100% ilmiy to'g'riligiga kafolat
									bermaymiz.
								</p>
								<p>
									5.2. TengdoshUstoz tizimi texnik profilaktika ishlari,
									internetdagi uzilishlar yoki kutilmagan fors-major holatlari
									tufayli vaqtincha ishlamay qolishi uchun yuridik javobgarlikni
									o'z zimmasiga olmaydi.
								</p>
							</div>
						</motion.section>
					</motion.div>
				</div>
			</main>

			<Footer />
		</div>
	)
}
