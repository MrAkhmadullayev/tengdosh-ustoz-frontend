'use client'

import { containerVariants, itemVariants } from '@/lib/constants'
import { useTranslation } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Bot, ChevronRight, LifeBuoy, Send } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
export default function Footer() {
	const { t } = useTranslation()

	const PLATFORM_LINKS = [
		{ name: t('landing.aboutProject') || 'Loyiha haqida', href: '/home/about' },
		{
			name: t('landing.mentorsList') || "Mentorlar ro'yxati",
			href: '/home/mentors',
		},
		{
			name: t('nav.liveLessons') || 'Jonli darslar',
			href: '/home/live-lessons',
		},
		{
			name: t('landing.becomeMentor') || "Mentor bo'lish",
			href: '/authentication',
		},
	]

	const HELP_LINKS = [
		{
			name: t('landing.faqTitle') || "Ko'p so'raladigan savollar",
			href: '/home/faq',
			icon: null,
		},
		{
			name: t('nav.support') || "Qo'llab-quvvatlash",
			href: '/home/support',
			icon: LifeBuoy,
		},
		{
			name: t('landing.botContact') || 'Telegram Bot',
			href: 'https://t.me/tengdoshmentorbot',
			icon: Bot,
			isExternal: true,
		},
	]

	return (
		<footer className='relative border-t bg-background mt-auto pb-24 md:pb-0 overflow-hidden'>
			{/* 🌟 Vercel-like Top Border Glow */}
			<div className='absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent' />
			<div className='absolute top-0 left-1/2 -translate-x-1/2 w-[30%] h-[100px] bg-primary/5 blur-3xl pointer-events-none -z-10' />

			<div className='container mx-auto px-4 sm:px-6 md:px-8 pt-16 pb-8 max-w-7xl'>
				<motion.div
					variants={containerVariants}
					initial='hidden'
					whileInView='show'
					viewport={{ once: true, margin: '-50px' }}
					className='grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 lg:gap-12 mb-16'
				>
					{/* Brand Info */}
					<motion.div
						variants={itemVariants}
						className='col-span-1 md:col-span-2'
					>
						<Link
							href='/'
							className='flex items-center space-x-2 mb-5 w-fit group'
						>
							<div className='flex items-center justify-center transition-transform duration-300 group-hover:scale-105'>
								<Image
									src='/logo.png'
									alt='Tengdosh Logo'
									width={32}
									height={32}
									className='dark:invert opacity-90'
								/>
							</div>
							<span className='font-bold text-xl tracking-tight text-foreground'>
								TengdoshUstoz
							</span>
						</Link>

						<p className='text-sm text-muted-foreground mb-6 max-w-sm leading-relaxed text-balance'>
							{t('landing.footerDesc') ||
								"Talabalar va mutaxassislar o'zaro tajriba almashadigan innovatsion ta'lim platformasi."}
						</p>

						<div className='flex items-center space-x-3'>
							<a
								href='https://t.me/tengdoshustoz'
								target='_blank'
								rel='noopener noreferrer'
								className='flex h-10 w-10 items-center justify-center rounded-lg border bg-muted/30 text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary'
								aria-label='Telegram kanali'
							>
								<Send className='h-4 w-4' />
							</a>
							<a
								href='https://t.me/tengdoshmentorbot'
								target='_blank'
								rel='noopener noreferrer'
								className='flex h-10 w-10 items-center justify-center rounded-lg border bg-muted/30 text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary'
								aria-label='Telegram Bot'
							>
								<Bot className='h-4 w-4' />
							</a>
						</div>
					</motion.div>

					{/* Platform Links */}
					<motion.div variants={itemVariants}>
						<h3 className='font-semibold text-foreground mb-5 tracking-tight'>
							{t('landing.footerPlatform') || 'Platforma'}
						</h3>
						<ul className='space-y-3.5 text-sm font-medium text-muted-foreground'>
							{PLATFORM_LINKS.map((link, idx) => (
								<li key={idx}>
									<Link
										href={link.href}
										className='group flex items-center hover:text-foreground transition-colors w-fit'
									>
										<ChevronRight className='h-3.5 w-3.5 opacity-0 -translate-x-3 text-primary transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-hover:mr-1 absolute' />
										<span className='transition-transform duration-300 group-hover:translate-x-4'>
											{link.name}
										</span>
									</Link>
								</li>
							))}
						</ul>
					</motion.div>

					{/* Help Links */}
					<motion.div variants={itemVariants}>
						<h3 className='font-semibold text-foreground mb-5 tracking-tight'>
							{t('landing.footerHelp') || 'Yordam'}
						</h3>
						<ul className='space-y-3.5 text-sm font-medium text-muted-foreground'>
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
											className='group flex items-center hover:text-foreground transition-colors w-fit'
										>
											{Icon ? (
												<Icon className='h-4 w-4 mr-2 text-muted-foreground transition-colors group-hover:text-primary' />
											) : (
												<ChevronRight className='h-3.5 w-3.5 opacity-0 -translate-x-3 text-primary transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-hover:mr-1 absolute' />
											)}
											<span
												className={cn(
													'transition-transform duration-300',
													!Icon && 'group-hover:translate-x-4',
												)}
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

				{/* Bottom Copyright and Legal */}
				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ delay: 0.3, duration: 0.5 }}
					className='border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4'
				>
					<p className='text-sm font-medium text-muted-foreground text-center md:text-left'>
						&copy; {new Date().getFullYear()}{' '}
						{t('landing.footerRights') ||
							'TengdoshUstoz. Barcha huquqlar himoyalangan.'}
					</p>

					<div className='flex items-center space-x-6 text-sm font-medium text-muted-foreground'>
						<Link
							href='/home/terms'
							className='hover:text-foreground transition-colors'
						>
							{t('landing.footerTerms') || 'Foydalanish shartlari'}
						</Link>
						<Link
							href='/home/privacy'
							className='hover:text-foreground transition-colors'
						>
							{t('landing.footerPrivacy') || 'Maxfiylik siyosati'}
						</Link>
					</div>
				</motion.div>
			</div>
		</footer>
	)
}
