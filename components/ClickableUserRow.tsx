'use client';

import { useRouter } from 'next/navigation';

interface ClickableUserRowProps {
  userId: string;
  fullName: string | null;
  email: string;
  role: {
    bg: string;
    text: string;
    label: string;
  };
  createdAt: string;
  progressPercentage: number;
  totalMastered: number;
  totalQuestions: number;
}

export default function ClickableUserRow({
  userId,
  fullName,
  email,
  role,
  createdAt,
  progressPercentage,
  totalMastered,
  totalQuestions,
}: ClickableUserRowProps) {
  const router = useRouter();

  const handleRowClick = () => {
    router.push(`/admin/user/${userId}`);
  };

  return (
    <tr
      onClick={handleRowClick}
      className="hover:bg-blue-50 transition-colors cursor-pointer"
    >
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
            {fullName?.charAt(0) || email.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-[#1a1a1a]">
              {fullName || 'Anonymous'}
            </div>
            <div className="text-xs text-gray-500">
              ID: {userId.slice(0, 8)}...
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {email}
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${role.bg} ${role.text}`}>
          {role.label}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {new Date(createdAt).toLocaleDateString()}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-[120px]">
            <div
              className="h-full rounded-full"
              style={{
                width: `${progressPercentage}%`,
                background: 'linear-gradient(135deg, #0A84FF 0%, #0077ED 100%)',
              }}
            />
          </div>
          <span className="text-xs font-semibold text-gray-600">
            {progressPercentage}%
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm font-semibold text-[#1a1a1a]">
          {totalMastered} / {totalQuestions}
        </div>
      </td>
    </tr>
  );
}

