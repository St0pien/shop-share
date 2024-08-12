import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { startFakeNav } from '@/mocks/NavigationMock';

import { OrderSelect } from './OrderSelect';

const testOrders = [
  {
    url: '',
    display: 'Option 1'
  },
  {
    url: 'option-2',
    display: 'Option 2'
  }
];

async function prepareOrderSelect() {
  render(<OrderSelect orderSelectItems={testOrders} />);

  const select = await screen.findByTestId('order-select');

  return select;
}

describe('OrderSelect', () => {
  window.HTMLElement.prototype.hasPointerCapture = vi.fn();
  window.HTMLElement.prototype.scrollIntoView = vi.fn();

  test('reflects selection to url', async () => {
    const fakeNav = startFakeNav();
    const select = await prepareOrderSelect();
    const user = userEvent.setup();

    await user.click(select);

    const option2 = await screen.findByText(testOrders[1]!.display);
    await user.click(option2);

    expect(fakeNav.searchParams.get('order')).toEqual(testOrders[1]?.url);
  });

  test('displays current selection based on url', async () => {
    const fakeNav = startFakeNav();
    const { unmount } = render(<OrderSelect orderSelectItems={testOrders} />);

    expect(await screen.findByText(testOrders[0]!.display)).toBeVisible();

    fakeNav.url.searchParams.set('order', testOrders[1]!.url);

    unmount();
    render(<OrderSelect orderSelectItems={testOrders} />);

    expect(await screen.findByText(testOrders[1]!.display)).toBeVisible();
  });

  // test('clears param if empty string', () => {});
  //
  // test('preserves other url query params', () => {});
});
