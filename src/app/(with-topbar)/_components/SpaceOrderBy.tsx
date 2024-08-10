'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

const orderKeys = {
  'a-z': 'A-Z',
  latest: 'Latest'
};

export function SpaceOrderBy() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const onSwitch = (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('order', value);

    router.replace(`${pathname}?${newSearchParams.toString()}`);
  };

  const selectedOption = searchParams.get('order') ?? Object.keys(orderKeys)[0];

  return (
    <div className='flex w-full items-center gap-2'>
      <p className='text-neutral-light'>Order:</p>
      <Select defaultValue={selectedOption} onValueChange={onSwitch}>
        <SelectTrigger className='focus: ring-offset-0 focus:ring-0'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(orderKeys).map(([url, name]) => (
            <SelectItem key={url} value={url}>
              {name}
            </SelectItem>
          ))}
          <SelectItem value='test'>Test 1</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
