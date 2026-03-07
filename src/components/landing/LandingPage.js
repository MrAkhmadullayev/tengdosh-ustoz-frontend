import dynamic from 'next/dynamic'
import Hero from './Hero'
import LiveAlerts from './LiveAlerts'
import Navbar from './Navbar'

const PlatformMockup = dynamic(() => import('./PlatformMockup'))

const HowItWorks = dynamic(() => import('./HowItWorks'), {
	loading: () => (
		<div className='h-64 flex items-center justify-center animate-pulse bg-muted/20'>
			Yuklanmoqda...
		</div>
	),
	ssr: true,
})

const Features = dynamic(() => import('./Features'), {
	loading: () => <div className='h-96 bg-muted/10 animate-pulse'></div>,
})

const LeaderboardPreview = dynamic(() => import('./LeaderboardPreview'))

const LiveClasses = dynamic(() => import('./LiveClasses'), {
	loading: () => <div className='h-96 bg-muted/10 animate-pulse'></div>,
})

const Statistics = dynamic(() => import('./Statistics'), {
	loading: () => <div className='h-48 bg-muted/10 animate-pulse'></div>,
})

const Testimonials = dynamic(() => import('./Testimonials'))

const Footer = dynamic(() => import('./Footer'))

export default function LandingPage() {
	return (
		<div className='flex min-h-screen flex-col bg-background text-foreground scroll-smooth'>
			<LiveAlerts />
			<Navbar />
			<main className='flex-1'>
				<Hero />
				<PlatformMockup />
				<HowItWorks />
				<Features />
				<LeaderboardPreview />
				<LiveClasses />
				<Statistics />
				<Testimonials />
			</main>
			<Footer />
		</div>
	)
}
