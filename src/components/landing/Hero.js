'use client'

import { Button } from '@/components/ui/button'
import { containerVariants, itemVariants } from '@/lib/constants'
import { useTranslation } from '@/lib/i18n'
import { motion } from 'framer-motion'
import { ArrowDown, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

export default function Hero() {
	const router = useRouter()
	const { t } = useTranslation()
	const [isPending, startTransition] = useTransition()
	const [isNavigating, setIsNavigating] = useState(false)

	const handleNavigation = () => {
		setIsNavigating(true)
		startTransition(() => {
			router.push('/home/about')
		})
	}

	return (
		<section className='relative flex w-full flex-col items-center justify-center overflow-hidden px-4 py-20 text-center md:py-32 lg:py-40'>
			{/* 🌟 Vercel Style Background Glow */}
			<div className='absolute top-0 z-[-1] h-full w-full bg-background bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(var(--primary-rgb),0.15),rgba(255,255,255,0))]' />

			<motion.div
				variants={containerVariants}
				initial='hidden'
				animate='show'
				className='z-10 flex w-full max-w-4xl flex-col items-center'
			>
				{/* Kichik tepa yozuv (Badge/Tag) */}
				<motion.div
					variants={itemVariants}
					className='mb-6 inline-flex items-center rounded-full border border-border/50 bg-muted/50 px-4 py-1.5 text-xs font-semibold text-muted-foreground backdrop-blur-sm transition-colors hover:bg-muted/80'
				>
					{t('landing.heroTag') || 'Platformaga xush kelibsiz'}
				</motion.div>

				{/* Asosiy Sarlavha */}
				<motion.h1
					variants={itemVariants}
					className='mb-6 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl'
				>
					{t('landing.heroTitle') || 'Bilim ulashing va '}{' '}
					<span className='inline-block text-primary'>
						{t('landing.heroTitleHighlight') || "o'rganing"}
					</span>
				</motion.h1>

				{/* Ostki matn (Description) */}
				<motion.p
					variants={itemVariants}
					className='mb-8 max-w-2xl text-balance text-muted-foreground md:text-xl leading-relaxed'
				>
					{t('landing.heroDesc') ||
						"TengdoshUstoz - bu talabalar va o'z sohasining mutaxassislari o'zaro tajriba almashadigan, sifatli ta'lim muhitini yaratuvchi innovatsion platforma."}
				</motion.p>

				{/* Harakat tugmasi (Call to Action) */}
				<motion.div variants={itemVariants}>
					<Button
						size='lg'
						onClick={handleNavigation}
						disabled={isPending || isNavigating}
						className='group w-[180px] font-semibold transition-all sm:w-[200px]'
					>
						{isPending || isNavigating ? (
							<>
								<Loader2 className='mr-2 h-4 w-4 animate-spin' />
								{t('landing.heroButtonLoading') || 'Kutilmoqda...'}
							</>
						) : (
							<>
								{t('landing.heroButton') || 'Batafsil'}
								<ArrowDown className='ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-y-1' />
							</>
						)}
					</Button>
				</motion.div>
			</motion.div>
		</section>
	)
}
