import { WrappedSpinner } from '@/components/svg/Spinner';

export default function RootLoading() {
  return (
    <div className='h-screen w-screen p-4'>
      <WrappedSpinner />
    </div>
  );
}
