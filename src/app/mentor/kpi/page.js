'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	ArrowUpRight,
	Award,
	BarChart3,
	BookOpen,
	Calendar,
	MessageCircle,
	Star,
	TrendingDown,
	TrendingUp,
	Users,
} from 'lucide-react'

import { cn } from '@/lib/utils'
export default function MentorKPIDashboard() {
	return (
		<div className='max-w-7xl mx-auto space-y-8 pb-12'>
			{/* Header */}
			<div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>
						Mening KPI Ko'rsatkichlarim
					</h1>
					<p className='text-muted-foreground mt-1'>
						Faoliyatingiz samaradorligi va o'quvchilar tomonidan berilgan
						baholar.
					</p>
				</div>
				<Button className='rounded-xl gap-2 h-11 px-6 shadow-lg shadow-primary/20'>
					<Calendar className='w-4 h-4' /> Hisobotni yuklash
				</Button>
			</div>

			{/* Top Stats */}
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
				<Card className='rounded-3xl border-muted/60 shadow-sm hover:shadow-md transition-all'>
					<CardContent className='p-6'>
						<div className='flex justify-between items-start'>
							<div className='space-y-2'>
								<p className='text-sm font-medium text-muted-foreground'>
									O'rtacha Reyting
								</p>
								<div className='flex items-center gap-2'>
									<h2 className='text-3xl font-bold'>4.9</h2>
									<Badge className='bg-green-500 text-white border-0'>
										+0.2
									</Badge>
								</div>
							</div>
							<div className='p-3 bg-yellow-500/10 rounded-2xl'>
								<Star className='w-6 h-6 text-yellow-500 fill-current' />
							</div>
						</div>
						<div className='mt-4 flex items-center text-xs text-muted-foreground gap-1'>
							<TrendingUp className='w-3 h-3 text-green-500' />
							<span className='text-green-500 font-bold'>4%</span> o'tgan oydan
							yuqori
						</div>
					</CardContent>
				</Card>

				<Card className='rounded-3xl border-muted/60 shadow-sm hover:shadow-md transition-all'>
					<CardContent className='p-6'>
						<div className='flex justify-between items-start'>
							<div className='space-y-2'>
								<p className='text-sm font-medium text-muted-foreground'>
									Jami O'quvchilar
								</p>
								<div className='flex items-center gap-2'>
									<h2 className='text-3xl font-bold'>1,240</h2>
									<Badge className='bg-primary/10 text-primary border-0'>
										+12
									</Badge>
								</div>
							</div>
							<div className='p-3 bg-primary/10 rounded-2xl'>
								<Users className='w-6 h-6 text-primary' />
							</div>
						</div>
						<div className='mt-4 flex items-center text-xs text-muted-foreground gap-1'>
							<TrendingUp className='w-3 h-3 text-green-500' />
							<span className='text-green-500 font-bold'>8%</span> o'sish
							dinamikasi
						</div>
					</CardContent>
				</Card>

				<Card className='rounded-3xl border-muted/60 shadow-sm hover:shadow-md transition-all'>
					<CardContent className='p-6'>
						<div className='flex justify-between items-start'>
							<div className='space-y-2'>
								<p className='text-sm font-medium text-muted-foreground'>
									O'tilgan Darslar
								</p>
								<div className='flex items-center gap-2'>
									<h2 className='text-3xl font-bold'>48</h2>
									<Badge className='bg-blue-500/10 text-blue-500 border-0'>
										+4
									</Badge>
								</div>
							</div>
							<div className='p-3 bg-blue-500/10 rounded-2xl'>
								<BookOpen className='w-6 h-6 text-blue-500' />
							</div>
						</div>
						<div className='mt-4 flex items-center text-xs text-muted-foreground gap-1'>
							<TrendingUp className='w-3 h-3 text-green-500' />
							<span className='text-green-500 font-bold'>12%</span> faollik
							oshgan
						</div>
					</CardContent>
				</Card>

				<Card className='rounded-3xl border-muted/60 shadow-sm hover:shadow-md transition-all'>
					<CardContent className='p-6'>
						<div className='flex justify-between items-start'>
							<div className='space-y-2'>
								<p className='text-sm font-medium text-muted-foreground'>
									Umumiy Daromad
								</p>
								<div className='flex items-center gap-2'>
									<h2 className='text-2xl font-bold'>12.4M</h2>
									<span className='text-xs text-muted-foreground'>UZS</span>
								</div>
							</div>
							<div className='p-3 bg-green-500/10 rounded-2xl'>
								<TrendingUp className='w-6 h-6 text-green-500' />
							</div>
						</div>
						<div className='mt-4 flex items-center text-xs text-muted-foreground gap-1'>
							<TrendingDown className='w-3 h-3 text-red-500' />
							<span className='text-red-500 font-bold'>2%</span> xarajatlar
							oshgan
						</div>
					</CardContent>
				</Card>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
				{/* Course Performance */}
				<Card className='lg:col-span-2 rounded-3xl border-muted/60 shadow-sm'>
					<CardHeader className='p-6 border-b border-muted/20'>
						<div className='flex justify-between items-center'>
							<CardTitle className='text-xl flex items-center gap-2'>
								<TrendingUp className='w-5 h-5 text-primary' /> Kurslar
								Samardorligi
							</CardTitle>
							<Button
								variant='ghost'
								size='sm'
								className='text-primary font-bold'
							>
								Barchasi
							</Button>
						</div>
					</CardHeader>
					<CardContent className='p-6'>
						<div className='space-y-6'>
							{[
								{
									name: 'React Advanced',
									students: 450,
									rating: 4.9,
									progress: 85,
									color: 'bg-primary',
								},
								{
									name: 'Next.js 14 Masterclass',
									students: 320,
									rating: 4.8,
									progress: 65,
									color: 'bg-blue-500',
								},
								{
									name: 'Node.js Backend Essentials',
									students: 280,
									rating: 4.7,
									progress: 40,
									color: 'bg-green-500',
								},
							].map((course, i) => (
								<div key={i} className='space-y-3'>
									<div className='flex justify-between items-end'>
										<div>
											<h4 className='font-bold'>{course.name}</h4>
											<p className='text-xs text-muted-foreground'>
												{course.students} o'quvchi • {course.rating} ★
											</p>
										</div>
										<span className='text-xs font-bold'>
											{course.progress}% tugatish
										</span>
									</div>
									<div className='h-2 w-full bg-muted rounded-full overflow-hidden'>
										<div
											className={cn(
												'h-full transition-all duration-1000',
												course.color,
											)}
											style={{ width: `${course.progress}%` }}
										/>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Recent Feedback */}
				<Card className='rounded-3xl border-muted/60 shadow-sm overflow-hidden'>
					<CardHeader className='p-6 border-b border-muted/20 bg-muted/5'>
						<CardTitle className='text-xl flex items-center gap-2'>
							<MessageCircle className='w-5 h-5 text-orange-500' /> So'nggi
							Sharhlar
						</CardTitle>
					</CardHeader>
					<div className='divide-y divide-muted/10'>
						{[
							{
								user: 'Jasur A.',
								comment: "Juda zo'r tushuntirildi, rahmat!",
								rating: 5,
								time: '2 soat oldin',
							},
							{
								user: 'Madina K.',
								comment: "Amaliy misollar ko'p bo'lsa yaxshi edi.",
								rating: 4,
								time: 'Bugun',
							},
							{
								user: 'Olimjon G.',
								comment: 'Eng yaxshi mentor!',
								rating: 5,
								time: 'Kecha',
							},
						].map((feedback, i) => (
							<div
								key={i}
								className='p-5 space-y-2 hover:bg-muted/5 transition-colors'
							>
								<div className='flex justify-between items-start'>
									<h4 className='font-bold text-sm'>{feedback.user}</h4>
									<div className='flex items-center gap-0.5'>
										{Array.from({ length: 5 }).map((_, star) => (
											<Star
												key={star}
												className={cn(
													'w-3 h-3',
													star < feedback.rating
														? 'text-yellow-500 fill-current'
														: 'text-muted/40',
												)}
											/>
										))}
									</div>
								</div>
								<p className='text-xs text-muted-foreground leading-relaxed italic'>
									"{feedback.comment}"
								</p>
								<p className='text-[10px] text-muted-foreground/60 text-right'>
									{feedback.time}
								</p>
							</div>
						))}
					</div>
					<div className='p-4 border-t border-muted/20 bg-muted/5'>
						<Button
							variant='outline'
							className='w-full rounded-xl text-xs font-bold'
						>
							Barcha sharhlar
						</Button>
					</div>
				</Card>
			</div>

			{/* Action Cards */}
			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				<Card className='rounded-3xl border-0 bg-primary text-white overflow-hidden relative shadow-lg shadow-primary/20'>
					<CardContent className='p-8 relative z-10 space-y-4'>
						<div className='p-3 bg-white/20 rounded-2xl w-fit'>
							<Award className='w-8 h-8' />
						</div>
						<h3 className='text-2xl font-bold'>TOP-10 Mentorlar</h3>
						<p className='text-white/80 max-w-xs'>
							Siz platformadagi eng yaxshi mentorlar reytingida 4-o'rindasiz.
							O'sishda davom eting!
						</p>
						<Button className='bg-white text-primary hover:bg-white/90 rounded-xl font-bold'>
							Reytingni ko'rish
						</Button>
					</CardContent>
					<ArrowUpRight className='absolute -top-12 -right-12 w-64 h-64 text-white/5 rotate-12' />
				</Card>

				<Card className='rounded-3xl border-0 bg-slate-900 text-white overflow-hidden relative shadow-lg shadow-slate-900/20'>
					<CardContent className='p-8 relative z-10 space-y-4'>
						<div className='p-3 bg-white/10 rounded-2xl w-fit text-blue-400'>
							<TrendingUp className='w-8 h-8' />
						</div>
						<h3 className='text-2xl font-bold'>Kelgusi Maqsadlar</h3>
						<p className='text-white/60 max-w-xs'>
							O'quvchilar sonini 1,500 taga yetkazish uchun yana 260 ta yangi
							obunachi kerak.
						</p>
						<Button className='bg-primary text-white hover:bg-primary/90 border-0 rounded-xl font-bold'>
							Darslarni rejalashtirish
						</Button>
					</CardContent>
					<BarChart3 className='absolute -bottom-12 -right-12 w-64 h-64 text-white/5 -rotate-12' />
				</Card>
			</div>
		</div>
	)
}
