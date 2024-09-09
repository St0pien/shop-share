'use client';

import { api } from '@/trpc/react';

export interface ListNameProps {
  listId: number;
}

export function ListName({ listId }: ListNameProps) {
  const [listName] = api.list.getName.useSuspenseQuery(listId);

  if (listName.length > 23) {
    return listName.slice(0, 20) + '...';
  }

  return listName;
}
