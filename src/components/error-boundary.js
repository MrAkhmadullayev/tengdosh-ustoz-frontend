'use client'

import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCcw } from 'lucide-react'
import React from 'react'

export class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props)
		this.state = { hasError: false, error: null }
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, error }
	}

	componentDidCatch(error, errorInfo) {
		console.error('ErrorBoundary caught an error:', error, errorInfo)
	}

	render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback
			}

			return (
				<div className='flex flex-col items-center justify-center min-h-[300px] w-full  p-6 text-center border rounded-xl bg-card shadow-sm'>
					<div className='flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 mb-4'>
						<AlertCircle className='h-6 w-6 text-destructive' />
					</div>

					<h2 className='text-lg font-semibold tracking-tight text-foreground mb-1.5'>
						Kutilmagan xatolik yuz berdi
					</h2>

					<p className='text-sm text-muted-foreground max-w-md mb-6 text-balance'>
						{this.state.error?.message ||
							"Dastur ishlashida qandaydir xatolik yuzaga keldi. Iltimos, sahifani yangilang yoki keyinroq qayta urinib ko'ring."}
					</p>

					<Button
						variant='outline'
						onClick={() => window.location.reload()}
						className='gap-2 font-medium shadow-sm'
					>
						<RefreshCcw className='h-4 w-4' />
						Sahifani yangilash
					</Button>
				</div>
			)
		}

		return this.props.children
	}
}
