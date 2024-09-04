import { AddItemDialog } from '@/components/dialogs/item/AddItemDialog';
import { uuidTranslator } from '@/lib/uuidTranslator';
import { api, HydrateClient } from '@/trpc/server';

export default function AddItemPage({ params }: { params: { space: string } }) {
  const spaceId = uuidTranslator.toUUID(params.space);
  void api.category.fetch.prefetch(spaceId);
  void api.item.fetch.prefetch(spaceId);

  return (
    <HydrateClient>
      <AddItemDialog returnUrl={`/space/${params.space}/items`} />
    </HydrateClient>
  );
}
