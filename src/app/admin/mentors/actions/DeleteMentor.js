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
import api from '@/lib/api'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function DeleteMentorModal() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const actionId = searchParams.get('id')

	const [isDeleting, setIsDeleting] = useState(false)
	const [errorMsg, setErrorMsg] = useState('')

	const closeModal = () => {
		// Tarixni to'ldirib yubormaslik uchun replace ishlatamiz
		router.replace('/admin/mentors')
		router.refresh() // O'chirilgandan so'ng ma'lumotlarni yangilash
	}

	const handleDelete = async () => {
		if (!actionId) return

		setIsDeleting(true)
		setErrorMsg('')

		try {
			const res = await api.delete(`/admin/mentors/${actionId}`)
			if (res?.data?.success) {
				closeModal()
			}
		} catch (error) {
			console.error(error)
			setErrorMsg(
				error.response?.data?.message ||
					"O'chirishda xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.",
			)
		} finally {
			setIsDeleting(false)
		}
	}

	return (
		<Dialog open={true} onOpenChange={closeModal}>
			<DialogContent className='sm:max-w-md border-destructive/20'>
				<DialogHeader className='flex flex-col gap-2'>
					<div className='flex items-center gap-3'>
						<div className='bg-destructive/10 p-3 rounded-full shrink-0 flex items-center justify-center'>
							<AlertTriangle className='h-6 w-6 text-destructive' />
						</div>
						<DialogTitle className='text-destructive text-xl font-bold'>
							Mentorlikdan chetlatish
						</DialogTitle>
					</div>
					<DialogDescription className='mt-2 text-base leading-relaxed text-left'>
						Siz rostdan ham ushbu mentorni tizimdan chetlatmoqchimisiz? Bu
						harakatni orqaga qaytarib bo'lmaydi va mentorning barcha
						faoliyatlari to'xtatiladi.
					</DialogDescription>
				</DialogHeader>

				{errorMsg && (
					<div className='bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm font-medium border border-destructive/20'>
						{errorMsg}
					</div>
				)}

				<DialogFooter className='mt-6 flex flex-col-reverse sm:flex-row gap-2 sm:gap-3'>
					<Button
						variant='outline'
						onClick={closeModal}
						className='w-full sm:w-auto font-medium'
						disabled={isDeleting}
					>
						Bekor qilish
					</Button>
					<Button
						variant='destructive'
						onClick={handleDelete}
						disabled={isDeleting}
						className='w-full sm:w-auto font-semibold gap-2 shadow-sm'
					>
						{isDeleting ? (
							<>
								<Loader2 className='h-4 w-4 animate-spin' /> O'chirilmoqda...
							</>
						) : (
							"O'chirishni tasdiqlash"
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
