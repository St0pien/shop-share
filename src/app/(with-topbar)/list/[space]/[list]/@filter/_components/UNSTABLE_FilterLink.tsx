'use client';

import { Filter } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import { cn } from '@/lib/utils';

export function UNSTABLE_FilterLink({ href }: { href: string }) {
  const searchParams = useSearchParams();
  const filterQuantity = searchParams.get('categories')?.split(',').length;

  const router = useRouter();

  // HACK: Avoiding Link and Button is intentional because after render it gains focus automatically
  // and that's the problem when typing in searchbar
  const navigate = () => {
    router.push(`${href}?${searchParams.toString()}`);
  };

  return (
    <div
      onClick={navigate}
      className='relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border border-input p-0 hover:bg-accent'
    >
      <Filter className={cn(filterQuantity && 'text-primary')} />
      {filterQuantity && (
        <p className='absolute right-0 top-0 flex h-6 w-6 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-primary font-bold text-black'>
          {filterQuantity}
        </p>
      )}
    </div>
  );
}
