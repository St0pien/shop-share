import { FilterItemsDialog } from '@/components/dialogs/item/FilterItemsDialog';
import { uuidTranslator } from '@/lib/uuidTranslator';
import { HydrateClient } from '@/trpc/server';

export default function FilterListItemsModal({
  params
}: {
  params: { space: string; list: string };
}) {
  const spaceId = uuidTranslator.toUUID(params.space);
  const baseUrl = `/list/${params.space}/${params.list}`;

  return (
    <HydrateClient>
      <FilterItemsDialog spaceId={spaceId} baseUrl={baseUrl} />
    </HydrateClient>
  );
}
