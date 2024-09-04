'use client';

import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';

import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import { api } from '@/trpc/react';
import { uuidTranslator } from '@/lib/uuidTranslator';
import { categoryNameSchema } from '@/lib/schemas/category';

import { StandardDialog, type StandardDialogExtProps } from '../StandardDialog';

const createCategorySchema = z.object({
  name: categoryNameSchema
});

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

  const createCategoryForm = useForm<z.infer<typeof createCategorySchema>>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: ''
    },
    mode: 'onChange'
  });

  const submitHandler: SubmitHandler<z.infer<typeof createCategorySchema>> = ({
    name
  }) => {
    createCategory({
      categoryName: name,
      spaceId
    });
    setIsOpen(false);
    createCategoryForm.setValue('name', '');
  };

  return (
    <StandardDialog
      open={isOpen}
      title='Create category'
      description='Category groups together shopping items'
      {...props}
    >
      <Form {...createCategoryForm}>
        <form
          className='flex flex-col gap-8'
          onSubmit={createCategoryForm.handleSubmit(submitHandler)}
        >
          <FormField
            control={createCategoryForm.control}
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
