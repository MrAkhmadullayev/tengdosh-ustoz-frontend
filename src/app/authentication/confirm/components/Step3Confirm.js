import { Button } from '@/components/ui/button'
import {
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

export default function Step3Confirm({
	formData,
	role,
	onBack,
	onConfirm,
	isLoading,
	error,
}) {
	return (
		<>
			<CardHeader className='text-center pt-8'>
				<div className='mx-auto bg-green-500/10 w-14 h-14 rounded-full flex items-center justify-center mb-2'>
					<CheckCircle className='h-7 w-7 text-green-600' />
				</div>
				<CardTitle className='text-2xl font-bold'>Tasdiqlash</CardTitle>
				<CardDescription className='text-base'>
					Kiritilgan ma'lumotlarni tekshiring va tasdiqlang.
				</CardDescription>
			</CardHeader>

			<CardContent className='space-y-6'>
				<div className='bg-muted/30 rounded-xl p-5 border shadow-sm space-y-4'>
					<div className='flex justify-between items-center border-b pb-2'>
						<span className='text-sm font-medium text-muted-foreground'>
							Rol:
						</span>
						<span className='font-semibold capitalize'>
							{role === 'student' ? 'Talaba' : 'Mentor'}
						</span>
					</div>
					<div className='flex justify-between items-center border-b pb-2'>
						<span className='text-sm font-medium text-muted-foreground'>
							Ism va Familiya:
						</span>
						<span className='font-semibold'>
							{formData.firstName} {formData.lastName}
						</span>
					</div>

					<div className='flex justify-between items-center border-b pb-2'>
						<span className='text-sm font-medium text-muted-foreground'>
							Kurs:
						</span>
						<span className='font-semibold'>{formData.course}</span>
					</div>
					<div className='flex justify-between items-center pb-1'>
						<span className='text-sm font-medium text-muted-foreground'>
							Guruh:
						</span>
						<span className='font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded px-2'>
							{formData.group}
						</span>
					</div>
				</div>

				{error && (
					<div className='flex items-center gap-2 text-sm text-red-500 font-medium bg-red-500/10 px-3 py-2 rounded-lg w-full justify-center'>
						<AlertCircle className='h-4 w-4 shrink-0' />
						{error}
					</div>
				)}

				<div className='flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t'>
					<Button
						variant='outline'
						className='w-full sm:w-auto'
						onClick={onBack}
						disabled={isLoading}
					>
						Tahrirlash
					</Button>
					<div className='flex w-full sm:w-auto gap-3'>
						<Button
							variant='ghost'
							className='w-full sm:w-auto text-destructive hover:bg-destructive/10 hover:text-destructive'
							disabled={isLoading}
							onClick={() => {
								window.location.href = '/'
							}}
						>
							Bekor qilish
						</Button>
						<Button
							className='w-full sm:w-auto bg-green-600 hover:bg-green-700'
							onClick={onConfirm}
							disabled={isLoading}
						>
							{isLoading ? (
								<>
									<Loader2 className='mr-2 h-4 w-4 animate-spin' />
									Saqlanmoqda...
								</>
							) : (
								'Tasdiqlash'
							)}
						</Button>
					</div>
				</div>
			</CardContent>
		</>
	)
}
