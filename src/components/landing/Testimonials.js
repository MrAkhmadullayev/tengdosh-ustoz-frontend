'use client'

import { motion } from 'framer-motion'
import { MessageSquareQuote } from 'lucide-react'

const REVIEWS = [
	"Mantiqiy masalalarni tushunishga qiynalardim, tengdoshim 10 daqiqada zo'r qilib tushuntirib berdi!",
	'Universitetda tushunmagan mavzumni bu yerda yechimini topdim. Rahmat!',
	"Mentor bo'lib o'zimni sinab ko'rdim. Boshqalarga o'rgatish o'zimni bilimimni ham oshirdi.",
	"Kechasi dars qilayotganda savol tug'ilgandi, platformadan srazi javob topdim.",
]

export default function Testimonials() {
	return (
		<section className='w-full py-16 overflow-hidden bg-background border-t'>
			<div className='text-center mb-10 px-4'>
				<h2 className='text-3xl font-bold'>Talabalar nima deydi?</h2>
			</div>

			{/* Infinite scrolling logic using Framer Motion (yoki oddiy CSS animation) */}
			<div className='relative w-full flex overflow-x-hidden'>
				{/* Orqa fon chetlarini xiralashtirish (fade in/out edges) */}
				<div className='absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10'></div>
				<div className='absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10'></div>

				<motion.div
					animate={{ x: ['0%', '-50%'] }}
					transition={{ repeat: Infinity, ease: 'linear', duration: 20 }}
					className='flex gap-6 w-max px-6'
				>
					{/* Duplicate reviews to make it seamless */}
					{[...REVIEWS, ...REVIEWS].map((text, i) => (
						<div
							key={i}
							className='w-[300px] md:w-[400px] bg-muted/30 p-6 rounded-2xl border flex-shrink-0'
						>
							<MessageSquareQuote className='w-8 h-8 text-primary/40 mb-3' />
							<p className='text-muted-foreground font-medium leading-relaxed'>
								"{text}"
							</p>
						</div>
					))}
				</motion.div>
			</div>
		</section>
	)
}
