"use client"
import { useState } from 'react';
import { Session } from 'next-auth';
import Link from 'next/link';
import { Bell, Menu, X } from 'lucide-react';
import useSubdomain from '@/hooks/useSubdomain';
import { dashboardTextEn, dashboardTextFa } from '@/lib/dashboard-lang';

interface DashboardHeaderProps {
  user: Session['user'];
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { hasFaSubdomain } = useSubdomain();
  const t = hasFaSubdomain ? dashboardTextFa : dashboardTextEn;
  
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <div className="md:hidden">
              <button
                type="button"
                className="relative inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-iconic"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">{mobileMenuOpen ? 'Close main menu' : 'Open main menu'}</span>
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
            <Link href="/dashboard" className="flex-shrink-0 flex items-center">
              <span className={`text-xl font-bold text-iconic ${hasFaSubdomain ? 'titr' : 'robot'}`}>
                {t.header.userDashboard}
              </span>
            </Link>
          </div>
          
          {/* Right-side actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button
              type="button"
              className="relative p-1 text-gray-500 hover:text-iconic focus:outline-none focus:ring-2 focus:ring-iconic focus:ring-offset-2"
            >
              <span className="sr-only">{t.header.viewNotifications}</span>
              <Bell className="h-6 w-6" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            
            {/* Profile dropdown (future implementation) */}
            <div className="flex items-center md:hidden">
              <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-iconic font-semibold">
                {user?.name?.[0] || user?.email?.[0] || 'U'}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on mobile menu state */}
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            href="/dashboard"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-iconic hover:bg-amber-50"
          >
            {t.sidebar.dashboard}
          </Link>
          <Link
            href="/dashboard/conversations"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-iconic hover:bg-amber-50"
          >
            {t.sidebar.conversations}
          </Link>
          <Link
            href="/dashboard/usage"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-iconic hover:bg-amber-50"
          >
            {t.sidebar.usageAnalytics}
          </Link>
          <Link
            href="/dashboard/logs"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-iconic hover:bg-amber-50"
          >
            {t.sidebar.logs}
          </Link>
          <Link
            href="/dashboard/settings"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-iconic hover:bg-amber-50"
          >
            {t.sidebar.settings}
          </Link>
          <Link
            href="/api/auth/signout"
            className="block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            {t.sidebar.signOut}
          </Link>
        </div>
      </div>
    </header>
  );
} 