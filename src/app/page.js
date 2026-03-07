import LandingPage from '@/components/landing/LandingPage'
import { Suspense } from 'react'

export const revalidate = 3600

export default function Home() {
	return (
		<main className='min-h-screen bg-background text-foreground flex flex-col'>
			<Suspense fallback={<LandingSkeleton />}>
				<LandingPage />
			</Suspense>
		</main>
	)
}

function LandingSkeleton() {
	return (
		<div className='flex-1 flex flex-col items-center justify-center min-h-screen space-y-4'>
			<div className='w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin'></div>
			<p className='text-muted-foreground text-sm font-medium animate-pulse'>
				Sahifa yuklanmoqda...
			</p>
		</div>
	)
}
