'use client'

import { useAuth } from '@/lib/auth-context'
import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const SocketContext = createContext({
	socket: null,
	isConnected: false,
})

export const useSocket = () => useContext(SocketContext)

export const SocketProvider = ({ children }) => {
	const [socket, setSocket] = useState(null)
	const [isConnected, setIsConnected] = useState(false)
	const { user, isAuthenticated } = useAuth()

	useEffect(() => {
		if (!isAuthenticated || !user) {
			if (socket) {
				socket.disconnect()
				setSocket(null)
				setIsConnected(false)
			}
			return
		}

		const socketUrl =
			process.env.NEXT_PUBLIC_SOCKET_URL ||
			process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ||
			''

		const socketInstance = io(socketUrl, {
			withCredentials: true,
			reconnectionAttempts: 5,
			reconnectionDelay: 1000,
		})

		socketInstance.on('connect', () => {
			console.log('Socket connected')
			setIsConnected(true)
			socketInstance.emit('join', user.id)
		})

		socketInstance.on('disconnect', () => {
			console.log('Socket disconnected')
			setIsConnected(false)
		})

		socketInstance.on('connect_error', err => {
			console.error('Socket connection error:', err)
			setIsConnected(false)
		})

		setSocket(socketInstance)

		return () => {
			socketInstance.disconnect()
		}
	}, [isAuthenticated, user])

	return (
		<SocketContext.Provider value={{ socket, isConnected }}>
			{children}
		</SocketContext.Provider>
	)
}
