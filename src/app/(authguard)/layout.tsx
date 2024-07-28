import { type ReactNode } from 'react';

import { auth, signIn } from '@/server/auth';

import { Navigation } from './Navigation';

export default async function AuthGuardLayout({
  children
}: Readonly<{ children: ReactNode }>) {
  const session = await auth();

  if (session === null) {
    await signIn();
  }

  return (
    <div className='grid h-screen w-screen grid-rows-[1fr_80px]'>
      <div>{children}</div>
      <Navigation />
    </div>
  );
}
