import Fuse from 'fuse.js';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

import { type OrdersByUrl } from '../order';

interface ProcessOptions<T> {
  data: T[];
  searchKeys: string[];
  orders: OrdersByUrl<T>;
}

export function useProcessedRecords<T>({
  searchKeys,
  data,
  orders
}: ProcessOptions<T>) {
  const fuse = useMemo(
    () =>
      new Fuse(data, {
        keys: searchKeys,
        ignoreLocation: true
      }),
    [data, searchKeys]
  );

  const searchParams = useSearchParams();
  const searchText = searchParams.get('search');

  let processedRecords: T[];

  if (searchText !== null) {
    processedRecords = fuse.search(searchText).map(({ item }) => item);
  } else {
    processedRecords = [...data];

    const orderParam = searchParams.get('order') ?? '';
    const order = orders[orderParam];

    if (order !== undefined) {
      processedRecords.sort(order.comparator);
    }
  }

  return processedRecords;
}
