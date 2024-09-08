import { Suspense } from 'react';

import { api, HydrateClient } from '@/trpc/server';
import { WrappedSpinner } from '@/components/svg/Spinner';
import { OrderSelect } from '@/components/filtering/OrderSelect';
import { standardOrders } from '@/lib/order';
import { AddLink } from '@/components/buttons/AddLink';

import { SpaceCardList } from './_components/SpaceCardList';

export default async function HomePage() {
  void api.space.fetch.prefetch();

  return (
    <HydrateClient>
      <div className='grid h-full w-full grid-rows-[min-content_1fr]'>
        <div className='flex w-full justify-between border-b-white px-[8%] pb-4 pt-2'>
          <div className='w-40'>
            <OrderSelect
              orderSelectItems={standardOrders.map(({ url, display }) => ({
                url,
                value: display
              }))}
            />
          </div>
        </div>

        <Suspense fallback={<WrappedSpinner />}>
          <SpaceCardList />
        </Suspense>
      </div>
      <div className='fixed bottom-20 right-8 z-20'>
        <AddLink href='/add' prefetch />
      </div>
    </HydrateClient>
  );
}
