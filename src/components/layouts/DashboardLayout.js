'use client'

import Header from '@/components/layouts/Header'
import Sidebar from '@/components/layouts/Sidebar'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { useAuth } from '@/lib/auth-context'
import { useTranslation } from '@/lib/i18n'
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function DashboardLayout({ children, role: initialRole }) {
	const { user, role: authRole } = useAuth()
	const { t } = useTranslation()
	const pathname = usePathname()
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

	const activeRole = authRole || initialRole || 'student'
	const isMentorApproved = user?.isMentor !== false
	const isPendingMentor = activeRole === 'mentor' && !isMentorApproved

	const panelLabels = {
		admin: t('dashboard.adminPanel'),
		mentor: t('dashboard.mentorPanel'),
		student: t('dashboard.studentPanel'),
	}
	const panelLabel = panelLabels[activeRole] || panelLabels.student

	if (pathname === '/mentor/resume') {
		return (
			<div className='min-h-screen bg-background/50'>
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}
				>
					{children}
				</motion.div>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-background'>
			{!isPendingMentor && (
				<aside className='fixed inset-y-0 left-0 z-50 hidden md:block w-72'>
					<Sidebar activeRole={activeRole} />
				</aside>
			)}

			{!isPendingMentor && (
				<Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
					<SheetContent side='left' className='p-0 w-72 border-r-0'>
						<Sidebar
							activeRole={activeRole}
							onMenuClick={() => setIsMobileMenuOpen(false)}
						/>
					</SheetContent>
				</Sheet>
			)}

			<div
				className={`flex flex-col flex-1 transition-all duration-300 ${!isPendingMentor ? 'md:pl-72' : ''}`}
			>
				<Header
					panelLabel={panelLabel}
					isPendingMentor={isPendingMentor}
					onMenuClick={() => setIsMobileMenuOpen(true)}
				/>

				<main className='pt-16 min-h-screen overflow-x-hidden'>
					<AnimatePresence mode='wait'>
						<motion.div
							key={pathname}
							initial={{ opacity: 0, y: 15 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -15 }}
							transition={{ duration: 0.3, ease: 'easeInOut' }}
							className='p-4 sm:p-6 lg:p-8 h-full max-w-7xl mx-auto'
						>
							{children}
						</motion.div>
					</AnimatePresence>
				</main>
			</div>
		</div>
	)
}
