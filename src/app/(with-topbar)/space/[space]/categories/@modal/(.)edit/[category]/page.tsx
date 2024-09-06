import { EditCategoryDialog } from '@/components/dialogs/category/EditCategoryDialog';
import { api, HydrateClient } from '@/trpc/server';

export default function EditCategoryModal({
  params
}: {
  params: {
    category: string;
    space: string;
  };
}) {
  const categoryId = Number(params.category);

  void api.category.get.prefetch(categoryId);

  return (
    <HydrateClient>
      <EditCategoryDialog categoryId={categoryId} />
    </HydrateClient>
  );
}
