'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	Calendar,
	Mail,
	MapPin,
	Pencil,
	Phone,
	ShieldCheck,
	User,
} from 'lucide-react'
import Link from 'next/link'

export default function UserProfilePage() {
	// Mock user ma'lumotlari
	const user = {
		name: 'Sadriddin',
		role: 'Admin',
		email: 'sadriddin@example.com',
		phone: '+998 90 123 45 67',
		location: "Toshkent, O'zbekiston",
		joinedDate: 'Yanvar, 2024',
		bio: "Tizim administratori va Frontend dasturchi. Platformani rivojlantirishga mas'ul.",
		skills: ['React', 'Next.js', 'Tailwind CSS', 'Management'],
	}

	return (
		<div className='max-w-4xl mx-auto space-y-8'>
			{/* Profile Header */}
			<div className='relative'>
				<div className='h-32 sm:h-48 bg-gradient-to-r from-primary/20 to-primary/5 rounded-3xl' />
				<div className='absolute -bottom-12 left-8 flex items-end gap-6'>
					<Avatar className='h-24 w-24 sm:h-32 sm:w-32 border-4 border-background shadow-xl rounded-2xl'>
						<AvatarFallback className='bg-primary/10 text-primary text-3xl font-bold'>
							SA
						</AvatarFallback>
					</Avatar>
					<div className='pb-4 space-y-1'>
						<h1 className='text-2xl sm:text-3xl font-bold tracking-tight'>
							{user.name}
						</h1>
						<div className='flex items-center gap-2'>
							<Badge variant='secondary' className='rounded-md'>
								<ShieldCheck className='w-3 h-3 mr-1' /> {user.role}
							</Badge>
							<span className='text-sm text-muted-foreground flex items-center gap-1'>
								<Calendar className='w-3 h-3' /> {user.joinedDate} dan beri a'zo
							</span>
						</div>
					</div>
				</div>
				<div className='absolute -bottom-12 right-8 pb-4'>
					<Link href='/users/settings'>
						<Button className='rounded-xl gap-2 shadow-lg shadow-primary/20'>
							<Pencil className='w-4 h-4' /> Profilni tahrirlash
						</Button>
					</Link>
				</div>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 text-foreground'>
				{/* Left Column: Info Card */}
				<div className='space-y-6'>
					<Card className='shadow-sm border-muted rounded-2xl overflow-hidden'>
						<CardHeader className='bg-muted/30 border-b pb-4'>
							<CardTitle className='text-sm font-semibold uppercase tracking-wider text-muted-foreground'>
								Ma'lumotlar
							</CardTitle>
						</CardHeader>
						<CardContent className='pt-6 space-y-4 text-foreground'>
							<div className='flex items-start gap-3'>
								<div className='bg-blue-50 p-2 rounded-lg text-blue-600'>
									<Mail className='w-4 h-4' />
								</div>
								<div className='space-y-1'>
									<p className='text-xs text-muted-foreground'>Email</p>
									<p className='text-sm font-medium'>{user.email}</p>
								</div>
							</div>
							<div className='flex items-start gap-3 text-foreground'>
								<div className='bg-green-50 p-2 rounded-lg text-green-600'>
									<Phone className='w-4 h-4' />
								</div>
								<div className='space-y-1'>
									<p className='text-xs text-muted-foreground'>Telefon</p>
									<p className='text-sm font-medium'>{user.phone}</p>
								</div>
							</div>
							<div className='flex items-start gap-3'>
								<div className='bg-orange-50 p-2 rounded-lg text-orange-600'>
									<MapPin className='w-4 h-4' />
								</div>
								<div className='space-y-1'>
									<p className='text-xs text-muted-foreground'>Manzil</p>
									<p className='text-sm font-medium'>{user.location}</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Right Column: Bio & More */}
				<div className='md:col-span-2 space-y-6'>
					<Card className='shadow-sm border-muted rounded-2xl'>
						<CardHeader className='border-b pb-4'>
							<CardTitle className='text-lg flex items-center gap-2'>
								<User className='w-5 h-5 text-primary' /> Men haqimda
							</CardTitle>
						</CardHeader>
						<CardContent className='pt-6'>
							<p className='text-muted-foreground leading-relaxed'>
								{user.bio}
							</p>
						</CardContent>
					</Card>

					<Card className='shadow-sm border-muted rounded-2xl'>
						<CardHeader className='border-b pb-4'>
							<CardTitle className='text-lg flex items-center gap-2'>
								<ShieldCheck className='w-5 h-5 text-primary' /> Ko'nikmalar
							</CardTitle>
						</CardHeader>
						<CardContent className='pt-6'>
							<div className='flex flex-wrap gap-2 text-foreground'>
								{user.skills.map(skill => (
									<Badge
										key={skill}
										variant='outline'
										className='px-3 py-1 rounded-full bg-primary/5 border-primary/20 text-primary-foreground'
									>
										{skill}
									</Badge>
								))}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}
