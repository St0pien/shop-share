import { DeleteItemDialog } from '@/components/dialogs/item/DeleteItemDialog';
import { api, HydrateClient } from '@/trpc/server';

export default function DeleteItemPage({
  params
}: {
  params: { item: string; space: string };
}) {
  const itemId = Number(params.item);
  void api.item.get.prefetch(itemId);

  return (
    <HydrateClient>
      <DeleteItemDialog
        itemId={itemId}
        returnUrl={`/space/${params.space}/items`}
      />
    </HydrateClient>
  );
}
