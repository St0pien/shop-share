'use client';

import { api } from '@/trpc/react';

import { SpaceCard } from './SpaceCard';

export function SpaceCardList({ search }: { search?: string }) {
  const [spaces] = api.spaces.fetch.useSuspenseQuery({
    search
  });

  return (
    <div className='flex w-full flex-col items-center gap-8'>
      {spaces.length === 0 && (
        <p className='text-xl text-neutral-light'>No spaces found</p>
      )}
      {spaces.map(space => (
        <SpaceCard key={space.id} spaceInfo={space} />
      ))}
      <div className='h-48'></div>
    </div>
  );
}
