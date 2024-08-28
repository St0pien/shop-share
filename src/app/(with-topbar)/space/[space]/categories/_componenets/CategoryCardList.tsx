import { CategoryCard } from './CategoryCard';

export function CategoryCardList() {
  return (
    <div className='flex w-full flex-col items-center gap-4'>
      {new Array(10).fill(0).map(() => (
        <CategoryCard
          categoryInfo={{
            id: 'sdfsdf',
            name: 'Food',
            createdAt: new Date(),
            itemsQuantity: 10
          }}
        />
      ))}
      <div className='h-32'></div>
    </div>
  );
}
