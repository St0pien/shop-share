import { TRPCError } from '@trpc/server';

import { type ErrorMessage } from '@/lib/ErrorMessage';

export interface Privelege {
  spaceId?: string;
  exists: boolean;
  isMember: boolean;
  isAdmin: boolean;
}

export type AccessLevel = 'admin' | 'member';

type ErrorMap = Record<AccessLevel | 'notExists', ErrorMessage>;

export function checkAccess(
  errorMap: ErrorMap,
  privelege: Privelege,
  access: AccessLevel
) {
  if (!privelege.exists) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: errorMap.notExists
    });
  }

  if (access === 'member' && !privelege.isMember) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: errorMap.member
    });
  }

  if (access === 'admin' && !privelege.isAdmin) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: errorMap.admin
    });
  }
}
