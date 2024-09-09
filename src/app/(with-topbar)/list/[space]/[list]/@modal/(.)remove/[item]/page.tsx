import { RemoveFromListDialog } from '@/components/dialogs/item/RemoveFromListDialog';
import { api, HydrateClient } from '@/trpc/server';

export default function RemoveItemModal({
  params
}: {
  params: { space: string; list: string; item: string };
}) {
  const listId = Number(params.list);
  const itemId = Number(params.item);

  void api.item.get.prefetch(itemId);

  return (
    <HydrateClient>
      <RemoveFromListDialog itemId={itemId} listId={listId} />
    </HydrateClient>
  );
}
