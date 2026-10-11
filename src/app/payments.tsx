import React from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { PAYMENT_METHODS, useCart } from "@/context/cart";
import { COLORS, PressableScale, SHADOW, fire } from "@/components/restro-ui";

export default function PaymentsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { paymentId, setPaymentId } = useCart();

  const goBack = () => {
    fire("light");
    if (router.canGoBack()) router.back();
    else router.replace("/");
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      <View style={styles.header}>
        <PressableScale haptic="none" scaleTo={0.9} onPress={goBack} style={styles.circleBtn}>
          <Ionicons name="chevron-back" size={22} color={COLORS.text} />
        </PressableScale>
        <Text style={styles.headerTitle}>Payment methods</Text>
        <View style={{ width: 42 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 130 }}
      >
        <Text style={styles.section}>Choose how you want to pay</Text>

        {PAYMENT_METHODS.map((m) => {
          const on = paymentId === m.id;
          return (
            <PressableScale
              key={m.id}
              haptic="select"
              scaleTo={0.98}
              onPress={() => setPaymentId(m.id)}
              style={[styles.card, on && styles.cardOn]}
            >
              <View style={[styles.iconBox, on && { backgroundColor: COLORS.primary }]}>
                <Ionicons
                  name={m.icon as any}
                  size={22}
                  color={on ? "#fff" : COLORS.primary}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{m.label}</Text>
                <Text style={styles.cardSub}>{m.sub}</Text>
              </View>
              <View style={[styles.radio, on && styles.radioOn]}>
                {on && <View style={styles.radioDot} />}
              </View>
            </PressableScale>
          );
        })}

        <View style={styles.note}>
          <Ionicons name="shield-checkmark" size={20} color={COLORS.green} />
          <Text style={styles.noteText}>
            Your selection is used as the default at checkout. You can change it anytime from the
            cart.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        <PressableScale
          haptic="success"
          scaleTo={0.98}
          onPress={goBack}
          style={[styles.doneBtn, SHADOW.lg]}
        >
          <Text style={styles.doneText}>Done</Text>
        </PressableScale>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerTitle: { fontSize: 20, fontWeight: "800", color: COLORS.text, letterSpacing: -0.3 },
  circleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.card,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOW.sm,
  },

  section: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.muted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 12,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: "transparent",
    ...SHADOW.md,
  },
  cardOn: { borderColor: COLORS.primary, backgroundColor: "#FFF9F5" },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  cardTitle: { fontSize: 16, fontWeight: "800", color: COLORS.text },
  cardSub: { fontSize: 12.5, color: COLORS.subtext, marginTop: 3 },

  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#DDD2C8",
    alignItems: "center",
    justifyContent: "center",
  },
  radioOn: { borderColor: COLORS.primary },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.primary },

  note: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.greenSoft,
    borderRadius: 16,
    padding: 14,
    marginTop: 8,
  },
  noteText: { flex: 1, marginLeft: 10, fontSize: 12.5, color: COLORS.subtext, lineHeight: 18 },

  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: COLORS.bg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
  },
  doneBtn: {
    height: 56,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  doneText: { color: "#fff", fontSize: 16, fontWeight: "800" },
});
