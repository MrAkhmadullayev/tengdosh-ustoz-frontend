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
import api from '@/lib/api'
import { useAuth } from '@/lib/auth-context'
import { useTranslation } from '@/lib/i18n'
// 🔥 utils'dan markaziy funksiya olinmoqda
import { cn, getErrorMessage } from '@/lib/utils'
import { Loader2, MessageCircle, Send, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function LoginPage() {
	const router = useRouter()
	const { refreshUser } = useAuth()
	const { t } = useTranslation()

	const [otp, setOtp] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [timeLeft, setTimeLeft] = useState(60)
	const [isSuccess, setIsSuccess] = useState(false)
	const [error, setError] = useState('')
	const [roleText, setRoleText] = useState('')

	// 1. Taymerni ishlashi
	useEffect(() => {
		if (timeLeft > 0) {
			const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
			return () => clearTimeout(timerId)
		}
	}, [timeLeft])

	// 2. Input o'zgarishi
	const handleOtpChange = useCallback(
		value => {
			setOtp(value)
			if (error) setError('')
		},
		[error],
	)

	// 3. OTP ni tekshirish (Verifikatsiya)
	const handleVerify = async e => {
		e.preventDefault()
		if (otp.length !== 6) return

		setIsLoading(true)
		setError('')

		try {
			const res = await api.post('/auth/verify', { code: otp })

			if (!res.data?.success) {
				throw new Error(res.data?.message || t('auth.invalidCode'))
			}

			const { user } = res.data
			setIsSuccess(true)
			await refreshUser() // Contextdagi userni yangilash
			toast.success(t('auth.success') || 'Muvaffaqiyatli kirdingiz')

			// Role ga qarab yo'naltirish
			if (!user.isRegistered) {
				setRoleText(t('auth.registration') || "Ro'yxatdan o'tish")
				setTimeout(() => router.push('/authentication/confirm'), 1500)
			} else if (user.role === 'admin') {
				setRoleText(t('auth.roleAdmin') || 'Admin panel')
				setTimeout(() => (window.location.href = '/admin/dashboard'), 1500)
			} else if (user.role === 'mentor') {
				setRoleText(t('auth.roleMentor') || 'Mentor paneli')
				setTimeout(() => (window.location.href = '/mentor/dashboard'), 1500)
			} else {
				setRoleText(t('auth.roleStudent') || 'Talaba paneli')
				setTimeout(() => (window.location.href = '/student/dashboard'), 1500)
			}
		} catch (err) {
			const errMsg = getErrorMessage(err, t('auth.serverError'))
			setError(errMsg)
			setOtp('') // Xato bo'lsa darhol kodni o'chirish
		} finally {
			setIsLoading(false)
		}
	}

	// UI: Asosiy qism
	return (
		<div className='min-h-screen bg-muted/30 flex flex-col'>
			<Navbar />

			<main className='flex-1 flex flex-col items-center justify-center p-4'>
				<Card className='w-full max-w-md shadow-lg border-border'>
					{/* Muvaffaqiyatli kirish state'i */}
					{isSuccess ? (
						<CardContent className='pt-10 pb-10 flex flex-col items-center text-center space-y-4 animate-in fade-in zoom-in duration-300'>
							<div className='h-16 w-16 bg-green-500/10 rounded-full flex items-center justify-center mb-2'>
								<ShieldCheck className='h-8 w-8 text-green-500' />
							</div>
							<CardTitle className='text-2xl'>
								{t('auth.success') || 'Muvaffaqiyatli'}
							</CardTitle>
							<CardDescription className='text-base font-medium'>
								{t('auth.successMessage') || 'Tizimga kirildi.'}{' '}
								<span className='text-foreground font-bold'>{roleText}</span>{' '}
								{t('auth.redirecting') || "sahifasiga yo'naltirilmoqda..."}
							</CardDescription>
							<Loader2 className='h-6 w-6 animate-spin text-muted-foreground mt-4' />
						</CardContent>
					) : (
						<>
							{/* Login header */}
							<CardHeader className='text-center space-y-2 pb-6 pt-8'>
								<div className='mx-auto bg-muted w-12 h-12 rounded-xl flex items-center justify-center mb-3'>
									<ShieldCheck className='h-6 w-6 text-foreground' />
								</div>
								<CardTitle className='text-2xl font-bold tracking-tight'>
									{t('auth.title') || 'Tizimga kirish'}
								</CardTitle>
								<CardDescription className='text-sm font-medium'>
									{t('auth.description') ||
										'Telegram bot orqali olingan 6 xonali kodni kiriting.'}
								</CardDescription>
							</CardHeader>

							<CardContent className='space-y-6'>
								{/* Bot info */}
								<div className='bg-muted p-4 rounded-xl border flex items-center justify-between shadow-sm'>
									<div className='flex items-center gap-3'>
										<div className='bg-primary/10 text-primary p-2 rounded-lg'>
											<MessageCircle className='h-4 w-4' />
										</div>
										<div className='text-left'>
											<p className='text-xs text-muted-foreground font-medium mb-0.5'>
												{t('auth.getCode') || 'Kodni olish uchun'}
											</p>
											<a
												href='https://t.me/tengdoshmentorbot'
												target='_blank'
												rel='noopener noreferrer'
												className='text-sm font-bold text-primary hover:underline'
											>
												@tengdoshmentorbot
											</a>
										</div>
									</div>
									<Button
										size='icon'
										variant='ghost'
										className='h-8 w-8 text-primary'
										asChild
									>
										<a
											href='https://t.me/tengdoshmentorbot'
											target='_blank'
											rel='noopener noreferrer'
										>
											<Send className='h-4 w-4' />
										</a>
									</Button>
								</div>

								{/* OTP Form */}
								<form
									onSubmit={handleVerify}
									className='flex flex-col items-center space-y-5'
								>
									<div className='flex justify-center w-full'>
										<InputOTP
											maxLength={6}
											value={otp}
											onChange={handleOtpChange}
											disabled={isLoading}
											autoFocus
										>
											<InputOTPGroup>
												<InputOTPSlot
													index={0}
													className={cn(
														'h-12 w-11 sm:w-12 sm:h-14 text-lg',
														error && 'border-destructive',
													)}
												/>
												<InputOTPSlot
													index={1}
													className={cn(
														'h-12 w-11 sm:w-12 sm:h-14 text-lg',
														error && 'border-destructive',
													)}
												/>
												<InputOTPSlot
													index={2}
													className={cn(
														'h-12 w-11 sm:w-12 sm:h-14 text-lg',
														error && 'border-destructive',
													)}
												/>
											</InputOTPGroup>
											<InputOTPSeparator />
											<InputOTPGroup>
												<InputOTPSlot
													index={3}
													className={cn(
														'h-12 w-11 sm:w-12 sm:h-14 text-lg',
														error && 'border-destructive',
													)}
												/>
												<InputOTPSlot
													index={4}
													className={cn(
														'h-12 w-11 sm:w-12 sm:h-14 text-lg',
														error && 'border-destructive',
													)}
												/>
												<InputOTPSlot
													index={5}
													className={cn(
														'h-12 w-11 sm:w-12 sm:h-14 text-lg',
														error && 'border-destructive',
													)}
												/>
											</InputOTPGroup>
										</InputOTP>
									</div>

									{error && (
										<p className='text-sm text-destructive font-medium text-center animate-in slide-in-from-top-1'>
											{error}
										</p>
									)}

									<Button
										type='submit'
										className='w-full h-11 font-semibold'
										disabled={otp.length !== 6 || isLoading}
									>
										{isLoading && (
											<Loader2 className='mr-2 h-4 w-4 animate-spin' />
										)}
										{!isLoading && (t('auth.verify') || 'Tasdiqlash')}
									</Button>
								</form>
							</CardContent>

							{/* Resend footer */}
							<CardFooter className='flex flex-col items-center justify-center pb-6 border-t pt-5 bg-muted/5 rounded-b-xl'>
								<p className='text-xs text-muted-foreground mb-1 font-medium'>
									{t('auth.codeNotReceived') || 'Kod kelmadimi?'}
								</p>
								<Button
									variant='link'
									className='text-primary font-semibold p-0 h-auto text-xs'
									disabled={timeLeft > 0}
									onClick={() => {
										setTimeLeft(60)
										setError('')
										setOtp('')
									}}
								>
									{timeLeft > 0
										? t('auth.resendTimer', { seconds: timeLeft }) ||
											`Qayta yuborish (${timeLeft}s)`
										: t('auth.resendCode') || 'Kodni qayta yuborish'}
								</Button>
							</CardFooter>
						</>
					)}
				</Card>

				{/* Terms and conditions */}
				<p className='mt-8 text-xs font-medium text-muted-foreground text-center max-w-xs'>
					{t('auth.termsAgree') || 'Tizimga kirish orqali siz'}{' '}
					<Link href='/home/terms' className='underline hover:text-foreground'>
						{t('auth.termsLink') || 'Foydalanish shartlariga'}
					</Link>{' '}
					{t('auth.termsEnd') || "rozi bo'lasiz."}
				</p>
			</main>
		</div>
	)
}
