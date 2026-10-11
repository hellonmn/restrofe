import { Redirect } from 'expo-router';

import AppTabs from '@/components/app-tabs';
import { AUTH_ENABLED, useCart } from '@/context/cart';

export default function TabsLayout() {
  const { user, hydrated } = useCart();

  // wait until saved login/cart data has been loaded (avoids a flash of the welcome screen)
  if (!hydrated) return null;

  // Not logged in → send to the welcome / login flow
  if (AUTH_ENABLED && !user) {
    return <Redirect href={'/welcome' as any} />;
  }

  return <AppTabs />;
}