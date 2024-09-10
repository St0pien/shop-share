import { Suspense } from 'react';

import { WrappedSpinner } from '@/components/svg/Spinner';
import { uuidTranslator } from '@/lib/uuidTranslator';
import { api, HydrateClient } from '@/trpc/server';

import { UserCardList } from './_components/UserCardList';

export default function MangePage({ params }: { params: { space: string } }) {
  const spaceId = uuidTranslator.toUUID(params.space);

  void api.user.fetch.prefetch(spaceId);
  void api.user.isAdmin.prefetch(spaceId);

  return (
    <HydrateClient>
      <div className='h-full w-full overflow-y-auto'>
        <Suspense fallback={<WrappedSpinner />}>
          <UserCardList spaceId={spaceId} />
        </Suspense>
      </div>
    </HydrateClient>
  );
}
