import { Stack } from 'expo-router';
import React from 'react';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { CartProvider } from '@/context/cart';
import { RestaurantProvider } from '@/context/restaurant';

export default function RootLayout() {
  return (
    <RestaurantProvider>
      <CartProvider>
        <AnimatedSplashOverlay />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="welcome" options={{ animation: 'fade', gestureEnabled: false }} />
          <Stack.Screen name="restaurant/[id]" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="cart" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="partner" options={{ animation: 'slide_from_right' }} />
        </Stack>
      </CartProvider>
    </RestaurantProvider>
  );
}
