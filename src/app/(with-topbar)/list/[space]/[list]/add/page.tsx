import { ListChecks } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

import { HydrateClient } from '@/trpc/server';
import { uuidTranslator } from '@/lib/uuidTranslator';
import { Button } from '@/components/ui/button';
import { WrappedSpinner } from '@/components/svg/Spinner';

import { ItemAddCardList } from './_components/ItemAddCardList';

export default function AddListItemPage({
  params
}: {
  params: { list: string; space: string };
}) {
  const spaceId = uuidTranslator.toUUID(params.space);
  const listId = Number(params.list);

  return (
    <HydrateClient>
      <div className='h-full w-full'>
        <div className='h-full w-full overflow-y-auto'>
          <Suspense fallback={<WrappedSpinner />}>
            <ItemAddCardList listId={listId} />
          </Suspense>
        </div>

        <div className='fixed bottom-20 right-8 z-20'>
          <Link href={`/list/${params.space}/${params.list}`}>
            <Button
              variant='outline'
              className='h-16 w-16 rounded-full bg-neutral-medium p-0 focus-visible:ring-0 focus-visible:ring-offset-0'
            >
              <ListChecks className='h-10 w-10 text-primary' />
            </Button>
          </Link>
        </div>
      </div>
    </HydrateClient>
  );
}
