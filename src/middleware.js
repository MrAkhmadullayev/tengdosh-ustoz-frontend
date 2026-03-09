import { jwtVerify } from 'jose'
import { NextResponse } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET

const ROUTES = {
	auth: '/authentication',
	confirm: '/authentication/confirm',
}

const ROLES = {
	admin: { prefix: '/admin', dashboard: '/admin/dashboard' },
	mentor: { prefix: '/mentor', dashboard: '/mentor/dashboard' },
	student: { prefix: '/student', dashboard: '/student/dashboard' },
}

export async function middleware(req) {
	const token = req.cookies.get('auth-token')?.value
	const path = req.nextUrl.pathname

	const isAuthRoute = path.startsWith(ROUTES.auth)
	const isDashboardRoute = Object.values(ROLES).some(r =>
		path.startsWith(r.prefix),
	)

	if (!token) {
		if (isDashboardRoute || path === ROUTES.confirm) {
			return NextResponse.redirect(new URL(ROUTES.auth, req.url))
		}
		return NextResponse.next()
	}

	if (!JWT_SECRET) {
		console.error('JWT_SECRET environment variable is not set')
		const response = isDashboardRoute
			? NextResponse.redirect(new URL(ROUTES.auth, req.url))
			: NextResponse.next()
		return response
	}

	const secretKey = new TextEncoder().encode(JWT_SECRET)

	try {
		const { payload } = await jwtVerify(token, secretKey)
		const { role, isRegistered, isResumeCompleted } = payload

		const userRoleConfig = ROLES[role]

		if (!isRegistered && path !== ROUTES.confirm) {
			return NextResponse.redirect(new URL(ROUTES.confirm, req.url))
		}

		if (isAuthRoute) {
			if (isRegistered && (path === ROUTES.confirm || path === ROUTES.auth)) {
				return NextResponse.redirect(
					new URL(userRoleConfig?.dashboard || '/', req.url),
				)
			}
			return NextResponse.next()
		}

		if (isDashboardRoute) {
			for (const roleKey in ROLES) {
				if (path.startsWith(ROLES[roleKey].prefix) && role !== roleKey) {
					return NextResponse.redirect(
						new URL(userRoleConfig?.dashboard || '/', req.url),
					)
				}
			}

			if (role === 'mentor' && path.startsWith(ROLES.mentor.prefix)) {
				const isResumeRoute = path === '/mentor/resume'

				if (!isResumeCompleted && !isResumeRoute) {
					return NextResponse.redirect(new URL('/mentor/resume', req.url))
				}

				if (isResumeCompleted && isResumeRoute) {
					return NextResponse.redirect(new URL(ROLES.mentor.dashboard, req.url))
				}
			}
		}

		return NextResponse.next()
	} catch (error) {
		const response = isDashboardRoute
			? NextResponse.redirect(new URL(ROUTES.auth, req.url))
			: NextResponse.next()

		response.cookies.delete('auth-token')
		return response
	}
}

export const config = {
	matcher: [
		'/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
	],
}
