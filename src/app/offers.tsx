import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PackIcon } from "@/components/pack-icon";
import { useRouter } from "expo-router";

import { Coupon, evaluateCoupon, useCart } from "@/context/cart";
import { useRestaurant } from "@/context/restaurant";
import { COLORS, PressableScale, SHADOW, fire } from "@/components/restro-ui";

const DELIVERY_FEE = 30; // keep in sync with cart.tsx

export default function OffersScreen() {
  const router = useRouter();
  const { couponCode, setCoupon, total, count } = useCart();
  const { offers } = useRestaurant();

  const [manual, setManual] = useState("");
  const [error, setError] = useState("");

  const activeCoupons: Coupon[] = React.useMemo(() => {
    return offers
      .filter((o) => o.active)
      .map((o) => ({
        code: o.code,
        title: o.title,
        desc: o.desc,
        min: o.min,
        kind: o.kind,
        value: o.value,
        stackedValue: o.stackedValue,
        max: o.max,
        icon: o.icon || "ticket",
      }));
  }, [offers]);

  const goBack = () => {
    fire("light");
    if (router.canGoBack()) router.back();
    else router.replace("/");
  };

  const apply = (code: string) => {
    fire("success");
    setCoupon(code);
    setError("");
    setManual("");
    // coming from the cart → return there
    if (count > 0 && router.canGoBack()) router.back();
  };

  const applyManual = () => {
    const code = manual.trim().toUpperCase();
    if (!code) return;
    if (!activeCoupons.some((c) => c.code === code)) {
      fire("medium");
      setError("This code isn't valid. Check and try again.");
      return;
    }
    apply(code);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      <View style={styles.header}>
        <PressableScale haptic="none" scaleTo={0.9} onPress={goBack} style={styles.circleBtn}>
          <PackIcon name="chevron-back" size={22} color={COLORS.text} />
        </PressableScale>
        <Text style={styles.headerTitle}>Offers & coupons</Text>
        <View style={{ width: 42 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        >
          {/* Manual code */}
          <View style={styles.codeRow}>
            <TextInput
              value={manual}
              onChangeText={(t) => {
                setManual(t.toUpperCase());
                if (error) setError("");
              }}
              placeholder="Enter coupon code"
              placeholderTextColor={COLORS.muted}
              autoCapitalize="characters"
              autoCorrect={false}
              style={[styles.codeInput as any, !!error && { borderColor: COLORS.red }]}
              onSubmitEditing={applyManual}
            />
            <PressableScale
              haptic="none"
              scaleTo={0.95}
              onPress={applyManual}
              style={[styles.codeBtn, manual.trim() ? SHADOW.lg : styles.codeBtnOff]}
            >
              <Text style={styles.codeBtnText}>Apply</Text>
            </PressableScale>
          </View>
          {!!error && (
            <View style={styles.errorRow}>
              <PackIcon name="alert-circle" size={15} color={COLORS.red} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Text style={styles.section}>Available coupons</Text>

          {activeCoupons.map((c) => {
            const on = couponCode === c.code;
            const result = evaluateCoupon(c.code, total, DELIVERY_FEE, activeCoupons);
            const eligible = result.valid;
            return (
              <View key={c.code} style={[styles.card, on && styles.cardOn]}>
                <View style={styles.cardTop}>
                  <View style={[styles.iconBox, on && { backgroundColor: COLORS.green }]}>
                    <PackIcon
                      name={(on ? "checkmark" : c.icon) as any}
                      size={22}
                      color={on ? "#fff" : COLORS.primary}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{c.title}</Text>
                    <Text style={styles.cardDesc}>{c.desc}</Text>
                  </View>
                </View>

                <View style={styles.dash} />

                <View style={styles.cardBottom}>
                  <View style={styles.codeChip}>
                    <Text style={styles.codeChipText}>{c.code}</Text>
                  </View>

                  {on ? (
                    <PressableScale
                      haptic="light"
                      scaleTo={0.95}
                      onPress={() => setCoupon(null)}
                      style={styles.removeBtn}
                    >
                      <Text style={styles.removeText}>Remove</Text>
                    </PressableScale>
                  ) : (
                    <PressableScale
                      haptic="none"
                      scaleTo={0.95}
                      onPress={() => apply(c.code)}
                      style={styles.applyBtn}
                    >
                      <Text style={styles.applyText}>Apply</Text>
                    </PressableScale>
                  )}
                </View>

                {count > 0 && !eligible && (
                  <Text style={styles.hint}>{result.message}</Text>
                )}
                {on && eligible && (
                  <Text style={[styles.hint, { color: COLORS.green }]}>{result.message}</Text>
                )}
              </View>
            );
          })}

          <Text style={styles.footnote}>
            Only one coupon can be used per order. Coupons are demo offers.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
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

  codeRow: { flexDirection: "row", alignItems: "center" },
  codeInput: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
    letterSpacing: 1,
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    ...SHADOW.md,
  },
  codeBtn: {
    height: 52,
    paddingHorizontal: 22,
    marginLeft: 10,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  codeBtnOff: { backgroundColor: "#FFB596" },
  codeBtnText: { color: "#fff", fontSize: 15, fontWeight: "800" },
  errorRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  errorText: { marginLeft: 6, fontSize: 13, color: COLORS.red, fontWeight: "600" },

  section: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.muted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginTop: 24,
    marginBottom: 12,
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: "transparent",
    ...SHADOW.md,
  },
  cardOn: { borderColor: "#BFE8D6", backgroundColor: "#F6FCF9" },
  cardTop: { flexDirection: "row", alignItems: "center" },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  cardTitle: { fontSize: 17, fontWeight: "800", color: COLORS.text, letterSpacing: -0.2 },
  cardDesc: { fontSize: 13, color: COLORS.subtext, marginTop: 3 },
  dash: {
    height: 1,
    marginVertical: 14,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: COLORS.border,
    borderRadius: 1,
  },
  cardBottom: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  codeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: COLORS.primarySoft,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#FFB596",
  },
  codeChipText: { fontSize: 13, fontWeight: "900", color: COLORS.primary, letterSpacing: 0.8 },
  applyBtn: {
    paddingHorizontal: 22,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOW.lg,
  },
  applyText: { color: "#fff", fontSize: 14, fontWeight: "800" },
  removeBtn: {
    paddingHorizontal: 18,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: "#BFE8D6",
    alignItems: "center",
    justifyContent: "center",
  },
  removeText: { color: COLORS.green, fontSize: 14, fontWeight: "800" },
  hint: { marginTop: 12, fontSize: 12.5, fontWeight: "600", color: COLORS.subtext },

  footnote: { fontSize: 12, color: COLORS.muted, textAlign: "center", marginTop: 6 },
});
