'use client';

import { CheckSquare, Square, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { type ListItemInfo } from '@/lib/types';
import { uuidTranslator } from '@/lib/uuidTranslator';
import { api } from '@/trpc/react';
import { cn } from '@/lib/utils';

interface Props {
  listItemInfo: ListItemInfo;
}

export function ListItemCard({ listItemInfo }: Props) {
  const utils = api.useUtils();

  const { mutate: setCheck } = api.list.setItemCheck.useMutation({
    onMutate: async ({ checked }) => {
      await utils.list.fetchAssignedItems.cancel(listItemInfo.list.id);

      const previousListItems = utils.list.fetchAssignedItems.getData(
        listItemInfo.list.id
      );

      if (previousListItems !== undefined) {
        utils.list.fetchAssignedItems.setData(
          listItemInfo.list.id,
          previousListItems.map(i => ({
            ...i,
            checked: i.item.id === listItemInfo.item.id ? checked : i.checked
          }))
        );
      }

      return { previousListItems };
    },
    onSettled: async () => {
      await utils.list.fetchAssignedItems.invalidate();
    },
    onError: (error, _, ctx) => {
      toast.error(error.message);

      if (ctx !== undefined) {
        utils.list.fetchAssignedItems.setData(
          listItemInfo.list.id,
          ctx.previousListItems
        );
      }
    }
  });

  const handeClick = () => {
    setCheck({
      listId: listItemInfo.list.id,
      itemId: listItemInfo.item.id,
      checked: !listItemInfo.checked
    });
  };

  return (
    <motion.div
      layoutId={`list-item-${listItemInfo.item.id}`}
      className='relative flex w-5/6 items-center justify-between rounded-full bg-neutral-dark px-4 py-2'
    >
      {listItemInfo.checked ? (
        <CheckSquare className='shrink-0 text-neutral-light' />
      ) : (
        <Square className='shrink-0 text-primary' />
      )}

      <h2
        className={cn(
          'mx-4 break-all text-xl font-bold',
          listItemInfo.checked && 'text-neutral-light'
        )}
      >
        {listItemInfo.item.name}
      </h2>

      <Link
        className='z-10'
        href={`/list/${uuidTranslator.fromUUID(listItemInfo.spaceId)}/${listItemInfo.list.id}/remove/${listItemInfo.item.id}`}
      >
        <Button
          variant='destructive'
          className='focus-visible:focus-offset-0 flex h-8 w-8 items-center justify-center p-1 focus-visible:ring-0'
        >
          <Trash2 className='h-full w-full text-black' />
        </Button>
      </Link>

      <div
        onClick={handeClick}
        className='absolute left-0 top-0 z-0 h-full w-full'
      ></div>
    </motion.div>
  );
}
