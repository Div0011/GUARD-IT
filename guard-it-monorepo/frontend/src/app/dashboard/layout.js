import DashLayout from '@/components/DashLayout';
import './dashboard.css';

export const metadata = {
  title: 'Dashboard — GUARD IT!',
  description: 'GUARD IT! Admin Dashboard — Monitor moderation jobs, analytics, and system health.',
};

export default function DashboardLayout({ children }) {
  return (
    <DashLayout>
      {children}
    </DashLayout>
  );
}
