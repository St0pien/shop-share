'use client';

import { SearchIcon, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { type ChangeEventHandler, useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';

// TODO: Scroll top on search

export function SearchBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchText, setSearchText] = useState(
    searchParams.get('search') ?? ''
  );

  useEffect(() => {
    setSearchText(searchParams.get('search') ?? '');
  }, [pathname, searchParams]);

  const updateSearchParams = (text: string) => {
    let url = pathname;

    const newParams = new URLSearchParams(searchParams);

    if (text === '') {
      newParams.delete('search');
    } else {
      newParams.set('search', text);
    }

    if (newParams.size > 0) {
      url += `?${newParams.toString()}`;
    }

    router.replace(url);
  };

  const handleSearch: ChangeEventHandler<HTMLInputElement> = e => {
    setSearchText(e.target.value);
    updateSearchParams(e.target.value);
  };

  const clearSearch = () => {
    setSearchText('');
    const newParams = new URLSearchParams(searchParams);

    newParams.delete('search');

    // Replace directly to bypass debouncing (clearing should be immediate)
    router.replace(
      newParams.size > 0 ? `${pathname}?${newParams.toString()}` : pathname
    );
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
