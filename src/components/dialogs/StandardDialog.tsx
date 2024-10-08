import { type ReactNode, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

export interface StandardDialogBasicProps {
  open?: boolean;
  children: ReactNode;
  title: ReactNode;
  description: ReactNode;
}

export interface StandardDialogExtProps {
  disableOutsideInteraction?: boolean;
  returnUrl?: string;
  routerMethod?: 'push' | 'replace';
}

export type StandardDialogProps = StandardDialogBasicProps &
  StandardDialogExtProps;

export function StandardDialog({
  open,
  children,
  title,
  description,
  returnUrl,
  disableOutsideInteraction = false,
  routerMethod = 'push'
}: StandardDialogProps) {
  const router = useRouter();

  useEffect(() => {
    if (returnUrl !== undefined) {
      router.prefetch(returnUrl);
    }
  }, [returnUrl, router]);

  const closeDialog = useCallback(() => {
    if (returnUrl === undefined) {
      router.back();
    } else {
      router[routerMethod](returnUrl);
    }
  }, [returnUrl, router, routerMethod]);

  const onOpenChange = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) {
        closeDialog();
      }
    },
    [closeDialog]
  );

  const onInteractOutside = (e: Event) => {
    if (disableOutsideInteraction) {
      e.preventDefault();
    }
  };

  useEffect(() => {
    if (!open) {
      closeDialog();
    }
  }, [open, closeDialog]);

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
