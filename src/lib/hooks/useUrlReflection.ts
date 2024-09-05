import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export interface UrlValue<T> {
  url: string;
  value: T;
}

interface UrlReflectionConfig<T> {
  urlKey: string;
  urlValueMap: UrlValue<T>[];
}

export function useStringUrlReflection(
  urlKey: string
): [string, (val: string) => void] {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const setValue = (val: string) => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (val === '' || val === undefined) {
      newSearchParams.delete(urlKey);
    } else {
      newSearchParams.set(urlKey, val);
    }

    router.replace(`${pathname}?${newSearchParams.toString()}`);
  };

  const valueParam = searchParams.get(urlKey) ?? '';

  return [valueParam, setValue];
}

export function useMappedUrlReflection<T>({
  urlKey,
  urlValueMap
}: UrlReflectionConfig<T>): [T | undefined, (val: T) => void] {
  const [value, setUrl] = useStringUrlReflection(urlKey);

  const setValue = (val: T) => {
    const url = urlValueMap.find(i => i.value === val)?.url;

    setUrl(url ?? '');
  };

  const selectedValue = urlValueMap.find(v => v.url === value)?.value;

  return [selectedValue, setValue];
}
