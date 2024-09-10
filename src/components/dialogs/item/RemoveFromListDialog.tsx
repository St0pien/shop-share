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

      const previousCategories = utils.category.fetchWithinList.getData(listId);
      const previousCategoriesArr = previousCategories ?? [];

      if (item.category !== undefined) {
        const index = previousCategoriesArr.findIndex(
          c => c.id === item.category!.id
        );

        const optimisticCategories = [...previousCategoriesArr];

        if (previousCategoriesArr[index]?.itemsQuantity === 1) {
          optimisticCategories.splice(index, 1);
        } else {
          optimisticCategories[index] = {
            ...previousCategoriesArr[index]!,
            itemsQuantity: previousCategoriesArr[index]!.itemsQuantity - 1
          };
        }

        utils.category.fetchWithinList.setData(listId, optimisticCategories);
      }

      return { previousAssigned, previousUnassigned, previousCategories };
    },
    onSettled: async () => {
      const invalidates = [
        utils.list.fetchUnassignedItems.invalidate(listId),
        utils.list.fetchAssignedItems.invalidate(listId)
      ];

      if (item.category !== undefined) {
        invalidates.push(utils.category.fetchWithinList.invalidate(listId));
      }

      await Promise.all(invalidates);
    },
    onError: (error, _, ctx) => {
      toast.error(error.message);

      if (ctx !== undefined) {
        utils.list.fetchUnassignedItems.setData(listId, ctx.previousUnassigned);
        utils.list.fetchAssignedItems.setData(listId, ctx.previousAssigned);
        utils.category.fetchWithinList.setData(listId, ctx.previousCategories);
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
