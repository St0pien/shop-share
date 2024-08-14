import { LayoutGrid, ListChecks, ShoppingCart, Users } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { DeleteTrigger } from '@/components/buttons/DeleteTrigger';
import { type SpaceInfo } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { api } from '@/trpc/react';
import { Spinner } from '@/components/svg/Spinner';

interface Props {
  space: SpaceInfo;
}

export function DeleteSpaceDialog({ space }: Props) {
  const utils = api.useUtils();
  const { mutate: deleteSpace, isPending } = api.spaces.delete.useMutation({
    onSuccess: () => {
      setIsOpen(false);
      void utils.spaces.fetch.invalidate();
    },
    onError: error => {
      toast.error(error.message);
    }
  });

  const [open, setIsOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DeleteTrigger />
      <DialogContent className='top-1/3 w-4/5 rounded-xl outline-none'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold'>Delete space</DialogTitle>
          <DialogDescription className='text-sm text-neutral-light'>
            Are you sure you want to delete?
          </DialogDescription>
        </DialogHeader>
        {!isPending ? (
          <>
            <div className='flex flex-col items-center'>
              <p className='text-lg text-primary'>{space.name}</p>
              <p className='text-muted-foreground'>with: </p>
              <div className='flex w-full justify-between pt-4'>
                <div className='flex gap-2'>
                  <ListChecks className='text-primary' /> {space.listQuantity}
                </div>
                <div className='flex gap-2'>
                  <ShoppingCart className='text-primary' />{' '}
                  {space.itemsQuantity}
                </div>
                <div className='flex gap-2'>
                  <LayoutGrid className='text-primary' />{' '}
                  {space.categoriesQuantity}
                </div>
                <div className='flex gap-2'>
                  <Users className='text-primary' /> {space.membersQuantity}
                </div>
              </div>
            </div>
            <DialogFooter className='pt-4'>
              <div className='flex justify-between'>
                <Button variant='secondary' onClick={() => setIsOpen(false)}>
                  No
                </Button>
                <Button
                  variant='destructive'
                  onClick={() => deleteSpace(space.id)}
                >
                  Yes
                </Button>
              </div>
            </DialogFooter>
          </>
        ) : (
          <div className='flex w-full justify-center py-6'>
            <Spinner className='h-20 w-20' />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
