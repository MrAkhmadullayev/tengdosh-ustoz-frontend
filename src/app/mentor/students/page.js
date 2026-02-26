'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
	BookOpen,
	Calendar,
	Download,
	Mail,
	MessageSquare,
	MoreHorizontal,
	Phone,
	Search,
	UserCircle,
} from 'lucide-react'
import { useState } from 'react'

const MOCK_STUDENTS = [
	{
		id: 1,
		name: 'Madina Akramova',
		email: 'madina@example.com',
		phone: '+998 90 111 22 33',
		joinDate: '12 Yanvar, 2024',
		course: 'React Advanced',
		status: 'active',
		progress: 75,
	},
	{
		id: 2,
		name: 'Jasur Ahmedov',
		email: 'jasur@example.com',
		phone: '+998 91 222 33 44',
		joinDate: '05 Fevral, 2024',
		course: 'Next.js & Tailwind',
		status: 'active',
		progress: 40,
	},
	{
		id: 3,
		name: 'Dilnoza Salimova',
		email: 'dilnoza@example.com',
		phone: '+998 93 333 44 55',
		joinDate: '20 Dekabr, 2023',
		course: 'React Advanced',
		status: 'completed',
		progress: 100,
	},
	{
		id: 4,
		name: "Otabek G'aniyev",
		email: 'otabek@example.com',
		phone: '+998 94 444 55 66',
		joinDate: '01 Mart, 2024',
		course: 'Next.js & Tailwind',
		status: 'active',
		progress: 15,
	},
	{
		id: 5,
		name: 'Sardor Rahimiv',
		email: 'sardor@example.com',
		phone: '+998 99 555 66 77',
		joinDate: '15 Yanvar, 2024',
		course: 'Full-Stack JS',
		status: 'on-hold',
		progress: 60,
	},
]

