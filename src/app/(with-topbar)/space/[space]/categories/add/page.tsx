import { AddCategoryDialog } from '@/components/dialogs/category/AddCategoryDialog';
import { uuidTranslator } from '@/lib/uuidTranslator';
import { api, HydrateClient } from '@/trpc/server';

export default function AddCategoryPage({
  params
}: {
  params: { space: string };
}) {
  const returnUrl = `/space/${params.space}/categories`;

  void api.categories.fetch.prefetch(uuidTranslator.toUUID(params.space));

  return (
    <HydrateClient>
      <AddCategoryDialog returnUrl={returnUrl} />
    </HydrateClient>
  );
}
