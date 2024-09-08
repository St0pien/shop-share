import { Suspense } from 'react';

import { api, HydrateClient } from '@/trpc/server';
import { OrderSelect } from '@/components/filtering/OrderSelect';
import { standardOrders } from '@/lib/order';
import { WrappedSpinner } from '@/components/svg/Spinner';
import { AddLink } from '@/components/buttons/AddLink';
import { uuidTranslator } from '@/lib/uuidTranslator';

import { ListCardList } from './_components/ListCardList';

export default function ShoppingListsPage({
  params
}: {
  params: { space: string };
}) {
  const spaceId = uuidTranslator.toUUID(params.space);

  void api.list.fetch.prefetch(spaceId);

  return (
    <HydrateClient>
      <div className='h-full w-full'>
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

        <div className='h-full w-full overflow-y-auto'>
          <Suspense fallback={<WrappedSpinner />}>
            <ListCardList spaceId={spaceId} />
          </Suspense>
        </div>

        <div className='fixed bottom-32 right-8 z-20'>
          <AddLink href={`/space/${params.space}/lists/add`} prefetch />
        </div>
      </div>
    </HydrateClient>
  );
}
