'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	Bell,
	BookOpen,
	CheckCircle2,
	Star,
	Users,
	Video,
	Wallet,
	XCircle,
} from 'lucide-react'

export default function MentorDashboard() {
	return (
		<div className='space-y-6 max-w-6xl mx-auto pb-8'>
			<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
				<div>
					<h1 className='text-2xl sm:text-3xl font-bold tracking-tight text-foreground'>
						Xush kelibsiz, Ustoz! 🚀
					</h1>
					<p className='text-muted-foreground mt-1'>
						Bugun yana kimlargadir yangi bilimlarni ulashish vaqti keldi.
					</p>
				</div>
				<Button className='shrink-0 gap-2 bg-primary'>
					<Video className='h-4 w-4' /> Jonli darsni boshlash
				</Button>
			</div>

			{/* STATISTIKA */}
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
				<Card className='border-muted shadow-sm'>
					<CardContent className='p-6 flex items-center gap-4'>
						<div className='bg-green-500/10 p-3 rounded-full shrink-0'>
							<Wallet className='h-6 w-6 text-green-500' />
						</div>
						<div>
							<p className='text-sm font-medium text-muted-foreground'>
								Joriy oydagi daromad
							</p>
							<h3 className='text-2xl font-bold'>1,250,000 UZS</h3>
						</div>
					</CardContent>
				</Card>

				<Card className='border-muted shadow-sm'>
					<CardContent className='p-6 flex items-center gap-4'>
						<div className='bg-blue-500/10 p-3 rounded-full shrink-0'>
							<Users className='h-6 w-6 text-blue-500' />
						</div>
						<div>
							<p className='text-sm font-medium text-muted-foreground'>
								Faol o'quvchilar
							</p>
							<h3 className='text-2xl font-bold'>12 ta</h3>
						</div>
					</CardContent>
				</Card>

				<Card className='border-muted shadow-sm'>
					<CardContent className='p-6 flex items-center gap-4'>
						<div className='bg-yellow-500/10 p-3 rounded-full shrink-0'>
							<Star className='h-6 w-6 text-yellow-600' />
						</div>
						<div>
							<p className='text-sm font-medium text-muted-foreground'>
								O'rtacha reyting
							</p>
							<h3 className='text-2xl font-bold'>4.9 / 5.0</h3>
						</div>
					</CardContent>
				</Card>

				<Card className='border-muted shadow-sm'>
					<CardContent className='p-6 flex items-center gap-4'>
						<div className='bg-purple-500/10 p-3 rounded-full shrink-0'>
							<BookOpen className='h-6 w-6 text-purple-500' />
						</div>
						<div>
							<p className='text-sm font-medium text-muted-foreground'>
								O'tilgan darslar
							</p>
							<h3 className='text-2xl font-bold'>48 soat</h3>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* CHAP TOMON: BUGUNGI DARSLAR (2/3 QISM) */}
				<div className='lg:col-span-2 space-y-6'>
					<Card className='shadow-sm'>
						<CardHeader className='pb-3 border-b mb-4'>
							<div className='flex justify-between items-center'>
								<CardTitle className='text-lg'>
									Siz o'tadigan darslar (Bugun)
								</CardTitle>
								<Badge variant='outline'>Jami: 2 ta</Badge>
							</div>
						</CardHeader>
						<CardContent className='space-y-4'>
							{/* Dars 1 */}
							<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-xl hover:border-primary/50 transition-colors gap-4'>
								<div className='flex gap-4 items-center w-full sm:w-auto'>
									<div className='bg-muted p-3 rounded-lg text-center min-w-[70px]'>
										<p className='text-sm text-muted-foreground'>Vaqti</p>
										<p className='font-bold text-foreground'>18:00</p>
									</div>
									<div>
										<h4 className='font-bold text-lg'>
											Full-Stack arxitekturasi
										</h4>
										<p className='text-sm text-muted-foreground flex items-center gap-2 mt-1'>
											<Users className='h-4 w-4' /> Guruhli dars (8 kishi)
										</p>
									</div>
								</div>
								<Button className='w-full sm:w-auto gap-2'>
									<Video className='h-4 w-4' /> Xonaga kirish
								</Button>
							</div>

							{/* Dars 2 */}
							<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-xl bg-muted/30 gap-4'>
								<div className='flex gap-4 items-center w-full sm:w-auto'>
									<div className='bg-background border p-3 rounded-lg text-center min-w-[70px]'>
										<p className='text-sm text-muted-foreground'>Vaqti</p>
										<p className='font-bold text-foreground'>20:30</p>
									</div>
									<div>
										<h4 className='font-bold text-lg'>React.js Individual</h4>
										<p className='text-sm text-muted-foreground flex items-center gap-2 mt-1'>
											<Avatar className='h-4 w-4'>
												<AvatarFallback className='text-[8px]'>
													JA
												</AvatarFallback>
											</Avatar>{' '}
											O'quvchi: Jasur A.
										</p>
									</div>
								</div>
								<Button variant='secondary' className='w-full sm:w-auto gap-2'>
									Tayyorlanish
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* O'NG TOMON: YANGI SO'ROVLAR (1/3 QISM) */}
				<div className='lg:col-span-1 space-y-6'>
					<Card className='shadow-sm h-full flex flex-col border-primary/20'>
						<CardHeader className='bg-primary/5 pb-4 border-b'>
							<CardTitle className='text-lg flex items-center gap-2'>
								<Bell className='h-5 w-5 text-primary' /> Yangi so'rovlar
							</CardTitle>
						</CardHeader>
						<CardContent className='flex-1 space-y-4 pt-4'>
							<div className='border p-3 rounded-xl space-y-3'>
								<div className='flex justify-between items-start'>
									<div className='flex gap-2 items-center'>
										<Avatar className='h-8 w-8'>
											<AvatarFallback className='bg-primary/10 text-primary text-xs'>
												MA
											</AvatarFallback>
										</Avatar>
										<div>
											<p className='font-bold text-sm'>Madina A.</p>
											<p className='text-xs text-muted-foreground'>
												2-kurs, Frontend
											</p>
										</div>
									</div>
									<Badge variant='secondary' className='text-[10px]'>
										1 soat oldin
									</Badge>
								</div>
								<p className='text-xs text-muted-foreground bg-muted p-2 rounded-md'>
									"Assalomu alaykum, menga API bilan ishlash bo'yicha yordam
									kerak edi."
								</p>
								<div className='flex flex-wrap sm:flex-nowrap gap-2'>
									<Button
										size='sm'
										className='flex-1 h-8 text-[11px] sm:text-xs bg-green-500 hover:bg-green-600 px-2'
									>
										<CheckCircle2 className='h-3 w-3 mr-1 shrink-0' /> Qabul
										qilish
									</Button>
									<Button
										size='sm'
										variant='outline'
										className='flex-1 h-8 text-[11px] sm:text-xs text-red-500 hover:text-red-600 px-2'
									>
										<XCircle className='h-3 w-3 mr-1 shrink-0' /> Rad etish
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}
