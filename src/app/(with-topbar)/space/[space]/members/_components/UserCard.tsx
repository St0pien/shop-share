import Image from 'next/image';
import { User } from 'lucide-react';
import { useParams } from 'next/navigation';

import { type UserInfo } from '@/lib/types';
import { KickUserDialog } from '@/components/dialogs/user/KickUserDialog';
import { uuidTranslator } from '@/lib/uuidTranslator';

export function UserCard({
  userInfo,
  isAdmin
}: {
  userInfo: UserInfo;
  isAdmin: boolean;
}) {
  const params = useParams<{ space: string }>();
  const spaceId = uuidTranslator.toUUID(params.space);

  return (
    <div className='flex w-full items-center justify-between gap-4 rounded-3xl border-[1px] p-4'>
      <div className='flex gap-4 overflow-hidden'>
        <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary'>
          {userInfo.image ? (
            <Image
              priority
              className='rounded-full'
              src={userInfo.image ?? ''}
              alt={userInfo.email}
              width={40}
              height={40}
            />
          ) : (
            <User className='text-black' />
          )}
        </div>

        <div>
          <p className='text-left'>{userInfo.name}</p>
          <p className='text-xs text-neutral-light'>{userInfo.email}</p>
        </div>
      </div>

      {isAdmin && <KickUserDialog user={userInfo} spaceId={spaceId} />}
    </div>
  );
}
