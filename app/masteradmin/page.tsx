import { requireMasterAdmin, getCurrentUser, isAdmin } from '@/lib/auth';
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
  const userIsAdmin = await isAdmin();

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Master Admin Portal" showAuth showBackButton userEmail={user?.email} isAdmin={userIsAdmin} />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8 animate-[fadeIn_0.6s_ease-out]">
            <h1 className="text-4xl font-bold text-[#1a1a1a] mb-3 tracking-tight">
              User Management
            </h1>
            <p className="text-lg text-gray-600">
              Manage user roles and permissions across the platform
            </p>
          </div>
          
          <UserRoleManager />
        </div>
      </main>
    </div>
  );
}

