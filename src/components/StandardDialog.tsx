import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import { type ReactNode } from 'react';
import { useRouter } from 'next/navigation';

import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';

export interface StandardDialogProps {
  open?: boolean;
  children: ReactNode;
  title: ReactNode;
  description: ReactNode;
  disableOutsideInteraction?: boolean;
  returnUrl?: string;
}

export function StandardDialog({
  open,
  children,
  title,
  description,
  returnUrl,
  disableOutsideInteraction = false
}: StandardDialogProps) {
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

  return (
    <div>
      <Dialog open={open} defaultOpen={true} onOpenChange={onOpenChange}>
        <DialogContent
          className='top-1/3 w-4/5 rounded-xl outline-none'
          onInteractOutside={onInteractOutside}
        >
          <DialogHeader>
            <DialogTitle className='text-2xl font-bold'>{title}</DialogTitle>
            <DialogDescription className='text-sm text-neutral-light'>
              {description}
            </DialogDescription>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    </div>
  );
}
