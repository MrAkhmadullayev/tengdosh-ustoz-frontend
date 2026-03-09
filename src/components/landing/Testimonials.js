'use client'

import { useTranslation } from '@/lib/i18n'
import { motion } from 'framer-motion'
import { MessageSquareQuote } from 'lucide-react'

export default function Testimonials() {
	const { t } = useTranslation()

	// Tarjimalar topilmagan holat uchun zaxira (fallback) matnlar
	const rawReviews = t('testimonials.reviews', { returnObjects: true })
	const REVIEWS =
		Array.isArray(rawReviews) && rawReviews.length > 0
			? rawReviews
			: [
					"TengdoshUstoz orqali o'zimga kerakli mentorni topdim va qisqa vaqt ichida dasturlashni o'rgandim. Juda zo'r platforma!",
					'Darslar amaliyotga asoslangani uchun tezroq natijaga erishyapman. Ustozlarga kattakon rahmat.',
					"Platformaning qulayligi va mentorlarning samimiyligi menga juda yoqdi. O'z ustimda ishlashim uchun zo'r muhit.",
					"Boshqa kurslardan farqli o'laroq, bu yerda doimiy yordam va to'g'ri yo'llanma olish imkoni bor.",
				]

	return (
		<section className='relative w-full py-20 md:py-32 bg-background border-t overflow-hidden'>
			{/* 🏷️ Header */}
			<div className='container mx-auto px-4 md:px-8 mb-12 sm:mb-16 text-center max-w-2xl'>
				<h2 className='text-3xl md:text-4xl font-extrabold tracking-tight text-foreground'>
					{t('testimonials.title') || 'Foydalanuvchilarimiz fikrlari'}
				</h2>
				<p className='mt-4 text-muted-foreground text-base sm:text-lg'>
					{t('testimonials.subtitle') ||
						"Platformamiz orqali bilim olib, o'z maqsadlariga yetayotgan talabalarimiz nima deydi?"}
				</p>
			</div>

			{/* 🔄 Infinite Marquee (Karusel) */}
			<div className='relative w-full flex overflow-hidden'>
				{/* Xiralashtirish (Fade Edges) */}
				<div className='absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none' />
				<div className='absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none' />

				<motion.div
					animate={{ x: ['0%', '-50%'] }}
					transition={{ repeat: Infinity, ease: 'linear', duration: 40 }}
					className='flex gap-4 md:gap-6 w-max px-4 md:px-6'
				>
					{/* Karusel uzluksiz ishlashi uchun massivni 2 marta ulaymiz */}
					{[...REVIEWS, ...REVIEWS].map((text, i) => (
						<div
							key={i}
							className='w-[280px] md:w-[400px] bg-card p-6 md:p-8 rounded-xl border shadow-sm flex-shrink-0 flex flex-col justify-between transition-colors hover:border-primary/20'
						>
							<MessageSquareQuote className='w-6 h-6 md:w-8 md:h-8 text-muted-foreground/20 mb-4 shrink-0' />
							<p className='text-foreground/80 text-sm md:text-base leading-relaxed font-medium'>
								"{text}"
							</p>
						</div>
					))}
				</motion.div>
			</div>
		</section>
	)
}
