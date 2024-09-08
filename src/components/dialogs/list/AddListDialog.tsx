'use client';

import { type SubmitHandler } from 'react-hook-form';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';

import {
  StandardDialog,
  type StandardDialogExtProps
} from '@/components/dialogs/StandardDialog';
import { ListForm, type ListFormValues } from '@/components/forms/ListForm';
import { api } from '@/trpc/react';
import { uuidTranslator } from '@/lib/uuidTranslator';

export default function AddListDialog(props: StandardDialogExtProps) {
  const [open, setOpen] = useState(true);

  const { space } = useParams<{ space: string }>();
  const spaceId = uuidTranslator.toUUID(space);

  const utils = api.useUtils();

  const { mutate: createList } = api.list.create.useMutation({
    onMutate: async ({ listName, spaceId }) => {
      await utils.list.fetch.cancel(spaceId);
      const previousLists = utils.list.fetch.getData(spaceId);

      const previousPart = previousLists ?? [];
      const lastID =
        previousPart.length > 0 ? Math.max(...previousPart.map(l => l.id)) : 1;

      utils.list.fetch.setData(spaceId, [
        ...(previousLists ?? []),
        {
          id: lastID + 1,
          name: listName,
          itemsQuantity: 0,
          createdAt: new Date(),
          spaceId
        }
      ]);

      return { previousLists };
    },
    onSettled: async () => {
      await utils.list.fetch.invalidate(spaceId);
    },
    onError: (error, _, ctx) => {
      toast.error(error.message);

      if (ctx !== undefined) {
        utils.list.fetch.setData(spaceId, ctx.previousLists);
      }
    }
  });

  const submitHandler: SubmitHandler<ListFormValues> = ({ name }) => {
    createList({
      listName: name,
      spaceId
    });
    setOpen(false);
  };

  return (
    <StandardDialog
      open={open}
      title='Create list'
      description='Create shopping lists composed from items'
      {...props}
    >
      <ListForm defaultValues={{ name: '' }} submitHandler={submitHandler} />
    </StandardDialog>
  );
}
