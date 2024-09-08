'use client';

import { useState } from 'react';
import { type SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';

import { api } from '@/trpc/react';
import { uuidTranslator } from '@/lib/uuidTranslator';
import { ItemForm, type ItemFormValues } from '@/components/forms/ItemForm';

import { StandardDialog, type StandardDialogExtProps } from '../StandardDialog';

export function AddItemDialog(props: StandardDialogExtProps) {
  const [isOpen, setIsOpen] = useState(true);

  const { space: shortSpaceId } = useParams<{ space: string }>();

  const spaceId = uuidTranslator.toUUID(shortSpaceId);

  const utils = api.useUtils();

  const { mutate: createItem } = api.item.create.useMutation({
    onMutate: async ({ itemName, spaceId, categoryId }) => {
      await utils.item.fetch.cancel(spaceId);
      const previousItems = utils.item.fetch.getData(spaceId);

      const previousPart = previousItems ?? [];
      const lastID =
        previousPart.length > 0 ? Math.max(...previousPart.map(i => i.id)) : 1;

      const category = utils.category.fetch
        .getData(spaceId)
        ?.find(category => category.id === categoryId);
      utils.item.fetch.setData(spaceId, [
        ...(previousItems ?? []),
        {
          id: lastID + 1,
          name: itemName,
          createdAt: new Date(),
          spaceId,
          listQuantity: 0,
          category: category
            ? {
                id: category.id,
                name: category.name
              }
            : undefined
        }
      ]);

      return { previousItems };
    },
    onSettled: async () => {
      await utils.item.fetch.invalidate(spaceId);
    },
    onError: (error, _, ctx) => {
      toast.error(error.message);

      if (ctx !== undefined) {
        utils.item.fetch.setData(spaceId, ctx.previousItems);
      }
    }
  });

  const submitHandler: SubmitHandler<ItemFormValues> = ({
    name,
    categoryId
  }) => {
    createItem({
      itemName: name,
      spaceId,
      categoryId
    });
    setIsOpen(false);
  };

  return (
    <StandardDialog
      open={isOpen}
      title='Create item'
      description='Create items to compose them into shop lists'
      {...props}
    >
      <ItemForm
        spaceId={spaceId}
        defaultValues={{ name: '', categoryId: undefined }}
        submitHandler={submitHandler}
      />
    </StandardDialog>
  );
}
