import { Suspense } from 'react';

import { api, HydrateClient } from '@/trpc/server';
import { OrderSelect } from '@/components/filtering/OrderSelect';
import { standardOrders } from '@/lib/order';
import { AddLink } from '@/components/buttons/AddLink';
import { WrappedSpinner } from '@/components/svg/Spinner';
import { uuidTranslator } from '@/lib/uuidTranslator';
import { GroupingSwitch } from '@/components/filtering/GroupingSwitch';
import { FilterLink } from '@/components/buttons/FilterLink';

import { ItemCardList } from './_components/ItemCardList';

export default function ItemsPage({ params }: { params: { space: string } }) {
  const spaceId = uuidTranslator.toUUID(params.space);

  void api.category.fetch.prefetch(spaceId);
  void api.item.fetch.prefetch(spaceId);

  return (
    <HydrateClient>
      <div className='h-full w-full'>
        <div className='flex w-full items-center justify-between gap-4 border-b-white px-[8%] pb-4 pt-2'>
          <div className='w-40'>
            <OrderSelect
              orderSelectItems={standardOrders.map(({ url, display }) => ({
                url,
                value: display
              }))}
            />
          </div>

          <div className='pr-4'>
            <GroupingSwitch />
          </div>

          <div>
            <FilterLink href={`/space/${params.space}/items/filter`} prefetch />
          </div>
        </div>

        <div className='h-full w-full overflow-y-auto'>
          <Suspense fallback={<WrappedSpinner />}>
            <ItemCardList spaceId={spaceId} />
          </Suspense>
        </div>

        <div className='fixed bottom-32 right-8 z-20'>
          <AddLink href={`/space/${params.space}/items/add`} prefetch />
        </div>
      </div>
    </HydrateClient>
  );
}
