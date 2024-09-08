import { DeleteListDialog } from '@/components/dialogs/list/DeleteListDialog';
import { api, HydrateClient } from '@/trpc/server';

export default function DeleteListPage({
  params
}: {
  params: { space: string; list: string };
}) {
  const listId = Number(params.list);
  void api.list.get.prefetch(listId);

  return (
    <HydrateClient>
      <DeleteListDialog listId={listId} returnUrl={`/space/${params.space}`} />
    </HydrateClient>
  );
}
