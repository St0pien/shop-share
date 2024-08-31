'use client';

import { DeleteSpaceDialog } from '@/components/dialogs/DeleteSpaceDialog';
import { api } from '@/trpc/react';

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
