import type { auth } from './auth';

type BetterAuthSession = typeof auth.$Infer.Session;

export type SessionUser = BetterAuthSession['user'] & {
  role: 'ADMIN' | 'USER';
};

export type AuthSession = {
  user: SessionUser;
  session: BetterAuthSession['session'];
};
