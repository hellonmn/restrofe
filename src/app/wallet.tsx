import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
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
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

import {
  WALLET_BONUS,
  WALLET_BONUS_MIN,
  WALLET_MAX_ADD,
  WALLET_MIN_ADD,
  WalletTxn,
  useCart,
} from "@/context/cart";
import { COLORS, PressableScale, SHADOW, fire } from "@/components/restro-ui";

const QUICK = [100, 200, 500, 1000];

function formatWhen(ts: number) {
  const d = new Date(ts);
  const day = d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${day}, ${h}:${m} ${ampm}`;
}

export default function WalletScreen() {
  const router = useRouter();
  const { walletBalance = 0, walletTxns = [], addMoney } = useCart();

  const [amountText, setAmountText] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const toastAnim = useRef(new Animated.Value(0)).current;

  const amount = parseInt(amountText || "0", 10) || 0;
  const willGetBonus = amount >= WALLET_BONUS_MIN;

  const goBack = () => {
    fire("light");
    if (router.canGoBack()) router.back();
    else router.replace("/");
  };

  const onChange = (t: string) => {
    setAmountText(t.replace(/\D/g, "").slice(0, 5));
    if (error) setError("");
  };

  const addQuick = (n: number) => {
    fire("select");
    setAmountText(String(Math.min(WALLET_MAX_ADD, amount + n)));
    setError("");
  };

  // slide-in confirmation banner
  useEffect(() => {
    if (!toast) return;
    Animated.sequence([
      Animated.spring(toastAnim, { toValue: 1, useNativeDriver: true, bounciness: 8, speed: 14 }),
      Animated.delay(2200),
      Animated.timing(toastAnim, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start(() => setToast(""));
  }, [toast, toastAnim]);

  const submit = () => {
    if (amount < WALLET_MIN_ADD) {
      fire("medium");
      setError(`Minimum amount is ₹${WALLET_MIN_ADD}`);
      return;
    }
    if (amount > WALLET_MAX_ADD) {
      fire("medium");
      setError(`You can add up to ₹${WALLET_MAX_ADD} at a time`);
      return;
    }
    fire("success");
    addMoney(amount);
    setAmountText("");
    setToast(
      willGetBonus ? `₹${amount} added + ₹${WALLET_BONUS} cashback 🎉` : `₹${amount} added to your wallet`
    );
  };

  const renderTxn = (t: WalletTxn) => {
    const credit = t.type === "credit";
    return (
      <View key={t.id} style={styles.txnRow}>
        <View style={[styles.txnIcon, { backgroundColor: credit ? COLORS.greenSoft : COLORS.primarySoft }]}>
          <Ionicons
            name={credit ? "arrow-down" : "arrow-up"}
            size={18}
            color={credit ? COLORS.green : COLORS.primary}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.txnTitle} numberOfLines={1}>
            {t.title}
          </Text>
          <Text style={styles.txnWhen}>{formatWhen(t.at)}</Text>
        </View>
        <Text style={[styles.txnAmount, { color: credit ? COLORS.green : COLORS.text }]}>
          {credit ? "+" : "-"}₹{t.amount}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      <View style={styles.header}>
        <PressableScale haptic="none" scaleTo={0.9} onPress={goBack} style={styles.circleBtn}>
          <Ionicons name="chevron-back" size={22} color={COLORS.text} />
        </PressableScale>
        <Text style={styles.headerTitle}>Restrofe Wallet</Text>
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
          {/* Balance card */}
          <LinearGradient
            colors={["#FF5A1F", "#FF9A44"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.balanceCard, SHADOW.lg]}
          >
            <View style={styles.balanceTop}>
              <View style={styles.walletIcon}>
                <Ionicons name="wallet" size={20} color="#fff" />
              </View>
              <Text style={styles.balanceLabel}>Available balance</Text>
            </View>
            <Text style={styles.balanceValue}>₹{walletBalance}</Text>
            <Text style={styles.balanceHint}>Use it at checkout for instant payments</Text>
          </LinearGradient>

          {/* Add money */}
          <Text style={styles.section}>Add money</Text>
          <View style={styles.addCard}>
            <View style={[styles.amountRow, !!error && { borderColor: COLORS.red }]}>
              <Text style={styles.rupee}>₹</Text>
              <TextInput
                value={amountText}
                onChangeText={onChange}
                placeholder="0"
                placeholderTextColor={COLORS.muted}
                keyboardType="number-pad"
                style={styles.amountInput}
                maxLength={5}
                onSubmitEditing={submit}
              />
            </View>

            {!!error && (
              <View style={styles.errorRow}>
                <Ionicons name="alert-circle" size={15} color={COLORS.red} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.quickRow}>
              {QUICK.map((q) => (
                <PressableScale
                  key={q}
                  haptic="none"
                  scaleTo={0.94}
                  onPress={() => addQuick(q)}
                  containerStyle={{ flex: 1 }}
                  style={styles.quickChip}
                >
                  <Text style={styles.quickText}>+₹{q}</Text>
                </PressableScale>
              ))}
            </View>

            <View style={[styles.bonusRow, willGetBonus && styles.bonusRowOn]}>
              <Ionicons
                name="gift"
                size={18}
                color={willGetBonus ? COLORS.green : COLORS.primary}
              />
              <Text style={[styles.bonusText, willGetBonus && { color: COLORS.green }]}>
                {willGetBonus
                  ? `You'll get ₹${WALLET_BONUS} cashback with this top-up!`
                  : `Add ₹${WALLET_BONUS_MIN} or more and get ₹${WALLET_BONUS} cashback`}
              </Text>
            </View>

            <PressableScale
              haptic="none"
              scaleTo={0.98}
              onPress={submit}
              style={[styles.addBtn, amount >= WALLET_MIN_ADD ? SHADOW.lg : styles.addBtnOff]}
            >
              <Text style={styles.addBtnText}>
                {amount >= WALLET_MIN_ADD ? `Add ₹${amount} to wallet` : "Add money"}
              </Text>
            </PressableScale>
            <Text style={styles.demo}>Demo mode: money is added instantly, no real payment is taken.</Text>
          </View>

          {/* Transactions */}
          <Text style={styles.section}>Transactions</Text>
          {(walletTxns?.length ?? 0) === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="receipt-outline" size={34} color={COLORS.muted} />
              <Text style={styles.emptyText}>No transactions yet</Text>
            </View>
          ) : (
            <View style={styles.txnCard}>
              {walletTxns?.map((t, i) => (
                <View key={t.id} style={i < (walletTxns?.length ?? 0) - 1 ? styles.txnDivider : undefined}>
                  {renderTxn(t)}
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Success banner */}
      {!!toast && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.toast,
            SHADOW.md,
            {
              opacity: toastAnim,
              transform: [
                { translateY: toastAnim.interpolate({ inputRange: [0, 1], outputRange: [-30, 0] }) },
              ],
            },
          ]}
        >
          <Ionicons name="checkmark-circle" size={20} color="#fff" />
          <Text style={styles.toastText}>{toast}</Text>
        </Animated.View>
      )}
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

  balanceCard: { borderRadius: 26, padding: 22 },
  balanceTop: { flexDirection: "row", alignItems: "center" },
  walletIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  balanceLabel: { color: "rgba(255,255,255,0.92)", fontSize: 14, fontWeight: "700" },
  balanceValue: { color: "#fff", fontSize: 44, fontWeight: "900", letterSpacing: -1.5, marginTop: 14 },
  balanceHint: { color: "rgba(255,255,255,0.85)", fontSize: 12.5, marginTop: 4 },

  section: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.muted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginTop: 26,
    marginBottom: 12,
  },

  addCard: {
    backgroundColor: COLORS.card,
    borderRadius: 22,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
    ...SHADOW.md,
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 62,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: COLORS.bg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  rupee: { fontSize: 26, fontWeight: "900", color: COLORS.text, marginRight: 6 },
  amountInput: { flex: 1, fontSize: 28, fontWeight: "900", color: COLORS.text },
  errorRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  errorText: { marginLeft: 6, fontSize: 13, color: COLORS.red, fontWeight: "600" },

  quickRow: { flexDirection: "row", marginTop: 14, gap: 8 },
  quickChip: {
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.primarySoft,
    borderWidth: 1,
    borderColor: "#FFD3BE",
    alignItems: "center",
    justifyContent: "center",
  },
  quickText: { fontSize: 13.5, fontWeight: "800", color: COLORS.primary },

  bonusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    padding: 12,
    borderRadius: 14,
    backgroundColor: COLORS.primarySoft,
  },
  bonusRowOn: { backgroundColor: COLORS.greenSoft },
  bonusText: { flex: 1, marginLeft: 10, fontSize: 12.5, fontWeight: "700", color: COLORS.subtext, lineHeight: 17 },

  addBtn: {
    marginTop: 16,
    height: 54,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  addBtnOff: { backgroundColor: "#FFB596" },
  addBtnText: { color: "#fff", fontSize: 16, fontWeight: "800" },
  demo: { marginTop: 10, fontSize: 11.5, color: COLORS.muted, textAlign: "center" },

  txnCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    paddingHorizontal: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
    ...SHADOW.md,
  },
  txnRow: { flexDirection: "row", alignItems: "center", paddingVertical: 14 },
  txnDivider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: COLORS.border },
  txnIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  txnTitle: { fontSize: 14.5, fontWeight: "700", color: COLORS.text },
  txnWhen: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  txnAmount: { fontSize: 15.5, fontWeight: "900" },

  empty: { alignItems: "center", paddingVertical: 30 },
  emptyText: { marginTop: 8, fontSize: 13.5, color: COLORS.muted, fontWeight: "600" },

  toast: {
    position: "absolute",
    top: 70,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    backgroundColor: COLORS.green,
  },
  toastText: { marginLeft: 10, color: "#fff", fontSize: 14, fontWeight: "800", flex: 1 },
});