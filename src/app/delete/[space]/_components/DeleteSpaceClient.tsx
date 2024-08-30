'use client';

import { api } from '@/trpc/react';

import { DeleteSpaceDialog } from './DeleteSpaceDialog';

export function DeleteSpaceClient({ spaceId }: { spaceId: string }) {
  const [spaceInfo] = api.spaces.get.useSuspenseQuery(spaceId);

  return (
    <DeleteSpaceDialog
      space={spaceInfo}
      returnUrl='/'
      disableOutsideInteraction
    />
  );
}
