'use client';

import { api } from '@/trpc/react';
import { useProcessedRecords } from '@/lib/hooks/useProcessedRecords';
import { standardOrdersByUrl } from '@/lib/order';
import { useScrollTopOnChange } from '@/lib/hooks/useScrollTopOnChange';

import { ListCard } from './ListCard';

interface Props {
  spaceId: string;
}

export function ListCardList({ spaceId }: Props) {
  const [lists] = api.list.fetch.useSuspenseQuery(spaceId);

  // const utils = api.useUtils();
  // useEffect(() => {
  //   categories.forEach(category => {
  //     utils.category.get.setData(category.id, category);
  //   });
  // }, [categories, utils.category.get]);
  //
  const processedLists = useProcessedRecords({
    data: lists,
    orders: standardOrdersByUrl,
    searchKeys: ['name']
  });

  const scrollContainer = useScrollTopOnChange<HTMLDivElement>(processedLists);

  return (
    <div
      ref={scrollContainer}
      className='flex w-full flex-col items-center gap-4'
    >
      {processedLists.length === 0 && (
        <p className='text-xl text-neutral-light'>No lists found</p>
      )}
      {processedLists.map(list => (
        <ListCard key={list.id} listInfo={list} />
      ))}

      <div className='h-32'></div>
    </div>
  );
}
