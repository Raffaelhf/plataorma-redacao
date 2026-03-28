export function isAdminRole(role?: string | null): role is 'ADMIN' {
  return role === 'ADMIN';
}

export function isTeacherRole(role?: string | null): role is 'TEACHER' | 'ADMIN' {
  return role === 'TEACHER' || role === 'ADMIN';
}

export function getDashboardPathByRole(role?: string | null) {
  if (role === 'ADMIN') return '/dashboard/admin';
  if (role === 'TEACHER') return '/dashboard/professor';
  return '/dashboard/aluno';
}
