import axios from 'axios'

const api = axios.create({
	baseURL: 'http://13.48.57.24:5001/api',
	withCredentials: true, // This ensures cookies are sent and received cross-origin
})

export default api
