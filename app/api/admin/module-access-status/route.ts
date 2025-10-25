import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getModuleAccessStatus } from '@/lib/module-access';

export async function GET(request: NextRequest) {
  try {
    const adminUser = await getCurrentUser();
    if (!adminUser || (adminUser.role !== 'admin' && adminUser.role !== 'master_admin')) {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const moduleId = searchParams.get('moduleId');

    if (!userId || !moduleId) {
      return NextResponse.json(
        { error: 'Missing required parameters: userId and moduleId' },
        { status: 400 }
      );
    }

    // Pass true to bypassAdminCheck so we get the student's actual status, not the admin's
    const accessStatus = await getModuleAccessStatus(userId, moduleId, true);

    return NextResponse.json({ accessStatus });
  } catch (error) {
    console.error('Error fetching module access status:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

