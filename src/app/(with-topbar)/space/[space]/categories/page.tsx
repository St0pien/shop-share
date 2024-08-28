import { AddCategoryDialog } from './_componenets/AddCategoryDialog';
import { CategoryCardList } from './_componenets/CategoryCardList';

export default function CategoriesPage() {
  return (
    <div className='h-full w-full overflow-y-auto'>
      <CategoryCardList />

      <div className='fixed bottom-32 right-8 z-20'>
        <AddCategoryDialog />
      </div>
    </div>
  );
}
