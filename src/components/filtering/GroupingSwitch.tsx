'use client';

import { useUrlReflection } from '@/lib/hooks/useUrlReflection';

import { Label } from '../ui/label';
import { Switch } from '../ui/switch';

export function GroupingSwitch() {
  const [enabled, setEnabled] = useUrlReflection({
    urlKey: 'grouping',
    urlValueMap: [
      {
        url: '',
        value: true
      },
      {
        url: 'disabled',
        value: false
      }
    ]
  });

  return (
    <div className='flex h-full w-full items-center gap-1'>
      <Switch
        id='grouping-switch'
        checked={enabled}
        onCheckedChange={setEnabled}
      />
      <Label className='text-sm text-neutral-light' htmlFor='grouping-switch'>
        Grouping
      </Label>
    </div>
  );
}
