'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { type ItemInfo } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { api } from '@/trpc/react';
import {
  StandardDialog,
  type StandardDialogExtProps
} from '@/components/dialogs/StandardDialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { categoryIdAssignmentSchema, itemNameSchema } from '@/lib/schemas/item';
import { CategoryCombobox } from '@/components/form-fields/CategoryCombobox';

interface Props {
  item: ItemInfo;
}

const editItemSchema = z.object({
  name: itemNameSchema,
  categoryId: categoryIdAssignmentSchema
});

export function EditItemDialog({
  item,
  ...props
}: Props & StandardDialogExtProps) {
  const [open, setIsOpen] = useState(true);

  const utils = api.useUtils();
  const { mutate: updateItem } = api.item.update.useMutation({
    onMutate: async itemData => {
      await utils.item.fetch.cancel(item.spaceId);
      const previousItems = utils.item.fetch.getData(item.spaceId);

      const previousPart = previousItems ?? [];
      const optimisticItem = {
        name: itemData.name,
        category: itemData.categoryId
          ? {
              id: itemData.categoryId,
              name:
                utils.category.fetch
                  .getData(item.spaceId)
                  ?.find(c => c.id == itemData.categoryId)?.name ?? 'Error'
            }
          : undefined
      };
      utils.item.fetch.setData(
        item.spaceId,
        previousPart.map(i =>
          i.id === item.id
            ? {
                ...i,
                ...optimisticItem
              }
            : i
        )
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

  const editItemForm = useForm<z.infer<typeof editItemSchema>>({
    resolver: zodResolver(editItemSchema),
    defaultValues: {
      name: item.name,
      categoryId: item.category?.id
    },
    mode: 'onChange'
  });

  const submitHandler: SubmitHandler<z.infer<typeof editItemSchema>> = ({
    name,
    categoryId
  }) => {
    updateItem({
      id: item.id,
      name,
      categoryId
    });
    setIsOpen(false);
  };

  return (
    <StandardDialog
      open={open}
      title='Edit item'
      description='Change the item name'
      {...props}
    >
      <Form {...editItemForm}>
        <form
          className='flex flex-col gap-8'
          onSubmit={editItemForm.handleSubmit(submitHandler)}
        >
          <FormField
            control={editItemForm.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder='Name' {...field} />
                </FormControl>
                <FormMessage className='dark:text-red-600' />
              </FormItem>
            )}
          />
          <FormField
            control={editItemForm.control}
            name='categoryId'
            render={({ field }) => (
              <CategoryCombobox
                spaceId={item.spaceId}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <DialogFooter>
            <div className='flex justify-between'>
              <DialogClose asChild>
                <Button type='button' variant='secondary'>
                  Cancel
                </Button>
              </DialogClose>
              <Button>Save</Button>
            </div>
          </DialogFooter>
        </form>
      </Form>
    </StandardDialog>
  );
}
