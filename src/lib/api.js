import { ROLES } from '@/lib/constants'
import axios from 'axios'

const API_URL = 'http://13.48.57.24:5001/api'

const api = axios.create({
	baseURL: API_URL,
	withCredentials: true,
	timeout: 15000,
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
})

api.interceptors.request.use(
	config => {
		return config
	},
	error => Promise.reject(error),
)

api.interceptors.response.use(
	response => response,
	error => {
		if (error.response?.status === 401) {
			if (typeof window !== 'undefined') {
				const path = window.location.pathname

				const isProtectedRoute = Object.values(ROLES).some(role =>
					path.startsWith(`/${role}`),
				)

				if (isProtectedRoute) {
					window.location.href = '/authentication'
				}
			}
		}

		return Promise.reject(error)
	},
)

export default api
