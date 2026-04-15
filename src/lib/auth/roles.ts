import type { User } from '@clerk/nextjs/server';

export type UserRole = 'contractor' | 'rep';

/**
 * Reads the user's role from Clerk publicMetadata.
 * Defaults to 'contractor' if not set.
 */
export function getUserRole(user: User | null | undefined): UserRole {
  if (!user) return 'contractor';
  const role = user.publicMetadata?.role;
  if (role === 'rep') return 'rep';
  return 'contractor';
}

/**
 * Returns true if the user has the 'rep' role.
 */
export function isRep(user: User | null | undefined): boolean {
  return getUserRole(user) === 'rep';
}
