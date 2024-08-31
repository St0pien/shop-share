import Link from 'next/link';
import { Trash2 } from 'lucide-react';

import { Button } from '../ui/button';

export function DeleteLink(props: { href: string; prefetch?: boolean }) {
  return (
    <Link {...props}>
      <Button
        className='focus-visible:focus-offset-0 flex h-10 w-10 items-center justify-center p-2 focus-visible:ring-0'
        variant='destructive'
      >
        <Trash2 className='h-full w-full text-black' />
      </Button>
    </Link>
  );
}
