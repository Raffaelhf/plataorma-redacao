import { Landing } from '@/components/mockups/escreva-mais/Landing';
import { getPublicPlanPricing } from '@/lib/plans';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const pricing = await getPublicPlanPricing();

  return <Landing pricing={pricing} />;
}
