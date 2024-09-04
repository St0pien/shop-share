'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useState } from 'react';

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
import { Spinner } from '@/components/svg/Spinner';
import { spaceNameSchema } from '@/lib/schemas/space';

import { StandardDialog, type StandardDialogExtProps } from '../StandardDialog';

const createSpaceSchema = z.object({
  name: spaceNameSchema
});

export function AddSpaceDialog(props: StandardDialogExtProps) {
  const [isOpen, setIsOpen] = useState(true);

  const utils = api.useUtils();

  const { mutate: createSpace, isPending } = api.space.create.useMutation({
    onSuccess: () => {
      setIsOpen(false);
      createSpaceForm.setValue('name', '');
      void utils.space.fetch.invalidate();
    },
    onError: error => {
      toast.error(error.message);
    }
  });

  const createSpaceForm = useForm<z.infer<typeof createSpaceSchema>>({
    resolver: zodResolver(createSpaceSchema),
    defaultValues: {
      name: ''
    },
    mode: 'onChange'
  });

  const submitHandler: SubmitHandler<z.infer<typeof createSpaceSchema>> = ({
    name
  }) => {
    createSpace(name);
  };

  return (
    <StandardDialog
      open={isOpen}
      title='Create shopping space'
      description='Space binds together users, items, lists and categories'
      {...props}
    >
      {!isPending ? (
        <Form {...createSpaceForm}>
          <form
            className='flex flex-col gap-8'
            onSubmit={createSpaceForm.handleSubmit(submitHandler)}
          >
            <FormField
              control={createSpaceForm.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input id='space-name' placeholder='Name' {...field} />
                  </FormControl>
                  <FormMessage className='dark:text-red-600' />
                </FormItem>
              )}
            ></FormField>
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
      ) : (
        <div className='flex h-full w-full items-center justify-center'>
          <Spinner className='h-20 w-20' />
        </div>
      )}
    </StandardDialog>
  );
}
