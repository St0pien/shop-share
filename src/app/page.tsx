import dynamic from 'next/dynamic';

import { HydrateClient } from '@/trpc/server';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { GoogleLogo } from '@/components/svg/GoogleLogo';

const DynamicThemeSwitch = dynamic(
  async () => (await import('@/components/ThemeSwitch')).ThemeSwitch,
  {
    ssr: false
  }
);

export default async function Home() {
  return (
    <HydrateClient>
      <div className='h-screen w-screen'>
        <div className='flex h-2/5 w-full flex-col items-center justify-end'>
          <Logo />
        </div>
        <div className='flex h-3/5 w-full flex-col items-center gap-32 py-32'>
          <div>
            <Button className='flex h-12 w-64 items-center gap-2 border-2 border-gray-200 bg-gray-50 dark:border-none dark:bg-white'>
              <GoogleLogo />{' '}
              <span className='font-bold'>Sign in with Google</span>
            </Button>
          </div>
          <h2 className='font-mono text-lg font-bold text-[#bbb] dark:text-[#444]'>
            Created by{' '}
            <a href='https://github.com/st0pien/' className='underline'>
              St0pien
            </a>
          </h2>
          <DynamicThemeSwitch />
        </div>
      </div>
    </HydrateClient>
  );
}
