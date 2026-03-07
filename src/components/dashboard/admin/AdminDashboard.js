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
import { motion } from 'framer-motion'
import {
	AlertTriangle,
	BookOpen,
	CheckCircle2,
	GraduationCap,
	ShieldAlert,
	Users,
	XCircle,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const containerVariants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: { staggerChildren: 0.1 },
	},
}

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	show: {
		opacity: 1,
		y: 0,
		transition: { type: 'spring', stiffness: 300, damping: 24 },
	},
}

export default function AdminDashboard() {
	const router = useRouter()

	const [stats, setStats] = useState({
		totalStudents: 0,
		activeMentors: 0,
		totalLessons: 0,
		todayLessons: 0,
		pendingMentors: 0,
	})

	const [applications, setApplications] = useState([])
	const [recentMessages, setRecentMessages] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		fetchData()
	}, [])

	const fetchData = async () => {
		setLoading(true)
		try {
			const kpiRes = await api.get('/admin/kpi/stats')
			if (kpiRes?.data?.success) {
				const apiStats = kpiRes.data.stats || {}
				setStats({
					totalStudents: apiStats.totalStudents || 0,
					activeMentors: apiStats.activeMentors || 0,
					totalLessons: apiStats.totalLessons || 0,
					todayLessons: apiStats.todayLessonsCount || 0,
					pendingMentors: apiStats.pendingApplications || 0,
				})
			}

			const appsRes = await api.get('/admin/applications/mentors')
			if (appsRes?.data?.success) {
				setApplications((appsRes.data.applications || []).slice(0, 5))
			}

			const msgsRes = await api.get('/messages/system/all')
			if (msgsRes?.data?.success) {
				const sysMsgs = msgsRes.data.conversations
					.filter(
						c =>
							c.type === 'complaint' ||
							c.type === 'connection' ||
							c.type === 'general',
					)
					.map(m => {
						const sender = m.participants.find(p => p.role !== 'admin')
						return {
							id: m._id,
							type: m.type,
							text: m.lastMessage?.text || 'Yangi xabar',
							senderName: sender
								? `${sender.firstName} ${sender.lastName}`
								: "Noma'lum",
							senderRole: sender ? sender.role : 'foydalanuvchi',
						}
					})
					.slice(0, 4)

				setRecentMessages(sysMsgs)
			}
		} catch (error) {
			console.error(error)
		} finally {
			setLoading(false)
		}
	}

	const handleApprove = async id => {
		try {
			await api.put(`/admin/applications/mentors/${id}/approve`)
			fetchData()
		} catch (error) {
			console.error(error)
		}
	}

	const handleReject = async id => {
		try {
			await api.put(`/admin/applications/mentors/${id}/reject`)
			fetchData()
		} catch (error) {
			console.error(error)
		}
	}

	if (loading) {
		return (
			<div className='space-y-6 max-w-7xl mx-auto pb-8 px-4 sm:px-6 lg:px-8 pt-6'>
				<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
					<div className='space-y-2'>
						<Skeleton className='h-8 w-64' />
						<Skeleton className='h-4 w-96' />
					</div>
					<div className='flex gap-2'>
						<Skeleton className='h-10 w-40' />
						<Skeleton className='h-10 w-40' />
					</div>
				</div>

				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
					{Array.from({ length: 4 }).map((_, i) => (
						<Card key={i} className='border-muted shadow-sm'>
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
								{Array.from({ length: 3 }).map((_, i) => (
									<div
										key={i}
										className='flex justify-between items-center p-4 border rounded-xl'
									>
										<div className='flex gap-4 items-center'>
											<Skeleton className='h-12 w-12 rounded-full' />
											<div className='space-y-2'>
												<Skeleton className='h-5 w-40' />
												<Skeleton className='h-4 w-32' />
											</div>
										</div>
										<div className='flex gap-2'>
											<Skeleton className='h-9 w-24 rounded-md' />
											<Skeleton className='h-9 w-28 rounded-md' />
										</div>
									</div>
								))}
							</CardContent>
						</Card>
					</div>

					<div className='lg:col-span-1 space-y-6'>
						<Card className='shadow-sm h-full flex flex-col'>
							<CardHeader className='pb-4 border-b'>
								<Skeleton className='h-6 w-48' />
							</CardHeader>
							<CardContent className='flex-1 space-y-4 pt-4'>
								{Array.from({ length: 3 }).map((_, i) => (
									<div key={i} className='border p-3 rounded-xl space-y-3'>
										<Skeleton className='h-4 w-3/4' />
										<Skeleton className='h-3 w-full' />
										<div className='flex justify-between pt-2'>
											<Skeleton className='h-4 w-16' />
											<Skeleton className='h-4 w-20' />
										</div>
									</div>
								))}
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		)
	}

	return (
		<motion.div
			variants={containerVariants}
			initial='hidden'
			animate='show'
			className='space-y-6 max-w-7xl mx-auto pb-8 px-4 sm:px-6 lg:px-8 pt-6'
		>
			<motion.div
				variants={itemVariants}
				className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'
			>
				<div>
					<h1 className='text-2xl sm:text-3xl font-bold tracking-tight text-foreground'>
						Boshqaruv Markazi (Admin)
					</h1>
					<p className='text-muted-foreground mt-1'>
						Platformaning joriy holati va tezkor harakatlar oynasi.
					</p>
				</div>
				<div className='flex flex-wrap gap-2'>
					<Button
						variant='outline'
						className='shrink-0'
						onClick={() => router.push('/admin/kpi')}
					>
						To'liq KPIni ko'rish
					</Button>
					<Button
						className='shrink-0 gap-2 bg-primary'
						onClick={() => router.push('/users/settings')}
					>
						Tizim sozlamalari
					</Button>
				</div>
			</motion.div>

			<motion.div
				variants={containerVariants}
				className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
			>
				<motion.div variants={itemVariants}>
					<Card className='border-muted shadow-sm h-full'>
						<CardContent className='p-6 flex items-center justify-between h-full'>
							<div>
								<p className='text-sm font-medium text-muted-foreground mb-1'>
									Jami o'quvchilar
								</p>
								<h3 className='text-2xl font-bold'>
									{stats?.totalStudents || 0}
								</h3>
							</div>
							<div className='bg-blue-500/10 p-3 rounded-xl shrink-0'>
								<Users className='h-6 w-6 text-blue-500' />
							</div>
						</CardContent>
					</Card>
				</motion.div>

				<motion.div variants={itemVariants}>
					<Card className='border-muted shadow-sm h-full'>
						<CardContent className='p-6 flex items-center justify-between h-full'>
							<div>
								<p className='text-sm font-medium text-muted-foreground mb-1'>
									Faol Mentorlar
								</p>
								<h3 className='text-2xl font-bold'>
									{stats?.activeMentors || 0}
								</h3>
							</div>
							<div className='bg-purple-500/10 p-3 rounded-xl shrink-0'>
								<GraduationCap className='h-6 w-6 text-purple-500' />
							</div>
						</CardContent>
					</Card>
				</motion.div>

				<motion.div variants={itemVariants}>
					<Card className='border-muted shadow-sm h-full'>
						<CardContent className='p-6 flex items-center justify-between h-full'>
							<div>
								<p className='text-sm font-medium text-muted-foreground mb-1'>
									Jami Darslar
								</p>
								<h3 className='text-2xl font-bold'>
									{stats?.totalLessons || 0}
								</h3>
								<p className='text-xs text-muted-foreground mt-1'>
									Bugun: {stats?.todayLessons || 0} ta
								</p>
							</div>
							<div className='bg-green-500/10 p-3 rounded-xl shrink-0'>
								<BookOpen className='h-6 w-6 text-green-500' />
							</div>
						</CardContent>
					</Card>
				</motion.div>

				<motion.div variants={itemVariants}>
					<Card
						className='border-red-500/30 bg-red-500/5 shadow-sm h-full relative overflow-hidden group cursor-pointer hover:border-red-500/50 transition-colors'
						onClick={() => router.push('/users/messages')}
					>
						<CardContent className='p-6 flex items-center justify-between h-full relative z-10'>
							<div>
								<p className='text-sm font-bold text-red-600 dark:text-red-400 mb-1'>
									Yangi Xabarlar
								</p>
								<h3 className='text-2xl font-bold text-red-600 dark:text-red-400'>
									{recentMessages.length} ta
								</h3>
								<p className='text-xs text-red-500 mt-1 font-medium'>
									Ko'rib chiqish kerak
								</p>
							</div>
							<div className='bg-red-500/20 p-3 rounded-xl shrink-0 animate-pulse'>
								<ShieldAlert className='h-6 w-6 text-red-600' />
							</div>
						</CardContent>
					</Card>
				</motion.div>
			</motion.div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				<motion.div variants={itemVariants} className='lg:col-span-2 space-y-6'>
					<Card className='shadow-sm h-full'>
						<CardHeader className='pb-3 border-b mb-4 flex flex-row items-center justify-between'>
							<div>
								<CardTitle className='text-lg'>Mentorlikka arizalar</CardTitle>
								<CardDescription>
									Tasdiqlashni kutayotgan foydalanuvchilar (
									{stats?.pendingMentors || 0} ta umumiy)
								</CardDescription>
							</div>
							{applications.length > 0 && (
								<Badge
									variant='secondary'
									className='bg-yellow-500/10 text-yellow-600 border-none'
								>
									{applications.length} ta kutmoqda
								</Badge>
							)}
						</CardHeader>
						<CardContent className='space-y-4'>
							{applications.length > 0 ? (
								applications.map(applicant => (
									<div
										key={applicant._id}
										className='flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-xl hover:bg-muted/30 transition-colors gap-4'
									>
										<div className='flex gap-4 items-center'>
											<Avatar className='h-12 w-12 border shadow-sm'>
												<AvatarFallback className='bg-primary/10 text-primary font-bold'>
													{applicant.firstName.charAt(0)}
												</AvatarFallback>
											</Avatar>
											<div>
												<h4 className='font-bold text-base leading-tight flex items-center gap-2'>
													{applicant.firstName} {applicant.lastName}
													<Badge variant='outline' className='text-[10px] h-5'>
														{applicant.course}
													</Badge>
												</h4>
												<p className='text-sm text-muted-foreground mt-1'>
													Yo'nalish:{' '}
													<span className='font-medium text-foreground'>
														{applicant.specialty || 'Kiritilmagan'}
													</span>
												</p>
												<p className='text-xs text-muted-foreground mt-0.5'>
													GPA: <strong className='text-primary'>Yuqori</strong>
												</p>
											</div>
										</div>
										<div className='flex w-full sm:w-auto gap-2 mt-2 sm:mt-0'>
											<Button
												size='sm'
												variant='outline'
												onClick={() => handleReject(applicant._id)}
												className='flex-1 sm:flex-none h-9 text-red-500 hover:text-red-600 hover:bg-red-50'
											>
												<XCircle className='h-4 w-4 mr-1.5' /> Rad etish
											</Button>
											<Button
												size='sm'
												onClick={() => handleApprove(applicant._id)}
												className='flex-1 sm:flex-none h-9 bg-green-500 hover:bg-green-600 text-white'
											>
												<CheckCircle2 className='h-4 w-4 mr-1.5' /> Tasdiqlash
											</Button>
										</div>
									</div>
								))
							) : (
								<div className='py-8 text-center text-muted-foreground'>
									Hozircha yangi arizalar yo'q
								</div>
							)}

							{applications.length > 0 && (
								<div className='text-center pt-2'>
									<Link
										href='/admin/applications'
										className='text-sm font-medium text-primary hover:underline'
									>
										Barcha arizalarni ko'rish &rarr;
									</Link>
								</div>
							)}
						</CardContent>
					</Card>
				</motion.div>

				<motion.div variants={itemVariants} className='lg:col-span-1 space-y-6'>
					<Card className='shadow-sm h-full flex flex-col border-red-500/20'>
						<CardHeader className='bg-red-500/5 pb-4 border-b border-red-500/10'>
							<CardTitle className='text-lg flex items-center gap-2 text-red-600 dark:text-red-400'>
								<AlertTriangle className='h-5 w-5' /> So'nggi murojaatlar
							</CardTitle>
						</CardHeader>
						<CardContent className='flex-1 space-y-4 pt-4'>
							{recentMessages.length > 0 ? (
								recentMessages.map((msg, i) => (
									<div
										key={i}
										className={`border ${
											msg.type === 'complaint'
												? 'border-red-500/20 bg-red-500/5'
												: ''
										} p-3 rounded-xl space-y-3 relative`}
									>
										<div className='pr-6 text-sm flex gap-2 items-start'>
											{msg.type === 'complaint' && (
												<AlertTriangle className='h-4 w-4 text-red-500 shrink-0 mt-0.5' />
											)}
											<div>
												<p className='font-bold text-foreground mb-1'>
													{msg.senderName}{' '}
													<span className='text-xs font-normal text-muted-foreground capitalize'>
														({msg.senderRole})
													</span>
												</p>
												<p className='text-xs text-muted-foreground leading-relaxed line-clamp-2'>
													"{msg.text}"
												</p>
											</div>
										</div>
										<div className='flex justify-between items-center pt-2 border-t border-border/50'>
											<Badge
												variant='outline'
												className={`text-[10px] ${
													msg.type === 'complaint' ? 'text-red-500' : ''
												}`}
											>
												{msg.type === 'complaint' ? 'Shikoyat' : 'Umumiy'}
											</Badge>
											<Button
												size='sm'
												variant='link'
												onClick={() => router.push('/users/messages')}
												className='h-6 p-0 text-primary'
											>
												Javob yozish &rarr;
											</Button>
										</div>
									</div>
								))
							) : (
								<div className='py-8 text-center text-muted-foreground text-sm'>
									Yangi murojaatlar topilmadi
								</div>
							)}
						</CardContent>
						<CardFooter className='pt-0 mt-auto'>
							<Button
								variant='outline'
								onClick={() => router.push('/users/messages')}
								className='w-full border-red-500/20 hover:bg-red-500/5 text-red-600'
							>
								Xabarlar panelini ochish
							</Button>
						</CardFooter>
					</Card>
				</motion.div>
			</div>
		</motion.div>
	)
}
