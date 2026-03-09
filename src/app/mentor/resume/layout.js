import { Suspense } from 'react'

export const metadata = {
	title: 'Ustoz Rezyumesi | TengdoshUstoz',
}

export default function MentorResumeLayout({ children }) {
	return (
		<div className='min-h-screen bg-muted/30 flex flex-col items-center justify-center p-4 md:p-8'>
			<Suspense fallback={<div className='animate-pulse'>Yuklanmoqda...</div>}>
				{children}
			</Suspense>
		</div>
	)
}
