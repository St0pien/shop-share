'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { type SubmitHandler } from 'react-hook-form';

import { api } from '@/trpc/react';
import {
  StandardDialog,
  type StandardDialogExtProps
} from '@/components/dialogs/StandardDialog';
import {
  CategoryForm,
  type CategoryFormValues
} from '@/components/forms/CategoryForm';

interface Props {
  categoryId: number;
}

export function EditCategoryDialog({
  categoryId,
  ...props
}: Props & StandardDialogExtProps) {
  const [category] = api.category.get.useSuspenseQuery(categoryId);

  const [open, setIsOpen] = useState(true);

  const utils = api.useUtils();
  const { mutate: updateCategory } = api.category.update.useMutation({
    onMutate: async categoryData => {
      await utils.category.fetch.cancel(category.spaceId);
      const previousCategories = utils.category.fetch.getData(category.spaceId);

      const previousPart = previousCategories ?? [];
      utils.category.fetch.setData(
        category.spaceId,
        previousPart.map(c =>
          c.id === categoryData.id ? { ...c, name: categoryData.name } : c
        )
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

  const submitHandler: SubmitHandler<CategoryFormValues> = ({ name }) => {
    updateCategory({
      id: category.id,
      name
    });
    setIsOpen(false);
  };

  return (
    <StandardDialog
      open={open}
      title='Edit category'
      description='Change the category name, items will stay the same'
      {...props}
    >
      <CategoryForm
        defaultValues={{ name: category.name }}
        submitHandler={submitHandler}
      />
    </StandardDialog>
  );
}
