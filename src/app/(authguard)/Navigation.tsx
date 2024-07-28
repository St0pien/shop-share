import { LayoutGrid, ListChecks, ShoppingCart, Users } from "lucide-react";

export function Navigation() {
  return (
    <div className='bg-neutral-dark flex items-center justify-between px-2'>
      <div className='flex flex-col items-center'>
        <ListChecks className='h-8 w-8' />
        <p>Shopping lists</p>
      </div>
      <div className='flex flex-col items-center'>
        <ShoppingCart className='h-8 w-8' />
        <p>Items</p>
      </div>
      <div className='flex flex-col items-center'>
        <LayoutGrid className='h-8 w-8' />
        <p>Categories</p>
      </div>
      <div className='flex flex-col items-center'>
        <Users className='h-8 w-8' />
        <p>Manage</p>
      </div>
    </div>
  );
}
