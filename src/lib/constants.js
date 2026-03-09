export const MONTHS_UZ = [
	'Yanvar',
	'Fevral',
	'Mart',
	'Aprel',
	'May',
	'Iyun',
	'Iyul',
	'Avgust',
	'Sentabr',
	'Oktabr',
	'Noyabr',
	'Dekabr',
]

export const containerVariants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: { staggerChildren: 0.1 },
	},
}

export const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	show: {
		opacity: 1,
		y: 0,
		transition: { type: 'spring', stiffness: 300, damping: 24 },
	},
}

export const ROLES = {
	ADMIN: 'admin',
	MENTOR: 'mentor',
	STUDENT: 'student',
}

export const LESSON_FORMATS = {
	ONLINE: 'online',
	OFFLINE: 'offline',
	HYBRID: 'hybrid',
}

export const LESSON_STATUSES = {
	LIVE: 'live',
	UPCOMING: 'upcoming',
	COMPLETED: 'completed',
}
