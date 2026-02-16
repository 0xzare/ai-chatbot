/**
 * Helper function to determine if a user is an admin (sync version)
 * This version assumes the user object already has the role property
 */
export function isAdminUserRole(role: string | undefined): boolean {
  return role === 'admin';
}