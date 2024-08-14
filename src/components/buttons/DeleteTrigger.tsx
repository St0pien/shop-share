import { type ButtonHTMLAttributes } from 'react';
import { Trash2 } from 'lucide-react';

import { Button } from '../ui/button';
import { DialogTrigger } from '../ui/dialog';

export function DeleteTrigger(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <DialogTrigger asChild>
      <Button
        className='focus-visible:focus-offset-0 flex h-10 w-10 items-center justify-center p-2 focus-visible:ring-0'
        variant='destructive'
        {...props}
      >
        <Trash2 className='h-full w-full text-black' />
      </Button>
    </DialogTrigger>
  );
}
