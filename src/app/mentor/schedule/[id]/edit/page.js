'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { format } from 'date-fns'
import { uz } from 'date-fns/locale'
import { ArrowLeft, Loader2, Save, Video } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'

export default function MentorEditLessonPage() {
	const router = useRouter()
	const params = useParams()
	const [isLoading, setIsLoading] = useState(false)

	const [formData, setFormData] = useState({
		title: 'React Advanced: Performance Optimization',
		date: '2024-03-26',
		time: '18:00',
		format: 'online',
		description:
			"Darsda React ilovalarini optimallashtirish usullarini ko'rib chiqamiz.",
		zoomLink: 'https://zoom.us/j/123456',
		roomNumber: '',
		maxStudents: '50',
		allowComments: true,
	})

	const handleSave = () => {
		setIsLoading(true)
		setTimeout(() => {
			setIsLoading(false)
			router.push('/mentor/schedule')
		}, 600)
	}

	return (
		<div className='max-w-4xl mx-auto space-y-6 pb-12 w-full'>
			<div className='flex items-center gap-4'>
				<Button
					variant='ghost'
					size='icon'
					onClick={() => router.push('/mentor/schedule')}
					className='rounded-full hover:bg-muted'
				>
					<ArrowLeft className='h-5 w-5' />
				</Button>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>
						Darsni tahrirlash
					</h1>
					<p className='text-muted-foreground text-sm mt-1'>
						Dars ma'lumotlarini o'zgartirish.
					</p>
				</div>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				<div className='md:col-span-2 space-y-6'>
					<Card className='shadow-sm border-muted overflow-hidden rounded-2xl'>
						<CardHeader className='bg-muted/30 border-b pb-5'>
							<CardTitle className='text-lg'>Dars ma'lumotlari</CardTitle>
						</CardHeader>
						<CardContent className='p-6 space-y-6'>
							<div className='space-y-4'>
								<div className='space-y-2'>
									<Label>Dars mavzusi</Label>
									<Input
										value={formData.title}
										onChange={e =>
											setFormData({ ...formData, title: e.target.value })
										}
										className='bg-background rounded-xl h-11'
									/>
								</div>
								<div className='space-y-2'>
									<Label>Tavsif</Label>
									<Textarea
										className='min-h-[120px] bg-background resize-none rounded-xl'
										value={formData.description}
										onChange={e =>
											setFormData({ ...formData, description: e.target.value })
										}
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className='shadow-sm border-muted overflow-hidden rounded-2xl'>
						<CardHeader className='bg-muted/30 border-b pb-5'>
							<CardTitle className='text-lg flex items-center gap-2'>
								<Video className='w-5 h-5 text-blue-500' /> Format va Manzil
							</CardTitle>
						</CardHeader>
						<CardContent className='p-6 space-y-6'>
							<Select
								value={formData.format}
								onValueChange={v => setFormData({ ...formData, format: v })}
							>
								<SelectTrigger className='bg-background max-w-xs h-11 rounded-xl'>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='online'>Online</SelectItem>
									<SelectItem value='offline'>Offline</SelectItem>
									<SelectItem value='hybrid'>Gibrid</SelectItem>
								</SelectContent>
							</Select>

							{(formData.format === 'online' ||
								formData.format === 'hybrid') && (
								<div className='space-y-2'>
									<Label>Zoom Havolasi</Label>
									<Input
										value={formData.zoomLink}
										onChange={e =>
											setFormData({ ...formData, zoomLink: e.target.value })
										}
										className='bg-background rounded-xl h-11'
									/>
								</div>
							)}
						</CardContent>
					</Card>
				</div>

				<div className='space-y-6'>
					<Card className='shadow-sm border-muted overflow-hidden rounded-2xl'>
						<CardHeader className='bg-muted/30 border-b p-4'>
							<CardTitle className='text-base'>Vaqt va Sana</CardTitle>
						</CardHeader>
						<CardContent className='p-4 space-y-5'>
							<div className='space-y-2'>
								<Label>Sana</Label>
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant='outline'
											className='w-full justify-start text-left h-11 rounded-xl'
										>
											{formData.date
												? format(new Date(formData.date), 'PPP', { locale: uz })
												: 'Tanlang'}
										</Button>
									</PopoverTrigger>
									<PopoverContent
										className='w-auto p-0 rounded-2xl overflow-hidden'
										align='start'
									>
										<Calendar
											mode='single'
											selected={new Date(formData.date)}
											onSelect={d =>
												setFormData({
													...formData,
													date: d ? format(d, 'yyyy-MM-dd') : '',
												})
											}
										/>
									</PopoverContent>
								</Popover>
							</div>

							<div className='space-y-2'>
								<Label>Soat</Label>
								<Input
									type='time'
									value={formData.time}
									onChange={e =>
										setFormData({ ...formData, time: e.target.value })
									}
									className='h-11 rounded-xl'
								/>
							</div>
						</CardContent>
						<CardFooter className='p-4 pt-0'>
							<Button
								className='w-full h-11 rounded-xl'
								onClick={handleSave}
								disabled={isLoading}
							>
								{isLoading ? (
									<Loader2 className='h-4 w-4 animate-spin' />
								) : (
									<Save className='h-4 w-4 mr-2' />
								)}
								O'zgarishlarni saqlash
							</Button>
						</CardFooter>
					</Card>
				</div>
			</div>
		</div>
	)
}
