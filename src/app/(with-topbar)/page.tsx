import { Suspense } from 'react';

import { auth } from '@/server/auth';
import { api, HydrateClient } from '@/trpc/server';

import { AddSpaceDialog } from './_components/AddSpaceDialog';
import { SpaceCardList } from './_components/SpaceCardList';

export default async function HomePage() {
  const session = (await auth())!;

  if (!session) {
    return <h1>Not authenticated</h1>;
  }

  void api.shopping.fetchSpaces.prefetch();

  return (
    <HydrateClient>
      <div className='flex w-full flex-col items-center gap-8'>
        <Suspense fallback={<h1>Loading</h1>}>
          <SpaceCardList />
        </Suspense>
      </div>
      <div className='fixed bottom-32 right-8'>
        <AddSpaceDialog />
      </div>
    </HydrateClient>
  );
}
