import { Navigation } from './_components/Navigation';

export default function NavigationLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className='grid h-screen w-screen grid-rows-[1fr_80px]'>
      <div>{children}</div>
      <Navigation />
    </div>
  );
}
