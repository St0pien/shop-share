import { LayoutGrid, Plus } from 'lucide-react';

import { type ItemInfo } from '@/lib/types';

interface Props {
  itemInfo: ItemInfo;
}

export function ItemAddCard({ itemInfo }: Props) {
  return (
    <div className='relative flex w-5/6 flex-col justify-between rounded-lg bg-neutral-dark p-4'>
      <h2 className='break-all text-2xl font-bold'>{itemInfo.name}</h2>

      <div className='flex items-center justify-between'>
        {itemInfo.category ? (
          <div className='flex items-end gap-2'>
            <LayoutGrid className='text-primary' />
            <p>{itemInfo.category.name} </p>
          </div>
        ) : (
          <p className='text-sm text-neutral-light'>No category</p>
        )}

        <Plus className='h-12 w-12 text-primary' />
      </div>
    </div>
  );
}
