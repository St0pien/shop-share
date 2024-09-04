'use client';

import { api } from '@/trpc/react';

import { ItemCard } from './ItemCard';

interface Props {
  spaceId: string;
}

export function ItemCardList({ spaceId }: Props) {
  const [items] = api.item.fetch.useSuspenseQuery(spaceId);

  return (
    <div className='flex w-full flex-col items-center gap-4'>
      {items.length === 0 && (
        <p className='text-xl text-neutral-light'>No spaces found</p>
      )}
      {items.map(item => (
        <ItemCard key={item.id} itemInfo={item} />
      ))}
      <div className='h-48'></div>
    </div>
  );
}
