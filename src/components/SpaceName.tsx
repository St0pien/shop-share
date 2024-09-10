'use client';

import { z } from 'zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useState } from 'react';

import { api } from '@/trpc/react';
import { spaceNameSchema } from '@/lib/schemas/space';

import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { Input } from './ui/input';

export interface SpaceNameProps {
  spaceId: string;
}

const updateSpaceNameSchema = z.object({
  name: spaceNameSchema
});

export function SpaceName({ spaceId }: SpaceNameProps) {
  const [spaceName] = api.space.getName.useSuspenseQuery(spaceId);

  const trimmedName =
    spaceName.length > 23 ? spaceName.slice(0, 20) + '...' : spaceName;

  const spaceNameForm = useForm<z.infer<typeof updateSpaceNameSchema>>({
    resolver: zodResolver(updateSpaceNameSchema),
    defaultValues: {
      name: spaceName
    },
    mode: 'onChange'
  });

  const utils = api.useUtils();
  const { mutate: setSpaceName } = api.space.setName.useMutation({
    onMutate: async ({ name }) => {
      await utils.space.getName.cancel(spaceId);
      const previousName = utils.space.getName.getData(spaceId);

      utils.space.getName.setData(spaceId, name);

      return { previousName };
    },
    onSettled: async () => {
      await utils.space.getName.invalidate(spaceId);
    },
    onError: (error, _, ctx) => {
      toast.error(error.message);

      if (ctx) {
        utils.space.getName.setData(spaceId, ctx.previousName);
      }
    }
  });

  const [open, setOpen] = useState(false);

  const submitHandler: SubmitHandler<z.infer<typeof updateSpaceNameSchema>> = ({
    name
  }) => {
    setSpaceName({
      name,
      spaceId
    });
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className='outline-none'>{trimmedName}</PopoverTrigger>
      <PopoverContent>
        <Form {...spaceNameForm}>
          <form onSubmit={spaceNameForm.handleSubmit(submitHandler)}>
            <FormField
              control={spaceNameForm.control}
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
