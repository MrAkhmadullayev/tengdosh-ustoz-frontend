import { jwtVerify } from 'jose'
import { NextResponse } from 'next/server'

export async function middleware(req) {
	const token = req.cookies.get('auth-token')?.value
	const path = req.nextUrl.pathname

	// Define route groups
	const isDashboardRoute =
		path.startsWith('/student') ||
		path.startsWith('/mentor') ||
		path.startsWith('/admin')
	const isAuthRoute = path.startsWith('/authentication')

	// Skip middleware for public routes, API, static files, etc.
	if (!isDashboardRoute && !isAuthRoute && path !== '/') {
		return NextResponse.next()
	}

	// 1. Dashboard protection
	if (isDashboardRoute) {
		if (!token) {
			return NextResponse.redirect(new URL('/authentication', req.url))
		}

		try {
			const secret = new TextEncoder().encode(
				process.env.JWT_SECRET ||
					'super_secret_tengdosh_ustoz_key_change_in_production',
			)
			const { payload } = await jwtVerify(token, secret)

			const { role, isRegistered } = payload

			// Course & group are now required
			if (!isRegistered) {
				return NextResponse.redirect(
					new URL('/authentication/confirm', req.url),
				)
			}

			// Role based access control mapping
			const validRoles = {
				'/admin': 'admin',
				'/mentor': 'mentor',
				'/student': 'student',
			}

			for (const [route, requiredRole] of Object.entries(validRoles)) {
				if (path.startsWith(route) && role !== requiredRole) {
					return NextResponse.redirect(new URL(`/${role}/dashboard`, req.url))
				}
			}

			// If mentor role, enforce they complete their resume BEFORE accessing any mentor dashboards
			if (
				role === 'mentor' &&
				path.startsWith('/mentor') &&
				path !== '/mentor/resume'
			) {
				if (payload.isResumeCompleted === false) {
					return NextResponse.redirect(new URL('/mentor/resume', req.url))
				}
			}

			// If mentor has completed their resume, protect them from going to /mentor/resume again
			if (
				role === 'mentor' &&
				path === '/mentor/resume' &&
				payload.isResumeCompleted === true
			) {
				return NextResponse.redirect(new URL('/mentor/dashboard', req.url))
			}
		} catch (error) {
			// Token is invalid or expired
			const response = NextResponse.redirect(
				new URL('/authentication', req.url),
			)
			response.cookies.delete('auth-token')
			return response
		}
	}

	// 2. Auth Route Protection (Prevent logged in users from visiting login pages)
	if (isAuthRoute) {
		if (token) {
			try {
				const secret = new TextEncoder().encode(
					process.env.JWT_SECRET ||
						'super_secret_tengdosh_ustoz_key_change_in_production',
				)
				const { payload } = await jwtVerify(token, secret)

				if (!payload.isRegistered && path !== '/authentication/confirm') {
					return NextResponse.redirect(
						new URL('/authentication/confirm', req.url),
					)
				} else if (
					payload.isRegistered &&
					(path === '/authentication/confirm' || path === '/authentication')
				) {
					return NextResponse.redirect(
						new URL(`/${payload.role}/dashboard`, req.url),
					)
				}
			} catch (error) {
				// Invalid token on login page, let them stay to login naturally. We can clear it.
				const response = NextResponse.next()
				response.cookies.delete('auth-token')
				return response
			}
		} else {
			// No token, but trying to access /authentication/confirm
			// We should protect confirm page from unauthenticated users
			if (path === '/authentication/confirm') {
				return NextResponse.redirect(new URL('/authentication', req.url))
			}
		}
	}

	return NextResponse.next()
}

export const config = {
	matcher: [
		'/student/:path*',
		'/mentor/:path*',
		'/admin/:path*',
		'/authentication/:path*',
	],
}
