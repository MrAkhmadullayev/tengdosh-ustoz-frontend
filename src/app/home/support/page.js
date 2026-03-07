'use client'

import Navbar from '@/components/landing/Navbar'
import { Badge } from '@/components/ui/badge'
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
import api from '@/lib/api'
import { motion } from 'framer-motion'
import {
	Bot,
	CheckCircle2,
	MapPin,
	MessageCircle,
	Phone,
	Send,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

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

export default function SupportPage() {
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isSuccess, setIsSuccess] = useState(false)
	const [errorMsg, setErrorMsg] = useState('')
	const [phone, setPhone] = useState('+998 ')

	const handlePhoneChange = e => {
		let val = e.target.value.replace(/[^\d+]/g, '')
		if (!val.startsWith('+998')) val = '+998'

		const rawNumbers = val.substring(4).slice(0, 9)
		let formatted = '+998'

		if (rawNumbers.length > 0) formatted += ' ' + rawNumbers.substring(0, 2)
		if (rawNumbers.length > 2) formatted += ' ' + rawNumbers.substring(2, 5)
		if (rawNumbers.length > 5) formatted += ' ' + rawNumbers.substring(5, 9)

		setPhone(formatted)
	}

	const handleSubmit = async e => {
		e.preventDefault()
		setIsSubmitting(true)
		setErrorMsg('')

		const formData = new FormData(e.target)
		const payload = {
			name: formData.get('name'),
			phone: phone.replace(/\s+/g, ''),
			subject: formData.get('subject'),
			message: formData.get('message'),
		}

		try {
			const res = await api.post('/public/support', payload)
			if (res?.data?.success) {
				setIsSuccess(true)
				e.target.reset()
				setPhone('+998 ')
				setTimeout(() => setIsSuccess(false), 8000)
			}
		} catch (error) {
			setErrorMsg(
				error.response?.data?.message || 'Xabar yuborishda xatolik yuz berdi',
			)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className='min-h-screen bg-muted/10 flex flex-col'>
			<Navbar />

			<main className='flex-1 container mx-auto px-4 py-12 md:py-20 max-w-6xl'>
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className='text-center mb-16'
				>
					<h1 className='text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-foreground'>
						Qanday yordam bera olamiz?
					</h1>
					<p className='text-muted-foreground text-lg max-w-2xl mx-auto'>
						Texnik nosozliklar, takliflar yoki mentorlar bilan bog'liq muammolar
						bo'yicha biz bilan bog'laning. Jamoamiz imkon qadar tezroq javob
						beradi.
					</p>
				</motion.div>

				<motion.div
					variants={containerVariants}
					initial='hidden'
					animate='show'
					className='grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-12'
				>
					<div className='lg:col-span-1 space-y-6'>
						<motion.div variants={itemVariants}>
							<Card className='border-none shadow-sm bg-primary/5'>
								<CardContent className='p-6 flex items-start space-x-4'>
									<div className='bg-primary/10 p-3 rounded-full'>
										<MessageCircle className='h-6 w-6 text-primary' />
									</div>
									<div>
										<h3 className='font-bold text-lg mb-1'>Telegram orqali</h3>
										<p className='text-sm text-muted-foreground mb-3'>
											Eng tezkor javob olish usuli. Bizning botimiz 24/7
											ishlaydi.
										</p>
										<a
											href='https://t.me/tengdoshmentorbot'
											target='_blank'
											rel='noopener noreferrer'
											className='text-primary font-semibold hover:underline'
										>
											@tengdoshmentorbot →
										</a>
									</div>
								</CardContent>
							</Card>
						</motion.div>

						<motion.div variants={itemVariants}>
							<Card className='border-none shadow-sm'>
								<CardContent className='p-6 flex items-start space-x-4'>
									<div className='bg-muted p-3 rounded-full'>
										<Phone className='h-6 w-6 text-foreground' />
									</div>
									<div>
										<h3 className='font-bold text-lg mb-1'>Telefon orqali</h3>
										<p className='text-sm text-muted-foreground mb-3'>
											Ish vaqtlarida telefon orqali bog'lanishingiz mumkin.
										</p>
										<a
											href='tel:+998901234567'
											className='text-sm font-medium hover:underline'
										>
											+998 90 123 45 67
										</a>
									</div>
								</CardContent>
							</Card>
						</motion.div>

						<motion.div variants={itemVariants}>
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
											Toshkent shahar, Sergeli tumani, PDP University
										</p>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					</div>

					<motion.div variants={itemVariants} className='lg:col-span-2'>
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
									<div className='py-12 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500'>
										<div className='h-16 w-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4'>
											<CheckCircle2 className='h-8 w-8 text-green-500' />
										</div>
										<h3 className='text-2xl font-bold mb-2'>
											Xabaringiz qabul qilindi!
										</h3>
										<p className='text-muted-foreground max-w-sm mb-3'>
											Murojaatingiz uchun tashakkur. Admin javobini{' '}
											<strong className='text-foreground'>
												Telegram bot orqali
											</strong>{' '}
											olasiz.
										</p>
										<Badge
											variant='secondary'
											className='gap-2 px-4 py-2 text-sm'
										>
											<Bot className='h-4 w-4' />
											@tengdoshmentorbot da javob kuting
										</Badge>
										<Button
											variant='outline'
											className='mt-6'
											onClick={() => setIsSuccess(false)}
										>
											Yangi xabar yozish
										</Button>
									</div>
								) : (
									<form onSubmit={handleSubmit} className='space-y-6'>
										<div className='grid sm:grid-cols-2 gap-4'>
											<div className='space-y-2'>
												<Label htmlFor='name'>Ism-sharifingiz</Label>
												<Input
													id='name'
													name='name'
													placeholder='Masalan: Sardor Rahmatov'
													required
												/>
											</div>
											<div className='space-y-2'>
												<Label htmlFor='phone'>Telefon raqamingiz</Label>
												<Input
													id='phone'
													name='phone'
													type='tel'
													value={phone}
													onChange={handlePhoneChange}
													placeholder='+998 90 123 45 67'
													required
												/>
												<p className='text-[11px] text-muted-foreground'>
													Botda ro'yxatdan o'tgan raqamingizni kiriting
												</p>
											</div>
										</div>

										<div className='space-y-2'>
											<Label htmlFor='subject'>Murojaat mavzusi</Label>
											<Input
												id='subject'
												name='subject'
												placeholder="Masalan: Dars vaqti bo'yicha muammo"
												required
											/>
										</div>

										<div className='space-y-2'>
											<Label htmlFor='message'>Batafsil xabar matni</Label>
											<Textarea
												id='message'
												name='message'
												placeholder='Muammo yoki taklifingizni batafsil yozib qoldiring...'
												className='min-h-[150px] resize-y'
												required
											/>
										</div>

										{errorMsg && (
											<p className='text-sm text-destructive bg-destructive/10 p-3 rounded-lg'>
												{errorMsg}
											</p>
										)}

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
					</motion.div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
				>
					<Card className='border-none shadow-md overflow-hidden h-[400px] md:h-[500px]'>
						<iframe
							src='https://maps.google.com/maps?q=PDP%20University%20Tashkent&t=&z=15&ie=UTF8&iwloc=&output=embed'
							width='100%'
							height='100%'
							style={{ border: 0 }}
							allowFullScreen=''
							loading='lazy'
							referrerPolicy='no-referrer-when-downgrade'
							className='grayscale-[20%] hover:grayscale-0 transition-all duration-500'
						></iframe>
					</Card>
				</motion.div>
			</main>
		</div>
	)
}
