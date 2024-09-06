import { EditItemDialog } from '@/components/dialogs/item/EditItemDialog';
import { api, HydrateClient } from '@/trpc/server';

export default function EditCategoryPage({
  params
}: {
  params: {
    item: string;
    space: string;
  };
}) {
  const itemId = Number(params.item);

  void api.item.get.prefetch(itemId);

  return (
    <HydrateClient>
      <EditItemDialog itemId={itemId} />
    </HydrateClient>
  );
}
