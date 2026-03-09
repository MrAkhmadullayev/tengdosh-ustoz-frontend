import DashboardLayout from '@/components/layouts/DashboardLayout'

export default function StudentLayout({ children }) {
	return <DashboardLayout role='student'>{children}</DashboardLayout>
}
