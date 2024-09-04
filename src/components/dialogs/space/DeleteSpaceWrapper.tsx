'use client';

import { DeleteSpaceDialog } from '@/components/dialogs/space/DeleteSpaceDialog';
import { api } from '@/trpc/react';

import { type StandardDialogExtProps } from '../StandardDialog';

type Props = { spaceId: string } & StandardDialogExtProps;

export function DeleteSpaceWrapper({ spaceId, ...props }: Props) {
  const [spaceInfo] = api.space.get.useSuspenseQuery(spaceId);

  return <DeleteSpaceDialog space={spaceInfo} {...props} />;
}
