import { Suspense } from 'react';

import { AddLink } from '@/components/buttons/AddLink';
import { WrappedSpinner } from '@/components/svg/Spinner';
import { api, HydrateClient } from '@/trpc/server';

import { ListItemCardList } from './_components/ListItemCardList';

export default function ListPage({
  params
}: {
  params: { space: string; list: string };
}) {
  const listId = Number(params.list);

  void api.list.fetchAssignedItems.prefetch(listId);

  return (
    <HydrateClient>
      <div className='h-full w-full'>
        <div className='h-full w-full overflow-y-auto'>
          <Suspense fallback={<WrappedSpinner />}>
            <ListItemCardList listId={listId} />
          </Suspense>
        </div>

        <div className='fixed bottom-20 right-8 z-20'>
          <AddLink href={`/list/${params.space}/${params.list}/add`} prefetch />
        </div>
      </div>
    </HydrateClient>
  );
}
