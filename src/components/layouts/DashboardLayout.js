'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
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
import {
	BarChart,
	BarChart3,
	Bell,
	BookOpen,
	CalendarRange,
	File,
	GraduationCap,
	LayoutDashboard,
	LogOut,
	Menu,
	MessageSquare,
	Settings,
	TrendingUp,
	User,
	Users,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// Rollarga qarab menyularni dinamik ajratamiz
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
			href: '/mentor/schedule',
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
	],
}

// Barcha uchun umumiy pastki menyular
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

// Mock Bildirishnomalar
const MOCK_NOTIFICATIONS = [
	{
		id: 1,
		title: 'Yangi dars!',
		description: 'Siz uchun "React Advanced" darsi qo\'shildi.',
		time: '5 daqiqa oldin',
		href: '/admin/lessons',
		unread: true,
	},
	{
		id: 2,
		title: 'Xabar keldi',
		description: 'Mentor Javohir sizga xabar yubordi.',
		time: '1 soat oldin',
		href: '/users/messages',
		unread: true,
	},
	{
		id: 3,
		title: "To'lov tasdiqlandi",
		description: 'Oylik obunangiz muvaffaqiyatli yangilandi.',
		time: '2 kun oldin',
		href: '/admin/dashboard',
		unread: false,
	},
]

