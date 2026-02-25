import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, Clock, PlayCircle, Users } from 'lucide-react'
import Link from 'next/link'

// Mock Data
const LIVE_CLASSES = [
	{
		id: 1,
		title: 'React Hooks: useEffect ni mukammal tushunish',
		mentor: 'Sardor R.',
		avatar: 'SR',
		category: 'Frontend',
		viewers: 124,
		status: 'live',
		time: 'Hozir',
	},
	{
		id: 2,
		title: "PostgreSQL arxitekturasi va ma'lumotlar bazasini loyihalash",
		mentor: 'Bekzod O.',
		avatar: 'BO',
		category: 'Backend',
		viewers: 85,
		status: 'live',
		time: 'Hozir',
	},
	{
		id: 3,
		title: "Figma'da Design System qurish sirlari",
		mentor: 'Diyora S.',
		avatar: 'DS',
		category: 'Dizayn',
		viewers: 210,
		status: 'live',
		time: 'Hozir',
	},
]

export default function LiveClasses() {
	return (
		<section className='w-full py-16 bg-secondary/10 border-y'>
			<div className='container mx-auto px-4 md:px-8 max-w-7xl'>
				<div className='flex flex-col md:flex-row justify-between items-end mb-10 gap-4'>
					<div>
						<h2 className='text-3xl font-extrabold tracking-tight mb-2'>
							Jonli darslar va Mentorlar
						</h2>
						<p className='text-muted-foreground'>
							Hozirda 12 ta jonli dars ketmoqda, sizga keraklisiga qo'shiling.
						</p>
					</div>
					<Link href='/home/live-lessons'>
						<Button variant='outline' className='gap-2 font-medium'>
							Barchasini ko'rish <ArrowRight className='h-4 w-4' />
						</Button>
					</Link>
				</div>

				{/* 3 ta dars kartasi */}
				<div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
					{LIVE_CLASSES.slice(0, 3).map(cls => (
						<Link
							key={cls.id}
							href={`/home/live-lessons/${cls.id}`}
							className='group'
						>
							<div className='rounded-2xl border bg-background flex flex-col hover:border-primary/40 hover:shadow-md transition-all h-full'>
								{/* Kartaning video muqovasi */}
								<div className='h-48 w-full bg-slate-900 rounded-t-2xl relative flex items-center justify-center overflow-hidden'>
									{/* Hover effects */}
									<div className='absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-0'></div>
									<PlayCircle className='h-14 w-14 text-white/80 drop-shadow-md group-hover:scale-110 transition-transform z-10' />

									{/* Status Badge */}
									<div className='absolute top-3 left-3 z-10'>
										<Badge
											variant='destructive'
											className='flex items-center gap-1.5 px-2.5 py-1 shadow-sm'
										>
											<span className='relative flex h-2 w-2'>
												<span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75'></span>
												<span className='relative inline-flex rounded-full h-2 w-2 bg-white'></span>
											</span>
											JONLI
										</Badge>
									</div>

									{/* Tomoshabinlar soni */}
									<div className='absolute bottom-3 left-3 z-10 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-2 py-1.5 rounded-md flex items-center gap-1.5 shadow-sm'>
										<Users className='h-3.5 w-3.5' />
										{cls.viewers} kuzatmoqda
									</div>
								</div>

								{/* Karta tanasi */}
								<div className='p-6 flex-1 flex flex-col bg-background rounded-b-2xl'>
									<div className='flex items-start justify-between gap-2 mb-3'>
										<Badge
											variant='secondary'
											className='bg-primary/5 text-primary hover:bg-primary/10 border-none font-medium'
										>
											{cls.category}
										</Badge>
										<div className='text-xs font-medium text-muted-foreground flex items-center gap-1'>
											<Clock className='h-3.5 w-3.5' /> {cls.time}
										</div>
									</div>

									<h3 className='font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors mb-4'>
										{cls.title}
									</h3>

									<div className='mt-auto pt-4 border-t flex items-center justify-between'>
										<div className='flex items-center gap-2.5'>
											<Avatar className='h-8 w-8 border shadow-sm'>
												<AvatarFallback className='text-xs font-bold text-primary bg-primary/10'>
													{cls.avatar}
												</AvatarFallback>
											</Avatar>
											<span className='text-sm font-medium text-foreground'>
												{cls.mentor}
											</span>
										</div>
										<span className='text-sm font-semibold text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all'>
											Qo'shilish &rarr;
										</span>
									</div>
								</div>
							</div>
						</Link>
					))}
				</div>
			</div>
		</section>
	)
}
