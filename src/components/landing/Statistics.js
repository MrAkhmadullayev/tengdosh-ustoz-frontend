'use client'

import { animate, motion, useInView } from 'framer-motion'
import { Award, Users, Video } from 'lucide-react'
import { useEffect, useRef } from 'react'

const STATS = [
	{
		id: 1,
		value: 19967,
		label: "Umumiy o'quvchilar soni",
		prefix: '+',
		suffix: '',
		icon: Users,
	},
	{
		id: 2,
		value: 768,
		label: 'Yozilgan darslar soni',
		prefix: '+',
		suffix: '',
		icon: Video,
	},
	{
		id: 3,
		value: 7,
		label: "O'rtacha jamoaviy tajriba",
		prefix: '+',
		suffix: ' yil',
		icon: Award,
	},
]

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
	const containerVariants = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: { staggerChildren: 0.2 },
		},
	}

	const itemVariants = {
		hidden: { opacity: 0, y: 30 },
		show: {
			opacity: 1,
			y: 0,
			transition: { type: 'spring', stiffness: 300, damping: 24 },
		},
	}

	return (
		<section className='w-full py-16 md:py-24 relative overflow-hidden'>
			<div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-32 bg-primary/5 rounded-full blur-[80px] -z-10'></div>

			<div className='container mx-auto px-4 md:px-8'>
				<motion.div
					variants={containerVariants}
					initial='hidden'
					whileInView='show'
					viewport={{ once: true, margin: '-50px' }}
					className='grid sm:grid-cols-3 gap-8 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-border/50 bg-background/50 backdrop-blur-sm border rounded-3xl shadow-sm p-8'
				>
					{STATS.map(stat => {
						const Icon = stat.icon

						return (
							<motion.div
								key={stat.id}
								variants={itemVariants}
								className='flex flex-col items-center text-center space-y-3 pt-8 sm:pt-0 first:pt-0 group'
							>
								<div className='p-3 bg-primary/10 rounded-2xl group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 mb-2'>
									<Icon className='h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors' />
								</div>

								<div className='flex items-baseline justify-center font-extrabold text-4xl md:text-5xl text-foreground drop-shadow-sm tracking-tight'>
									<span className='text-primary mr-1'>{stat.prefix}</span>
									<AnimatedCounter to={stat.value} duration={2.5} />
									<span className='text-primary ml-1 text-3xl md:text-4xl'>
										{stat.suffix}
									</span>
								</div>

								<span className='text-muted-foreground font-medium text-lg text-balance'>
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
