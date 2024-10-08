'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { CategoryFilter } from '@/components/filtering/CategoryFilter';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useStringUrlReflection } from '@/lib/hooks/useUrlReflection';
import { api } from '@/trpc/react';
import { WrappedSpinner } from '@/components/svg/Spinner';
import { type CategoryInfo } from '@/lib/types';

import { StandardDialog } from '../StandardDialog';

interface Props {
  baseUrl: string;
  spaceId?: string;
  listId?: number;
}

export function FilterItemsDialog({ baseUrl, spaceId, listId }: Props) {
  const [open, setOpen] = useState(true);

  const [filters, setFilters] = useStringUrlReflection('categories');

  if (spaceId === undefined && listId === undefined) {
    throw new Error('spaceId and listId undefined');
  }

  const query =
    spaceId !== undefined
      ? api.category.fetch.useQuery(spaceId)
      : api.category.fetchWithinList.useQuery(listId!);
  const { data: categories } = query;

  const selectedIds = filters ? filters.split(',').map(str => Number(str)) : [];

  const onSelect = (val: CategoryInfo) => {
    const selectedIndex = selectedIds.findIndex(id => id === val.id);

    if (selectedIndex === -1) {
      selectedIds.push(val.id);
    } else {
      selectedIds.splice(selectedIndex, 1);
    }

    setFilters(selectedIds.join(','));
  };

  const searchParams = useSearchParams();

  const [url, setUrl] = useState(`${baseUrl}?${searchParams.toString()}`);

  const apply = () => {
    setUrl(`${baseUrl}?${searchParams.toString()}`);
    setOpen(false);
  };

  const clearAll = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('categories');

    setUrl(`${baseUrl}?${newParams.toString()}`);
    setOpen(false);
  };

  return (
    <StandardDialog
      open={open}
      title='Filter items'
      description='Select which categories you want to display'
      routerMethod='replace'
      returnUrl={url}
    >
      <CategoryFilter
        categories={categories}
        selected={selectedIds}
        onSelect={onSelect}
      />
      <p className='text-sm text-neutral-light'>Active filters:</p>
      <div className='flex h-full w-full flex-wrap gap-2'>
        {categories ? (
          selectedIds.map((id, index) => (
            <Badge
              className='max-w-48 overflow-hidden text-nowrap'
              onClick={() => {
                selectedIds.splice(index, 1);
                setFilters(selectedIds.join(','));
              }}
              key={id}
            >
              {categories.find(c => c.id === id)?.name}
            </Badge>
          ))
        ) : (
          <WrappedSpinner />
        )}
      </div>

      <div className='flex justify-between pt-4'>
        <Button onClick={clearAll} variant='destructive'>
          Clear all
        </Button>
        <Button onClick={apply}>Apply</Button>
      </div>
    </StandardDialog>
  );
}
