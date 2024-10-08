'use client';

import { useMappedUrlReflection } from '@/lib/hooks/useUrlReflection';
import { useSearchEnabled } from '@/lib/hooks/useSearchEnabled';

import { Label } from '../ui/label';
import { Switch } from '../ui/switch';

export function GroupingSwitch() {
  const [enabled, setEnabled] = useMappedUrlReflection<boolean>({
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

  const disabled = useSearchEnabled();

  return (
    <div className='flex h-full w-full items-center gap-1'>
      <Switch
        id='grouping-switch'
        checked={enabled}
        onCheckedChange={setEnabled}
        disabled={disabled}
      />
      <Label className='text-sm text-neutral-light' htmlFor='grouping-switch'>
        Grouping
      </Label>
    </div>
  );
}
