'use client'

import api from '@/lib/api'
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null)
	const [isLoading, setIsLoading] = useState(true)

	const fetchUser = useCallback(async () => {
		try {
			const { data } = await api.get('/auth/me')
			if (data?.success && data?.user) {
				setUser(data.user)
			} else {
				setUser(null)
			}
		} catch (error) {
			setUser(null)
		} finally {
			setIsLoading(false)
		}
	}, [])

	useEffect(() => {
		fetchUser()
	}, [fetchUser])

	const logout = useCallback(async () => {
		try {
			await api.post('/auth/logout')
		} catch (error) {
			console.error('Logout jarayonida xatolik:', error)
		} finally {
			setUser(null)
			if (typeof window !== 'undefined') {
				window.location.href = '/authentication'
			}
		}
	}, [])

	const refreshUser = useCallback(async () => {
		setIsLoading(true)
		await fetchUser()
	}, [fetchUser])

	const value = useMemo(
		() => ({
			user,
			role: user?.role || null,
			isAuthenticated: !!user,
			isLoading,
			logout,
			refreshUser,
		}),
		[user, isLoading, logout, refreshUser],
	)

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
	const context = useContext(AuthContext)

	if (!context) {
		throw new Error(
			'useAuth hook qatʼiy ravishda <AuthProvider> ichida ishlatilishi shart!',
		)
	}

	return context
}
