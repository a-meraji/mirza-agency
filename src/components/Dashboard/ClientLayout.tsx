'use client';

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
} 