export default function MentorStudentsPage() {
	const [searchQuery, setSearchQuery] = useState('')
	const [activeFilter, setActiveFilter] = useState('all')

	const filteredStudents = MOCK_STUDENTS.filter(student => {
		const matchesSearch =
			student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			student.email.toLowerCase().includes(searchQuery.toLowerCase())
		const matchesFilter =
			activeFilter === 'all' ? true : student.status === activeFilter
		return matchesSearch && matchesFilter
	})

	const getStatusBadge = status => {
		switch (status) {
			case 'active':
				return <Badge className='bg-green-500 hover:bg-green-600'>Faol</Badge>
			case 'completed':
				return <Badge className='bg-blue-500 hover:bg-blue-600'>Tugatgan</Badge>
			case 'on-hold':
				return <Badge variant='secondary'>Kutishda</Badge>
			default:
				return <Badge variant='outline'>{status}</Badge>
		}
	}

	return (
		<div className='max-w-7xl mx-auto space-y-8 pb-12'>
			{/* Header */}
			<div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>
						Mening O'quvchilarim
					</h1>
					<p className='text-muted-foreground mt-1'>
						Sizning kurslaringizda tahsil olayotgan va sizga obuna bo'lgan
						talabalar.
					</p>
				</div>
				<div className='flex items-center gap-3'>
					<Button variant='outline' className='rounded-xl gap-2'>
						<Download className='w-4 h-4' /> Eksport
					</Button>
					<Button className='rounded-xl gap-2 shadow-lg shadow-primary/20'>
						<MessageSquare className='w-4 h-4' /> Guruhga xabar yuborish
					</Button>
				</div>
			</div>

			{/* Filters & Search */}
			<Card className='rounded-2xl border-muted/60 shadow-sm'>
				<CardContent className='p-4 flex flex-col md:flex-row items-center gap-4'>
					<div className='relative flex-1 w-full'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
						<Input
							placeholder="O'quvchi ismi yoki email orqali qidirish..."
							className='pl-10 h-11 bg-muted/20 border-transparent focus-visible:ring-primary/20 rounded-xl'
							value={searchQuery}
							onChange={e => setSearchQuery(e.target.value)}
						/>
					</div>
					<div className='flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0'>
						<Button
							variant={activeFilter === 'all' ? 'secondary' : 'ghost'}
							size='sm'
							className='rounded-lg h-9'
							onClick={() => setActiveFilter('all')}
						>
							Barchasi
						</Button>
						<Button
							variant={activeFilter === 'active' ? 'secondary' : 'ghost'}
							size='sm'
							className='rounded-lg h-9'
							onClick={() => setActiveFilter('active')}
						>
							Faol
						</Button>
						<Button
							variant={activeFilter === 'completed' ? 'secondary' : 'ghost'}
							size='sm'
							className='rounded-lg h-9'
							onClick={() => setActiveFilter('completed')}
						>
							Tugatgan
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Student Grid */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{filteredStudents.length > 0 ? (
					filteredStudents.map(student => (
						<Card
							key={student.id}
							className='group hover:shadow-xl transition-all duration-300 border-muted/60 rounded-3xl overflow-hidden relative bg-card'
						>
							<CardContent className='p-6'>
								<div className='flex justify-between items-start mb-6'>
									<div className='flex items-center gap-4'>
										<Avatar className='h-12 w-12 border-2 border-background shadow-md'>
											<AvatarFallback className='bg-primary/10 text-primary font-bold'>
												{student.name
													.split(' ')
													.map(n => n[0])
													.join('')}
											</AvatarFallback>
										</Avatar>
										<div>
											<h3 className='font-bold text-lg group-hover:text-primary transition-colors'>
												{student.name}
											</h3>
											<p className='text-xs text-muted-foreground flex items-center gap-1'>
												<Calendar className='w-3 h-3' /> {student.joinDate} dan
												beri
											</p>
										</div>
									</div>
									<Button
										variant='ghost'
										size='icon'
										className='rounded-full h-8 w-8'
									>
										<MoreHorizontal className='w-4 h-4' />
									</Button>
								</div>

								<div className='space-y-4'>
									<div className='space-y-2'>
										<div className='flex justify-between text-xs font-medium'>
											<span className='text-muted-foreground flex items-center gap-1'>
												<BookOpen className='w-3 h-3' /> {student.course}
											</span>
											<span className='font-bold'>{student.progress}%</span>
										</div>
										<div className='h-1.5 w-full bg-muted rounded-full overflow-hidden'>
											<div
												className='h-full bg-primary transition-all duration-1000 ease-out'
												style={{ width: `${student.progress}%` }}
											/>
										</div>
									</div>

									<div className='grid grid-cols-1 gap-2 border-t pt-4'>
										<div className='flex items-center gap-2 text-sm text-foreground/80'>
											<Mail className='w-3.5 h-3.5 text-muted-foreground text-foreground' />
											<span className='truncate'>{student.email}</span>
										</div>
										<div className='flex items-center gap-2 text-sm text-foreground/80'>
											<Phone className='w-3.5 h-3.5 text-muted-foreground text-foreground' />
											<span>{student.phone}</span>
										</div>
									</div>

									<div className='flex items-center justify-between pt-2'>
										{getStatusBadge(student.status)}
										<div className='flex gap-2'>
											<Button
												variant='outline'
												size='icon'
												className='h-9 w-9 rounded-xl hover:bg-blue-50 hover:text-blue-600 border-muted/60'
											>
												<MessageSquare className='w-4 h-4 text-foreground' />
											</Button>
											<Button
												variant='outline'
												size='icon'
												className='h-9 w-9 rounded-xl hover:bg-primary/5 hover:text-primary border-muted/60'
											>
												<UserCircle className='w-4 h-4 text-foreground' />
											</Button>
										</div>
									</div>
								</div>
							</CardContent>
							<div className='absolute bottom-0 left-0 h-1 w-full bg-primary/10' />
						</Card>
					))
				) : (
					<div className='col-span-full py-12 text-center'>
						<div className='bg-muted/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
							<Search className='w-8 h-8 text-muted-foreground opacity-20' />
						</div>
						<h3 className='text-lg font-bold'>O'quvchi topilmadi</h3>
						<p className='text-muted-foreground'>
							Qidiruv matnini o'zgartirib ko'ring.
						</p>
					</div>
				)}
			</div>
		</div>
	)
}
