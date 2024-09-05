'use client';

import { useSearchParams } from 'next/navigation';

import { api } from '@/trpc/react';
import { useProcessedRecords } from '@/lib/hooks/useProcessedRecords';
import { standardOrdersByUrl } from '@/lib/order';
import { groupItems } from '@/lib/groupItems';

import { ItemCard } from './ItemCard';

interface Props {
  spaceId: string;
}

export function ItemCardList({ spaceId }: Props) {
  const [items] = api.item.fetch.useSuspenseQuery(spaceId);

  const processedItems = useProcessedRecords({
    data: items,
    searchKeys: ['name'],

    orders: standardOrdersByUrl
  });

  const searchParams = useSearchParams();
  const groupingEnabled = searchParams.get('grouping') !== 'disabled';

  return (
    <div className='flex w-full flex-col items-center gap-4'>
      {processedItems.length === 0 && (
        <p className='text-xl text-neutral-light'>No items found</p>
      )}

      {groupingEnabled
        ? groupItems(processedItems).map(group => (
            <div key={group.category?.id ?? -1} className='w-full py-2'>
              <h2 className='px-8 pb-2 text-xl text-neutral-light'>
                {group.category?.name ?? 'No category'}
              </h2>
              <div className='flex w-full flex-col items-center gap-4'>
                {group.items.map(item => (
                  <ItemCard key={item.id} itemInfo={item} />
                ))}
              </div>
            </div>
          ))
        : processedItems.map(item => (
            <ItemCard key={item.id} itemInfo={item} />
          ))}

      <div className='h-48'></div>
    </div>
  );
}
