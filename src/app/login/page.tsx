import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';

import { Logo } from '@/components/Logo';
import { auth } from '@/server/auth';

import { GoogleOauthButton } from './_components/GoogleOauthButton';

const DynamicThemeSwitch = dynamic(
  () => import('@/components/ThemeSwitch').then(mod => mod.ThemeSwitch),
  {
    ssr: false
  }
);

export default async function LoginPage() {
  const session = await auth();

  if (session !== null) {
    redirect('/');
  }

  return (
    <div className='h-screen w-screen'>
      <div className='flex h-2/5 w-full flex-col items-center justify-end'>
        <Logo />
      </div>
      <div className='flex h-3/5 w-full flex-col items-center gap-32 py-32'>
        <div>
          <GoogleOauthButton />
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
  );
}
