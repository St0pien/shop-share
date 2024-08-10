import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import { auth } from '@/server/auth';
import { api, HydrateClient } from '@/trpc/server';
import { Spinner } from '@/components/svg/Spinner';
import { OrderSelect } from '@/components/filtering/OrderSelect';

import { AddSpaceDialog } from './_components/AddSpaceDialog';
import { SpaceCardList } from './_components/SpaceCardList';

function SpinnerFallback() {
  return (
    <div className='flex w-full justify-center pt-10'>
      <Spinner className='h-20 w-20' />
    </div>
  );
}

const orderByMap = {
  'a-z': 'A-Z',
  'z-a': 'Z-A'
};

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
      <div className='grid h-full w-full grid-rows-[min-content_1fr]'>
        <div className='flex w-full justify-end border-b-white px-[8%] pb-4 pt-2'>
          <div className='w-40'>
            <OrderSelect orderKeys={orderByMap} />
          </div>
        </div>

        <div className='h-full w-full overflow-y-auto'>
          <Suspense key={searchParams.search} fallback={<SpinnerFallback />}>
            <SpaceCardList search={searchParams.search} />
          </Suspense>
        </div>
      </div>
      <div className='fixed bottom-32 right-8'>
        <AddSpaceDialog />
      </div>
    </HydrateClient>
  );
}
