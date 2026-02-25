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
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'
import {
	Globe,
	GraduationCap,
	LifeBuoy,
	Menu,
	Moon,
	Settings,
	Sun,
	User,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import Link from 'next/link'

export default function Navbar() {
	const { setTheme, theme } = useTheme()

	// Hozircha statik holat, kelajakda auth state (masalan, session) ga bog'lanadi
	const isAuthenticated = false

	const navLinks = [
		{ name: 'Bosh sahifa', href: '/' },
		{ name: 'Mentorlar', href: '/home/mentors' },
		{ name: 'Jonli darslar', href: '/home/live-lessons' },
		{ name: 'FAQ', href: '/home/faq' },
	]

	return (
		<header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
			<div className='container flex h-16 items-center justify-between mx-auto px-4 md:px-8'>
				{/* 1. CHAP TOMON: Mobil Menyu (Hamburger) va Logo */}
				<div className='flex items-center gap-2 md:gap-4 flex-1 md:flex-none'>
					{/* Mobil ekranlar uchun yon menyu (Sheet) */}
					<div className='md:hidden'>
						<Sheet>
							<SheetTrigger asChild>
								<Button variant='ghost' size='icon' className='-ml-2'>
									<Menu className='h-6 w-6' />
									<span className='sr-only'>Menyuni ochish</span>
								</Button>
							</SheetTrigger>
							<SheetContent side='left' className='w-[280px] sm:w-[320px]'>
								<SheetHeader>
									<SheetTitle className='flex items-center space-x-2 mb-4'>
										<div className='bg-primary/10 p-1.5 rounded-lg'>
											<GraduationCap className='h-5 w-5 text-primary' />
										</div>
										<span className='font-bold text-lg tracking-tight'>
											TengdoshUstoz
										</span>
									</SheetTitle>
								</SheetHeader>
								<nav className='flex flex-col gap-4 mt-6'>
									{navLinks.map((link, idx) => (
										<Link
											key={idx}
											href={link.href}
											className='text-lg font-medium text-muted-foreground hover:text-primary transition-colors'
										>
											{link.name}
										</Link>
									))}
								</nav>
							</SheetContent>
						</Sheet>
					</div>

					{/* Logo */}
					<Link href='/' className='flex items-center space-x-2'>
						<div className='bg-primary/10 p-2 rounded-lg'>
							<GraduationCap className='h-6 w-6 text-primary' />
						</div>
						<span className='font-bold text-xl tracking-tight hidden sm:inline-block'>
							TengdoshUstoz
						</span>
					</Link>
				</div>

				{/* 2. O'RTA QISM: Desktop Navigatsiya */}
				{/* flex-1 va justify-center orqali roppa-rosa o'rtaga joylashtirildi */}
				<nav className='hidden md:flex items-center justify-center space-x-8 text-sm font-medium flex-1'>
					{navLinks.map((link, idx) => (
						<Link
							key={idx}
							href={link.href}
							className='transition-colors text-muted-foreground hover:text-foreground'
						>
							{link.name}
						</Link>
					))}
				</nav>

				{/* 3. O'NG TOMON: Auth va Sozlamalar */}
				{/* justify-end orqali doim o'ng chekkaga taqalib turadi */}
				<div className='flex items-center justify-end space-x-2 sm:space-x-3 flex-1 md:flex-none'>
					{isAuthenticated ? (
						<Button
							variant='ghost'
							size='icon'
							className='rounded-full bg-secondary'
						>
							<User className='h-5 w-5' />
						</Button>
					) : (
						<Link href='/authentication'>
							<Button size='sm' className='sm:px-4'>
								Kirish
							</Button>
						</Link>
					)}

					{/* Sozlamalar (Til, Mavzu) */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant='outline'
								size='icon'
								className='h-9 w-9 sm:h-10 sm:w-10'
							>
								<Settings className='h-4 w-4 sm:h-5 sm:w-5' />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end' className='w-56'>
							<DropdownMenuLabel>Sozlamalar</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem className='cursor-pointer'>
								<Globe className='mr-2 h-4 w-4' />
								<span>Til: O'zbekcha</span>
							</DropdownMenuItem>
							<DropdownMenuItem
								className='cursor-pointer'
								onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
							>
								{theme === 'dark' ? (
									<Sun className='mr-2 h-4 w-4' />
								) : (
									<Moon className='mr-2 h-4 w-4' />
								)}
								<span>Mavzuni o'zgartirish</span>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem className='cursor-pointer'>
								<LifeBuoy className='mr-2 h-4 w-4' />
								<Link href='/home/support'>Qo'llab-quvvatlash</Link>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	)
}
