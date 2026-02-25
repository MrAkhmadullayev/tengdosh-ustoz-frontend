'use client'

import Navbar from '@/components/landing/Navbar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
	Laptop,
	Lightbulb,
	Rocket,
	ShieldCheck,
	Smartphone,
	Target,
	Users,
	Video,
} from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
	return (
		<div className='min-h-screen bg-background flex flex-col'>
			<Navbar />

			<main className='flex-1'>
				{/* HEADER / HERO SECTION */}
				<section className='w-full py-16 md:py-24 bg-muted/30 border-b'>
					<div className='container mx-auto px-4 text-center max-w-3xl'>
						<Badge
							variant='secondary'
							className='mb-6 px-3 py-1 text-sm font-medium'
						>
							Bizning missiyamiz
						</Badge>
						<h1 className='text-4xl md:text-5xl font-extrabold tracking-tight mb-6'>
							Tengdosh ustoz — bu shunchaki platforma emas,{' '}
							<span className='text-primary'>bu katta hamjamiyat!</span>
						</h1>
						<p className='text-xl text-muted-foreground leading-relaxed'>
							Biz universitetdagi har bir talaba o'z salohiyatini to'liq namoyon
							qila olishiga ishonamiz. Biri o'rgatish orqali, ikkinchisi esa
							o'rganish orqali o'sadi.
						</p>
					</div>
				</section>

				{/* MUAMMO VA YECHIM (STORYTELLING) */}
				<section className='w-full py-16 md:py-24 container mx-auto px-4 max-w-5xl'>
					<div className='grid md:grid-cols-2 gap-12 items-center'>
						<div className='space-y-6'>
							<div className='inline-flex items-center justify-center p-3 bg-red-500/10 rounded-xl mb-2'>
								<Target className='h-6 w-6 text-red-500' />
							</div>
							<h2 className='text-3xl font-bold'>Muammo nimada edi?</h2>
							<p className='text-muted-foreground text-lg leading-relaxed'>
								Universitetga qabul qilingan talabalar turli xil bilim
								darajasiga ega bo'lishadi. Kimdir dasturlashni "0" dan boshlasa,
								kimdir allaqachon Junior yoki Middle darajasida keladi.
								Darslarda hammaga bir xil yondashuv bo'lgani uchun, ba'zilar
								orqada qoladi, kuchlilar esa zerikib qoladi.
							</p>
						</div>

						<div className='space-y-6'>
							<div className='inline-flex items-center justify-center p-3 bg-green-500/10 rounded-xl mb-2'>
								<Lightbulb className='h-6 w-6 text-green-500' />
							</div>
							<h2 className='text-3xl font-bold'>Bizning yechim</h2>
							<p className='text-muted-foreground text-lg leading-relaxed'>
								"Tengdosh ustoz" (Peer-to-Peer learning) loyihasi! Biz iqtidorli
								talabalarni (mentorlarni) yordamga muhtoj talabalar bilan
								bog'laymiz. Professorning murakkab tilidan ko'ra, tengdoshning
								"talabacha" oddiy tilda tushuntirishi ancha samaraliroq va
								qiziqarliroqdir.
							</p>
						</div>
					</div>
				</section>

				{/* KIMGA QANDAY FOYDA? (CARDS) */}
				<section className='w-full py-16 md:py-24 bg-primary/5'>
					<div className='container mx-auto px-4 max-w-6xl'>
						<h2 className='text-3xl font-bold text-center mb-12'>
							Loyiha kimlar uchun foydali?
						</h2>

						<div className='grid md:grid-cols-3 gap-8'>
							{/* O'rganuvchilar */}
							<Card className='bg-background border-none shadow-sm hover:shadow-md transition-shadow'>
								<CardContent className='p-8 space-y-4'>
									<div className='h-12 w-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-6'>
										<Users className='h-6 w-6 text-blue-500' />
									</div>
									<h3 className='text-xl font-bold'>O'rganuvchilar uchun</h3>
									<ul className='space-y-3 text-muted-foreground'>
										<li className='flex items-start gap-2'>
											<ShieldCheck className='h-5 w-5 text-green-500 flex-shrink-0' />
											Murakkab mavzularni oson tushunish.
										</li>
										<li className='flex items-start gap-2'>
											<ShieldCheck className='h-5 w-5 text-green-500 flex-shrink-0' />
											Uy vazifalari va proyektlarda yordam olish.
										</li>
										<li className='flex items-start gap-2'>
											<ShieldCheck className='h-5 w-5 text-green-500 flex-shrink-0' />
											Qulay vaqtda, individual yoki guruhda o'qish imkoniyati.
										</li>
									</ul>
								</CardContent>
							</Card>

							{/* Mentorlar */}
							<Card className='bg-background border-none shadow-sm hover:shadow-md transition-shadow'>
								<CardContent className='p-8 space-y-4'>
									<div className='h-12 w-12 bg-orange-500/10 rounded-full flex items-center justify-center mb-6'>
										<Rocket className='h-6 w-6 text-orange-500' />
									</div>
									<h3 className='text-xl font-bold'>Mentorlar uchun</h3>
									<ul className='space-y-3 text-muted-foreground'>
										<li className='flex items-start gap-2'>
											<ShieldCheck className='h-5 w-5 text-green-500 flex-shrink-0' />
											Boshqalarga o'rgatish orqali o'z bilimini mustahkamlash.
										</li>
										<li className='flex items-start gap-2'>
											<ShieldCheck className='h-5 w-5 text-green-500 flex-shrink-0' />
											Liderlik (Soft skills) qobiliyatlarini rivojlantirish.
										</li>
										<li className='flex items-start gap-2'>
											<ShieldCheck className='h-5 w-5 text-green-500 flex-shrink-0' />
											Universitet reytingida ko'tarilish va qo'shimcha daromad.
										</li>
									</ul>
								</CardContent>
							</Card>

							{/* Universitet */}
							<Card className='bg-background border-none shadow-sm hover:shadow-md transition-shadow'>
								<CardContent className='p-8 space-y-4'>
									<div className='h-12 w-12 bg-purple-500/10 rounded-full flex items-center justify-center mb-6'>
										<Target className='h-6 w-6 text-purple-500' />
									</div>
									<h3 className='text-xl font-bold'>Universitet uchun</h3>
									<ul className='space-y-3 text-muted-foreground'>
										<li className='flex items-start gap-2'>
											<ShieldCheck className='h-5 w-5 text-green-500 flex-shrink-0' />
											Talabalarning umumiy o'zlashtirish ko'rsatkichini
											oshirish.
										</li>
										<li className='flex items-start gap-2'>
											<ShieldCheck className='h-5 w-5 text-green-500 flex-shrink-0' />
											Kuchli va do'stona ichki IT hamjamiyatni shakllantirish.
										</li>
										<li className='flex items-start gap-2'>
											<ShieldCheck className='h-5 w-5 text-green-500 flex-shrink-0' />
											Professor-o'qituvchilarning yuklamasini yengillashtirish.
										</li>
									</ul>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>

				{/* EKOTIZIM (FEATURES) */}
				<section className='w-full py-16 md:py-24 container mx-auto px-4 max-w-5xl text-center'>
					<h2 className='text-3xl font-bold mb-12'>
						Yagona va mukammal ekotizim
					</h2>
					<div className='grid sm:grid-cols-3 gap-8'>
						<div className='flex flex-col items-center space-y-3'>
							<div className='p-4 bg-muted rounded-2xl mb-2'>
								<Laptop className='h-8 w-8 text-primary' />
							</div>
							<h4 className='font-semibold text-lg'>Asosiy Web Platforma</h4>
							<p className='text-sm text-muted-foreground'>
								Barcha jarayonlarni boshqarish, ustoz izlash va reytinglarni
								kuzatish markazi.
							</p>
						</div>

						<div className='flex flex-col items-center space-y-3'>
							<div className='p-4 bg-muted rounded-2xl mb-2'>
								<Video className='h-8 w-8 text-primary' />
							</div>
							<h4 className='font-semibold text-lg'>Ichki Video-aloqa</h4>
							<p className='text-sm text-muted-foreground'>
								Zoom kabi uchinchi tomon dasturlariga hojat yo'q. Darslar aynan
								platformaning o'zida bo'lib o'tadi.
							</p>
						</div>

						<div className='flex flex-col items-center space-y-3'>
							<div className='p-4 bg-muted rounded-2xl mb-2'>
								<Smartphone className='h-8 w-8 text-primary' />
							</div>
							<h4 className='font-semibold text-lg'>
								Telegram Bot Integratsiyasi
							</h4>
							<p className='text-sm text-muted-foreground'>
								Darslar jadvali, eslatmalar va tezkor xabarlar
								to'g'ridan-to'g'ri Telegramingizga keladi.
							</p>
						</div>
					</div>
				</section>

				{/* CALL TO ACTION */}
				<section className='w-full py-16 bg-primary text-primary-foreground text-center'>
					<div className='container mx-auto px-4'>
						<h2 className='text-3xl font-bold mb-6'>
							Biz bilan birga o'sishga tayyormisiz?
						</h2>
						<p className='text-primary-foreground/80 mb-8 max-w-2xl mx-auto text-lg'>
							Xohlasangiz bilim oling, xohlasangiz boshqalarga o'rgating. Eng
							asosiysi — harakatsiz qolmang!
						</p>
						<div className='flex flex-col sm:flex-row justify-center gap-4'>
							<Link href='/home/mentors'>
								<Button
									size='lg'
									variant='secondary'
									className='w-full sm:w-auto font-bold text-primary'
								>
									Ustoz topish
								</Button>
							</Link>
							<Link href='/authentication'>
								<Button
									size='lg'
									className='w-full sm:w-auto bg-primary-foreground/10 hover:bg-primary-foreground/20 border border-primary-foreground/20 text-primary-foreground'
								>
									Mentor bo'lish
								</Button>
							</Link>
						</div>
					</div>
				</section>
			</main>
		</div>
	)
}
