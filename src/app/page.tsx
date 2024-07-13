import { HydrateClient } from '@/trpc/server';

export default async function Home() {
  return (
    <HydrateClient>
      <h1 className='text-primary flex h-20 w-20 p-2 py-4'>Shop share</h1>
      <div className='bg-primary flex h-full justify-end'>sdfsdf sdf</div>
    </HydrateClient>
  );
}
