'use client'

import { getNestedValue } from '@/lib/utils'
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react'

const translationsCache = {}

const SUPPORTED_LOCALES = Object.freeze(['uz', 'ru', 'en'])
const DEFAULT_LOCALE = 'uz'
const STORAGE_KEY = 'tengdosh-locale'

const I18nContext = createContext(null)

async function loadTranslations(locale) {
	if (translationsCache[locale]) return translationsCache[locale]

	try {
		const mod = await import(`@/lib/i18n/${locale}.json`)
		translationsCache[locale] = mod.default
		return translationsCache[locale]
	} catch (error) {
		console.error(
			`[i18n] "${locale}" tili uchun tarjima fayli topilmadi.`,
			error,
		)
		return {}
	}
}

export function I18nProvider({ children }) {
	const [locale, setLocaleState] = useState(DEFAULT_LOCALE)
	const [dict, setDict] = useState({})
	const [isReady, setIsReady] = useState(false)

	useEffect(() => {
		const saved =
			typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
		const initial =
			saved && SUPPORTED_LOCALES.includes(saved) ? saved : DEFAULT_LOCALE

		setLocaleState(initial)
		document.documentElement.lang = initial

		loadTranslations(initial).then(d => {
			setDict(d)
			setIsReady(true)
		})
	}, [])

	const setLocale = useCallback(
		async newLocale => {
			if (!SUPPORTED_LOCALES.includes(newLocale) || newLocale === locale) return

			setLocaleState(newLocale)
			setIsReady(false)

			if (typeof window !== 'undefined') {
				localStorage.setItem(STORAGE_KEY, newLocale)
				document.documentElement.lang = newLocale
			}

			const d = await loadTranslations(newLocale)
			setDict(d)
			setIsReady(true)
		},
		[locale],
	)

	const t = useCallback(
		(key, params) => {
			if (!isReady) return key

			const value = getNestedValue(dict, key)

			if (value === undefined || value === null) {
				return params?.returnObjects ? null : key
			}

			if (params?.returnObjects) {
				return value
			}

			if (typeof value !== 'string') return key

			let result = value

			if (params) {
				Object.entries(params).forEach(([k, v]) => {
					result = result.replaceAll(`{${k}}`, String(v))
				})
			}

			return result
		},
		[dict, isReady],
	)

	const value = useMemo(
		() => ({
			locale,
			setLocale,
			t,
			isReady,
			supportedLocales: SUPPORTED_LOCALES,
		}),
		[locale, setLocale, t, isReady],
	)

	return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useTranslation() {
	const context = useContext(I18nContext)

	if (!context) {
		throw new Error(
			'useTranslation qatʼiy ravishda <I18nProvider> ichida ishlatilishi shart',
		)
	}

	return context
}
