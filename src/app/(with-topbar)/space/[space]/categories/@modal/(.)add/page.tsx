import { AddCategoryDialog } from '@/components/dialogs/category/AddCategoryDialog';
import { HydrateClient } from '@/trpc/server';

export default function AddCategoryModal() {
  return (
    <HydrateClient>
      <AddCategoryDialog />
    </HydrateClient>
  );
}
