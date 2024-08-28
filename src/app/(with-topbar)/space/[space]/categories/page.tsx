import { Suspense } from 'react';

import { api, HydrateClient } from '@/trpc/server';

import { AddCategoryDialog } from './_componenets/AddCategoryDialog';
import { CategoryCardList } from './_componenets/CategoryCardList';

export default function CategoriesPage({
  params
}: {
  params: { space: string };
}) {
  void api.categories.fetch.prefetch(params.space);

  return (
    <HydrateClient>
      <div className='h-full w-full overflow-y-auto'>
        <Suspense fallback={<h1>hi mark</h1>}>
          <CategoryCardList spaceId={params.space} />
        </Suspense>

        <div className='fixed bottom-32 right-8 z-20'>
          <AddCategoryDialog />
        </div>
      </div>
    </HydrateClient>
  );
}
