'use client';

import { api } from '@/trpc/react';
import { useProcessedRecords } from '@/lib/hooks/useProcessedRecords';
import { standardOrdersByUrl } from '@/lib/order';

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

  return (
    <div className='flex w-full flex-col items-center gap-4'>
      {processedItems.length === 0 && (
        <p className='text-xl text-neutral-light'>No spaces found</p>
      )}
      {processedItems.map(item => (
        <ItemCard key={item.id} itemInfo={item} />
      ))}
      <div className='h-48'></div>
    </div>
  );
}
