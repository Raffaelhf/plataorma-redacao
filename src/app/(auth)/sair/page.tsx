import { SignoutConfirmation } from '@/components/auth/signout-confirmation';
import '@/components/mockups/escreva-mais/_group.css';

function normalizeCallbackUrl(callbackUrl?: string) {
  if (!callbackUrl || !callbackUrl.startsWith('/') || callbackUrl.startsWith('//')) {
    return '/login';
  }

  return callbackUrl;
}

export default async function SignoutPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return <SignoutConfirmation callbackUrl={normalizeCallbackUrl(callbackUrl)} />;
}
