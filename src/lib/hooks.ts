import { useEffect, useRef } from 'react';

export function useScrollTop<T extends HTMLElement>(trigger: unknown) {
  const scrollAnchor = useRef<T>(null);

  useEffect(() => {
    scrollAnchor.current?.scrollIntoView();
  }, [trigger]);

  return scrollAnchor;
}
