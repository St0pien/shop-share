'use client';

import { ListItemCard } from './ListItemCard';

export function ListItemCardList() {
  return (
    <div className='flex w-full flex-col items-center gap-3'>
      {new Array(20).fill(0).map((_, id) => (
        <ListItemCard key={id} />
      ))}
      <div className='h-48'></div>
    </div>
  );
}
