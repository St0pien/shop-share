import { describe, expect, test, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { startFakeNav } from '@/mocks/NavigationMock';

import { SearchBar } from './SearchBar';

async function prepareSearchBar() {
  render(<SearchBar />);

  const searchInput = await screen.findByRole('textbox');

  return searchInput;
}

describe('SearchBar', () => {
  test('reflects input to the url', async () => {
    const fakeNav = startFakeNav();
    const searchInput = await prepareSearchBar();
    const searchText = 'chicken nugget';
    const user = userEvent.setup();

    await user.click(searchInput);
    await user.keyboard(searchText);

    await vi.waitFor(() => {
      expect(fakeNav.url.searchParams.get('search')).toEqual(searchText);
    });

    expect(searchInput).toHaveValue('chicken nugget');
  });

  test('removes search parameter when empty', async () => {
    const fakeNav = startFakeNav();
    const searchInput = await prepareSearchBar();
    const searchText = 'Something random';
    const user = userEvent.setup();

    await user.click(searchInput);
    await user.keyboard(searchText);

    await vi.waitFor(() => {
      expect(fakeNav.url.searchParams.get('search')).toEqual(searchText);
    });

    fireEvent.change(searchInput, { target: { value: '' } });

    await vi.waitFor(() => {
      expect(fakeNav.searchParams.toString()).toEqual('');
    });
  });

  test('clear button clears url immediately', async () => {
    const fakeNav = startFakeNav();
    const searchInput = await prepareSearchBar();
    const searchText = 'Something random';
    const user = userEvent.setup();

    await user.click(searchInput);
    await user.keyboard(searchText);

    await vi.waitFor(() => {
      expect(fakeNav.url.searchParams.get('search')).toEqual(searchText);
    });

    await user.click(screen.getByRole('button'));

    expect(fakeNav.url.searchParams.toString()).toEqual('');
  });
});
