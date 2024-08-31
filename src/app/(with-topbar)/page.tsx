import { Suspense } from 'react';

import { api, HydrateClient } from '@/trpc/server';
import { WrappedSpinner } from '@/components/svg/Spinner';
import { OrderSelect } from '@/components/filtering/OrderSelect';
import { spaceOrders } from '@/lib/order';
import { AddLink } from '@/components/buttons/AddLink';

import { SpaceCardList } from './_components/SpaceCardList';

export default async function HomePage() {
  void api.spaces.fetch.prefetch();

  return (
    <HydrateClient>
      <div className='grid h-full w-full grid-rows-[min-content_1fr]'>
        <div className='flex w-full justify-end border-b-white px-[8%] pb-4 pt-2'>
          <div className='w-40'>
            <OrderSelect
              orderSelectItems={spaceOrders.map(({ url, display }) => ({
                url,
                display
              }))}
            />
          </div>
        </div>

        <div className='h-full w-full overflow-y-auto'>
          <Suspense fallback={<WrappedSpinner />}>
            <SpaceCardList />
          </Suspense>
        </div>
      </div>
      <div className='fixed bottom-32 right-8 z-20'>
        <AddLink href='/add' prefetch />
      </div>
    </HydrateClient>
  );
}
