'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
	Calendar,
	ClipboardList,
	Clock,
	Eye,
	MapPin,
	MoreHorizontal,
	Pencil,
	Plus,
	Radio,
	Search,
	Trash2,
	User,
	Users,
	Video,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

// Boshlang'ich Mock Dastlabki Ma'lumotlar
const INITIAL_LESSONS = [
	{
		id: 'LSN-101',
		title: 'Frontend arxitekturasi asosi (React)',
		mentor: "Javohir To'rayev",
		date: '2026-03-01',
		time: '15:00',
		format: 'online',
		allowComments: true,
		roomNumber: '',
		enrolled: 45,
		status: 'live',
	},
	{
		id: 'LSN-102',
		title: "Node.js va Express Boshlang'ich",
		mentor: "Olimjon G'aniyev",
		date: '2026-03-05',
		time: '18:00',
		format: 'hybrid',
		allowComments: false,
		roomNumber: 'A-102 Xona',
		enrolled: 120,
		status: 'upcoming',
	},
	{
		id: 'LSN-103',
		title: 'Figma Componentlarini yasash',
		mentor: 'Shaxnoza Karimova',
		date: '2026-02-25',
		time: '14:00',
		format: 'offline',
		allowComments: true,
		roomNumber: 'B-305 Xona',
		enrolled: 80,
		status: 'completed',
	},
]

