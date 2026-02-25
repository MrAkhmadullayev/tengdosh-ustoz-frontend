'use client'

import Footer from '@/components/landing/Footer' // Footer ni ham shu yerga chaqiramiz
import Navbar from '@/components/landing/Navbar'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
	AlertCircle,
	BookOpen,
	Scale,
	ScrollText,
	ShieldAlert,
	UserCheck,
} from 'lucide-react'

export default function TermsPage() {
	const lastUpdated = '25-Fevral, 2026-yil'

	// Yon mundarija uchun ma'lumotlar
	const tocSections = [
		{
			id: 'general',
			title: 'Umumiy qoidalar',
			icon: <ScrollText className='h-4 w-4' />,
		},
		{
			id: 'accounts',
			title: 'Hisob va Xavfsizlik',
			icon: <UserCheck className='h-4 w-4' />,
		},
		{
			id: 'mentors',
			title: 'Mentorlar huquq va majburiyatlari',
			icon: <BookOpen className='h-4 w-4' />,
		},
		{
			id: 'conduct',
			title: 'Xulq-atvor qoidalari',
			icon: <ShieldAlert className='h-4 w-4' />,
		},
		{
			id: 'liability',
			title: 'Javobgarlikni cheklash',
			icon: <Scale className='h-4 w-4' />,
		},
	]

	// Silliq skroll (Smooth scroll) funksiyasi
	const scrollToSection = id => {
		const element = document.getElementById(id)
		if (element) {
			const y = element.getBoundingClientRect().top + window.scrollY - 100 // Navbarga taqalib qolmasligi uchun -100px
			window.scrollTo({ top: y, behavior: 'smooth' })
		}
	}

	return (
		<div className='min-h-screen bg-background flex flex-col'>
			<Navbar />

			<main className='flex-1 container mx-auto px-4 py-12 md:py-20 max-w-7xl'>
				{/* HEADER SECTION */}
				<div className='max-w-3xl mb-12 md:mb-16'>
					<h1 className='text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-foreground'>
						Foydalanish shartlari
					</h1>
					<p className='text-muted-foreground text-lg mb-4'>
						TengdoshUstoz platformasiga xush kelibsiz! Ushbu shartlar sizning
						platformamizdan foydalanish tartibingizni belgilab beradi. Iltimos,
						ro'yxatdan o'tishdan oldin ularni diqqat bilan o'qib chiqing.
					</p>
					<div className='flex items-center text-sm font-medium text-muted-foreground bg-muted w-fit px-3 py-1.5 rounded-full'>
						<AlertCircle className='h-4 w-4 mr-2 text-primary' />
						Oxirgi yangilanish: {lastUpdated}
					</div>
				</div>

				<div className='flex flex-col lg:flex-row gap-12 relative items-start'>
					{/* CHAP TOMON: STICKY MUNDARIJA (TABLE OF CONTENTS) */}
					<aside className='hidden lg:block w-72 shrink-0 sticky top-28'>
						<Card className='border-muted shadow-sm bg-muted/20'>
							<CardContent className='p-6'>
								<h3 className='font-bold text-lg mb-4'>Mundarija</h3>
								<nav className='flex flex-col space-y-2'>
									{tocSections.map(section => (
										<button
											key={section.id}
											onClick={() => scrollToSection(section.id)}
											className='flex items-center gap-2.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors text-left py-1.5'
										>
											{section.icon}
											{section.title}
										</button>
									))}
								</nav>
							</CardContent>
						</Card>
					</aside>

					{/* O'NG TOMON: ASOSIY MATN (CONTENT) */}
					<div className='flex-1 space-y-12 max-w-4xl text-foreground leading-relaxed'>
						{/* 1. UMUMIY QOIDALAR */}
						<section id='general' className='scroll-mt-28'>
							<h2 className='text-2xl font-bold mb-4 flex items-center gap-2'>
								1. Umumiy qoidalar
							</h2>
							<div className='space-y-4 text-muted-foreground'>
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
						</section>

						<Separator />

						{/* 2. HISOB VA XAVFSIZLIK */}
						<section id='accounts' className='scroll-mt-28'>
							<h2 className='text-2xl font-bold mb-4'>
								2. Hisob va Xavfsizlik
							</h2>
							<div className='space-y-4 text-muted-foreground'>
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
						</section>

						<Separator />

						{/* 3. MENTORLAR HUQUQ VA MAJBURIYATLARI */}
						<section id='mentors' className='scroll-mt-28'>
							<h2 className='text-2xl font-bold mb-4'>
								3. Mentorlar huquq va majburiyatlari
							</h2>
							<div className='space-y-4 text-muted-foreground'>
								<p>
									3.1. <strong>Mentor statusi:</strong> Platformada dars o'tish
									huquqiga ega bo'lish uchun talaba ma'muriyat tomonidan
									tasdiqlanishi kerak. Yolg'on ma'lumot yoki qalbaki sertifikat
									taqdim etgan foydalanuvchilar tizimdan chetlatiladi.
								</p>
								<p>
									3.2. <strong>Sifat kafolati:</strong> Mentor o'ziga
									biriktirilgan darslarni vaqtida, sifatli va e'lon qilingan
									dastur (syllabus) asosida o'tishga majbur. Sababsiz darsni
									bekor qilish reytingning tushishiga olib keladi.
								</p>
								<p>
									3.3. <strong>O'zaro hurmat:</strong> Mentor o'quvchilarga
									nisbatan kamsituvchi, haqoratli yoki nojo'ya so'zlarni
									ishlatmasligi shart. Dars jarayoni faqat ta'lim maqsadlarida
									bo'lishi kerak.
								</p>
							</div>
						</section>

						<Separator />

						{/* 4. XULQ-ATVOR QOIDALARI */}
						<section id='conduct' className='scroll-mt-28'>
							<h2 className='text-2xl font-bold mb-4'>
								4. Taqiqlangan harakatlar
							</h2>
							<div className='space-y-4 text-muted-foreground'>
								<p>
									TengdoshUstoz platformasida quyidagi harakatlar qat'iyan man
									etiladi va <strong>profilning umrbod bloklanishiga</strong>{' '}
									sabab bo'lishi mumkin:
								</p>
								<ul className='list-disc pl-6 space-y-2'>
									<li>
										Platformadan tashqarida (Telegram, pul ishlari orqali)
										kelishishga urinish;
									</li>
									<li>
										Boshqa foydalanuvchilarning shaxsiy ma'lumotlarini (telefon
										raqami, manzili) ularning ruxsatisiz yig'ish va tarqatish;
									</li>
									<li>
										Spam, reklama xabarlari yoki ta'limga aloqador bo'lmagan
										havolalarni yuborish;
									</li>
									<li>
										Video-darslar vaqtida pornografik, zo'ravonlik yoki siyosiy
										materiallarni namoyish etish;
									</li>
									<li>
										Tizim ishiga xalaqit berish (DDoS hujumlar, kodni buzishga
										urinishlar).
									</li>
								</ul>
							</div>
						</section>

						<Separator />

						{/* 5. JAVOBGARLIKNI CHEKLASH */}
						<section id='liability' className='scroll-mt-28'>
							<h2 className='text-2xl font-bold mb-4'>
								5. Javobgarlikni cheklash
							</h2>
							<div className='space-y-4 text-muted-foreground'>
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
						</section>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	)
}
