'use client';

import { ListChecks } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { type ItemInfo } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { api } from '@/trpc/react';
import {
  StandardDialog,
  type StandardDialogExtProps
} from '@/components/dialogs/StandardDialog';

interface Props {
  item: ItemInfo;
}

export function DeleteItemDialog({
  item,
  ...props
}: Props & StandardDialogExtProps) {
  const utils = api.useUtils();
  const { mutate: deleteItem } = api.item.delete.useMutation({
    onMutate: async itemId => {
      await utils.item.fetch.cancel(item.spaceId);
      const previousItems = utils.item.fetch.getData(item.spaceId);

      const previousPart = previousItems ?? [];
      utils.item.fetch.setData(
        item.spaceId,
        previousPart.filter(i => i.id !== itemId)
      );

      return { previousItems };
    },
    onSettled: async () => {
      await utils.item.fetch.invalidate(item.spaceId);
    },
    onError: (error, _, ctx) => {
      toast.error(error.message);

      if (ctx !== undefined) {
        utils.item.fetch.setData(item.spaceId, ctx.previousItems);
      }
    }
  });

  const [open, setIsOpen] = useState(true);

  const onConfirm = () => {
    deleteItem(item.id);
    setIsOpen(false);
  };

  return (
    <StandardDialog
      open={open}
      title='Delete item'
      description='Are you sure you want to delete?'
      {...props}
    >
      <div className='flex flex-col items-center'>
        <p className='break-all text-center text-lg text-primary'>
          {item.name}
        </p>
        <div className='flex w-full justify-center pt-4'>
          <div className='flex gap-2'>
            <ListChecks className='text-primary' /> {item.listQuantity} lists
          </div>
        </div>
        <p className='pt-2 text-muted-foreground'>will loose this item</p>
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
