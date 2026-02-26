'use client'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { AlertTriangle } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function DeleteTalabaModal() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const actionId = searchParams.get('id')

	const closeModal = () => {
		router.push('/admin/students') // URLni tozalaydi, modal yopiladi
	}

	const handleDelete = () => {
		// O'chirish mantig'ini shu yerga yozish mumkin (API call)
		console.log(`Talaba ${actionId} o'chirildi.`)
		closeModal()
	}

	return (
		<Dialog open={true} onOpenChange={closeModal}>
			<DialogContent className='sm:max-w-md border-red-500/20'>
				<DialogHeader>
					<div className='flex items-center gap-3'>
						<div className='bg-red-500/10 p-3 rounded-full shrink-0'>
							<AlertTriangle className='h-6 w-6 text-red-600' />
						</div>
						<DialogTitle className='text-red-600'>
							Talabalikdan chetlatish
						</DialogTitle>
					</div>
					<DialogDescription className='mt-3'>
						Siz rostdan ham ushbu talabani tizimdan chetlatmoqchimisiz? Bu
						harakatni orqaga qaytarib bo'lmaydi va talabaning barcha
						faoliyatlari to'xtatiladi. (ID: {actionId || "Noma'lum"})
					</DialogDescription>
				</DialogHeader>

				<DialogFooter className='mt-4 flex flex-col sm:flex-row gap-2'>
					<Button
						variant='outline'
						onClick={closeModal}
						className='w-full sm:w-auto'
					>
						Bekor qilish
					</Button>
					<Button
						onClick={handleDelete}
						className='bg-red-500 hover:bg-red-600 text-white w-full sm:w-auto'
					>
						O'chirishni tasdiqlash
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
