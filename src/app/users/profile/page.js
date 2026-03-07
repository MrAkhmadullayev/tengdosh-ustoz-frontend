'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import api from '@/lib/api'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import {
	Briefcase,
	Calendar,
	Clock,
	GraduationCap,
	Languages,
	Pencil,
	Phone,
	ShieldCheck,
	Sparkles,
	User,
	Users,
	Wrench,
} from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

// --- SKELETON LOADER ---
const ProfileSkeleton = () => (
	<div className='max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500'>
		<Card className='overflow-hidden border-none shadow-sm'>
			<Skeleton className='h-32 sm:h-48 w-full rounded-none' />
			<CardContent className='p-6 pt-0 flex flex-col sm:flex-row gap-6 sm:items-end -mt-12 sm:-mt-16 relative z-10'>
				<Skeleton className='w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-background' />
				<div className='flex-1 space-y-3 mb-2'>
					<Skeleton className='h-8 w-48' />
					<Skeleton className='h-5 w-32' />
				</div>
				<Skeleton className='h-10 w-32 mb-2' />
			</CardContent>
		</Card>

		<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
			<Skeleton className='h-[400px] rounded-2xl' />
			<div className='md:col-span-2 space-y-6'>
				<Skeleton className='h-[150px] rounded-2xl' />
				<Skeleton className='h-[200px] rounded-2xl' />
				<Skeleton className='h-[200px] rounded-2xl' />
			</div>
		</div>
	</div>
)

