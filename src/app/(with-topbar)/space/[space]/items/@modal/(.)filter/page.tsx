import { FilterItemsDialog } from '@/components/dialogs/item/FilterItemsDialog';
import { uuidTranslator } from '@/lib/uuidTranslator';

export default function FiterItemsModal({
  params
}: {
  params: { space: string };
}) {
  const spaceId = uuidTranslator.toUUID(params.space);
  const baseUrl = `/space/${params.space}/items`;

  return <FilterItemsDialog spaceId={spaceId} baseUrl={baseUrl} />;
}
