'use client';

import { DeleteSpaceDialog } from '@/components/dialogs/space/DeleteSpaceDialog';
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
