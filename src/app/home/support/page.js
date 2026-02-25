'use client'

import Navbar from '@/components/landing/Navbar'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle2, Mail, MapPin, MessageCircle, Send } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function SupportPage() {
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isSuccess, setIsSuccess] = useState(false)

	// Formani yuborish simulyatsiyasi
	const handleSubmit = e => {
		e.preventDefault()
		setIsSubmitting(true)

		// API ga jo'natish jarayonini simulyatsiya qilish (2 soniya)
		setTimeout(() => {
			setIsSubmitting(false)
			setIsSuccess(true)

			// 5 soniyadan keyin formani yana asl holatiga qaytarish
			setTimeout(() => setIsSuccess(false), 5000)
		}, 2000)
	}

	return (
		<div className='min-h-screen bg-muted/10 flex flex-col'>
			<Navbar />

			<main className='flex-1 container mx-auto px-4 py-12 md:py-20 max-w-6xl'>
				{/* HEADER SECTION */}
				<div className='text-center mb-16'>
					<h1 className='text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-foreground'>
						Qanday yordam bera olamiz?
					</h1>
					<p className='text-muted-foreground text-lg max-w-2xl mx-auto'>
						Texnik nosozliklar, takliflar yoki mentorlar bilan bog'liq muammolar
						bo'yicha biz bilan bog'laning. Jamoamiz imkon qadar tezroq javob
						beradi.
					</p>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-3 gap-8 items-start'>
					{/* CHAP TOMON: ALOQA MA'LUMOTLARI */}
					<div className='lg:col-span-1 space-y-6'>
						<Card className='border-none shadow-sm bg-primary/5'>
							<CardContent className='p-6 flex items-start space-x-4'>
								<div className='bg-primary/10 p-3 rounded-full'>
									<MessageCircle className='h-6 w-6 text-primary' />
								</div>
								<div>
									<h3 className='font-bold text-lg mb-1'>Telegram orqali</h3>
									<p className='text-sm text-muted-foreground mb-3'>
										Eng tezkor javob olish usuli. Bizning botimiz 24/7 ishlaydi.
									</p>
									<Button
										variant='link'
										className='p-0 h-auto text-primary font-semibold'
									>
										@TengdoshUstoz_Bot &rarr;
									</Button>
								</div>
							</CardContent>
						</Card>

						<Card className='border-none shadow-sm'>
							<CardContent className='p-6 flex items-start space-x-4'>
								<div className='bg-muted p-3 rounded-full'>
									<Mail className='h-6 w-6 text-foreground' />
								</div>
								<div>
									<h3 className='font-bold text-lg mb-1'>Elektron pochta</h3>
									<p className='text-sm text-muted-foreground mb-3'>
										Batafsil murojaatlar va fayllar yuborish uchun.
									</p>
									<a
										href='mailto:support@tengdoshustoz.uz'
										className='text-sm font-medium hover:underline'
									>
										support@tengdoshustoz.uz
									</a>
								</div>
							</CardContent>
						</Card>

						<Card className='border-none shadow-sm'>
							<CardContent className='p-6 flex items-start space-x-4'>
								<div className='bg-muted p-3 rounded-full'>
									<MapPin className='h-6 w-6 text-foreground' />
								</div>
								<div>
									<h3 className='font-bold text-lg mb-1'>
										Universitet manzili
									</h3>
									<p className='text-sm text-muted-foreground'>
										Toshkent shahar, Sergeli tumani, PDP University binosi,
										2-qavat, "Tengdosh Ustoz" ofisi.
									</p>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* O'NG TOMON: MUROJAAT FORMASI */}
					<div className='lg:col-span-2'>
						<Card className='border-muted shadow-sm'>
							<CardHeader className='pb-4'>
								<CardTitle className='text-2xl'>Xabar yuborish</CardTitle>
								<CardDescription className='text-base'>
									Platforma bo'yicha savol yoki taklifingizni quyidagi forma
									orqali qoldiring.
								</CardDescription>
							</CardHeader>

							<CardContent>
								{isSuccess ? (
									// Muvaffaqiyatli yuborilgandagi holat
									<div className='py-12 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500'>
										<div className='h-16 w-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4'>
											<CheckCircle2 className='h-8 w-8 text-green-500' />
										</div>
										<h3 className='text-2xl font-bold mb-2'>
											Xabaringiz qabul qilindi!
										</h3>
										<p className='text-muted-foreground max-w-sm'>
											Murojaatingiz uchun tashakkur. Adminlarimiz tez orada siz
											ko'rsatgan pochta yoki profil orqali aloqaga chiqishadi.
										</p>
										<Button
											variant='outline'
											className='mt-6'
											onClick={() => setIsSuccess(false)}
										>
											Yangi xabar yozish
										</Button>
									</div>
								) : (
									// Xabar yuborish formasi
									<form onSubmit={handleSubmit} className='space-y-6'>
										<div className='grid sm:grid-cols-2 gap-4'>
											<div className='space-y-2'>
												<Label htmlFor='name'>Ism-sharifingiz</Label>
												<Input
													id='name'
													placeholder='Masalan: Sardor Rahmatov'
													required
												/>
											</div>
											<div className='space-y-2'>
												<Label htmlFor='email'>Elektron pochta</Label>
												<Input
													id='email'
													type='email'
													placeholder='nom@talaba.uz'
													required
												/>
											</div>
										</div>

										<div className='space-y-2'>
											<Label htmlFor='subject'>Murojaat mavzusi</Label>
											<Input
												id='subject'
												placeholder="Masalan: Dars vaqti bo'yicha muammo"
												required
											/>
										</div>

										<div className='space-y-2'>
											<Label htmlFor='message'>Batafsil xabar matni</Label>
											<Textarea
												id='message'
												placeholder='Muammo yoki taklifingizni batafsil yozib qoldiring...'
												className='min-h-[150px] resize-y'
												required
											/>
										</div>

										<Button
											type='submit'
											className='w-full sm:w-auto'
											disabled={isSubmitting}
										>
											{isSubmitting ? (
												<>
													<span className='animate-spin mr-2 border-2 border-current border-t-transparent rounded-full h-4 w-4'></span>
													Yuborilmoqda...
												</>
											) : (
												<>
													<Send className='mr-2 h-4 w-4' /> Xabarni yuborish
												</>
											)}
										</Button>
									</form>
								)}
							</CardContent>
						</Card>

						{/* FAQ sahifasiga yo'naltirish */}
						<div className='mt-6 text-center lg:text-left'>
							<p className='text-sm text-muted-foreground'>
								Savolingiz umumiy xususiyatga egami? Bizning{' '}
								<Link
									href='/home/faq'
									className='text-primary font-medium hover:underline'
								>
									Ko'p beriladigan savollar (FAQ)
								</Link>{' '}
								sahifamizni ko'rib chiqing.
							</p>
						</div>
					</div>
				</div>
			</main>
		</div>
	)
}
