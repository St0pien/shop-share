import { AssignItemDialog } from '@/components/dialogs/item/AssignItemDialog';
import { uuidTranslator } from '@/lib/uuidTranslator';
import { api, HydrateClient } from '@/trpc/server';

export default function AssignItemPage({
  params
}: {
  params: { space: string; item: string };
}) {
  const spaceId = uuidTranslator.toUUID(params.space);
  const itemId = Number(params.item);

  const returnUrl = `/space/${params.space}/items`;

  void api.item.get.prefetch(itemId);

  return (
    <HydrateClient>
      <AssignItemDialog
        spaceId={spaceId}
        itemId={itemId}
        returnUrl={returnUrl}
      />
    </HydrateClient>
  );
}
