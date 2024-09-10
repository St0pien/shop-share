import { FilterItemsDialog } from '@/components/dialogs/item/FilterItemsDialog';
import { HydrateClient } from '@/trpc/server';

export default function FilterListItemsPage({
  params
}: {
  params: { space: string; list: string };
}) {
  const listId = Number(params.list);
  const baseUrl = `/list/${params.space}/${params.list}`;

  return (
    <HydrateClient>
      <FilterItemsDialog listId={listId} baseUrl={baseUrl} />
    </HydrateClient>
  );
}
