'use client';

import { DeleteCategoryDialog } from '@/components/dialogs/category/DeleteCategoryDialog';
import { api } from '@/trpc/react';

export function DeleteCategoryClient({ categoryId }: { categoryId: number }) {
  const [categoryInfo] = api.categories.get.useSuspenseQuery(categoryId);

  return <DeleteCategoryDialog category={categoryInfo} />;
}
