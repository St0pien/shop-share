'use client';

import { api } from '@/trpc/react';

import { CategoryCard } from './CategoryCard';

interface Props {
  spaceId: string;
}

export function CategoryCardList({ spaceId }: Props) {
  const [categories] = api.categories.fetch.useSuspenseQuery(spaceId);

  return (
    <div className='flex w-full flex-col items-center gap-4'>
      {categories.map(category => (
        <CategoryCard key={category.id} categoryInfo={category} />
      ))}
      <div className='h-32'></div>
    </div>
  );
}
