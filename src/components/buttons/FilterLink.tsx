'use client';

import Link from 'next/link';
import { Filter } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

import { cn } from '@/lib/utils';

import { Button } from '../ui/button';

export function FilterLink({
  href,
  prefetch
}: {
  href: string;
  prefetch?: boolean;
}) {
  const searchParams = useSearchParams();
  const filterQuantity = searchParams.get('categories')?.split(',').length;

  return (
    <Link href={`${href}?${searchParams.toString()}`} prefetch={prefetch}>
      <Button variant='outline' className='relative h-10 w-10 p-0'>
        <Filter className={cn(filterQuantity && 'text-primary')} />
        {filterQuantity && (
          <p className='absolute right-0 top-0 flex h-6 w-6 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-primary font-bold text-black'>
            {filterQuantity}
          </p>
        )}
      </Button>
    </Link>
  );
}
