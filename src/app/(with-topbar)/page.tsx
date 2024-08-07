import { Suspense } from 'react';
import { redirect } from 'next/navigation';

import { auth } from '@/server/auth';
import { api, HydrateClient } from '@/trpc/server';
import { Spinner } from '@/components/svg/Spinner';

import { AddSpaceDialog } from './_components/AddSpaceDialog';
import { SpaceCardList } from './_components/SpaceCardList';

export default async function HomePage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  void api.spaces.fetch.prefetch();

  return (
    <HydrateClient>
      <div className='flex w-full flex-col items-center gap-8'>
        <Suspense fallback={<Spinner className='w-20 h-20' />}>
          <SpaceCardList />
        </Suspense>
      </div>
      <div className='fixed bottom-32 right-8'>
        <AddSpaceDialog />
      </div>
    </HydrateClient>
  );
}
