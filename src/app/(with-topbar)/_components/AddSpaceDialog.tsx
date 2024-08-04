'use client';

import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { Loader } from 'lucide-react';
import { toast } from 'sonner';

import { AddTrigger } from '@/components/buttons/AddTrigger';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader
} from '@/components/ui/dialog';
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

const createSpaceSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name cannot be empty' })
    .max(255, { message: 'Too long name' })
});

export function AddSpaceDialog() {
  const [isOpen, setIsOpen] = useState(false);

  const utils = api.useUtils();

  const { mutate: createSpace, isPending } = api.shopping.create.useMutation({
    onSuccess: async () => {
      setIsOpen(false);
      createSpaceForm.setValue('name', '');
      void utils.shopping.fetchSpaces.invalidate();
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
    <div>
      <Dialog open={isOpen} onOpenChange={open => setIsOpen(open)}>
        <AddTrigger />
        <DialogContent className='top-1/3 w-4/5 rounded-xl'>
          <DialogHeader>
            <DialogTitle className='font text-2xl font-bold'>
              Create shopping space
            </DialogTitle>
            <DialogDescription className='text-sm text-neutral-light'>
              Space binds together users, items, lists and categories
            </DialogDescription>
          </DialogHeader>
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
                {!isPending ? (
                  <div className='flex justify-between'>
                    <Button
                      type='button'
                      variant='secondary'
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button>Save</Button>
                  </div>
                ) : (
                  <Loader />
                )}
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
