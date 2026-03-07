'use client'

import Footer from '@/components/landing/Footer'
import Navbar from '@/components/landing/Navbar'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { motion, useScroll, useSpring } from 'framer-motion'
import {
	AlertCircle,
	ChevronRight,
	Cookie,
	Database,
	Eye,
	Lock,
	Shield,
	UserCog,
} from 'lucide-react'
import { useEffect, useState } from 'react'

const TOC_SECTIONS = [
	{ id: 'collection', title: "Ma'lumotlarni yig'ish", icon: Database },
	{ id: 'usage', title: 'Qanday foydalanamiz', icon: Eye },
	{ id: 'sharing', title: 'Uchinchi shaxslarga uzatish', icon: Shield },
	{ id: 'security', title: "Ma'lumotlar xavfsizligi", icon: Lock },
	{ id: 'rights', title: 'Foydalanuvchi huquqlari', icon: UserCog },
	{ id: 'cookies', title: 'Cookie fayllari', icon: Cookie },
]

export default function PrivacyPage() {
	const lastUpdated = '25-Fevral, 2026-yil'
	const [activeSection, setActiveSection] = useState('collection')

	// O'qish jarayonini ko'rsatuvchi chiziq (Progress Bar)
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

			for (const el of sectionElements) {
				if (el) {
					const rect = el.getBoundingClientRect()
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
			{/* O'qish Progress Bari */}
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
						Maxfiylik Siyosati
					</motion.h1>
					<motion.p
						variants={fadeUpVariants}
						className='text-muted-foreground text-xl mb-4 leading-relaxed text-balance'
					>
						Sizning shaxsiy ma'lumotlaringiz xavfsizligi biz uchun eng muhim
						ustuvor vazifalardan biridir. Ushbu hujjat sizning ma'lumotlaringiz
						qanday yig'ilishi, saqlanishi va himoya qilinishini tushuntiradi.
					</motion.p>
				</motion.div>

				<div className='flex flex-col lg:flex-row gap-12 relative items-start'>
					{/* CHAP TOMON: STICKY MUNDARIJA */}
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
										{/* Active element orqasidagi chiziq */}
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

					{/* O'NG TOMON: ASOSIY MATN */}
					<motion.div
						initial='hidden'
						animate='show'
						variants={containerVariants}
						className='flex-1 space-y-16 max-w-4xl text-foreground'
					>
						{/* 1. MA'LUMOTLARNI YIG'ISH */}
						<motion.section
							variants={fadeUpVariants}
							id='collection'
							className='scroll-mt-32'
						>
							<h2 className='text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3'>
								<div className='p-2 rounded-xl bg-blue-500/10 text-blue-500'>
									<Database className='h-6 w-6' />
								</div>
								1. Qanday ma'lumotlarni yig'amiz?
							</h2>
							<div className='space-y-4 text-muted-foreground text-lg leading-relaxed'>
								<p>
									Platformadan to'liq va sifatli foydalanishingizni ta'minlash
									maqsadida biz quyidagi shaxsiy ma'lumotlarni yig'ishimiz
									mumkin:
								</p>
								<ul className='list-none space-y-3 bg-muted/30 p-6 rounded-2xl border'>
									{[
										"Shaxsiy identifikatsiya: Ism-sharifingiz, universitetdagi talabalik ID raqamingiz, o'quv kursi va yo'nalishingiz.",
										"Aloqa ma'lumotlari: Elektron pochta manzili va Telegram profilingiz (bot orqali bog'lanish uchun).",
										'Platformadagi faollik: Qaysi darslarga qatnashganingiz, izohlar, reytinglar va video darslardagi faolligingiz.',
									].map((item, idx) => (
										<li key={idx} className='flex items-start gap-3'>
											<div className='h-2 w-2 rounded-full bg-blue-500 mt-2.5 flex-shrink-0'></div>
											<span className='text-foreground/80'>{item}</span>
										</li>
									))}
								</ul>
							</div>
						</motion.section>

						<Separator className='bg-border/50' />

						{/* 2. QANDAY FOYDALANAMIZ */}
						<motion.section
							variants={fadeUpVariants}
							id='usage'
							className='scroll-mt-32'
						>
							<h2 className='text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3'>
								<div className='p-2 rounded-xl bg-green-500/10 text-green-500'>
									<Eye className='h-6 w-6' />
								</div>
								2. Ma'lumotlardan qanday foydalanamiz?
							</h2>
							<div className='space-y-4 text-muted-foreground text-lg leading-relaxed'>
								<p>
									Biz yig'ilgan ma'lumotlardan faqatgina ta'lim jarayonini
									yaxshilash va platforma ishlashini barqarorlashtirish uchun
									foydalanamiz:
								</p>
								<ul className='list-none space-y-3 bg-muted/30 p-6 rounded-2xl border'>
									{[
										"Sizga eng mos keluvchi mentorlarni (yoki o'quvchilarni) tavsiya qilish.",
										"Dars vaqtlari va muhim o'zgarishlar haqida Telegram bot orqali tezkor eslatmalar yuborish.",
										"To'lovlarni xavfsiz va to'g'ri amalga oshirish.",
										'Platformadagi xatoliklarni tahlil qilish va umumiy sifatni oshirish.',
									].map((item, idx) => (
										<li key={idx} className='flex items-start gap-3'>
											<div className='h-2 w-2 rounded-full bg-green-500 mt-2.5 flex-shrink-0'></div>
											<span className='text-foreground/80'>{item}</span>
										</li>
									))}
								</ul>
							</div>
						</motion.section>

						<Separator className='bg-border/50' />

						{/* 3. UCHINCHI SHAXSLARGA UZATISH */}
						<motion.section
							variants={fadeUpVariants}
							id='sharing'
							className='scroll-mt-32'
						>
							<h2 className='text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3'>
								<div className='p-2 rounded-xl bg-orange-500/10 text-orange-500'>
									<Shield className='h-6 w-6' />
								</div>
								3. Uchinchi shaxslarga uzatish
							</h2>
							<div className='space-y-4 text-muted-foreground text-lg leading-relaxed'>
								<p>
									Biz sizning shaxsiy ma'lumotlaringizni{' '}
									<strong className='text-foreground'>hech qachon</strong>{' '}
									reklama agentliklariga yoki boshqa tijorat tashkilotlariga
									sotmaymiz. Ma'lumotlar faqat quyidagi zaruriy holatlardagina
									uchinchi shaxslarga berilishi mumkin:
								</p>
								<ul className='list-none space-y-3 bg-muted/30 p-6 rounded-2xl border'>
									{[
										"To'lov tizimlari: To'lovlarni amalga oshirish uchun kerakli tranzaksiya ma'lumotlari (Payme, Click kabi xizmatlarga).",
										"Universitet ma'muriyati: Agar talabalar reytingi yoki rasmiy davomat bilan bog'liq so'rov bo'lsa.",
										"Qonuniy talablar: Davlat organlarining rasmiy va qonuniy so'rovlari asosida.",
									].map((item, idx) => (
										<li key={idx} className='flex items-start gap-3'>
											<div className='h-2 w-2 rounded-full bg-orange-500 mt-2.5 flex-shrink-0'></div>
											<span className='text-foreground/80'>{item}</span>
										</li>
									))}
								</ul>
							</div>
						</motion.section>

						<Separator className='bg-border/50' />

						{/* 4. MA'LUMOTLAR XAVFSIZLIGI */}
						<motion.section
							variants={fadeUpVariants}
							id='security'
							className='scroll-mt-32'
						>
							<h2 className='text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3'>
								<div className='p-2 rounded-xl bg-purple-500/10 text-purple-500'>
									<Lock className='h-6 w-6' />
								</div>
								4. Ma'lumotlar xavfsizligi
							</h2>
							<div className='space-y-4 text-muted-foreground text-lg leading-relaxed bg-purple-500/5 p-6 rounded-2xl border border-purple-500/10'>
								<p>
									Biz sizning ma'lumotlaringizni himoya qilish uchun zamonaviy
									xavfsizlik choralarini qo'llaymiz. Barcha shaxsiy ma'lumotlar
									va xabarlar tarixi ishonchli ma'lumotlar bazalarida
									shifrlangan (encrypted) shaklda saqlanadi.
								</p>
								<p>
									Video darslar yozuvlari faqatgina dars ishtirokchilari uchun
									yopiq havolalar orqali ochiq bo'ladi va ularni ruxsatsiz
									yuklab olish qat'iyan man etiladi.
								</p>
							</div>
						</motion.section>

						<Separator className='bg-border/50' />

						{/* 5. FOYDALANUVCHI HUQUQLARI */}
						<motion.section
							variants={fadeUpVariants}
							id='rights'
							className='scroll-mt-32'
						>
							<h2 className='text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3'>
								<div className='p-2 rounded-xl bg-primary/10 text-primary'>
									<UserCog className='h-6 w-6' />
								</div>
								5. Sizning huquqlaringiz
							</h2>
							<div className='space-y-4 text-muted-foreground text-lg leading-relaxed'>
								<p>
									Foydalanuvchi sifatida siz o'z ma'lumotlaringiz ustidan to'liq
									nazoratga egasiz:
								</p>
								<ul className='list-none space-y-3 bg-muted/30 p-6 rounded-2xl border'>
									{[
										"O'z profilingizdagi ma'lumotlarni istalgan vaqtda ko'rish va tahrirlash.",
										"Noto'g'ri kiritilgan ma'lumotlarni o'zgartirishni so'rash.",
										"O'z hisobingizni (akkountingizni) va unga bog'liq barcha ma'lumotlarni platformadan butunlay o'chirib tashlash huquqi.",
									].map((item, idx) => (
										<li key={idx} className='flex items-start gap-3'>
											<div className='h-2 w-2 rounded-full bg-primary mt-2.5 flex-shrink-0'></div>
											<span className='text-foreground/80'>{item}</span>
										</li>
									))}
								</ul>
							</div>
						</motion.section>

						<Separator className='bg-border/50' />

						{/* 6. COOKIE FAYLLARI */}
						<motion.section
							variants={fadeUpVariants}
							id='cookies'
							className='scroll-mt-32'
						>
							<h2 className='text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3'>
								<div className='p-2 rounded-xl bg-yellow-500/10 text-yellow-500'>
									<Cookie className='h-6 w-6' />
								</div>
								6. Cookie fayllari (Cookies)
							</h2>
							<div className='space-y-4 text-muted-foreground text-lg leading-relaxed bg-yellow-500/5 p-6 rounded-2xl border border-yellow-500/10'>
								<p>
									Biz saytdan foydalanishni qulaylashtirish maqsadida Cookie
									fayllaridan foydalanamiz. Bu sizni tizimga har safar
									kirganingizda parolni qayta-qayta terishdan qutqaradi va
									interfeys sozlamalaringizni (masalan, Dark/Light mode) saqlab
									qoladi.
								</p>
								<p>
									Siz o'z brauzeringiz sozlamalari orqali Cookie fayllarini
									qabul qilishni rad etishingiz mumkin, ammo bu platformaning
									ayrim funksiyalari ishlashiga salbiy ta'sir ko'rsatishi
									mumkin.
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
