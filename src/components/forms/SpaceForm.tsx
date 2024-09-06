'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';

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
import { spaceNameSchema } from '@/lib/schemas/space';

export type SpaceFormValues = z.infer<typeof createSpaceSchema>;

interface Props {
  defaultValues: SpaceFormValues;
  submitHandler?: SubmitHandler<SpaceFormValues>;
}

const createSpaceSchema = z.object({
  name: spaceNameSchema
});

export function SpaceForm({ defaultValues, submitHandler }: Props) {
  const createSpaceForm = useForm<z.infer<typeof createSpaceSchema>>({
    resolver: zodResolver(createSpaceSchema),
    defaultValues: defaultValues,
    mode: 'onChange'
  });

  return (
    <Form {...createSpaceForm}>
      <form
        className='flex flex-col gap-8'
        onSubmit={
          submitHandler
            ? createSpaceForm.handleSubmit(submitHandler)
            : undefined
        }
      >
        <FormField
          control={createSpaceForm.control}
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
