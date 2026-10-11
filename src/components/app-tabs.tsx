import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Tabs } from 'expo-router';
import { PackIcon } from '@/components/pack-icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useCart } from '@/context/cart';

const BRAND = {
  background: '#FFFFFF',
  primary: '#FF5A1F',
  primarySoft: '#FFEDE4',
  inactive: '#9A9AA3',
  border: '#ECE7E2',
};

function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const cartContext = useCart();
  const tabBarVisible = cartContext?.tabBarVisible ?? true;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: tabBarVisible ? 0 : 120,
      useNativeDriver: true,
      speed: 16,
      bounciness: 4,
    }).start();
  }, [tabBarVisible, translateY]);

  return (
    <Animated.View
      style={[
        styles.tabBarContainer,
        {
          paddingBottom: Math.max(insets.bottom, 10),
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={styles.tabBarInner}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              cartContext?.setTabBarVisible(true);
              navigation.navigate(route.name);
            }
          };

          let iconName = 'home';
          if (route.name === 'index') iconName = 'home';
          else if (route.name === 'search') iconName = 'search';
          else if (route.name === 'orders') iconName = 'bag';
          else if (route.name === 'profile') iconName = 'user';

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={styles.tabItem}
              android_ripple={{ borderless: true, radius: 28 }}
            >
              <View style={[styles.iconWrap, isFocused && styles.iconWrapActive]}>
                <PackIcon
                  name={iconName}
                  size={20}
                  color={isFocused ? BRAND.primary : BRAND.inactive}
                />
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  { color: isFocused ? BRAND.primary : BRAND.inactive },
                  isFocused && styles.tabLabelActive,
                ]}
              >
                {String(label)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </Animated.View>
  );
}

export default function AppTabs() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="search" options={{ title: 'Search' }} />
      <Tabs.Screen name="orders" options={{ title: 'Orders' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 99,
    backgroundColor: BRAND.background,
    borderTopWidth: 1,
    borderTopColor: BRAND.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 12,
  },
  tabBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
  },
  iconWrapActive: {
    backgroundColor: BRAND.primarySoft,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  tabLabelActive: {
    fontWeight: '800',
  },
});