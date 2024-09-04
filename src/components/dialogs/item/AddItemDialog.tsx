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
import { categoryIdAssignmentSchema, itemNameSchema } from '@/lib/schemas/item';
import { CategoryCombobox } from '@/components/form-fields/CategoryCombobox';

import { StandardDialog, type StandardDialogExtProps } from '../StandardDialog';

const createItemSchema = z.object({
  name: itemNameSchema,
  categoryId: categoryIdAssignmentSchema
});

export function AddItemDialog(props: StandardDialogExtProps) {
  const [isOpen, setIsOpen] = useState(true);

  const { space: shortSpaceId } = useParams<{ space: string }>();

  const spaceId = uuidTranslator.toUUID(shortSpaceId);

  const utils = api.useUtils();

  const { mutate: createItem } = api.item.create.useMutation({
    onMutate: async ({ itemName, spaceId }) => {
      // await utils.item.fetch.cancel(spaceId);
      const previousItems = utils.category.fetch.getData(spaceId);

      const previousPart = previousItems ?? [];
      const lastID =
        previousPart.length > 0 ? Math.max(...previousPart.map(c => c.id)) : 1;

      utils.category.fetch.setData(spaceId, [
        ...(previousItems ?? []),
        {
          id: lastID + 1,
          name: itemName,
          itemsQuantity: 0,
          createdAt: new Date(),
          spaceId
        }
      ]);

      return { previousItems };
    },
    onSettled: async () => {
      // await utils.item.fetch.invalidate(spaceId);
    },
    onError: (error, _, ctx) => {
      toast.error(error.message);

      if (ctx !== undefined) {
        // utils.item.fetch.setData(spaceId, ctx.previousItems);
      }
    }
  });

  const createItemForm = useForm<z.infer<typeof createItemSchema>>({
    resolver: zodResolver(createItemSchema),
    defaultValues: {
      name: ''
    },
    mode: 'onChange'
  });

  const submitHandler: SubmitHandler<z.infer<typeof createItemSchema>> = ({
    name,
    categoryId
  }) => {
    createItem({
      itemName: name,
      spaceId,
      categoryId
    });
    setIsOpen(false);
    createItemForm.setValue('name', '');
  };

  return (
    <StandardDialog
      open={isOpen}
      title='Create item'
      description='Create items to compose them into shop lists'
      {...props}
    >
      <Form {...createItemForm}>
        <form
          className='flex flex-col gap-8'
          onSubmit={createItemForm.handleSubmit(submitHandler)}
        >
          <FormField
            control={createItemForm.control}
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
            control={createItemForm.control}
            name='categoryId'
            render={({ field }) => (
              <CategoryCombobox
                spaceId={spaceId}
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
