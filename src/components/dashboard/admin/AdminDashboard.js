'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import api from '@/lib/api'
import { useTranslation } from '@/lib/i18n'
import { getErrorMessage, getInitials } from '@/lib/utils'
import { motion } from 'framer-motion'
import {
	AlertTriangle,
	BookOpen,
	CheckCircle2,
	GraduationCap,
	Loader2,
	ShieldAlert,
	Users,
	XCircle,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

// ==========================================
// 🎨 ANIMATSIYA VARIANTLARI
// ==========================================
const containerVariants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: { staggerChildren: 0.1 },
	},
}

const itemVariants = {
	hidden: { opacity: 0, y: 15 },
	show: {
		opacity: 1,
		y: 0,
		transition: { type: 'spring', stiffness: 300, damping: 24 },
	},
}

// ==========================================
// 🧩 SKELETON (LOADING) KOMPONENTI
// ==========================================
const DashboardSkeleton = () => (
	<div className='space-y-6 pb-8 pt-6'>
		<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
			<div className='space-y-2'>
				<Skeleton className='h-8 w-64' />
				<Skeleton className='h-4 w-96 max-w-full' />
			</div>
			<div className='flex gap-2 w-full sm:w-auto'>
				<Skeleton className='h-10 w-full sm:w-32' />
				<Skeleton className='h-10 w-full sm:w-40' />
			</div>
		</div>

		<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
			{[...Array(4)].map((_, i) => (
				<Card key={i} className='shadow-sm'>
					<CardContent className='p-6 flex items-center justify-between'>
						<div className='space-y-2'>
							<Skeleton className='h-4 w-24' />
							<Skeleton className='h-8 w-16' />
						</div>
						<Skeleton className='h-12 w-12 rounded-xl' />
					</CardContent>
				</Card>
			))}
		</div>

		<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
			<div className='lg:col-span-2 space-y-6'>
				<Card className='shadow-sm'>
					<CardHeader className='pb-3 border-b'>
						<Skeleton className='h-6 w-48 mb-2' />
						<Skeleton className='h-4 w-64' />
					</CardHeader>
					<CardContent className='space-y-4 pt-4'>
						{[...Array(3)].map((_, i) => (
							<Skeleton key={i} className='h-24 w-full rounded-xl' />
						))}
					</CardContent>
				</Card>
			</div>
			<div className='lg:col-span-1 space-y-6'>
				<Card className='shadow-sm h-full'>
					<CardHeader className='pb-4 border-b'>
						<Skeleton className='h-6 w-48' />
					</CardHeader>
					<CardContent className='space-y-4 pt-4'>
						{[...Array(3)].map((_, i) => (
							<Skeleton key={i} className='h-20 w-full rounded-xl' />
						))}
					</CardContent>
				</Card>
			</div>
		</div>
	</div>
)

