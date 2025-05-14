'use client';

import Link from 'next/link'
import Image from 'next/image'
import { Home, ArrowLeft, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter();
  
  const handleGoBack = () => {
    window.history.back();
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/40 px-4 py-16">
      <div className="text-center max-w-lg">
        {/* 404 Number */}
        <h1 className="text-iconic text-9xl font-extrabold tracking-tight">404</h1>
        
        {/* Visual element */}
        <div className="my-8 relative h-48 w-48 mx-auto">
          <div className="absolute inset-0 bg-amber-100 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className="h-20 w-20 text-amber-700 opacity-90" />
          </div>
        </div>
        
        {/* Message */}
        <h2 className="text-3xl font-bold text-gray-800 mb-3">Page not found</h2>
        <p className="text-gray-600 mb-8 text-lg">
          We couldn't find the page you're looking for.
        </p>
        
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-iconic text-white rounded-md font-medium transition-colors hover:bg-iconic2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-iconic"
          >
            <Home className="mr-2 h-5 w-5" />
            Return Home
          </Link>
          
          <button 
            onClick={handleGoBack}
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 bg-white text-gray-700 rounded-md font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-iconic transition-colors"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Go Back
          </button>
        </div>
      </div>
      
      {/* Footer with report option */}
      <div className="mt-16 text-center text-gray-500 text-sm">
        <p>
          If you believe this is an error, please{' '}
          <Link 
            href="/contact" 
            className="text-iconic hover:text-iconic2 font-medium underline underline-offset-2 transition-colors"
          >
            contact support
          </Link>
        </p>
      </div>
    </div>
  )
}