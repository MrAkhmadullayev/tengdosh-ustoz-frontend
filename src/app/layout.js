import { ErrorBoundary } from '@/components/error-boundary'
import { SocketProvider } from '@/components/providers/socket-provider'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/lib/auth-context'
import { I18nProvider } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
	display: 'swap',
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
	display: 'swap',
})

export const metadata = {
	title: {
		template: '%s | Tengdosh Ustoz',
		default: 'Tengdosh Ustoz | Platformasi',
	},
	description:
		'Tengdosh Ustoz platformasi orqali bilimingizni oshiring va ulashing.',
	keywords: [
		'ustoz',
		'shogird',
		'onlayn talim',
		'mentor',
		'darslar',
		'pdp',
		'IT talim',
	],
	authors: [{ name: 'Sadriddin Akhmadullayev' }],
	metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
	openGraph: {
		type: 'website',
		locale: 'uz_UZ',
		url: '/',
		title: 'Tengdosh Ustoz | Platformasi',
		description:
			'Tengdosh Ustoz platformasi orqali bilimingizni oshiring va ulashing.',
		siteName: 'Tengdosh Ustoz',
		images: [
			{
				url: '/logo.png',
				width: 1200,
				height: 630,
				alt: 'Tengdosh Ustoz Cover',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Tengdosh Ustoz | Platformasi',
		description: 'Platformamiz orqali bilim ulashing.',
	},
}

export const viewport = {
	width: 'device-width',
	initialScale: 1,
	maximumScale: 5,
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: '#ffffff' },
		{ media: '(prefers-color-scheme: dark)', color: '#09090b' },
	],
}

export default function RootLayout({ children }) {
	return (
		<html lang='uz' suppressHydrationWarning>
			<body
				className={cn(
					'min-h-screen bg-background font-sans text-foreground antialiased',
					'flex flex-col',
					'selection:bg-primary/20 selection:text-primary',
					geistSans.variable,
					geistMono.variable,
				)}
			>
				<ThemeProvider
					attribute='class'
					defaultTheme='light'
					enableSystem={false}
					disableTransitionOnChange
				>
					<I18nProvider>
						<AuthProvider>
							<SocketProvider>
								<ErrorBoundary>
									<main className='flex-1 flex flex-col relative w-full'>
										{children}
									</main>
								</ErrorBoundary>

								<Toaster
									richColors
									position='top-right'
									closeButton
									duration={4000}
									pauseWhenPageIsHidden
								/>
							</SocketProvider>
						</AuthProvider>
					</I18nProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}
