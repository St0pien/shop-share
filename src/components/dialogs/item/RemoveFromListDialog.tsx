'use client';

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
  itemId: number;
  listId: number;
}

export function RemoveFromListDialog({
  itemId,
  listId,
  ...props
}: Props & StandardDialogExtProps) {
  const [item] = api.item.get.useSuspenseQuery(itemId);

  const utils = api.useUtils();
  const { mutate: removeItem } = api.list.removeItem.useMutation({
    onMutate: async ({ listId, itemId }) => {
      await Promise.all([
        utils.list.fetchUnassignedItems.cancel(listId),
        utils.list.fetchAssignedItems.cancel(listId)
      ]);

      const previousAssigned = utils.list.fetchAssignedItems.getData(listId);
      const previousAssignedArr = previousAssigned ?? [];
      utils.list.fetchAssignedItems.setData(
        listId,
        previousAssignedArr.filter(i => i.item.id !== itemId)
      );

      const previousUnassigned =
        utils.list.fetchUnassignedItems.getData(listId);
      const previousUnassignedArr = previousUnassigned ?? [];
      utils.list.fetchUnassignedItems.setData(listId, [
        ...previousUnassignedArr,
        item
      ]);

      return { previousAssigned, previousUnassigned };
    },
    onSettled: async () => {
      await Promise.all([
        utils.list.fetchUnassignedItems.invalidate(listId),
        utils.list.fetchAssignedItems.invalidate(listId)
      ]);
    },
    onError: (error, _, ctx) => {
      toast.error(error.message);

      if (ctx !== undefined) {
        utils.list.fetchUnassignedItems.setData(listId, ctx.previousUnassigned);
        utils.list.fetchAssignedItems.setData(listId, ctx.previousAssigned);
      }
    }
  });

  const [open, setIsOpen] = useState(true);

  const onConfirm = () => {
    removeItem({ itemId: item.id, listId });
    setIsOpen(false);
  };

  return (
    <StandardDialog
      open={open}
      title='Remove item from list'
      description='Are you sure you want to remove item from list?'
      {...props}
    >
      <div className='flex flex-col items-center'>
        <p className='break-all text-center text-lg text-primary'>
          {item.name}
        </p>
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
