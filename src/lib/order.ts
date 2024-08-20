import { type SpaceInfo } from './types';

interface Order<T> {
  url: string;
  display: string;
  comparator: (a: T, b: T) => number;
}

function getOrdersByUrl<T>(
  orders: Order<T>[]
): Record<string, Pick<Order<T>, 'comparator' | 'display'>> {
  return orders.reduce(
    (acc, { url, display, comparator }) => ({
      ...acc,
      [url]: { display, comparator }
    }),
    {}
  );
}

export const spaceOrders: Order<SpaceInfo>[] = [
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

export const spaceOrdersByUrl = getOrdersByUrl(spaceOrders);
