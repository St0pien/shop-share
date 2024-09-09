import { FilterLink } from '@/components/buttons/FilterLink';

export default function ListItemsFilter({
  params
}: {
  params: { space: string; list: string };
}) {
  const href = `/list/${params.space}/${params.list}/add/filter`;

  return <FilterLink href={href} prefetch />;
}
