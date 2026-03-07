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
		question: "Tengdosh ustoz platformasi o'zi nima?",
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
			"Mentor bo'lish uchun profilingiz sozlamalaridan 'Mentor bo'lish' tugmasini bosishingiz kerak. Shundan so'ng sizning o'zlashtirish ko'rsatkichingiz (baho yoki sertifikatlar) tizim adminlari tomonidan tasdiqlanadi va siz dars o'tish huquqiga ega bo'lasiz.",
	},
	{
		value: 'item-4',
		question: 'Mentorlarning bilim darajasi qanday nazorat qilinadi?',
		answer:
			"Platformada ochiq va shaffof reyting tizimi mavjud. Har bir o'tilgan darsdan so'ng, o'quvchilar mentorga 1 dan 5 gacha baho beradi va izoh qoldiradi. Past baho olgan mentorlar tizim tomonidan avtomatik ravishda ogohlantiriladi yoki faoliyati cheklanadi.",
	},
	{
		value: 'item-5',
		question: "Darslar qanday formatda o'tiladi?",
		answer:
			"Darslar to'g'ridan-to'g'ri platformaning o'zida, ichki video-konferensiya tizimi (Zoom muqobili) orqali o'tiladi. Bunda siz ekranni ulashishingiz, chatda yozishishingiz va interaktiv doskadan foydalanishingiz mumkin.",
	},
	{
		value: 'item-6',
		question: 'Individual (yakkama-yakka) va guruhli darslarning farqi nima?',
		answer:
			"Individual darslarda mentor faqat siz bilan ishlaydi va e'tibor 100% sizning xatolaringizga qaratiladi. Guruhli darslarda esa bir nechta talaba bir vaqtda qatnashib, jamoaviy muhitda o'rganishadi.",
	},
	{
		value: 'item-7',
		question: "Darsga yozilgandan so'ng internetim uzilib qolsa nima bo'ladi?",
		answer:
			"Agar texnik sabablarga ko'ra darsga qatnasha olmasangiz, dars yozib olingan (record) bo'lsa, uni keyinchalik ko'rishingiz mumkin. Shuningdek, mentor bilan kelishib, vaqtini boshqa kunga ko'chirish imkoniyati ham bor.",
	},
	{
		value: 'item-8',
		question: 'Darslarni yozib olish (rekord) imkoniyati bormi?',
		answer:
			"Guruhli ochiq darslar odatda mentor tomonidan yozib olinadi va dars tugagach profilingizdagi 'Mening darslarim' bo'limida saqlanib qoladi. E'tibor bering, barchasi tekin taqdim etiladi.",
	},
	{
		value: 'item-9',
		question:
			"O'zim o'qiyotgan universitetdagi talabalardan tashqari boshqalardan ham dars olsam bo'ladimi?",
		answer:
			"Hozirgi bosqichda platforma aynan bitta universitet ichidagi talabalar uchun yopiq ekotizim sifatida ishlaydi. Biroq, kelajakda boshqa universitetlarning eng kuchli talabalari ham tizimga qo'shilishi rejalashtirilgan.",
	},
	{
		value: 'item-10',
		question: "Qanday yo'nalishlar bo'yicha mentor topsam bo'ladi?",
		answer:
			"Platformada IT yo'nalishlari (Dasturlash, Dizayn, Ma'lumotlar bazasi, Algoritmlar)dan tortib, tillar (Ingliz tili, IELTS) va aniq fanlar (Oliy matematika, Fizika) bo'yicha ham ustozlar topish mumkin.",
	},
]

const containerVariants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: { staggerChildren: 0.1 },
	},
}

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	show: {
		opacity: 1,
		y: 0,
		transition: { type: 'spring', stiffness: 300, damping: 24 },
	},
}

export default function FAQPage() {
	return (
		<div className='min-h-screen bg-background flex flex-col'>
			<Navbar />

			<main className='container mx-auto px-4 py-12 md:py-20 max-w-4xl flex-1'>
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className='text-center mb-12'
				>
					<div className='inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4'>
						<MessageCircleQuestion className='h-8 w-8 text-primary' />
					</div>
					<h1 className='text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-foreground'>
						Ko'p beriladigan savollar
					</h1>
					<p className='text-muted-foreground text-lg max-w-2xl mx-auto'>
						Platforma qanday ishlashi, mentorlik va dars jarayonlari haqida
						barcha savollaringizga shu yerdan javob topishingiz mumkin.
					</p>
				</motion.div>

				<motion.div
					variants={containerVariants}
					initial='hidden'
					animate='show'
					className='bg-card border rounded-2xl p-4 md:p-8 shadow-sm'
				>
					<Accordion type='single' collapsible className='w-full'>
						{FAQ_DATA.map(faq => (
							<motion.div variants={itemVariants} key={faq.value}>
								<AccordionItem
									value={faq.value}
									className='border-b last:border-none'
								>
									<AccordionTrigger className='text-left font-semibold text-base md:text-lg py-5 hover:text-primary transition-colors'>
										{faq.question}
									</AccordionTrigger>
									<AccordionContent className='text-muted-foreground text-[15px] leading-relaxed pb-5 pr-8'>
										{faq.answer}
									</AccordionContent>
								</AccordionItem>
							</motion.div>
						))}
					</Accordion>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
					className='mt-16 bg-muted/50 border rounded-2xl p-8 text-center flex flex-col items-center'
				>
					<h3 className='text-xl font-bold mb-2'>
						Savolingizga javob topmadingizmi?
					</h3>
					<p className='text-muted-foreground mb-6 max-w-md'>
						Bizning qo'llab-quvvatlash xizmatimiz sizga yordam berishga doim
						tayyor. Biz bilan bog'laning!
					</p>
					<Link href='/home/support'>
						<Button
							size='lg'
							className='gap-2 transition-transform hover:scale-105'
						>
							<Mail className='h-4 w-4' /> Qo'llab-quvvatlashga yozish
						</Button>
					</Link>
				</motion.div>
			</main>
		</div>
	)
}
