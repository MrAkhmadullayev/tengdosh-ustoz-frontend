'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	ArrowLeft,
	BookOpen,
	Briefcase,
	CheckCircle2,
	Clock,
	FileText,
	Globe,
	GraduationCap,
	MessageSquare,
	Phone,
	XCircle,
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

export default function ViewApplicationPage() {
	const router = useRouter()
	const { id } = useParams()

	// Mock Data - Arizachi (Talaba) ma'lumoti
	const applicant = {
		id: id || 'APP-001',
		firstName: 'Javohir',
		lastName: 'To‘rayev',
		course: '3-kurs (Bakalavr)',
		specialty: 'Frontend (React, Vue)',
		phone: '+998 90 111 2233',
		status: 'pending',
		cgpa: 4.8,
		appliedDate: '26-Fev, 2026',
		motivationLetter:
			"Assalomu alaykum. Men 1 yildan beri Frontend dasturlash bilan shug'ullanaman va hozirda 2 ta real loyihada qatnashyapman. O'zim bilganlarimni universitetdagi boshqa talabalar bilan bo'lishish, ularga React va zamonaviy web texnologiyalarni o'rgatish istagidaman. Mentorlik orqali ham o'z tajribamni oshirib, ham boshqalarga yordam berishni maqsad qilganman.",
		experience: '1 yil',
		languages: ['O‘zbek tili (Ona tili)', 'Ingliz tili (B1)'],
		skills: ['JavaScript', 'React.js', 'Vue.js', 'Tailwind CSS', 'Redux'],
		portfolioUrl: 'https://github.com/javohir-frontend',
		resumeUrl: '#', // a link to download PDf
	}

	return (
		<div className='max-w-5xl mx-auto space-y-6 pb-12'>
			{/* HEADER */}
			<div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
				<div className='flex items-center gap-4'>
					<Button
						variant='ghost'
						size='icon'
						onClick={() => router.push('/admin/applications')}
						className='rounded-full hover:bg-muted'
					>
						<ArrowLeft className='h-5 w-5' />
					</Button>
					<div>
						<h1 className='text-2xl font-bold tracking-tight'>
							Arizani ko'rib chiqish
						</h1>
						<p className='text-muted-foreground text-sm font-medium'>
							Ariza ID: <span className='text-primary'>{applicant.id}</span>
						</p>
					</div>
				</div>
				<div className='flex w-full sm:w-auto gap-2'>
					{applicant.status === 'pending' && (
						<>
							<Button
								variant='outline'
								className='w-full sm:w-auto gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200'
								onClick={() => router.push('/admin/applications')}
							>
								<XCircle className='h-4 w-4' /> Rad etish
							</Button>
							<Button
								className='w-full sm:w-auto gap-2 bg-green-600 hover:bg-green-700'
								onClick={() => router.push('/admin/applications')}
							>
								<CheckCircle2 className='h-4 w-4' /> Qabul qilish
							</Button>
						</>
					)}
					{applicant.status === 'approved' && (
						<Badge className='bg-green-100 text-green-700 px-4 py-2 text-sm'>
							Qabul qilingan
						</Badge>
					)}
					{applicant.status === 'rejected' && (
						<Badge className='bg-red-100 text-red-700 px-4 py-2 text-sm'>
							Rad etilgan
						</Badge>
					)}
				</div>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* CHAP TOMON: ASOSIY PROFIL KARTASI */}
				<div className='lg:col-span-1 space-y-6'>
					<Card className='border-none shadow-md bg-card overflow-hidden'>
						{/* Orqa fon cover uchun */}
						<div className='h-24 bg-gradient-to-r from-orange-500 to-yellow-500 w-full relative'></div>
						<CardContent className='pt-0 flex flex-col items-center px-6 relative'>
							<Avatar className='h-24 w-24 border-4 border-background shadow-lg -mt-12 mb-4 ring-2 ring-primary/10 bg-background'>
								<AvatarFallback className='bg-orange-50 text-orange-600 font-bold text-2xl'>
									{applicant.firstName[0]}
									{applicant.lastName[0]}
								</AvatarFallback>
							</Avatar>

							<h2 className='text-xl font-bold text-center tracking-tight'>
								{applicant.firstName} {applicant.lastName}
							</h2>
							<p className='text-primary font-medium text-sm text-center mt-1'>
								{applicant.specialty}
							</p>

							{/* Shaxsiy qisqacha ma'lumot qatorlari */}
							<div className='w-full space-y-4 py-6 mt-4 border-t border-muted'>
								<div className='flex items-center gap-3 text-sm'>
									<div className='bg-muted p-2 rounded-md shrink-0'>
										<Phone className='h-4 w-4 text-muted-foreground' />
									</div>
									<div className='flex-1'>
										<p className='text-xs text-muted-foreground'>
											Telefon raqam
										</p>
										<p className='font-medium'>{applicant.phone}</p>
									</div>
								</div>
								<div className='flex items-center gap-3 text-sm'>
									<div className='bg-muted p-2 rounded-md shrink-0'>
										<GraduationCap className='h-4 w-4 text-muted-foreground' />
									</div>
									<div className='flex-1'>
										<p className='text-xs text-muted-foreground'>Kursi</p>
										<p className='font-medium'>{applicant.course}</p>
									</div>
								</div>
								<div className='flex items-center gap-3 text-sm'>
									<div className='bg-muted p-2 rounded-md shrink-0'>
										<Star className='h-4 w-4 text-muted-foreground' />
									</div>
									<div className='flex-1'>
										<p className='text-xs text-muted-foreground'>
											CGPA Reytingi
										</p>
										<p className='font-medium text-yellow-600'>
											{applicant.cgpa}
										</p>
									</div>
								</div>
								<div className='flex items-center gap-3 text-sm'>
									<div className='bg-muted p-2 rounded-md shrink-0'>
										<Clock className='h-4 w-4 text-muted-foreground' />
									</div>
									<div className='flex-1'>
										<p className='text-xs text-muted-foreground'>
											Ariza sanasi
										</p>
										<p className='font-medium'>{applicant.appliedDate}</p>
									</div>
								</div>
							</div>

							<Button
								variant='outline'
								className='w-full gap-2 mt-2'
								onClick={() =>
									router.push(`/admin/students/${applicant.id}/message`)
								}
							>
								<MessageSquare className='h-4 w-4' /> Talabaga yozish
							</Button>
						</CardContent>
					</Card>
				</div>

				{/* O'NG TOMON: BOSHQA MA'LUMOTLAR */}
				<div className='lg:col-span-2 space-y-6'>
					{/* MOTIVATSIYON XAT */}
					<Card className='shadow-sm border-muted'>
						<CardHeader className='pb-3'>
							<CardTitle className='text-lg flex items-center gap-2'>
								<FileText className='h-5 w-5 text-primary' /> Motivatsion Xat
								(Nima uchun mentor bo'lmoqchi?)
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='bg-muted/30 p-4 rounded-lg border italic text-muted-foreground text-sm leading-relaxed'>
								"{applicant.motivationLetter}"
							</div>
						</CardContent>
					</Card>

					{/* TILLAR VA KO'NIKMALAR */}
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<Card className='shadow-sm border-muted'>
							<CardHeader className='pb-3'>
								<CardTitle className='text-base flex items-center gap-2'>
									<Globe className='h-4 w-4 text-primary' /> Tillarni bilishi
								</CardTitle>
							</CardHeader>
							<CardContent>
								<ul className='space-y-3'>
									{applicant.languages.map((lang, idx) => (
										<li
											key={idx}
											className='flex items-center gap-2 text-sm font-medium'
										>
											<div className='h-1.5 w-1.5 rounded-full bg-primary/70 shrink-0' />
											{lang}
										</li>
									))}
								</ul>
							</CardContent>
						</Card>

						<Card className='shadow-sm border-muted'>
							<CardHeader className='pb-3'>
								<CardTitle className='text-base flex items-center gap-2'>
									<Briefcase className='h-4 w-4 text-primary' /> Texnik
									ko'nikmalar
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='flex flex-wrap gap-2'>
									{applicant.skills.map((skill, idx) => (
										<Badge
											key={idx}
											variant='secondary'
											className='bg-primary/5 hover:bg-primary/10 text-foreground border border-primary/10'
										>
											{skill}
										</Badge>
									))}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* PORTFOLIO & RESUME */}
					<Card className='shadow-sm border-muted'>
						<CardHeader>
							<CardTitle className='text-lg flex items-center gap-2'>
								<BookOpen className='h-5 w-5 text-primary' /> Portfolio va CV
							</CardTitle>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='flex items-center justify-between p-3 border rounded-lg bg-card'>
								<div className='flex items-center gap-3'>
									<div className='bg-primary/10 p-2 rounded-md'>
										<Globe className='h-5 w-5 text-primary' />
									</div>
									<div>
										<p className='text-sm font-semibold'>
											Github / Portfolio linki
										</p>
										<a
											href={applicant.portfolioUrl}
											target='_blank'
											className='text-xs text-blue-600 hover:underline'
										>
											{applicant.portfolioUrl}
										</a>
									</div>
								</div>
								<Button variant='outline' size='sm'>
									Ochish
								</Button>
							</div>

							<div className='flex items-center justify-between p-3 border rounded-lg bg-card'>
								<div className='flex items-center gap-3'>
									<div className='bg-primary/10 p-2 rounded-md'>
										<FileText className='h-5 w-5 text-primary' />
									</div>
									<div>
										<p className='text-sm font-semibold'>
											Talaba Rezyumesi (CV)
										</p>
										<p className='text-xs text-muted-foreground border border-muted-foreground w-fit mt-1 px-1 py-0.5 rounded text-[10px] font-mono'>
											PDF hujjat
										</p>
									</div>
								</div>
								<Button variant='secondary' size='sm'>
									Yuklab olish
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}

function Star({ className }) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 24 24'
			fill='currentColor'
			className={className}
		>
			<path
				fillRule='evenodd'
				d='M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z'
				clipRule='evenodd'
			/>
		</svg>
	)
}
