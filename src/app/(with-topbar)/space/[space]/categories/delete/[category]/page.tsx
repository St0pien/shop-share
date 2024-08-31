import { api, HydrateClient } from '@/trpc/server';

import { DeleteCategoryClient } from './_components/DeleteCategoryClient';

export default function DeleteCategoryPage({
  params
}: {
  params: { category: string };
}) {
  const categoryId = Number(params.category);
  void api.categories.get.prefetch(categoryId);

  return (
    <HydrateClient>
      <DeleteCategoryClient categoryId={categoryId} />
    </HydrateClient>
  );
}
