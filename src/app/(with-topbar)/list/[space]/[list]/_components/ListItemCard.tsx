import { Square, Trash2 } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export function ListItemCard() {
  return (
    <div className='flex w-5/6 items-center justify-between rounded-full bg-neutral-dark px-4 py-2'>
      <Square className='shrink-0 text-primary' />
      <h2 className='mx-4 break-all text-xl font-bold'>
        HI markklsdflsdlfksdlfk
      </h2>

      <Link href=''>
        <Button
          variant='destructive'
          className='focus-visible:focus-offset-0 flex h-8 w-8 items-center justify-center p-1 focus-visible:ring-0'
        >
          <Trash2 className='h-full w-full text-black' />
        </Button>
      </Link>
    </div>
  );
}
