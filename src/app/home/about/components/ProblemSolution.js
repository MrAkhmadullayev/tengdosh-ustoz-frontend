'use client'

import { useTranslation } from '@/lib/i18n'
import { motion } from 'framer-motion'
import { Lightbulb, Target } from 'lucide-react'

export default function ProblemSolution() {
	const { t } = useTranslation()

	return (
		<section className='w-full py-20 container mx-auto px-4 max-w-5xl'>
			<div className='grid md:grid-cols-2 gap-6 lg:gap-10'>
				{/* Muammo */}
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					whileInView={{ opacity: 1, x: 0 }}
					viewport={{ once: true }}
					className='p-8 rounded-xl bg-destructive/5 border border-destructive/10 space-y-4'
				>
					<div className='inline-flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10 text-destructive mb-2'>
						<Target className='h-6 w-6' />
					</div>
					<h2 className='text-2xl font-bold text-foreground'>
						{t('aboutPage.problemTitle') || 'Mavjud Muammo'}
					</h2>
					<p className='text-sm sm:text-base text-muted-foreground leading-relaxed'>
						{t('aboutPage.problemDesc') ||
							"Ko'plab talabalar dars jarayonida tushunmagan mavzularini so'rashga istihola qilishadi yoki repetitor uchun yetarli mablag'ga ega bo'lishmaydi."}
					</p>
				</motion.div>

				{/* Yechim */}
				<motion.div
					initial={{ opacity: 0, x: 20 }}
					whileInView={{ opacity: 1, x: 0 }}
					viewport={{ once: true }}
					className='p-8 rounded-xl bg-green-500/5 border border-green-500/10 space-y-4'
				>
					<div className='inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10 text-green-600 mb-2'>
						<Lightbulb className='h-6 w-6' />
					</div>
					<h2 className='text-2xl font-bold text-foreground'>
						{t('aboutPage.solutionTitle') || 'Bizning Yechim'}
					</h2>
					<p className='text-sm sm:text-base text-muted-foreground leading-relaxed'>
						{t('aboutPage.solutionDesc') ||
							"Biz talabalarni bir-biri bilan bog'laymiz. Bilimni o'z tengdoshidan, sodda tilda va bepul o'rganish — bu eng samarali ta'lim usulidir."}
					</p>
				</motion.div>
			</div>
		</section>
	)
}
