'use client';

import { api } from '@/trpc/react';

import { SpaceCard } from './SpaceCard';

export function SpaceCardList() {
  const [spaces ] = api.spaces.fetch.useSuspenseQuery();

  return (
    <>
      {spaces.map(space => (
        <SpaceCard key={space.id} spaceInfo={space} />
      ))}
      <div className='h-48'></div>
    </>
  );
}
