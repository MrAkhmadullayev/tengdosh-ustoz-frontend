'use client'

import { useTranslation } from '@/lib/i18n'
import { motion } from 'framer-motion'
import { Lock, Terminal } from 'lucide-react'

export default function PlatformMockup() {
	const { t } = useTranslation()

	return (
		<section className='w-full py-16 md:py-24 container mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden'>
			{/* 🏷️ Sarlavha qismi */}
			<div className='text-center mb-12 sm:mb-16 max-w-3xl mx-auto'>
				<h2 className='text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4'>
					{t('landing.mockupTitle') || "Platforma qanday ko'rinishda?"}
				</h2>
				<p className='text-muted-foreground text-base sm:text-lg'>
					{t('landing.mockupDesc') ||
						'Darslar qulay va interaktiv muhitda, maxsus video aloqa hamda real-time kod muharriri orqali olib boriladi.'}
				</p>
			</div>

			{/* 💻 Mockup oynasi */}
			<motion.div
				initial={{ opacity: 0, y: 40 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, margin: '-100px' }}
				transition={{ duration: 0.7, type: 'spring', stiffness: 100 }}
				className='relative mx-auto max-w-5xl rounded-xl border bg-background shadow-2xl overflow-hidden ring-1 ring-border/50'
			>
				{/* Browser Header (Mac style) */}
				<div className='flex items-center justify-between px-4 py-3 bg-muted/30 border-b backdrop-blur-sm'>
					<div className='flex gap-2 items-center w-20'>
						<div className='w-3 h-3 rounded-full bg-red-500/90 shadow-sm' />
						<div className='w-3 h-3 rounded-full bg-amber-500/90 shadow-sm' />
						<div className='w-3 h-3 rounded-full bg-green-500/90 shadow-sm' />
					</div>
					<div className='flex-1 flex justify-center'>
						<div className='bg-background/80 border shadow-sm px-3 py-1.5 rounded-md text-[11px] sm:text-xs font-medium text-muted-foreground flex items-center gap-2 max-w-[250px] w-full justify-center'>
							<Lock className='w-3 h-3' /> platform.tengdoshustoz.uz
						</div>
					</div>
					<div className='w-20' />{' '}
					{/* O'ng tarafni balanslash uchun bo'sh joy */}
				</div>

				{/* Mockup Content */}
				<div className='flex flex-col md:flex-row h-[450px]'>
					{/* Chap tomon: IDE (Code Editor) */}
					<div className='flex-1 p-5 bg-[#0d1117] text-[#c9d1d9] font-mono text-sm sm:text-base overflow-hidden relative'>
						<div className='flex items-center gap-2 mb-6 opacity-60 border-b border-white/10 pb-2 w-fit pr-4'>
							<Terminal className='w-4 h-4' /> <span>lesson.js</span>
						</div>
						<pre className='opacity-90 leading-relaxed overflow-x-auto no-scrollbar'>
							<code className='text-[#ff7b72]'>const</code>{' '}
							<code className='text-[#d2a8ff]'>peerLearning</code> ={' '}
							<code className='text-[#ff7b72]'>async</code> () =&gt; {'{\n'}
							{'  '}const student = await findMentor({'{'} topic:{' '}
							<code className='text-[#a5d6ff]'>'React'</code> {'}'});{'\n'}
							{'  '}if (student.understands) {'{\n'}
							{'    '}return <code className='text-[#a5d6ff]'>"Success!"</code>;
							{'\n'}
							{'  '}
							{'}'}
							{'\n'}
							{'}'}
						</pre>
						{/* Blinking cursor */}
						<motion.div
							animate={{ opacity: [1, 0] }}
							transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
							className='w-2.5 h-5 bg-white/80 mt-1 rounded-sm'
						/>
					</div>

					{/* O'ng tomon: Video Chat (Grid) */}
					<div className='w-full md:w-[320px] bg-muted/10 border-l p-4 flex flex-col gap-4'>
						{/* Mentor Cam */}
						<div className='flex-1 bg-primary/5 rounded-xl border border-primary/20 flex flex-col items-center justify-center relative overflow-hidden group'>
							<div className='absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent' />
							<div className='h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mb-3'>
								<span className='text-xl font-bold text-primary'>M</span>
							</div>
							<span className='text-sm font-semibold text-primary/80 z-10'>
								{t('landing.mockupMentorCam') || 'Mentor ekrani'}
							</span>
							<div className='absolute bottom-3 left-3 flex items-center gap-1.5'>
								<span className='relative flex h-2 w-2'>
									<span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75' />
									<span className='relative inline-flex rounded-full h-2 w-2 bg-red-500' />
								</span>
								<span className='text-[10px] font-bold text-red-500'>LIVE</span>
							</div>
						</div>

						{/* Student Cam */}
						<div className='h-[120px] bg-background rounded-xl border shadow-sm flex items-center justify-center relative overflow-hidden'>
							<span className='text-xs font-medium text-muted-foreground'>
								{t('landing.mockupUserCam') || 'Sizning ekraningiz'}
							</span>
						</div>
					</div>
				</div>
			</motion.div>
		</section>
	)
}
