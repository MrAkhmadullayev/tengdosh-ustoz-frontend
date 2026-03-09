'use client'

import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { useTranslation } from '@/lib/i18n'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { useMemo, useState } from 'react'

export function DataTable({
	columns,
	data,
	isLoading = false,
	searchable = true,
	searchKey = 'name',
	searchPlaceholder,
	emptyProps = {},
	onRowClick,
	itemsPerPage = 10,
	pagination = true,
}) {
	const { t, isReady } = useTranslation()
	const [searchTerm, setSearchTerm] = useState('')
	const [currentPage, setCurrentPage] = useState(1)

	// Qidiruv mantiqi
	const filteredData = useMemo(() => {
		if (!searchable || !searchTerm) return data
		const lowerSearch = searchTerm.toLowerCase()

		return data.filter(item => {
			const value =
				typeof searchKey === 'function' ? searchKey(item) : item[searchKey]
			return value?.toString().toLowerCase().includes(lowerSearch)
		})
	}, [data, searchTerm, searchable, searchKey])

	// Sahifalash mantiqi
	const paginatedData = useMemo(() => {
		if (!pagination) return filteredData
		const start = (currentPage - 1) * itemsPerPage
		return filteredData.slice(start, start + itemsPerPage)
	}, [filteredData, currentPage, itemsPerPage, pagination])

	const totalPages = Math.ceil(filteredData.length / itemsPerPage)

	// Qidiruv bo'sh qolsa va natija nol bo'lsa (Eksport tugmasi uchun signal berishga tayyorgarlik)
	const isNoDataAtAll = !isLoading && data.length === 0
	const isSearchEmpty =
		!isLoading && data.length > 0 && filteredData.length === 0

	return (
		<div className='space-y-4'>
			{/* 🔍 Qidiruv paneli */}
			{searchable && !isNoDataAtAll && (
				<div className='flex items-center space-x-2'>
					<div className='relative w-full sm:w-80'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
						<Input
							placeholder={
								searchPlaceholder ||
								(isReady ? t('common.search') : 'Qidirish...')
							}
							value={searchTerm}
							onChange={e => {
								setSearchTerm(e.target.value)
								setCurrentPage(1) // Qidirilganda 1-sahifaga qaytarish
							}}
							className='pl-9 h-10 bg-background shadow-sm border-muted'
						/>
					</div>
				</div>
			)}

			{/* 📋 Asosiy Jadval */}
			<div className='rounded-xl border border-border bg-card shadow-sm overflow-hidden'>
				<div className='overflow-x-auto'>
					<Table>
						<TableHeader>
							<TableRow className='bg-muted/30 hover:bg-muted/30'>
								{columns.map((col, index) => (
									<TableHead
										key={col.key || index}
										className={col.headerClassName}
									>
										{col.header}
									</TableHead>
								))}
							</TableRow>
						</TableHeader>
						<TableBody>
							{isLoading ? (
								// ⏳ Loading State
								Array.from({ length: 5 }).map((_, rowIndex) => (
									<TableRow key={rowIndex}>
										{columns.map((col, colIndex) => (
											<TableCell key={colIndex}>
												<Skeleton className='h-6 w-full min-w-[50px] max-w-[200px]' />
											</TableCell>
										))}
									</TableRow>
								))
							) : isNoDataAtAll || isSearchEmpty ? (
								// 🚫 Empty State
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className='h-64 text-center'
									>
										<EmptyState
											title={
												isSearchEmpty
													? t('common.noSearchResults') || 'Natija topilmadi'
													: emptyProps.title
											}
											description={
												isSearchEmpty
													? t('common.tryDifferentSearch') ||
														"Boshqa so'z bilan qidirib ko'ring"
													: emptyProps.description
											}
											className='border-none shadow-none bg-transparent'
										/>
									</TableCell>
								</TableRow>
							) : (
								// ✅ Data State
								paginatedData.map(row => (
									<TableRow
										key={row.id}
										onClick={() => onRowClick && onRowClick(row)}
										className={
											onRowClick
												? 'cursor-pointer transition-colors hover:bg-muted/50'
												: ''
										}
									>
										{columns.map((col, colIndex) => (
											<TableCell
												key={col.key || colIndex}
												className={col.cellClassName}
											>
												{col.render
													? col.render(row)
													: col.key
														? row[col.key]
														: null}
											</TableCell>
										))}
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>
			</div>

			{/* 📄 Pagination */}
			{pagination && filteredData.length > 0 && !isLoading && (
				<div className='flex items-center justify-between px-2 text-sm pt-2'>
					<div className='text-muted-foreground text-xs sm:text-sm pl-2 font-medium'>
						{t('common.showingResults', {
							count: paginatedData.length,
							total: filteredData.length,
						}) ||
							`Jami ${filteredData.length} tadan ${paginatedData.length} tasi ko'rsatilmoqda`}
					</div>
					<div className='flex items-center space-x-3 bg-muted/30 rounded-lg p-1 border'>
						<Button
							variant='ghost'
							size='icon'
							onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
							disabled={currentPage === 1}
							className='h-8 w-8 hover:bg-background shadow-sm'
						>
							<ChevronLeft className='h-4 w-4' />
						</Button>
						<div className='text-xs sm:text-sm font-semibold min-w-[3rem] text-center'>
							{currentPage} / {totalPages || 1}
						</div>
						<Button
							variant='ghost'
							size='icon'
							onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
							disabled={currentPage === totalPages || totalPages === 0}
							className='h-8 w-8 hover:bg-background shadow-sm'
						>
							<ChevronRight className='h-4 w-4' />
						</Button>
					</div>
				</div>
			)}
		</div>
	)
}
