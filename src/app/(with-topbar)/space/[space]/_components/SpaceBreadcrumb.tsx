import Link from 'next/link';
import { Suspense } from 'react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { api, HydrateClient } from '@/trpc/server';
import { SpaceName, type SpaceNameProps } from '@/components/SpaceName';

export async function SpaceBreadcrumb({ spaceId }: SpaceNameProps) {
  void api.space.getName.prefetch(spaceId);

  return (
    <HydrateClient>
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
    </HydrateClient>
  );
}
