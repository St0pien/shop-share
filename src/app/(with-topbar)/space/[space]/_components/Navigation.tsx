'use client';

import { LayoutGrid, ListChecks, ShoppingCart, Users } from 'lucide-react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

const routes = [
  {
    path: '',
    title: 'Shopping lists',
    icon: ListChecks
  },
  {
    path: '/items',
    title: 'Items',
    icon: ShoppingCart
  },
  {
    path: '/categories',
    title: 'Categories',
    icon: LayoutGrid
  },
  {
    path: '/manage',
    title: 'Manage',
    icon: Users
  }
];

export function Navigation() {
  const pathname = usePathname();
  const { space: spaceId } = useParams<{ space: string }>();

  return (
    <div className='z-20 flex h-full items-center justify-between bg-neutral-dark px-2'>
      {routes.map(({ path, title, icon: Icon }) => (
        <Link
          className={cn(
            pathname === `/space/${spaceId}${path}` && 'text-primary'
          )}
          key={path}
          href={`/space/${spaceId}${path}`}
        >
          <div className='flex flex-col items-center'>
            <Icon className='h-8 w-8' />
            <p>{title}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
