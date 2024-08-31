import { Suspense } from 'react';

import { api, HydrateClient } from '@/trpc/server';
import { uuidTranslator } from '@/lib/uuidTranslator';
import { WrappedSpinner } from '@/components/svg/Spinner';
import { AddLink } from '@/components/buttons/AddLink';

import { CategoryCardList } from './_componenets/CategoryCardList';

// TODO: Implement ordering and searching

export default function CategoriesPage({
  params
}: {
  params: { space: string };
}) {
  const spaceId = uuidTranslator.toUUID(params.space);

  void api.categories.fetch.prefetch(spaceId);

  return (
    <HydrateClient>
      <div className='h-full w-full overflow-y-auto'>
        <Suspense fallback={<WrappedSpinner />}>
          <CategoryCardList spaceId={spaceId} />
        </Suspense>

        <div className='fixed bottom-32 right-8 z-20'>
          <AddLink href={`/space/${params.space}/categories/add`} prefetch />
        </div>
      </div>
    </HydrateClient>
  );
}
