import { Button } from '@/components/ui/button'
import { ArrowDown } from 'lucide-react'
import Link from 'next/link'

export default function Hero() {
	return (
		<section className='w-full py-16 md:py-24 lg:py-32 flex flex-col items-center justify-center text-center px-4'>
			<div className='inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold mb-6 bg-secondary/50 text-secondary-foreground'>
				👋 Hammamiz bir xil yo'ldan o'tganmiz
			</div>

			<h1 className='text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl max-w-4xl mb-6'>
				Tengdoshlarim, keling{' '}
				<span className='text-primary'>birga o'rganamiz!</span>
			</h1>

			<p className='mx-auto max-w-2xl text-muted-foreground md:text-xl leading-relaxed mb-8'>
				Universitetdagi murakkab fanlar va kodlashdagi xatoliklar yolg'iz
				yengish uchun emas. O'zingiz kabi talabalardan dars oling yoki o'z
				tajribangiz bilan bo'lishib, haqiqiy liderga aylaning.
			</p>

			<Link href='/home/about'>
				<Button size='lg' className='gap-2 font-medium'>
					Batafsil o'qish <ArrowDown className='h-4 w-4' />
				</Button>
			</Link>
		</section>
	)
}
