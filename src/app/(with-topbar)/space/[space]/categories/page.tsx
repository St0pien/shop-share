import { Suspense } from 'react';

import { api, HydrateClient } from '@/trpc/server';
import { uuidTranslator } from '@/lib/uuidTranslator';

import { AddCategoryDialog } from './_componenets/AddCategoryDialog';
import { CategoryCardList } from './_componenets/CategoryCardList';

export default function CategoriesPage({
  params
}: {
  params: { space: string };
}) {
  const spaceId = uuidTranslator.toUUID(params.space);

  void api.categories.fetch.prefetch(params.space);

  return (
    <HydrateClient>
      <div className='h-full w-full overflow-y-auto'>
        <Suspense fallback={<h1>hi mark</h1>}>
          <CategoryCardList spaceId={spaceId} />
        </Suspense>

        <div className='fixed bottom-32 right-8 z-20'>
          <AddCategoryDialog />
        </div>
      </div>
    </HydrateClient>
  );
}
