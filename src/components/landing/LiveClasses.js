'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import api from '@/lib/api'
import { useTranslation } from '@/lib/i18n'
// 🔥 Markazlashgan utilitalar
import { getInitials } from '@/lib/utils'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Star, Users } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const containerVariants = {
	hidden: { opacity: 0 },
	show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const cardVariants = {
	hidden: { opacity: 0, y: 15 },
	show: {
		opacity: 1,
		y: 0,
		transition: { type: 'spring', stiffness: 300, damping: 24 },
	},
}

export default function TopMentors() {
	const { t } = useTranslation()
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
				console.error('Mentorlarni yuklashda xatolik:', error)
			} finally {
				setLoading(false)
			}
		}
		fetchMentors()
	}, [])

	return (
		<section className='w-full py-20 md:py-32 bg-muted/20 border-y'>
			<div className='container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl'>
				{/* 🏷️ HEADER SECTION */}
				<div className='flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6'>
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						className='max-w-2xl'
					>
						<Badge
							variant='secondary'
							className='mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground shadow-none'
						>
							{t('landing.topMentors.badge') || 'Top Ustozlar'}
						</Badge>
						<h2 className='text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-foreground'>
							{t('landing.topMentors.title') ||
								'Platformaning yetakchi mentorlari'}
						</h2>
						<p className='text-muted-foreground text-base sm:text-lg'>
							{t('landing.topMentors.desc') ||
								"O'z yo'nalishining eng kuchli mutaxassislaridan ta'lim oling."}
						</p>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, x: 20 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
					>
						<Button
							variant='outline'
							className='gap-2 font-medium group'
							asChild
						>
							<Link href='/home/mentors'>
								{t('landing.topMentors.viewAll') || "Barchasini ko'rish"}
								<ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
							</Link>
						</Button>
					</motion.div>
				</div>

				{/* 🗂️ MAIN CONTENT */}
				{loading ? (
					// Skeleton Loader
					<div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
						{[1, 2, 3].map(item => (
							<div
								key={item}
								className='relative rounded-xl border bg-card flex flex-col overflow-hidden min-h-[350px]'
							>
								<Skeleton className='h-24 w-full rounded-none' />
								<div className='px-6 relative flex justify-between items-end -mt-10 mb-4'>
									<Skeleton className='h-20 w-20 rounded-full border-4 border-background' />
									<Skeleton className='h-6 w-12 rounded-md mb-2' />
								</div>
								<div className='px-6 pb-6 flex-1 flex flex-col'>
									<Skeleton className='h-6 w-3/4 mb-2' />
									<Skeleton className='h-4 w-1/2 mb-5' />
									<div className='flex flex-wrap gap-2 mb-6'>
										<Skeleton className='h-5 w-16 rounded-md' />
										<Skeleton className='h-5 w-20 rounded-md' />
									</div>
									<div className='mt-auto pt-4 border-t flex justify-between'>
										<Skeleton className='h-4 w-24' />
										<Skeleton className='h-4 w-20' />
									</div>
								</div>
							</div>
						))}
					</div>
				) : mentors.length === 0 ? (
					// Empty State
					<div className='text-center py-20 border border-dashed rounded-2xl bg-muted/10'>
						<p className='text-muted-foreground text-base font-medium'>
							{t('landing.topMentors.empty') || "Hozircha mentorlar yo'q"}
						</p>
					</div>
				) : (
					// Mentor Cards
					<motion.div
						variants={containerVariants}
						initial='hidden'
						whileInView='show'
						viewport={{ once: true, margin: '-50px' }}
						className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'
					>
						{mentors.slice(0, 3).map(mentor => (
							<motion.div
								key={mentor._id || mentor.id}
								variants={cardVariants}
								className='h-full'
							>
								<Link
									href={`/home/mentors/${mentor._id || mentor.id}`}
									className='block h-full group'
								>
									<div className='relative h-full rounded-xl border bg-card flex flex-col hover:border-primary/40 hover:shadow-md transition-all duration-300'>
										{/* Cover Photo */}
										<div className='h-24 w-full bg-muted border-b relative overflow-hidden group-hover:bg-muted/80 transition-colors'>
											<div className='absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-50' />
										</div>

										{/* Avatar & Rating */}
										<div className='px-6 relative flex justify-between items-end -mt-10 mb-4'>
											<Avatar className='h-20 w-20 border-4 border-background shadow-sm bg-muted shrink-0'>
												<AvatarFallback className='text-lg font-bold text-foreground'>
													{getInitials(mentor.firstName, mentor.lastName)}
												</AvatarFallback>
											</Avatar>

											<div className='flex items-center gap-1 bg-background border shadow-sm px-2 py-1 rounded-md mb-2 shrink-0'>
												<Star className='h-3.5 w-3.5 text-amber-500 fill-amber-500' />
												<span className='text-xs font-bold'>
													{mentor.rating > 0 ? mentor.rating : 'N/A'}
												</span>
											</div>
										</div>

										{/* Content */}
										<div className='px-6 pb-6 flex-1 flex flex-col'>
											<div className='flex items-center gap-1.5 mb-1'>
												<h3 className='font-bold text-lg text-foreground group-hover:text-primary transition-colors leading-tight'>
													{mentor.firstName} {mentor.lastName?.charAt(0)}.
												</h3>
												<CheckCircle className='h-4 w-4 text-blue-500 shrink-0' />
											</div>

											<p className='text-sm text-muted-foreground font-medium mb-4'>
												{mentor.specialty ||
													t('landing.topMentors.defaultSpecialty') ||
													'Mentor'}
											</p>

											{/* Skills */}
											<div className='flex flex-wrap gap-2 mb-6'>
												{(mentor.skills || [])
													.slice(0, 3)
													.map((skill, index) => (
														<Badge
															key={index}
															variant='secondary'
															className='font-normal text-[10px] uppercase shadow-none border-transparent'
														>
															{skill}
														</Badge>
													))}
											</div>

											{/* Footer Info */}
											<div className='mt-auto pt-4 border-t flex items-center justify-between'>
												<div className='flex items-center gap-1.5 text-muted-foreground'>
													<Users className='h-4 w-4' />
													<span className='text-xs font-bold'>
														{mentor.studentsCount || 0}{' '}
														{t('common.students') || "o'quvchilar"}
													</span>
												</div>
												<span className='text-xs font-bold text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300'>
													{t('landing.topMentors.viewProfile') || 'Profil'}{' '}
													&rarr;
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
