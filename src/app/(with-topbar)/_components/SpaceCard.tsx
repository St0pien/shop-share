import { LayoutGrid, ListChecks, ShoppingCart, Users } from 'lucide-react';
import Link from 'next/link';

import { type SpaceInfo } from '@/lib/types';

import { DeleteSpaceDialog } from './DeleteSpaceDialog';
import { ShareSpaceDialog } from './ShareSpaceDialog';

interface SpaceCardProps {
  spaceInfo: SpaceInfo;
}

export function SpaceCard({ spaceInfo }: SpaceCardProps) {
  return (
    <div className='relative w-5/6 rounded-lg bg-neutral-dark p-4'>
      <div className='flex w-full justify-between gap-2'>
        <h2 className='overflow-x-auto text-2xl font-bold'>{spaceInfo.name}</h2>
        <p className='text-sm text-neutral-light'>
          {spaceInfo.createdAt.toLocaleDateString()}
        </p>
      </div>
      <div className='grid grid-cols-[80%_1fr] py-6'>
        <div className='flex w-4/5 flex-col gap-2'>
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
        <div className='z-10 flex h-full w-full flex-col items-center justify-end gap-4'>
          <ShareSpaceDialog space={spaceInfo} />
          <DeleteSpaceDialog space={spaceInfo} />
        </div>
      </div>
      <Link
        href={`/space/${spaceInfo.id}`}
        className='absolute left-0 top-0 z-0 h-full w-full'
      ></Link>
    </div>
  );
}
