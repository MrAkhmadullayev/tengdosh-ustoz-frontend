import DashboardLayout from '@/components/layouts/DashboardLayout'

export default function StudentLayout({ children }) {
	// role="student" qilib beramiz, qolganini universal layout o'zi chizadi
	return <DashboardLayout role='student'>{children}</DashboardLayout>
}
