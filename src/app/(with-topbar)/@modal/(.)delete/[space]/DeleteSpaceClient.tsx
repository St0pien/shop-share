'use client';

import { DeleteSpaceDialog } from '@/app/delete/[space]/_components/DeleteSpaceDialog';
import { api } from '@/trpc/react';

export function DeleteSpaceClient({ spaceId }: { spaceId: string }) {
  const [spaceInfo] = api.spaces.get.useSuspenseQuery(spaceId);

  return <DeleteSpaceDialog space={spaceInfo} />;
}
