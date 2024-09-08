import { useEffect, useRef } from 'react';

// TODO: Add to categories items and lists

export function useScrollTopOnChange<T extends HTMLElement>(trigger: unknown) {
  const scrollContainer = useRef<T>(null);

  useEffect(() => {
    scrollContainer.current?.scroll({ top: 0 });
  }, [trigger]);

  return scrollContainer;
}
