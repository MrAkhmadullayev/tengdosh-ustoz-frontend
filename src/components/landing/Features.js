'use client'

import { useTranslation } from '@/lib/i18n'
import { motion } from 'framer-motion'
import { BookOpenCheck, FileCode2, TrendingUp, Users } from 'lucide-react'

export default function Features() {
	const { t } = useTranslation()

	const FEATURES = [
		{
			title: t('features.mentors.title') || 'Tajribali Mentorlar',
			desc:
				t('features.mentors.desc') ||
				"O'z sohasining yetuk mutaxassislaridan to'g'ridan-to'g'ri bilim oling.",
			icon: Users,
		},
		{
			title: t('features.problems.title') || 'Amaliy topshiriqlar',
			desc:
				t('features.problems.desc') ||
				'Haqiqiy loyihalar va muammolar ustida ishlash orqali tajriba orttiring.',
			icon: FileCode2,
		},
		{
			title: t('features.tests.title') || 'Bilimni sinash',
			desc:
				t('features.tests.desc') ||
				"Maxsus testlar va interaktiv savollar yordamida o'z darajangizni aniqlang.",
			icon: BookOpenCheck,
		},
		{
			title: t('features.growth.title') || "Doimiy o'sish",
			desc:
				t('features.growth.desc') ||
				"Karyerangizni rivojlantirish uchun to'g'ri yo'llanma va maslahatlar oling.",
			icon: TrendingUp,
		},
	]

	const containerVariants = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: { staggerChildren: 0.1 },
		},
	}

	const cardVariants = {
		hidden: { opacity: 0, y: 15 },
		show: {
			opacity: 1,
			y: 0,
			transition: { type: 'spring', stiffness: 300, damping: 24 },
		},
	}

	return (
		<section className='relative w-full py-20 md:py-32 bg-background overflow-hidden'>
			{/* 🌟 Vercel Grid Background (Subtle) */}
			<div className='absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] -z-10 pointer-events-none' />

			<div className='container mx-auto px-4 md:px-8 max-w-6xl'>
				{/* 🏷️ Header */}
				<div className='max-w-2xl mx-auto text-center mb-16 space-y-3'>
					<motion.h2
						initial={{ opacity: 0, y: -10 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.4 }}
						className='text-3xl md:text-4xl font-extrabold tracking-tight text-foreground'
					>
						{t('features.title') || 'Platforma Imkoniyatlari'}
					</motion.h2>
					<motion.p
						initial={{ opacity: 0, y: 10 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.4, delay: 0.1 }}
						className='text-muted-foreground text-base sm:text-lg leading-relaxed'
					>
						{t('features.subtitle') ||
							"Sizning muvaffaqiyatingiz uchun zarur bo'lgan barcha vositalar bitta joyda jamlangan."}
					</motion.p>
				</div>

				{/* 🗂️ Grid Cards */}
				<motion.div
					variants={containerVariants}
					initial='hidden'
					whileInView='show'
					viewport={{ once: true, margin: '-50px' }}
					className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'
				>
					{FEATURES.map((item, idx) => {
						const Icon = item.icon

						return (
							<motion.div
								key={idx}
								variants={cardVariants}
								className='group relative p-6 rounded-xl border bg-card shadow-sm hover:shadow-md transition-all duration-300'
							>
								{/* Icon Container */}
								<div className='mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 transition-colors duration-300 group-hover:bg-primary'>
									<Icon className='h-5 w-5 text-primary transition-colors duration-300 group-hover:text-primary-foreground' />
								</div>

								{/* Content */}
								<h3 className='mb-2 text-lg font-semibold text-foreground tracking-tight'>
									{item.title}
								</h3>
								<p className='text-sm text-muted-foreground leading-relaxed text-balance'>
									{item.desc}
								</p>
							</motion.div>
						)
					})}
				</motion.div>
			</div>
		</section>
	)
}
