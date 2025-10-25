'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import type { Profile, UserRole } from '@/lib/types/database';

export default function UserRoleManager() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState('');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateUserRole(userId: string, newRole: UserRole) {
    setUpdating(userId);
    setError('');

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpdating(null);
    }
  }

  function getRoleBadgeClass(role: UserRole) {
    switch (role) {
      case 'master_admin':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'admin':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'student':
        return 'bg-green-100 text-green-800 border-green-300';
    }
  }

  function getRoleDisplayName(role: UserRole) {
    switch (role) {
      case 'master_admin':
        return 'Master Admin';
      case 'admin':
        return 'Admin';
      case 'student':
        return 'Student';
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="quiz-container p-0 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-[#1a1a1a]">All Users</h2>
      </div>
      
      {error && (
        <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Current Role
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Change Role
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Joined
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr 
                key={user.id}
                className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-[#1a1a1a] dark:text-white">{user.email}</td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{user.full_name || '-'}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRoleBadgeClass(user.role)}`}>
                    {getRoleDisplayName(user.role)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={user.role}
                    onChange={(e) => updateUserRole(user.id, e.target.value as UserRole)}
                    disabled={updating === user.id}
                    className="px-3 py-1.5 border-2 border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:border-[#0A84FF] focus:ring-2 focus:ring-[#0A84FF] focus:ring-opacity-20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                    <option value="master_admin">Master Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="p-12 text-center">
            <div className="text-5xl mb-4">👥</div>
            <p className="text-gray-600">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
}

