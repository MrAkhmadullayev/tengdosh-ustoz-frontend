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
import { Progress } from '@/components/ui/progress'
import {
	Award,
	BookOpen,
	Calendar,
	ChevronRight,
	Clock,
	Code,
	Layers,
	PlayCircle,
	Smartphone,
	TrendingUp,
} from 'lucide-react'
import Link from 'next/link'

export default function StudentDashboard() {
	return (
		<div className='space-y-6 max-w-6xl mx-auto pb-8'>
			{/* GREETING SECTION */}
			<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
				<div>
					<h1 className='text-2xl sm:text-3xl font-bold tracking-tight text-foreground'>
						Xush kelibsiz, Sadriddin! 👋
					</h1>
					<p className='text-muted-foreground mt-1 text-sm sm:text-base'>
						Bugun nimani o'rganishni rejalashtiryapsiz? Full-Stack va Mobil
						yo'nalishidagi bilimlaringizni oshiring.
					</p>
				</div>
				<Button className='shrink-0 gap-2'>
					<SearchIcon className='h-4 w-4' /> Yangi ustoz topish
				</Button>
			</div>

			{/* STATS OVERVIEW */}
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
				<Card className='border-muted shadow-sm'>
					<CardContent className='p-6 flex items-center gap-4'>
						<div className='bg-blue-500/10 p-3 rounded-full shrink-0'>
							<Clock className='h-6 w-6 text-blue-500' />
						</div>
						<div>
							<p className='text-sm font-medium text-muted-foreground'>
								O'rganilgan vaqt
							</p>
							<h3 className='text-2xl font-bold'>128 soat</h3>
						</div>
					</CardContent>
				</Card>

				<Card className='border-muted shadow-sm'>
					<CardContent className='p-6 flex items-center gap-4'>
						<div className='bg-green-500/10 p-3 rounded-full shrink-0'>
							<BookOpen className='h-6 w-6 text-green-500' />
						</div>
						<div>
							<p className='text-sm font-medium text-muted-foreground'>
								Faol darslar
							</p>
							<h3 className='text-2xl font-bold'>3 ta</h3>
						</div>
					</CardContent>
				</Card>

				<Card className='border-muted shadow-sm'>
					<CardContent className='p-6 flex items-center gap-4'>
						<div className='bg-purple-500/10 p-3 rounded-full shrink-0'>
							<TrendingUp className='h-6 w-6 text-purple-500' />
						</div>
						<div>
							<p className='text-sm font-medium text-muted-foreground'>
								Haftalik o'sish
							</p>
							<h3 className='text-2xl font-bold'>+15%</h3>
						</div>
					</CardContent>
				</Card>

				<Card className='border-muted shadow-sm relative overflow-hidden group cursor-pointer hover:border-yellow-500/50 transition-colors'>
					<div className='absolute -right-4 -top-4 bg-yellow-500/10 w-24 h-24 rounded-full group-hover:scale-110 transition-transform'></div>
					<CardContent className='p-6 flex items-center gap-4 relative z-10'>
						<div className='bg-yellow-500/20 p-3 rounded-full shrink-0'>
							<Award className='h-6 w-6 text-yellow-600' />
						</div>
						<div>
							<p className='text-sm font-medium text-muted-foreground'>
								PDP Reytingi
							</p>
							<h3 className='text-2xl font-bold'>Top 5%</h3>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* CHAP TOMON: KUTILAYOTGAN DARSLAR VA PROGRESS (2/3 QISM) */}
				<div className='lg:col-span-2 space-y-6'>
					{/* Keyingi Dars */}
					<Card className='border-primary/20 bg-primary/5 shadow-sm relative overflow-hidden'>
						<div className='absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20'></div>
						<CardHeader className='pb-2 relative z-10'>
							<div className='flex justify-between items-center'>
								<CardTitle className='text-lg flex items-center gap-2'>
									<Calendar className='h-5 w-5 text-primary' />
									Keyingi darsingiz
								</CardTitle>
								<Badge className='bg-red-500 hover:bg-red-600 animate-pulse text-white border-none shadow-sm'>
									15 daqiqadan so'ng
								</Badge>
							</div>
						</CardHeader>
						<CardContent className='relative z-10'>
							<div className='bg-background rounded-xl p-4 sm:p-5 border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5'>
								<div className='flex items-center gap-4'>
									<div className='bg-emerald-500/10 p-3.5 rounded-xl hidden sm:block border border-emerald-500/20'>
										<Smartphone className='h-7 w-7 text-emerald-600' />
									</div>
									<div>
										<h4 className='font-bold text-lg leading-tight mb-1.5'>
											Kotlin va Android SDK: Custom UI
										</h4>
										<p className='text-sm text-muted-foreground flex items-center gap-2 font-medium'>
											<Avatar className='h-5 w-5 border border-muted'>
												<AvatarFallback className='text-[9px] bg-primary/10 text-primary'>
													MB
												</AvatarFallback>
											</Avatar>
											Ustoz: Malika B. (Mobil Dasturlash)
										</p>
									</div>
								</div>
								<Button className='w-full sm:w-auto gap-2 shadow-sm'>
									<PlayCircle className='h-4.5 w-4.5' /> Darsga qo'shilish
								</Button>
							</div>
						</CardContent>
					</Card>

					{/* O'zlashtirish jarayoni */}
					<Card className='shadow-sm'>
						<CardHeader className='flex flex-row items-center justify-between pb-2'>
							<CardTitle className='text-lg'>Joriy kurslar jarayoni</CardTitle>
							<Link
								href='/student/courses'
								className='text-sm font-medium text-primary flex items-center hover:underline'
							>
								Barchasi <ChevronRight className='h-4 w-4' />
							</Link>
						</CardHeader>
						<CardContent className='space-y-6 pt-4'>
							<div className='space-y-2.5'>
								<div className='flex justify-between text-sm items-end'>
									<span className='font-semibold flex items-center gap-2'>
										<Code className='h-4 w-4 text-orange-500' />
										Advanced React, Next.js va TypeScript
									</span>
									<span className='text-muted-foreground font-medium'>85%</span>
								</div>
								<Progress value={85} className='h-2' />
								<p className='text-xs text-muted-foreground text-right'>
									Oxirgi qatnashgan dars: Kecha
								</p>
							</div>

							<div className='space-y-2.5'>
								<div className='flex justify-between text-sm items-end'>
									<span className='font-semibold flex items-center gap-2'>
										<Layers className='h-4 w-4 text-blue-500' />
										PostgreSQL va Node.js Arxitekturasi
									</span>
									<span className='text-muted-foreground font-medium'>60%</span>
								</div>
								<Progress value={60} className='h-2' />
								<p className='text-xs text-muted-foreground text-right'>
									Oxirgi qatnashgan dars: 3 kun oldin
								</p>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* O'NG TOMON: TAVSIYA ETILGAN USTOZLAR (1/3 QISM) */}
				<div className='lg:col-span-1 space-y-6'>
					<Card className='shadow-sm h-full flex flex-col'>
						<CardHeader className='pb-4 border-b mb-2'>
							<CardTitle className='text-lg'>Siz uchun tavsiyalar</CardTitle>
							<CardDescription>
								Qiziqishlaringizga asoslangan yangi yo'nalishlar.
							</CardDescription>
						</CardHeader>
						<CardContent className='flex-1 space-y-3'>
							{[
								{
									name: 'Sardor R.',
									skill: 'Swift, macOS dev',
									rating: '4.9',
									avatar: 'SR',
								},
								{
									name: 'Aziza K.',
									skill: 'BPM va Agile',
									rating: '4.8',
									avatar: 'AK',
								},
								{
									name: 'Javohir T.',
									skill: 'C++, Algoritmlar',
									rating: '5.0',
									avatar: 'JT',
								},
							].map((mentor, idx) => (
								<div
									key={idx}
									className='flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border cursor-pointer group'
								>
									<div className='flex items-center gap-3'>
										<Avatar className='h-10 w-10 border border-background shadow-sm group-hover:border-primary/20 transition-colors'>
											<AvatarFallback className='bg-primary/10 text-primary font-bold text-xs'>
												{mentor.avatar}
											</AvatarFallback>
										</Avatar>
										<div>
											<p className='font-bold text-sm leading-none mb-1.5'>
												{mentor.name}
											</p>
											<p className='text-xs text-muted-foreground font-medium'>
												{mentor.skill}
											</p>
										</div>
									</div>
									<Badge
										variant='secondary'
										className='bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-none font-bold shrink-0'
									>
										★ {mentor.rating}
									</Badge>
								</div>
							))}
						</CardContent>
						<CardFooter className='pt-2 mt-auto'>
							<Button
								variant='outline'
								className='w-full text-muted-foreground hover:text-foreground'
							>
								Barcha ustozlarni ko'rish
							</Button>
						</CardFooter>
					</Card>
				</div>
			</div>
		</div>
	)
}

// Qidiruv iconi
function SearchIcon(props) {
	return (
		<svg
			{...props}
			xmlns='http://www.w3.org/2000/svg'
			width='24'
			height='24'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
		>
			<circle cx='11' cy='11' r='8' />
			<path d='m21 21-4.3-4.3' />
		</svg>
	)
}
