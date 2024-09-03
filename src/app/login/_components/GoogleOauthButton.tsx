'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

import { GoogleLogo } from '@/components/svg/GoogleLogo';
import { Button } from '@/components/ui/button';

export function GoogleOauthButton() {
  const searchParams = useSearchParams();

  const login = async () => {
    const callbackUrl = searchParams.get('callback') ?? '/';

    await signIn('google', { callbackUrl });
  };

  return (
    <Button
      onClick={login}
      className='flex h-12 w-64 items-center gap-2 border-2 border-gray-200 bg-gray-50 dark:border-none dark:bg-white'
    >
      <GoogleLogo /> <span className='font-bold'>Sign in with Google</span>
    </Button>
  );
}
