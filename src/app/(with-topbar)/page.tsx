import { Suspense } from 'react';
import { redirect } from 'next/navigation';

import { auth } from '@/server/auth';
import { api, HydrateClient } from '@/trpc/server';
import { Spinner } from '@/components/svg/Spinner';

import { AddSpaceDialog } from './_components/AddSpaceDialog';
import { SpaceCardList } from './_components/SpaceCardList';

export default async function HomePage({
  searchParams
}: {
  searchParams: { search?: string };
}) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  void api.spaces.fetch.prefetch({ search: searchParams.search });

  return (
    <HydrateClient>
      <div className='flex w-full flex-col items-center gap-8'>
        <Suspense key={searchParams.search} fallback={<Spinner className='h-20 w-20' />}>
          <SpaceCardList search={searchParams.search} />
        </Suspense>
      </div>
      <div className='fixed bottom-32 right-8'>
        <AddSpaceDialog />
      </div>
    </HydrateClient>
  );
}
