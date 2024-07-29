'use client';

import { LayoutGrid, ListChecks, ShoppingCart, Users } from 'lucide-react';
import Link from 'next/link';

const routes = [
  {
    path: '/',
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
  return (
    <div className='flex items-center justify-between bg-neutral-dark px-2'>
      {routes.map(({ path, title, icon: Icon }) => (
        <div key={path} className='flex flex-col items-center'>
          <Icon className='h-8 w-8' />
          <Link href={path}>{title}</Link>
        </div>
      ))}
    </div>
  );
}
