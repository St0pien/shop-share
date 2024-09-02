'use client';

import { EditCategoryDialog } from '@/components/dialogs/category/EditCategoryDialog';
import { api } from '@/trpc/react';

import { type StandardDialogExtProps } from '../StandardDialog';

type Props = { categoryId: number } & StandardDialogExtProps;

export function EditCategoryWrapper({ categoryId, ...props }: Props) {
  const [categoryInfo] = api.categories.get.useSuspenseQuery(categoryId);

  return <EditCategoryDialog category={categoryInfo} {...props} />;
}
