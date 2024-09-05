import Link from 'next/link';
import { Filter } from 'lucide-react';

import { Button } from '../ui/button';

export function FilterLink(props: { href: string; prefetch?: boolean }) {
  return (
    <Link {...props}>
      <Button variant='outline' className='w-10 h-10 p-0'>
        <Filter />
      </Button>
    </Link>
  );
}
