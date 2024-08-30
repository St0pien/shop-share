import { uuidTranslator } from '@/lib/uuidTranslator';
import { api, HydrateClient } from '@/trpc/server';

import { DeleteSpaceClient } from './_components/DeleteSpaceClient';

export default function DeleteSpacePage({
  params
}: {
  params: { space: string };
}) {
  const spaceId = uuidTranslator.toUUID(params.space);

  void api.spaces.get.prefetch(spaceId);

  return (
    <HydrateClient>
      <DeleteSpaceClient spaceId={spaceId} />;
    </HydrateClient>
  );
}
