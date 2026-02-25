import Features from './Features'
import Footer from './Footer'
import Hero from './Hero'
import HowItWorks from './HowItWorks'
import LiveClasses from './LiveClasses'
import Navbar from './Navbar'
import Statistics from './Statistics'

export default function LandingPage() {
	return (
		<div className='flex min-h-screen flex-col bg-background text-foreground'>
			<Navbar />

			<main className='flex-1'>
				<Hero />
				<HowItWorks />
				<Features />
				<LiveClasses />
				<Statistics />
			</main>

			<Footer />
		</div>
	)
}
