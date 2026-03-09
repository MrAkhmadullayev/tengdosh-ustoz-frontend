'use client'

import Footer from '@/components/landing/Footer'
import Navbar from '@/components/landing/Navbar'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { motion, useScroll, useSpring } from 'framer-motion'
import {
	AlertCircle,
	Cookie,
	Database,
	Eye,
	Lock,
	Shield,
	UserCog,
} from 'lucide-react'
import { useEffect, useState } from 'react'

const TOC_SECTIONS = [
	{
		id: 'collection',
		title: "Ma'lumotlarni yig'ish",
		icon: Database,
		color: 'text-blue-500',
		bg: 'bg-blue-500/10',
	},
	{
		id: 'usage',
		title: 'Qanday foydalanamiz',
		icon: Eye,
		color: 'text-green-500',
		bg: 'bg-green-500/10',
	},
	{
		id: 'sharing',
		title: "Ma'lumotlarni uzatish",
		icon: Shield,
		color: 'text-orange-500',
		bg: 'bg-orange-500/10',
	},
	{
		id: 'security',
		title: 'Xavfsizlik choralari',
		icon: Lock,
		color: 'text-purple-500',
		bg: 'bg-purple-500/10',
	},
	{
		id: 'rights',
		title: 'Sizning huquqlaringiz',
		icon: UserCog,
		color: 'text-primary',
		bg: 'bg-primary/10',
	},
	{
		id: 'cookies',
		title: 'Cookie fayllari',
		icon: Cookie,
		color: 'text-amber-500',
		bg: 'bg-amber-500/10',
	},
]

export default function PrivacyPage() {
	const lastUpdated = '25-Fevral, 2026-yil'
	const [activeSection, setActiveSection] = useState('collection')

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
						Maxfiylik Siyosati
					</h1>
					<p className='text-muted-foreground text-lg sm:text-xl leading-relaxed text-balance'>
						TengdoshUstoz platformasi sizning shaxsiy ma'lumotlaringiz
						maxfiyligini qat'iy himoya qiladi. Biz bilan ma'lumotlaringiz
						xavfsiz qo'llarda.
					</p>
				</motion.div>

				<div className='flex flex-col lg:flex-row gap-12 items-start'>
					{/* 📑 Sidebar Navigation */}
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
														isActive ? section.color : 'opacity-60',
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
						{/* 1. MA'LUMOTLARNI YIG'ISH */}
						<section id='collection' className='scroll-mt-32 space-y-6'>
							<div className='flex items-center gap-3'>
								<div className='p-2.5 rounded-lg bg-blue-500/10 text-blue-500'>
									<Database className='h-5 w-5' />
								</div>
								<h2 className='text-2xl font-bold text-foreground'>
									1. Qanday ma'lumotlarni yig'amiz?
								</h2>
							</div>
							<div className='space-y-4 text-muted-foreground leading-relaxed text-base sm:text-lg'>
								<p>
									Platformadan to'liq va sifatli foydalanishingizni ta'minlash
									maqsadida biz quyidagi ma'lumotlarni yig'ishimiz mumkin:
								</p>

								<ul className='grid gap-3 bg-muted/30 p-6 rounded-xl border border-border/50'>
									{[
										"Ism-sharif, talabalik ID raqami va o'quv yo'nalishi.",
										'Elektron pochta va Telegram identifikatori.',
										"Darslardagi faollik va o'zaro chat xabarlari.",
									].map((item, i) => (
										<li
											key={i}
											className='flex gap-3 text-sm sm:text-base text-foreground/80'
										>
											<div className='h-1.5 w-1.5 rounded-full bg-blue-500 mt-2 shrink-0' />
											<span>{item}</span>
										</li>
									))}
								</ul>
							</div>
						</section>

						<Separator className='opacity-50' />

						{/* 2. FOYDALANISH MAQSADI */}
						<section id='usage' className='scroll-mt-32 space-y-6'>
							<div className='flex items-center gap-3'>
								<div className='p-2.5 rounded-lg bg-green-500/10 text-green-500'>
									<Eye className='h-5 w-5' />
								</div>
								<h2 className='text-2xl font-bold text-foreground'>
									2. Ma'lumotlardan foydalanish
								</h2>
							</div>
							<div className='space-y-4 text-muted-foreground leading-relaxed text-base sm:text-lg'>
								<p>
									Yig'ilgan ma'lumotlar faqat ta'lim sifatini oshirish va
									xavfsizlikni ta'minlash uchun ishlatiladi:
								</p>
								<ul className='grid gap-3 bg-muted/30 p-6 rounded-xl border border-border/50'>
									{[
										"Sizga mos mentorlar va o'quv kurslarini tavsiya etish.",
										'Dars vaqtlari haqida eslatmalar yuborish.',
										'Tizimdagi texnik xatoliklarni tahlil qilish va bartaraf etish.',
									].map((item, i) => (
										<li
											key={i}
											className='flex gap-3 text-sm sm:text-base text-foreground/80'
										>
											<div className='h-1.5 w-1.5 rounded-full bg-green-500 mt-2 shrink-0' />
											<span>{item}</span>
										</li>
									))}
								</ul>
							</div>
						</section>

						<Separator className='opacity-50' />

						{/* 3. XAVFSIZLIK */}
						<section id='security' className='scroll-mt-32 space-y-6'>
							<div className='flex items-center gap-3'>
								<div className='p-2.5 rounded-lg bg-purple-500/10 text-purple-500'>
									<Lock className='h-5 w-5' />
								</div>
								<h2 className='text-2xl font-bold text-foreground'>
									3. Ma'lumotlar xavfsizligi
								</h2>
							</div>
							<div className='space-y-4 text-muted-foreground leading-relaxed text-base sm:text-lg'>
								<p>
									Biz barcha shaxsiy ma'lumotlarni shifrlangan (encrypted)
									shaklda saqlaymiz. Video darslar yozuvlari faqat dars
									ishtirokchilari uchun yopiq havolalar orqali taqdim etiladi.
								</p>
							</div>
						</section>

						<Separator className='opacity-50' />

						{/* 4. COOKIES */}
						<section id='cookies' className='scroll-mt-32 space-y-6 pb-20'>
							<div className='flex items-center gap-3'>
								<div className='p-2.5 rounded-lg bg-amber-500/10 text-amber-500'>
									<Cookie className='h-5 w-5' />
								</div>
								<h2 className='text-2xl font-bold text-foreground'>
									4. Cookie fayllari
								</h2>
							</div>
							<div className='p-6 bg-amber-500/5 border border-amber-500/10 rounded-xl space-y-4 text-sm sm:text-base text-muted-foreground'>
								<p>
									Biz platformadan foydalanishni qulaylashtirish (masalan,
									tizimga avtomatik kirish va til sozlamalarini saqlash) uchun
									kuki-fayllardan foydalanamiz.
								</p>
								<p className='italic'>
									Siz brauzer sozlamalari orqali kuki-fayllarni rad etishingiz
									mumkin, ammo bu saytning ayrim funksiyalari ishlashiga ta'sir
									qilishi mumkin.
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
