'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Button } from './button'

export function PageHeader({
	title,
	description,
	actionText,
	onAction,
	actionIcon: ActionIcon = Plus,
	className,
	buttonClassName,
}) {
	return (
		<motion.div
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			className={cn(
				'flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-card p-6 rounded-2xl border shadow-sm',
				className,
			)}
		>
			<div className='space-y-1.5'>
				<h1 className='text-3xl font-bold tracking-tight text-foreground'>
					{title}
				</h1>
				{description && (
					<p className='text-muted-foreground text-sm max-w-2xl text-balance'>
						{description}
					</p>
				)}
			</div>
			{actionText && onAction && (
				<Button
					onClick={onAction}
					className={cn(
						'gap-2 sm:w-auto w-full transition-transform active:scale-95 shadow-md',
						buttonClassName,
					)}
				>
					<ActionIcon className='h-4 w-4' />
					{actionText}
				</Button>
			)}
		</motion.div>
	)
}
