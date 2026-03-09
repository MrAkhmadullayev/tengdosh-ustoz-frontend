'use client'

import { useTranslation } from '@/lib/i18n'
import { Laptop, Smartphone, Video } from 'lucide-react'

export default function Ecosystem() {
	const { t } = useTranslation()

	const ECOSYSTEM = [
		{
			icon: Laptop,
			title: t('aboutPage.ecosystem.web.title') || 'Web Platforma',
			desc:
				t('aboutPage.ecosystem.web.desc') ||
				"Darslarni boshqarish va dars jadvalini kuzatish uchun to'laqonli web-sayt.",
		},
		{
			icon: Video,
			title: t('aboutPage.ecosystem.video.title') || 'Video Aloqa',
			desc:
				t('aboutPage.ecosystem.video.desc') ||
				'Darslar uchun maxsus qurilgan, kam internet sarflovchi video aloqa tizimi.',
		},
		{
			icon: Smartphone,
			title: t('aboutPage.ecosystem.bot.title') || 'Telegram Bot',
			desc:
				t('aboutPage.ecosystem.bot.desc') ||
				"Darslar haqida eslatmalar va tezkor ro'yxatdan o'tish uchun maxsus bot.",
		},
	]

	return (
		<section className='w-full py-24 container mx-auto px-4 max-w-5xl text-center'>
			<h2 className='text-2xl md:text-3xl font-bold mb-16 tracking-tight'>
				{t('aboutPage.ecosystemTitle') || "To'liq raqamli ekotizim"}
			</h2>
			<div className='grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-8'>
				{ECOSYSTEM.map((eco, idx) => (
					<div key={idx} className='flex flex-col items-center space-y-4 group'>
						<div className='h-16 w-16 bg-muted rounded-xl flex items-center justify-center mb-2 group-hover:bg-primary/10 transition-colors'>
							<eco.icon className='h-8 w-8 text-primary transition-transform group-hover:scale-110' />
						</div>
						<h4 className='font-bold text-base text-foreground uppercase tracking-wider'>
							{eco.title}
						</h4>
						<p className='text-sm text-muted-foreground leading-relaxed text-balance'>
							{eco.desc}
						</p>
					</div>
				))}
			</div>
		</section>
	)
}
