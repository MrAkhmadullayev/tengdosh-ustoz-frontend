'use client'

import { useTranslation } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { FolderOpen, Inbox, SearchX } from 'lucide-react'

const icons = {
	search: SearchX,
	folder: FolderOpen,
	inbox: Inbox,
}

export function EmptyState({
	icon = 'inbox',
	title,
	description,
	action,
	className,
}) {
	const { t } = useTranslation()
	const Icon = icons[icon] || Inbox

	return (
		<div
			className={cn(
				'flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed bg-muted/30',
				className,
			)}
		>
			<div className='h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4'>
				<Icon className='h-8 w-8 text-muted-foreground opacity-80' />
			</div>
			<h3 className='text-xl font-bold tracking-tight text-foreground mb-2'>
				{title || t('common.noResults')}
			</h3>
			{description && (
				<p className='text-sm text-muted-foreground max-w-sm text-balance mb-6'>
					{description}
				</p>
			)}
			{action && <div>{action}</div>}
		</div>
	)
}
