'use client';

import { api } from '@/trpc/react';

export interface SpaceNameProps {
  spaceId: string;
}

export function SpaceName({ spaceId }: SpaceNameProps) {
  const [spaceName] = api.space.getName.useSuspenseQuery(spaceId);

  if (spaceName.length > 23) {
    return spaceName.slice(0, 20) + '...';
  }

  return spaceName;
}
