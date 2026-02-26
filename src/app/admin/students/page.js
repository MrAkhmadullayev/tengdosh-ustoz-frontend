'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import {
	CheckCircle2,
	Download,
	Edit,
	Eye,
	MoreHorizontal,
	Search,
	ShieldBan,
	Star,
	Trash2,
} from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import DeleteTalabaModal from './actions/DeleteTalaba'

// Tasdiqlangan talabalar uchun Mock Data
const STUDENTS_DATA = [
	{
		id: 'M-001',
		name: 'Sardor Rahmatov',
		course: '2-kurs',
		specialty: 'Full-Stack (React, Node.js)',
		rating: 4.9,
		studentsCount: 12,
		status: 'active',
		joinedDate: '12-Yan, 2026',
		avatar: 'SR',
	},
	{
		id: 'M-002',
		name: 'Malika Botirova',
		course: '3-kurs',
		specialty: 'Mobil (Kotlin, Android)',
		rating: 4.8,
		studentsCount: 8,
		status: 'active',
		joinedDate: '15-Yan, 2026',
		avatar: 'MB',
	},
	{
		id: 'M-003',
		name: 'Javohir Tolipov',
		course: '4-kurs',
		specialty: 'Algoritmlar (C++)',
		rating: 5.0,
		studentsCount: 25,
		status: 'active',
		joinedDate: '05-Fev, 2026',
		avatar: 'JT',
	},
	{
		id: 'M-004',
		name: 'Aziza Karimova',
		course: '2-kurs',
		specialty: 'BPM & IT Menejment',
		rating: 4.6,
		studentsCount: 5,
		status: 'inactive',
		joinedDate: '20-Fev, 2026',
		avatar: 'AK',
	},
	{
		id: 'M-005',
		name: 'Bekzod Olimov',
		course: '3-kurs',
		specialty: 'Backend (PostgreSQL, Docker)',
		rating: 4.7,
		studentsCount: 10,
		status: 'active',
		joinedDate: '22-Fev, 2026',
		avatar: 'BO',
	},
]

