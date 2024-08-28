import { ShoppingCart, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { type CategoryInfo } from '@/lib/types';

interface CategoryCardProps {
  categoryInfo: CategoryInfo;
}

// TODO: Fix long names display

export function CategoryCard({ categoryInfo }: CategoryCardProps) {
  return (
    <div className='flex w-5/6 justify-between rounded-lg bg-neutral-dark p-4'>
      <div className='flex flex-col justify-between gap-2'>
        <h2 className='overflow-x-auto text-2xl font-bold'>
          {categoryInfo.name}
        </h2>
        <div className='flex items-end gap-2'>
          <ShoppingCart className='text-primary' />
          <p>{categoryInfo.itemsQuantity} items</p>
        </div>
      </div>
      <div className='flex flex-col items-end justify-between'>
        <p className='text-sm text-neutral-light'>
          {categoryInfo.createdAt.toLocaleDateString()}
        </p>
        <Button className='h-8 w-8 p-0' variant='destructive'>
          <Trash2 className='text' />
        </Button>
      </div>

      <div className='fixed bottom-32 right-8 z-20'></div>
    </div>
  );
}
