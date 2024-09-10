'use client';

import { z } from 'zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useState } from 'react';

import { api } from '@/trpc/react';
import { listNameSchema } from '@/lib/schemas/list';

import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { Input } from './ui/input';

export interface ListNameProps {
  listId: number;
}

const updateListNameSchema = z.object({
  name: listNameSchema
});

export function ListName({ listId }: ListNameProps) {
  const [listName] = api.list.getName.useSuspenseQuery(listId);

  const trimmedName =
    listName.length > 23 ? listName.slice(0, 20) + '...' : listName;

  const listNameForm = useForm<z.infer<typeof updateListNameSchema>>({
    resolver: zodResolver(updateListNameSchema),
    defaultValues: {
      name: listName
    },
    mode: 'onChange'
  });

  const utils = api.useUtils();
  const { mutate: setListName } = api.list.setName.useMutation({
    onMutate: async ({ name }) => {
      await utils.list.getName.cancel(listId);
      const previousName = utils.list.getName.getData(listId);

      utils.list.getName.setData(listId, name);

      return { previousName };
    },
    onSettled: async () => {
      await utils.list.getName.invalidate(listId);
    },
    onError: (error, _, ctx) => {
      toast.error(error.message);

      if (ctx) {
        utils.list.getName.setData(listId, ctx.previousName);
      }
    }
  });

  const [open, setOpen] = useState(false);

  const submitHandler: SubmitHandler<z.infer<typeof updateListNameSchema>> = ({
    name
  }) => {
    setListName({
      name,
      listId
    });
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className='outline-none'>{trimmedName}</PopoverTrigger>
      <PopoverContent>
        <Form {...listNameForm}>
          <form onSubmit={listNameForm.handleSubmit(submitHandler)}>
            <FormField
              control={listNameForm.control}
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
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
