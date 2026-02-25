'use client'

import Navbar from '@/components/landing/Navbar'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from '@/components/ui/input-otp'
import { Loader2, MessageCircle, Send, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function LoginPage() {
	const [otp, setOtp] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [timeLeft, setTimeLeft] = useState(60) // Qayta so'rash uchun taymer
	const [isSuccess, setIsSuccess] = useState(false)

	// Taymer mantig'i
	useEffect(() => {
		if (timeLeft > 0) {
			const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
			return () => clearTimeout(timerId)
		}
	}, [timeLeft])

	// Kirishni tasdiqlash
	const handleVerify = e => {
		e.preventDefault()
		if (otp.length !== 6) return

		setIsLoading(true)

		// Backendga kodni yuborishni simulyatsiya qilish
		setTimeout(() => {
			setIsLoading(false)
			setIsSuccess(true)

			// Muvaffaqiyatli kirgandan so'ng dashboard'ga yo'naltirish (simulyatsiya)
			// router.push("/dashboard");
		}, 1500)
	}

	return (
		<div className=''>
			<Navbar />
			<div className='min-h-screen bg-muted/20 flex flex-col items-center justify-center p-4'>
				<Card className='w-full max-w-md border-muted shadow-lg'>
					{isSuccess ? (
						// MUVAFFAQIYATLI KIRISH
						<CardContent className='pt-10 pb-8 flex flex-col items-center text-center space-y-4 animate-in fade-in zoom-in duration-300'>
							<div className='h-20 w-20 bg-green-500/10 rounded-full flex items-center justify-center mb-2'>
								<ShieldCheck className='h-10 w-10 text-green-500' />
							</div>
							<CardTitle className='text-2xl'>Muvaffaqiyatli!</CardTitle>
							<CardDescription className='text-base'>
								Tizimga muvaffaqiyatli kirdingiz. Profilingizga
								yo'naltirilmoqdasiz...
							</CardDescription>
							<Loader2 className='h-6 w-6 animate-spin text-primary mt-4' />
						</CardContent>
					) : (
						// LOGIN FORMASI
						<>
							<CardHeader className='text-center space-y-3 pb-6 pt-8'>
								<div className='mx-auto bg-primary/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-2'>
									<ShieldCheck className='h-7 w-7 text-primary' />
								</div>
								<CardTitle className='text-2xl font-bold tracking-tight'>
									Tizimga kirish
								</CardTitle>
								<CardDescription className='text-base'>
									Telegram botimiz orqali olingan 6 xonali tasdiqlash kodini
									kiriting.
								</CardDescription>
							</CardHeader>

							<CardContent className='space-y-6'>
								{/* TELEGRAM BOT LINKI */}
								<div className='bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-center justify-between'>
									<div className='flex items-center gap-3'>
										<div className='bg-blue-500 text-white p-2 rounded-full'>
											<MessageCircle className='h-5 w-5' />
										</div>
										<div className='text-left'>
											<p className='text-sm font-medium text-foreground'>
												Kodni olish uchun:
											</p>
											<a
												href='https://t.me/TengdoshUstoz_Bot'
												target='_blank'
												rel='noopener noreferrer'
												className='text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline'
											>
												@TengdoshUstoz_Bot
											</a>
										</div>
									</div>
									<Button
										size='icon'
										variant='ghost'
										className='h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-500/20'
										asChild
									>
										<a
											href='https://t.me/TengdoshUstoz_Bot'
											target='_blank'
											rel='noopener noreferrer'
										>
											<Send className='h-4 w-4' />
										</a>
									</Button>
								</div>

								{/* OTP INPUT */}
								<form
									onSubmit={handleVerify}
									className='flex flex-col items-center space-y-6'
								>
									<div className='flex justify-center w-full'>
										<InputOTP
											maxLength={6}
											value={otp}
											onChange={value => setOtp(value)}
											disabled={isLoading}
											autoFocus
										>
											<InputOTPGroup>
												<InputOTPSlot
													index={0}
													className='h-12 w-10 sm:w-12 sm:h-14 text-lg'
												/>
												<InputOTPSlot
													index={1}
													className='h-12 w-10 sm:w-12 sm:h-14 text-lg'
												/>
												<InputOTPSlot
													index={2}
													className='h-12 w-10 sm:w-12 sm:h-14 text-lg'
												/>
											</InputOTPGroup>
											<InputOTPSeparator />
											<InputOTPGroup>
												<InputOTPSlot
													index={3}
													className='h-12 w-10 sm:w-12 sm:h-14 text-lg'
												/>
												<InputOTPSlot
													index={4}
													className='h-12 w-10 sm:w-12 sm:h-14 text-lg'
												/>
												<InputOTPSlot
													index={5}
													className='h-12 w-10 sm:w-12 sm:h-14 text-lg'
												/>
											</InputOTPGroup>
										</InputOTP>
									</div>

									<Button
										type='submit'
										className='w-full h-12 text-base font-semibold'
										disabled={otp.length !== 6 || isLoading}
									>
										{isLoading ? (
											<>
												<Loader2 className='mr-2 h-5 w-5 animate-spin' />
												Tasdiqlanmoqda...
											</>
										) : (
											'Tasdiqlash va Kirish'
										)}
									</Button>
								</form>
							</CardContent>

							<CardFooter className='flex flex-col items-center justify-center pb-8 border-t pt-6 bg-muted/10'>
								<p className='text-sm text-muted-foreground mb-2'>
									Kodni olmadingizmi?
								</p>
								<Button
									variant='link'
									className='text-primary font-medium p-0 h-auto'
									disabled={timeLeft > 0}
									onClick={() => setTimeLeft(60)} // Qayta yuborish mantig'i
								>
									{timeLeft > 0
										? `Qayta so'rash (${timeLeft}s)`
										: 'Kodni qayta yuborish'}
								</Button>
							</CardFooter>
						</>
					)}
				</Card>

				{/* Footer yozuvi */}
				<p className='mt-8 text-sm text-muted-foreground text-center max-w-xs'>
					Tizimga kirish orqali siz platformaning{' '}
					<Link href='/terms' className='underline hover:text-foreground'>
						Foydalanish shartlariga
					</Link>{' '}
					rozi bo'lasiz.
				</p>
			</div>
		</div>
	)
}
