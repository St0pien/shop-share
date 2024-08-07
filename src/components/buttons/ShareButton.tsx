import { type ButtonHTMLAttributes } from 'react';
import { Share2 } from 'lucide-react';

import { Button } from '../ui/button';

export function ShareButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button
      className='flex h-10 w-10 items-center justify-center p-2'
      {...props}
    >
      <Share2 className='h-full w-full text-black' />
    </Button>
  );
}
