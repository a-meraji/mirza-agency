import { ReactNode } from 'react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import DashboardSidebar from '@/components/Dashboard/Sidebar';
import DashboardHeader from '@/components/Dashboard/Header';
import ClientLayout from '@/components/Dashboard/ClientLayout';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  // Check if user is authenticated
  const session = await getServerSession(authOptions);
  
  if (!session) {
    // Redirect to login if not authenticated
    redirect('/auth/login');
  }
  
  return (
    <ClientLayout>
      <div className="flex min-h-screen bg-gray-50/80">
        {/* Sidebar */}
        <DashboardSidebar user={session.user} />
        
        {/* Main content */}
        <div className="flex-1">
          <DashboardHeader user={session.user} />
          <main className="p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </ClientLayout>
  );
} 