import { EditItemWrapper } from '@/components/dialogs/item/EditItemWrapper';
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
      <EditItemWrapper
        itemId={itemId}
        returnUrl={`/space/${params.space}/items`}
      />
    </HydrateClient>
  );
}
