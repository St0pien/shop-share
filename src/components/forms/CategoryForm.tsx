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
import { categoryNameSchema } from '@/lib/schemas/category';

export type CategoryFormValues = z.infer<typeof editCategorySchema>;

interface Props {
  defaultValues: CategoryFormValues;
  submitHandler?: SubmitHandler<CategoryFormValues>;
}

const editCategorySchema = z.object({
  name: categoryNameSchema
});

export function CategoryForm({ defaultValues, submitHandler }: Props) {
  const editCategoryForm = useForm<z.infer<typeof editCategorySchema>>({
    resolver: zodResolver(editCategorySchema),
    defaultValues,
    mode: 'onChange'
  });

  return (
    <Form {...editCategoryForm}>
      <form
        className='flex flex-col gap-8'
        onSubmit={
          submitHandler
            ? editCategoryForm.handleSubmit(submitHandler)
            : undefined
        }
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
  );
}
