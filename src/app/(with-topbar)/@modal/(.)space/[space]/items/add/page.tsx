import { AddItemDialog } from '@/components/dialogs/item/AddItemDialog';
import { HydrateClient } from '@/trpc/server';

export default function AddItemModal() {
  return (
    <HydrateClient>
      <AddItemDialog />
    </HydrateClient>
  );
}
