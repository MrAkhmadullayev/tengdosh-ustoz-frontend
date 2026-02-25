'use client'

import Footer from '@/components/landing/Footer'
import Navbar from '@/components/landing/Navbar'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
	AlertCircle,
	Cookie,
	Database,
	Eye,
	Lock,
	Shield,
	UserCog,
} from 'lucide-react'

export default function PrivacyPage() {
	const lastUpdated = '25-Fevral, 2026-yil'

	// Yon mundarija uchun ma'lumotlar
	const tocSections = [
		{
			id: 'collection',
			title: "Ma'lumotlarni yig'ish",
			icon: <Database className='h-4 w-4' />,
		},
		{
			id: 'usage',
			title: 'Qanday foydalanamiz',
			icon: <Eye className='h-4 w-4' />,
		},
		{
			id: 'sharing',
			title: 'Uchinchi shaxslarga uzatish',
			icon: <Shield className='h-4 w-4' />,
		},
		{
			id: 'security',
			title: "Ma'lumotlar xavfsizligi",
			icon: <Lock className='h-4 w-4' />,
		},
		{
			id: 'rights',
			title: 'Foydalanuvchi huquqlari',
			icon: <UserCog className='h-4 w-4' />,
		},
		{
			id: 'cookies',
			title: 'Cookie fayllari',
			icon: <Cookie className='h-4 w-4' />,
		},
	]

	// Silliq skroll (Smooth scroll) funksiyasi
	const scrollToSection = id => {
		const element = document.getElementById(id)
		if (element) {
			const y = element.getBoundingClientRect().top + window.scrollY - 100
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
						Maxfiylik Siyosati
					</h1>
					<p className='text-muted-foreground text-lg mb-4'>
						Sizning shaxsiy ma'lumotlaringiz xavfsizligi biz uchun eng muhim
						ustuvor vazifalardan biridir. Ushbu hujjat sizning ma'lumotlaringiz
						qanday yig'ilishi, saqlanishi va himoya qilinishini tushuntiradi.
					</p>
					<div className='flex items-center text-sm font-medium text-muted-foreground bg-muted w-fit px-3 py-1.5 rounded-full'>
						<AlertCircle className='h-4 w-4 mr-2 text-primary' />
						Oxirgi yangilanish: {lastUpdated}
					</div>
				</div>

				<div className='flex flex-col lg:flex-row gap-12 relative items-start'>
					{/* CHAP TOMON: STICKY MUNDARIJA */}
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

					{/* O'NG TOMON: ASOSIY MATN */}
					<div className='flex-1 space-y-12 max-w-4xl text-foreground leading-relaxed'>
						{/* 1. MA'LUMOTLARNI YIG'ISH */}
						<section id='collection' className='scroll-mt-28'>
							<h2 className='text-2xl font-bold mb-4 flex items-center gap-2'>
								1. Qanday ma'lumotlarni yig'amiz?
							</h2>
							<div className='space-y-4 text-muted-foreground'>
								<p>
									Platformadan to'liq va sifatli foydalanishingizni ta'minlash
									maqsadida biz quyidagi shaxsiy ma'lumotlarni yig'ishimiz
									mumkin:
								</p>
								<ul className='list-disc pl-6 space-y-2'>
									<li>
										<strong>Shaxsiy identifikatsiya:</strong> Ism-sharifingiz,
										universitetdagi talabalik ID raqamingiz, o'quv kursi va
										yo'nalishingiz.
									</li>
									<li>
										<strong>Aloqa ma'lumotlari:</strong> Elektron pochta manzili
										va Telegram profilingiz (bot orqali bog'lanish uchun).
									</li>
									<li>
										<strong>Platformadagi faollik:</strong> Qaysi darslarga
										qatnashganingiz, izohlar, reytinglar va video darslardagi
										faolligingiz.
									</li>
								</ul>
							</div>
						</section>

						<Separator />

						{/* 2. QANDAY FOYDALANAMIZ */}
						<section id='usage' className='scroll-mt-28'>
							<h2 className='text-2xl font-bold mb-4'>
								2. Ma'lumotlardan qanday foydalanamiz?
							</h2>
							<div className='space-y-4 text-muted-foreground'>
								<p>
									Biz yig'ilgan ma'lumotlardan faqatgina ta'lim jarayonini
									yaxshilash va platforma ishlashini barqarorlashtirish uchun
									foydalanamiz:
								</p>
								<ul className='list-disc pl-6 space-y-2'>
									<li>
										Sizga eng mos keluvchi mentorlarni (yoki o'quvchilarni)
										tavsiya qilish;
									</li>
									<li>
										Dars vaqtlari va muhim o'zgarishlar haqida Telegram bot
										orqali tezkor eslatmalar yuborish;
									</li>
									<li>To'lovlarni xavfsiz va to'g'ri amalga oshirish;</li>
									<li>
										Platformadagi xatoliklarni tahlil qilish va umumiy sifatni
										oshirish.
									</li>
								</ul>
							</div>
						</section>

						<Separator />

						{/* 3. UCHINCHI SHAXSLARGA UZATISH */}
						<section id='sharing' className='scroll-mt-28'>
							<h2 className='text-2xl font-bold mb-4'>
								3. Uchinchi shaxslarga uzatish
							</h2>
							<div className='space-y-4 text-muted-foreground'>
								<p>
									Biz sizning shaxsiy ma'lumotlaringizni{' '}
									<strong>hech qachon</strong> reklama agentliklariga yoki
									boshqa tijorat tashkilotlariga sotmaymiz. Ma'lumotlar faqat
									quyidagi zaruriy holatlardagina uchinchi shaxslarga berilishi
									mumkin:
								</p>
								<ul className='list-disc pl-6 space-y-2'>
									<li>
										<strong>To'lov tizimlari:</strong> To'lovlarni amalga
										oshirish uchun kerakli tranzaksiya ma'lumotlari (Payme,
										Click kabi xizmatlarga).
									</li>
									<li>
										<strong>Universitet ma'muriyati:</strong> Agar talabalar
										reytingi yoki rasmiy davomat bilan bog'liq so'rov bo'lsa.
									</li>
									<li>
										<strong>Qonuniy talablar:</strong> Davlat organlarining
										rasmiy va qonuniy so'rovlari asosida.
									</li>
								</ul>
							</div>
						</section>

						<Separator />

						{/* 4. MA'LUMOTLAR XAVFSIZLIGI */}
						<section id='security' className='scroll-mt-28'>
							<h2 className='text-2xl font-bold mb-4'>
								4. Ma'lumotlar xavfsizligi
							</h2>
							<div className='space-y-4 text-muted-foreground'>
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
						</section>

						<Separator />

						{/* 5. FOYDALANUVCHI HUQUQLARI */}
						<section id='rights' className='scroll-mt-28'>
							<h2 className='text-2xl font-bold mb-4'>
								5. Sizning huquqlaringiz
							</h2>
							<div className='space-y-4 text-muted-foreground'>
								<p>
									Foydalanuvchi sifatida siz o'z ma'lumotlaringiz ustidan to'liq
									nazoratga egasiz:
								</p>
								<ul className='list-disc pl-6 space-y-2'>
									<li>
										O'z profilingizdagi ma'lumotlarni istalgan vaqtda ko'rish va
										tahrirlash;
									</li>
									<li>
										Noto'g'ri kiritilgan ma'lumotlarni o'zgartirishni so'rash;
									</li>
									<li>
										O'z hisobingizni (akkountingizni) va unga bog'liq barcha
										ma'lumotlarni platformadan butunlay o'chirib tashlash
										huquqi.
									</li>
								</ul>
							</div>
						</section>

						<Separator />

						{/* 6. COOKIE FAYLLARI */}
						<section id='cookies' className='scroll-mt-28'>
							<h2 className='text-2xl font-bold mb-4'>
								6. Cookie fayllari (Cookies)
							</h2>
							<div className='space-y-4 text-muted-foreground'>
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
						</section>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	)
}
