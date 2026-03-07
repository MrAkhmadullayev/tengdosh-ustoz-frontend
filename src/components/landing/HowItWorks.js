'use client'

import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

const STEPS = [
	"O'zingizga kerakli fan yoki texnologiyani qidirasiz.",
	'Shu sohada tajribasi bor tengdoshingizni (mentor) tanlaysiz.',
	"Qulay vaqtni belgilab, platforma ichida jonli darsga qo'shilasiz.",
	'Bilimingizni oshirasiz va mentorni baholaysiz.',
]

export default function HowItWorks() {
	const containerVariants = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2,
			},
		},
	}

	const itemVariants = {
		hidden: { opacity: 0, x: -20 },
		show: {
			opacity: 1,
			x: 0,
			transition: { type: 'spring', stiffness: 300, damping: 24 },
		},
	}

	return (
		<section className='w-full py-16 md:py-24 bg-muted/30 relative overflow-hidden'>
			<div className='container mx-auto px-4 md:px-8 max-w-4xl relative z-10'>
				<motion.h2
					initial={{ opacity: 0, y: -20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.5 }}
					transition={{ duration: 0.5 }}
					className='text-3xl md:text-4xl font-bold text-center mb-10 text-balance'
				>
					Tengdosh ustoz qanday ishlaydi?
				</motion.h2>

				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: '-100px' }}
					transition={{ duration: 0.6, ease: 'easeOut' }}
					className='relative bg-background border rounded-3xl p-6 md:p-10 shadow-sm hover:shadow-xl transition-shadow duration-500'
				>
					<div className='absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur opacity-30 pointer-events-none'></div>

					<div className='relative'>
						<p className='text-muted-foreground text-lg md:text-xl mb-10 leading-relaxed text-center sm:text-left text-balance'>
							Bu platforma an'anaviy ta'limdan farq qiladi. Bu yerda hamma
							o'quvchi va hamma ustoz bo'lishi mumkin. Siz tushunmagan mavzuni
							kechagina shu mavzuni o'zlashtirgan kursdoshingiz eng oddiy,
							<span className='text-foreground font-semibold'>
								{' '}
								"talabacha"{' '}
							</span>{' '}
							tilda tushuntirib beradi.
						</p>

						<motion.div
							variants={containerVariants}
							initial='hidden'
							whileInView='show'
							viewport={{ once: true, margin: '-50px' }}
							className='grid sm:grid-cols-2 gap-6'
						>
							{STEPS.map((step, idx) => (
								<motion.div
									key={idx}
									variants={itemVariants}
									className='flex items-start space-x-4 p-4 rounded-2xl transition-colors hover:bg-muted/50 group'
								>
									<div className='relative flex-shrink-0 mt-0.5'>
										<CheckCircle2 className='h-7 w-7 text-primary transition-transform duration-300 group-hover:scale-110' />
										<div className='absolute inset-0 bg-primary/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
									</div>
									<span className='text-foreground font-medium leading-snug'>
										{step}
									</span>
								</motion.div>
							))}
						</motion.div>
					</div>
				</motion.div>
			</div>
		</section>
	)
}
