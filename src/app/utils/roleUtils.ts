export const getHomePathForRoles = (roles: string[] | undefined): string => {
  if (!roles || roles.length === 0) return '/';
  if (roles.some((role) => ['Admin', 'SuperAdmin'].includes(role))) return '/admin-home';
  if (roles.some((role) => ['BusinessOwner', 'Business'].includes(role))) return '/business-owner-home';
  if (roles.includes('Rider')) return '/rider-home';
  return '/home';
};
