'use client';

import { useSearchParams } from 'next/navigation';

import { api } from '@/trpc/react';
import { useProcessedRecords } from '@/lib/hooks/useProcessedRecords';
import { standardOrdersByUrl } from '@/lib/order';
import { groupItems } from '@/lib/groupItems';
import { Separator } from '@/components/ui/separator';

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

  const categoriesParam = searchParams.get('categories');
  const filteredCategoryIds = categoriesParam
    ? categoriesParam.split(',').map(str => Number(str))
    : [];

  const filteredItems =
    filteredCategoryIds.length > 0
      ? processedItems.filter(
          item => !!filteredCategoryIds.find(id => item.category?.id === id)
        )
      : processedItems;

  return (
    <div className='flex w-full flex-col items-center gap-4'>
      {filteredItems.length === 0 && (
        <p className='text-xl text-neutral-light'>No items found</p>
      )}

      {groupingEnabled
        ? groupItems(filteredItems).map((group, index, arr) => (
            <div key={group.category?.id ?? -1} className='w-full py-2'>
              <h2 className='px-8 pb-2 text-xl font-bold text-neutral-light'>
                {group.category?.name ?? 'No category'}
              </h2>
              <div className='flex w-full flex-col items-center gap-4'>
                {group.items.map(item => (
                  <ItemCard key={item.id} itemInfo={item} />
                ))}
              </div>
              {index !== arr.length - 1 && (
                <Separator className='mx-auto mt-6 w-5/6' />
              )}
            </div>
          ))
        : filteredItems.map(item => <ItemCard key={item.id} itemInfo={item} />)}

      <div className='h-48'></div>
    </div>
  );
}
