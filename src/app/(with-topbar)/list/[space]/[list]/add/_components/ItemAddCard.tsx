'use client';

import { LayoutGrid, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useState } from 'react';

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
        utils.list.fetchAssignedItems.cancel(listId),
        utils.category.fetchWithinList.cancel(listId)
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

      const previousCategories = utils.category.fetchWithinList.getData(listId);
      const previousCategoriesArr = previousCategories ?? [];

      if (itemInfo.category !== undefined) {
        const index = previousCategoriesArr.findIndex(
          c => c.id === itemInfo.category!.id
        );

        const optimisticCategories = [...previousCategoriesArr];

        if (index === -1) {
          optimisticCategories.push({
            id: itemInfo.category.id,
            name: itemInfo.category.name,
            spaceId: itemInfo.spaceId,
            createdAt: new Date(),
            itemsQuantity: 1
          });
        } else {
          optimisticCategories[index] = {
            id: itemInfo.category.id,
            name: itemInfo.category.name,
            spaceId: itemInfo.spaceId,
            createdAt: new Date(),
            itemsQuantity: previousCategoriesArr[index]!.itemsQuantity + 1
          };
        }

        utils.category.fetchWithinList.setData(listId, optimisticCategories);
      }

      return { previousAssigned, previousUnassigned, previousCategories };
    },
    onSettled: async () => {
      const invalidates = [
        utils.list.fetchUnassignedItems.invalidate(listId),
        utils.list.fetchAssignedItems.invalidate(listId)
      ];

      if (itemInfo.category !== undefined) {
        invalidates.push(utils.category.fetchWithinList.invalidate(listId));
      }

      await Promise.all(invalidates);
    },
    onError: (error, _, ctx) => {
      toast.error(error.message);

      if (ctx !== undefined) {
        utils.list.fetchUnassignedItems.setData(listId, ctx.previousUnassigned);
        utils.list.fetchAssignedItems.setData(listId, ctx.previousAssigned);
        utils.category.fetchWithinList.setData(listId, ctx.previousCategories);
      }
    }
  });

  const [adding, setAdding] = useState(false);

  const handleClick = () => {
    if (!adding) {
      setAdding(true);
    }
  };

  const parentVariants = {
    idle: { opacity: 1 },
    adding: { opacity: 0, x: -20 }
  };

  const childVariants = {
    idle: { opacity: 0 },
    adding: { opacity: 0.8 }
  };

  const endAdding = (animName: string) => {
    if (animName === 'adding') {
      assignItem({ listId, itemId: itemInfo.id });
    }
  };

  return (
    <motion.div
      layoutId={`item-add-${itemInfo.id}`}
      animate={adding ? 'adding' : 'idle'}
      variants={parentVariants}
      transition={{ delay: 0.1 }}
      onAnimationComplete={endAdding}
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
      <motion.div
        initial={{ opacity: 0 }}
        variants={childVariants}
        className='absolute left-0 top-0 flex h-full w-full items-center justify-center rounded-lg bg-green-500'
      >
        <Plus className='h-16 w-16' />
      </motion.div>
    </motion.div>
  );
}
