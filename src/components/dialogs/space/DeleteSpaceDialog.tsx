import { LayoutGrid, ListChecks, ShoppingCart, Users } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { type SpaceInfo } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { api } from '@/trpc/react';
import { Spinner } from '@/components/svg/Spinner';
import {
  StandardDialog,
  type StandardDialogExtProps
} from '@/components/dialogs/StandardDialog';

interface Props {
  space: SpaceInfo;
}

export function DeleteSpaceDialog({
  space,
  ...props
}: Props & StandardDialogExtProps) {
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

  const [open, setIsOpen] = useState(true);

  return (
    <StandardDialog
      open={open}
      title='Delete space'
      description='Are you sure you want to delete?'
      {...props}
    >
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
                <ShoppingCart className='text-primary' /> {space.itemsQuantity}
              </div>
              <div className='flex gap-2'>
                <LayoutGrid className='text-primary' />
                {space.categoriesQuantity}
              </div>
              <div className='flex gap-2'>
                <Users className='text-primary' /> {space.membersQuantity}
              </div>
            </div>
          </div>
          <DialogFooter className='pt-4'>
            <div className='flex justify-between'>
              <DialogClose asChild>
                <Button variant='secondary'>No</Button>
              </DialogClose>
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
    </StandardDialog>
  );
}
