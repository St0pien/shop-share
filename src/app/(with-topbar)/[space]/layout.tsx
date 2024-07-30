import { Navigation } from './_components/Navigation';

export default function NavigationLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className='grid h-full w-full grid-rows-[1fr_80px]'>
      <div>{children}</div>
      <Navigation />
    </div>
  );
}
