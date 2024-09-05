import { Suspense } from 'react';

import { api, HydrateClient } from '@/trpc/server';
import { uuidTranslator } from '@/lib/uuidTranslator';
import { WrappedSpinner } from '@/components/svg/Spinner';
import { AddLink } from '@/components/buttons/AddLink';
import { OrderSelect } from '@/components/filtering/OrderSelect';
import { standardOrders } from '@/lib/order';

import { CategoryCardList } from './_componenets/CategoryCardList';

export default function CategoriesPage({
  params
}: {
  params: { space: string };
}) {
  const spaceId = uuidTranslator.toUUID(params.space);

  void api.category.fetch.prefetch(spaceId);

  return (
    <HydrateClient>
      <div className='h-full w-full'>
        <div className='flex w-full justify-between border-b-white px-[8%] pb-4 pt-2'>
          <div className='w-40'>
            <OrderSelect
              orderSelectItems={standardOrders.map(({ url, display }) => ({
                url,
                display
              }))}
            />
          </div>
        </div>

        <div className='h-full w-full overflow-y-auto'>
          <Suspense fallback={<WrappedSpinner />}>
            <CategoryCardList spaceId={spaceId} />
          </Suspense>
        </div>

        <div className='fixed bottom-32 right-8 z-20'>
          <AddLink href={`/space/${params.space}/categories/add`} prefetch />
        </div>
      </div>
    </HydrateClient>
  );
}
