'use client'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/lib/auth-context'
import { useTranslation } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
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
	MessageSquare,
	Settings,
	TrendingUp,
	Users,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar({ activeRole, onMenuClick }) {
	const pathname = usePathname()
	const { isLoading, logout } = useAuth()
	const { t, isReady } = useTranslation()

	const menuConfig = {
		student: [
			{
				name: t('sidebar.dashboard'),
				icon: LayoutDashboard,
				href: '/student/dashboard',
			},
			{
				name: t('sidebar.myLessons'),
				icon: BookOpen,
				href: '/student/courses',
			},
			{ name: t('sidebar.mentors'), icon: Users, href: '/student/mentors' },
			{ name: t('sidebar.kpi'), icon: TrendingUp, href: '/student/kpi' },
		],
		mentor: [
			{
				name: t('sidebar.dashboard'),
				icon: LayoutDashboard,
				href: '/mentor/dashboard',
			},
			{ name: t('sidebar.students'), icon: Users, href: '/mentor/students' },
			{
				name: t('sidebar.schedule'),
				icon: CalendarRange,
				href: '/mentor/lessons',
			},
			{ name: t('sidebar.kpi'), icon: BarChart3, href: '/mentor/kpi' },
		],
		admin: [
			{
				name: t('sidebar.dashboard'),
				icon: BarChart,
				href: '/admin/dashboard',
			},
			{ name: t('sidebar.allMentors'), icon: Users, href: '/admin/mentors' },
			{
				name: t('sidebar.allStudents'),
				icon: GraduationCap,
				href: '/admin/students',
			},
			{
				name: t('sidebar.applications'),
				icon: File,
				href: '/admin/applications',
			},
			{
				name: t('sidebar.lessons'),
				icon: LayoutDashboard,
				href: '/admin/lessons',
			},
			{ name: t('sidebar.kpi'), icon: TrendingUp, href: '/admin/kpi' },
			{ name: t('sidebar.support'), icon: Headphones, href: '/admin/support' },
		],
	}

	const commonMenus = [
		{
			name: t('sidebar.messages'),
			icon: MessageSquare,
			href: '/users/messages',
		},
		{ name: t('nav.settings'), icon: Settings, href: '/users/settings' },
	]

	const currentMenus = menuConfig[activeRole] || menuConfig.student

	const NavItem = ({ item }) => {
		const isActive = pathname.startsWith(item.href)
		const Icon = item.icon

		return (
			<Link href={item.href} onClick={onMenuClick} className='relative block'>
				{isActive && (
					<motion.div
						layoutId='sidebar-active-pill'
						className='absolute inset-0 bg-secondary rounded-md'
						transition={{ type: 'spring', stiffness: 300, damping: 30 }}
					/>
				)}
				<Button
					variant='ghost'
					className={cn(
						'w-full justify-start gap-3 h-11 relative z-10 transition-colors',
						isActive
							? 'text-primary font-semibold'
							: 'text-muted-foreground hover:text-foreground',
					)}
				>
					<Icon className='h-5 w-5' />
					<span>{item.name}</span>
				</Button>
			</Link>
		)
	}

	return (
		<div className='flex flex-col h-full bg-background border-r'>
			<div className='p-6 h-16 flex items-center gap-3 border-b'>
				<Link
					href='/'
					className='flex items-center gap-3 w-full hover:opacity-80 transition-opacity'
				>
					<Image
						src='/logo.png'
						alt='Logo'
						width={32}
						height={32}
						className='dark:invert mix-blend-multiply dark:mix-blend-screen'
					/>
					<span className='font-bold text-xl tracking-tight text-foreground'>
						TengdoshUstoz
					</span>
				</Link>
			</div>

			<nav className='flex-1 py-6 px-4 space-y-1 overflow-y-auto hide-scrollbar'>
				{isLoading || !isReady ? (
					<div className='space-y-3'>
						{[1, 2, 3, 4].map(i => (
							<Skeleton key={i} className='h-11 w-full rounded-md' />
						))}
					</div>
				) : (
					<>
						<p className='text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2'>
							{t('sidebar.main')}
						</p>
						{currentMenus.map(item => (
							<NavItem key={item.href} item={item} />
						))}

						<div className='pt-6'>
							<p className='text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2'>
								{t('sidebar.other')}
							</p>
							{commonMenus.map(item => (
								<NavItem key={item.href} item={item} />
							))}
						</div>
					</>
				)}
			</nav>

			<div className='p-4 border-t bg-background'>
				<Button
					variant='ghost'
					onClick={logout}
					className='w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10'
				>
					<LogOut className='h-5 w-5' /> {t('sidebar.logoutConfirm')}
				</Button>
			</div>
		</div>
	)
}
