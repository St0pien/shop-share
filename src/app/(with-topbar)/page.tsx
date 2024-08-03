import { auth } from '@/server/auth';

import { SpaceCard } from './_components/SpaceCard';

export default async function HomePage() {
  const session = (await auth())!;

  if (!session) {
    return <h1>oop</h1>;
  }

  return (
    <div className='flex w-full flex-col items-center'>
      <SpaceCard
        spaceInfo={{
          id: 'sdkfsdlfsdlfj',
          name: 'Family space',
          createdAt: new Date(),
          listQuantity: 3,
          itemsQuantity: 2,
          categoriesQuantity: 1,
          membersQuantity: 1
        }}
      />
    </div>
  );
}
