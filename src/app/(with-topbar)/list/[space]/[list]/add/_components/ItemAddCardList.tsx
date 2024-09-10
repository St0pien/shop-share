'use client';

import { api } from '@/trpc/react';
import { useProcessedRecords } from '@/lib/hooks/useProcessedRecords';
import { standardOrdersByUrl } from '@/lib/order';
import { useCategoryFilter } from '@/lib/hooks/useCategoryFilter';
import { useGroupingEnabled } from '@/lib/hooks/useGroupingEnabled';
import { useScrollTopOnChange } from '@/lib/hooks/useScrollTopOnChange';
import { groupItems } from '@/lib/groupItems';
import { Separator } from '@/components/ui/separator';
import { useSearchEnabled } from '@/lib/hooks/useSearchEnabled';

import { ItemAddCard } from './ItemAddCard';

interface Props {
  listId: number;
}

export function ItemAddCardList({ listId }: Props) {
  const [items] = api.list.fetchUnassignedItems.useSuspenseQuery(listId);

  const processedItems = useProcessedRecords({
    data: items,
    searchKeys: ['name'],
    orders: standardOrdersByUrl
  });

  const filteredItems = useCategoryFilter(processedItems);

  const groupingEnabled = useGroupingEnabled();

  const searchEnabled = useSearchEnabled();

  const scrollContainer = useScrollTopOnChange<HTMLDivElement>(filteredItems);

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
                  <ItemAddCard key={item.id} itemInfo={item} listId={listId} />
                ))}
              </div>
              {index !== arr.length - 1 && (
                <Separator className='mx-auto mt-6 w-5/6' />
              )}
            </div>
          ))
        : filteredItems.map(item => (
            <ItemAddCard key={item.id} itemInfo={item} listId={listId} />
          ))}

      <div className='h-48'></div>
    </div>
  );
}
