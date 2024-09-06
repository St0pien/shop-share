'use client';
import { z } from 'zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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

export type ItemFormValues = z.infer<typeof editItemSchema>;

interface Props {
  defaultValues: ItemFormValues;
  submitHandler?: SubmitHandler<ItemFormValues>;
  spaceId: string;
}

const editItemSchema = z.object({
  name: itemNameSchema,
  categoryId: categoryIdAssignmentSchema
});

export function ItemForm({ defaultValues, submitHandler, spaceId }: Props) {
  const editItemForm = useForm<z.infer<typeof editItemSchema>>({
    resolver: zodResolver(editItemSchema),
    defaultValues,
    mode: 'onChange'
  });

  return (
    <Form {...editItemForm}>
      <form
        className='flex flex-col gap-8'
        onSubmit={
          submitHandler ? editItemForm.handleSubmit(submitHandler) : undefined
        }
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
  );
}
