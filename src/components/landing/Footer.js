'use client'

import { motion } from 'framer-motion'
import { Bot, ChevronRight, LifeBuoy, Send } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const PLATFORM_LINKS = [
	{ name: 'Loyiha haqida', href: '/home/about' },
	{ name: "Mentorlar ro'yxati", href: '/home/mentors' },
	{ name: 'Jonli darslar', href: '/home/live-lessons' },
	{ name: "Mentor bo'lish", href: '/authentication' },
]

const HELP_LINKS = [
	{ name: "Ko'p beriladigan savollar", href: '/home/faq', icon: null },
	{ name: "Qo'llab-quvvatlash", href: '/home/support', icon: LifeBuoy },
	{
		name: 'Bot orqali aloqa',
		href: 'https://t.me/tengdoshmentorbot',
		icon: Bot,
		isExternal: true,
	},
]

export default function Footer() {
	const containerVariants = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: { staggerChildren: 0.1 },
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
		<footer className='relative border-t border-border/50 bg-background mt-auto pb-32 md:pb-0 overflow-hidden'>
			<div className='absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50'></div>
			<div className='absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-[200px] bg-primary/5 blur-[100px] rounded-full pointer-events-none -z-10'></div>

			<div className='container mx-auto px-4 md:px-8 pt-16 pb-8'>
				<motion.div
					variants={containerVariants}
					initial='hidden'
					whileInView='show'
					viewport={{ once: true, margin: '-50px' }}
					className='grid grid-cols-1 md:grid-cols-4 gap-12 mb-16'
				>
					<motion.div
						variants={itemVariants}
						className='col-span-1 md:col-span-1 lg:col-span-2'
					>
						<Link
							href='/'
							className='flex items-center space-x-2 mb-6 w-fit group'
						>
							<div className='flex items-center justify-center rounded-lg bg-transparent transition-transform duration-300 group-hover:scale-105'>
								<Image
									src='/logo.png'
									alt='Tengdosh Logo'
									width={36}
									height={36}
									className='dark:invert mix-blend-multiply dark:mix-blend-screen opacity-90'
								/>
							</div>
							<span className='font-bold text-2xl tracking-tight'>
								TengdoshUstoz
							</span>
						</Link>
						<p className='text-base text-muted-foreground mb-8 max-w-sm leading-relaxed text-balance'>
							Universitet talabalari uchun o'zaro bilim almashish, mentor topish
							va birgalikda zamonaviy kasblarni o'rganish platformasi.
						</p>

						<div className='flex items-center space-x-4'>
							<a
								href='https://t.me/tengdoshustoz'
								target='_blank'
								rel='noopener noreferrer'
								className='bg-muted/50 border p-2.5 rounded-full text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 hover:shadow-[0_0_15px_rgba(var(--primary),0.2)] transition-all duration-300 group'
								title='Telegram Kanal'
							>
								<Send className='h-5 w-5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform' />
							</a>
							<a
								href='https://t.me/tengdoshmentorbot'
								target='_blank'
								rel='noopener noreferrer'
								className='bg-muted/50 border p-2.5 rounded-full text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 hover:shadow-[0_0_15px_rgba(var(--primary),0.2)] transition-all duration-300 group'
								title='Telegram Bot'
							>
								<Bot className='h-5 w-5 group-hover:scale-110 transition-transform' />
							</a>
						</div>
					</motion.div>

					<motion.div variants={itemVariants}>
						<h3 className='font-bold text-lg text-foreground mb-6'>
							Platforma
						</h3>
						<ul className='space-y-4 text-sm text-muted-foreground'>
							{PLATFORM_LINKS.map((link, idx) => (
								<li key={idx}>
									<Link
										href={link.href}
										className='group flex items-center hover:text-primary transition-colors duration-300'
									>
										<ChevronRight className='h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary mr-1' />
										<span className='-ml-5 group-hover:ml-0 transition-all duration-300'>
											{link.name}
										</span>
									</Link>
								</li>
							))}
						</ul>
					</motion.div>

					<motion.div variants={itemVariants}>
						<h3 className='font-bold text-lg text-foreground mb-6'>Yordam</h3>
						<ul className='space-y-4 text-sm text-muted-foreground'>
							{HELP_LINKS.map((link, idx) => {
								const Icon = link.icon
								const LinkComponent = link.isExternal ? 'a' : Link
								const props = link.isExternal
									? {
											href: link.href,
											target: '_blank',
											rel: 'noopener noreferrer',
										}
									: { href: link.href }

								return (
									<li key={idx}>
										<LinkComponent
											{...props}
											className='group flex items-center hover:text-primary transition-colors duration-300'
										>
											{Icon ? (
												<Icon className='h-4 w-4 mr-2 text-muted-foreground group-hover:text-primary transition-colors' />
											) : (
												<ChevronRight className='h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary mr-1' />
											)}
											<span
												className={
													!Icon
														? '-ml-5 group-hover:ml-0 transition-all duration-300'
														: ''
												}
											>
												{link.name}
											</span>
										</LinkComponent>
									</li>
								)
							})}
						</ul>
					</motion.div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ delay: 0.5, duration: 0.5 }}
					className='border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4'
				>
					<p className='text-sm text-muted-foreground text-center md:text-left'>
						&copy; {new Date().getFullYear()} TengdoshUstoz. Barcha huquqlar
						himoyalangan.
					</p>

					<div className='flex items-center space-x-6 text-sm text-muted-foreground font-medium'>
						<Link
							href='/home/terms'
							className='hover:text-primary transition-colors'
						>
							Foydalanish shartlari
						</Link>
						<Link
							href='/home/privacy'
							className='hover:text-primary transition-colors'
						>
							Maxfiylik siyosati
						</Link>
					</div>
				</motion.div>
			</div>
		</footer>
	)
}
