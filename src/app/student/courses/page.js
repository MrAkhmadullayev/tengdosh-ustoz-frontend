'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import {
	ArrowRight,
	Calendar,
	CheckCircle2,
	Clock,
	PlayCircle,
	PlusCircle,
	Search,
	Users,
	Video,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const MOCK_COURSES = [
	{
		id: 1,
		title: 'React Advanced: Performance Optimization',
		mentor: 'Jahongir Taylokov',
		date: '2024-02-26',
		time: '10:00',
		status: 'live',
		type: 'online',
		attendees: 12,
		image:
			'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60',
	},
	{
		id: 2,
		title: 'Next.js 14 Web Dev',
		mentor: 'Akmal Turgun',
		date: '2024-02-27',
		time: '14:30',
		status: 'upcoming',
		type: 'online',
		attendees: 45,
		image:
			'https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=800&auto=format&fit=crop&q=60',
	},
	{
		id: 3,
		title: 'UI/UX Design Fundamentals',
		mentor: 'Madina Akramova',
		date: '2024-02-25',
		time: '11:00',
		status: 'completed',
		type: 'offline',
		attendees: null,
		image:
			'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=60',
	},
	{
		id: 4,
		title: 'Mobile App with Flutter',
		mentor: 'Rustam Qosimov',
		date: '2024-03-01',
		time: '16:00',
		status: 'upcoming',
		type: 'hybrid',
		attendees: 30,
		image:
			'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=60',
	},
]