// ==========================================
// 🚀 ASOSIY KOMPONENT
// ==========================================
export default function AdminDashboard() {
	const { t } = useTranslation()
	const router = useRouter()

	// State'lar
	const [stats, setStats] = useState({
		totalStudents: 0,
		activeMentors: 0,
		totalLessons: 0,
		todayLessons: 0,
		pendingMentors: 0,
	})
	const [applications, setApplications] = useState([])
	const [recentMessages, setRecentMessages] = useState([])
	const [isLoading, setIsLoading] = useState(true)

	// Tugma bosilganda qotib turishi uchun
	const [processingId, setProcessingId] = useState(null)

	// Ma'lumotlarni yuklash (Optimallashtirilgan parallel so'rovlar)
	const fetchData = useCallback(async () => {
		try {
			const [kpiRes, appsRes, msgsRes] = await Promise.allSettled([
				api.get('/admin/kpi/stats'),
				api.get('/admin/applications/mentors'),
				api.get('/messages/system/all'),
			])

			if (kpiRes.status === 'fulfilled' && kpiRes.value?.data?.success) {
				const apiStats = kpiRes.value.data.stats || {}
				setStats({
					totalStudents: apiStats.totalStudents || 0,
					activeMentors: apiStats.activeMentors || 0,
					totalLessons: apiStats.totalLessons || 0,
					todayLessons: apiStats.todayLessonsCount || 0,
					pendingMentors: apiStats.pendingApplications || 0,
				})
			}

			if (appsRes.status === 'fulfilled' && appsRes.value?.data?.success) {
				setApplications((appsRes.value.data.applications || []).slice(0, 5))
			}

			if (msgsRes.status === 'fulfilled' && msgsRes.value?.data?.success) {
				const sysMsgs = msgsRes.value.data.conversations
					.filter(c => ['complaint', 'connection', 'general'].includes(c.type))
					.map(m => {
						const sender = m.participants.find(p => p.role !== 'admin')
						return {
							id: m._id,
							type: m.type,
							text: m.lastMessage?.text || t('dashboard.newMsgPlaceholder'),
							senderName: sender
								? `${sender.firstName} ${sender.lastName}`
								: t('dashboard.anonymous'),
							senderRole: sender ? sender.role : 'user',
						}
					})
					.slice(0, 4)

				setRecentMessages(sysMsgs)
			}
		} catch (error) {
			toast.error(getErrorMessage(error, t('errors.fetchFailed')))
		} finally {
			setIsLoading(false)
		}
	}, [t])

	useEffect(() => {
		fetchData()
	}, [fetchData])

	// Ariza amallari (Approve/Reject)
	const handleApplicationAction = useCallback(
		async (id, action) => {
			setProcessingId(id)
			try {
				await api.put(`/admin/applications/mentors/${id}/${action}`)
				toast.success(
					action === 'approve'
						? t('dashboard.approvedSuccess')
						: t('dashboard.rejectedSuccess'),
				)
				// Faqatgina ro'yxatni yangilash uchun fetchData ni qayta chaqiramiz
				await fetchData()
			} catch (error) {
				toast.error(getErrorMessage(error))
			} finally {
				setProcessingId(null)
			}
		},
		[fetchData, t],
	)

	const roleLabels = useMemo(
		() => ({
			admin: t('auth.roleAdmin'),
			mentor: t('auth.roleMentor'),
			student: t('auth.roleStudent'),
			user: t('dashboard.user'),
		}),
		[t],
	)

	if (isLoading) return <DashboardSkeleton />

	return (
		<motion.div
			variants={containerVariants}
			initial='hidden'
			animate='show'
			className='space-y-6'
		>
			{/* 🏷️ PAGE HEADER */}
			<motion.div
				variants={itemVariants}
				className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'
			>
				<div>
					<h1 className='text-2xl sm:text-3xl font-bold tracking-tight text-foreground'>
						{t('dashboard.adminControlCenter')}
					</h1>
					<p className='text-muted-foreground mt-1 text-sm sm:text-base'>
						{t('dashboard.adminControlCenterDesc')}
					</p>
				</div>
				<div className='flex w-full sm:w-auto gap-2'>
					<Button
						variant='outline'
						className='flex-1 sm:flex-none'
						onClick={() => router.push('/admin/kpi')}
					>
						{t('dashboard.viewFullKPI')}
					</Button>
					<Button
						className='flex-1 sm:flex-none gap-2'
						onClick={() => router.push('/users/settings')}
					>
						{t('dashboard.systemSettings')}
					</Button>
				</div>
			</motion.div>

			{/* 📊 STATS CARDS */}
			<motion.div
				variants={containerVariants}
				className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
			>
				{[
					{
						title: t('dashboard.totalStudents'),
						value: stats.totalStudents,
						icon: Users,
						colorClass: 'text-blue-500',
						bgClass: 'bg-blue-500/10',
					},
					{
						title: t('dashboard.activeMentors'),
						value: stats.activeMentors,
						icon: GraduationCap,
						colorClass: 'text-purple-500',
						bgClass: 'bg-purple-500/10',
					},
					{
						title: t('dashboard.totalLessons'),
						value: stats.totalLessons,
						subtext: t('dashboard.today', { count: stats.todayLessons }),
						icon: BookOpen,
						colorClass: 'text-green-500',
						bgClass: 'bg-green-500/10',
					},
				].map((stat, idx) => (
					<motion.div key={idx} variants={itemVariants}>
						<Card className='shadow-sm h-full hover:shadow-md transition-shadow'>
							<CardContent className='p-6 flex items-center justify-between h-full'>
								<div>
									<p className='text-sm font-medium text-muted-foreground mb-1'>
										{stat.title}
									</p>
									<h3 className='text-2xl font-bold'>{stat.value}</h3>
									{stat.subtext && (
										<p className='text-xs text-muted-foreground mt-1'>
											{stat.subtext}
										</p>
									)}
								</div>
								<div className={`p-3 rounded-xl shrink-0 ${stat.bgClass}`}>
									<stat.icon className={`h-6 w-6 ${stat.colorClass}`} />
								</div>
							</CardContent>
						</Card>
					</motion.div>
				))}

				{/* Maxsus Alert Card */}
				<motion.div variants={itemVariants}>
					<Card
						className='border-destructive/30 bg-destructive/5 shadow-sm h-full relative overflow-hidden group cursor-pointer hover:border-destructive/50 transition-colors'
						onClick={() => router.push('/users/messages')}
					>
						<CardContent className='p-6 flex items-center justify-between h-full relative z-10'>
							<div>
								<p className='text-sm font-bold text-destructive mb-1'>
									{t('dashboard.newMessages')}
								</p>
								<h3 className='text-2xl font-bold text-destructive'>
									{recentMessages.length}
								</h3>
								<p className='text-xs text-destructive/80 mt-1 font-medium'>
									{t('dashboard.needsReview')}
								</p>
							</div>
							<div className='bg-destructive/20 p-3 rounded-xl shrink-0 group-hover:animate-pulse'>
								<ShieldAlert className='h-6 w-6 text-destructive' />
							</div>
						</CardContent>
					</Card>
				</motion.div>
			</motion.div>

			{/* 🗂️ MAIN CONTENT PANELS */}
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* Arizalar */}
				<motion.div variants={itemVariants} className='lg:col-span-2 space-y-6'>
					<Card className='shadow-sm h-full flex flex-col'>
						<CardHeader className='pb-3 border-b flex flex-row items-center justify-between'>
							<div>
								<CardTitle className='text-lg'>
									{t('dashboard.mentorApplications')}
								</CardTitle>
								<CardDescription>
									{t('dashboard.waitingApproval')} {stats.pendingMentors}
								</CardDescription>
							</div>
							{applications.length > 0 && (
								<Badge
									variant='secondary'
									className='bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/20 border-none'
								>
									{applications.length} ta kutilmoqda
								</Badge>
							)}
						</CardHeader>
						<CardContent className='flex-1 space-y-3 pt-4'>
							{applications.length > 0 ? (
								applications.map(app => (
									<div
										key={app._id}
										className='flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-xl bg-card hover:bg-accent/50 transition-colors gap-4'
									>
										<div className='flex gap-4 items-center'>
											<Avatar className='h-12 w-12 shadow-sm'>
												<AvatarFallback className='bg-primary/10 text-primary font-medium'>
													{getInitials(app.firstName, app.lastName)}
												</AvatarFallback>
											</Avatar>
											<div>
												<h4 className='font-semibold text-base flex items-center gap-2'>
													{app.firstName} {app.lastName}
													<Badge variant='outline' className='text-[10px] h-5'>
														{app.course || 'Kurs'}
													</Badge>
												</h4>
												<p className='text-sm text-muted-foreground mt-0.5'>
													{app.specialty || t('common.notEntered')}
												</p>
											</div>
										</div>
										<div className='flex w-full sm:w-auto gap-2'>
											<Button
												size='sm'
												variant='outline'
												disabled={processingId === app._id}
												onClick={() =>
													handleApplicationAction(app._id, 'reject')
												}
												className='flex-1 sm:flex-none h-9 text-destructive hover:text-destructive hover:bg-destructive/10'
											>
												{processingId === app._id ? (
													<Loader2 className='h-4 w-4 animate-spin' />
												) : (
													<XCircle className='h-4 w-4 mr-1.5' />
												)}
												{t('dashboard.reject')}
											</Button>
											<Button
												size='sm'
												disabled={processingId === app._id}
												onClick={() =>
													handleApplicationAction(app._id, 'approve')
												}
												className='flex-1 sm:flex-none h-9'
											>
												{processingId === app._id ? (
													<Loader2 className='h-4 w-4 animate-spin' />
												) : (
													<CheckCircle2 className='h-4 w-4 mr-1.5' />
												)}
												{t('dashboard.approve')}
											</Button>
										</div>
									</div>
								))
							) : (
								<div className='py-12 flex flex-col items-center justify-center text-muted-foreground text-center'>
									<GraduationCap className='h-10 w-10 mb-3 opacity-20' />
									<p>{t('dashboard.noApplications')}</p>
								</div>
							)}
						</CardContent>
						{applications.length > 0 && (
							<CardFooter className='pt-2 pb-4 justify-center border-t'>
								<Button variant='link' asChild className='text-primary'>
									<Link href='/admin/applications'>
										{t('dashboard.viewAllApplications')} &rarr;
									</Link>
								</Button>
							</CardFooter>
						)}
					</Card>
				</motion.div>

				{/* So'nggi murojaatlar */}
				<motion.div variants={itemVariants} className='lg:col-span-1 space-y-6'>
					<Card className='shadow-sm h-full flex flex-col border-destructive/20'>
						<CardHeader className='bg-destructive/5 pb-4 border-b border-destructive/10'>
							<CardTitle className='text-lg flex items-center gap-2 text-destructive'>
								<AlertTriangle className='h-5 w-5' />
								{t('dashboard.recentInquiries')}
							</CardTitle>
						</CardHeader>
						<CardContent className='flex-1 space-y-3 pt-4'>
							{recentMessages.length > 0 ? (
								recentMessages.map(msg => (
									<div
										key={msg.id}
										className={`border p-3 rounded-xl space-y-2 transition-colors hover:bg-accent/50 ${
											msg.type === 'complaint'
												? 'border-destructive/30 bg-destructive/5'
												: ''
										}`}
									>
										<div className='flex gap-2 items-start'>
											{msg.type === 'complaint' && (
												<AlertTriangle className='h-4 w-4 text-destructive shrink-0 mt-0.5' />
											)}
											<div className='flex-1 min-w-0'>
												<p className='font-semibold text-sm truncate'>
													{msg.senderName}{' '}
													<span className='text-[10px] font-normal text-muted-foreground uppercase'>
														({roleLabels[msg.senderRole] || msg.senderRole})
													</span>
												</p>
												<p className='text-xs text-muted-foreground line-clamp-2 mt-0.5'>
													"{msg.text}"
												</p>
											</div>
										</div>
										<div className='flex justify-between items-center pt-2'>
											<Badge
												variant='outline'
												className={`text-[10px] ${msg.type === 'complaint' ? 'text-destructive border-destructive/50' : ''}`}
											>
												{msg.type === 'complaint'
													? t('dashboard.complaint')
													: t('dashboard.general')}
											</Badge>
											<Button
												size='sm'
												variant='link'
												className='h-auto p-0 text-xs'
												onClick={() => router.push('/users/messages')}
											>
												{t('dashboard.reply')}
											</Button>
										</div>
									</div>
								))
							) : (
								<div className='py-10 text-center text-muted-foreground text-sm flex flex-col items-center'>
									<ShieldAlert className='h-8 w-8 mb-2 opacity-20' />
									{t('dashboard.noInquiries')}
								</div>
							)}
						</CardContent>
						<CardFooter className='pt-2 mt-auto'>
							<Button
								variant='outline'
								className='w-full text-destructive hover:bg-destructive hover:text-destructive-foreground border-destructive/30'
								onClick={() => router.push('/users/messages')}
							>
								{t('dashboard.openMessagesPanel')}
							</Button>
						</CardFooter>
					</Card>
				</motion.div>
			</div>
		</motion.div>
	)
}
