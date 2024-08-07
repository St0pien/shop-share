import { Plus } from 'lucide-react';

import { Button } from '../ui/button';
import { DialogTrigger } from '../ui/dialog';

export function AddTrigger() {
  return (
    <DialogTrigger asChild>
      <Button className='h-16 w-16 rounded-full p-0 focus-visible:ring-0 focus-visible:ring-offset-0'>
        <Plus className='h-10 w-10' />
      </Button>
    </DialogTrigger>
  );
}
