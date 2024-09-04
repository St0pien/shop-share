import { DeleteSpaceWrapper } from '@/components/dialogs/space/DeleteSpaceWrapper';
import { uuidTranslator } from '@/lib/uuidTranslator';
import { api, HydrateClient } from '@/trpc/server';

export default function DeleteSpacePage({
  params
}: {
  params: { space: string };
}) {
  const spaceId = uuidTranslator.toUUID(params.space);
  void api.space.get.prefetch(spaceId);

  return (
    <HydrateClient>
      <DeleteSpaceWrapper spaceId={spaceId} />
    </HydrateClient>
  );
}
