import { DeleteCategoryWrapper } from '@/components/dialogs/category/DeleteCategoryWrapper';
import { api, HydrateClient } from '@/trpc/server';

export default function DeleteCategoryPage({
  params
}: {
  params: { category: string; space: string };
}) {
  const categoryId = Number(params.category);
  void api.categories.get.prefetch(categoryId);

  return (
    <HydrateClient>
      <DeleteCategoryWrapper
        categoryId={categoryId}
        returnUrl={`/space/${params.space}/categories`}
      />
    </HydrateClient>
  );
}
