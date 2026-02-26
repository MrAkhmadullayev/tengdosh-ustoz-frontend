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
import {
	AlertTriangle,
	CheckCircle2,
	GraduationCap,
	MoreVertical,
	ShieldAlert,
	TrendingUp,
	Users,
	Wallet,
	XCircle,
} from 'lucide-react'

export default function AdminDashboard() {
	return (
		<div className='space-y-6 max-w-7xl mx-auto pb-8'>
			{/* GREETING SECTION */}
			<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
				<div>
					<h1 className='text-2xl sm:text-3xl font-bold tracking-tight text-foreground'>
						Boshqaruv Markazi (Admin) 🛡️
					</h1>
					<p className='text-muted-foreground mt-1'>
						Platformaning joriy holati, moliya va xavfsizlik ko'rsatkichlari.
					</p>
				</div>
				<div className='flex gap-2'>
					<Button variant='outline' className='shrink-0'>
						Hisobotlarni yuklash
					</Button>
					<Button className='shrink-0 gap-2 bg-primary'>
						Tizim sozlamalari
					</Button>
				</div>
			</div>

			{/* STATISTIKA (TOP METRICS) */}
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
				<Card className='border-muted shadow-sm'>
					<CardContent className='p-6 flex items-center justify-between'>
						<div>
							<p className='text-sm font-medium text-muted-foreground mb-1'>
								Jami foydalanuvchilar
							</p>
							<h3 className='text-2xl font-bold'>12,450</h3>
							<p className='text-xs text-green-500 flex items-center mt-1 font-medium'>
								<TrendingUp className='h-3 w-3 mr-1' /> +12% o'tgan oydan
							</p>
						</div>
						<div className='bg-blue-500/10 p-3 rounded-xl shrink-0'>
							<Users className='h-6 w-6 text-blue-500' />
						</div>
					</CardContent>
				</Card>

				<Card className='border-muted shadow-sm'>
					<CardContent className='p-6 flex items-center justify-between'>
						<div>
							<p className='text-sm font-medium text-muted-foreground mb-1'>
								Faol Mentorlar
							</p>
							<h3 className='text-2xl font-bold'>342</h3>
							<p className='text-xs text-green-500 flex items-center mt-1 font-medium'>
								<TrendingUp className='h-3 w-3 mr-1' /> +8 ta yangi
							</p>
						</div>
						<div className='bg-purple-500/10 p-3 rounded-xl shrink-0'>
							<GraduationCap className='h-6 w-6 text-purple-500' />
						</div>
					</CardContent>
				</Card>

				<Card className='border-muted shadow-sm'>
					<CardContent className='p-6 flex items-center justify-between'>
						<div>
							<p className='text-sm font-medium text-muted-foreground mb-1'>
								Umumiy aylanma (UZS)
							</p>
							<h3 className='text-2xl font-bold'>45.2M</h3>
							<p className='text-xs text-muted-foreground mt-1'>
								Joriy oy uchun
							</p>
						</div>
						<div className='bg-green-500/10 p-3 rounded-xl shrink-0'>
							<Wallet className='h-6 w-6 text-green-500' />
						</div>
					</CardContent>
				</Card>

				{/* DIQQAT TALAB QILUVCHI KARTA */}
				<Card className='border-red-500/30 bg-red-500/5 shadow-sm relative overflow-hidden group cursor-pointer hover:border-red-500/50 transition-colors'>
					<CardContent className='p-6 flex items-center justify-between relative z-10'>
						<div>
							<p className='text-sm font-bold text-red-600 dark:text-red-400 mb-1'>
								Yangi shikoyatlar
							</p>
							<h3 className='text-2xl font-bold text-red-600 dark:text-red-400'>
								5 ta
							</h3>
							<p className='text-xs text-red-500 mt-1 font-medium'>
								Shoshilinch ko'rib chiqish kerak
							</p>
						</div>
						<div className='bg-red-500/20 p-3 rounded-xl shrink-0 animate-pulse'>
							<ShieldAlert className='h-6 w-6 text-red-600' />
						</div>
					</CardContent>
				</Card>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* CHAP TOMON: MENTORLIKKA ARIZALAR (2/3 QISM) */}
				<div className='lg:col-span-2 space-y-6'>
					<Card className='shadow-sm'>
						<CardHeader className='pb-3 border-b mb-4 flex flex-row items-center justify-between'>
							<div>
								<CardTitle className='text-lg'>Mentorlikka arizalar</CardTitle>
								<CardDescription>
									Tasdiqlashni kutayotgan foydalanuvchilar
								</CardDescription>
							</div>
							<Badge
								variant='secondary'
								className='bg-yellow-500/10 text-yellow-600 border-none'
							>
								3 ta kutmoqda
							</Badge>
						</CardHeader>
						<CardContent className='space-y-4'>
							{[
								{
									name: 'Alisher V.',
									course: '3-kurs',
									specialty: 'Node.js, MongoDB',
									gpa: '4.8',
								},
								{
									name: 'Zuhra M.',
									course: '2-kurs',
									specialty: 'UI/UX Dizayn',
									gpa: '4.5',
								},
								{
									name: 'Sardor R.',
									course: '4-kurs',
									specialty: 'Java, Spring Boot',
									gpa: '4.9',
								},
							].map((applicant, idx) => (
								<div
									key={idx}
									className='flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-xl hover:bg-muted/30 transition-colors gap-4'
								>
									<div className='flex gap-4 items-center'>
										<Avatar className='h-12 w-12 border shadow-sm'>
											<AvatarFallback className='bg-primary/10 text-primary font-bold'>
												{applicant.name.split(' ')[0][0]}
											</AvatarFallback>
										</Avatar>
										<div>
											<h4 className='font-bold text-base leading-tight flex items-center gap-2'>
												{applicant.name}{' '}
												<Badge variant='outline' className='text-[10px] h-5'>
													{applicant.course}
												</Badge>
											</h4>
											<p className='text-sm text-muted-foreground mt-1'>
												Yo'nalish:{' '}
												<span className='font-medium text-foreground'>
													{applicant.specialty}
												</span>
											</p>
											<p className='text-xs text-muted-foreground mt-0.5'>
												O'zlashtirish (GPA):{' '}
												<strong className='text-primary'>
													{applicant.gpa}
												</strong>
											</p>
										</div>
									</div>
									<div className='flex w-full sm:w-auto gap-2 mt-2 sm:mt-0'>
										<Button
											size='sm'
											variant='outline'
											className='flex-1 sm:flex-none h-9 text-red-500 hover:text-red-600 hover:bg-red-50'
										>
											<XCircle className='h-4 w-4 mr-1.5' /> Rad etish
										</Button>
										<Button
											size='sm'
											className='flex-1 sm:flex-none h-9 bg-green-500 hover:bg-green-600 text-white'
										>
											<CheckCircle2 className='h-4 w-4 mr-1.5' /> Tasdiqlash
										</Button>
									</div>
								</div>
							))}
						</CardContent>
					</Card>
				</div>

				{/* O'NG TOMON: SHIKOYATLAR VA OGOHLANTIRISHLAR (1/3 QISM) */}
				<div className='lg:col-span-1 space-y-6'>
					<Card className='shadow-sm h-full flex flex-col border-red-500/20'>
						<CardHeader className='bg-red-500/5 pb-4 border-b border-red-500/10'>
							<CardTitle className='text-lg flex items-center gap-2 text-red-600 dark:text-red-400'>
								<AlertTriangle className='h-5 w-5' /> So'nggi shikoyatlar
							</CardTitle>
						</CardHeader>
						<CardContent className='flex-1 space-y-4 pt-4'>
							{/* Shikoyat 1 */}
							<div className='border border-red-500/20 bg-red-500/5 p-3 rounded-xl space-y-3 relative'>
								<Button
									variant='ghost'
									size='icon'
									className='absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-foreground'
								>
									<MoreVertical className='h-4 w-4' />
								</Button>
								<div className='pr-6'>
									<p className='font-bold text-sm text-foreground mb-1'>
										To'lov muammosi
									</p>
									<p className='text-xs text-muted-foreground leading-relaxed'>
										"Dars bekor qilindi, lekin pulim hisobimga qaytmadi. Iltimos
										yordam bering."
									</p>
								</div>
								<div className='flex justify-between items-center pt-2 border-t border-red-500/10'>
									<p className='text-[10px] font-medium text-muted-foreground'>
										ID: #4582 • O'quvchi
									</p>
									<Button
										size='sm'
										variant='link'
										className='h-6 p-0 text-red-600'
									>
										Ko'rish &rarr;
									</Button>
								</div>
							</div>

							{/* Shikoyat 2 */}
							<div className='border p-3 rounded-xl space-y-3 relative'>
								<Button
									variant='ghost'
									size='icon'
									className='absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-foreground'
								>
									<MoreVertical className='h-4 w-4' />
								</Button>
								<div className='pr-6'>
									<p className='font-bold text-sm text-foreground mb-1'>
										Mentor ustidan shikoyat
									</p>
									<p className='text-xs text-muted-foreground leading-relaxed'>
										"Ustoz darsga 20 daqiqa kechikib kirdi va mavzuni chala
										tushuntirdi."
									</p>
								</div>
								<div className='flex justify-between items-center pt-2 border-t'>
									<p className='text-[10px] font-medium text-muted-foreground'>
										ID: #4581 • Mentor: Bekzod O.
									</p>
									<Button
										size='sm'
										variant='link'
										className='h-6 p-0 text-primary'
									>
										Ko'rish &rarr;
									</Button>
								</div>
							</div>
						</CardContent>
						<CardFooter className='pt-0 mt-auto'>
							<Button
								variant='outline'
								className='w-full border-red-500/20 hover:bg-red-500/5 text-red-600'
							>
								Barcha shikoyatlarni ochish
							</Button>
						</CardFooter>
					</Card>
				</div>
			</div>
		</div>
	)
}
