'use client'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/lib/auth-context'
import { useTranslation } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import {
	Check,
	Globe,
	HelpCircle,
	Home,
	LifeBuoy,
	MonitorPlay,
	Moon,
	Settings,
	Sun,
	User,
	Users,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const LOCALE_LABELS = {
	uz: "O'zbekcha",
	ru: 'Русский',
	en: 'English',
}

export default function Navbar() {
	const { setTheme, theme } = useTheme()
	const router = useRouter()
	const pathname = usePathname()
	const { isAuthenticated, role, isLoading, logout } = useAuth()
	const { t, locale, setLocale, supportedLocales } = useTranslation()

	const NAV_LINKS = [
		{ name: t('nav.home') || 'Asosiy', href: '/', icon: Home },
		{
			name: t('nav.mentors') || 'Mentorlar',
			href: '/home/mentors',
			icon: Users,
		},
		{
			name: t('nav.liveLessons') || 'Jonli darslar',
			href: '/home/live-lessons',
			icon: MonitorPlay,
		},
		{
			name: t('nav.faq') || "Ko'p so'raladigan savollar",
			href: '/home/faq',
			icon: HelpCircle,
		},
	]

	const handleLogout = async () => {
		await logout()
		router.push('/authentication')
	}

	return (
		<>
			{/* 🖥️ DESKTOP NAVBAR */}
			<header className='sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-sm'>
				<div className='container flex h-16 max-w-7xl items-center justify-between mx-auto px-4 md:px-8'>
					{/* Chap taraf: Logo */}
					<div className='flex items-center gap-4'>
						<Link href='/' className='flex items-center space-x-2 group'>
							<div className='flex items-center justify-center transition-transform duration-300 group-hover:scale-105'>
								<Image
									src='/logo.png'
									alt='Tengdosh Logo'
									width={36}
									height={36}
									priority
									className='dark:invert opacity-90'
								/>
							</div>
							<span className='font-bold text-xl tracking-tight hidden sm:inline-block'>
								TengdoshUstoz
							</span>
						</Link>
					</div>

					{/* O'rta: Navigatsiya (Desktop) */}
					<nav className='hidden md:flex items-center justify-center space-x-1 text-sm font-medium'>
						{NAV_LINKS.map(link => {
							const isActive =
								pathname === link.href ||
								(link.href !== '/' && pathname.startsWith(link.href))
							return (
								<Link
									key={link.href}
									href={link.href}
									className={cn(
										'relative px-4 py-2 text-sm font-medium transition-colors z-10 rounded-full',
										isActive
											? 'text-primary-foreground'
											: 'text-muted-foreground hover:text-foreground',
									)}
								>
									{isActive && (
										<motion.div
											layoutId='desktop-active-pill'
											className='absolute inset-0 bg-primary rounded-full -z-10 shadow-sm'
											transition={{
												type: 'spring',
												stiffness: 350,
												damping: 30,
											}}
										/>
									)}
									<span className='relative z-10'>{link.name}</span>
								</Link>
							)
						})}
					</nav>

					{/* O'ng taraf: Harakatlar */}
					<div className='flex items-center justify-end space-x-2 sm:space-x-3'>
						<div className='flex items-center justify-end min-w-[80px] sm:min-w-[140px]'>
							{isLoading ? (
								<div className='h-9 w-20 animate-pulse bg-muted rounded-md shrink-0' />
							) : isAuthenticated ? (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									className='flex items-center gap-2'
								>
									<Link href={`/${role}/dashboard`}>
										<Button
											variant='secondary'
											size='icon'
											className='rounded-full shadow-sm'
											title={t('nav.profile')}
										>
											<User className='h-5 w-5' />
										</Button>
									</Link>
									<Button
										variant='destructive'
										size='sm'
										onClick={handleLogout}
										className='hidden sm:flex shrink-0 shadow-sm font-semibold'
									>
										{t('nav.logout') || 'Chiqish'}
									</Button>
								</motion.div>
							) : (
								<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
									<Link href='/authentication'>
										<Button
											size='sm'
											className='sm:px-5 font-semibold shadow-sm shrink-0'
										>
											{t('nav.login') || 'Kirish'}
										</Button>
									</Link>
								</motion.div>
							)}
						</div>

						{/* Sozlamalar (Tillar va Mavzu) */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant='outline'
									size='icon'
									className='shrink-0 h-9 w-9 sm:h-10 sm:w-10'
								>
									<Settings className='h-4 w-4 sm:h-5 sm:w-5' />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align='end'
								className='w-56 shadow-md rounded-xl'
							>
								<DropdownMenuLabel className='font-semibold'>
									{t('nav.settings') || 'Sozlamalar'}
								</DropdownMenuLabel>
								<DropdownMenuSeparator />

								<DropdownMenuLabel className='text-xs font-bold text-muted-foreground uppercase tracking-wider'>
									{t('nav.language') || 'Til'}
								</DropdownMenuLabel>
								{supportedLocales.map(loc => (
									<DropdownMenuItem
										key={loc}
										className='cursor-pointer font-medium'
										onClick={() => setLocale(loc)}
									>
										<Globe className='mr-2 h-4 w-4 text-muted-foreground' />
										<span>{LOCALE_LABELS[loc]}</span>
										{locale === loc && (
											<Check className='ml-auto h-4 w-4 text-primary' />
										)}
									</DropdownMenuItem>
								))}

								<DropdownMenuSeparator />

								<DropdownMenuItem
									className='cursor-pointer font-medium'
									onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
								>
									{theme === 'dark' ? (
										<Sun className='mr-2 h-4 w-4 text-amber-500' />
									) : (
										<Moon className='mr-2 h-4 w-4 text-blue-500' />
									)}
									<span>{t('nav.theme') || 'Mavzu'}</span>
								</DropdownMenuItem>

								<DropdownMenuSeparator />

								<DropdownMenuItem
									className='cursor-pointer font-medium'
									asChild
								>
									<Link
										href='/home/support'
										className='flex items-center w-full'
									>
										<LifeBuoy className='mr-2 h-4 w-4 text-muted-foreground' />
										<span>{t('nav.support') || 'Yordam'}</span>
									</Link>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</header>

			{/* 📱 MOBILE BOTTOM NAV */}
			<div className='md:hidden fixed bottom-4 left-4 right-4 z-50 rounded-2xl bg-background/80 backdrop-blur-xl border border-border shadow-lg supports-[backdrop-filter]:bg-background/60 overflow-hidden pb-safe'>
				<nav className='flex justify-around items-center h-16 px-2 relative'>
					{NAV_LINKS.map(link => {
						const isActive =
							pathname === link.href ||
							(link.href !== '/' && pathname.startsWith(link.href))
						const Icon = link.icon
						return (
							<Link
								key={link.href}
								href={link.href}
								className='relative flex flex-col items-center justify-center w-full h-full z-10 py-1 select-none outline-none'
							>
								{isActive && (
									<motion.div
										layoutId='mobile-active-pill'
										className='absolute inset-y-1.5 inset-x-2 rounded-xl bg-primary/10 -z-10'
										transition={{ type: 'spring', stiffness: 350, damping: 30 }}
									/>
								)}
								<div
									className={cn(
										'transition-transform duration-300',
										isActive
											? '-translate-y-0.5 text-primary'
											: 'text-muted-foreground',
									)}
								>
									<Icon className='w-5 h-5 mb-0.5' />
								</div>
								<span
									className={cn(
										'text-[10px] font-bold tracking-tight transition-opacity duration-300',
										isActive
											? 'opacity-100 text-primary'
											: 'opacity-0 absolute',
									)}
								>
									{link.name}
								</span>
							</Link>
						)
					})}
				</nav>
			</div>
		</>
	)
}
