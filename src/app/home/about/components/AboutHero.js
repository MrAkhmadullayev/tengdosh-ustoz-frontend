'use client'

import { Badge } from '@/components/ui/badge'
import { useTranslation } from '@/lib/i18n'
import { motion } from 'framer-motion'

export default function AboutHero() {
	const { t } = useTranslation()

	return (
		<section className='relative w-full py-20 md:py-32 border-b overflow-hidden bg-muted/10'>
			<div className='absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[100px] -z-10' />

			<div className='container mx-auto px-4 text-center max-w-4xl relative z-10'>
				<motion.div
					initial={{ opacity: 0, y: 15 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<Badge
						variant='secondary'
						className='mb-6 px-4 py-1.5 text-xs font-bold uppercase tracking-wider shadow-none'
					>
						{t('aboutPage.missionBadge') || 'Bizning Missiyamiz'}
					</Badge>
					<h1 className='text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-foreground text-balance leading-[1.1]'>
						{t('aboutPage.heroTitle') || 'Bilim ulashish orqali '}
						<span className='text-primary block sm:inline'>
							{t('aboutPage.heroTitleHighlight') || 'kuchli jamiyat qurish'}
						</span>
					</h1>
					<p className='text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed text-balance max-w-2xl mx-auto'>
						{t('aboutPage.heroDesc') ||
							"TengdoshUstoz — bu universitet talabalari o'rtasida tajriba almashish va bir-biriga yordam berish madaniyatini shakllantiruvchi innovatsion platformadir."}
					</p>
				</motion.div>
			</div>
		</section>
	)
}
