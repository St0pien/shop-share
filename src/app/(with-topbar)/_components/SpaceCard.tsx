import { LayoutGrid, ListChecks, ShoppingCart, Users } from 'lucide-react';

import { DeleteButton } from '@/components/buttons/DeleteButton';
import { ShareButton } from '@/components/buttons/ShareButton';
import { type SpaceInfo } from '@/lib/types';

interface SpaceCardProps {
  spaceInfo: SpaceInfo;
}

export function SpaceCard({ spaceInfo }: SpaceCardProps) {
  return (
    <div className='w-5/6 rounded-lg bg-neutral-dark p-4'>
      <div className='flex w-full justify-between gap-2'>
        <h2 className='overflow-x-auto text-2xl font-bold'>{spaceInfo.name}</h2>
        <p className='text-sm text-neutral-light'>
          {spaceInfo.createdAt.toLocaleDateString()}
        </p>
      </div>
      <div className='grid grid-cols-[80%_1fr] py-6'>
        <div className='flex w-4/5 flex-shrink-0 flex-col gap-2'>
          <div className='flex gap-4'>
            <ListChecks className='text-primary' />
            <p>{spaceInfo.listQuantity} shopping lists</p>
          </div>
          <div className='flex gap-4'>
            <ShoppingCart className='text-primary' />
            <p>{spaceInfo.itemsQuantity} items</p>
          </div>
          <div className='flex gap-4'>
            <LayoutGrid className='text-primary' />
            <p>{spaceInfo.categoriesQuantity} categories</p>
          </div>
          <div className='flex gap-4'>
            <Users className='text-primary' />
            <p>{spaceInfo.membersQuantity} members</p>
          </div>
        </div>
        <div className='flex h-full w-full flex-shrink flex-col items-center justify-end gap-4'>
          <ShareButton />
          <DeleteButton />
        </div>
      </div>
    </div>
  );
}
