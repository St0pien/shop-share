type Category =
  | undefined
  | {
      id: number;
      name: string;
    };

interface ItemCategoryGroup<T extends { category: Category }> {
  category: Category;

  items: T[];
}

export function groupItems<T extends { category: Category }>(
  items: T[]
): ItemCategoryGroup<T>[] {
  const categoryMap = new Map<number, T[]>();
  const uncategorized: T[] = [];

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

  const result: ItemCategoryGroup<T>[] = [...categoryMap.entries()].map(
    ([categoryId, items]) => ({
      category: {
        id: categoryId,
        name: items[0]!.category!.name
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
