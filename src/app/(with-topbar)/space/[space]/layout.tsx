import { uuidTranslator } from '@/lib/uuidTranslator';

import { Navigation } from './_components/Navigation';
import { SpaceBreadcrumb } from './_components/SpaceBreadcrumb';

export default function NavigationLayout({
  modal,
  children,
  params
}: Readonly<{
  modal: React.ReactNode;
  children: React.ReactNode;
  params: { space: string };
}>) {
  const spaceId = uuidTranslator.toUUID(params.space);

  return (
    <>
      {modal}
      <div className='grid h-full w-full grid-rows-[40px_1fr_80px]'>
        <div className='flex h-full w-full px-[10%]'>
          <SpaceBreadcrumb spaceId={spaceId} />
        </div>
        <div className='h-[calc(100dvh_-_160px_-_40px)] w-full'>{children}</div>
        <Navigation />
      </div>
    </>
  );
}
