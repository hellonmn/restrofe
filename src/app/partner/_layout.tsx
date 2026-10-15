import React from 'react';
import { Stack } from 'expo-router';

export default function PartnerLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="list-restaurant" options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="menu" />
      <Stack.Screen name="offers" />
      <Stack.Screen name="qr-code" />
      <Stack.Screen name="analytics" />
      <Stack.Screen name="account" />
    </Stack>
  );
}
