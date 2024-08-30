'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import Fuse from 'fuse.js';

import { api } from '@/trpc/react';
import { spaceOrdersByUrl } from '@/lib/order';
import { type SpaceInfo } from '@/lib/types';

import { SpaceCard } from './SpaceCard';

export function SpaceCardList() {
  const [spaces] = api.spaces.fetch.useSuspenseQuery();

  const utils = api.useUtils();
  spaces.forEach(space => {
    utils.spaces.get.setData(space.id, space);
  });

  const fuse = useMemo(
    () =>
      new Fuse(spaces, {
        keys: ['name'],
        ignoreLocation: true
      }),
    [spaces]
  );

  const searchParams = useSearchParams();
  const searchText = searchParams.get('search');

  let processedSpaces: SpaceInfo[];

  if (searchText !== null) {
    processedSpaces = fuse.search(searchText).map(({ item }) => item);
  } else {
    processedSpaces = [...spaces];

    const orderParam = searchParams.get('order') ?? '';
    const order = spaceOrdersByUrl[orderParam];

    if (order !== undefined) {
      processedSpaces.sort(order.comparator);
    }
  }

  return (
    <div className='flex w-full flex-col items-center gap-8'>
      {processedSpaces.length === 0 && (
        <p className='text-xl text-neutral-light'>No spaces found</p>
      )}
      {processedSpaces.map(space => (
        <SpaceCard key={space.id} spaceInfo={space} />
      ))}
      <div className='h-48'></div>
    </div>
  );
}
