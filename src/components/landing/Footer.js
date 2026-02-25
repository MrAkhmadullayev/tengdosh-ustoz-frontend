import { Bot, GraduationCap, LifeBuoy, Send } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
	return (
		<footer className='border-t bg-muted/40 mt-auto'>
			<div className='container mx-auto px-4 md:px-8 pt-12 pb-8'>
				{/* ASOSIY QISM: GRID YOTQIZILISHI */}
				<div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-10'>
					{/* 1-Ustun: Logo, Ta'rif va Ijtimoiy tarmoqlar */}
					<div className='col-span-1 md:col-span-1 lg:col-span-2'>
						<Link href='/' className='flex items-center space-x-2 mb-4 w-fit'>
							<div className='bg-primary/10 p-1.5 rounded-lg'>
								<GraduationCap className='h-5 w-5 text-primary' />
							</div>
							<span className='font-bold text-xl tracking-tight'>
								TengdoshUstoz
							</span>
						</Link>
						<p className='text-sm text-muted-foreground mb-6 max-w-sm leading-relaxed'>
							Universitet talabalari uchun o'zaro bilim almashish, mentor topish
							va birgalikda zamonaviy kasblarni o'rganish platformasi.
						</p>

						{/* Telegram va Bot Linklari */}
						<div className='flex items-center space-x-4'>
							<a
								href='https://t.me/TengdoshUstoz_Kanal'
								target='_blank'
								rel='noopener noreferrer'
								className='bg-background border p-2 rounded-full text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors group'
								title='Telegram Kanal'
							>
								<Send className='h-4 w-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform' />
								<span className='sr-only'>Telegram kanal</span>
							</a>
							<a
								href='https://t.me/TengdoshUstoz_Bot'
								target='_blank'
								rel='noopener noreferrer'
								className='bg-background border p-2 rounded-full text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors group'
								title='Telegram Bot'
							>
								<Bot className='h-4 w-4 group-hover:scale-110 transition-transform' />
								<span className='sr-only'>Telegram bot</span>
							</a>
						</div>
					</div>

					{/* 2-Ustun: Platforma sahifalari */}
					<div>
						<h3 className='font-semibold text-foreground mb-4'>Platforma</h3>
						<ul className='space-y-3 text-sm text-muted-foreground'>
							<li>
								<Link
									href='/home/about'
									className='hover:text-primary transition-colors'
								>
									Loyiha haqida
								</Link>
							</li>
							<li>
								<Link
									href='/home/mentors'
									className='hover:text-primary transition-colors'
								>
									Mentorlar ro'yxati
								</Link>
							</li>
							<li>
								<Link
									href='/home/live-lessons'
									className='hover:text-primary transition-colors'
								>
									Jonli darslar
								</Link>
							</li>
							<li>
								<Link
									href='/authentication'
									className='hover:text-primary transition-colors'
								>
									Mentor bo'lish
								</Link>
							</li>
						</ul>
					</div>

					{/* 3-Ustun: Yordam va Aloqa */}
					<div>
						<h3 className='font-semibold text-foreground mb-4'>Yordam</h3>
						<ul className='space-y-3 text-sm text-muted-foreground'>
							<li>
								<Link
									href='/home/faq'
									className='hover:text-primary transition-colors'
								>
									Ko'p beriladigan savollar
								</Link>
							</li>
							<li>
								<Link
									href='/home/support'
									className='flex items-center hover:text-primary transition-colors'
								>
									<LifeBuoy className='h-3.5 w-3.5 mr-1.5' /> Qo'llab-quvvatlash
								</Link>
							</li>
							<li>
								<a
									href='https://t.me/TengdoshUstoz_Bot'
									target='_blank'
									rel='noopener noreferrer'
									className='flex items-center hover:text-primary transition-colors'
								>
									<Bot className='h-3.5 w-3.5 mr-1.5' /> Bot orqali aloqa
								</a>
							</li>
						</ul>
					</div>
				</div>

				{/* PASTKI QISM: COPYRIGHT VA HUQUQIY HUJJATLAR */}
				<div className='border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4'>
					<p className='text-sm text-muted-foreground text-center md:text-left'>
						&copy; {new Date().getFullYear()} TengdoshUstoz platformasi. Barcha
						huquqlar himoyalangan.
					</p>

					<div className='flex items-center space-x-4 md:space-x-6 text-sm text-muted-foreground'>
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
				</div>
			</div>
		</footer>
	)
}
