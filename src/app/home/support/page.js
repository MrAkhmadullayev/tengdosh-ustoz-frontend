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
// 🔥 Markazlashgan utilitalar
import { getErrorMessage } from '@/lib/utils'
import { motion } from 'framer-motion'
import {
	Bot,
	CheckCircle,
	Loader2,
	MapPin,
	MessageCircle,
	Phone,
	Send,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'

// ==========================================
// 🎨 ANIMATSIYALAR
// ==========================================
const containerVariants = {
	hidden: { opacity: 0 },
	show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
	hidden: { opacity: 0, y: 15 },
	show: {
		opacity: 1,
		y: 0,
		transition: { type: 'spring', stiffness: 300, damping: 24 },
	},
}

// ==========================================
// 🚀 ASOSIY KOMPONENT
// ==========================================
export default function SupportPage() {
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isSuccess, setIsSuccess] = useState(false)
	const [phone, setPhone] = useState('+998 ')

	// Telefon raqamini chiroyli formatlash (+998 90 123 45 67)
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
				toast.success('Xabaringiz yuborildi!')
				// 8 soniyadan keyin formani qaytarish
				setTimeout(() => setIsSuccess(false), 8000)
			}
		} catch (error) {
			toast.error(getErrorMessage(error, 'Xabar yuborishda xatolik yuz berdi'))
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className='min-h-screen bg-muted/20 flex flex-col'>
			<Navbar />

			<main className='flex-1 container mx-auto px-4 py-12 md:py-20 max-w-6xl'>
				{/* 🏷️ HEADER SECTION */}
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}
					className='text-center mb-12 sm:mb-16 space-y-3'
				>
					<h1 className='text-3xl md:text-4xl font-extrabold tracking-tight text-foreground'>
						Qanday yordam bera olamiz?
					</h1>
					<p className='text-muted-foreground text-sm sm:text-base max-w-xl mx-auto text-balance'>
						Texnik savollar, takliflar yoki muammolar bo'yicha biz bilan
						bog'laning. Jamoamiz imkon qadar tezroq javob beradi.
					</p>
				</motion.div>

				<motion.div
					variants={containerVariants}
					initial='hidden'
					animate='show'
					className='grid grid-cols-1 lg:grid-cols-3 gap-6 items-start mb-12'
				>
					{/* 📞 SIDEBAR INFO */}
					<div className='lg:col-span-1 space-y-4'>
						<motion.div variants={itemVariants}>
							<Card className='shadow-sm border-primary/20 bg-primary/5'>
								<CardContent className='p-5 flex items-start space-x-4'>
									<div className='bg-primary/10 p-2.5 rounded-lg shrink-0'>
										<MessageCircle className='h-5 w-5 text-primary' />
									</div>
									<div>
										<h3 className='font-bold text-sm mb-1 text-foreground'>
											Telegram orqali
										</h3>
										<p className='text-xs text-muted-foreground mb-3'>
											Eng tezkor javob olish usuli. Bizning botimiz 24/7
											ishlaydi.
										</p>
										<a
											href='https://t.me/tengdoshmentorbot'
											target='_blank'
											rel='noopener noreferrer'
											className='text-xs font-bold text-primary hover:underline flex items-center'
										>
											@tengdoshmentorbot <Send className='ml-1 h-3 w-3' />
										</a>
									</div>
								</CardContent>
							</Card>
						</motion.div>

						<motion.div variants={itemVariants}>
							<Card className='shadow-sm'>
								<CardContent className='p-5 flex items-start space-x-4'>
									<div className='bg-muted p-2.5 rounded-lg shrink-0'>
										<Phone className='h-5 w-5 text-muted-foreground' />
									</div>
									<div>
										<h3 className='font-bold text-sm mb-1'>Telefon orqali</h3>
										<p className='text-xs text-muted-foreground mb-3'>
											Ish vaqtlarida bog'lanishingiz mumkin.
										</p>
										<p className='text-xs font-bold text-foreground'>
											+998 78 123 45 67
										</p>
									</div>
								</CardContent>
							</Card>
						</motion.div>

						<motion.div variants={itemVariants}>
							<Card className='shadow-sm'>
								<CardContent className='p-5 flex items-start space-x-4'>
									<div className='bg-muted p-2.5 rounded-lg shrink-0'>
										<MapPin className='h-5 w-5 text-muted-foreground' />
									</div>
									<div>
										<h3 className='font-bold text-sm mb-1'>Manzil</h3>
										<p className='text-xs text-muted-foreground leading-relaxed'>
											Toshkent shahar, Sergeli tumani, PDP University.
										</p>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					</div>

					{/* ✉️ FORM SECTION */}
					<motion.div variants={itemVariants} className='lg:col-span-2'>
						<Card className='shadow-sm border-border'>
							<CardHeader className='border-b bg-muted/10 pb-6'>
								<CardTitle className='text-xl font-bold'>
									Murojaat yo'llash
								</CardTitle>
								<CardDescription className='text-sm'>
									Platforma bo'yicha savol yoki taklifingizni qoldiring.
								</CardDescription>
							</CardHeader>

							<CardContent className='pt-6'>
								{isSuccess ? (
									<div className='py-12 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500'>
										<div className='h-14 w-14 bg-green-500/10 rounded-full flex items-center justify-center mb-4'>
											<CheckCircle className='h-7 w-7 text-green-600' />
										</div>
										<h3 className='text-xl font-bold mb-2'>
											Xabaringiz qabul qilindi!
										</h3>
										<p className='text-sm text-muted-foreground max-w-xs mb-6'>
											Murojaatingiz uchun rahmat. Tez orada{' '}
											<span className='font-bold text-foreground'>
												Telegram bot
											</span>{' '}
											orqali javob olasiz.
										</p>
										<Badge
											variant='secondary'
											className='gap-2 px-3 py-1 font-medium text-xs border-transparent shadow-none'
										>
											<Bot className='h-3.5 w-3.5' /> @tengdoshmentorbot
										</Badge>
										<Button
											variant='outline'
											size='sm'
											className='mt-8'
											onClick={() => setIsSuccess(false)}
										>
											Yangi murojaat
										</Button>
									</div>
								) : (
									<form onSubmit={handleSubmit} className='space-y-6'>
										<div className='grid sm:grid-cols-2 gap-4'>
											<div className='space-y-2'>
												<Label
													htmlFor='name'
													className='text-xs font-bold uppercase tracking-wider text-muted-foreground'
												>
													Ism-sharif
												</Label>
												<Input
													id='name'
													name='name'
													placeholder='Masalan: Sardor Rahmatov'
													required
													className='h-10'
												/>
											</div>
											<div className='space-y-2'>
												<Label
													htmlFor='phone'
													className='text-xs font-bold uppercase tracking-wider text-muted-foreground'
												>
													Telefon
												</Label>
												<Input
													id='phone'
													name='phone'
													type='tel'
													value={phone}
													onChange={handlePhoneChange}
													placeholder='+998 90 123 45 67'
													required
													className='h-10'
												/>
											</div>
										</div>

										<div className='space-y-2'>
											<Label
												htmlFor='subject'
												className='text-xs font-bold uppercase tracking-wider text-muted-foreground'
											>
												Mavzu
											</Label>
											<Input
												id='subject'
												name='subject'
												placeholder='Murojaat mavzusini kiriting'
												required
												className='h-10'
											/>
										</div>

										<div className='space-y-2'>
											<Label
												htmlFor='message'
												className='text-xs font-bold uppercase tracking-wider text-muted-foreground'
											>
												Xabar
											</Label>
											<Textarea
												id='message'
												name='message'
												placeholder='Muammo yoki taklifingizni batafsil yozing...'
												className='min-h-[120px] resize-none'
												required
											/>
										</div>

										<Button
											type='submit'
											className='w-full sm:w-auto font-bold h-10 px-8'
											disabled={isSubmitting}
										>
											{isSubmitting ? (
												<>
													<Loader2 className='mr-2 h-4 w-4 animate-spin' />
													Yuborilmoqda...
												</>
											) : (
												<>
													<Send className='mr-2 h-4 w-4' /> Yuborish
												</>
											)}
										</Button>
									</form>
								)}
							</CardContent>
						</Card>

						<div className='mt-6 text-center lg:text-left'>
							<p className='text-xs text-muted-foreground'>
								Savolingiz umumiy xususiyatga egami?{' '}
								<Link
									href='/home/faq'
									className='text-primary font-bold hover:underline'
								>
									FAQ
								</Link>{' '}
								sahifasini ko'rib chiqing.
							</p>
						</div>
					</motion.div>
				</motion.div>

				{/* 🗺️ MAP SECTION */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
				>
					<Card className='border shadow-sm overflow-hidden h-[350px] rounded-xl'>
						{/* Google Maps Embed PDP University placeholder */}
						<iframe
							src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2999.30829891004!2d69.21327117589574!3d41.25862217131649!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8ba77a347963%3A0x7d8383f706d7a46!2sPDP%20University!5e0!3m2!1suz!2s!4v1710000000000!5m2!1suz!2s'
							width='100%'
							height='100%'
							style={{ border: 0 }}
							allowFullScreen=''
							loading='lazy'
							referrerPolicy='no-referrer-when-downgrade'
							className='grayscale-[30%] hover:grayscale-0 transition-all duration-700'
						/>
					</Card>
				</motion.div>
			</main>
		</div>
	)
}
