import { BookOpenCheck, FileCode2, TrendingUp, Users } from 'lucide-react'

export default function Features() {
	const features = [
		{
			title: 'Mentorlar',
			desc: "O'z ishining ustasi bo'lgan faol talabalar bilan bevosita ishlash.",
			icon: <Users className='h-6 w-6 text-primary' />,
		},
		{
			title: 'Masalalar',
			desc: 'Amaliyot uchun maxsus tuzilgan mantiqiy va dasturlash masalalari.',
			icon: <FileCode2 className='h-6 w-6 text-primary' />,
		},
		{
			title: 'Testlar',
			desc: 'Bilimingizni mustahkamlash uchun qisqa va qiziqarli testlar.',
			icon: <BookOpenCheck className='h-6 w-6 text-primary' />,
		},
		{
			title: "O'sish",
			desc: 'Reytingingizni oshiring va kelajakdagi karyerangiz uchun poydevor quring.',
			icon: <TrendingUp className='h-6 w-6 text-primary' />,
		},
	]

	return (
		<section className='w-full py-16 container mx-auto px-4 md:px-8'>
			<h2 className='text-3xl font-bold text-center mb-10'>
				Tengdosh imkoniyatlari
			</h2>
			<div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6'>
				{features.map((item, idx) => (
					<div
						key={idx}
						className='p-6 rounded-2xl border bg-background hover:shadow-md transition-all group'
					>
						<div className='bg-primary/10 w-12 h-12 flex items-center justify-center rounded-xl mb-4 group-hover:scale-110 transition-transform'>
							{item.icon}
						</div>
						<h3 className='text-xl font-semibold mb-2'>{item.title}</h3>
						<p className='text-muted-foreground text-sm leading-relaxed'>
							{item.desc}
						</p>
					</div>
				))}
			</div>
		</section>
	)
}
