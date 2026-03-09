import { useTranslation } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

export function LoadingSpinner({
	className,
	size = 'default',
	text,
	fullScreen = false,
}) {
	const { t } = useTranslation()
	const sizeClasses = {
		sm: 'h-4 w-4',
		default: 'h-8 w-8',
		lg: 'h-12 w-12',
	}

	const content = (
		<div
			className={cn(
				'flex flex-col items-center justify-center gap-4 text-muted-foreground',
				fullScreen ? 'h-full' : '',
				className,
			)}
		>
			<Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
			{text !== false && (
				<p className='text-sm font-medium animate-pulse'>
					{text || t('common.loading')}
				</p>
			)}
		</div>
	)

	if (fullScreen) {
		return (
			<div className='fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm'>
				{content}
			</div>
		)
	}

	return content
}
