'use client'

import { Card, CardContent } from '@/components/ui/card'
import { useTranslation } from '@/lib/i18n'
import { motion } from 'framer-motion'
import { Rocket, ShieldCheck, Target, Users } from 'lucide-react'

export default function Benefits() {
	const { t } = useTranslation()

	// Massiv ekanligini tekshirish uchun yordamchi funksiya
	const getArray = (key, fallback) => {
		const data = t(key, { returnObjects: true })
		return Array.isArray(data) ? data : fallback
	}

	const BENEFITS = [
		{
			type: t('aboutPage.benefits.students.type') || 'Talabalar uchun',
			icon: Users,
			color: 'text-blue-500',
			bg: 'bg-blue-500/10',
			list: getArray('aboutPage.benefits.students.list', [
				'Sifatli bilim olish imkoniyati',
				"Sodda va tushunarli tilda o'rganish",
				'Bepul darslar va muloqot',
			]),
		},
		{
			type: t('aboutPage.benefits.mentors.type') || 'Mentorlar uchun',
			icon: Rocket,
			color: 'text-orange-500',
			bg: 'bg-orange-500/10',
			list: getArray('aboutPage.benefits.mentors.list', [
				"O'z bilimini mustahkamlash",
				'Nutq va yetakchilik qobiliyatini oshirish',
				'Tizimda reyting va tanilish',
			]),
		},
		{
			type: t('aboutPage.benefits.university.type') || 'Universitet uchun',
			icon: Target,
			color: 'text-purple-500',
			bg: 'bg-purple-500/10',
			list: getArray('aboutPage.benefits.university.list', [
				"O'zlashtirish ko'rsatkichining oshishi",
				"Talabalar orasida do'stona muhit",
				'Zamonaviy raqamli hamjamiyat',
			]),
		},
	]

	return (
		<section className='w-full py-20 bg-muted/30'>
			<div className='container mx-auto px-4 max-w-6xl text-center'>
				<h2 className='text-3xl font-bold mb-12 tracking-tight'>
					{t('aboutPage.benefitsTitle') || 'Har bir tomon uchun foydali'}
				</h2>

				<div className='grid md:grid-cols-3 gap-6'>
					{BENEFITS.map((item, idx) => (
						<motion.div
							key={idx}
							initial={{ opacity: 0, y: 15 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: idx * 0.1 }}
							className='h-full'
						>
							<Card className='h-full border-border bg-card shadow-sm hover:shadow-md transition-all group'>
								<CardContent className='p-8 text-left space-y-4'>
									<div
										className={`h-12 w-12 ${item.bg} rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}
									>
										<item.icon className={`h-6 w-6 ${item.color}`} />
									</div>
									<h3 className='text-lg font-bold text-foreground'>
										{item.type}
									</h3>
									<ul className='space-y-3 pt-2'>
										{/* BU YERDA XATOLIK OLDINI OLINDI */}
										{item.list.map((listItem, i) => (
											<li
												key={i}
												className='flex items-start gap-3 text-sm text-muted-foreground font-medium'
											>
												<ShieldCheck className='h-4 w-4 text-primary shrink-0 mt-0.5' />
												<span>{listItem}</span>
											</li>
										))}
									</ul>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	)
}
