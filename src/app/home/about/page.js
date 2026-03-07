'use client'

import Footer from '@/components/landing/Footer'
import Navbar from '@/components/landing/Navbar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import {
	ArrowRight,
	Laptop,
	Lightbulb,
	Loader2,
	Rocket,
	ShieldCheck,
	Smartphone,
	Target,
	Users,
	Video,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

const BENEFITS = [
	{
		type: "O'rganuvchilar",
		icon: Users,
		color: 'text-blue-500',
		bg: 'bg-blue-500/10',
		list: [
			'Murakkab mavzularni oson tushunish.',
			'Uy vazifalari va proyektlarda yordam olish.',
			"Qulay vaqtda, individual yoki guruhda o'qish imkoniyati.",
		],
	},
	{
		type: 'Mentorlar',
		icon: Rocket,
		color: 'text-orange-500',
		bg: 'bg-orange-500/10',
		list: [
			"Boshqalarga o'rgatish orqali o'z bilimini mustahkamlash.",
			'Liderlik (Soft skills) qobiliyatlarini rivojlantirish.',
			"Universitet reytingida ko'tarilish va qo'shimcha daromad.",
		],
	},
	{
		type: 'Universitet',
		icon: Target,
		color: 'text-purple-500',
		bg: 'bg-purple-500/10',
		list: [
			"Talabalarning umumiy o'zlashtirish ko'rsatkichini oshirish.",
			"Kuchli va do'stona ichki IT hamjamiyatni shakllantirish.",
			"Professor-o'qituvchilarning yuklamasini yengillashtirish.",
		],
	},
]

const ECOSYSTEM = [
	{
		icon: Laptop,
		title: 'Asosiy Web Platforma',
		desc: 'Barcha jarayonlarni boshqarish, ustoz izlash va reytinglarni kuzatish markazi.',
	},
	{
		icon: Video,
		title: 'Ichki Video-aloqa',
		desc: "Zoom kabi uchinchi tomon dasturlariga hojat yo'q. Darslar aynan platformaning o'zida bo'lib o'tadi.",
	},
	{
		icon: Smartphone,
		title: 'Telegram Bot Integratsiyasi',
		desc: "Darslar jadvali, eslatmalar va tezkor xabarlar to'g'ridan-to'g'ri Telegramingizga keladi.",
	},
]

