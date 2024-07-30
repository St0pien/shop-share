import { Avatar } from './[space]/_components/Avatar';
import { SearchBar } from './[space]/_components/SearchBar';

export default function TopBarLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className='grid h-screen w-screen grid-rows-[80px_1fr]'>
      <div className='flex items-center justify-between px-4 gap-8'>
        <div className='flex-shrink-0'>
          <Avatar />
        </div>
        <SearchBar />
      </div>
      <div>{children}</div>
    </div>
  );
}