export default function AdminLessonsPage() {
	const router = useRouter()
	const [lessons, setLessons] = useState(INITIAL_LESSONS)
	const [searchQuery, setSearchQuery] = useState('')

	// Modallar holati faqat o'chirish uchun
	const [isDeleteOpen, setIsDeleteOpen] = useState(false)
	const [currentLesson, setCurrentLesson] = useState(null)

	// Table uchun qidiruv
	const filteredLessons = lessons.filter(
		l =>
			l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			l.mentor.toLowerCase().includes(searchQuery.toLowerCase()) ||
			l.id.toLowerCase().includes(searchQuery.toLowerCase()),
	)

	// DELETE LOGIC
	const handleDeleteClick = lesson => {
		setCurrentLesson(lesson)
		setIsDeleteOpen(true)
	}

	const handleConfirmDelete = () => {
		setLessons(lessons.filter(l => l.id !== currentLesson.id))
		setIsDeleteOpen(false)
		setCurrentLesson(null)
	}

	// Helper badge colors
	const getFormatBadge = format => {
		switch (format) {
			case 'online':
				return (
					<div className='flex items-center gap-1.5 text-xs font-medium text-blue-600'>
						<Video className='h-3.5 w-3.5' /> Masofaviy
					</div>
				)
			case 'offline':
				return (
					<div className='flex items-center gap-1.5 text-xs font-medium text-orange-600'>
						<MapPin className='h-3.5 w-3.5' /> Markazda
					</div>
				)
			case 'hybrid':
				return (
					<div className='flex items-center gap-1.5 text-xs font-medium text-purple-600'>
						<Users className='h-3.5 w-3.5' /> Gibrid
					</div>
				)
			default:
				return null
		}
	}

	const renderTable = statusTab => {
		const tabLessons = filteredLessons.filter(l => l.status === statusTab)

		return (
			<div className='bg-card rounded-2xl border shadow-sm overflow-hidden mt-2'>
				<div className='overflow-x-auto'>
					<Table>
						<TableHeader className='bg-muted/30'>
							<TableRow className='hover:bg-transparent'>
								<TableHead className='w-[100px] whitespace-nowrap font-semibold'>
									ID
								</TableHead>
								<TableHead className='font-semibold min-w-[250px]'>
									Dars Nomi
								</TableHead>
								<TableHead className='font-semibold whitespace-nowrap'>
									Sana va Vaqt
								</TableHead>
								{statusTab !== 'upcoming' && (
									<TableHead className='font-semibold whitespace-nowrap'>
										{statusTab === 'live'
											? 'Hozirgi Oquvchilar'
											: 'Qatnashganlar'}
									</TableHead>
								)}
								<TableHead className='font-semibold whitespace-nowrap'>
									Izohlar (Sharh)
								</TableHead>
								<TableHead className='text-right font-semibold whitespace-nowrap'>
									Sozlamalar
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{tabLessons.length > 0 ? (
								tabLessons.map(lesson => (
									<TableRow
										key={lesson.id}
										className='hover:bg-muted/30 transition-colors'
									>
										<TableCell className='font-mono text-xs text-muted-foreground py-4'>
											{lesson.id}
										</TableCell>
										<TableCell className='py-4'>
											<div>
												<p className='font-bold text-foreground leading-tight mb-1'>
													{lesson.title}
												</p>
												<div className='flex items-center gap-3 mt-1'>
													<span className='text-xs font-medium text-muted-foreground flex items-center gap-1.5'>
														<User className='h-3.5 w-3.5' /> {lesson.mentor}
													</span>
													{getFormatBadge(lesson.format)}
												</div>
											</div>
										</TableCell>
										<TableCell className='py-4'>
											<div className='space-y-1.5'>
												<div className='flex items-center gap-1.5 text-sm font-medium'>
													<Calendar className='h-3.5 w-3.5 text-muted-foreground' />
													{lesson.date}
												</div>
												<div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
													<Clock className='h-3.5 w-3.5' />
													{lesson.time}
												</div>
											</div>
										</TableCell>
										{statusTab !== 'upcoming' && (
											<TableCell className='py-4'>
												<div className='flex items-center gap-1.5 font-medium text-sm'>
													<Users className='h-4 w-4 text-primary' />{' '}
													{lesson.enrolled}
												</div>
											</TableCell>
										)}
										<TableCell className='py-4'>
											{lesson.allowComments ? (
												<Badge
													variant='outline'
													className='text-green-600 bg-green-50 border-green-200'
												>
													Ruxsat etilgan
												</Badge>
											) : (
												<Badge
													variant='outline'
													className='text-muted-foreground'
												>
													O'chirilgan
												</Badge>
											)}
										</TableCell>
										<TableCell className='text-right py-4'>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														variant='ghost'
														size='icon'
														className='h-8 w-8 text-muted-foreground hover:text-foreground'
													>
														<MoreHorizontal className='h-4 w-4' />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent
													align='end'
													className='w-48 rounded-xl'
												>
													<DropdownMenuLabel className='text-xs text-muted-foreground'>
														Boshaqaruv
													</DropdownMenuLabel>
													<DropdownMenuSeparator />

													{statusTab === 'live' && (
														<DropdownMenuItem
															className='cursor-pointer py-2.5 text-blue-600 focus:text-blue-700 bg-blue-50/50 focus:bg-blue-100 font-medium'
															onClick={() =>
																router.push(`/admin/lessons/${lesson.id}/watch`)
															}
														>
															<Radio className='h-4 w-4 mr-2' /> Kuzatish
														</DropdownMenuItem>
													)}
													{statusTab === 'completed' && (
														<DropdownMenuItem
															className='cursor-pointer py-2.5 text-purple-600 focus:text-purple-700 font-medium'
															onClick={() =>
																router.push(
																	`/admin/lessons/${lesson.id}/students`,
																)
															}
														>
															<ClipboardList className='h-4 w-4 mr-2' />{' '}
															O'quvchilar ro'yxati
														</DropdownMenuItem>
													)}

													<DropdownMenuItem
														className='cursor-pointer py-2.5'
														onClick={() =>
															router.push(`/admin/lessons/${lesson.id}/view`)
														}
													>
														<Eye className='h-4 w-4 mr-2 text-muted-foreground' />{' '}
														Ko'rish / Ulashish
													</DropdownMenuItem>
													<DropdownMenuItem
														className='cursor-pointer py-2.5'
														onClick={() =>
															router.push(`/admin/lessons/${lesson.id}/edit`)
														}
													>
														<Pencil className='h-4 w-4 mr-2 text-blue-500' />{' '}
														Tahrirlash
													</DropdownMenuItem>
													<DropdownMenuSeparator />
													<DropdownMenuItem
														className='cursor-pointer text-red-600 focus:text-red-700 py-2.5 focus:bg-red-50'
														onClick={() => handleDeleteClick(lesson)}
													>
														<Trash2 className='h-4 w-4 mr-2' /> Darsni O'chirish
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={statusTab === 'upcoming' ? 5 : 6}
										className='h-32 text-center text-muted-foreground'
									>
										Bu bo'limda hech qanday dars topilmadi.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</div>
		)
	}

	return (
		<div className='w-full max-w-7xl mx-auto space-y-6 pb-12'>
			{/* HEADER VA QIDIRUV */}
			<div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-2xl border shadow-sm'>
				<div>
					<h1 className='text-2xl sm:text-3xl font-bold tracking-tight text-foreground'>
						Darslar bazasi
					</h1>
					<p className='text-muted-foreground text-sm mt-1'>
						Tizimdagi jami onlayn kurslar va jonli darslarni to'liq boshqarish
						paneli.
					</p>
				</div>
				<div className='flex gap-3 w-full md:w-auto'>
					<Button
						onClick={() => router.push('/admin/lessons/create')}
						className='gap-2 w-full md:w-auto rounded-xl px-4'
					>
						<Plus className='h-4 w-4' /> Yangi Dars Yaratish
					</Button>
				</div>
			</div>

			{/* FILTERS */}
			<div className='flex items-center justify-between gap-4'>
				<div className='relative w-full max-w-sm'>
					<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
					<Input
						placeholder='Dars ID, Nomi yoki Mentorini qidirish...'
						className='pl-9 bg-card border-none shadow-sm rounded-xl h-11'
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
					/>
				</div>
				<Badge
					variant='outline'
					className='px-3 py-1.5 h-11 items-center bg-card text-muted-foreground rounded-xl flex whitespace-nowrap'
				>
					Jami {filteredLessons.length} ta dars
				</Badge>
			</div>

			<Tabs defaultValue='live' className='w-full'>
				<TabsList className='grid w-full grid-cols-3 md:max-w-[480px] h-12 bg-muted/60 rounded-xl p-1 mb-6'>
					<TabsTrigger
						value='live'
						className='rounded-lg h-10 data-[state=active]:bg-background data-[state=active]:shadow-sm'
					>
						<Radio className='w-4 h-4 mr-2' /> Hozirgi darslar
					</TabsTrigger>
					<TabsTrigger
						value='upcoming'
						className='rounded-lg h-10 data-[state=active]:bg-background data-[state=active]:shadow-sm'
					>
						<Calendar className='w-4 h-4 mr-2' /> Kelasi darslar
					</TabsTrigger>
					<TabsTrigger
						value='completed'
						className='rounded-lg h-10 data-[state=active]:bg-background data-[state=active]:shadow-sm'
					>
						<ClipboardList className='w-4 h-4 mr-2' /> O'tgan darslar
					</TabsTrigger>
				</TabsList>
				<TabsContent value='live'>{renderTable('live')}</TabsContent>
				<TabsContent value='upcoming'>{renderTable('upcoming')}</TabsContent>
				<TabsContent value='completed'>{renderTable('completed')}</TabsContent>
			</Tabs>

			{/* DELETE CONFIRM DIALOG */}
			<Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
				<DialogContent className='sm:max-w-[425px]'>
					<DialogHeader>
						<DialogTitle className='text-red-600 flex items-center gap-2'>
							<Trash2 className='h-5 w-5' /> Darsni o'chirishni tasdiqlang
						</DialogTitle>
						<DialogDescription className='pt-2'>
							Haqiqatdan ham <b>"{currentLesson?.title}"</b> nomli darsni
							butunlay e'tibordan olib tashlamoqchimisiz? Bu amalni orqaga
							qaytarib bo'lmaydi va barcha yozilgan talabalar uziladi.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className='mt-4 gap-2 sm:gap-0'>
						<Button variant='outline' onClick={() => setIsDeleteOpen(false)}>
							Yo'q, Adashdim
						</Button>
						<Button variant='destructive' onClick={handleConfirmDelete}>
							Xa, O'chirilsin
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}
