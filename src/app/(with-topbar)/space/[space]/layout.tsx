import { Navigation } from './_components/Navigation';
import { SpaceBreadcrumb } from './_components/SpaceBreadcrumb';

export default function NavigationLayout({
  children,
  params
}: Readonly<{ children: React.ReactNode; params: { space: string } }>) {
  return (
    <div className='grid h-full w-full grid-rows-[40px_1fr_80px]'>
      <div className='flex h-full w-full px-[10%]'>
        <SpaceBreadcrumb spaceId={params.space} />
      </div>
      <div className='h-[calc(100dvh_-_160px_-_40px)]'>{children}</div>
      <Navigation />
    </div>
  );
}

// TODO: FIX URL BAR VISIBILITY PROBLEM WITH DYNAMIC VIEWPORT HEIGHT
