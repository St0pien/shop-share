'use client';

import { useParams } from 'next/navigation';

import { CategoryFilter } from '@/components/filtering/CategoryFilter';
import { uuidTranslator } from '@/lib/uuidTranslator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { StandardDialog } from '../StandardDialog';

export function FilterItemsDialog() {
  const params = useParams<{ space: string }>();
  const spaceId = uuidTranslator.toUUID(params.space);

  return (
    <StandardDialog
      open={true}
      title='Filter items'
      description='Select which categories you want to display'
    >
      <CategoryFilter spaceId={spaceId} />
      <p className='text-sm text-neutral-light'>Active filters:</p>
      <div className='flex h-full w-full flex-wrap gap-2'>
        <Badge>Food</Badge>
        <Badge>Food</Badge>
        <Badge>Food</Badge>
        <Badge>Food</Badge>
        <Badge>Food</Badge>
        <Badge>Food</Badge>
        <Badge>Food</Badge>
        <Badge>Food</Badge>
        <Badge>Food</Badge>
        <Badge>Food</Badge>
      </div>

      <div className='flex justify-between pt-4'>
        <Button variant='destructive'>Clear all</Button>
        <Button>Apply</Button>
      </div>
    </StandardDialog>
  );
}
