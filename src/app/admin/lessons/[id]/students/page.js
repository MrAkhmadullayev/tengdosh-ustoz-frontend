'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { ArrowLeft, CheckCircle2, Clock, Users, XCircle } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

// O'quvchilarning qatnashish tarixi
const ATTENDANCE_DATA = [
	{
		id: 1,
		name: 'Aliyev Vali',
		status: 'attended',
		joined: '14:02',
		left: '15:20',
		duration: '78 min',
	},
	{
		id: 2,
		name: 'Karimova Nargiza',
		status: 'attended',
		joined: '14:00',
		left: '15:25',
		duration: '85 min',
	},
	{
		id: 3,
		name: 'Toshmatov Eshmat',
		status: 'missed',
		joined: '-',
		left: '-',
		duration: '0 min',
	},
	{
		id: 4,
		name: 'Axmedova Gulnoza',
		status: 'attended',
		joined: '14:15',
		left: '15:00',
		duration: '45 min',
	},
	{
		id: 5,
		name: 'Samadov Jasur',
		status: 'attended',
		joined: '14:01',
		left: '15:30',
		duration: '89 min',
	},
]

export default function StudentsAttendancePage() {
	const router = useRouter()
	const { id } = useParams()

	const attendedCount = ATTENDANCE_DATA.filter(
		s => s.status === 'attended',
	).length

	return (
		<div className='max-w-5xl mx-auto space-y-6 pb-12 w-full'>
			{/* HEADER */}
			<div className='flex items-center gap-4 bg-card p-4 rounded-xl border shadow-sm'>
				<Button
					variant='ghost'
					size='icon'
					onClick={() => router.push('/admin/lessons')}
					className='rounded-full hover:bg-muted shrink-0'
				>
					<ArrowLeft className='h-5 w-5' />
				</Button>
				<div className='flex-1'>
					<h1 className='text-xl sm:text-2xl font-bold tracking-tight'>
						O'quvchilar ro'yxati
					</h1>
					<p className='text-muted-foreground text-sm mt-0.5'>
						Figma Componentlarini yasash • ID: {id}
					</p>
				</div>
				<Badge
					variant='outline'
					className='px-4 py-1.5 h-10 border-primary/20 bg-primary/5 text-primary flex gap-2 items-center rounded-xl'
				>
					<Users className='w-4 h-4' /> Qatnashdi: {attendedCount} /{' '}
					{ATTENDANCE_DATA.length}
				</Badge>
			</div>

			<Card className='shadow-sm border-muted overflow-hidden rounded-2xl'>
				<div className='overflow-x-auto'>
					<Table>
						<TableHeader className='bg-muted/30'>
							<TableRow className='hover:bg-transparent'>
								<TableHead className='font-semibold'>Talaba Ismi</TableHead>
								<TableHead className='font-semibold'>
									Qatnashish Holati
								</TableHead>
								<TableHead className='font-semibold'>Darsga kirdi</TableHead>
								<TableHead className='font-semibold'>Darsdan chiqdi</TableHead>
								<TableHead className='font-semibold text-right'>
									Umumiy vaqt
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{ATTENDANCE_DATA.map(student => (
								<TableRow
									key={student.id}
									className='hover:bg-muted/30 transition-colors'
								>
									<TableCell className='font-medium py-4 text-foreground'>
										{student.name}
									</TableCell>
									<TableCell className='py-4'>
										{student.status === 'attended' ? (
											<Badge
												variant='outline'
												className='text-green-600 bg-green-50 border-green-200'
											>
												<CheckCircle2 className='w-3 h-3 mr-1.5' /> Qatnashdi
											</Badge>
										) : (
											<Badge
												variant='outline'
												className='text-red-600 bg-red-50 border-red-200'
											>
												<XCircle className='w-3 h-3 mr-1.5' /> Qatnashmadi
											</Badge>
										)}
									</TableCell>
									<TableCell className='py-4 text-muted-foreground'>
										{student.joined}
									</TableCell>
									<TableCell className='py-4 text-muted-foreground'>
										{student.left}
									</TableCell>
									<TableCell className='py-4 text-right'>
										<span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/50 text-xs font-medium text-muted-foreground'>
											<Clock className='w-3.5 h-3.5' /> {student.duration}
										</span>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</Card>
		</div>
	)
}
