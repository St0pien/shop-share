'use client';

import { api } from '@/trpc/react';

import { UserCard } from './UserCard';

export function UserCardList({ spaceId }: { spaceId: string }) {
  const { data: isAdmin } = api.user.isAdmin.useQuery(spaceId);

  const [users] = api.user.fetch.useSuspenseQuery(spaceId);

  return (
    <div className='flex h-full w-full flex-col gap-4 p-4'>
      {users.map(user => (
        <UserCard key={user.id} isAdmin={isAdmin ?? false} userInfo={user} />
      ))}
    </div>
  );
}
