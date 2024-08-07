import { type ButtonHTMLAttributes } from 'react';
import { Trash2 } from 'lucide-react';

import { Button } from '../ui/button';

export function DeleteButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button
      className='flex h-10 w-10 items-center justify-center p-2'
      variant='destructive'
      {...props}
    >
      <Trash2 className='h-full w-full text-black' />
    </Button>
  );
}
