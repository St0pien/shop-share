'use client';

import { useEffect } from 'react';

import { api } from '@/trpc/react';
import { Separator } from '@/components/ui/separator';
import { useProcessedRecords } from '@/lib/hooks/useProcessedRecords';
import { listItemOrdersByUrl } from '@/lib/order';
import { useCategoryFilter } from '@/lib/hooks/useCategoryFilter';
import { useGroupingEnabled } from '@/lib/hooks/useGrouping';
import { groupItems } from '@/lib/groupItems';
import { useScrollTopOnChange } from '@/lib/hooks/useScrollTopOnChange';

import { ListItemCard } from './ListItemCard';

interface Props {
  listId: number;
}

export function ListItemCardList({ listId }: Props) {
  const [items] = api.list.fetchAssignedItems.useSuspenseQuery(listId);

  const utils = api.useUtils();
  useEffect(() => {
    items.forEach(listItem => {
      utils.item.get.setData(listItem.item.id, {
        id: listItem.item.id,
        spaceId: listItem.spaceId,
        name: listItem.item.name,
        category: listItem.category,
        createdAt: new Date(),
        listQuantity: 0
      });
    });
  }, [items, utils.item.get]);

  const processedItems = useProcessedRecords({
    data: items,
    searchKeys: ['item.name'],
    orders: listItemOrdersByUrl
  });

  const filteredItems = useCategoryFilter(processedItems);

  const checkedItems = filteredItems.filter(i => i.checked);
  const uncheckedItems = filteredItems.filter(i => !i.checked);

  const groupingEnabled = useGroupingEnabled();

  const scrollContainer = useScrollTopOnChange<HTMLDivElement>(filteredItems);

  return (
    <div
      ref={scrollContainer}
      className='flex w-full flex-col items-center gap-3'
    >
      {filteredItems.length === 0 && (
        <p className='text-xl text-neutral-light'>No items found</p>
      )}
      {groupingEnabled
        ? groupItems(uncheckedItems).map((group, index, arr) => (
            <div key={group.category?.id ?? -1} className='w-full py-2'>
              <h2 className='px-8 pb-2 text-xl font-bold text-neutral-light'>
                {group.category?.name ?? 'No category'}
              </h2>
              <div className='flex w-full flex-col items-center gap-4'>
                {group.items.map(listItem => (
                  <ListItemCard
                    key={listItem.item.id}
                    listItemInfo={listItem}
                  />
                ))}
              </div>
              {index !== arr.length - 1 && (
                <Separator className='mx-auto mt-6 w-5/6' />
              )}
            </div>
          ))
        : uncheckedItems.map(listItem => (
            <ListItemCard key={listItem.item.id} listItemInfo={listItem} />
          ))}

      {groupingEnabled
        ? groupItems(checkedItems).map((group, index, arr) => (
            <div key={group.category?.id ?? -1} className='w-full py-2'>
              <h2 className='px-8 pb-2 text-xl font-bold text-neutral-light'>
                {group.category?.name ?? 'No category'}
              </h2>
              <div className='flex w-full flex-col items-center gap-4'>
                {group.items.map(listItem => (
                  <ListItemCard
                    key={listItem.item.id}
                    listItemInfo={listItem}
                  />
                ))}
              </div>
              {index !== arr.length - 1 && (
                <Separator className='mx-auto mt-6 w-5/6' />
              )}
            </div>
          ))
        : checkedItems.map(listItem => (
            <ListItemCard key={listItem.item.id} listItemInfo={listItem} />
          ))}

      <div className='h-48'></div>
    </div>
  );
}
