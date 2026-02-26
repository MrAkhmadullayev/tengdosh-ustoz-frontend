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
	Clock,
	Eye,
	MoreHorizontal,
	Search,
	XCircle,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Suspense, useState } from 'react'

// Arizalar uchun Mock Data
const APPLICATIONS_DATA = [
	{
		id: 'APP-001',
		name: 'Javohir To‘rayev',
		course: '3-kurs',
		specialty: 'Frontend (React, Vue)',
		cgpa: 4.8,
		status: 'pending',
		appliedDate: '26-Fev, 2026',
		avatar: 'JT',
	},
	{
		id: 'APP-002',
		name: 'Shaxnoza Karimova',
		course: '4-kurs',
		specialty: 'UI/UX Dizayn',
		cgpa: 4.5,
		status: 'approved',
		appliedDate: '25-Fev, 2026',
		avatar: 'SK',
	},
	{
		id: 'APP-003',
		name: 'Olimjon G‘aniyev',
		course: '2-kurs',
		specialty: 'Backend (Node.js)',
		cgpa: 3.9,
		status: 'rejected',
		appliedDate: '23-Fev, 2026',
		avatar: 'OG',
	},
	{
		id: 'APP-004',
		name: 'Malika Qosimova',
		course: '3-kurs',
		specialty: 'Mobil Dasturlash (Flutter)',
		cgpa: 4.9,
		status: 'pending',
		appliedDate: '26-Fev, 2026',
		avatar: 'MQ',
	},
]

function AdminApplicationsContent() {
	const router = useRouter()
	const [searchQuery, setSearchQuery] = useState('')

	// Qidiruv mantiqi
	const filteredApps = APPLICATIONS_DATA.filter(
		app =>
			app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			app.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
			app.id.toLowerCase().includes(searchQuery.toLowerCase()),
	)

	return (
		<div className='space-y-6 max-w-7xl mx-auto pb-8'>
			{/* HEADER VA QIDIRUV SECTION */}
			<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
				<div>
					<h1 className='text-2xl sm:text-3xl font-bold tracking-tight text-foreground'>
						Mentorlikka Arizalar
					</h1>
					<p className='text-muted-foreground mt-1'>
						Talabalardan kelib tushgan ustoz bo'lish haqidagi surovlarni ko'rib
						chiqish.
					</p>
				</div>
			</div>

			{/* FILTERLAR */}
			<div className='flex items-center justify-between bg-card p-4 rounded-xl border shadow-sm'>
				<div className='relative w-full max-w-sm'>
					<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
					<Input
						placeholder="Ismi, ID yoki yo'nalish bo'yicha qidiruv..."
						className='pl-9 bg-background'
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
					/>
				</div>
				<div className='hidden sm:flex items-center gap-2'>
					<Badge variant='secondary' className='px-3 py-1 text-sm font-medium'>
						Barchasi: {APPLICATIONS_DATA.length}
					</Badge>
					<Badge className='bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 border-none px-3 py-1 text-sm font-medium'>
						Kutilmoqda: 2
					</Badge>
				</div>
			</div>

			{/* JADVAL (TABLE) */}
			<div className='bg-card rounded-xl border shadow-sm overflow-hidden'>
				<div className='overflow-x-auto'>
					<Table>
						<TableHeader className='bg-muted/50'>
							<TableRow>
								<TableHead className='w-[100px]'>Ariza ID</TableHead>
								<TableHead>Nomzod</TableHead>
								<TableHead>Yo'nalishi</TableHead>
								<TableHead className='text-center'>CGPA Reytingi</TableHead>
								<TableHead>Sana</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className='text-right'>Harakatlar</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredApps.length > 0 ? (
								filteredApps.map(app => (
									<TableRow
										key={app.id}
										className='hover:bg-muted/30 transition-colors'
									>
										<TableCell className='font-medium text-muted-foreground'>
											{app.id}
										</TableCell>

										{/* Nomzod qismi */}
										<TableCell>
											<div className='flex items-center gap-3'>
												<Avatar className='h-9 w-9 border border-background shadow-sm'>
													<AvatarFallback className='bg-primary/10 text-primary font-bold text-xs'>
														{app.avatar}
													</AvatarFallback>
												</Avatar>
												<div>
													<p className='font-semibold text-foreground leading-none mb-1'>
														{app.name}
													</p>
													<p className='text-xs text-muted-foreground'>
														{app.course}
													</p>
												</div>
											</div>
										</TableCell>

										<TableCell>
											<span className='text-sm font-medium'>
												{app.specialty}
											</span>
										</TableCell>

										<TableCell className='text-center font-bold'>
											{app.cgpa}
										</TableCell>

										<TableCell className='text-sm text-muted-foreground'>
											{app.appliedDate}
										</TableCell>

										<TableCell>
											{app.status === 'pending' && (
												<Badge className='bg-orange-500/10 text-orange-600 border-orange-500/20 shadow-none font-medium flex w-fit items-center gap-1.5'>
													<Clock className='h-3.5 w-3.5' /> Kutilmoqda
												</Badge>
											)}
											{app.status === 'approved' && (
												<Badge className='bg-green-500/10 text-green-600 border-green-500/20 shadow-none font-medium flex w-fit items-center gap-1.5'>
													<CheckCircle2 className='h-3.5 w-3.5' /> Qabul
													qilingan
												</Badge>
											)}
											{app.status === 'rejected' && (
												<Badge className='bg-red-500/10 text-red-600 border-red-500/20 shadow-none font-medium flex w-fit items-center gap-1.5'>
													<XCircle className='h-3.5 w-3.5' /> Rad etilgan
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
													<DropdownMenuLabel>
														Arizani boshqarish
													</DropdownMenuLabel>
													<DropdownMenuSeparator />
													<DropdownMenuItem
														className='cursor-pointer'
														onClick={() =>
															router.push(`/admin/applications/${app.id}/view`)
														}
													>
														<Eye className='h-4 w-4 mr-2 text-muted-foreground' />{' '}
														To'liq ko'rish
													</DropdownMenuItem>
													{app.status === 'pending' && (
														<>
															<DropdownMenuItem className='cursor-pointer text-green-600 focus:text-green-600'>
																<CheckCircle2 className='h-4 w-4 mr-2' /> Qabul
																qilish
															</DropdownMenuItem>
															<DropdownMenuItem className='cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50'>
																<XCircle className='h-4 w-4 mr-2' /> Rad etish
															</DropdownMenuItem>
														</>
													)}
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
										Arizalar topilmadi.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>

				{/* PAGINATION */}
				<div className='p-4 border-t flex items-center justify-between text-sm text-muted-foreground bg-muted/20'>
					<p>Jami {filteredApps.length} ta arizadan barchasi ko'rsatilmoqda.</p>
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
		</div>
	)
}

export default function AdminApplicationsPage() {
	return (
		<Suspense
			fallback={<div className='p-8 text-center'>Arizalar yuklanmoqda...</div>}
		>
			<AdminApplicationsContent />
		</Suspense>
	)
}
