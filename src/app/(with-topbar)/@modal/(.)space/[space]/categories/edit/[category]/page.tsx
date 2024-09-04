import { EditCategoryWrapper } from '@/components/dialogs/category/EditCategoryWrapper';
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
      <EditCategoryWrapper categoryId={categoryId} />
    </HydrateClient>
  );
}
