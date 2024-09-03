'use client';

import { useEffect } from 'react';

import { api } from '@/trpc/react';
import { standardOrdersByUrl } from '@/lib/order';
import { useProcessedRecords } from '@/lib/hooks/useProcessedRecords';

import { CategoryCard } from './CategoryCard';

interface Props {
  spaceId: string;
}

export function CategoryCardList({ spaceId }: Props) {
  const [categories] = api.categories.fetch.useSuspenseQuery(spaceId);

  const utils = api.useUtils();
  useEffect(() => {
    categories.forEach(category => {
      utils.categories.get.setData(category.id, category);
    });
  }, [categories, utils.categories.get]);

  const processedCategories = useProcessedRecords({
    data: categories,
    searchKeys: ['name'],
    orders: standardOrdersByUrl
  });

  return (
    <div className='flex w-full flex-col items-center gap-4'>
      {processedCategories.length === 0 && (
        <p className='text-xl text-neutral-light'>No categories found</p>
      )}
      {processedCategories.map(category => (
        <CategoryCard key={category.id} categoryInfo={category} />
      ))}
      <div className='h-32'></div>
    </div>
  );
}
