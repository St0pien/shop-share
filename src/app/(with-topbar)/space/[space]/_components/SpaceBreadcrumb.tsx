import Link from 'next/link';
import { Suspense } from 'react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { api } from '@/trpc/server';

interface SpaceNameProps {
  spaceId: string;
}

async function SpaceName({ spaceId }: SpaceNameProps) {
  const { spaceName } = await api.space.getName(spaceId);

  if (spaceName.length > 23) {
    return spaceName.slice(0, 20) + '...';
  }

  return spaceName;
}

export function SpaceBreadcrumb({ spaceId }: SpaceNameProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href='/' className='text-lg'>
              Spaces
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className='scale-[2]' />
        <BreadcrumbItem className='text-lg text-primary'>
          <Suspense fallback={<p className='animate-pulse'>...</p>}>
            <SpaceName spaceId={spaceId} />
          </Suspense>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
