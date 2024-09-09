'use client';

import { LayoutGrid, Plus } from 'lucide-react';
import { toast } from 'sonner';

import { type ItemInfo } from '@/lib/types';
import { api } from '@/trpc/react';

interface Props {
  itemInfo: ItemInfo;
  listId: number;
}

export function ItemAddCard({ itemInfo, listId }: Props) {
  const utils = api.useUtils();
  const { mutate: assignItem } = api.list.addItem.useMutation({
    onMutate: async () => {
      await Promise.all([
        utils.list.fetchUnassignedItems.cancel(listId),
        utils.list.fetchAssignedItems.cancel(listId)
      ]);

      const previousAssigned = utils.list.fetchAssignedItems.getData(listId);
      const previousAssignedArr = previousAssigned ?? [];
      utils.list.fetchAssignedItems.setData(listId, [
        ...previousAssignedArr,
        {
          spaceId: itemInfo.spaceId,
          checked: false,
          createdAt: new Date(),
          item: {
            id: itemInfo.id,
            name: itemInfo.name
          },
          list: {
            id: listId,
            name: utils.list.getName.getData(listId) ?? '<Not loaded>'
          },
          category: itemInfo.category
        }
      ]);

      const previousUnassigned =
        utils.list.fetchUnassignedItems.getData(listId);
      const previousUnassignedArr = previousUnassigned ?? [];
      utils.list.fetchUnassignedItems.setData(
        listId,
        previousUnassignedArr.filter(i => i.id !== itemInfo.id)
      );

      return { previousAssigned, previousUnassigned };
    },
    onSettled: async () => {
      await Promise.all([
        utils.list.fetchUnassignedItems.invalidate(listId),
        utils.list.fetchAssignedItems.invalidate(listId)
      ]);
    },
    onError: (error, _, ctx) => {
      toast.error(error.message);

      if (ctx !== undefined) {
        utils.list.fetchUnassignedItems.setData(listId, ctx.previousUnassigned);
        utils.list.fetchAssignedItems.setData(listId, ctx.previousAssigned);
      }
    }
  });

  const handleClick = () => {
    assignItem({ listId, itemId: itemInfo.id });
  };

  return (
    <div
      className='relative flex w-5/6 flex-col justify-between rounded-lg bg-neutral-dark p-4'
      onClick={handleClick}
    >
      <h2 className='break-all text-2xl font-bold'>{itemInfo.name}</h2>

      <div className='flex items-center justify-between'>
        {itemInfo.category ? (
          <div className='flex items-end gap-2'>
            <LayoutGrid className='text-primary' />
            <p>{itemInfo.category.name} </p>
          </div>
        ) : (
          <p className='text-sm text-neutral-light'>No category</p>
        )}

        <Plus className='h-12 w-12 text-primary' />
      </div>
    </div>
  );
}
