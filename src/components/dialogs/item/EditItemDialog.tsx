'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { type SubmitHandler } from 'react-hook-form';

import { api } from '@/trpc/react';
import {
  StandardDialog,
  type StandardDialogExtProps
} from '@/components/dialogs/StandardDialog';
import { ItemForm, type ItemFormValues } from '@/components/forms/ItemForm';

interface Props {
  itemId: number;
}

export function EditItemDialog({
  itemId,
  ...props
}: Props & StandardDialogExtProps) {
  const [item] = api.item.get.useSuspenseQuery(itemId);

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

  const submitHandler: SubmitHandler<ItemFormValues> = ({
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
      <ItemForm
        spaceId={item.spaceId}
        defaultValues={{ name: item.name, categoryId: item.category?.id }}
        submitHandler={submitHandler}
      />
    </StandardDialog>
  );
}
