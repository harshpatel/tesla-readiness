import { getImpersonationDataForHeader } from '@/lib/auth';
import ImpersonationBanner from '@/components/ImpersonationBanner';

/**
 * Server component that checks impersonation state and shows banner if needed
 * Can be placed in layout or any page
 */
export default async function ImpersonationBannerWrapper() {
  const impersonationData = await getImpersonationDataForHeader();
  
  if (!impersonationData?.isImpersonating) {
    return null;
  }
  
  return (
    <ImpersonationBanner
      impersonatedUserName={impersonationData.impersonatedUserName}
      impersonatedUserEmail={impersonationData.impersonatedUserEmail}
    />
  );
}

