import { type ReactNode } from 'react';

import { auth, signIn } from '@/server/auth';

export default async function AuthGuardLayout({
  children
}: Readonly<{ children: ReactNode }>) {
  const session = await auth();

  if (session === null) {
    console.log('hello from layout')
    await signIn();
  }

  return (
    <div>
      <h1>HI mark</h1>
      {children}
    </div>
  );
}
