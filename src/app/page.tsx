import { Landing } from '@/components/mockups/escreva-mais/Landing';
import { getLandingSocialProof } from '@/lib/landing-social-proof';
import { getPublicPlanPricing } from '@/lib/plans';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [pricing, socialProof] = await Promise.all([getPublicPlanPricing(), getLandingSocialProof()]);

  return <Landing pricing={pricing} socialProof={socialProof} />;
}
