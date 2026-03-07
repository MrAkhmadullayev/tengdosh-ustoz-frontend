'use client'

import { motion } from 'framer-motion'
import { Maximize2, Terminal } from 'lucide-react'

export default function PlatformMockup() {
	return (
		<section className='w-full py-16 md:py-24 container mx-auto px-4 overflow-hidden relative'>
			<div className='text-center mb-12'>
				<h2 className='text-3xl md:text-4xl font-extrabold mb-4'>
					Platforma ichki ko'rinishi
				</h2>
				<p className='text-muted-foreground text-lg'>
					Hammasi bitta joyda: Darslar, kod yozish va video aloqa.
				</p>
			</div>

			<motion.div
				initial={{ opacity: 0, y: 50 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, margin: '-100px' }}
				transition={{ duration: 0.8, type: 'spring' }}
				className='relative mx-auto max-w-5xl rounded-xl border border-border/50 bg-background/50 shadow-2xl overflow-hidden'
			>
				{/* Mockup Header (Browser tab) */}
				<div className='flex items-center gap-2 px-4 py-3 bg-muted/80 border-b'>
					<div className='flex gap-1.5'>
						<div className='w-3 h-3 rounded-full bg-red-500/80'></div>
						<div className='w-3 h-3 rounded-full bg-yellow-500/80'></div>
						<div className='w-3 h-3 rounded-full bg-green-500/80'></div>
					</div>
					<div className='mx-auto bg-background px-3 py-1 rounded-md text-xs text-muted-foreground flex items-center gap-2'>
						tengdoshustoz.uz/lesson/room-14 <Maximize2 className='w-3 h-3' />
					</div>
				</div>

				{/* Mockup Content (Fake IDE and Video Call) */}
				<div className='flex flex-col md:flex-row h-[400px]'>
					{/* Chap tomon - IDE (Code editor) */}
					<div className='flex-1 p-4 bg-[#0d1117] text-[#c9d1d9] font-mono text-sm overflow-hidden relative'>
						<div className='flex items-center gap-2 mb-4 opacity-50'>
							<Terminal className='w-4 h-4' /> index.js
						</div>
						<pre className='opacity-80'>
							<code className='text-blue-400'>const</code>{' '}
							<code className='text-yellow-300'>peerLearning</code> ={' '}
							<code className='text-blue-400'>async</code> () =&gt; {'{\n'}
							{'  '}const student = await findMentor({'{'} topic:{' '}
							<code className='text-green-400'>'React'</code> {'}'});{'\n'}
							{'  '}if (student.understands) {'{\n'}
							{'    '}return <code className='text-green-400'>"Success!"</code>;
							{'\n'}
							{'  '}
							{'}'}
							{'\n'}
							{'}'}
						</pre>
						{/* Blinking cursor */}
						<motion.div
							animate={{ opacity: [1, 0] }}
							transition={{ repeat: Infinity, duration: 0.8 }}
							className='w-2 h-4 bg-white mt-1'
						></motion.div>
					</div>

					{/* O'ng tomon - Video Chat Preview */}
					<div className='w-full md:w-1/3 bg-muted border-l p-4 flex flex-col gap-4'>
						<div className='flex-1 bg-primary/10 rounded-lg border border-primary/20 flex items-center justify-center relative overflow-hidden'>
							<span className='text-primary font-medium animate-pulse'>
								Mentor Kamerasi
							</span>
						</div>
						<div className='h-1/3 bg-background rounded-lg border flex items-center justify-center'>
							<span className='text-muted-foreground text-sm'>
								Sizning Kamerangiz
							</span>
						</div>
					</div>
				</div>
			</motion.div>
		</section>
	)
}
