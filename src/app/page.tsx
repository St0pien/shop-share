import Image from 'next/image';

import { auth } from '@/server/auth';

import { SignOutButton } from './_components/SignOutButton';

export default async function HomePage() {
  const session = (await auth())!;

  if (!session) {
    return <h1>oop</h1>;
  }

  return (
    <div>
      <h1>{session.user.name}</h1>
      <h2>{session.user.email}</h2>
      <a href={session.user.image ?? ''}>Image</a>
      <Image
        src={session.user.image ?? ''}
        alt={session.user.id}
        width={200}
        height={200}
      />
      <SignOutButton />
    </div>
  );
}
