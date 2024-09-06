'use client';

import { api } from '@/trpc/react';

import { type StandardDialogExtProps } from '../StandardDialog';

import { EditItemDialog } from './EditItemDialog';

type Props = { itemId: number } & StandardDialogExtProps;

export function EditItemWrapper({ itemId, ...props }: Props) {
  const [itemInfo] = api.item.get.useSuspenseQuery(itemId);

  return <EditItemDialog item={itemInfo} {...props} />;
}
