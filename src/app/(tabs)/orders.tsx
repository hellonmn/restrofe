import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { Order, useCart } from "@/context/cart";
import { COLORS, PressableScale, SHADOW, fire } from "@/components/restro-ui";

/* -------------------------------------------------------------------------- */
/*  Order status (demo: moves forward with time)                              */
/*  Preparing → On the way after 1 min → Delivered after 2 min                */
/*  Replace statusOf() with real status from your backend later.              */
/* -------------------------------------------------------------------------- */

const STEPS = ["Preparing", "On the way", "Delivered"] as const;
const PAY_LABEL: Record<string, string> = { wallet: "Wallet", upi: "UPI", card: "Card", cod: "Cash" };
const ON_THE_WAY_AFTER_MIN = 1;
const DELIVERED_AFTER_MIN = 2;

function statusOf(placedAt: number, now: number): 0 | 1 | 2 {
  const mins = (now - placedAt) / 60000;
  if (mins < ON_THE_WAY_AFTER_MIN) return 0;
  if (mins < DELIVERED_AFTER_MIN) return 1;
  return 2;
}

function formatTime(ts: number) {
  const d = new Date(ts);
  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

function summary(order: Order) {
  const names = order.items.map((i) => `${i.qty} × ${i.name}`);
  if (names.length <= 2) return names.join(", ");
  return `${names.slice(0, 2).join(", ")} +${names.length - 2} more`;
}

/* -------------------------------------------------------------------------- */
/*  Screen                                                                    */
/* -------------------------------------------------------------------------- */

type Tab = "Active" | "Past";

export default function OrdersScreen() {
  const router = useRouter();
  const { orders, add } = useCart();

  const [tab, setTab] = useState<Tab>("Active");
  const [now, setNow] = useState(Date.now());

  // refresh the status every few seconds
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 4000);
    return () => clearInterval(t);
  }, []);

  const active = orders.filter((o) => statusOf(o.placedAt, now) < 2);
  const past = orders.filter((o) => statusOf(o.placedAt, now) === 2);
  const shown = tab === "Active" ? active : past;

  const reorder = (o: Order) => {
    fire("success");
    o.items.forEach((item) => {
      for (let i = 0; i < item.qty; i++) {
        add({ id: item.id, name: item.name, price: item.price, image: item.image, veg: item.veg });
      }
    });
    router.push("/cart" as any);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      <Text style={styles.title}>Your Orders</Text>

      {/* Segmented tabs */}
      <View style={styles.segment}>
        {(["Active", "Past"] as Tab[]).map((t) => {
          const on = tab === t;
          const n = t === "Active" ? active.length : past.length;
          return (
            <PressableScale
              key={t}
              haptic="select"
              scaleTo={0.97}
              onPress={() => setTab(t)}
              containerStyle={{ flex: 1 }}
              style={[styles.segBtn, on && styles.segBtnOn]}
            >
              <Text style={[styles.segText, on && styles.segTextOn]}>
                {t}
                {n > 0 ? `  ${n}` : ""}
              </Text>
            </PressableScale>
          );
        })}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
      >
        {shown.map((o) => {
          const step = statusOf(o.placedAt, now);
          const delivered = step === 2;
          const first = o.items[0];
          return (
            <View key={o.id} style={styles.card}>
              {/* top row */}
              <View style={styles.rowTop}>
                <Image source={{ uri: first.image }} style={styles.thumb} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.orderId}>#{o.id}</Text>
                    <View style={[styles.statusPill, delivered && styles.statusPillDone]}>
                      <Text style={[styles.statusText, delivered && { color: COLORS.green }]}>
                        {STEPS[step]}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.items} numberOfLines={2}>
                    {summary(o)}
                  </Text>
                  <Text style={styles.meta}>
                    {formatTime(o.placedAt)} • ₹{o.total}
                    {o.paidWith && PAY_LABEL[o.paidWith]
                      ? ` • ${PAY_LABEL[o.paidWith]}`
                      : o.paymentMethod
                      ? ` • ${o.paymentMethod}`
                      : ""}
                  </Text>
                </View>
              </View>

              {/* progress (active only) */}
              {!delivered && (
                <View style={styles.progressWrap}>
                  <View style={styles.progressRow}>
                    {STEPS.map((s, i) => (
                      <React.Fragment key={s}>
                        <View
                          style={[
                            styles.stepDot,
                            i <= step && styles.stepDotOn,
                          ]}
                        >
                          {i <= step && <Ionicons name="checkmark" size={11} color="#fff" />}
                        </View>
                        {i < STEPS.length - 1 && (
                          <View style={[styles.stepLine, i < step && styles.stepLineOn]} />
                        )}
                      </React.Fragment>
                    ))}
                  </View>
                  <View style={styles.rowBetween}>
                    {STEPS.map((s, i) => (
                      <Text
                        key={s}
                        style={[styles.stepLabel, i <= step && styles.stepLabelOn]}
                      >
                        {s}
                      </Text>
                    ))}
                  </View>
                  <Text style={styles.eta}>
                    {step === 0 ? "Restaurant is preparing your food" : "Your order is on the way"}
                  </Text>
                </View>
              )}

              {/* actions */}
              {delivered && (
                <PressableScale
                  haptic="none"
                  scaleTo={0.97}
                  onPress={() => reorder(o)}
                  style={[styles.reorderBtn, SHADOW.lg]}
                >
                  <Ionicons name="refresh" size={17} color="#fff" />
                  <Text style={styles.reorderText}>Reorder</Text>
                </PressableScale>
              )}
            </View>
          );
        })}

        {shown.length === 0 && (
          <View style={styles.empty}>
            <Text style={{ fontSize: 54 }}>{tab === "Active" ? "🛵" : "🧾"}</Text>
            <Text style={styles.emptyTitle}>
              {tab === "Active" ? "No active orders" : "No past orders yet"}
            </Text>
            <Text style={styles.emptySub}>
              {tab === "Active"
                ? "When you place an order, you can track it here."
                : "Delivered orders will show up here."}
            </Text>
            {tab === "Active" && (
              <PressableScale
                haptic="medium"
                onPress={() => router.replace("/")}
                style={[styles.reorderBtn, SHADOW.lg, { marginTop: 20, width: 190 }]}
              >
                <Text style={styles.reorderText}>Order something</Text>
              </PressableScale>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* -------------------------------------------------------------------------- */
/*  Styles                                                                    */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  rowTop: { flexDirection: "row", alignItems: "flex-start" },

  title: {
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.text,
    letterSpacing: -0.8,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
  },

  segment: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 18,
    padding: 4,
    borderRadius: 16,
    backgroundColor: "#F1E9E1",
  },
  segBtn: { height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  segBtnOn: { backgroundColor: COLORS.card, ...SHADOW.sm },
  segText: { fontSize: 14.5, fontWeight: "700", color: COLORS.muted },
  segTextOn: { color: COLORS.primary, fontWeight: "800" },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 22,
    padding: 14,
    marginBottom: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
    ...SHADOW.md,
  },
  thumb: { width: 64, height: 64, borderRadius: 16 },
  orderId: { fontSize: 15, fontWeight: "800", color: COLORS.text },
  items: { fontSize: 13, color: COLORS.subtext, marginTop: 4, lineHeight: 18 },
  meta: { fontSize: 12.5, color: COLORS.muted, marginTop: 4, fontWeight: "600" },

  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: COLORS.primarySoft,
  },
  statusPillDone: { backgroundColor: COLORS.greenSoft },
  statusText: { fontSize: 11.5, fontWeight: "800", color: COLORS.primary },

  progressWrap: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
  },
  progressRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 10 },
  stepDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#EADFD5",
    alignItems: "center",
    justifyContent: "center",
  },
  stepDotOn: { backgroundColor: COLORS.primary },
  stepLine: { flex: 1, height: 3, borderRadius: 2, backgroundColor: "#EADFD5", marginHorizontal: 4 },
  stepLineOn: { backgroundColor: COLORS.primary },
  stepLabel: { fontSize: 11.5, fontWeight: "600", color: COLORS.muted, marginTop: 8 },
  stepLabelOn: { color: COLORS.text, fontWeight: "800" },
  eta: { marginTop: 12, fontSize: 12.5, color: COLORS.subtext, textAlign: "center" },

  reorderBtn: {
    marginTop: 14,
    height: 46,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  reorderText: { color: "#fff", fontSize: 14.5, fontWeight: "800", marginLeft: 6 },

  empty: { alignItems: "center", paddingTop: 60 },
  emptyTitle: { fontSize: 18, fontWeight: "800", color: COLORS.text, marginTop: 12 },
  emptySub: { fontSize: 13.5, color: COLORS.subtext, marginTop: 6, textAlign: "center", paddingHorizontal: 30 },
});