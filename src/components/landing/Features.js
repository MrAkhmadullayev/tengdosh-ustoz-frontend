'use client'

import { motion } from 'framer-motion'
import { BookOpenCheck, FileCode2, TrendingUp, Users } from 'lucide-react'

const FEATURES = [
	{
		title: 'Mentorlar',
		desc: "O'z ishining ustasi bo'lgan faol talabalar bilan bevosita ishlash va tajriba almashish.",
		icon: Users,
	},
	{
		title: 'Masalalar',
		desc: 'Amaliyot uchun maxsus tuzilgan mantiqiy va dasturlash masalalarini yechib borish.',
		icon: FileCode2,
	},
	{
		title: 'Testlar',
		desc: 'Bilimingizni mustahkamlash uchun qisqa, qiziqarli va interaktiv testlar.',
		icon: BookOpenCheck,
	},
	{
		title: "O'sish",
		desc: 'Reytingingizni oshiring va kelajakdagi karyerangiz uchun mustahkam poydevor quring.',
		icon: TrendingUp,
	},
]

export default function Features() {
	const containerVariants = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.15,
			},
		},
	}

	const cardVariants = {
		hidden: { opacity: 0, y: 30 },
		show: {
			opacity: 1,
			y: 0,
			transition: { type: 'spring', stiffness: 300, damping: 24 },
		},
	}

	return (
		<section className='w-full py-16 md:py-24 container mx-auto px-4 md:px-8 relative'>
			<div className='absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] -z-10 pointer-events-none'></div>

			<motion.h2
				initial={{ opacity: 0, y: -20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, margin: '-50px' }}
				transition={{ duration: 0.5 }}
				className='text-3xl md:text-4xl font-bold text-center mb-12 text-balance'
			>
				Tengdosh imkoniyatlari
			</motion.h2>

			<motion.div
				variants={containerVariants}
				initial='hidden'
				whileInView='show'
				viewport={{ once: true, margin: '-100px' }}
				className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6'
			>
				{FEATURES.map((item, idx) => {
					const Icon = item.icon

					return (
						<motion.div
							key={idx}
							variants={cardVariants}
							className='relative group overflow-hidden p-6 rounded-3xl border bg-background hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500'
						>
							<div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none'></div>

							<div className='relative z-10'>
								<div className='bg-primary/10 w-14 h-14 flex items-center justify-center rounded-2xl mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-500'>
									<Icon className='h-7 w-7 text-primary group-hover:text-primary-foreground transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3' />
								</div>

								<h3 className='text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300'>
									{item.title}
								</h3>

								<p className='text-muted-foreground text-sm leading-relaxed text-balance'>
									{item.desc}
								</p>
							</div>
						</motion.div>
					)
				})}
			</motion.div>
		</section>
	)
}
