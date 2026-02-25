import { CheckCircle2 } from 'lucide-react'

export default function HowItWorks() {
	const steps = [
		"O'zingizga kerakli fan yoki texnologiyani qidirasiz.",
		'Shu sohada tajribasi bor tengdoshingizni (mentor) tanlaysiz.',
		"Qulay vaqtni belgilab, platforma ichida jonli darsga qo'shilasiz.",
		'Bilimingizni oshirasiz va mentorni baholaysiz.',
	]

	return (
		<section className='w-full py-16 bg-muted/30'>
			<div className='container mx-auto px-4 md:px-8 max-w-4xl'>
				<h2 className='text-3xl font-bold text-center mb-8'>
					Tengdosh ustoz qanday ishlaydi?
				</h2>
				<div className='bg-background border rounded-2xl p-6 md:p-8 shadow-sm'>
					<p className='text-muted-foreground text-lg mb-6 leading-relaxed'>
						Bu platforma an'anaviy ta'limdan farq qiladi. Bu yerda hamma
						o'quvchi va hamma ustoz bo'lishi mumkin. Siz tushunmagan mavzuni
						kechagina shu mavzuni o'zlashtirgan kursdoshingiz eng oddiy,
						"talabacha" tilda tushuntirib beradi.
					</p>
					<div className='grid sm:grid-cols-2 gap-4 mt-6'>
						{steps.map((step, idx) => (
							<div key={idx} className='flex items-start space-x-3'>
								<CheckCircle2 className='h-6 w-6 text-primary flex-shrink-0 mt-0.5' />
								<span className='text-foreground font-medium'>{step}</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	)
}
