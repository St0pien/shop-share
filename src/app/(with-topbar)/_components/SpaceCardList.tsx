'use client';

import { useEffect } from 'react';

import { api } from '@/trpc/react';
import { standardOrdersByUrl } from '@/lib/order';
import { useScrollTopOnChange } from '@/lib/hooks/useScrollTopOnChange';
import { useProcessedRecords } from '@/lib/hooks/useProcessedRecords';

import { SpaceCard } from './SpaceCard';

export function SpaceCardList() {
  const [spaces] = api.space.fetch.useSuspenseQuery();

  const utils = api.useUtils();
  useEffect(() => {
    spaces.forEach(space => {
      utils.space.get.setData(space.id, space);
      utils.space.getName.setData(space.id, space.name);
    });
  }, [spaces, utils.space.get, utils.space.getName]);

  const processedSpaces = useProcessedRecords({
    data: spaces,
    searchKeys: ['name'],
    orders: standardOrdersByUrl
  });

  const scrollContainer = useScrollTopOnChange<HTMLDivElement>(processedSpaces);

  return (
    <div ref={scrollContainer} className='h-full w-full overflow-y-auto'>
      <div className='flex w-full flex-col items-center gap-8'>
        {processedSpaces.length === 0 && (
          <p className='text-xl text-neutral-light'>No spaces found</p>
        )}
        {processedSpaces.map(space => (
          <SpaceCard key={space.id} spaceInfo={space} />
        ))}
        <div className='h-48'></div>
      </div>
    </div>
  );
}
