import LandingPage from '@/components/landing/LandingPage'
import { Loader2 } from 'lucide-react'
import { Suspense } from 'react'

// ISR: Sahifa har 1 soatda (3600 soniya) qayta generatsiya qilinadi
export const revalidate = 3600

export default function Home() {
	return (
		<main className='flex min-h-screen flex-col bg-background text-foreground'>
			<Suspense fallback={<LandingSkeleton />}>
				<LandingPage />
			</Suspense>
		</main>
	)
}

// Toza va minimalist yuklanish (Loading) ekrani
function LandingSkeleton() {
	return (
		<div className='flex flex-1 flex-col items-center justify-center min-h-screen space-y-4'>
			<Loader2 className='h-8 w-8 animate-spin text-primary/60' />
			<p className='text-sm font-medium text-muted-foreground animate-pulse'>
				Sahifa yuklanmoqda...
			</p>
		</div>
	)
}
