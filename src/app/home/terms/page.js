'use client'

import Footer from '@/components/landing/Footer'
import Navbar from '@/components/landing/Navbar'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { motion, useScroll, useSpring } from 'framer-motion'
import {
	AlertCircle,
	BookOpen,
	Scale,
	ScrollText,
	ShieldAlert,
	UserCheck,
} from 'lucide-react'
import { useEffect, useState } from 'react'

const TOC_SECTIONS = [
	{ id: 'general', title: 'Umumiy qoidalar', icon: ScrollText },
	{ id: 'accounts', title: 'Hisob va Xavfsizlik', icon: UserCheck },
	{ id: 'mentors', title: 'Mentorlar majburiyatlari', icon: BookOpen },
	{ id: 'conduct', title: 'Taqiqlangan harakatlar', icon: ShieldAlert },
	{ id: 'liability', title: 'Javobgarlikni cheklash', icon: Scale },
]

export default function TermsPage() {
	const lastUpdated = '25-Fevral, 2026-yil'
	const [activeSection, setActiveSection] = useState('general')

	const { scrollYProgress } = useScroll()
	const scaleX = useSpring(scrollYProgress, {
		stiffness: 100,
		damping: 30,
		restDelta: 0.001,
	})

	useEffect(() => {
		const handleScroll = () => {
			const sectionElements = TOC_SECTIONS.map(s =>
				document.getElementById(s.id),
			)
			let currentActiveId = TOC_SECTIONS[0].id

			for (const el of sectionElements) {
				if (el) {
					const rect = el.getBoundingClientRect()
					if (rect.top <= 150) currentActiveId = el.id
				}
			}
			setActiveSection(currentActiveId)
		}

		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	const scrollToSection = id => {
		const element = document.getElementById(id)
		if (element) {
			const y = element.getBoundingClientRect().top + window.scrollY - 100
			window.scrollTo({ top: y, behavior: 'smooth' })
			setActiveSection(id)
		}
	}

	return (
		<div className='min-h-screen bg-background flex flex-col relative'>
			{/* 📏 Reading Progress Bar */}
			<motion.div
				className='fixed top-16 left-0 right-0 h-1 bg-primary z-50 origin-left'
				style={{ scaleX }}
			/>

			<Navbar />

			<main className='flex-1 container mx-auto px-4 py-12 md:py-20 max-w-7xl'>
				{/* 🏷️ Header Section */}
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					className='max-w-3xl mb-16'
				>
					<div className='flex items-center text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 w-fit px-3 py-1 rounded-md mb-6'>
						<AlertCircle className='h-3.5 w-3.5 mr-2' />
						Oxirgi yangilanish: {lastUpdated}
					</div>
					<h1 className='text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-foreground'>
						Foydalanish shartlari
					</h1>
					<p className='text-muted-foreground text-lg sm:text-xl leading-relaxed text-balance'>
						TengdoshUstoz platformasidan foydalanish qoidalari va yuridik
						majburiyatlar bilan tanishib chiqing.
					</p>
				</motion.div>

				<div className='flex flex-col lg:flex-row gap-12 items-start'>
					{/* 📑 Sidebar Navigation (Desktop) */}
					<aside className='hidden lg:block w-72 shrink-0 sticky top-28'>
						<Card className='border-border/50 shadow-sm bg-muted/20 backdrop-blur-sm rounded-xl'>
							<CardContent className='p-5'>
								<h3 className='font-bold text-xs uppercase tracking-widest text-muted-foreground mb-4'>
									Mundarija
								</h3>
								<nav className='flex flex-col space-y-1'>
									{TOC_SECTIONS.map(section => {
										const Icon = section.icon
										const isActive = activeSection === section.id

										return (
											<button
												key={section.id}
												onClick={() => scrollToSection(section.id)}
												className={cn(
													'flex items-center gap-3 text-sm font-medium transition-all px-3 py-2 rounded-lg text-left',
													isActive
														? 'text-primary bg-primary/5 shadow-sm ring-1 ring-primary/10'
														: 'text-muted-foreground hover:text-foreground hover:bg-muted',
												)}
											>
												<Icon
													className={cn(
														'h-4 w-4',
														isActive ? 'text-primary' : 'opacity-60',
													)}
												/>
												<span className='truncate'>{section.title}</span>
											</button>
										)
									})}
								</nav>
							</CardContent>
						</Card>
					</aside>

					{/* 📖 Content Area */}
					<div className='flex-1 space-y-16 max-w-3xl'>
						{/* 1. UMUMIY QOIDALAR */}
						<section id='general' className='scroll-mt-32 space-y-6'>
							<div className='flex items-center gap-3'>
								<div className='p-2.5 rounded-lg bg-primary/10 text-primary'>
									<ScrollText className='h-5 w-5' />
								</div>
								<h2 className='text-2xl font-bold'>1. Umumiy qoidalar</h2>
							</div>
							<div className='space-y-4 text-muted-foreground leading-relaxed text-base sm:text-lg'>
								<p>
									1.1. Ushbu Foydalanish shartlari "TengdoshUstoz"
									platformasidan foydalanish tartibini belgilaydi.
								</p>
								<p>
									1.2. Ro'yxatdan o'tish orqali siz ushbu Shartlarga to'liq
									rozilik bildirasiz.
								</p>
								<p>
									1.3. Ma'muriyat Shartlarni istalgan vaqtda o'zgartirish
									huquqini saqlab qoladi.
								</p>
							</div>
						</section>

						<Separator className='opacity-50' />

						{/* 2. HISOB VA XAVFSIZLIK */}
						<section id='accounts' className='scroll-mt-32 space-y-6'>
							<div className='flex items-center gap-3'>
								<div className='p-2.5 rounded-lg bg-primary/10 text-primary'>
									<UserCheck className='h-5 w-5' />
								</div>
								<h2 className='text-2xl font-bold'>2. Hisob va Xavfsizlik</h2>
							</div>
							<div className='space-y-4 text-muted-foreground leading-relaxed text-base sm:text-lg'>
								<p>
									2.1. Foydalanuvchi haqiqiy ma'lumotlarni taqdim etishi shart.
								</p>
								<p>
									2.2. Akkount xavfsizligi va parollar maxfiyligi uchun
									foydalanuvchi shaxsan javobgar.
								</p>
								<p>
									2.3. Bitta hisobdan bir necha kishi foydalanishi taqiqlanadi.
								</p>
							</div>
						</section>

						<Separator className='opacity-50' />

						{/* 3. MENTORLAR */}
						<section id='mentors' className='scroll-mt-32 space-y-6'>
							<div className='flex items-center gap-3'>
								<div className='p-2.5 rounded-lg bg-primary/10 text-primary'>
									<BookOpen className='h-5 w-5' />
								</div>
								<h2 className='text-2xl font-bold'>
									3. Mentorlar majburiyatlari
								</h2>
							</div>
							<div className='space-y-4 text-muted-foreground leading-relaxed text-base sm:text-lg'>
								<p>
									<strong className='text-foreground'>Sifat nazorati:</strong>{' '}
									Mentor darslarni belgilangan vaqtda va yuqori sifatda o'tishi
									kerak.
								</p>
								<p>
									<strong className='text-foreground'>Odob-axloq:</strong>{' '}
									O'quvchilarga nisbatan hurmatsizlik qilish profil
									bloklanishiga sabab bo'ladi.
								</p>
							</div>
						</section>

						<Separator className='opacity-50' />

						{/* 4. TAQIQLANGAN HARAKATLAR */}
						<section id='conduct' className='scroll-mt-32 space-y-6'>
							<div className='flex items-center gap-3'>
								<div className='p-2.5 rounded-lg bg-destructive/10 text-destructive'>
									<ShieldAlert className='h-5 w-5' />
								</div>
								<h2 className='text-2xl font-bold text-destructive'>
									4. Taqiqlangan harakatlar
								</h2>
							</div>
							<div className='bg-destructive/5 border border-destructive/10 rounded-xl p-6 space-y-4 text-sm sm:text-base'>
								<p className='font-semibold text-destructive/80 italic'>
									Quyidagilar qat'iyan man etiladi:
								</p>
								<ul className='grid gap-3'>
									{[
										'Platformadan tashqarida moliyaviy kelishuvlar qilish.',
										"Foydalanuvchilarning shaxsiy ma'lumotlarini ruxsatsiz yig'ish.",
										"Spam, reklama va ta'limga aloqador bo'lmagan kontent tarqatish.",
										"Dars davomida haqoratli yoki nojo'ya xatti-harakatlar qilish.",
									].map((item, i) => (
										<li key={i} className='flex gap-3 text-muted-foreground'>
											<div className='h-1.5 w-1.5 rounded-full bg-destructive mt-1.5 shrink-0' />
											<span>{item}</span>
										</li>
									))}
								</ul>
							</div>
						</section>

						<Separator className='opacity-50' />

						{/* 5. JAVOBGARLIK */}
						<section id='liability' className='scroll-mt-32 space-y-6 pb-20'>
							<div className='flex items-center gap-3'>
								<div className='p-2.5 rounded-lg bg-primary/10 text-primary'>
									<Scale className='h-5 w-5' />
								</div>
								<h2 className='text-2xl font-bold'>
									5. Javobgarlikni cheklash
								</h2>
							</div>
							<div className='space-y-4 text-muted-foreground leading-relaxed text-base sm:text-lg'>
								<p>
									5.1. Platforma mentorlar tomonidan berilayotgan barcha
									ma'lumotlarning aniqligiga 100% javob bermaydi.
								</p>
								<p>
									5.2. Texnik uzilishlar yoki fors-major holatlari uchun yuridik
									javobgarlik olinmaydi.
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