export default function UserProfilePage() {
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)

	const fetchUser = useCallback(async () => {
		try {
			const res = await api.get('/auth/me')
			if (res.data.success) setUser(res.data.user)
		} catch (e) {
			console.error(e)
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		fetchUser()
	}, [fetchUser])

	// Telefon raqamni formatlash (masalan: +998 90 123 45 67)
	const formatPhoneNumber = phone => {
		if (!phone) return '—'
		const cleaned = phone.replace(/\D/g, '')
		const match = cleaned.match(/^(?:998)?(\d{2})(\d{3})(\d{2})(\d{2})$/)
		if (match) {
			return `+998 ${match[1]} ${match[2]} ${match[3]} ${match[4]}`
		}
		return phone // Formatga tushmasa o'zini qaytaradi
	}

	if (loading) return <ProfileSkeleton />
	if (!user)
		return (
			<div className='text-center text-muted-foreground py-12'>
				Foydalanuvchi ma'lumotlari topilmadi.
			</div>
		)

	const role = user.role
	const initials =
		`${(user.firstName || '?')[0]}${(user.lastName || '?')[0]}`.toUpperCase()
	const fullName =
		`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Foydalanuvchi'

	const roleLabel = { admin: 'Admin', mentor: 'Mentor', student: 'Talaba' }
	const roleColor = {
		admin:
			'bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400',
		mentor:
			'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400',
		student:
			'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400',
	}

	const InfoRow = ({ icon: Icon, label, value, colorClass }) => (
		<div className='flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors'>
			<div className={cn('p-2.5 rounded-lg shrink-0', colorClass)}>
				<Icon className='w-4 h-4' />
			</div>
			<div className='space-y-0.5 min-w-0 flex-1'>
				<p className='text-[11px] font-medium uppercase tracking-wider text-muted-foreground'>
					{label}
				</p>
				<p className='text-sm font-semibold text-foreground truncate'>
					{value || '—'}
				</p>
			</div>
		</div>
	)

	// Framer motion variants
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { staggerChildren: 0.1 },
		},
	}
	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0 },
	}

	return (
		<motion.div
			initial='hidden'
			animate='visible'
			variants={containerVariants}
			className='max-w-4xl mx-auto space-y-6 pb-12'
		>
			{/* ===== HEADER CARD ===== */}
			<motion.div variants={itemVariants}>
				<Card className='overflow-hidden border-none shadow-md bg-background'>
					{/* Banner */}
					<div className='h-32 sm:h-48 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent' />

					<CardContent className='p-6 pt-0 flex flex-col sm:flex-row gap-4 sm:items-end -mt-12 sm:-mt-16 relative z-10'>
						{/* Avatar */}
						<Avatar className='w-24 h-24 sm:w-32 sm:h-32 border-4 border-background shadow-xl rounded-2xl bg-background'>
							<AvatarFallback className='bg-primary/5 text-primary text-2xl sm:text-4xl font-black'>
								{initials}
							</AvatarFallback>
						</Avatar>

						{/* User Info */}
						<div className='flex-1 space-y-1.5 mb-1 sm:mb-2 text-center sm:text-left mt-2 sm:mt-0'>
							<h1 className='text-2xl sm:text-3xl font-bold tracking-tight text-foreground'>
								{fullName}
							</h1>
							<div className='flex flex-wrap items-center justify-center sm:justify-start gap-2'>
								<Badge
									variant='outline'
									className={cn(
										'rounded-md px-2.5 py-0.5 font-semibold',
										roleColor[role] || '',
									)}
								>
									<ShieldCheck className='w-3.5 h-3.5 mr-1.5' />
									{roleLabel[role] || role}
								</Badge>
								{user.username && (
									<span className='text-sm font-medium text-muted-foreground'>
										@{user.username}
									</span>
								)}
							</div>
						</div>

						{/* Action Button */}
						<div className='flex justify-center sm:justify-end mb-1 sm:mb-2'>
							<Link href='/users/settings' className='w-full sm:w-auto'>
								<Button className='w-full rounded-xl gap-2 shadow-sm font-semibold'>
									<Pencil className='w-4 h-4' /> Tahrirlash
								</Button>
							</Link>
						</div>
					</CardContent>
				</Card>
			</motion.div>

			{/* ===== CONTENT GRID ===== */}
			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				{/* LEFT COLUMN: Main Info */}
				<motion.div variants={itemVariants} className='md:col-span-1 space-y-6'>
					<Card className='shadow-sm border-muted/60'>
						<CardHeader className='pb-2'>
							<CardTitle className='text-base font-bold'>
								Asosiy ma&apos;lumotlar
							</CardTitle>
						</CardHeader>
						<CardContent className='space-y-1'>
							<InfoRow
								icon={Phone}
								label='Telefon raqam'
								value={formatPhoneNumber(user.phoneNumber)}
								colorClass='bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
							/>

							{(role === 'student' || role === 'mentor') && (
								<>
									<InfoRow
										icon={GraduationCap}
										label='Kurs'
										value={user.course}
										colorClass='bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400'
									/>
									<InfoRow
										icon={Users}
										label='Guruh'
										value={user.group}
										colorClass='bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'
									/>
								</>
							)}

							{role === 'mentor' && (
								<>
									<InfoRow
										icon={Briefcase}
										label="Yo'nalish"
										value={user.specialty}
										colorClass='bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400'
									/>
									<InfoRow
										icon={Calendar}
										label='Tajriba'
										value={user.experience ? `${user.experience} yil` : null}
										colorClass='bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400'
									/>
								</>
							)}

							{user.isMentor && (
								<div className='pt-4 px-3'>
									<div className='flex items-center gap-2 p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-200 dark:border-blue-500/20'>
										<Sparkles className='w-5 h-5' />
										<span className='text-sm font-bold'>
											Tasdiqlangan Mentor
										</span>
									</div>
								</div>
							)}
						</CardContent>
					</Card>
				</motion.div>

				{/* RIGHT COLUMN: Bio, Languages, Skills, Schedule */}
				<div className='md:col-span-2 space-y-6'>
					{/* Bio */}
					<motion.div variants={itemVariants}>
						<Card className='shadow-sm border-muted/60'>
							<CardHeader className='pb-3'>
								<CardTitle className='text-base flex items-center gap-2 font-bold'>
									<User className='w-4 h-4 text-primary' /> Men haqimda
								</CardTitle>
							</CardHeader>
							<CardContent>
								{user.about ? (
									<p className='text-muted-foreground leading-relaxed text-sm whitespace-pre-wrap'>
										{user.about}
									</p>
								) : (
									<p className='text-sm text-muted-foreground italic py-2'>
										Hali ma'lumot kiritilmagan.
									</p>
								)}
							</CardContent>
						</Card>
					</motion.div>

					{/* Mentor: Languages */}
					{role === 'mentor' && user.languages && user.languages.length > 0 && (
						<motion.div variants={itemVariants}>
							<Card className='shadow-sm border-muted/60'>
								<CardHeader className='pb-3'>
									<CardTitle className='text-base flex items-center gap-2 font-bold'>
										<Languages className='w-4 h-4 text-primary' /> Tillar
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
										{user.languages.map((lang, i) => (
											<div
												key={i}
												className='flex items-center justify-between p-3.5 rounded-xl bg-muted/40 border'
											>
												<div className='flex items-center gap-2.5'>
													<span className='font-semibold text-sm'>
														{lang.lang}
													</span>
													{lang.isNative && (
														<Badge
															variant='outline'
															className='text-[10px] bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 py-0'
														>
															Ona tili
														</Badge>
													)}
												</div>
												<Badge
													variant='secondary'
													className='font-mono font-bold text-xs'
												>
													{lang.level}
												</Badge>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						</motion.div>
					)}

					{/* Mentor: Skills */}
					{role === 'mentor' && user.skills && user.skills.length > 0 && (
						<motion.div variants={itemVariants}>
							<Card className='shadow-sm border-muted/60'>
								<CardHeader className='pb-3'>
									<CardTitle className='text-base flex items-center gap-2 font-bold'>
										<Wrench className='w-4 h-4 text-primary' /> Texnik
										ko&apos;nikmalar
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className='flex flex-wrap gap-2.5'>
										{user.skills.map((skill, i) => (
											<Badge
												key={i}
												variant='secondary'
												className='px-3.5 py-1.5 rounded-lg text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors cursor-default'
											>
												{skill}
											</Badge>
										))}
									</div>
								</CardContent>
							</Card>
						</motion.div>
					)}

					{/* Mentor: Schedule */}
					{role === 'mentor' && user.schedule && user.schedule.length > 0 && (
						<motion.div variants={itemVariants}>
							<Card className='shadow-sm border-muted/60'>
								<CardHeader className='pb-3'>
									<CardTitle className='text-base flex items-center gap-2 font-bold'>
										<Clock className='w-4 h-4 text-primary' /> Dars vaqtlari
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className='space-y-3'>
										{user.schedule.map((slot, i) => (
											<div
												key={i}
												className='flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-muted/40 border gap-3'
											>
												<div className='flex items-center gap-2'>
													<div className='w-2 h-2 rounded-full bg-primary' />
													<span className='font-bold text-sm'>{slot.day}</span>
												</div>
												<div className='flex items-center gap-3 text-sm'>
													<div className='bg-background px-3 py-1.5 rounded-md border shadow-sm font-mono font-semibold'>
														{slot.from}
													</div>
													<span className='text-muted-foreground'>—</span>
													<div className='bg-background px-3 py-1.5 rounded-md border shadow-sm font-mono font-semibold'>
														{slot.to}
													</div>
												</div>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						</motion.div>
					)}
				</div>
			</div>
		</motion.div>
	)
}
