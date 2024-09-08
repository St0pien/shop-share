import { useEffect, useRef } from 'react';

export function useScrollTopOnChange<T extends HTMLElement>(trigger: unknown) {
  const scrollContainer = useRef<T>(null);

  useEffect(() => {
    scrollContainer.current?.scroll({ top: 0 });
  }, [trigger]);

  return scrollContainer;
}
