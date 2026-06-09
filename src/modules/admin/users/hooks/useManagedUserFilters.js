import { useMemo, useState } from 'react';

const ALL_ROLES = 'all';
const ALL_STATUSES = 'all';

function normalize(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function useManagedUserFilters(users) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(ALL_STATUSES);
  const [role, setRole] = useState(ALL_ROLES);

  const filteredUsers = useMemo(() => {
    const query = normalize(search);

    return users.filter((user) => {
      const isActive = user.active !== false;
      const matchesStatus =
        status === ALL_STATUSES ||
        (status === 'active' && isActive) ||
        (status === 'inactive' && !isActive);
      const matchesRole =
        role === ALL_ROLES || Number(user.roleId) === Number(role);
      const searchableText = normalize([
        user.firstName,
        user.lastName,
        user.codeUser,
        user.email,
        user.dniUser,
      ].join(' '));

      return matchesStatus && matchesRole && (!query || searchableText.includes(query));
    });
  }, [role, search, status, users]);

  const counts = useMemo(
    () => ({
      all: users.length,
      active: users.filter((user) => user.active !== false).length,
      inactive: users.filter((user) => user.active === false).length,
    }),
    [users]
  );

  return {
    search,
    status,
    role,
    counts,
    filteredUsers,
    setSearch,
    setStatus,
    setRole,
  };
}
