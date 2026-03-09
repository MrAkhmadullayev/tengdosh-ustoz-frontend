'use client'

import Footer from '@/components/landing/Footer'
import Navbar from '@/components/landing/Navbar'
import AboutCTA from './components/AboutCTA'
import AboutHero from './components/AboutHero'
import Benefits from './components/Benefits'
import Ecosystem from './components/Ecosystem'
import ProblemSolution from './components/ProblemSolution'

export default function AboutPage() {
	return (
		<div className='min-h-screen bg-background flex flex-col overflow-hidden'>
			<Navbar />
			<main className='flex-1'>
				<AboutHero />
				<ProblemSolution />
				<Benefits />
				<Ecosystem />
				<AboutCTA />
			</main>
			<Footer />
		</div>
	)
}
