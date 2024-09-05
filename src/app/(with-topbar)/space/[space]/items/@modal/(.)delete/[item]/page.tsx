import { DeleteItemWrapper } from '@/components/dialogs/item/DeleteItemWrapper';
import { api, HydrateClient } from '@/trpc/server';

export default function DeleteItemModal({
  params
}: {
  params: { item: string; space: string };
}) {
  const itemId = Number(params.item);
  void api.item.get.prefetch(itemId);

  return (
    <HydrateClient>
      <DeleteItemWrapper itemId={itemId} />
    </HydrateClient>
  );
}
