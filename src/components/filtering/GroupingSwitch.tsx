import { Label } from '../ui/label';
import { Switch } from '../ui/switch';

export function GroupingSwitch() {
  return (
    <div className='flex h-full w-full items-center gap-1'>
      <Switch id='grouping-switch' />
      <Label className='text-sm text-neutral-light ' htmlFor='grouping-switch'>Grouping</Label>
    </div>
  );
}