export default function DashboardLayout({ children, role: initialRole }) {
	const pathname = usePathname()
	const router = useRouter()
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
	const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)

	const [activeRole, setActiveRole] = useState('student')

	useEffect(() => {
		// URL dan role-ni aniqlaymiz
		const detectedRole =
			initialRole ||
			(pathname.startsWith('/admin')
				? 'admin'
				: pathname.startsWith('/mentor')
					? 'mentor'
					: pathname.startsWith('/student')
						? 'student'
						: null)

		if (detectedRole) {
			// Agar aniq role bo'lsa (URL admin/mentor bilan boshlansa)
			setActiveRole(detectedRole)
			sessionStorage.setItem('userRole', detectedRole)
		} else {
			// Shared route bo'lsa (/users/*), storage-dan oxirgi rolni olamiz
			const savedRole = sessionStorage.getItem('userRole')
			if (savedRole) {
				setActiveRole(savedRole)
			}
		}
	}, [pathname, initialRole])

	const menuItems = MENUS[activeRole] || MENUS.student

	const unreadCount = notifications.filter(n => n.unread).length

	const markAsRead = id => {
		setNotifications(
			notifications.map(n => (n.id === id ? { ...n, unread: false } : n)),
		)
	}

	const SidebarContent = () => (
		<div className='flex flex-col h-full bg-card border-r'>
			<div className='p-6 flex items-center gap-3 border-b'>
				<div className='bg-primary/10 p-2 rounded-lg'>
					<GraduationCap className='h-6 w-6 text-primary' />
				</div>
				<span className='font-bold text-xl tracking-tight'>TengdoshUstoz</span>
			</div>

			<nav className='flex-1 py-6 px-4 space-y-2 overflow-y-auto'>
				<p className='text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2'>
					Asosiy
				</p>
				{menuItems.map(item => {
					const isActive = pathname.startsWith(item.href)
					return (
						<Link key={item.name} href={item.href}>
							<Button
								variant={isActive ? 'secondary' : 'ghost'}
								className={`w-full justify-start gap-3 h-11 ${isActive ? 'font-semibold text-primary' : 'text-muted-foreground'}`}
							>
								{item.icon} {item.name}
							</Button>
						</Link>
					)
				})}

				<div className='pt-6'>
					<p className='text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2'>
						Boshqa
					</p>
					{COMMON_MENUS.map(item => {
						const isActive = pathname.startsWith(item.href)
						return (
							<Link key={item.name} href={item.href}>
								<Button
									variant={isActive ? 'secondary' : 'ghost'}
									className={`w-full justify-start gap-3 h-11 ${isActive ? 'font-semibold text-primary' : 'text-muted-foreground'}`}
								>
									{item.icon} {item.name}
								</Button>
							</Link>
						)
					})}
				</div>
			</nav>

			<div className='p-4 border-t'>
				<Link href='/auth/login'>
					<Button
						variant='ghost'
						className='w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50'
					>
						<LogOut className='h-5 w-5' /> Tizimdan chiqish
					</Button>
				</Link>
			</div>
		</div>
	)

	return (
		<div className='flex h-screen bg-muted/10 overflow-hidden'>
			{/* Desktop Sidebar */}
			<aside className='hidden md:block w-72 shrink-0 h-full'>
				<SidebarContent />
			</aside>

			{/* Main Area */}
			<div className='flex-1 flex flex-col h-full overflow-hidden'>
				<header className='h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-card border-b shrink-0'>
					<div className='flex items-center gap-4'>
						<Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
							<SheetTrigger asChild>
								<Button variant='ghost' size='icon' className='md:hidden -ml-2'>
									<Menu className='h-6 w-6' />
								</Button>
							</SheetTrigger>
							<SheetContent side='left' className='p-0 w-72'>
								<SidebarContent />
							</SheetContent>
						</Sheet>
						<h2 className='text-lg font-semibold hidden sm:block capitalize'>
							{activeRole} Paneli
						</h2>
					</div>

					<div className='flex items-center gap-3 sm:gap-4'>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant='outline'
									size='icon'
									className='relative rounded-full'
								>
									<Bell className='h-4 w-4' />
									{unreadCount > 0 && (
										<span className='absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white ring-2 ring-background'>
											{unreadCount}
										</span>
									)}
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className='w-80' align='end' forceMount>
								<DropdownMenuLabel className='flex items-center justify-between'>
									<span>Bildirishnomalar</span>
									{unreadCount > 0 && (
										<Badge variant='secondary' className='text-[10px]'>
											{unreadCount} ta yangi
										</Badge>
									)}
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<div className='max-h-[300px] overflow-y-auto px-1 py-1'>
									{notifications.length > 0 ? (
										notifications.map(notif => (
											<DropdownMenuItem
												key={notif.id}
												className='flex flex-col items-start gap-1 p-3 cursor-pointer focus:bg-muted/50 rounded-lg'
												onClick={() => {
													markAsRead(notif.id)
													router.push(notif.href)
												}}
											>
												<div className='flex items-center justify-between w-full'>
													<span
														className={`text-sm font-semibold ${notif.unread ? 'text-foreground' : 'text-muted-foreground'}`}
													>
														{notif.title}
													</span>
													{notif.unread && (
														<span className='h-2 w-2 rounded-full bg-primary' />
													)}
												</div>
												<p className='text-xs text-muted-foreground line-clamp-2'>
													{notif.description}
												</p>
												<span className='text-[10px] text-muted-foreground mt-1'>
													{notif.time}
												</span>
											</DropdownMenuItem>
										))
									) : (
										<div className='p-4 text-center text-sm text-muted-foreground'>
											Bildirishnomalar mavjud emas
										</div>
									)}
								</div>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									className='w-full text-center justify-center text-xs text-primary font-medium p-2 cursor-pointer'
									onClick={() => router.push('/users/notifications')}
								>
									Barcha bildirishnomalarni ko'rish
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
						<div className='flex items-center gap-3 pl-2 sm:pl-4 sm:border-l'>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant='ghost'
										className='relative h-8 w-8 sm:h-10 sm:w-10 rounded-full'
									>
										<Avatar className='h-8 w-8 sm:h-10 sm:w-10 border transition-all hover:ring-2 hover:ring-primary/20'>
											<AvatarFallback className='bg-primary/10 text-primary'>
												SA
											</AvatarFallback>
										</Avatar>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className='w-56' align='end' forceMount>
									<DropdownMenuLabel className='font-normal'>
										<div className='flex flex-col space-y-1'>
											<p className='text-sm font-medium leading-none'>
												Sadriddin
											</p>
											<p className='text-xs leading-none text-muted-foreground'>
												sadriddin@example.com
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
										asChild
										className='text-red-600 focus:text-red-700 focus:bg-red-50'
									>
										<Link
											href='/auth/login'
											className='cursor-pointer w-full flex items-center'
										>
											<LogOut className='mr-2 h-4 w-4' />
											<span>Tizimdan chiqish</span>
										</Link>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				</header>

				<main className='flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8'>
					{children}
				</main>
			</div>
		</div>
	)
}
