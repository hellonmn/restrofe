import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { COLORS, PressableScale, SHADOW } from "@/components/restro-ui";

export default function WelcomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  // entrance + floating burger
  const enter = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: 700,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 0,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [enter, float]);

  const burgerSize = width * 0.95;

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      {/* soft background blobs */}
      <View style={[styles.blob, styles.blobTop]} />
      <View style={[styles.blob, styles.blobBottom, { width: width * 1.3, height: width * 1.3 }]} />

      <SafeAreaView style={{ flex: 1 }}>
        {/* brand */}
        <Animated.View
          style={[
            styles.brand,
            {
              opacity: enter,
              transform: [
                { translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) },
              ],
            },
          ]}
        >
          <Text style={styles.logo}>
            Restr<Text style={{ color: COLORS.primary }}>o</Text>fe
          </Text>
          <Text style={styles.tagline}>Good Food</Text>
          <Text style={styles.tagline}>Brings People Together</Text>

          <View style={styles.perks}>
            {[
              { icon: "restaurant-outline", text: "Discover great food" },
              { icon: "cafe-outline", text: "Cafés & restaurants nearby" },
              { icon: "flash-outline", text: "Fast & easy ordering" },
            ].map((p) => (
              <View key={p.text} style={styles.perkRow}>
                <View style={styles.perkIcon}>
                  <Ionicons name={p.icon as any} size={16} color={COLORS.primary} />
                </View>
                <Text style={styles.perkText}>{p.text}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* floating burger */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.burgerWrap,
            {
              width: burgerSize,
              height: burgerSize,
              right: -burgerSize * 0.12,
              opacity: enter,
              transform: [
                {
                  translateY: float.interpolate({ inputRange: [0, 1], outputRange: [0, -14] }),
                },
                {
                  rotate: float.interpolate({ inputRange: [0, 1], outputRange: ["-4deg", "2deg"] }),
                },
              ],
            },
          ]}
        >
          <Image
            source={require("../../assets/images/categories/burger.png")}
            style={{ width: "100%", height: "100%" }}
            resizeMode="contain"
          />
        </Animated.View>

        {/* CTA */}
        <View style={styles.cta}>
          <PressableScale
            haptic="medium"
            scaleTo={0.97}
            onPress={() => router.push("/login" as any)}
            style={[styles.btn, SHADOW.lg]}
          >
            <Text style={styles.btnText}>Get started</Text>
            <Ionicons name="arrow-forward" size={19} color="#fff" style={{ marginLeft: 8 }} />
          </PressableScale>
          <Text style={styles.terms}>
            By continuing you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },

  blob: { position: "absolute", borderRadius: 999 },
  blobTop: {
    width: 320,
    height: 320,
    top: -150,
    right: -110,
    backgroundColor: "#FFD9B8",
    opacity: 0.7,
  },
  blobBottom: {
    bottom: -300,
    left: -120,
    backgroundColor: "#FF8A4C",
    opacity: 0.35,
  },

  brand: { paddingHorizontal: 28, paddingTop: 36 },
  logo: { fontSize: 52, fontWeight: "900", color: COLORS.text, letterSpacing: -2.5 },
  tagline: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.subtext,
    letterSpacing: -0.4,
    marginTop: 2,
  },

  perks: { marginTop: 26 },
  perkRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  perkIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    ...SHADOW.sm,
  },
  perkText: { fontSize: 14.5, fontWeight: "600", color: COLORS.text },

  burgerWrap: { position: "absolute", bottom: 90 },

  cta: { position: "absolute", left: 24, right: 24, bottom: 24 },
  btn: {
    height: 58,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: { color: "#fff", fontSize: 17, fontWeight: "800" },
  terms: {
    marginTop: 12,
    textAlign: "center",
    fontSize: 11.5,
    color: COLORS.subtext,
    lineHeight: 16,
    paddingHorizontal: 10,
  },
});
