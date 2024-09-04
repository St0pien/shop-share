'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { ShareTrigger } from '@/components/buttons/ShareTrigger';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { api } from '@/trpc/react';
import { Spinner } from '@/components/svg/Spinner';
import { type SpaceInfo } from '@/lib/types';

export function ShareSpaceDialog({ space }: { space: SpaceInfo }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inviteLink, setInviteLink] = useState<string>();

  const { mutate: generateInvite, isPending } =
    api.space.generateInvite.useMutation({
      onSuccess: token => {
        setInviteLink(`${window.origin}/join?token=${token}`);
      }
    });

  const onTrigger = (open: boolean) => {
    if (open) {
      generateInvite(space.id);
    }

    setIsOpen(open);
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(inviteLink!);
    toast.success('Invitation link copied to clipboard');
    setIsOpen(false);
  };

  const shareLink = async () => {
    await navigator.share({
      url: inviteLink,
      title: `ShopShare | ${space.name} invitation`
    });

    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onTrigger}>
      <ShareTrigger />
      <DialogContent
        className='top-1/3 w-4/5 rounded-xl outline-none'
        onOpenAutoFocus={e => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold'>
            Invitation link
          </DialogTitle>
          <DialogDescription className='text-sm text-neutral-light'>
            Share this link to add someone to your space
          </DialogDescription>
        </DialogHeader>

        {!isPending ? (
          <>
            <div className='w-full overflow-x-auto whitespace-nowrap rounded-lg border-2 p-2'>
              <div>{inviteLink}</div>
            </div>
            <div className='flex w-full justify-evenly'>
              <Button className='font-bold' onClick={copyLink}>
                Copy
              </Button>
              <Button className='font-bold' onClick={shareLink}>
                Share
              </Button>
            </div>
          </>
        ) : (
          <div className='flex justify-center'>
            <Spinner className='h-20 w-20' />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
