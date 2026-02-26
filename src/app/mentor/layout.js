import DashboardLayout from '@/components/layouts/DashboardLayout'

export default function MentorLayout({ children }) {
	// Shunchaki role="mentor" deb berib yuboramiz, u yog'ini o'zi hal qiladi
	return <DashboardLayout role='mentor'>{children}</DashboardLayout>
}
