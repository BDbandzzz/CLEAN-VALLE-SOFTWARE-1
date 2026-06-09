import { ELEMENT_STATE_IDS } from '@/core/constants/domainConstants';
import { supabase } from '@/services/supabaseClient';

async function getExactCount(table, filters = []) {
  let query = supabase
    .from(table)
    .select('*', { count: 'exact', head: true });

  filters.forEach(([column, value]) => {
    query = query.eq(column, value);
  });

  const { count, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
}

async function getRoles() {
  const { data, error } = await supabase
    .from('roles')
    .select('role_id,role_name,description,color_hex')
    .order('role_id', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getAdminDashboardData() {
  const [
    activeUsers,
    totalReports,
    activeCategories,
    totalSubcategories,
    roles,
  ] = await Promise.all([
    getExactCount('users', [['id_state', ELEMENT_STATE_IDS.ACTIVE]]),
    getExactCount('reports'),
    getExactCount('type_category', [
      ['id_state', ELEMENT_STATE_IDS.ACTIVE],
    ]),
    getExactCount('subtype_category'),
    getRoles(),
  ]);

  const roleCounts = await Promise.all(
    roles.map(async (role) => ({
      roleId: role.role_id,
      count: await getExactCount('users', [
        ['id_state', ELEMENT_STATE_IDS.ACTIVE],
        ['id_role', role.role_id],
      ]),
    }))
  );

  return {
    metrics: {
      activeUsers,
      totalReports,
      activeCategories,
      totalSubcategories,
    },
    roles,
    roleCounts,
  };
}
