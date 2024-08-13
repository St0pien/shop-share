import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import { auth } from '@/server/auth';
import { api, HydrateClient } from '@/trpc/server';
import { Spinner } from '@/components/svg/Spinner';
import { OrderSelect } from '@/components/filtering/OrderSelect';
import { type Order } from '@/server/api/schema';

import { AddSpaceDialog } from './_components/AddSpaceDialog';
import { SpaceCardList } from './_components/SpaceCardList';

function SpinnerFallback() {
  return (
    <div className='flex w-full justify-center pt-10'>
      <Spinner className='h-20 w-20' />
    </div>
  );
}

interface OrderMapItem {
  param: Order;
  url: string;
  display: string;
}

const orderMap: OrderMapItem[] = [
  {
    param: 'alpha-asc',
    url: '',
    display: 'A-Z'
  },
  {
    param: 'alpha-desc',
    url: 'z-a',
    display: 'Z-A'
  },
  {
    param: 'latest',
    url: 'latest',
    display: 'Latest'
  },
  {
    param: 'oldest',
    url: 'oldest',
    display: 'Oldest'
  }
];

export default async function HomePage({
  searchParams
}: {
  searchParams: { search?: string; order?: string };
}) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const order = orderMap.find(o => o.url === searchParams.order)?.param;

  void api.spaces.fetch.prefetch({
    search: searchParams.search,
    order
  });

  return (
    <HydrateClient>
      <div className='grid h-full w-full grid-rows-[min-content_1fr]'>
        <div className='flex w-full justify-end border-b-white px-[8%] pb-4 pt-2'>
          <div className='w-40'>
            <OrderSelect orderSelectItems={orderMap} />
          </div>
        </div>

        <div className='h-full w-full overflow-y-auto'>
          <Suspense
            key={`${searchParams.search}${order}`}
            fallback={<SpinnerFallback />}
          >
            <SpaceCardList search={searchParams.search} order={order} />
          </Suspense>
        </div>
      </div>
      <div className='fixed bottom-32 right-8 z-20'>
        <AddSpaceDialog />
      </div>
    </HydrateClient>
  );
}
