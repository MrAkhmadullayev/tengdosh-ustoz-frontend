'use client'

import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n'
import { ArrowRight, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

export default function AboutCTA() {
	const { t } = useTranslation()
	const router = useRouter()
	const [isPending, startTransition] = useTransition()
	const [navPath, setNavPath] = useState('')

	const handleNav = path => {
		setNavPath(path)
		startTransition(() => router.push(path))
	}

	return (
		<section className='relative w-full py-24 bg-card border-t text-center overflow-hidden'>
			<div className='absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-0' />
			<div className='container mx-auto px-4 relative z-10'>
				<h2 className='text-3xl md:text-4xl font-extrabold mb-4 tracking-tight'>
					{t('aboutPage.ctaTitle') || "Hamjamiyatga qo'shiling"}
				</h2>
				<p className='text-muted-foreground mb-10 max-w-2xl mx-auto text-base sm:text-lg'>
					{t('aboutPage.ctaDesc') ||
						"Hoziroq o'zingizga munosib mentor toping yoki bilimingizni ulashib o'z hamjamiyatingizni quring."}
				</p>

				<div className='flex flex-col sm:flex-row justify-center items-center gap-3'>
					<Button
						size='lg'
						disabled={isPending && navPath === '/home/mentors'}
						onClick={() => handleNav('/home/mentors')}
						className='w-full sm:w-auto font-bold h-12 px-8'
					>
						{isPending && navPath === '/home/mentors' ? (
							<Loader2 className='animate-spin h-5 w-5' />
						) : (
							<>
								{t('aboutPage.findMentor') || 'Mentor topish'}{' '}
								<ArrowRight className='ml-2 h-4 w-4' />
							</>
						)}
					</Button>

					<Button
						size='lg'
						variant='outline'
						disabled={isPending && navPath === '/authentication'}
						onClick={() => handleNav('/authentication')}
						className='w-full sm:w-auto font-bold h-12 px-8'
					>
						{isPending && navPath === '/authentication' ? (
							<Loader2 className='animate-spin h-5 w-5' />
						) : (
							t('aboutPage.becomeMentor') || "Mentor bo'lish"
						)}
					</Button>
				</div>
			</div>
		</section>
	)
}
