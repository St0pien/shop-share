import { Suspense } from 'react';

import { uuidTranslator } from '@/lib/uuidTranslator';
import { AddLink } from '@/components/buttons/AddLink';
import { WrappedSpinner } from '@/components/svg/Spinner';

import { ListItemCardList } from './_components/ListItemCardList';

export default function ListPage({
  params
}: {
  params: { space: string; list: string };
}) {
  const spaceId = uuidTranslator.toUUID(params.space);

  return (
    <div className='h-full w-full'>
      <div className='h-full w-full overflow-y-auto'>
        <Suspense fallback={<WrappedSpinner />}>
          <ListItemCardList />
        </Suspense>
      </div>

      <div className='fixed bottom-20 right-8 z-20'>
        <AddLink href={`/list/${params.space}/${params.list}/add`} prefetch />
      </div>
    </div>
  );
}
