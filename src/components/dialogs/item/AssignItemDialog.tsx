'use client';

import { useState } from 'react';
import { z } from 'zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { listIdSchema } from '@/lib/schemas/list';
import { Form, FormField } from '@/components/ui/form';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ListCombobox } from '@/components/form-fields/ListCombobox';
import { api } from '@/trpc/react';

import { StandardDialog, type StandardDialogExtProps } from '../StandardDialog';

interface Props {
  spaceId: string;
  itemId: number;
}

const assignItemSchema = z.object({
  listId: listIdSchema
});

export function AssignItemDialog({
  spaceId,
  itemId,
  ...props
}: StandardDialogExtProps & Props) {
  const [item] = api.item.get.useSuspenseQuery(itemId);

  const utils = api.useUtils();

  const { mutate: assign } = api.list.addItem.useMutation({
    onError: error => {
      toast.error(error.message);
    },
    onSuccess: (_, { listId }) => {
      const listName = utils.list.fetch
        .getData(item.spaceId)
        ?.find(l => l.id === listId)?.name;

      toast.success(
        `[${item.name}] succesfully added to [${listName ?? ''}] list`
      );
    }
  });

  const [isOpen, setIsOpen] = useState(true);

  const assignItemForm = useForm<z.infer<typeof assignItemSchema>>();

  const submitHandler: SubmitHandler<z.infer<typeof assignItemSchema>> = ({
    listId
  }) => {
    assign({
      listId,
      itemId: item.id
    });
    setIsOpen(false);
  };

  return (
    <StandardDialog
      open={isOpen}
      title='Add item to shopping list'
      description=''
      {...props}
    >
      <p className='text-center'>
        Add <span className='text-primary'>{item.name}</span> to:
      </p>
      <Form {...assignItemForm}>
        <form
          className='flex flex-col gap-8'
          onSubmit={
            submitHandler
              ? assignItemForm.handleSubmit(submitHandler)
              : undefined
          }
        >
          <FormField
            control={assignItemForm.control}
            name='listId'
            render={({ field }) => (
              <ListCombobox
                spaceId={spaceId}
                itemId={item.id}
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
