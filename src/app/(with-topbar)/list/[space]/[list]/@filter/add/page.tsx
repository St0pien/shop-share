import { UNSTABLE_FilterLink } from '../_components/UNSTABLE_FilterLink';

export default function ListItemsFilter({
  params
}: {
  params: { space: string; list: string };
}) {
  const href = `/list/${params.space}/${params.list}/add/filter`;

  return <UNSTABLE_FilterLink href={href} />;
}
