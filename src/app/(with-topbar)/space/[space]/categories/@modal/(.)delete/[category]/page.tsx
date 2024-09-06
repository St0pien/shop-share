import { DeleteCategoryDialog } from '@/components/dialogs/category/DeleteCategoryDialog';
import { api, HydrateClient } from '@/trpc/server';

export default function DeleteCategoryModal({
  params
}: {
  params: { category: string; space: string };
}) {
  const categoryId = Number(params.category);
  void api.category.get.prefetch(categoryId);

  return (
    <HydrateClient>
      <DeleteCategoryDialog categoryId={categoryId} />
    </HydrateClient>
  );
}
