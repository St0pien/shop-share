'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { type CategoryInfo } from '@/lib/types';
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
import { categoryNameSchema } from '@/lib/schemas/category';

interface Props {
  category: CategoryInfo;
}

const editCategorySchema = z.object({
  name: categoryNameSchema
});

export function EditCategoryDialog({
  category,
  ...props
}: Props & StandardDialogExtProps) {
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

  const editCategoryForm = useForm<z.infer<typeof editCategorySchema>>({
    resolver: zodResolver(editCategorySchema),
    defaultValues: {
      name: category.name
    },
    mode: 'onChange'
  });

  const submitHandler: SubmitHandler<z.infer<typeof editCategorySchema>> = ({
    name
  }) => {
    updateCategory({
      id: category.id,
      name
    });
    setIsOpen(false);
    editCategoryForm.setValue('name', '');
  };

  return (
    <StandardDialog
      open={open}
      title='Edit category'
      description='Change the category name, items will stay the same'
      {...props}
    >
      <Form {...editCategoryForm}>
        <form
          className='flex flex-col gap-8'
          onSubmit={editCategoryForm.handleSubmit(submitHandler)}
        >
          <FormField
            control={editCategoryForm.control}
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
