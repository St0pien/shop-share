import { type ItemInfo } from '@/lib/types';

import { ItemCard } from './ItemCard';

interface Props {
  spaceId: string;
}

export function ItemCardList({ spaceId }: Props) {
  const items: ItemInfo[] = [
    {
      id: 1,
      name: 'test',
      spaceId: 'sdfsdf',
      categoryId: 3,
      categoryName: 'sdfsdf',
      listQuantity: 3,
      createdAt: new Date()
    }
  ];

  return (
    <div className='flex w-full flex-col items-center gap-4'>
      {items.map(item => (
        <ItemCard key={item.id} itemInfo={item} />
      ))}
    </div>
  );
}
