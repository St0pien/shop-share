import Link from 'next/link';
import { LayoutGrid, ListChecks } from 'lucide-react';

import { DeleteLink } from '@/components/buttons/DeleteLink';
import { type ItemInfo } from '@/lib/types';
import { uuidTranslator } from '@/lib/uuidTranslator';

interface Props {
  itemInfo: ItemInfo;
}

export function ItemCard({ itemInfo }: Props) {
  const spaceParam = uuidTranslator.fromUUID(itemInfo.spaceId);

  return (
    <div className='relative flex w-5/6 flex-col justify-between gap-2 rounded-lg bg-neutral-dark p-4'>
      <h2 className='break-all text-2xl font-bold'>{itemInfo.name}</h2>

      <div className='flex justify-between'>
        <div className='flex flex-col gap-2'>
          {itemInfo.category ? (
            <div className='flex items-end gap-2'>
              <LayoutGrid className='text-primary' />
              <p>{itemInfo.category.name} </p>
            </div>
          ) : (
            <p className='text-sm text-neutral-light'>No category</p>
          )}
          <div className='flex items-end gap-2'>
            <ListChecks className='text-primary' />
            <p>{itemInfo.listQuantity} lists use it</p>
          </div>
          <p className='text-sm text-neutral-light'>
            Created at {itemInfo.createdAt.toLocaleDateString()}
          </p>
        </div>

        <div className='z-10'>
          <DeleteLink
            href={`/space/${spaceParam}/items/delete/${itemInfo.id}`}
          />
        </div>
      </div>

      <Link
        className='absolute left-0 top-0 z-0 h-full w-full'
        href={`/space/${spaceParam}/items/edit/${itemInfo.id}`}
      ></Link>
    </div>
  );
}
