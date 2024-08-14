'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { api } from '@/trpc/react';
import { Spinner } from '@/components/svg/Spinner';

interface Props {
  token: string;
}

export function JoiningButtons({ token }: Props) {
  const [spaceDetails] = api.spaces.getInviteInfo.useSuspenseQuery(token);

  const router = useRouter();
  const { mutate: joinSpace, isPending } =
    api.spaces.joinThroughInvite.useMutation({
      onError: error => {
        router.replace('/');
        toast.error(error.message);
      },
      onSuccess: () => {
        router.replace(`/space/jsdf`);
        toast.success(`You have joined ${spaceDetails.name}`);
      }
    });

  return (
    <div className='absolute top-1/4 w-full px-8'>
      <h1 className='text-center text-2xl font-bold'>
        <span className='text-primary'>{spaceDetails.adminName}</span> invites
        you to their shop space{' '}
        <span className='text-primary'>{spaceDetails.name}</span>
      </h1>
      {!isPending ? (
        <>
          <h2 className='mt-8 text-center text-xl'>Do you want to join?</h2>
          <div className='mt-4 flex w-full justify-evenly'>
            <Link href='/'>
              <Button className='font-bold'>No</Button>
            </Link>
            <Button className='font-bold' onClick={() => joinSpace(token)}>
              Yes
            </Button>
          </div>
        </>
      ) : (
        <div className='flex w-full justify-center pt-8'>
          <Spinner className='h-20 w-20' />
        </div>
      )}
    </div>
  );
}
