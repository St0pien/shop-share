import { type ReactNode } from 'react';

import { uuidTranslator } from '@/lib/uuidTranslator';
import { OrderSelect } from '@/components/filtering/OrderSelect';
import { standardOrders } from '@/lib/order';
import { GroupingSwitch } from '@/components/filtering/GroupingSwitch';
import { FilterLink } from '@/components/buttons/FilterLink';

import { ListBreadcrumb } from './_components/ListBreadCrumb';

export default function ListLayout({
  params,
  children
}: {
  params: { list: string; space: string };
  children: ReactNode;
}) {
  const listId = Number(params.list);
  const spaceId = uuidTranslator.toUUID(params.space);

  return (
    <div className='grid h-full w-full grid-rows-[120px_1fr]'>
      <div className='h-full w-full'>
        <div className='px-[10%]'>
          <ListBreadcrumb listId={listId} spaceId={spaceId} />
        </div>

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
      </div>

      <div className='h-[calc(100dvh_-_200px)] w-full overflow-y-auto'>
        {children}
      </div>
    </div>
  );
}
