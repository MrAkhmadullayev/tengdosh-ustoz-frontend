'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import api from '@/lib/api'
import {
	BarChart,
	BarChart3,
	BookOpen,
	CalendarRange,
	File,
	GraduationCap,
	Headphones,
	LayoutDashboard,
	LogOut,
	Menu,
	MessageSquare,
	Settings,
	TrendingUp,
	User,
	Users,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const MENUS = {
	student: [
		{
			name: 'Bosh panel',
			icon: <LayoutDashboard className='h-5 w-5' />,
			href: '/student/dashboard',
		},
		{
			name: 'Mening darslarim',
			icon: <BookOpen className='h-5 w-5' />,
			href: '/student/courses',
		},
		{
			name: 'Ustozlar',
			icon: <Users className='h-5 w-5' />,
			href: '/student/mentors',
		},
		{
			name: "KPI Ko'rsatkichlar",
			icon: <TrendingUp className='h-5 w-5' />,
			href: '/student/kpi',
		},
	],
	mentor: [
		{
			name: 'Bosh panel',
			icon: <LayoutDashboard className='h-5 w-5' />,
			href: '/mentor/dashboard',
		},
		{
			name: "O'quvchilarim",
			icon: <Users className='h-5 w-5' />,
			href: '/mentor/students',
		},
		{
			name: 'Dars jadvali',
			icon: <CalendarRange className='h-5 w-5' />,
			href: '/mentor/lessons',
		},
		{
			name: "KPI Ko'rsatkichlar",
			icon: <BarChart3 className='h-5 w-5' />,
			href: '/mentor/kpi',
		},
	],
	admin: [
		{
			name: 'Bosh panel',
			icon: <BarChart className='h-5 w-5' />,
			href: '/admin/dashboard',
		},
		{
			name: 'Mentorlar',
			icon: <Users className='h-5 w-5' />,
			href: '/admin/mentors',
		},
		{
			name: "O'quvchilar",
			icon: <GraduationCap className='h-5 w-5' />,
			href: '/admin/students',
		},
		{
			name: 'Arizalar',
			icon: <File className='h-5 w-5' />,
			href: '/admin/applications',
		},
		{
			name: 'Darslar',
			icon: <LayoutDashboard className='h-5 w-5' />,
			href: '/admin/lessons',
		},
		{
			name: "KPI Ko'rsatkichlar",
			icon: <TrendingUp className='h-5 w-5' />,
			href: '/admin/kpi',
		},
		{
			name: 'Murojaatlar',
			icon: <Headphones className='h-5 w-5' />,
			href: '/admin/support',
		},
	],
}

const COMMON_MENUS = [
	{
		name: 'Xabarlar',
		icon: <MessageSquare className='h-5 w-5' />,
		href: '/users/messages',
	},
	{
		name: 'Sozlamalar',
		icon: <Settings className='h-5 w-5' />,
		href: '/users/settings',
	},
]

export default function DashboardLayout({ children, role: initialRole }) {
	const pathname = usePathname()
	const router = useRouter()
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

	const [activeRole, setActiveRole] = useState(null)
	const [isRoleLoading, setIsRoleLoading] = useState(true)
	const [isMentorApproved, setIsMentorApproved] = useState(true)
	const [userData, setUserData] = useState(null)

	useEffect(() => {
		const fetchUserContext = async () => {
			try {
				const { data } = await api.get('/auth/me')
				if (data.success && data.user) {
					setActiveRole(data.user.role)
					setUserData(data.user)
					if (data.user.role === 'mentor') {
						setIsMentorApproved(data.user.isMentor)
					}
				} else {
					fallbackRole()
				}
			} catch (err) {
				console.error('Haqiqiy rolni olishda xatolik:', err)
				fallbackRole()
			} finally {
				setIsRoleLoading(false)
			}
		}

		const fallbackRole = () => {
			if (initialRole) setActiveRole(initialRole)
			else if (pathname.startsWith('/admin')) setActiveRole('admin')
			else if (pathname.startsWith('/mentor')) setActiveRole('mentor')
			else setActiveRole('student')
		}

		fetchUserContext()
	}, [pathname, initialRole])

	const handleLogout = async () => {
		try {
			await api.post('/auth/logout')
			router.push('/authentication')
		} catch (err) {
			console.error('Logout error:', err)
			router.push('/authentication')
		}
	}

	const formatPhone = phoneStr => {
		if (!phoneStr) return ''
		const cleaned = phoneStr.replace(/\D/g, '')
		if (cleaned.length === 12 && cleaned.startsWith('998')) {
			return `+998 ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10, 12)}`
		}
		return phoneStr
	}

	const menuItems = MENUS[activeRole] || MENUS.student
	const isPendingMentor = activeRole === 'mentor' && isMentorApproved === false
	const dashHref = activeRole ? `/${activeRole}/dashboard` : '#'

	const SidebarContent = () => (
		<div className='flex flex-col h-full bg-card'>
			<div className='p-6 flex items-center gap-3 border-b'>
				<Link
					href='/'
					className='flex items-center gap-3 w-full hover:opacity-80 transition-opacity'
				>
					<div className='flex items-center justify-center rounded-lg bg-transparent'>
						<Image
							src='/logo.png'
							alt='Tengdosh Logo'
							width={32}
							height={32}
							className='dark:invert mix-blend-multiply dark:mix-blend-screen opacity-90'
						/>
					</div>
					<span className='font-bold text-xl tracking-tight text-foreground'>
						TengdoshUstoz
					</span>
				</Link>
			</div>

			<nav className='flex-1 py-6 px-4 space-y-2 overflow-y-auto'>
				<p className='text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2'>
					Asosiy
				</p>
				{isRoleLoading ? (
					<div className='space-y-3'>
						<Skeleton className='h-11 w-full rounded-md' />
						<Skeleton className='h-11 w-full rounded-md' />
						<Skeleton className='h-11 w-full rounded-md' />
					</div>
				) : (
					menuItems.map(item => {
						const isActive = pathname.startsWith(item.href)
						return (
							<Link key={item.name} href={item.href}>
								<Button
									variant={isActive ? 'secondary' : 'ghost'}
									className={`w-full justify-start gap-3 h-11 ${
										isActive
											? 'font-semibold text-primary'
											: 'text-muted-foreground'
									}`}
								>
									{item.icon} {item.name}
								</Button>
							</Link>
						)
					})
				)}

				<div className='pt-6'>
					<p className='text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2'>
						Boshqa
					</p>
					{isRoleLoading ? (
						<div className='space-y-3'>
							<Skeleton className='h-11 w-full rounded-md' />
							<Skeleton className='h-11 w-full rounded-md' />
						</div>
					) : (
						COMMON_MENUS.map(item => {
							const isActive = pathname.startsWith(item.href)
							return (
								<Link key={item.name} href={item.href}>
									<Button
										variant={isActive ? 'secondary' : 'ghost'}
										className={`w-full justify-start gap-3 h-11 ${
											isActive
												? 'font-semibold text-primary'
												: 'text-muted-foreground'
										}`}
									>
										{item.icon} {item.name}
									</Button>
								</Link>
							)
						})
					)}
				</div>
			</nav>

			<div className='p-4 border-t'>
				<Button
					variant='ghost'
					onClick={handleLogout}
					className='w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50'
				>
					<LogOut className='h-5 w-5' /> Tizimdan chiqish
				</Button>
			</div>
		</div>
	)

	// Profilni to'ldirish (Resume) kabi sahifalarda yon panel umuman yo'q bo'ladi
	if (pathname === '/mentor/resume') {
		return <div className='min-h-screen bg-muted/10'>{children}</div>
	}

	return (
		<div className='min-h-screen bg-muted/10'>
			{/* SIDEBAR (Qotirilgan - fixed) */}
			{!isPendingMentor && (
				<aside className='fixed inset-y-0 left-0 z-50 hidden md:block w-72 bg-card border-r shadow-sm'>
					<SidebarContent />
				</aside>
			)}

			<div className='flex flex-col flex-1'>
				{/* NAVBAR (Qotirilgan - fixed) */}
				<header
					className={`fixed top-0 right-0 z-40 h-16 bg-card border-b flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-all ${
						!isPendingMentor ? 'md:left-72 left-0' : 'left-0'
					}`}
				>
					<div className='flex items-center gap-4'>
						{!isPendingMentor && (
							<Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
								<SheetTrigger asChild>
									<Button
										variant='ghost'
										size='icon'
										className='md:hidden -ml-2'
									>
										<Menu className='h-6 w-6' />
									</Button>
								</SheetTrigger>
								<SheetContent side='left' className='p-0 w-72'>
									<SidebarContent />
								</SheetContent>
							</Sheet>
						)}
						{isRoleLoading ? (
							<Skeleton className='h-6 w-32 hidden sm:block' />
						) : (
							<Link
								href={dashHref}
								className='text-lg font-semibold hidden sm:block capitalize hover:text-primary transition-colors cursor-pointer'
							>
								{activeRole} Paneli
							</Link>
						)}
					</div>

					<div className='flex items-center gap-3 sm:gap-4'>
						<div className='flex items-center gap-3 pl-2 sm:pl-4'>
							{isRoleLoading ? (
								<Skeleton className='h-8 w-8 sm:h-10 sm:w-10 rounded-full' />
							) : (
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant='ghost'
											className='relative h-8 w-8 sm:h-10 sm:w-10 rounded-full'
										>
											<Avatar className='h-8 w-8 sm:h-10 sm:w-10 border transition-all hover:ring-2 hover:ring-primary/20'>
												<AvatarFallback className='bg-primary/10 text-primary font-bold'>
													{userData?.firstName?.charAt(0) || 'U'}
													{userData?.lastName?.charAt(0) || ''}
												</AvatarFallback>
											</Avatar>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent className='w-56' align='end' forceMount>
										<DropdownMenuLabel className='font-normal'>
											<div className='flex flex-col space-y-1'>
												<p className='text-sm font-medium leading-none'>
													{userData?.firstName || 'Foydalanuvchi'}{' '}
													{userData?.lastName || ''}
												</p>
												<p className='text-xs leading-none text-muted-foreground mt-1'>
													{formatPhone(userData?.phone) || 'Raqam kiritilmagan'}
												</p>
											</div>
										</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuItem asChild>
											<Link
												href='/users/profile'
												className='cursor-pointer w-full flex items-center'
											>
												<User className='mr-2 h-4 w-4' />
												<span>Profil</span>
											</Link>
										</DropdownMenuItem>
										<DropdownMenuItem asChild>
											<Link
												href='/users/settings'
												className='cursor-pointer w-full flex items-center'
											>
												<Settings className='mr-2 h-4 w-4' />
												<span>Sozlamalar</span>
											</Link>
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											onClick={handleLogout}
											className='text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer w-full flex items-center'
										>
											<LogOut className='mr-2 h-4 w-4' />
											<span>Tizimdan chiqish</span>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							)}
						</div>
					</div>
				</header>

				{/* ASOSIY CONTENT (Faqat shu qism scroll bo'ladi) */}
				<main
					className={`pt-16 min-h-screen overflow-x-hidden ${
						!isPendingMentor ? 'md:ml-72' : ''
					}`}
				>
					<div className='p-4 sm:p-6 lg:p-8 h-full'>{children}</div>
				</main>
			</div>
		</div>
	)
}
