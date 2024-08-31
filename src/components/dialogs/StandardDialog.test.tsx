import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { startFakeNav } from '@/mocks/NavigationMock';

import { DialogClose, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';

import { StandardDialog } from './StandardDialog';

describe('StandardDialog', () => {
  test('navigates back on open change', async () => {
    const fakeNav = startFakeNav();
    fakeNav.url = new URL('https://test.com/dialog');

    const { rerender } = render(
      <StandardDialog open={true} title='title' description='desc'>
        Testing content
      </StandardDialog>
    );

    expect(screen.getByText('Testing content')).toBeVisible();
    const routerBack = vi.spyOn(fakeNav.router, 'back');

    rerender(
      <StandardDialog open={false} title='title' description='desc'>
        Testing content
      </StandardDialog>
    );

    expect(routerBack).toBeCalledTimes(1);
  });

  test('navigates back on x button', async () => {
    const fakeNav = startFakeNav();
    fakeNav.url = new URL('https://test.com/dialog');

    render(
      <StandardDialog open={true} title='title' description='desc'>
        Testing content
      </StandardDialog>
    );

    const user = userEvent.setup();

    const routerBack = vi.spyOn(fakeNav.router, 'back');
    await user.click(screen.getByRole('button'));

    expect(routerBack).toBeCalledTimes(1);
  });

  test('navigates back on close button', async () => {
    const fakeNav = startFakeNav();
    fakeNav.url = new URL('https://test.com/dialog');

    render(
      <StandardDialog open={true} title='title' description='desc'>
        Test content
        <DialogFooter>
          <DialogClose asChild>
            <Button data-testid='close-button'>Close</Button>
          </DialogClose>
        </DialogFooter>
      </StandardDialog>
    );

    const user = userEvent.setup();

    const routerBack = vi.spyOn(fakeNav.router, 'back');
    await user.click(screen.getByTestId('close-button'));

    expect(routerBack).toBeCalledTimes(1);
  });
});
