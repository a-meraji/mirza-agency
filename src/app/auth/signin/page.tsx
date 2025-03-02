"use client";

import { signIn } from "next-auth/react";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function SignIn() {
  useEffect(() => {
    // Automatically trigger Google sign-in
    signIn("google", { callbackUrl: "/" });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fbeee0]">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-[#ffa620]" />
        <h2 className="mt-6 text-2xl font-bold text-[#462d22]">
          در حال هدایت به صفحه ورود...
        </h2>
        <p className="mt-2 text-[#462d22]/70">
          لطفا منتظر بمانید، در حال انتقال به صفحه ورود گوگل هستید.
        </p>
      </div>
    </div>
  );
} 