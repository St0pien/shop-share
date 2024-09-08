import {
  type CategoryInfo,
  type ItemInfo,
  type ListInfo,
  type SpaceInfo
} from './types';

export interface Order<T> {
  url: string;
  display: string;
  comparator: (a: T, b: T) => number;
}

export type OrdersByUrl<T> = Record<
  string,
  Pick<Order<T>, 'comparator' | 'display'>
>;

function getOrdersByUrl<T>(orders: Order<T>[]): OrdersByUrl<T> {
  return orders.reduce(
    (acc, { url, display, comparator }) => ({
      ...acc,
      [url]: { display, comparator }
    }),
    {}
  );
}

export const standardOrders: Order<
  SpaceInfo | CategoryInfo | ItemInfo | ListInfo
>[] = [
  {
    url: 'a-z',
    display: 'A-Z',
    comparator: (a, b) => a.name.localeCompare(b.name)
  },
  {
    url: 'z-a',
    display: 'Z-A',
    comparator: (a, b) => b.name.localeCompare(a.name)
  },
  {
    url: '',
    display: 'Latest',
    comparator: (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  },
  {
    url: 'oldest',
    display: 'Oldest',
    comparator: (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
  }
];

export const standardOrdersByUrl = getOrdersByUrl(standardOrders);
