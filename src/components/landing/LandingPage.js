import dynamic from 'next/dynamic'
import Hero from './Hero'
import Navbar from './Navbar'

// ==========================================
// 🧩 YORDAMCHI SKELETON (CLS ni oldini olish uchun)
// ==========================================
const SectionSkeleton = ({ className }) => (
	<section className={`w-full bg-muted/10 animate-pulse ${className}`} />
)

// ==========================================
// 📦 DYNAMIC IMPORTS (Dangasa yuklash)
// ==========================================
const PlatformMockup = dynamic(() => import('./PlatformMockup'), {
	loading: () => <SectionSkeleton className='h-[400px] md:h-[600px]' />,
})

const HowItWorks = dynamic(() => import('./HowItWorks'), {
	loading: () => <SectionSkeleton className='h-[500px]' />,
	ssr: true, // SEO uchun muhim bo'lsa, SSR yoniq qoladi
})

const Features = dynamic(() => import('./Features'), {
	loading: () => <SectionSkeleton className='h-[600px] md:h-[800px]' />,
})

const LeaderboardPreview = dynamic(() => import('./LeaderboardPreview'), {
	loading: () => <SectionSkeleton className='h-[400px]' />,
})

const LiveClasses = dynamic(() => import('./LiveClasses'), {
	loading: () => <SectionSkeleton className='h-[500px]' />,
})

const Statistics = dynamic(() => import('./Statistics'), {
	loading: () => <SectionSkeleton className='h-[300px]' />,
})

const Testimonials = dynamic(() => import('./Testimonials'), {
	loading: () => <SectionSkeleton className='h-[400px]' />,
})

const Footer = dynamic(() => import('./Footer'), {
	loading: () => <SectionSkeleton className='h-[300px] bg-muted/20' />,
})

// ==========================================
// 🚀 ASOSIY KOMPONENT
// ==========================================
export default function LandingPage() {
	return (
		<div className='flex min-h-screen flex-col bg-background text-foreground scroll-smooth'>
			<Navbar />
			<main className='flex-1 w-full'>
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
