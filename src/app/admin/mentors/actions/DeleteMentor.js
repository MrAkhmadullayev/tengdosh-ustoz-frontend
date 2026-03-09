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
import { useTranslation } from '@/lib/i18n'
import { getErrorMessage } from '@/lib/utils'
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export default function DeleteMentorModal({ onSuccess }) {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const actionId = searchParams.get('id')

	const { t } = useTranslation()
	const [isDeleting, setIsDeleting] = useState(false)

	// Modalni yopish (URL dagi ?action=delete parametrlarni tozalaydi)
	const closeModal = () => {
		router.replace(pathname, { scroll: false })
	}

	// O'chirish logikasi
	const handleDelete = async () => {
		if (!actionId) return

		setIsDeleting(true)

		try {
			const res = await api.delete(`/admin/mentors/${actionId}`)

			if (res?.data?.success) {
				toast.success(
					t('mentors.deleteSuccess') ||
						'Mentor muvaffaqiyatli tizimdan chetlatildi',
				)

				// 🚀 O'ta muhim qism: Asosiy sahifaga o'chgan ID ni yuboramiz.
				// U sahifani refresh qilmasdan, aynan shu qatorni jadvaldan qirqib oladi!
				if (onSuccess) {
					onSuccess(actionId)
				}

				closeModal()
			}
		} catch (error) {
			toast.error(
				getErrorMessage(
					error,
					t('errors.deleteFailed') || "O'chirishda xatolik yuz berdi.",
				),
			)
		} finally {
			setIsDeleting(false)
		}
	}

	return (
		<Dialog open={true} onOpenChange={isOpen => !isOpen && closeModal()}>
			<DialogContent className='sm:max-w-md border-destructive/20 shadow-lg shadow-destructive/10'>
				<DialogHeader className='flex flex-col gap-3'>
					<div className='flex items-center gap-3'>
						<div className='bg-destructive/10 p-3 rounded-full shrink-0 flex items-center justify-center'>
							<AlertTriangle className='h-6 w-6 text-destructive' />
						</div>
						<DialogTitle className='text-destructive text-xl font-bold'>
							{t('mentors.deleteTitle') || 'Mentorlikdan chetlatish'}
						</DialogTitle>
					</div>
					<DialogDescription className='text-base leading-relaxed text-left text-muted-foreground mt-2'>
						{t('mentors.deleteConfirm') ||
							"Siz rostdan ham ushbu mentorni tizimdan chetlatmoqchimisiz? Bu harakatni orqaga qaytarib bo'lmaydi va mentorning barcha faoliyatlari to'xtatiladi."}
					</DialogDescription>
				</DialogHeader>

				<DialogFooter className='mt-6 flex flex-col-reverse sm:flex-row gap-2 sm:gap-3'>
					<Button
						variant='outline'
						onClick={closeModal}
						className='w-full sm:w-auto font-medium'
						disabled={isDeleting}
					>
						{t('common.cancel') || 'Bekor qilish'}
					</Button>
					<Button
						variant='destructive'
						onClick={handleDelete}
						disabled={isDeleting}
						className='w-full sm:w-auto font-semibold gap-2 shadow-sm'
					>
						{isDeleting ? (
							<>
								<Loader2 className='h-4 w-4 animate-spin' />
								{t('common.deleting') || "O'chirilmoqda..."}
							</>
						) : (
							<>
								<Trash2 className='h-4 w-4' />
								{t('common.confirmDelete') || "O'chirishni tasdiqlash"}
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
