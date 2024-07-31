'use client';

import { SearchIcon, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { type ChangeEventHandler, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { Input } from '@/components/ui/input';

export function SearchBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchText, setSearchText] = useState(
    searchParams.get('search') ?? ''
  );

  const updateSearchParams = useDebouncedCallback(text => {
    const urlSuffix = text === '' ? '' : `?search=${text}`;
    router.replace(pathname + urlSuffix);
  }, 200);

  const handleSearch: ChangeEventHandler<HTMLInputElement> = e => {
    setSearchText(e.target.value);
    updateSearchParams(e.target.value);
  };

  const clearSearch = () => {
    setSearchText('');
    // Replace directly to bypass debouncing (clearing should be immediate)
    router.replace(`${pathname}`);
  };

  return (
    <div className='relative w-full'>
      <Input
        className='rounded-full focus:outline-none'
        placeholder='Search...'
        icon={<SearchIcon className='text-primary' />}
        value={searchText}
        onChange={handleSearch}
      />
      {searchText !== '' && (
        <X
          role='button'
          onClick={clearSearch}
          className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground'
        />
      )}
    </div>
  );
}
