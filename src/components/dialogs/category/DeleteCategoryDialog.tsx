'use client';

import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { type CategoryInfo } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { api } from '@/trpc/react';
import {
  StandardDialog,
  type StandardDialogExtProps
} from '@/components/dialogs/StandardDialog';

interface Props {
  category: CategoryInfo;
}

export function DeleteCategoryDialog({
  category,
  ...props
}: Props & StandardDialogExtProps) {
  const utils = api.useUtils();
  const { mutate: deleteSpace } = api.category.delete.useMutation({
    onMutate: async categoryId => {
      await utils.category.fetch.cancel(category.spaceId);
      const previousCategories = utils.category.fetch.getData(category.spaceId);

      const previousPart = previousCategories ?? [];
      utils.category.fetch.setData(
        category.spaceId,
        previousPart.filter(c => c.id !== categoryId)
      );

      return { previousCategories };
    },
    onSettled: async () => {
      await utils.category.fetch.invalidate(category.spaceId);
    },
    onError: (error, _, ctx) => {
      toast.error(error.message);

      if (ctx !== undefined) {
        utils.category.fetch.setData(category.spaceId, ctx.previousCategories);
      }
    }
  });

  const [open, setIsOpen] = useState(true);

  const onConfirm = () => {
    deleteSpace(category.id);
    setIsOpen(false);
  };

  return (
    <StandardDialog
      open={open}
      title='Delete category'
      description='Are you sure you want to delete?'
      {...props}
    >
      <div className='flex flex-col items-center'>
        <p className='break-all text-center text-lg text-primary'>
          {category.name}
        </p>
        <p className='pt-4 text-muted-foreground'>
          This will reset category on
        </p>
        <div className='flex w-full justify-center pt-2'>
          <div className='flex gap-2'>
            <ShoppingCart className='text-primary' /> {category.itemsQuantity}{' '}
            items
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
