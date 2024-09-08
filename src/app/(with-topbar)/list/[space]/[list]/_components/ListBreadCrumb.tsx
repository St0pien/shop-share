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
import { ListName, type ListNameProps } from '@/components/ListName';
import { SpaceName, type SpaceNameProps } from '@/components/SpaceName';
import { uuidTranslator } from '@/lib/uuidTranslator';

export function ListBreadcrumb({
  spaceId,
  listId
}: SpaceNameProps & ListNameProps) {
  void api.space.getName.prefetch(spaceId);
  void api.list.getName.prefetch(listId);

  return (
    <HydrateClient>
      <div>
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
            <BreadcrumbSeparator className='scale-[2]' />
          </BreadcrumbList>
        </Breadcrumb>

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href={`/space/${uuidTranslator.fromUUID(spaceId)}`}
                  className='text-lg'
                >
                  Lists
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className='scale-[2]' />
            <BreadcrumbItem className='text-lg text-primary'>
              <Suspense fallback={<p className='animate-pulse'>...</p>}>
                <ListName listId={listId} />
              </Suspense>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </HydrateClient>
  );
}
