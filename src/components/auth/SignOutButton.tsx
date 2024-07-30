'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function SignOutButton() {
  return (
    <Button
      className='bg-neutral-medium flex items-center gap-2 dark:text-white'
      onClick={() => signOut()}
    >
      <LogOut />
      Sign out
    </Button>
  );
}
