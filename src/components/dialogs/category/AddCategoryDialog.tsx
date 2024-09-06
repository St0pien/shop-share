'use client';

import { useState } from 'react';
import { type SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';

import { api } from '@/trpc/react';
import { uuidTranslator } from '@/lib/uuidTranslator';
import {
  CategoryForm,
  type CategoryFormValues
} from '@/components/forms/CategoryForm';

import { StandardDialog, type StandardDialogExtProps } from '../StandardDialog';

export function AddCategoryDialog(props: StandardDialogExtProps) {
  const [isOpen, setIsOpen] = useState(true);

  const { space: shortSpaceId } = useParams<{ space: string }>();

  const spaceId = uuidTranslator.toUUID(shortSpaceId);

  const utils = api.useUtils();

  const { mutate: createCategory } = api.category.create.useMutation({
    onMutate: async ({ categoryName, spaceId }) => {
      await utils.category.fetch.cancel(spaceId);
      const previousCategories = utils.category.fetch.getData(spaceId);

      const previousPart = previousCategories ?? [];
      const lastID =
        previousPart.length > 0 ? Math.max(...previousPart.map(c => c.id)) : 1;

      utils.category.fetch.setData(spaceId, [
        ...(previousCategories ?? []),
        {
          id: lastID + 1,
          name: categoryName,
          itemsQuantity: 0,
          createdAt: new Date(),
          spaceId
        }
      ]);

      return { previousCategories };
    },
    onSettled: async () => {
      await utils.category.fetch.invalidate(spaceId);
    },
    onError: (error, _, ctx) => {
      toast.error(error.message);

      if (ctx !== undefined) {
        utils.category.fetch.setData(spaceId, ctx.previousCategories);
      }
    }
  });

  const submitHandler: SubmitHandler<CategoryFormValues> = ({ name }) => {
    createCategory({
      categoryName: name,
      spaceId
    });
    setIsOpen(false);
  };

  return (
    <StandardDialog
      open={isOpen}
      title='Create category'
      description='Category groups together shopping items'
      {...props}
    >
      <CategoryForm
        defaultValues={{ name: '' }}
        submitHandler={submitHandler}
      />
    </StandardDialog>
  );
}