export default function StudentCoursesPage() {
	const router = useRouter()
	const [searchQuery, setSearchQuery] = useState('')
	const [applicationModalOpen, setApplicationModalOpen] = useState(false)
	const [selectedCourse, setSelectedCourse] = useState(null)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isSuccess, setIsSuccess] = useState(false)

	const handleOpenApplication = course => {
		setSelectedCourse(course)
		setApplicationModalOpen(true)
		setIsSuccess(false)
	}

	const handleApply = () => {
		setIsSubmitting(true)
		// Simulyatsiya
		setTimeout(() => {
			setIsSubmitting(false)
			setIsSuccess(true)
			setTimeout(() => {
				setApplicationModalOpen(false)
			}, 2000)
		}, 1500)
	}

	const filteredCourses = status =>
		MOCK_COURSES.filter(
			c =>
				c.status === status &&
				(c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
					c.mentor.toLowerCase().includes(searchQuery.toLowerCase())),
		)

	const CourseCard = ({ course }) => (
		<Card className='group overflow-hidden rounded-3xl border-muted/60 shadow-sm hover:shadow-xl transition-all duration-300 bg-background/50 backdrop-blur-sm'>
			<CardContent className='p-0 flex flex-col sm:flex-row'>
				{/* Image Section */}
				<div className='relative w-full sm:w-64 h-48 sm:h-auto overflow-hidden'>
					<img
						src={course.image}
						alt={course.title}
						className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
					/>
					<div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
					<div className='absolute bottom-3 left-3'>
						<Badge
							className={cn(
								'border-0 font-bold',
								course.type === 'online'
									? 'bg-blue-500 text-white'
									: course.type === 'offline'
										? 'bg-orange-500 text-white'
										: 'bg-purple-500 text-white',
							)}
						>
							{course.type === 'online'
								? 'Onlayn'
								: course.type === 'offline'
									? 'Offlayn'
									: 'Gibrid'}
						</Badge>
					</div>
				</div>

				{/* Content Section */}
				<div className='flex-1 p-6 flex flex-col justify-between gap-4'>
					<div className='space-y-3'>
						<div className='flex justify-between items-start gap-4'>
							<h3 className='text-xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2'>
								{course.title}
							</h3>
							{course.status === 'live' && (
								<Badge className='bg-red-500 hover:bg-red-600 animate-pulse border-0'>
									LIVE
								</Badge>
							)}
						</div>

						<div className='flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-muted-foreground'>
							<span className='flex items-center gap-1.5 font-medium'>
								<Calendar className='w-4 h-4 text-primary' /> {course.date}
							</span>
							<span className='flex items-center gap-1.5 font-medium'>
								<Clock className='w-4 h-4 text-primary' /> {course.time}
							</span>
							<span className='flex items-center gap-1.5 font-medium'>
								<Users className='w-4 h-4 text-primary' /> {course.mentor}
							</span>
						</div>
					</div>

					<div className='flex items-center justify-between pt-2 border-t border-muted/20'>
						{course.status === 'live' ? (
							<Button
								className='rounded-xl gap-2 font-bold px-6 bg-primary shadow-lg shadow-primary/20 h-11'
								onClick={() =>
									router.push(`/student/courses/${course.id}/watch`)
								}
							>
								<PlayCircle className='w-5 h-5' /> Darsga qo'shilish
							</Button>
						) : course.status === 'upcoming' ? (
							<div className='flex gap-2 w-full'>
								<Button
									variant='outline'
									className='flex-1 rounded-xl gap-2 font-bold h-11 border-primary/20 text-primary hover:bg-primary/5'
									onClick={() => handleOpenApplication(course)}
								>
									<PlusCircle className='w-5 h-5' /> Ariza qoldirish
								</Button>
								<Button
									variant='ghost'
									className='rounded-xl font-bold h-11 group/btn'
								>
									Batafsil{' '}
									<ArrowRight className='w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform' />
								</Button>
							</div>
						) : (
							<Button
								variant='secondary'
								className='rounded-xl gap-2 font-bold px-6 h-11'
								onClick={() =>
									router.push(`/student/courses/${course.id}/watch`)
								}
							>
								<PlayCircle className='w-5 h-5' /> Videoni ko'rish
							</Button>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	)

	return (
		<div className='max-w-5xl mx-auto space-y-8 pb-12 transition-all duration-500'>
			{/* Header */}
			<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6'>
				<div className='space-y-1'>
					<h1 className='text-3xl font-bold tracking-tight'>
						Darslar va Kurslar
					</h1>
					<p className='text-muted-foreground'>
						Platformadagi mavjud darslarni ko'ring va bilimingizni oshiring.
					</p>
				</div>
				<div className='relative w-full sm:w-80'>
					<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
					<Input
						placeholder='Dars yoki mentor...'
						className='pl-10 h-11 bg-muted/20 border-transparent focus-visible:ring-primary/20 rounded-2xl'
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
					/>
				</div>
			</div>

			<Tabs defaultValue='live' className='w-full space-y-8'>
				<TabsList className='bg-muted/50 p-1.5 rounded-2xl h-14 w-full sm:w-auto flex justify-start gap-2 shadow-inner border border-muted/40'>
					<TabsTrigger
						value='live'
						className='rounded-xl px-6 h-11 font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm'
					>
						Jonli darslar
					</TabsTrigger>
					<TabsTrigger
						value='upcoming'
						className='rounded-xl px-6 h-11 font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm'
					>
						Kelgusi darslar
					</TabsTrigger>
					<TabsTrigger
						value='completed'
						className='rounded-xl px-6 h-11 font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm'
					>
						Yakunlangan darslar
					</TabsTrigger>
				</TabsList>

				<TabsContent
					value='live'
					className='space-y-6 outline-none animate-in fade-in slide-in-from-bottom-2 duration-500'
				>
					{filteredCourses('live').length > 0 ? (
						filteredCourses('live').map(course => (
							<CourseCard key={course.id} course={course} />
						))
					) : (
						<div className='text-center py-20 bg-muted/10 rounded-3xl border-2 border-dashed border-muted/30'>
							<Video className='w-12 h-12 text-muted-foreground/30 mx-auto mb-4' />
							<p className='text-muted-foreground font-medium'>
								Ayni damda jonli darslar o'tilmayapti.
							</p>
						</div>
					)}
				</TabsContent>

				<TabsContent
					value='upcoming'
					className='space-y-6 outline-none animate-in fade-in slide-in-from-bottom-2 duration-500'
				>
					{filteredCourses('upcoming').length > 0 ? (
						filteredCourses('upcoming').map(course => (
							<CourseCard key={course.id} course={course} />
						))
					) : (
						<div className='text-center py-20 bg-muted/10 rounded-3xl border-2 border-dashed border-muted/30'>
							<Calendar className='w-12 h-12 text-muted-foreground/30 mx-auto mb-4' />
							<p className='text-muted-foreground font-medium'>
								Yaqin orada darslar rejalashtirilmagan.
							</p>
						</div>
					)}
				</TabsContent>

				<TabsContent
					value='completed'
					className='space-y-6 outline-none animate-in fade-in slide-in-from-bottom-2 duration-500'
				>
					{filteredCourses('completed').length > 0 ? (
						filteredCourses('completed').map(course => (
							<CourseCard key={course.id} course={course} />
						))
					) : (
						<div className='text-center py-20 bg-muted/10 rounded-3xl border-2 border-dashed border-muted/30'>
							<CheckCircle2 className='w-12 h-12 text-muted-foreground/30 mx-auto mb-4' />
							<p className='text-muted-foreground font-medium'>
								Hozircha yakunlangan darslar mavjud emas.
							</p>
						</div>
					)}
				</TabsContent>
			</Tabs>

			{/* Application Modal */}
			<Dialog
				open={applicationModalOpen}
				onOpenChange={setApplicationModalOpen}
			>
				<DialogContent className='sm:max-w-[500px] rounded-3xl overflow-hidden p-0 border-none shadow-2xl'>
					{!isSuccess ? (
						<>
							<div className='h-32 bg-primary relative flex items-center justify-center'>
								<div className='absolute inset-0 bg-black/10' />
								<PlusCircle className='w-16 h-16 text-white relative z-10' />
							</div>
							<div className='p-6 space-y-6'>
								<DialogHeader>
									<DialogTitle className='text-2xl font-bold'>
										Kursga ariza qoldirish
									</DialogTitle>
									<DialogDescription className='text-base'>
										Siz{' '}
										<span className='font-bold text-foreground'>
											"{selectedCourse?.title}"
										</span>{' '}
										kursiga a'zo bo'lish uchun so'rov yubormoqchisiz.
									</DialogDescription>
								</DialogHeader>
								<div className='space-y-4'>
									<div className='flex items-center gap-4 p-4 bg-muted/40 rounded-2xl border border-muted/60'>
										<div className='w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0'>
											<Users className='w-5 h-5 text-primary' />
										</div>
										<div className='min-w-0'>
											<p className='text-xs text-muted-foreground font-medium uppercase tracking-wider'>
												Mentor
											</p>
											<p className='font-bold truncate'>
												{selectedCourse?.mentor}
											</p>
										</div>
									</div>
									<div className='space-y-2'>
										<p className='text-sm font-bold px-1'>
											Qo'shimcha ma'lumot (ixtiyoriy)
										</p>
										<Textarea
											placeholder='Nima uchun bu kursda qatnashmoqchisiz?'
											className='rounded-2xl bg-muted/20 border-muted/40 min-h-[100px] focus-visible:ring-primary/20'
										/>
									</div>
								</div>
								<DialogFooter className='sm:justify-between gap-3'>
									<Button
										variant='ghost'
										onClick={() => setApplicationModalOpen(false)}
										className='rounded-xl font-bold h-12 px-6'
									>
										Bekor qilish
									</Button>
									<Button
										onClick={handleApply}
										disabled={isSubmitting}
										className='rounded-xl font-bold h-12 px-8 bg-primary shadow-lg shadow-primary/20 flex-1 sm:flex-none'
									>
										{isSubmitting
											? 'Yuborilmoqda...'
											: 'Tasdiqlash va yuborish'}
									</Button>
								</DialogFooter>
							</div>
						</>
					) : (
						<div className='p-12 flex flex-col items-center text-center space-y-6 animate-in zoom-in-95 duration-300'>
							<div className='w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center'>
								<CheckCircle2 className='w-14 h-14 text-green-500' />
							</div>
							<div className='space-y-2'>
								<h2 className='text-2xl font-bold'>Arizangiz qabul qilindi!</h2>
								<p className='text-muted-foreground'>
									Mentor tez orada arizangizni ko'rib chiqadi va sizga xabar
									beradi.
								</p>
							</div>
							<Button
								variant='secondary'
								className='rounded-xl font-bold w-full h-12'
								onClick={() => setApplicationModalOpen(false)}
							>
								Yopish
							</Button>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	)
}
