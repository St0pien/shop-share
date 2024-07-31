import { type AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import {
  type ReadonlyURLSearchParams,
  usePathname,
  useRouter,
  useSearchParams
} from 'next/navigation';
import { vi } from 'vitest';

class NavigationMock {
  public url: URL;
  private readonly _base = 'https://example.com/';

  constructor() {
    this.url = new URL(this._base);
  }

  get router(): AppRouterInstance {
    return {
      replace: (path: string) => {
        this.url = new URL(`${this._base}${path}`);
      }
    } as AppRouterInstance;
  }

  get pathname(): string {
    return this.url.pathname;
  }

  get searchParams(): ReadonlyURLSearchParams {
    return this.url.searchParams as ReadonlyURLSearchParams;
  }
}

export function startFakeNav() {
  vi.mock(import('next/navigation'), async importOriginal => {
    const original = await importOriginal();

    return {
      ...original,
      useRouter: vi.fn(),
      usePathname: vi.fn(),
      useSearchParams: vi.fn()
    };
  });

  const fakeNav = new NavigationMock();

  vi.mocked(useSearchParams).mockImplementation(() => fakeNav.searchParams);
  vi.mocked(useRouter).mockImplementation(() => fakeNav.router);
  vi.mocked(usePathname).mockImplementation(() => fakeNav.url.pathname);

  return fakeNav;
}
