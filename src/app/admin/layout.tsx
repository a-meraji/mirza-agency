"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

// Define the user data type
interface UserData {
  email: string;
  // Add other user properties as needed
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check");
        const data = await response.json();
        
        if (data.authenticated) {
          setIsAuthenticated(true);
          setUserData(data.user);
        } else {
          // If not on login page, redirect to login
          if (pathname !== "/admin/login") {
            router.push("/admin/login");
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
        // On error, redirect to login
        if (pathname !== "/admin/login") {
          router.push("/admin/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  // If on login page, just render children
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbeee0]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-[#ffa620]" />
          <h2 className="mt-6 text-2xl font-bold text-[#462d22]">
            در حال بارگذاری...
          </h2>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render anything (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST"
      });
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Render admin layout with navigation
  return (
    <div className="min-h-screen bg-[#fbeee0]/30">
      <nav className="bg-[#462d22] text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-xl font-bold">پنل مدیریت</div>
          <div className="flex items-center">
            {userData && (
              <span className="mr-4 text-sm">
                {userData.email}
              </span>
            )}
            <div className="flex space-x-4">
              <Link 
                href="/admin" 
                className={`px-3 py-2 rounded hover:bg-[#ffa620]/20 ${
                  pathname === "/admin" ? "bg-[#ffa620]/30" : ""
                }`}
              >
                داشبورد
              </Link>
              <button 
                onClick={handleLogout}
                className="px-3 py-2 rounded hover:bg-red-700/20"
              >
                خروج
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto py-6">
        {children}
      </main>
    </div>
  );
} 