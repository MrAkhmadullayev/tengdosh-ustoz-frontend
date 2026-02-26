'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
	Bell,
	Camera,
	KeyRound,
	Loader2,
	Save,
	ShieldCheck,
	User,
} from 'lucide-react'
import { useState } from 'react'

export default function SettingsPage() {
	const [isLoading, setIsLoading] = useState(false)

	const [profileData, setProfileData] = useState({
		firstName: 'Sadriddin',
		lastName: 'Fayzullayev',
		email: 'admin@tengdoshustoz.uz',
		phone: '+998 90 123 45 67',
		bio: 'Tizimning boshqaruvchisi va ishlab chiquvchisi.',
		language: 'uz',
	})

	const [notifications, setNotifications] = useState({
		emailAlerts: true,
		newMessages: true,
		courseUpdates: false,
		marketing: false,
	})

	const handleSave = () => {
		setIsLoading(true)
		setTimeout(() => {
			setIsLoading(false)
		}, 1000)
	}

	return (
		<div className='w-full max-w-4xl mx-auto space-y-6 pb-12'>
			{/* HEADER */}
			<div className='flex flex-col gap-1.5 pb-2'>
				<h1 className='text-2xl sm:text-3xl font-bold tracking-tight text-foreground'>
					Sozlamalar
				</h1>
				<p className='text-muted-foreground text-sm sm:text-base'>
					Tizim boshqaruvi, profilingiz xavfsizligi va bildirishnomalar
					tartibini shu yerdan moslashtiring.
				</p>
			</div>

			{/* TABS (Gorizontal standart Shadcn dizayni) */}
			<Tabs defaultValue='profile' className='w-full'>
				<TabsList className='grid w-full grid-cols-3 h-auto p-1 bg-muted/50 mb-8 rounded-xl'>
					<TabsTrigger
						value='profile'
						className='py-2.5 sm:py-3 text-xs sm:text-sm gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm'
					>
						<User className='h-4 w-4 hidden sm:block' /> Shaxsiy ma'lumotlar
					</TabsTrigger>
					<TabsTrigger
						value='security'
						className='py-2.5 sm:py-3 text-xs sm:text-sm gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm'
					>
						<KeyRound className='h-4 w-4 hidden sm:block' /> Xavfsizlik
					</TabsTrigger>
					<TabsTrigger
						value='notifications'
						className='py-2.5 sm:py-3 text-xs sm:text-sm gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm'
					>
						<Bell className='h-4 w-4 hidden sm:block' /> Bildirishnomalar
					</TabsTrigger>
				</TabsList>

				{/* 1. PROFIL TAB */}
				<TabsContent
					value='profile'
					className='space-y-6 outline-none animate-in fade-in-50 duration-500'
				>
					<Card className='shadow-sm border-muted overflow-hidden'>
						<CardHeader className='bg-muted/30 border-b pb-5'>
							<CardTitle className='text-lg'>Profil ma'lumotlari</CardTitle>
							<CardDescription>
								Tizimdagi boshqalarga ko'rinadigan shaxsiy ma'lumotlaringiz.
								O'zgarishlar darhol saqlanadi.
							</CardDescription>
						</CardHeader>
						<CardContent className='p-6 space-y-8'>
							{/* Avatar */}
							<div className='flex flex-col sm:flex-row gap-6 items-center sm:items-start p-4 bg-muted/10 rounded-xl border border-muted/50'>
								<div className='relative group shrink-0'>
									<Avatar className='h-24 w-24 border-2 border-background shadow-sm'>
										<AvatarImage src='' alt={profileData.firstName} />
										<AvatarFallback className='text-xl bg-primary/10 text-primary font-bold'>
											{profileData.firstName[0]}
											{profileData.lastName[0]}
										</AvatarFallback>
									</Avatar>
									<div className='absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer'>
										<Camera className='h-6 w-6 text-white' />
									</div>
								</div>
								<div className='space-y-1.5 text-center sm:text-left pt-2'>
									<h3 className='text-sm font-semibold text-foreground'>
										Profil rasmini yangilash
									</h3>
									<p className='text-[13px] text-muted-foreground max-w-xs'>
										JPG, GIF yoki PNG fayllar. Maksimal hajm 2MB.
									</p>
									<div className='flex gap-2 justify-center sm:justify-start pt-2'>
										<Button variant='outline' size='sm' className='h-8'>
											Yangi yuklash
										</Button>
										<Button
											variant='ghost'
											size='sm'
											className='h-8 text-red-500 hover:text-red-600 hover:bg-red-500/10'
										>
											O'chirish
										</Button>
									</div>
								</div>
							</div>

							{/* Forma qismi */}
							<div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
								<div className='space-y-2'>
									<Label htmlFor='firstName'>Ism</Label>
									<Input
										id='firstName'
										value={profileData.firstName}
										onChange={e =>
											setProfileData({
												...profileData,
												firstName: e.target.value,
											})
										}
										className='bg-background'
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='lastName'>Familiya</Label>
									<Input
										id='lastName'
										value={profileData.lastName}
										onChange={e =>
											setProfileData({
												...profileData,
												lastName: e.target.value,
											})
										}
										className='bg-background'
									/>
								</div>
							</div>

							<div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
								<div className='space-y-2'>
									<Label htmlFor='email' className='flex justify-between'>
										Pochta manzili{' '}
										<span className='text-[10px] text-muted-foreground font-normal mt-0.5'>
											O'zgartirib bo'lmaydi
										</span>
									</Label>
									<Input
										id='email'
										type='email'
										value={profileData.email}
										className='bg-muted/50 text-muted-foreground cursor-not-allowed'
										readOnly
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='phone'>Telefon raqam</Label>
									<Input
										id='phone'
										value={profileData.phone}
										onChange={e =>
											setProfileData({ ...profileData, phone: e.target.value })
										}
										className='bg-background'
									/>
								</div>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='bio' className='flex justify-between'>
									O'zingiz haqingizda (Bio)
									<span className='text-[10px] text-muted-foreground font-normal mt-0.5'>
										{profileData.bio.length} / 500
									</span>
								</Label>
								<Textarea
									id='bio'
									className='min-h-[100px] resize-none bg-background text-sm leading-relaxed'
									value={profileData.bio}
									onChange={e =>
										setProfileData({ ...profileData, bio: e.target.value })
									}
									maxLength={500}
								/>
							</div>
						</CardContent>
						<CardFooter className='bg-muted/30 border-t px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4'>
							<p className='text-xs text-muted-foreground text-center sm:text-left'>
								Barcha kiritilgan o'zgarishlarni "Saqlash" orqali tasdiqlang.
							</p>
							<Button
								className='w-full sm:w-auto gap-2'
								onClick={handleSave}
								disabled={isLoading}
							>
								{isLoading ? (
									<Loader2 className='h-4 w-4 animate-spin' />
								) : (
									<Save className='h-4 w-4' />
								)}
								Saqlash
							</Button>
						</CardFooter>
					</Card>

					<Card className='shadow-sm border-muted overflow-hidden'>
						<CardHeader className='bg-muted/30 border-b pb-5'>
							<CardTitle className='text-lg'>Interfeys tili</CardTitle>
							<CardDescription>
								Platforma interfeysida qaysi tildan foydalanishni tanlang.
							</CardDescription>
						</CardHeader>
						<CardContent className='p-6'>
							<div className='max-w-sm space-y-2'>
								<Label>Asosiy til</Label>
								<Select
									value={profileData.language}
									onValueChange={val =>
										setProfileData({ ...profileData, language: val })
									}
								>
									<SelectTrigger className='bg-background'>
										<SelectValue placeholder='Tilni tanlang' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='uz'>O'zbek tili</SelectItem>
										<SelectItem value='ru'>Русский</SelectItem>
										<SelectItem value='en'>English (US)</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* 2. XAVFSIZLIK TAB */}
				<TabsContent
					value='security'
					className='space-y-6 outline-none animate-in fade-in-50 duration-500'
				>
					<Card className='shadow-sm border-muted overflow-hidden'>
						<CardHeader className='bg-muted/30 border-b pb-5'>
							<CardTitle className='text-lg'>Parolni o'zgartirish</CardTitle>
							<CardDescription>
								Profilingiz xavfsizligi uchun kuchli paroldan foydalaning.
							</CardDescription>
						</CardHeader>
						<CardContent className='p-6 space-y-6'>
							<div className='space-y-2 max-w-sm'>
								<Label htmlFor='current-password'>Joriy parol</Label>
								<Input
									id='current-password'
									type='password'
									placeholder='••••••••'
									className='bg-background'
								/>
							</div>

							<div className='border-t border-border/50 max-w-sm' />

							<div className='flex flex-col sm:flex-row gap-5 max-w-2xl'>
								<div className='space-y-2 w-full'>
									<Label htmlFor='new-password'>Yangi parol</Label>
									<Input
										id='new-password'
										type='password'
										placeholder='Kamida 8ta belgi'
										className='bg-background'
									/>
								</div>
								<div className='space-y-2 w-full'>
									<Label htmlFor='confirm-password'>Parolni takrorlang</Label>
									<Input
										id='confirm-password'
										type='password'
										placeholder='Xuddi shunday parol'
										className='bg-background'
									/>
								</div>
							</div>
						</CardContent>
						<CardFooter className='bg-muted/30 border-t px-6 py-4'>
							<Button
								className='w-full sm:w-auto gap-2'
								onClick={handleSave}
								disabled={isLoading}
							>
								{isLoading ? (
									<Loader2 className='h-4 w-4 animate-spin' />
								) : (
									<Save className='h-4 w-4' />
								)}
								Parolni yangilash
							</Button>
						</CardFooter>
					</Card>

					<Card className='shadow-sm border-emerald-500/20 bg-emerald-500/5 overflow-hidden'>
						<CardHeader className='pb-3 border-b border-emerald-500/10'>
							<CardTitle className='flex items-center gap-2 text-lg text-emerald-600 dark:text-emerald-500'>
								<ShieldCheck className='h-5 w-5' />
								Ikki bosqichli autentifikatsiya (2FA)
							</CardTitle>
						</CardHeader>
						<CardContent className='p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
							<div className='space-y-1.5 max-w-md'>
								<h4 className='font-semibold text-sm'>
									SMS va Telegram orqali
								</h4>
								<p className='text-[13px] text-muted-foreground leading-relaxed'>
									2FA funksiyasi o‘chiq. Uni yoqsangiz, profilingizga yangi
									qurilmalardan kirishda paroldan tashqari maxsus kod so‘raladi.
								</p>
							</div>
							<Button
								variant='outline'
								className='border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10 shrink-0 w-full sm:w-auto'
							>
								Himoyani yoqish
							</Button>
						</CardContent>
					</Card>
				</TabsContent>

				{/* 3. BILDIRISHNOMALAR TAB */}
				<TabsContent
					value='notifications'
					className='space-y-6 outline-none animate-in fade-in-50 duration-500'
				>
					<Card className='shadow-sm border-muted overflow-hidden'>
						<CardHeader className='bg-muted/30 border-b pb-5'>
							<CardTitle className='text-lg'>Bildirishnomalar</CardTitle>
							<CardDescription>
								Qaysi holatlarda sizga xabar yuborilishini sozlang.
							</CardDescription>
						</CardHeader>
						<CardContent className='p-0'>
							<div className='divide-y divide-border/50'>
								<div className='flex items-start sm:items-center justify-between gap-4 p-6 hover:bg-muted/30 transition-colors'>
									<div className='space-y-1 pr-4'>
										<Label className='text-[14px] font-semibold cursor-pointer text-foreground'>
											Umumiy email xabarnomalar
										</Label>
										<p className='text-[13px] text-muted-foreground leading-relaxed max-w-xl'>
											Tizimdagi muhim yangiliklar, xavfsizlik va yangi
											yo'riqnomalar haqida.
										</p>
									</div>
									<Switch
										checked={notifications.emailAlerts}
										onCheckedChange={c =>
											setNotifications({ ...notifications, emailAlerts: c })
										}
										className='shrink-0 mt-1 sm:mt-0'
									/>
								</div>

								<div className='flex items-start sm:items-center justify-between gap-4 p-6 hover:bg-muted/30 transition-colors'>
									<div className='space-y-1 pr-4'>
										<Label className='text-[14px] font-semibold cursor-pointer text-foreground'>
											Chat va Xabarlar
										</Label>
										<p className='text-[13px] text-muted-foreground leading-relaxed max-w-xl'>
											Sizga dars yoki shaxsiy xat kelganida pochta/telegram
											orqali bildirishnoma olish.
										</p>
									</div>
									<Switch
										checked={notifications.newMessages}
										onCheckedChange={c =>
											setNotifications({ ...notifications, newMessages: c })
										}
										className='shrink-0 mt-1 sm:mt-0'
									/>
								</div>

								<div className='flex items-start sm:items-center justify-between gap-4 p-6 hover:bg-muted/30 transition-colors'>
									<div className='space-y-1 pr-4'>
										<Label className='text-[14px] font-semibold cursor-pointer text-foreground'>
											Kurs va Dars o'zgarishlari
										</Label>
										<p className='text-[13px] text-muted-foreground leading-relaxed max-w-xl'>
											Siz yozilgan dars vaqti o'zgarsa yoki bekor qilinsa xabar
											berish.
										</p>
									</div>
									<Switch
										checked={notifications.courseUpdates}
										onCheckedChange={c =>
											setNotifications({ ...notifications, courseUpdates: c })
										}
										className='shrink-0 mt-1 sm:mt-0'
									/>
								</div>

								<div className='flex items-start sm:items-center justify-between gap-4 p-6 hover:bg-muted/30 transition-colors'>
									<div className='space-y-1 pr-4'>
										<Label className='text-[14px] font-semibold cursor-pointer text-foreground'>
											Marketing va Chegirmalar
										</Label>
										<p className='text-[13px] text-muted-foreground leading-relaxed max-w-xl'>
											Platformadagi aksiyalar, arzonlashgan darslar va
											universitet tadbirlari haqida e'lonlar.
										</p>
									</div>
									<Switch
										checked={notifications.marketing}
										onCheckedChange={c =>
											setNotifications({ ...notifications, marketing: c })
										}
										className='shrink-0 mt-1 sm:mt-0'
									/>
								</div>
							</div>
						</CardContent>
						<CardFooter className='bg-muted/30 border-t px-6 py-4 flex justify-end gap-3'>
							<Button variant='outline' disabled={isLoading}>
								Bekor qilish
							</Button>
							<Button
								className='gap-2'
								onClick={handleSave}
								disabled={isLoading}
							>
								{isLoading ? (
									<Loader2 className='h-4 w-4 animate-spin' />
								) : (
									<Save className='h-4 w-4' />
								)}
								Saqlash
							</Button>
						</CardFooter>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	)
}
