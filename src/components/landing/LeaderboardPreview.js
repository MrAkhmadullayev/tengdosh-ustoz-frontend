'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import api from '@/lib/api'
import { motion } from 'framer-motion'
import { Heart, Trophy, Users } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const RANK_STYLES = [
	{ color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
	{ color: 'text-slate-400', bg: 'bg-slate-400/10' },
	{ color: 'text-amber-600', bg: 'bg-amber-600/10' },
]

const getInitials = (firstName, lastName) => {
	const first = firstName ? firstName[0] : ''
	const last = lastName ? lastName[0] : ''
	return (first + last).toUpperCase()
}

export default function LeaderboardPreview() {
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
				console.error(error)
			} finally {
				setLoading(false)
			}
		}
		fetchLeaders()
	}, [])

	return (
		<section className='w-full py-16 bg-primary/5'>
			<div className='container mx-auto px-4 max-w-4xl'>
				<div className='flex flex-col md:flex-row items-center justify-between gap-8 bg-background border rounded-3xl p-8 shadow-sm'>
					<div className='md:w-1/2 space-y-4'>
						<div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 font-semibold text-sm'>
							<Heart className='w-4 h-4' /> Eng mashhur mentorlar
						</div>
						<h2 className='text-3xl font-bold'>
							Eng ko'p obunachiga ega mentorlar
						</h2>
						<p className='text-muted-foreground'>
							Platformadagi eng mashhur mentorlar — obunachilari eng ko'p
							bo'lgan top 3 ta mentor. Ularga obuna bo'ling va bilimingizni
							oshiring!
						</p>
					</div>

					<div className='w-full md:w-1/2 flex flex-col gap-3'>
						{loading ? (
							Array.from({ length: 3 }).map((_, i) => (
								<div
									key={i}
									className='flex items-center justify-between p-3 rounded-2xl border bg-card'
								>
									<div className='flex items-center gap-4 flex-1'>
										<Skeleton className='w-8 h-8 rounded-full shrink-0' />
										<div className='flex items-center gap-2 w-full'>
											<Skeleton className='w-8 h-8 rounded-full shrink-0' />
											<div className='flex flex-col gap-2 w-full max-w-[150px]'>
												<Skeleton className='h-4 w-full' />
												<Skeleton className='h-3 w-2/3' />
											</div>
										</div>
									</div>
									<Skeleton className='h-5 w-12 shrink-0' />
								</div>
							))
						) : leaders.length > 0 ? (
							leaders.map((leader, i) => {
								const style = RANK_STYLES[i] || RANK_STYLES[2]
								return (
									<motion.div
										key={leader._id}
										initial={{ opacity: 0, x: 20 }}
										whileInView={{ opacity: 1, x: 0 }}
										viewport={{ once: true }}
										transition={{ delay: i * 0.15 }}
										className='block'
									>
										<Link
											href={`/home/mentors/${leader._id}`}
											className='flex items-center justify-between p-3 rounded-2xl border bg-card hover:shadow-md hover:border-primary/30 transition-all'
										>
											<div className='flex items-center gap-4'>
												<div
													className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${style.bg} ${style.color}`}
												>
													{i === 0 ? (
														<Trophy className='w-4 h-4' />
													) : (
														`#${i + 1}`
													)}
												</div>
												<div className='flex items-center gap-2'>
													<Avatar className='w-8 h-8'>
														<AvatarFallback className='text-xs bg-primary/5 text-primary'>
															{getInitials(leader.firstName, leader.lastName)}
														</AvatarFallback>
													</Avatar>
													<div>
														<span className='font-semibold text-sm'>
															{leader.firstName} {leader.lastName}
														</span>
														{leader.specialty && (
															<p className='text-xs text-muted-foreground leading-none mt-0.5'>
																{leader.specialty}
															</p>
														)}
													</div>
												</div>
											</div>
											<div className='flex items-center gap-1 font-bold text-primary'>
												{leader.followersCount || 0}{' '}
												<Users className='w-3.5 h-3.5 text-muted-foreground' />
											</div>
										</Link>
									</motion.div>
								)
							})
						) : (
							<div className='text-center py-8 text-muted-foreground text-sm border rounded-2xl bg-card'>
								Hali mentorlar mavjud emas
							</div>
						)}
					</div>
				</div>
			</div>
		</section>
	)
}
