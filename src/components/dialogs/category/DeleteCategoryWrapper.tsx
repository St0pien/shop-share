'use client';

import { DeleteCategoryDialog } from '@/components/dialogs/category/DeleteCategoryDialog';
import { api } from '@/trpc/react';

import { type StandardDialogExtProps } from '../StandardDialog';

type Props = { categoryId: number } & StandardDialogExtProps;

export function DeleteCategoryWrapper({ categoryId, ...props }: Props) {
  const [categoryInfo] = api.category.get.useSuspenseQuery(categoryId);

  return <DeleteCategoryDialog category={categoryInfo} {...props} />;
}
