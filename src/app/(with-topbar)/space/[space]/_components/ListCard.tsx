import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

import { DeleteLink } from '@/components/buttons/DeleteLink';
import { type ListInfo } from '@/lib/types';
import { uuidTranslator } from '@/lib/uuidTranslator';

interface Props {
  listInfo: ListInfo;
}

export function ListCard({ listInfo }: Props) {
  return (
    <motion.div
      layoutId={`list-${listInfo.id}`}
      className='relative flex w-5/6 flex-col justify-between gap-2 rounded-lg bg-neutral-dark p-4'
    >
      <h2 className='break-all text-2xl font-bold'>{listInfo.name}</h2>

      <div className='flex justify-between'>
        <div className='flex flex-col gap-4'>
          <div className='flex items-end gap-2'>
            <ShoppingCart className='text-primary' />
            <p>{listInfo.itemsQuantity} items</p>
          </div>
          <p className='text-sm text-neutral-light'>
            Created at {listInfo.createdAt.toLocaleDateString()}
          </p>
        </div>

        <div className='z-10'>
          <DeleteLink
            href={`/space/${uuidTranslator.fromUUID(listInfo.spaceId)}/lists/delete/${listInfo.id}`}
          />
        </div>
      </div>

      <Link
        className='absolute left-0 top-0 z-0 h-full w-full'
        href={`/list/${uuidTranslator.fromUUID(listInfo.spaceId)}/${listInfo.id}`}
      ></Link>
    </motion.div>
  );
}
