import Link from 'next/link';
import { Plus } from 'lucide-react';

import { Button } from '../ui/button';

export function AddLink({ href }: { href: string }) {
  return (
    <Link href={href}>
      <Button className='h-16 w-16 rounded-full p-0 focus-visible:ring-0 focus-visible:ring-offset-0'>
        <Plus className='h-10 w-10' />
      </Button>
    </Link>
  );
}
