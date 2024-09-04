import { DeleteCategoryWrapper } from '@/components/dialogs/category/DeleteCategoryWrapper';
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
      <DeleteCategoryWrapper categoryId={categoryId} />
    </HydrateClient>
  );
}
