'use client'

import Navbar from '@/components/landing/Navbar'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Mail, MessageCircleQuestion } from 'lucide-react'
import Link from 'next/link'

const FAQ_DATA = [
	{
		value: 'item-1',
		question: "TengdoshUstoz platformasi o'zi nima?",
		answer:
			"Bu platforma universitet talabalari o'rtasida bilim almashish tizimidir. Ya'ni, qaysidir fanni yaxshi tushungan talaba (Mentor) boshqa oqsab borayotgan yoki endi o'rganayotgan talabaga (Mentee) dars o'tishi va tajriba ulashishi mumkin.",
	},
	{
		value: 'item-2',
		question: "Platformadan ro'yxatdan o'tish bepulmi?",
		answer:
			"Ha, platformaga a'zo bo'lish, ustozlarni qidirish va ochiq jonli darslarga qo'shilish mutlaqo bepul. Bizning maqsadimiz talabalar o'rtasida tekin va o'zaro manfaatli bilim almashish muhitini yaratishdir.",
	},
	{
		value: 'item-3',
		question: "Qanday qilib mentor (ustoz) bo'lishim mumkin?",
		answer:
			"Mentor bo'lish uchun profilingiz sozlamalaridan 'Mentor bo'lish' tugmasini bosishingiz kerak. Shundan so'ng sizning o'zlashtirish ko'rsatkichingiz tizim adminlari tomonidan tasdiqlanadi va siz dars o'tish huquqiga ega bo'lasiz.",
	},
	{
		value: 'item-4',
		question: 'Mentorlarning bilim darajasi qanday nazorat qilinadi?',
		answer:
			"Platformada shaffof reyting tizimi mavjud. Har bir darsdan so'ng o'quvchilar mentorga baho beradi. Past baho olgan mentorlar tizim tomonidan ogohlantiriladi yoki faoliyati cheklanadi.",
	},
	{
		value: 'item-5',
		question: "Darslar qanday formatda o'tiladi?",
		answer:
			"Darslar to'g'ridan-to'g'ri platformaning o'zida, ichki video-konferensiya tizimi orqali onlayn o'tiladi. Bunda ekranni ulashish, chat va interaktiv doska imkoniyatlari mavjud.",
	},
	{
		value: 'item-6',
		question: 'Individual va guruhli darslarning farqi nima?',
		answer:
			"Individual darslarda mentor faqat siz bilan ishlaydi. Guruhli darslarda esa bir nechta talaba bir vaqtda qatnashib, jamoaviy muhitda o'rganishadi.",
	},
	{
		value: 'item-7',
		question: "Darsga yozilgandan so'ng texnik muammo bo'lsa nima bo'ladi?",
		answer:
			"Agar dars yozib olingan bo'lsa, uni keyinchalik ko'rishingiz mumkin. Aks holda, mentor bilan bog'lanib, masalani hal qilishingiz tavsiya etiladi.",
	},
]

const containerVariants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: { staggerChildren: 0.05 },
	},
}

const itemVariants = {
	hidden: { opacity: 0, y: 10 },
	show: {
		opacity: 1,
		y: 0,
		transition: { type: 'spring', stiffness: 300, damping: 24 },
	},
}

export default function FAQPage() {
	return (
		<div className='min-h-screen bg-muted/20 flex flex-col'>
			<Navbar />

			<main className='container mx-auto px-4 py-12 md:py-20 max-w-3xl flex-1'>
				{/* 🏷️ Header Section */}
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}
					className='text-center mb-12 space-y-3'
				>
					<div className='inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-2'>
						<MessageCircleQuestion className='h-6 w-6' />
					</div>
					<h1 className='text-3xl md:text-4xl font-extrabold tracking-tight text-foreground'>
						Ko'p beriladigan savollar
					</h1>
					<p className='text-muted-foreground text-sm sm:text-base max-w-xl mx-auto'>
						Platforma, mentorlik va ta'lim jarayoni haqida eng ko'p beriladigan
						savollarga javoblar.
					</p>
				</motion.div>

				{/* 🛠️ FAQ Accordion */}
				<motion.div
					variants={containerVariants}
					initial='hidden'
					animate='show'
					className='bg-card border rounded-xl shadow-sm overflow-hidden'
				>
					<Accordion type='single' collapsible className='w-full'>
						{FAQ_DATA.map((faq, idx) => (
							<motion.div variants={itemVariants} key={faq.value}>
								<AccordionItem
									value={faq.value}
									className={`px-6 border-b last:border-none transition-colors hover:bg-muted/30 ${idx === 0 ? 'border-t-0' : ''}`}
								>
									<AccordionTrigger className='text-left font-semibold text-sm md:text-base py-5 hover:no-underline'>
										{faq.question}
									</AccordionTrigger>
									<AccordionContent className='text-muted-foreground text-sm leading-relaxed pb-5'>
										{faq.answer}
									</AccordionContent>
								</AccordionItem>
							</motion.div>
						))}
					</Accordion>
				</motion.div>

				{/* ✉️ Contact CTA */}
				<motion.div
					initial={{ opacity: 0, scale: 0.98 }}
					whileInView={{ opacity: 1, scale: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.4 }}
					className='mt-16 bg-background border rounded-xl p-8 text-center flex flex-col items-center shadow-sm'
				>
					<h3 className='text-lg font-bold text-foreground mb-2'>
						Savolingizga javob topmadingizmi?
					</h3>
					<p className='text-sm text-muted-foreground mb-6 max-w-sm'>
						Qo'llab-quvvatlash xizmati bilan bog'laning, biz sizga yordam
						berishga doim tayyormiz.
					</p>
					<Link href='/home/support'>
						<Button className='gap-2 font-semibold shadow-md'>
							<Mail className='h-4 w-4' /> Bog'lanish
						</Button>
					</Link>
				</motion.div>
			</main>
		</div>
	)
}
