import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import userEvent from '@testing-library/user-event';
import { useRef } from 'react';

import { startFakeNav } from '@/mocks/NavigationMock';

import { useMappedUrlReflection } from './useUrlReflection';

const testValue = [
  {
    url: '',
    value: 1
  },
  { url: 'dos', value: 2 },
  {
    url: 'tres',
    value: 3
  }
];

const TestComponent = () => {
  const [value, setValue] = useMappedUrlReflection({
    urlKey: 'test',
    urlValueMap: testValue
  });

  const values = useRef([1, 2]);

  return (
    <button
      data-testid='btn'
      onClick={() => {
        setValue(values.current.pop()!);
      }}
    >
      <p data-testid='display'>{value}</p>
    </button>
  );
};

describe('useUrlReflection', () => {
  test('reflects value to url', async () => {
    const fakeNav = startFakeNav();

    render(<TestComponent />);
    const input = screen.getByTestId('btn');

    const user = userEvent.setup();

    await user.click(input);

    expect(fakeNav.searchParams.get('test')).toEqual(testValue[1]?.url);
  });

  test('displays current selection based on url', async () => {
    const fakeNav = startFakeNav();
    const { unmount } = render(<TestComponent />);

    let display = await screen.findByTestId('display');
    expect(display.textContent).toEqual(testValue[0]!.value.toString());

    fakeNav.url.searchParams.set('test', testValue[1]!.url);

    unmount();
    render(<TestComponent />);
    display = await screen.findByTestId('display');

    expect(display.textContent).toEqual(testValue[1]!.value.toString());
  });
});
