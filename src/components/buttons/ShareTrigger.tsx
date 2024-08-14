import { type ButtonHTMLAttributes } from 'react';
import { Share2 } from 'lucide-react';

import { Button } from '../ui/button';
import { DialogTrigger } from '../ui/dialog';

export function ShareTrigger(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <DialogTrigger asChild>
      <Button
        className='flex h-10 w-10 items-center justify-center p-2 focus-visible:ring-0 focus-visible:ring-offset-0'
        {...props}
      >
        <Share2 className='h-full w-full text-black' />
      </Button>
    </DialogTrigger>
  );
}
