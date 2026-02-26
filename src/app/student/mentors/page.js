'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ChevronRight, Filter, Search, Star, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const MOCK_MENTORS = [
	{
		id: 1,
		name: 'Jahongir Taylokov',
		specialty: 'Senior React Developer',
		rating: 4.9,
		students: 1250,
		courses: 12,
		image:
			'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60',
		bio: "React va Next.js bo'yicha 6 yillik tajribaga ega ekspert.",
	},
	{
		id: 2,
		name: 'Akmal Turgun',
		specialty: 'Python & AI Engineer',
		rating: 4.8,
		students: 850,
		courses: 8,
		image:
			'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=60',
		bio: "Sun'iy intellekt va Deep Learning muhandisi.",
	},
	{
		id: 3,
		name: 'Madina Akramova',
		specialty: 'Senior UI/UX Designer',
		rating: 5.0,
		students: 2100,
		courses: 15,
		image:
			'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60',
		bio: "Digital mahsulotlar dizayni bo'yicha xalqaro tajriba.",
	},
	{
		id: 4,
		name: 'Rustam Qosimov',
		specialty: 'Flutter Mobile Developer',
		rating: 4.7,
		students: 600,
		courses: 5,
		image:
			'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60',
		bio: 'Cross-platform mobil ilovalar yaratish ustasi.',
	},
]

export default function StudentMentorsPage() {
	const router = useRouter()
	const [searchQuery, setSearchQuery] = useState('')

	const filteredMentors = MOCK_MENTORS.filter(
		mentor =>
			mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			mentor.specialty.toLowerCase().includes(searchQuery.toLowerCase()),
	)

	return (
		<div className='max-w-6xl mx-auto space-y-8 pb-12 transition-all duration-500'>
			{/* Header */}
			<div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>
				<div className='space-y-1'>
					<h1 className='text-3xl font-bold tracking-tight'>Mentorlar</h1>
					<p className='text-muted-foreground'>
						Sohangiz bo'yicha eng yaxshi mutaxassislardan bilim oling.
					</p>
				</div>
				<div className='flex items-center gap-3 w-full md:w-auto'>
					<div className='relative flex-1 md:w-80'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
						<Input
							placeholder='Mentor ismi yoki mutaxassisligi...'
							className='pl-10 h-11 bg-muted/20 border-transparent focus-visible:ring-primary/20 rounded-2xl w-full'
							value={searchQuery}
							onChange={e => setSearchQuery(e.target.value)}
						/>
					</div>
					<Button
						variant='outline'
						size='icon'
						className='rounded-xl h-11 w-11 border-muted/60'
					>
						<Filter className='w-4 h-4' />
					</Button>
				</div>
			</div>

			{/* Mentors Grid */}
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
				{filteredMentors.map(mentor => (
					<Card
						key={mentor.id}
						className='group rounded-3xl border-muted/60 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden bg-background/50 backdrop-blur-sm relative cursor-pointer'
						onClick={() => router.push(`/student/mentors/${mentor.id}`)}
					>
						<CardContent className='p-6 space-y-4'>
							<div className='relative mx-auto w-32 h-32'>
								<div className='absolute inset-0 bg-primary/20 rounded-full animate-pulse blur-xl scale-110 opacity-0 group-hover:opacity-100 transition-opacity' />
								<Avatar className='w-full h-full border-4 border-background shadow-lg relative z-10'>
									<AvatarImage
										src={mentor.image}
										alt={mentor.name}
										className='object-cover'
									/>
									<AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
								</Avatar>
								<Badge className='absolute bottom-0 right-0 bg-yellow-400 text-black border-2 border-background font-bold px-2 py-0.5 rounded-lg'>
									<Star className='w-3 h-3 fill-current mr-1' /> {mentor.rating}
								</Badge>
							</div>

							<div className='text-center space-y-1 px-2'>
								<h3 className='font-bold text-lg group-hover:text-primary transition-colors truncate'>
									{mentor.name}
								</h3>
								<p className='text-sm text-muted-foreground font-medium truncate'>
									{mentor.specialty}
								</p>
							</div>

							<div className='grid grid-cols-2 gap-2 pt-2'>
								<div className='bg-muted/30 rounded-2xl p-2.5 text-center'>
									<p className='text-xs text-muted-foreground font-medium uppercase tracking-tighter'>
										O'quvchilar
									</p>
									<p className='font-bold text-sm'>{mentor.students}+</p>
								</div>
								<div className='bg-muted/30 rounded-2xl p-2.5 text-center'>
									<p className='text-xs text-muted-foreground font-medium uppercase tracking-tighter'>
										Darslar
									</p>
									<p className='font-bold text-sm'>{mentor.courses}+</p>
								</div>
							</div>

							<Button className='w-full rounded-2xl gap-2 font-bold h-11 bg-muted/50 hover:bg-primary hover:text-white text-foreground transition-all border-none shadow-none group/btn'>
								Profilni ko'rish{' '}
								<ChevronRight className='w-4 h-4 group-hover/btn:translate-x-1 transition-transform' />
							</Button>
						</CardContent>
					</Card>
				))}
			</div>

			{filteredMentors.length === 0 && (
				<div className='text-center py-20 bg-muted/10 rounded-[3rem] border-2 border-dashed border-muted/30'>
					<Users className='w-16 h-16 text-muted-foreground/20 mx-auto mb-4' />
					<h3 className='text-xl font-bold'>Mentorlar topilmadi</h3>
					<p className='text-muted-foreground max-w-xs mx-auto mt-2'>
						Qidiruv so'rovini o'zgartirib ko'ring yoki boshqa sohani tanlang.
					</p>
				</div>
			)}
		</div>
	)
}
