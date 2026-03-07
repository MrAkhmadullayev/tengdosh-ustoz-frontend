'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Star, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'

const ALERTS = [
	{
		id: 1,
		text: 'Sardor Node.js darsini yakunladi',
		icon: CheckCircle2,
		color: 'text-green-500',
	},
	{
		id: 2,
		text: "Diyora o'zining 50-o'quvchisini qabul qildi!",
		icon: Star,
		color: 'text-yellow-500',
	},
	{
		id: 3,
		text: "Yangi mantiqiy masala qo'shildi",
		icon: Zap,
		color: 'text-blue-500',
	},
]

export default function LiveAlerts() {
	const [currentAlert, setCurrentAlert] = useState(0)
	const [isVisible, setIsVisible] = useState(false)

	useEffect(() => {
		const initialTimeout = setTimeout(() => setIsVisible(true), 2000)

		const interval = setInterval(() => {
			setIsVisible(true)

			setTimeout(() => setIsVisible(false), 2000)

			setTimeout(
				() => setCurrentAlert(prev => (prev + 1) % ALERTS.length),
				3000,
			)
		}, 5000)

		return () => {
			clearTimeout(initialTimeout)
			clearInterval(interval)
		}
	}, [])

	const alert = ALERTS[currentAlert]
	const Icon = alert.icon

	return (
		<div className='fixed top-24 left-0 right-0 z-[100] pointer-events-none flex justify-center'>
			<AnimatePresence mode='wait'>
				{isVisible && (
					<motion.div
						key='alert-pill'
						initial={{ opacity: 0, y: -25, scale: 0.8 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: -20, scale: 0.85 }}
						transition={{
							type: 'spring',
							stiffness: 300,
							damping: 25,
							mass: 0.8,
						}}
						className='bg-black/80 backdrop-blur-xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.3)] rounded-full flex items-center px-4 py-2.5'
					>
						<motion.div
							initial={{ opacity: 0, x: -10 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 10 }}
							transition={{ delay: 0.1, duration: 0.3 }}
							className='flex items-center gap-3 whitespace-nowrap'
						>
							<Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${alert.color}`} />
							<span className='text-xs sm:text-sm font-medium text-white pr-1'>
								{alert.text}
							</span>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}
