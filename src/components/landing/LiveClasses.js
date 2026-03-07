'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import api from '@/lib/api'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Star, Users } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const getInitials = (firstName, lastName) => {
	const first = firstName ? firstName[0] : ''
	const last = lastName ? lastName[0] : ''
	return (first + last).toUpperCase()
}

const containerVariants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: { staggerChildren: 0.15 },
	},
}

const cardVariants = {
	hidden: { opacity: 0, y: 30 },
	show: {
		opacity: 1,
		y: 0,
		transition: { type: 'spring', stiffness: 300, damping: 24 },
	},
}

export default function TopMentors() {
	const [mentors, setMentors] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchMentors = async () => {
			try {
				const res = await api.get('/public/mentors')
				if (res?.data?.success) {
					setMentors(res.data.mentors)
				}
			} catch (error) {
				console.error(error)
			} finally {
				setLoading(false)
			}
		}
		fetchMentors()
	}, [])

	return (
		<section className='w-full py-16 md:py-24 bg-secondary/10 border-y overflow-hidden'>
			<div className='container mx-auto px-4 md:px-8 max-w-7xl'>
				<div className='flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6'>
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						className='max-w-2xl'
					>
						<Badge
							variant='outline'
							className='mb-4 text-primary border-primary/30 bg-primary/5'
						>
							Eng yaxshilari
						</Badge>
						<h2 className='text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-balance'>
							Top Mentorlarimiz bilan tanishing
						</h2>
						<p className='text-muted-foreground text-lg'>
							O'z yo'nalishi bo'yicha yetakchi bo'lgan va ko'plab talabalarga
							yordam berayotgan tajribali tengdoshlaringiz.
						</p>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, x: 20 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
					>
						<Link href='/home/mentors'>
							<Button
								variant='outline'
								className='gap-2 font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300 group'
							>
								Barchasini ko'rish
								<ArrowRight className='h-4 w-4 group-hover:translate-x-1 transition-transform' />
							</Button>
						</Link>
					</motion.div>
				</div>

				{loading ? (
					<div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-8'>
						{[1, 2, 3].map(item => (
							<div
								key={item}
								className='relative h-full rounded-3xl border bg-background flex flex-col overflow-hidden min-h-[380px]'
							>
								<Skeleton className='h-24 w-full rounded-none rounded-t-3xl' />

								<div className='px-6 relative flex justify-between items-end -mt-10 mb-4'>
									<Skeleton className='h-20 w-20 rounded-full border-4 border-background' />
									<Skeleton className='h-7 w-12 rounded-full mb-2' />
								</div>

								<div className='px-6 pb-6 flex-1 flex flex-col'>
									<Skeleton className='h-7 w-3/4 mb-2' />
									<Skeleton className='h-5 w-1/2 mb-5' />

									<div className='flex flex-wrap gap-2 mb-6'>
										<Skeleton className='h-6 w-16 rounded-full' />
										<Skeleton className='h-6 w-20 rounded-full' />
										<Skeleton className='h-6 w-14 rounded-full' />
									</div>

									<div className='mt-auto pt-4 border-t flex items-center justify-between'>
										<Skeleton className='h-5 w-24' />
										<Skeleton className='h-5 w-20' />
									</div>
								</div>
							</div>
						))}
					</div>
				) : mentors.length === 0 ? (
					<div className='text-center py-16'>
						<p className='text-muted-foreground text-lg'>
							Hozircha mentorlar mavjud emas.
						</p>
					</div>
				) : (
					<motion.div
						variants={containerVariants}
						initial='hidden'
						whileInView='show'
						viewport={{ once: true, margin: '-50px' }}
						className='grid sm:grid-cols-2 lg:grid-cols-3 gap-8'
					>
						{mentors.slice(0, 3).map(mentor => (
							<motion.div key={mentor._id} variants={cardVariants}>
								<Link
									href={`/home/mentors/${mentor._id}`}
									className='block h-full group'
								>
									<div className='relative h-full rounded-3xl border bg-background flex flex-col hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500'>
										<div className='h-24 w-full bg-gradient-to-r from-primary/10 to-secondary/20 rounded-t-3xl relative overflow-hidden group-hover:from-primary/20 group-hover:to-secondary/30 transition-colors duration-500'>
											<div className='absolute -bottom-10 -right-10 w-32 h-32 bg-background/20 rounded-full blur-2xl'></div>
										</div>

										<div className='px-6 relative flex justify-between items-end -mt-10 mb-4'>
											<Avatar className='h-20 w-20 border-4 border-background shadow-md bg-muted'>
												<AvatarFallback className='text-xl font-bold text-primary'>
													{getInitials(mentor.firstName, mentor.lastName)}
												</AvatarFallback>
											</Avatar>

											<div className='flex items-center gap-1.5 bg-background border shadow-sm px-3 py-1 rounded-full mb-2'>
												<Star className='h-4 w-4 text-yellow-500 fill-yellow-500' />
												<span className='text-sm font-bold'>
													{mentor.rating > 0 ? mentor.rating : '—'}
												</span>
											</div>
										</div>

										<div className='px-6 pb-6 flex-1 flex flex-col'>
											<div className='flex items-center gap-2 mb-1'>
												<h3 className='font-extrabold text-xl group-hover:text-primary transition-colors'>
													{mentor.firstName} {mentor.lastName?.charAt(0)}.
												</h3>
												<CheckCircle className='h-4 w-4 text-blue-500' />
											</div>
											<p className='text-muted-foreground font-medium mb-4'>
												{mentor.specialty || 'Mentor'}
											</p>

											<div className='flex flex-wrap gap-2 mb-6'>
												{(mentor.skills || [])
													.slice(0, 3)
													.map((skill, index) => (
														<Badge
															key={index}
															variant='secondary'
															className='bg-muted hover:bg-muted font-normal text-xs'
														>
															{skill}
														</Badge>
													))}
											</div>

											<div className='mt-auto pt-4 border-t flex items-center justify-between'>
												<div className='flex items-center gap-2 text-muted-foreground'>
													<Users className='h-4 w-4' />
													<span className='text-sm font-medium'>
														{mentor.studentsCount || 0} ta o'quvchi
													</span>
												</div>
												<span className='text-sm font-bold text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300'>
													Profilga o'tish &rarr;
												</span>
											</div>
										</div>
									</div>
								</Link>
							</motion.div>
						))}
					</motion.div>
				)}
			</div>
		</section>
	)
}
