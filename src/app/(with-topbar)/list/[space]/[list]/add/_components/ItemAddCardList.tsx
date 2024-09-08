'use client';

import { ItemAddCard } from './ItemAddCard';

interface Props {
  listId: number;
}

export function ItemAddCardList({ listId }: Props) {
  return (
    <div className='flex w-full flex-col items-center gap-4'>
      {new Array(10).fill(0).map((_, id) => (
        <ItemAddCard
          key={id}
          itemInfo={{
            id: 2,
            name: 'item',
            spaceId: 'sdf',
            createdAt: new Date(),
            listQuantity: 3,
            category: {
              id: 2,
              name: 'tesdsf'
            }
          }}
        />
      ))}

      <div className='h-48'></div>
    </div>
  );
}
