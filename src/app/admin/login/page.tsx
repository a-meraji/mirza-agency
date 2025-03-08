"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      // First try our custom login endpoint
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Invalid email or password");
        return;
      }

      const data = await response.json();
      
      // Also sign in with NextAuth to ensure session is properly set
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password
      });

      if (result?.error) {
        console.warn("NextAuth sign in failed, but custom login succeeded:", result.error);
        // Continue anyway since our custom login worked
      }

      // Redirect to admin dashboard or the URL provided by the API
      router.push(data.redirectUrl || "/admin");
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fbeee0]">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-[#462d22] mb-6 text-center">
            ورود به پنل مدیریت
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#462d22] mb-1"
              >
                ایمیل
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full p-2 border border-[#462d22]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffa620] focus:border-transparent"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#462d22] mb-1"
              >
                رمز عبور
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="w-full p-2 border border-[#462d22]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffa620] focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#fbeee0] border-2 border-[#422800] rounded-[30px] shadow-[4px_4px_0_0_#422800] text-[#422800] cursor-pointer font-semibold px-4 py-2 text-center no-underline select-none hover:bg-white active:shadow-[2px_2px_0_0_#422800] active:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "در حال ورود..." : "ورود"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 