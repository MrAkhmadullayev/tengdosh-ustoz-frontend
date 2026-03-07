'use client'

import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { ArrowDown, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

export default function Hero() {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()
	const [isNavigating, setIsNavigating] = useState(false)

	const handleNavigation = () => {
		setIsNavigating(true)
		startTransition(() => {
			router.push('/home/about')
		})
	}

	const containerVariants = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: { staggerChildren: 0.15, delayChildren: 0.1 },
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
		<section className='w-full py-16 md:py-24 lg:py-32 flex flex-col items-center justify-center text-center px-4 overflow-hidden relative'>
			<div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none'></div>

			<motion.div
				variants={containerVariants}
				initial='hidden'
				animate='show'
				className='flex flex-col items-center w-full max-w-4xl'
			>
				<motion.div
					variants={itemVariants}
					className='inline-flex items-center rounded-full border border-border/50 px-3 py-1 text-sm font-semibold mb-6 bg-secondary/50 text-secondary-foreground backdrop-blur-sm transition-colors hover:bg-secondary/80'
				>
					👋 Hammamiz bir xil yo'ldan o'tganmiz
				</motion.div>

				<motion.h1
					variants={itemVariants}
					className='text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-balance mb-6'
				>
					Tengdoshlarim, keling{' '}
					<span className='text-primary inline-block'>birga o'rganamiz!</span>
				</motion.h1>

				<motion.p
					variants={itemVariants}
					className='mx-auto max-w-2xl text-muted-foreground md:text-xl leading-relaxed mb-8 text-balance'
				>
					Universitetdagi murakkab fanlar va kodlashdagi xatoliklar yolg'iz
					yengish uchun emas. O'zingiz kabi talabalardan dars oling yoki o'z
					tajribangiz bilan bo'lishib, haqiqiy liderga aylaning.
				</motion.p>

				<motion.div variants={itemVariants}>
					<Button
						size='lg'
						onClick={handleNavigation}
						disabled={isPending || isNavigating}
						className='gap-2 font-medium transition-all duration-300 hover:shadow-[0_0_20px_rgba(var(--primary),0.3)] w-[180px]'
					>
						{isPending || isNavigating ? (
							<>
								Kutilmoqda...
								<Loader2 className='h-4 w-4 animate-spin' />
							</>
						) : (
							<>
								Batafsil o'qish
								<ArrowDown className='h-4 w-4 transition-transform duration-300 group-hover:translate-y-1' />
							</>
						)}
					</Button>
				</motion.div>
			</motion.div>
		</section>
	)
}
