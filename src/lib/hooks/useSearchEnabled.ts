import { useSearchParams } from 'next/navigation';

export function useSearchEnabled() {
  const searchParams = useSearchParams();

  return searchParams.has('search');
}
