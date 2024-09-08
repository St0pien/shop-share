'use client';

import { z } from 'zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { listNameSchema } from '@/lib/schemas/list';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '../ui/form';
import { Input } from '../ui/input';
import { DialogClose, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';

export type ListFormValues = z.infer<typeof editListSchema>;

interface Props {
  defaultValues: ListFormValues;
  submitHandler?: SubmitHandler<ListFormValues>;
}

const editListSchema = z.object({
  name: listNameSchema
});

export function ListForm({ defaultValues, submitHandler }: Props) {
  const editListForm = useForm<ListFormValues>({
    resolver: zodResolver(editListSchema),
    defaultValues,
    mode: 'onChange'
  });

  return (
    <Form {...editListForm}>
      <form
        className='flex flex-col gap-8'
        onSubmit={
          submitHandler ? editListForm.handleSubmit(submitHandler) : undefined
        }
      >
        <FormField
          control={editListForm.control}
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
