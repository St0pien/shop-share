'use client';

import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import {
  Dialog,
  DialogClose,
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
import { Spinner } from '@/components/svg/Spinner';

interface Props {
  disableOutsideInteraction?: boolean;
  returnUrl?: string;
}

const createSpaceSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name cannot be empty' })
    .max(255, { message: 'Too long name' })
});

export function AddSpaceDialog({
  disableOutsideInteraction = false,
  returnUrl
}: Props) {
  const router = useRouter();

  const closeDialog = () => {
    if (returnUrl === undefined) {
      router.back();
    } else {
      router.push(returnUrl);
    }
  };

  const onOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      closeDialog();
    }
  };

  const onInteractOutside = (e: Event) => {
    if (disableOutsideInteraction) {
      e.preventDefault();
    }
  };

  const utils = api.useUtils();

  const { mutate: createSpace, isPending } = api.spaces.create.useMutation({
    onSuccess: () => {
      closeDialog();
      createSpaceForm.setValue('name', '');
      void utils.spaces.fetch.invalidate();
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
      <Dialog defaultOpen={true} onOpenChange={onOpenChange}>
        <DialogContent
          className='top-1/3 w-4/5 rounded-xl outline-none'
          onInteractOutside={onInteractOutside}
        >
          <DialogHeader>
            <DialogTitle className='text-2xl font-bold'>
              Create shopping space
            </DialogTitle>
            <DialogDescription className='text-sm text-neutral-light'>
              Space binds together users, items, lists and categories
            </DialogDescription>
          </DialogHeader>
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
        </DialogContent>
      </Dialog>
    </div>
  );
}
