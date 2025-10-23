import { requireMasterAdmin, getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Header from '@/components/Header';
import UserRoleManager from '@/components/UserRoleManager';

export default async function MasterAdminPage() {
  try {
    await requireMasterAdmin();
  } catch {
    redirect('/dashboard');
  }

  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header showAuth showBackButton userEmail={user?.email} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Master Admin Portal
          </h1>
          <p className="text-slate-600">
            Manage user roles and permissions
          </p>
        </div>

        <UserRoleManager />
      </main>
    </div>
  );
}

