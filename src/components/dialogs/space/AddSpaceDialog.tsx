'use client';

import { type SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import { useState } from 'react';

import { api } from '@/trpc/react';
import { Spinner } from '@/components/svg/Spinner';
import { SpaceForm, type SpaceFormValues } from '@/components/forms/SpaceForm';

import { StandardDialog, type StandardDialogExtProps } from '../StandardDialog';

export function AddSpaceDialog(props: StandardDialogExtProps) {
  const [isOpen, setIsOpen] = useState(true);

  const utils = api.useUtils();

  const { mutate: createSpace, isPending } = api.space.create.useMutation({
    onSuccess: () => {
      setIsOpen(false);
      void utils.space.fetch.invalidate();
    },
    onError: error => {
      toast.error(error.message);
    }
  });

  const submitHandler: SubmitHandler<SpaceFormValues> = ({ name }) => {
    createSpace(name);
  };

  return (
    <StandardDialog
      open={isOpen}
      title='Create shopping space'
      description='Space binds together users, items, lists and categories'
      {...props}
    >
      {!isPending ? (
        <SpaceForm defaultValues={{ name: '' }} submitHandler={submitHandler} />
      ) : (
        <div className='flex h-full w-full items-center justify-center'>
          <Spinner className='h-20 w-20' />
        </div>
      )}
    </StandardDialog>
  );
}
