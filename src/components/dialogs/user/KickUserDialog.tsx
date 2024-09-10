'use client';

import { DialogTrigger } from '@radix-ui/react-dialog';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { type UserInfo } from '@/lib/types';
import { api } from '@/trpc/react';
import { UserCard } from '@/app/(with-topbar)/space/[space]/members/_components/UserCard';

export function KickUserDialog({
  user,
  spaceId
}: {
  user: UserInfo;
  spaceId: string;
}) {
  const utils = api.useUtils();
  const { mutate: kickOut } = api.user.kickOut.useMutation({
    onMutate: async ({ spaceId, userId }) => {
      await utils.user.fetch.cancel(spaceId);

      const previousUsers = utils.user.fetch.getData(spaceId);

      if (previousUsers !== undefined) {
        utils.user.fetch.setData(
          spaceId,
          previousUsers.filter(u => u.id !== userId)
        );
      }

      return { previousUsers };
    },
    onSettled: async () => {
      await utils.user.fetch.invalidate(spaceId);
    },
    onError: (error, _, ctx) => {
      toast.error(error.message);

      if (ctx !== undefined) {
        utils.user.fetch.setData(spaceId, ctx.previousUsers);
      }
    }
  });

  const [open, setOpen] = useState(false);

  const onConfirm = () => {
    kickOut({ userId: user.id, spaceId });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='shrink-0 p-2 text-xs'>
          <LogOut />
          Kick out
        </Button>
      </DialogTrigger>

      <DialogContent className='top-1/3 w-4/5 rounded-xl outline-none'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold'>
            Kick out user?
          </DialogTitle>
        </DialogHeader>
        <UserCard userInfo={user} isAdmin={false} />

        <DialogFooter className='pt-4'>
          <div className='flex justify-between'>
            <DialogClose asChild>
              <Button variant='secondary'>No</Button>
            </DialogClose>
            <Button variant='destructive' onClick={onConfirm}>
              Yes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
