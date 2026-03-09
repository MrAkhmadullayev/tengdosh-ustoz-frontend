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
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/lib/auth-context'
import { useTranslation } from '@/lib/i18n'
import { formatPhone, getInitials } from '@/lib/utils'
import { Globe, LogOut, Menu, Moon, Settings, Sun, User } from 'lucide-react'
import { useTheme } from 'next-themes'
import Link from 'next/link'

export default function Header({ panelLabel, onMenuClick, isPendingMentor }) {
	const { user, isLoading, logout } = useAuth()
	const { t, locale, setLocale, supportedLocales, isReady } = useTranslation()
	const { theme, setTheme } = useTheme()

	if (isLoading || !isReady) {
		return (
			<header className='fixed top-0 right-0 z-40 h-16 bg-background/80 backdrop-blur-md border-b flex items-center justify-between px-6 w-full md:w-[calc(100%-18rem)]'>
				<Skeleton className='h-6 w-32' />
				<div className='flex gap-4'>
					<Skeleton className='h-10 w-10 rounded-full' />
					<Skeleton className='h-10 w-10 rounded-full' />
				</div>
			</header>
		)
	}

	return (
		<header
			className={`fixed top-0 right-0 z-40 h-16 bg-background/80 backdrop-blur-md border-b flex items-center justify-between px-4 sm:px-6 transition-all duration-300 ${
				!isPendingMentor ? 'left-0 md:left-72' : 'left-0 w-full'
			}`}
		>
			<div className='flex items-center gap-4'>
				{!isPendingMentor && (
					<Button
						variant='ghost'
						size='icon'
						className='md:hidden'
						onClick={onMenuClick}
					>
						<Menu className='h-5 w-5' />
					</Button>
				)}
				<h1 className='text-lg font-semibold hidden sm:block tracking-tight text-foreground'>
					{panelLabel}
				</h1>
			</div>

			<div className='flex items-center gap-2 sm:gap-3'>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='ghost' size='icon' className='rounded-full'>
							<Globe className='h-5 w-5 text-muted-foreground hover:text-foreground transition-colors' />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						{supportedLocales.map(l => (
							<DropdownMenuItem
								key={l}
								onClick={() => setLocale(l)}
								className={`uppercase font-medium ${locale === l ? 'bg-primary/10 text-primary' : ''}`}
							>
								{l}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='ghost' size='icon' className='rounded-full'>
							<Sun className='h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
							<Moon className='absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
							<span className='sr-only'>Mavzuni o'zgartirish</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						<DropdownMenuItem onClick={() => setTheme('light')}>
							Yorug'
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setTheme('dark')}>
							Qorong'i
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant='ghost'
							className='relative h-10 w-10 rounded-full border border-border'
						>
							<Avatar className='h-10 w-10 transition-transform hover:scale-105'>
								<AvatarFallback className='bg-primary/10 text-primary font-bold'>
									{getInitials(user?.firstName, user?.lastName)}
								</AvatarFallback>
							</Avatar>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className='w-56' align='end' forceMount>
						<DropdownMenuLabel className='font-normal'>
							<div className='flex flex-col space-y-1'>
								<p className='text-sm font-medium leading-none'>
									{user?.firstName || t('common.notEntered')}{' '}
									{user?.lastName || ''}
								</p>
								<p className='text-xs leading-none text-muted-foreground mt-1'>
									{formatPhone(user?.phoneNumber) || t('common.notEntered')}
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
								<span>{t('nav.profile')}</span>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link
								href='/users/settings'
								className='cursor-pointer w-full flex items-center'
							>
								<Settings className='mr-2 h-4 w-4' />
								<span>{t('nav.settings')}</span>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={logout}
							className='text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer'
						>
							<LogOut className='mr-2 h-4 w-4' />
							<span>{t('sidebar.logoutConfirm')}</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	)
}
