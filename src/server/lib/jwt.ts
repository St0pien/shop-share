import { jwtVerify, SignJWT } from 'jose';

import { env } from '@/env';

const SECRET = new TextEncoder().encode(env.JWT_SECRET);

export async function getSignedId(id: string) {
  return new SignJWT({ id })
    .setProtectedHeader({
      alg: 'HS256'
    })
    .setIssuedAt()
    .setExpirationTime('30m')
    .sign(SECRET);
}

export async function verifySignedId(token: string) {
  return (await jwtVerify<{ id: string }>(token, SECRET)).payload.id;
}
