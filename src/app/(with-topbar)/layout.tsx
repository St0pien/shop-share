import { Avatar } from './_components/Avatar';
import { SearchBar } from './_components/SearchBar';

export default function TopBarLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className='grid h-screen w-screen grid-rows-[80px_1fr]'>
      <div className='flex w-full items-center justify-between gap-8 px-4'>
        <div className='flex-shrink-0'>
          <Avatar />
        </div>
        <SearchBar />
      </div>
      <div className='w-full overflow-hidden'>{children}</div>
    </div>
  );
}
