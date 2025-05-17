"use client"
import { Session } from 'next-auth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart2, MessageCircle, FileText, Settings, Home, LogOut, CreditCard } from 'lucide-react';
import useSubdomain from '@/hooks/useSubdomain';
import { dashboardTextEn, dashboardTextFa } from '@/lib/dashboard-lang';

interface DashboardSidebarProps {
  user: Session['user'];
}

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { hasFaSubdomain } = useSubdomain();
  const t = hasFaSubdomain ? dashboardTextFa : dashboardTextEn;
  
  const menuItems = [
    {
      name: t.sidebar.dashboard,
      href: '/dashboard',
      icon: Home
    },
    {
      name: t.sidebar.conversations,
      href: '/dashboard/conversations',
      icon: MessageCircle
    },
    {
      name: t.sidebar.usageAnalytics,
      href: '/dashboard/usage',
      icon: BarChart2
    },
    {
      name: t.sidebar.payments,
      href: '/dashboard/payments',
      icon: CreditCard
    },
  ];
  
  return (
    <aside dir={hasFaSubdomain ? 'rtl' : 'ltr'} className={`w-64 bg-white border-r border-gray-200 hidden md:block ${hasFaSubdomain ? 'rtl text-right' : 'ltr'}`}>
      <div className="flex flex-col h-full">
        {/* User info */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className={`flex items-center space-x-3`}>
            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-iconic font-semibold text-lg">
              {user?.name?.[0] || user?.email?.[0] || 'U'}
            </div>
            <div className={`flex flex-col ${hasFaSubdomain ? 'items-end' : ''}`}>
              <span className={`font-medium truncate ${hasFaSubdomain ? 'titr' : 'robot'}`}>{user?.name || 'User'}</span>
              <span className={`text-xs text-gray-500 truncate ${hasFaSubdomain ? 'titr' : 'robot'}`}>{user?.email}</span>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-3 py-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href ;
              
              return (
                <li key={item.href}>
                  <Link 
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-amber-50 text-iconic' 
                        : 'text-gray-700 hover:text-iconic hover:bg-amber-50'
                    } ${hasFaSubdomain ? 'titr ' : 'robot'}`}
                  >
                    <item.icon className={`h-5 w-5 ${hasFaSubdomain ? 'ml-2' : 'mr-2'} ${isActive ? 'text-iconic' : 'text-gray-500'}`} />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* Logout */}
        <div className="p-3 border-t border-gray-200">
          <Link 
            href="/api/auth/signout"
            className={`flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors ${hasFaSubdomain ? 'titr flex-row-reverse' : 'robot'}`}
          >
            <LogOut className={`h-5 w-5 ${hasFaSubdomain ? 'ml-2' : 'mr-2'}`} />
            {t.sidebar.signOut}
          </Link>
        </div>
      </div>
    </aside>
  );
} 