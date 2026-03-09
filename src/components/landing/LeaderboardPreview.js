'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import api from '@/lib/api'
import { useTranslation } from '@/lib/i18n'
// 🔥 Markazlashgan utilitalar
import { cn, getInitials } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Heart, Trophy, Users } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

// Reyting uslublari (Oltin, Kumush, Bronza)
const RANK_STYLES = [
	{
		color: 'text-yellow-600 dark:text-yellow-500',
		bg: 'bg-yellow-500/10 border-yellow-500/20',
	},
	{
		color: 'text-slate-600 dark:text-slate-400',
		bg: 'bg-slate-500/10 border-slate-500/20',
	},
	{
		color: 'text-amber-700 dark:text-amber-600',
		bg: 'bg-amber-600/10 border-amber-600/20',
	},
]

export default function LeaderboardPreview() {
	const { t } = useTranslation()
	const [leaders, setLeaders] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchLeaders = async () => {
			try {
				const res = await api.get('/public/mentors')
				if (res?.data?.success) {
					const sorted = res.data.mentors
						.sort((a, b) => (b.followersCount || 0) - (a.followersCount || 0))
						.slice(0, 3)
					setLeaders(sorted)
				}
			} catch (error) {
				console.error('Leaderboard yuklashda xatolik:', error)
			} finally {
				setLoading(false)
			}
		}
		fetchLeaders()
	}, [])

	return (
		<section className='w-full py-20 md:py-32 bg-muted/30 border-y'>
			<div className='container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl'>
				{/* Asosiy Karta */}
				<div className='flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16 bg-background border rounded-2xl p-8 md:p-12 shadow-sm'>
					{/* Chap tomon: Matn qismi */}
					<div className='w-full md:w-1/2 space-y-6 text-center md:text-left'>
						<Badge
							variant='secondary'
							className='gap-2 text-red-600 bg-red-500/10 border-transparent px-3 py-1 font-bold text-xs uppercase tracking-wider'
						>
							<Heart className='w-3.5 h-3.5' />{' '}
							{t('leaderboard.badge') || 'Top Mentorlar'}
						</Badge>
						<h2 className='text-3xl md:text-4xl font-extrabold tracking-tight text-foreground text-balance'>
							{t('leaderboard.title') || "Eng ko'p kuzatilgan ustozlar"}
						</h2>
						<p className='text-muted-foreground text-base sm:text-lg leading-relaxed text-balance'>
							{t('leaderboard.desc') ||
								"Platformamizda eng ko'p obunachiga ega bo'lgan va faol dars o'tayotgan mutaxassislar ro'yxati."}
						</p>
					</div>

					{/* O'ng tomon: Ro'yxat */}
					<div className='w-full md:w-1/2 flex flex-col gap-3'>
						{loading ? (
							// Skeleton Loader
							Array.from({ length: 3 }).map((_, i) => (
								<div
									key={i}
									className='flex items-center justify-between p-4 rounded-xl border bg-card/50'
								>
									<div className='flex items-center gap-4 flex-1'>
										<Skeleton className='w-8 h-8 rounded-lg' />
										<div className='flex items-center gap-3'>
											<Skeleton className='w-10 h-10 rounded-full' />
											<div className='space-y-2'>
												<Skeleton className='h-4 w-32' />
												<Skeleton className='h-3 w-20' />
											</div>
										</div>
									</div>
									<Skeleton className='h-6 w-16 rounded-md' />
								</div>
							))
						) : leaders.length > 0 ? (
							// Asosiy ma'lumotlar
							leaders.map((leader, i) => {
								const style = RANK_STYLES[i] || RANK_STYLES[2]
								return (
									<motion.div
										key={leader._id || i}
										initial={{ opacity: 0, x: 20 }}
										whileInView={{ opacity: 1, x: 0 }}
										viewport={{ once: true }}
										transition={{
											delay: i * 0.1,
											type: 'spring',
											stiffness: 300,
											damping: 24,
										}}
									>
										<Link
											href={`/home/mentors/${leader._id || leader.id}`}
											className='flex items-center justify-between p-4 rounded-xl border bg-card hover:border-primary/40 hover:shadow-md transition-all duration-300 group'
										>
											<div className='flex items-center gap-4 min-w-0'>
												{/* O'rin belgisi */}
												<div
													className={cn(
														'w-9 h-9 rounded-lg border flex items-center justify-center font-bold text-sm shrink-0',
														style.bg,
														style.color,
													)}
												>
													{i === 0 ? (
														<Trophy className='w-4 h-4' />
													) : (
														`#${i + 1}`
													)}
												</div>

												{/* Profil ma'lumotlari */}
												<div className='flex items-center gap-3 min-w-0'>
													<Avatar className='w-10 h-10 border shadow-sm shrink-0'>
														<AvatarFallback className='bg-primary/5 text-primary text-xs font-bold'>
															{getInitials(leader.firstName, leader.lastName)}
														</AvatarFallback>
													</Avatar>
													<div className='min-w-0'>
														<span className='font-semibold text-sm block truncate transition-colors group-hover:text-primary'>
															{leader.firstName} {leader.lastName}
														</span>
														<p className='text-[11px] text-muted-foreground font-medium truncate mt-0.5'>
															{leader.specialty ||
																t('common.mentor') ||
																'Mentor'}
														</p>
													</div>
												</div>
											</div>

											{/* Obunachilar soni */}
											<Badge
												variant='secondary'
												className='flex items-center gap-1.5 font-bold bg-muted text-foreground border-transparent shadow-none ml-2 shrink-0'
											>
												<span>{leader.followersCount || 0}</span>
												<Users className='w-3.5 h-3.5 text-muted-foreground' />
											</Badge>
										</Link>
									</motion.div>
								)
							})
						) : (
							// Ma'lumot yo'q bo'lsa
							<div className='text-center py-10 text-sm font-medium text-muted-foreground border border-dashed rounded-xl bg-muted/10'>
								{t('leaderboard.empty') || "Hozircha ma'lumot yo'q"}
							</div>
						)}
					</div>
				</div>
			</div>
		</section>
	)
}
