import Image from 'next/image';

import { auth } from '@/server/auth';

export default async function HomePage() {
  const session = (await auth())!;

  console.log('hello from page');
  console.log(session);

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
    </div>
  );
}
