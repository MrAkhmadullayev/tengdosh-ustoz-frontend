'use client'

import { useTranslation } from '@/lib/i18n'
import { animate, motion, useInView } from 'framer-motion'
import { Award, Users, Video } from 'lucide-react'
import { useEffect, useRef } from 'react'

// Sanoq animatsiyasi
function AnimatedCounter({ from = 0, to, duration = 2 }) {
	const nodeRef = useRef(null)
	const inView = useInView(nodeRef, { once: true, margin: '-50px' })

	useEffect(() => {
		if (inView) {
			const controls = animate(from, to, {
				duration: duration,
				ease: 'easeOut',
				onUpdate(value) {
					if (nodeRef.current) {
						nodeRef.current.textContent =
							Math.round(value).toLocaleString('en-US')
					}
				},
			})
			return () => controls.stop()
		}
	}, [from, to, inView, duration])

	return <span ref={nodeRef} />
}

export default function Statistics() {
	const { t } = useTranslation()

	const STATS = [
		{
			id: 1,
			value: 19967,
			label: t('statistics.totalStudents') || 'Faol talabalar',
			prefix: '+',
			suffix: '',
			icon: Users,
		},
		{
			id: 2,
			value: 768,
			label: t('statistics.totalLessons') || "O'tilgan darslar",
			prefix: '+',
			suffix: '',
			icon: Video,
		},
		{
			id: 3,
			value: 7,
			label: t('statistics.teamExperience') || 'Yillik tajriba',
			prefix: '+',
			suffix: t('statistics.yearSuffix') || ' yil',
			icon: Award,
		},
	]

	const containerVariants = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: { staggerChildren: 0.15 },
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
		<section className='relative w-full py-16 md:py-24 bg-background'>
			{/* Sokin Orqa fon Glow */}
			<div className='absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(var(--primary-rgb),0.05),transparent)]' />

			<div className='container mx-auto px-4 md:px-8 max-w-6xl'>
				<motion.div
					variants={containerVariants}
					initial='hidden'
					whileInView='show'
					viewport={{ once: true, margin: '-50px' }}
					className='grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border bg-card border rounded-xl shadow-sm p-8 lg:p-12'
				>
					{STATS.map(stat => {
						const Icon = stat.icon

						return (
							<motion.div
								key={stat.id}
								variants={itemVariants}
								className='group flex flex-col items-center text-center space-y-2 pt-8 sm:pt-0 first:pt-0'
							>
								{/* Ikonka */}
								<div className='mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors duration-300 group-hover:bg-primary/10 group-hover:text-primary'>
									<Icon className='h-5 w-5' />
								</div>

								{/* Raqam */}
								<div className='flex items-baseline justify-center font-bold text-3xl md:text-4xl lg:text-5xl text-foreground tracking-tight'>
									<span className='text-primary/80 mr-1 font-semibold'>
										{stat.prefix}
									</span>
									<AnimatedCounter to={stat.value} duration={2.5} />
									<span className='text-primary/80 ml-1 text-2xl md:text-3xl font-semibold'>
										{stat.suffix}
									</span>
								</div>

								{/* Yorliq */}
								<span className='text-sm font-medium text-muted-foreground'>
									{stat.label}
								</span>
							</motion.div>
						)
					})}
				</motion.div>
			</div>
		</section>
	)
}
