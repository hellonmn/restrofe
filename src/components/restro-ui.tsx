import React, { useRef } from "react";
import {
  Animated,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import * as Haptics from "expo-haptics";

export type HapticKind = "light" | "medium" | "select" | "success" | "none";

export const COLORS = {
  bg: "#FDF8F3",
  card: "#FFFFFF",
  primary: "#FF5A1F",
  primarySoft: "#FFEDE4",
  text: "#1C1C1E",
  subtext: "#6B6B73",
  muted: "#A3A3AB",
  border: "#F0E8E0",
  green: "#1BA672",
  greenSoft: "#E3F6EE",
  red: "#E23744",
  star: "#FFB400",
};

export const SHADOW = {
  sm: Platform.select<ViewStyle>({
    ios: {
      shadowColor: "#000",
      shadowOpacity: 0.04,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
    },
    default: { elevation: 1.5, shadowColor: "#D8CCC2" },
  }) as ViewStyle,
  md: Platform.select<ViewStyle>({
    ios: {
      shadowColor: "#000",
      shadowOpacity: 0.07,
      shadowRadius: 22,
      shadowOffset: { width: 0, height: 8 },
    },
    default: { elevation: 3, shadowColor: "#CDBBAA" },
  }) as ViewStyle,
  lg: Platform.select<ViewStyle>({
    ios: {
      shadowColor: "#FF5A1F",
      shadowOpacity: 0.22,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 10 },
    },
    default: { elevation: 5, shadowColor: "#FFA682" },
  }) as ViewStyle,
};

export const fire = (kind: HapticKind) => {
  if (Platform.OS === "web") return;
  if (kind === "light") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  else if (kind === "medium") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  else if (kind === "select") Haptics.selectionAsync();
  else if (kind === "success")
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
};

export function PressableScale({
  children,
  onPress,
  style,
  containerStyle,
  haptic = "light",
  scaleTo = 0.96,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  haptic?: HapticKind;
  scaleTo?: number;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const animate = (to: number) =>
    Animated.spring(scale, {
      toValue: to,
      useNativeDriver: true,
      speed: 40,
      bounciness: 6,
    }).start();

  return (
    <Pressable
      style={containerStyle}
      onPressIn={() => animate(scaleTo)}
      onPressOut={() => animate(1)}
      onPress={() => {
        fire(haptic);
        onPress?.();
      }}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

export function VegBadge({ veg }: { veg: boolean }) {
  const c = veg ? COLORS.green : COLORS.red;
  return (
    <View style={[kit.vegBox, { borderColor: c }]}>
      <View style={[kit.vegDot, { backgroundColor: c }]} />
    </View>
  );
}

export function RestroBadge({ text, color = '#F4512A', bg = '#FFF1EB' }: { text: string; color?: string; bg?: string }) {
  return (
    <View style={[kit.badge, { backgroundColor: bg }]}>
      <Text style={[kit.badgeText, { color }]}>{text}</Text>
    </View>
  );
}

export function RestroButton({ label, onPress, variant = 'primary' }: { label: string; onPress: () => void; variant?: 'primary' | 'dark' }) {
  return (
    <TouchableOpacity
      style={[kit.btn, variant === 'dark' ? kit.btnDark : kit.btnPrimary]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={kit.btnText}>{label}</Text>
    </TouchableOpacity>
  );
}

const kit = StyleSheet.create({
  vegBox: {
    width: 16,
    height: 16,
    borderWidth: 1.5,
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  vegDot: { width: 8, height: 8, borderRadius: 4 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 10, fontWeight: '900' },
  btn: { paddingVertical: 12, paddingHorizontal: 18, borderRadius: 16, alignItems: 'center' },
  btnPrimary: { backgroundColor: '#F4512A' },
  btnDark: { backgroundColor: '#171717' },
  btnText: { color: '#FFFFFF', fontWeight: '900', fontSize: 12 },
});
