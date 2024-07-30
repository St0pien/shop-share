import Image from 'next/image';

import { auth } from '@/server/auth';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { ThemeSwitch } from '@/components/ThemeSwitch';
import { SignOutButton } from '@/components/auth/SignOutButton';

export async function Avatar() {
  const session = await auth();

  if (session === null) {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger>
        <Image
          className='rounded-full'
          src={session.user.image ?? ''}
          alt={session.user.name ?? ''}
          width={40}
          height={40}
        />
      </PopoverTrigger>
      <PopoverContent className='w-40'>
        <div className='flex flex-col items-center justify-between gap-5'>
          <SignOutButton />
          <ThemeSwitch />
        </div>
      </PopoverContent>
    </Popover>
  );
}
