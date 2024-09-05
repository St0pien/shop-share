'use client';

import { useSearchParams } from 'next/navigation';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { type UrlValue, useUrlReflection } from '@/lib/hooks/useUrlReflection';

interface Props {
  orderSelectItems: UrlValue<string>[];
}

export function OrderSelect({ orderSelectItems }: Props) {
  const [selectedOption, onSwitch] = useUrlReflection({
    urlKey: 'order',
    urlValueMap: orderSelectItems
  });

  const searchParams = useSearchParams();
  const disabled = searchParams.has('search');

  return (
    <div className='flex w-full items-center gap-6'>
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
          {orderSelectItems.map(({ value }) => (
            <SelectItem key={value} value={value}>
              {value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
