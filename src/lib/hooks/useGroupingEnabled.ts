import { useSearchParams } from 'next/navigation';

export function useGroupingEnabled() {
  const searchParams = useSearchParams();

  return searchParams.get('grouping') !== 'disabled';
}
