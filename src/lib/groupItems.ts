import { type ItemInfo } from './types';

type Category =
  | undefined
  | {
      id: number;
      name: string;
    };

interface ItemCategoryGroup {
  category: Category;

  items: ItemInfo[];
}

export function groupItems(items: ItemInfo[]): ItemCategoryGroup[] {
  const categoryMap = new Map<number, ItemInfo[]>();
  const uncategorized: ItemInfo[] = [];

  items.forEach(item => {
    if (item.category === undefined) {
      uncategorized.push(item);
      return;
    }

    if (!categoryMap.has(item.category.id)) {
      categoryMap.set(item.category.id, []);
    }

    categoryMap.get(item.category.id)!.push(item);
  });

  const result: ItemCategoryGroup[] = [...categoryMap.entries()].map(
    ([categoryId, items]) => ({
      category: {
        id: categoryId,
        name: items[0]!.name
      },
      items
    })
  );

  if (uncategorized.length > 0) {
    result.push({
      category: undefined,
      items: uncategorized
    });
  }

  return result;
}
