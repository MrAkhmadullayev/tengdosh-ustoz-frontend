import DashboardLayout from '@/components/layouts/DashboardLayout'

export default function AdminLayout({ children }) {
	// role="admin" deb beramiz, Sidebar o'z-o'zidan admin menyusiga aylanadi
	return <DashboardLayout role='admin'>{children}</DashboardLayout>
}
