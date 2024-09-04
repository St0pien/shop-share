import Link from 'next/link';
import { Suspense } from 'react';

import { Button } from '@/components/ui/button';
import { api, HydrateClient } from '@/trpc/server';
import { Spinner } from '@/components/svg/Spinner';

import { JoiningButtons } from './_components/JoiningButtons';

function SuspenseFallback() {
  return (
    <div className='flex w-full justify-center pt-20'>
      <Spinner className='h-20 w-20' />
    </div>
  );
}

export default function JoinSpacePage({
  searchParams
}: {
  searchParams: {
    token?: string;
  };
}) {
  if (searchParams.token === undefined) {
    return (
      <div className='flex w-full flex-col items-center gap-4 pt-8'>
        <h1 className='text-3xl font-bold text-destructive'>
          Incorrect invite link
        </h1>
        <Link href='/'>
          <Button>Go to home page</Button>
        </Link>
      </div>
    );
  }

  void api.space.getInviteInfo.prefetch(searchParams.token);

  return (
    <HydrateClient>
      <Suspense fallback={<SuspenseFallback />}>
        <JoiningButtons token={searchParams.token} />
      </Suspense>
    </HydrateClient>
  );
}