export default function AboutPage() {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()
	const [navigatingTo, setNavigatingTo] = useState(null)

	const handleNavigation = path => {
		setNavigatingTo(path)
		startTransition(() => {
			router.push(path)
		})
	}

	const fadeUpVariants = {
		hidden: { opacity: 0, y: 30 },
		show: {
			opacity: 1,
			y: 0,
			transition: { type: 'spring', stiffness: 300, damping: 24 },
		},
	}

	const staggerContainer = {
		hidden: { opacity: 0 },
		show: { opacity: 1, transition: { staggerChildren: 0.15 } },
	}

	return (
		<div className='min-h-screen bg-background flex flex-col overflow-hidden'>
			<Navbar />

			<main className='flex-1'>
				<section className='relative w-full py-16 md:py-24 border-b overflow-hidden'>
					<div className='absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[100px] -z-10'></div>

					<motion.div
						initial='hidden'
						animate='show'
						variants={staggerContainer}
						className='container mx-auto px-4 text-center max-w-3xl relative z-10'
					>
						<motion.div variants={fadeUpVariants}>
							<Badge
								variant='secondary'
								className='mb-6 px-4 py-1.5 text-sm font-medium bg-secondary/50 backdrop-blur-sm'
							>
								Bizning missiyamiz
							</Badge>
						</motion.div>
						<motion.h1
							variants={fadeUpVariants}
							className='text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-balance text-foreground'
						>
							Tengdosh ustoz — bu shunchaki platforma emas,{' '}
							<span className='text-primary inline-block'>
								bu katta hamjamiyat!
							</span>
						</motion.h1>
						<motion.p
							variants={fadeUpVariants}
							className='text-xl text-muted-foreground leading-relaxed text-balance'
						>
							Biz universitetdagi har bir talaba o'z salohiyatini to'liq namoyon
							qila olishiga ishonamiz. Biri o'rgatish orqali, ikkinchisi esa
							o'rganish orqali o'sadi.
						</motion.p>
					</motion.div>
				</section>

				<section className='w-full py-16 md:py-24 container mx-auto px-4 max-w-5xl'>
					<motion.div
						initial='hidden'
						whileInView='show'
						viewport={{ once: true, margin: '-100px' }}
						variants={staggerContainer}
						className='grid md:grid-cols-2 gap-8 md:gap-12 items-stretch'
					>
						<motion.div
							variants={fadeUpVariants}
							className='space-y-6 p-8 rounded-3xl bg-red-500/5 border border-red-500/10 hover:border-red-500/30 transition-colors'
						>
							<div className='inline-flex items-center justify-center p-3 bg-red-500/10 rounded-2xl mb-2'>
								<Target className='h-6 w-6 text-red-500' />
							</div>
							<h2 className='text-3xl font-bold text-foreground'>
								Muammo nimada edi?
							</h2>
							<p className='text-muted-foreground text-lg leading-relaxed'>
								Universitetga qabul qilingan talabalar turli xil bilim
								darajasiga ega bo'lishadi. Kimdir dasturlashni "0" dan boshlasa,
								kimdir allaqachon Junior yoki Middle darajasida keladi.
								Darslarda hammaga bir xil yondashuv bo'lgani uchun, ba'zilar
								orqada qoladi, kuchlilar esa zerikib qoladi.
							</p>
						</motion.div>

						<motion.div
							variants={fadeUpVariants}
							className='space-y-6 p-8 rounded-3xl bg-green-500/5 border border-green-500/10 hover:border-green-500/30 transition-colors'
						>
							<div className='inline-flex items-center justify-center p-3 bg-green-500/10 rounded-2xl mb-2'>
								<Lightbulb className='h-6 w-6 text-green-500' />
							</div>
							<h2 className='text-3xl font-bold text-foreground'>
								Bizning yechim
							</h2>
							<p className='text-muted-foreground text-lg leading-relaxed'>
								"Tengdosh ustoz" (Peer-to-Peer learning) loyihasi! Biz iqtidorli
								talabalarni (mentorlarni) yordamga muhtoj talabalar bilan
								bog'laymiz. Professorning murakkab tilidan ko'ra, tengdoshning
								"talabacha" oddiy tilda tushuntirishi ancha samaraliroq va
								qiziqarliroqdir.
							</p>
						</motion.div>
					</motion.div>
				</section>

				<section className='w-full py-16 md:py-24 bg-primary/5 relative'>
					<div className='container mx-auto px-4 max-w-6xl'>
						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							className='text-3xl font-bold text-center mb-12 text-balance text-foreground'
						>
							Loyiha kimlar uchun foydali?
						</motion.h2>

						<motion.div
							initial='hidden'
							whileInView='show'
							viewport={{ once: true, margin: '-50px' }}
							variants={staggerContainer}
							className='grid md:grid-cols-3 gap-8'
						>
							{BENEFITS.map((item, idx) => {
								const Icon = item.icon
								return (
									<motion.div
										key={idx}
										variants={fadeUpVariants}
										className='h-full'
									>
										<Card className='bg-background border-border shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-500 h-full group'>
											<CardContent className='p-8 space-y-4'>
												<div
													className={`h-14 w-14 ${item.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
												>
													<Icon className={`h-7 w-7 ${item.color}`} />
												</div>
												<h3 className='text-xl font-bold text-foreground'>
													{item.type} uchun
												</h3>
												<ul className='space-y-4 text-muted-foreground pt-2'>
													{item.list.map((listItem, i) => (
														<li key={i} className='flex items-start gap-3'>
															<ShieldCheck className='h-5 w-5 text-primary flex-shrink-0 mt-0.5' />
															<span className='leading-snug'>{listItem}</span>
														</li>
													))}
												</ul>
											</CardContent>
										</Card>
									</motion.div>
								)
							})}
						</motion.div>
					</div>
				</section>

				<section className='w-full py-16 md:py-24 container mx-auto px-4 max-w-5xl text-center'>
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className='text-3xl font-bold mb-12 text-foreground'
					>
						Yagona va mukammal ekotizim
					</motion.h2>

					<motion.div
						initial='hidden'
						whileInView='show'
						viewport={{ once: true, margin: '-50px' }}
						variants={staggerContainer}
						className='grid sm:grid-cols-3 gap-10'
					>
						{ECOSYSTEM.map((eco, idx) => {
							const Icon = eco.icon
							return (
								<motion.div
									key={idx}
									variants={fadeUpVariants}
									className='flex flex-col items-center space-y-4 group'
								>
									<div className='p-5 bg-secondary rounded-3xl mb-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300'>
										<Icon className='h-8 w-8 text-primary group-hover:text-primary-foreground transition-colors' />
									</div>
									<h4 className='font-bold text-lg text-foreground'>
										{eco.title}
									</h4>
									<p className='text-sm text-muted-foreground leading-relaxed text-balance'>
										{eco.desc}
									</p>
								</motion.div>
							)
						})}
					</motion.div>
				</section>

				{/* CALL TO ACTION - RANG MUAMMOSI TO'G'IRLANDI */}
				<section className='relative w-full py-20 bg-secondary/30 border-t text-center overflow-hidden'>
					<div className='absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2'></div>
					<div className='absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2'></div>

					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
						className='container mx-auto px-4 relative z-10'
					>
						<h2 className='text-3xl md:text-4xl font-extrabold mb-6 text-foreground'>
							Biz bilan birga o'sishga tayyormisiz?
						</h2>
						<p className='text-muted-foreground mb-10 max-w-2xl mx-auto text-lg md:text-xl text-balance'>
							Xohlasangiz bilim oling, xohlasangiz boshqalarga o'rgating. Eng
							asosiysi — harakatsiz qolmang!
						</p>

						<div className='flex flex-col sm:flex-row justify-center items-center gap-4'>
							<Button
								size='lg'
								onClick={() => handleNavigation('/home/mentors')}
								disabled={isPending && navigatingTo === '/home/mentors'}
								className='w-full sm:w-auto font-bold hover:shadow-lg transition-all h-14 px-8 text-base group'
							>
								{isPending && navigatingTo === '/home/mentors' ? (
									<>
										<Loader2 className='mr-2 h-5 w-5 animate-spin' />
										Kutilmoqda...
									</>
								) : (
									<>
										Ustoz topish
										<ArrowRight className='ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform' />
									</>
								)}
							</Button>

							<Button
								size='lg'
								variant='outline'
								onClick={() => handleNavigation('/authentication')}
								disabled={isPending && navigatingTo === '/authentication'}
								className='w-full sm:w-auto h-14 px-8 text-base transition-all group border-primary/20 hover:bg-primary/5'
							>
								{isPending && navigatingTo === '/authentication' ? (
									<>
										<Loader2 className='mr-2 h-5 w-5 animate-spin' />
										Kutilmoqda...
									</>
								) : (
									<>Mentor bo'lish</>
								)}
							</Button>
						</div>
					</motion.div>
				</section>
			</main>

			<Footer />
		</div>
	)
}
