'use client';

import { useEffect } from 'react';

import { api } from '@/trpc/react';
import { useProcessedRecords } from '@/lib/hooks/useProcessedRecords';
import { standardOrdersByUrl } from '@/lib/order';
import { groupItems } from '@/lib/groupItems';
import { Separator } from '@/components/ui/separator';
import { useScrollTopOnChange } from '@/lib/hooks/useScrollTopOnChange';
import { useCategoryFilter } from '@/lib/hooks/useCategoryFilter';
import { useGroupingEnabled } from '@/lib/hooks/useGroupingEnabled';
import { useSearchEnabled } from '@/lib/hooks/useSearchEnabled';

import { ItemCard } from './ItemCard';

interface Props {
  spaceId: string;
}

export function ItemCardList({ spaceId }: Props) {
  const [items] = api.item.fetch.useSuspenseQuery(spaceId);

  const utils = api.useUtils();
  useEffect(() => {
    items.forEach(item => {
      utils.item.get.setData(item.id, item);
    });
  }, [items, utils.item.get]);

  const processedItems = useProcessedRecords({
    data: items,
    searchKeys: ['name'],

    orders: standardOrdersByUrl
  });

  const filteredItems = useCategoryFilter(processedItems);

  const groupingEnabled = useGroupingEnabled();

  const scrollContainer = useScrollTopOnChange<HTMLDivElement>(filteredItems);

  const searchEnabled = useSearchEnabled();

  return (
    <div
      ref={scrollContainer}
      className='flex w-full flex-col items-center gap-4'
    >
      {filteredItems.length === 0 && (
        <p className='text-xl text-neutral-light'>No items found</p>
      )}

      {groupingEnabled && !searchEnabled
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
