import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export interface UrlValue<T> {
  url: string;
  value: T;
}

interface UrlReflectionConfig<T> {
  urlKey: string;
  urlValueMap: UrlValue<T>[];
}

export function useUrlReflection<T>({
  urlKey,
  urlValueMap
}: UrlReflectionConfig<T>): [T | undefined, (val: T) => void] {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const setValue = (val: T) => {
    const newSearchParams = new URLSearchParams(searchParams);

    const url = urlValueMap.find(i => i.value === val)?.url;

    if (url === '' || url === undefined) {
      newSearchParams.delete(urlKey);
    } else {
      newSearchParams.set(urlKey, url);
    }

    router.replace(`${pathname}?${newSearchParams.toString()}`);
  };

  const valueParam = searchParams.get(urlKey) ?? '';
  const selectedValue = urlValueMap.find(v => v.url === valueParam)?.value;

  return [selectedValue, setValue];
}
