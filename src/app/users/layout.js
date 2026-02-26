import DashboardLayout from '@/components/layouts/DashboardLayout'

export default function UsersLayout({ children }) {
	// Role DashboardLayout ichida URL orqali yoki context orqali avtomatik aniqlanadi
	return <DashboardLayout>{children}</DashboardLayout>
}
