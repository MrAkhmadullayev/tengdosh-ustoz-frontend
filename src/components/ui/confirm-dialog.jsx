'use client'

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useTranslation } from '@/lib/i18n'
import { Loader2 } from 'lucide-react'

export function ConfirmDialog({
	isOpen,
	onClose,
	onConfirm,
	title,
	description,
	confirmText,
	cancelText,
	mode = 'danger',
	isLoading = false,
}) {
	const { t } = useTranslation()

	return (
		<AlertDialog open={isOpen} onOpenChange={open => !open && onClose()}>
			<AlertDialogContent className='sm:max-w-[425px] border shadow-2xl rounded-2xl overflow-hidden'>
				<AlertDialogHeader>
					<AlertDialogTitle className='text-xl'>
						{title || t('common.confirm')}
					</AlertDialogTitle>
					<AlertDialogDescription className='text-base'>
						{description}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter className='sm:justify-end gap-2 sm:gap-0 mt-6'>
					<AlertDialogCancel
						disabled={isLoading}
						className='mt-0 bg-transparent hover:bg-muted'
					>
						{cancelText || t('common.cancel')}
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={e => {
							e.preventDefault()
							onConfirm()
						}}
						disabled={isLoading}
						className={
							mode === 'danger'
								? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
								: 'bg-primary text-primary-foreground hover:bg-primary/90'
						}
					>
						{isLoading ? (
							<>
								<Loader2 className='mr-2 h-4 w-4 animate-spin' />
								{t('common.loading')}
							</>
						) : (
							confirmText || t('common.confirm')
						)}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
