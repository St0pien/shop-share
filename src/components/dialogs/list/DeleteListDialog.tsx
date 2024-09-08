'use client';

import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { api } from '@/trpc/react';
import {
  StandardDialog,
  type StandardDialogExtProps
} from '@/components/dialogs/StandardDialog';

interface Props {
  listId: number;
}

export function DeleteListDialog({
  listId,
  ...props
}: Props & StandardDialogExtProps) {
  const [list] = api.list.get.useSuspenseQuery(listId);

  const utils = api.useUtils();
  const { mutate: deleteList } = api.list.delete.useMutation({
    onMutate: async listId => {
      await utils.list.fetch.cancel(list.spaceId);
      const previousLists = utils.list.fetch.getData(list.spaceId);

      const previousPart = previousLists ?? [];
      utils.list.fetch.setData(
        list.spaceId,
        previousPart.filter(l => l.id !== listId)
      );

      return { previousLists };
    },
    onSettled: async () => {
      await utils.list.fetch.invalidate(list.spaceId);
    },
    onError: (error, _, ctx) => {
      toast.error(error.message);

      if (ctx !== undefined) {
        utils.list.fetch.setData(list.spaceId, ctx.previousLists);
      }
    }
  });

  const [open, setIsOpen] = useState(true);

  const onConfirm = () => {
    deleteList(listId);
    setIsOpen(false);
  };

  return (
    <StandardDialog
      open={open}
      title='Delete list'
      description='Are you sure you want to delete?'
      {...props}
    >
      <div className='flex flex-col items-center'>
        <p className='break-all text-center text-lg text-primary'>
          {list.name}
        </p>
        <p className='pt-4 text-muted-foreground'>This list has</p>
        <div className='flex w-full justify-center pt-2'>
          <div className='flex gap-2'>
            <ShoppingCart className='text-primary' /> {list.itemsQuantity} items
          </div>
        </div>
      </div>
      <DialogFooter className='pt-4'>
        <div className='flex justify-between'>
          <DialogClose asChild>
            <Button variant='secondary'>No</Button>
          </DialogClose>
          <Button variant='destructive' onClick={onConfirm}>
            Yes
          </Button>
        </div>
      </DialogFooter>
    </StandardDialog>
  );
}
