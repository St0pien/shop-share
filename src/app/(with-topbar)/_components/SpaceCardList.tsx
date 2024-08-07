'use client';

import { api } from '@/trpc/react';
import { Spinner } from '@/components/svg/Spinner';

import { SpaceCard } from './SpaceCard';

export function SpaceCardList({ search }: { search?: string }) {
  const [spaces] = api.spaces.fetch.useSuspenseQuery({
    search
  });

  return (
    <>
      {spaces.length === 0 && <p className='text-neutral-light text-xl'>No spaces found</p>}
      {spaces.map(space => (
        <SpaceCard key={space.id} spaceInfo={space} />
      ))}
      <div className='h-48'></div>
    </>
  );
}
