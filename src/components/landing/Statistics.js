export default function Statistics() {
	return (
		<section className='w-full py-16'>
			<div className='container mx-auto px-4 md:px-8'>
				<div className='grid sm:grid-cols-3 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-border text-center'>
					<div className='flex flex-col space-y-2 py-4 sm:py-0'>
						<span className='text-4xl md:text-5xl font-extrabold text-primary'>
							+19,967
						</span>
						<span className='text-muted-foreground font-medium'>
							Umumiy o'quvchilar soni
						</span>
					</div>
					<div className='flex flex-col space-y-2 py-4 sm:py-0'>
						<span className='text-4xl md:text-5xl font-extrabold text-primary'>
							+768
						</span>
						<span className='text-muted-foreground font-medium'>
							Yozilgan darslar soni
						</span>
					</div>
					<div className='flex flex-col space-y-2 py-4 sm:py-0'>
						<span className='text-4xl md:text-5xl font-extrabold text-primary'>
							+7 yil
						</span>
						<span className='text-muted-foreground font-medium'>
							O'rtacha jamoaviy tajriba
						</span>
					</div>
				</div>
			</div>
		</section>
	)
}
