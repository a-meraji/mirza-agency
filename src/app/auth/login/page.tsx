'use client';

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import LoginForm from '@/components/Auth/LoginForm';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import useSubdomain from '@/hooks/useSubdomain';
import { dashboardTextEn, dashboardTextFa } from '@/lib/dashboard-lang';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const { hasFaSubdomain } = useSubdomain();
  const t = hasFaSubdomain ? dashboardTextFa : dashboardTextEn;
  
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/auth/session');
        const sessionData = await res.json();
        if (sessionData && sessionData.user) {
          setSession(sessionData);
          window.location.href = '/dashboard';
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setLoading(false);
      }
    }
    
    checkSession();
  }, []);
  
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-iconic"></div>
    </div>;
  }
  
  return (
    <div className={`h-screen-full bg-gray-50/80 flex flex-col md:flex-row ${hasFaSubdomain ? 'font-iransans' : 'robot'}`}>
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8 ">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href="/" className="flex justify-center rounded-full p-2 w-fit mx-auto bg-white/70 mb-6">
          <Image
            src="/logo.svg"
            width={55}
            height={55}
            alt="Mirza AI automation agency"
          />
          </Link>
          
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t.auth.welcomeBack}
          </h1>
          <p className="mt-2 text-center text-base text-gray-600">
            {t.auth.signInAccess}
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="py-8 px-4 sm:rounded-lg sm:px-10">
            <LoginForm />
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    {t.auth.or}
                  </span>
                </div>
              </div>
              
              <div className="mt-6 flex flex-col space-y-4">
                <Link
                  href="/auth/register"
                  className={`w-full inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ${hasFaSubdomain ? 'flex-row-reverse' : ''}`}
                >
                  <span>{t.auth.createNewAccount}</span>
                  <ArrowRight className={`${hasFaSubdomain ? 'ml-0 mr-2' : 'ml-2'} h-4 w-4 ${hasFaSubdomain ? 'rotate-180' : ''}`} />
                </Link>
                
                <Link
                  href="/auth/forgot-password"
                  className="text-center text-sm font-medium text-iconic hover:text-iconic2 transition-colors duration-200"
                >
                  {t.auth.forgotPassword}
                </Link>
              </div>
            </div>
          </div>
          
          <p className="mt-8 text-center text-xs text-gray-500">
            {t.auth.termsAgreement}{' '}
            <Link href="/terms-of-service" className="underline hover:text-gray-700 transition-colors">
              {t.auth.termsOfService}
            </Link>
            {' '}{t.auth.and}{' '}
            <Link href="/privacy-policy" className="underline hover:text-gray-700 transition-colors">
              {t.auth.privacyPolicy}
            </Link>
          </p>
        </div>
      </div>
      
      {/* Right side - Decoration */}
      <div className="hidden md:block md:flex-1 bg-gradient-to-br from-[#ffb62f] to-[#e07902] relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="absolute inset-0 flex items-center justify-center p-10">
          <div className={`max-w-md text-white`}>
            <h2 className={`text-3xl font-bold mb-6 ${hasFaSubdomain ? 'titr' : 'roboto'}`}>{t.auth.accessAI}</h2>
            <p className="text-lg  mb-8">
              {t.auth.viewHistory}
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-xl">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-white/20"></div>
                <div className="flex-1 space-y-1">
                  <div className="h-2 bg-white/20 rounded w-3/4"></div>
                  <div className="h-2 bg-white/20 rounded w-1/2"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-2 bg-white/20 rounded"></div>
                <div className="h-2 bg-white/20 rounded"></div>
                <div className="h-2 bg-white/20 rounded w-4/5"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 