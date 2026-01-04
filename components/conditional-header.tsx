'use client';

import { usePathname } from 'next/navigation';
import { UserButton } from '@neondatabase/auth/react';

export function ConditionalHeader() {
  const pathname = usePathname();
  
  // Don't show header on landing page
  if (pathname === '/') {
    return null;
  }
  
  return (
    <header className='flex justify-end items-center p-4 gap-4 h-16'>
      <UserButton size="icon" />
    </header>
  );
}

