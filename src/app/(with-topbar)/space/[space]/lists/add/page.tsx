import AddListDialog from '@/components/dialogs/list/AddListDialog';
import { uuidTranslator } from '@/lib/uuidTranslator';
import { api, HydrateClient } from '@/trpc/server';

export default function AddListPage({ params }: { params: { space: string } }) {
  const returnUrl = `/space/${params.space}`;

  void api.list.fetch.prefetch(uuidTranslator.toUUID(params.space));

  return (
    <HydrateClient>
      <AddListDialog returnUrl={returnUrl} />
    </HydrateClient>
  );
}
