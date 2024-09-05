'use client';

import { api } from '@/trpc/react';

import { type StandardDialogExtProps } from '../StandardDialog';

import { DeleteItemDialog } from './DeleteItemDialog';

type Props = { itemId: number } & StandardDialogExtProps;

export function DeleteItemWrapper({ itemId, ...props }: Props) {
  const [itemInfo] = api.item.get.useSuspenseQuery(itemId);

  return <DeleteItemDialog item={itemInfo} {...props} />;
}
