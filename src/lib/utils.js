import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
	return twMerge(clsx(inputs))
}

export function formatPhone(phoneStr) {
	if (!phoneStr) return ''
	const cleaned = String(phoneStr).replace(/\D/g, '')

	if (cleaned.length === 12 && cleaned.startsWith('998')) {
		return cleaned.replace(
			/(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/,
			'+$1 $2 $3 $4 $5',
		)
	}

	return phoneStr
}

export function formatUzDate(dateStr) {
	if (!dateStr) return '-'

	try {
		const date = new Date(dateStr)
		if (isNaN(date.getTime())) return String(dateStr)

		return new Intl.DateTimeFormat('uz-UZ', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		}).format(date)
	} catch {
		return String(dateStr)
	}
}

export function getInitials(firstName, lastName) {
	const first = typeof firstName === 'string' ? firstName.trim().charAt(0) : ''
	const last = typeof lastName === 'string' ? lastName.trim().charAt(0) : ''
	const initials = `${first}${last}`.toUpperCase()

	return initials || 'U'
}

export function getErrorMessage(
	error,
	fallback = 'Kutilmagan xatolik yuz berdi',
) {
	if (!error) return fallback

	if (error.response?.data?.message) {
		return error.response.data.message
	}

	if (error.message) {
		if (error.message === 'Network Error')
			return 'Internetga ulanishda xatolik yuz berdi'
		return error.message
	}

	return fallback
}

export function getNestedValue(obj, path) {
	if (!obj || typeof obj !== 'object' || !path) return undefined

	return path.split('.').reduce((acc, part) => {
		return acc && acc[part] !== undefined ? acc[part] : undefined
	}, obj)
}
