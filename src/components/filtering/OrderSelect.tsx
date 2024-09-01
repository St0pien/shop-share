'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import { Label } from '../ui/label';

interface OrderSelectItem {
  url: string;
  display: string;
}

interface Props {
  orderSelectItems: OrderSelectItem[];
}

export function OrderSelect({ orderSelectItems }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const onSwitch = (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams);

    const url = orderSelectItems.find(i => i.display === value)?.url;

    if (url === '' || url === undefined) {
      newSearchParams.delete('order');
    } else {
      newSearchParams.set('order', url);
    }

    router.replace(`${pathname}?${newSearchParams.toString()}`);
  };

  const orderParam = searchParams.get('order') ?? '';

  const selectedOption = orderSelectItems.find(
    i => i.url === orderParam
  )?.display;

  const disabled = searchParams.has('search');

  return (
    <div className='flex w-full items-center gap-6'>
      <Label className='text-neutral-light'>Order: </Label>
      <Select
        disabled={disabled}
        defaultValue={selectedOption}
        onValueChange={onSwitch}
      >
        <SelectTrigger
          className='focus: ring-offset-0 focus:ring-0'
          data-testid='order-select'
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {orderSelectItems.map(({ display }) => (
            <SelectItem key={display} value={display}>
              {display}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
