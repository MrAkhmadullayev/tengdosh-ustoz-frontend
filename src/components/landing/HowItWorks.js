'use client'

import { useTranslation } from '@/lib/i18n'
import { motion } from 'framer-motion'

export default function HowItWorks() {
	const { t } = useTranslation()

	// Tarjimalar topilmagan holat uchun fallback (zaxira) matnlar
	const STEPS = [
		t('howItWorks.step1') || "Ro'yxatdan o'ting va profilingizni to'ldiring",
		t('howItWorks.step2') || "O'zingizga mos mentor yoki o'quvchini toping",
		t('howItWorks.step3') || 'Dars vaqtini belgilang va ulaning',
		t('howItWorks.step4') || 'Bilim oling va reytingingizni oshiring',
	]

	const containerVariants = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: { staggerChildren: 0.1 },
		},
	}

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		show: {
			opacity: 1,
			y: 0,
			transition: { type: 'spring', stiffness: 300, damping: 24 },
		},
	}

	return (
		<section className='w-full py-20 md:py-32 bg-background border-t'>
			<div className='container mx-auto px-4 md:px-8 max-w-5xl'>
				{/* 🏷️ Sarlavha */}
				<div className='text-center mb-16 space-y-4'>
					<motion.h2
						initial={{ opacity: 0, y: -20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
						className='text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground'
					>
						{t('howItWorks.title') || 'Platforma qanday ishlaydi?'}
					</motion.h2>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.1 }}
						className='text-muted-foreground text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed text-balance'
					>
						{t('howItWorks.intro') ||
							"TengdoshUstoz orqali bilim ulashish va o'rganish juda oson. Barchasi 4 ta oddiy qadamda amalga oshadi."}
					</motion.p>
				</div>

				{/* 👣 Qadamlar */}
				<motion.div
					variants={containerVariants}
					initial='hidden'
					whileInView='show'
					viewport={{ once: true, margin: '-50px' }}
					className='grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6'
				>
					{STEPS.map((step, idx) => (
						<motion.div
							key={idx}
							variants={itemVariants}
							className='flex flex-col sm:flex-row items-start gap-4 p-6 sm:p-8 rounded-xl border bg-card shadow-sm hover:shadow-md hover:border-primary/30 transition-all group'
						>
							{/* Raqamli indikator */}
							<div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300'>
								{idx + 1}
							</div>

							{/* Matn qismi */}
							<div className='space-y-1.5 mt-1 sm:mt-0.5'>
								<span className='text-xs font-bold uppercase tracking-wider text-muted-foreground'>
									{t('howItWorks.step', { number: idx + 1 }) ||
										`${idx + 1}-qadam`}
								</span>
								<p className='text-foreground font-semibold text-base sm:text-lg leading-snug'>
									{step}
								</p>
							</div>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	)
}
