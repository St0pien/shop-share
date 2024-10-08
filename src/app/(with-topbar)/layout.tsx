import React from 'react';

import { Avatar } from './_components/Avatar';
import { SearchBar } from './_components/SearchBar';

export default function TopBarLayout({
  modal,
  children
}: Readonly<{ modal: React.ReactNode; children: React.ReactNode }>) {
  return (
    <>
      {modal}
      <div className='grid h-dvh w-screen grid-rows-[80px_1fr]'>
        <div className='flex w-full items-center justify-between gap-8 px-4'>
          <div className='flex-shrink-0'>
            <Avatar />
          </div>
          <SearchBar />
        </div>
        <div className='h-[calc(100dvh_-_80px)] w-full'>{children}</div>
      </div>
    </>
  );
}
