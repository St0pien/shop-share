import { useSearchParams } from 'next/navigation';

export function useCategoryFilter<T extends { category?: { id: number } }>(
  data: T[]
) {
  const searchParams = useSearchParams();

  const categoriesParam = searchParams.get('categories');
  const filteredCategoryIds = categoriesParam
    ? categoriesParam.split(',').map(str => Number(str))
    : [];

  const filteredData =
    filteredCategoryIds.length > 0
      ? data.filter(
          item => !!filteredCategoryIds.find(id => item.category?.id === id)
        )
      : data;

  return filteredData;
}
