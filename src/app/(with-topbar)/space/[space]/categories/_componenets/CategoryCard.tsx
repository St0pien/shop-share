import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

import { type CategoryInfo } from '@/lib/types';
import { DeleteLink } from '@/components/buttons/DeleteLink';
import { uuidTranslator } from '@/lib/uuidTranslator';

interface CategoryCardProps {
  categoryInfo: CategoryInfo;
}

export function CategoryCard({ categoryInfo }: CategoryCardProps) {
  return (
    <motion.div
      layoutId={`category-${categoryInfo.id}`}
      className='relative flex w-5/6 flex-col justify-between gap-2 rounded-lg bg-neutral-dark p-4'
    >
      <h2 className='break-all text-2xl font-bold'>{categoryInfo.name}</h2>

      <div className='flex justify-between'>
        <div className='flex flex-col gap-4'>
          <div className='flex items-end gap-2'>
            <ShoppingCart className='text-primary' />
            <p>{categoryInfo.itemsQuantity} items</p>
          </div>
          <p className='text-sm text-neutral-light'>
            Created at {categoryInfo.createdAt.toLocaleDateString()}
          </p>
        </div>

        <div className='z-10'>
          <DeleteLink
            href={`/space/${uuidTranslator.fromUUID(categoryInfo.spaceId)}/categories/delete/${categoryInfo.id}`}
          />
        </div>
      </div>

      <Link
        className='absolute left-0 top-0 z-0 h-full w-full'
        href={`/space/${uuidTranslator.fromUUID(categoryInfo.spaceId)}/categories/edit/${categoryInfo.id}`}
      ></Link>
    </motion.div>
  );
}
