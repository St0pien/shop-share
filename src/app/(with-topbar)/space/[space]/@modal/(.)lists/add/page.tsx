import AddListDialog from '@/components/dialogs/list/AddListDialog';
import { HydrateClient } from '@/trpc/server';

export default function AddListModal() {
  return (
    <HydrateClient>
      <AddListDialog />
    </HydrateClient>
  );
}
