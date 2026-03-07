import { Button } from '@/components/ui/button'
import {
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Briefcase, GraduationCap } from 'lucide-react'

export default function Step1Role({ onNext, isLoading }) {
	// Yuklanish holati uchun Skeleton UI
	if (isLoading) {
		return (
			<>
				<CardHeader className='text-center pt-8 flex flex-col items-center space-y-3'>
					<Skeleton className='h-8 w-48' />
					<Skeleton className='h-4 w-[80%] max-w-[300px]' />
				</CardHeader>

				<CardContent className='space-y-4'>
					<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
						<Skeleton className='h-32 w-full rounded-xl' />
						<Skeleton className='h-32 w-full rounded-xl' />
					</div>
				</CardContent>
			</>
		)
	}

	// Asosiy UI
	return (
		<>
			<CardHeader className='text-center pt-8'>
				<CardTitle className='text-2xl font-bold'>Xush kelibsiz!</CardTitle>
				<CardDescription className='text-base'>
					Iltimos, platformadan foydalanuvchi sifatidagi rolingizni tanlang.
				</CardDescription>
			</CardHeader>

			<CardContent className='space-y-4'>
				<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
					<Button
						variant='outline'
						className='h-32 flex flex-col items-center justify-center space-y-3 hover:bg-primary/5 border-2 hover:border-primary transition-all'
						onClick={() => onNext('student')}
					>
						<GraduationCap className='h-10 w-10 text-primary' />
						<span className='text-lg font-semibold'>Talaba</span>
					</Button>

					<Button
						variant='outline'
						className='h-32 flex flex-col items-center justify-center space-y-3 hover:bg-primary/5 border-2 hover:border-primary transition-all'
						onClick={() => onNext('mentor')}
					>
						<Briefcase className='h-10 w-10 text-primary' />
						<span className='text-lg font-semibold'>Mentor</span>
					</Button>
				</div>
			</CardContent>
		</>
	)
}