function AdminTalabasContent() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const actionType = searchParams.get('action')

	const [searchQuery, setSearchQuery] = useState('')

	// Qidiruv mantiqi (Ism yoki yo'nalish bo'yicha)
	const filteredTalabas = STUDENTS_DATA.filter(
		talaba =>
			talaba.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			talaba.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
			talaba.id.toLowerCase().includes(searchQuery.toLowerCase()),
	)

	return (
		<div className='space-y-6 max-w-7xl mx-auto pb-8'>
			{/* HEADER VA QIDIRUV SECTION */}
			<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
				<div>
					<h1 className='text-2xl sm:text-3xl font-bold tracking-tight text-foreground'>
						Talabalar ro'yxati
					</h1>
					<p className='text-muted-foreground mt-1'>
						Tizimda tasdiqlangan va faoliyat yuritayotgan barcha ustozlarni
						boshqarish.
					</p>
				</div>
				<div className='flex w-full sm:w-auto gap-2'>
					<Button variant='outline' className='shrink-0 gap-2'>
						<Download className='h-4 w-4' /> Export (CSV)
					</Button>
					<Button
						className='shrink-0'
						onClick={() => router.push('/admin/students/create')}
					>
						+ Yangi talaba qo'shish
					</Button>
				</div>
			</div>

			{/* FILTERLAR */}
			<div className='flex items-center justify-between bg-card p-4 rounded-xl border shadow-sm'>
				<div className='relative w-full max-w-sm'>
					<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
					<Input
						placeholder="Ism, ID yoki yo'nalish bo'yicha qidiruv..."
						className='pl-9 bg-background'
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
					/>
				</div>
				<div className='hidden sm:flex items-center gap-2'>
					<Badge variant='secondary' className='px-3 py-1 text-sm font-medium'>
						Barchasi: {STUDENTS_DATA.length}
					</Badge>
					<Badge className='bg-green-500/10 text-green-600 hover:bg-green-500/20 border-none px-3 py-1 text-sm font-medium'>
						Faol: 4
					</Badge>
				</div>
			</div>

			{/* JADVAL (TABLE) */}
			<div className='bg-card rounded-xl border shadow-sm overflow-hidden'>
				<div className='overflow-x-auto'>
					<Table>
						<TableHeader className='bg-muted/50'>
							<TableRow>
								<TableHead className='w-[80px]'>ID</TableHead>
								<TableHead>Talaba</TableHead>
								<TableHead>Yo'nalish</TableHead>
								<TableHead className='text-center'>Reyting</TableHead>
								<TableHead className='text-center'>O'quvchilar</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className='text-right'>Harakatlar</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredTalabas.length > 0 ? (
								filteredTalabas.map(talaba => (
									<TableRow
										key={talaba.id}
										className='hover:bg-muted/30 transition-colors'
									>
										<TableCell className='font-medium text-muted-foreground'>
											{talaba.id}
										</TableCell>

										{/* Talaba Profil Qismi */}
										<TableCell>
											<div className='flex items-center gap-3'>
												<Avatar className='h-9 w-9 border border-background shadow-sm'>
													<AvatarFallback className='bg-primary/10 text-primary font-bold text-xs'>
														{talaba.avatar}
													</AvatarFallback>
												</Avatar>
												<div>
													<p className='font-semibold text-foreground leading-none mb-1'>
														{talaba.name}
													</p>
													<p className='text-xs text-muted-foreground'>
														{talaba.course}
													</p>
												</div>
											</div>
										</TableCell>

										<TableCell>
											<span className='text-sm font-medium'>
												{talaba.specialty}
											</span>
										</TableCell>

										<TableCell className='text-center'>
											<Badge
												variant='secondary'
												className='bg-yellow-500/10 text-yellow-600 border-none font-bold'
											>
												<Star className='h-3 w-3 mr-1 fill-yellow-600' />{' '}
												{talaba.rating}
											</Badge>
										</TableCell>

										<TableCell className='text-center font-medium'>
											{talaba.studentsCount} ta
										</TableCell>

										<TableCell>
											{talaba.status === 'active' ? (
												<Badge className='bg-green-500/10 text-green-600 border-green-500/20 shadow-none font-medium flex w-fit items-center gap-1.5'>
													<CheckCircle2 className='h-3.5 w-3.5' /> Faol
												</Badge>
											) : (
												<Badge
													variant='secondary'
													className='text-muted-foreground font-medium flex w-fit items-center gap-1.5'
												>
													<ShieldBan className='h-3.5 w-3.5' /> Vaqtincha
													to'xtatilgan
												</Badge>
											)}
										</TableCell>

										<TableCell className='text-right'>
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
												<DropdownMenuContent align='end' className='w-48'>
													<DropdownMenuLabel>Harakatlar</DropdownMenuLabel>
													<DropdownMenuSeparator />
													<DropdownMenuItem
														className='cursor-pointer'
														onClick={() =>
															router.push(`/admin/students/${talaba.id}/view`)
														}
													>
														<Eye className='h-4 w-4 mr-2 text-muted-foreground' />{' '}
														Ko'rish
													</DropdownMenuItem>
													<DropdownMenuItem
														className='cursor-pointer'
														onClick={() =>
															router.push(`/admin/students/${talaba.id}/edit`)
														}
													>
														<Edit className='h-4 w-4 mr-2 text-muted-foreground' />{' '}
														Tahrirlash
													</DropdownMenuItem>
													{talaba.status === 'active' ? (
														<DropdownMenuItem className='cursor-pointer text-orange-600 focus:text-orange-600'>
															<ShieldBan className='h-4 w-4 mr-2' /> Faoliyatni
															to'xtatish
														</DropdownMenuItem>
													) : (
														<DropdownMenuItem className='cursor-pointer text-green-600 focus:text-green-600'>
															<CheckCircle2 className='h-4 w-4 mr-2' /> Qayta
															faollashtirish
														</DropdownMenuItem>
													)}
													<DropdownMenuSeparator />
													<DropdownMenuItem
														className='cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50'
														onClick={() =>
															router.push(
																`/admin/students?action=delete&id=${talaba.id}`,
															)
														}
													>
														<Trash2 className='h-4 w-4 mr-2' /> Talabalikdan
														chetlatish
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={7}
										className='h-32 text-center text-muted-foreground'
									>
										Hech narsa topilmadi. Qidiruv so'zini o'zgartirib ko'ring.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>

				{/* PAGINATION (Paski qism) */}
				<div className='p-4 border-t flex items-center justify-between text-sm text-muted-foreground bg-muted/20'>
					<p>
						Jami {filteredTalabas.length} ta natijadan 1-
						{filteredTalabas.length} tasi ko'rsatilmoqda.
					</p>
					<div className='flex gap-2'>
						<Button variant='outline' size='sm' disabled>
							Oldingi
						</Button>
						<Button variant='outline' size='sm' disabled>
							Keyingi
						</Button>
					</div>
				</div>
			</div>

			{/* MODAL FAQT O'CHIRISH/CHETLATISH UCHUN QOLDI */}
			{actionType === 'delete' && <DeleteTalabaModal />}
		</div>
	)
}

export default function AdminTalabasPage() {
	return (
		<Suspense fallback={<div className='p-8 text-center'>Yuklanmoqda...</div>}>
			<AdminTalabasContent />
		</Suspense>
	)
}
