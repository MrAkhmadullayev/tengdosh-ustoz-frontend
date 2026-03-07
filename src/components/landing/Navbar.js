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
import api from '@/lib/api'
import { motion } from 'framer-motion'
import {
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
import { useEffect, useState } from 'react'

const NAV_LINKS = [
	{ name: 'Bosh sahifa', href: '/', icon: <Home className='w-5 h-5 mb-1' /> },
	{
		name: 'Mentorlar',
		href: '/home/mentors',
		icon: <Users className='w-5 h-5 mb-1' />,
	},
	{
		name: 'Jonli darslar',
		href: '/home/live-lessons',
		icon: <MonitorPlay className='w-5 h-5 mb-1' />,
	},
	{
		name: 'FAQ',
		href: '/home/faq',
		icon: <HelpCircle className='w-5 h-5 mb-1' />,
	},
]

export default function Navbar() {
	const { setTheme, theme } = useTheme()
	const router = useRouter()
	const pathname = usePathname()

	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [userRole, setUserRole] = useState(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const controller = new AbortController()

		const checkAuth = async () => {
			try {
				const { data } = await api.get('/auth/me', {
					signal: controller.signal,
				})
				if (data.success) {
					setIsAuthenticated(true)
					setUserRole(data.user.role)
				}
			} catch (err) {
				if (err.name !== 'CanceledError') {
					setIsAuthenticated(false)
				}
			} finally {
				setIsLoading(false)
			}
		}
		checkAuth()

		return () => controller.abort()
	}, [])

	const handleLogout = async () => {
		try {
			await api.post('/auth/logout')
			setIsAuthenticated(false)
			setUserRole(null)
			router.push('/authentication')
		} catch (err) {
			console.error('Logout xatosi', err)
		}
	}

	return (
		<>
			<header className='sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-sm transition-colors duration-300'>
				<div className='container flex h-16 items-center justify-between mx-auto px-4 md:px-8'>
					<div className='flex flex-1 items-center justify-start gap-4'>
						<Link href='/' className='flex items-center space-x-2 group'>
							<div className='flex items-center justify-center rounded-lg bg-transparent transition-transform duration-300 group-hover:scale-105'>
								<Image
									src='/logo.png'
									alt='Tengdosh Logo'
									width={40}
									height={40}
									priority
									className='dark:invert mix-blend-multiply dark:mix-blend-screen opacity-90'
								/>
							</div>
							<span className='font-bold text-xl tracking-tight hidden sm:inline-block'>
								TengdoshUstoz
							</span>
						</Link>
					</div>

					<nav className='hidden md:flex items-center justify-center space-x-2 text-sm font-medium'>
						{NAV_LINKS.map(link => {
							const isActive =
								pathname === link.href ||
								(link.href !== '/' && pathname.startsWith(link.href))
							return (
								<Link
									key={link.href}
									href={link.href}
									className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 z-10 ${
										isActive
											? 'text-primary-foreground'
											: 'text-muted-foreground hover:text-foreground'
									}`}
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

					<div className='flex flex-1 items-center justify-end space-x-2 sm:space-x-3'>
						<div className='flex items-center justify-end min-w-[80px] sm:min-w-[140px]'>
							{isLoading ? (
								<div className='h-9 w-20 animate-pulse bg-muted/60 rounded-md shrink-0'></div>
							) : isAuthenticated ? (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									className='flex items-center gap-2'
								>
									<Link href={`/${userRole}/dashboard`}>
										<Button
											variant='ghost'
											size='icon'
											className='rounded-full bg-secondary hover:bg-secondary/80 transition-colors'
											title="Profilga o'tish"
										>
											<User className='h-5 w-5' />
										</Button>
									</Link>
									<Button
										variant='destructive'
										size='sm'
										onClick={handleLogout}
										className='hidden sm:flex transition-transform active:scale-95 shrink-0'
									>
										Chiqish
									</Button>
								</motion.div>
							) : (
								<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
									<Link href='/authentication'>
										<Button
											size='sm'
											className='sm:px-4 transition-transform active:scale-95 shrink-0'
										>
											Kirish
										</Button>
									</Link>
								</motion.div>
							)}
						</div>

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant='outline'
									size='icon'
									className='h-9 w-9 sm:h-10 sm:w-10 transition-transform hover:scale-105 active:scale-95 shrink-0'
								>
									<Settings className='h-4 w-4 sm:h-5 sm:w-5' />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align='end'
								className='w-56 shadow-xl rounded-xl'
							>
								<DropdownMenuLabel>Sozlamalar</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem className='cursor-pointer transition-colors hover:bg-muted'>
									<Globe className='mr-2 h-4 w-4' />
									<span>Til: O'zbekcha</span>
								</DropdownMenuItem>
								<DropdownMenuItem
									className='cursor-pointer transition-colors hover:bg-muted'
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
								<DropdownMenuItem
									className='cursor-pointer transition-colors hover:bg-muted'
									asChild
								>
									<Link
										href='/home/support'
										className='flex items-center w-full'
									>
										<LifeBuoy className='mr-2 h-4 w-4' />
										<span>Qo'llab-quvvatlash</span>
									</Link>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</header>

			<div className='md:hidden fixed bottom-6 left-4 right-4 z-50 rounded-2xl bg-background/70 backdrop-blur-xl border border-border shadow-[0_8px_30px_rgb(0,0,0,0.12)] supports-[backdrop-filter]:bg-background/60 overflow-hidden'>
				<nav className='flex justify-around items-center h-16 px-2 relative'>
					{NAV_LINKS.map(link => {
						const isActive =
							pathname === link.href ||
							(link.href !== '/' && pathname.startsWith(link.href))
						return (
							<Link
								key={link.href}
								href={link.href}
								className='relative flex flex-col items-center justify-center w-full h-full z-10 py-1 tap-highlight-transparent'
							>
								{isActive && (
									<motion.div
										layoutId='mobile-active-pill'
										className='absolute inset-y-1.5 inset-x-2 rounded-xl bg-primary/15 dark:bg-primary/25 -z-10'
										transition={{ type: 'spring', stiffness: 350, damping: 30 }}
									/>
								)}
								<div
									className={`transition-all duration-300 transform ${isActive ? '-translate-y-0.5 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
								>
									{link.icon}
								</div>
								<span
									className={`text-[10px] font-medium transition-all duration-300 mt-1 ${isActive ? 'opacity-100 text-primary' : 'opacity-60 text-muted-foreground'}`}
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
