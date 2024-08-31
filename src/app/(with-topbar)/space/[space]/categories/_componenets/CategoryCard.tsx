import { ShoppingCart } from 'lucide-react';

import { type CategoryInfo } from '@/lib/types';
import { DeleteLink } from '@/components/buttons/DeleteLink';
import { uuidTranslator } from '@/lib/uuidTranslator';

interface CategoryCardProps {
  categoryInfo: CategoryInfo;
}

export function CategoryCard({ categoryInfo }: CategoryCardProps) {
  return (
    <div className='flex w-5/6 justify-between gap-2 rounded-lg bg-neutral-dark p-4'>
      <div className='flex flex-col justify-between gap-2'>
        <h2 className='overflow-x-auto text-2xl font-bold'>
          {categoryInfo.name}
        </h2>
        <div className='flex items-end gap-2'>
          <ShoppingCart className='text-primary' />
          <p>{categoryInfo.itemsQuantity} items</p>
        </div>
      </div>
      <div className='flex shrink-0 flex-col items-end justify-between'>
        <p className='text-sm text-neutral-light'>
          {categoryInfo.createdAt.toLocaleDateString()}
        </p>
        <DeleteLink
          href={`/space/${uuidTranslator.fromUUID(categoryInfo.spaceId)}/categories/delete/${categoryInfo.id}`}
        />
      </div>

      <div className='fixed bottom-32 right-8 z-20'></div>
    </div>
  );
}
