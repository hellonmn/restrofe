import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";

import { evaluateCoupon, useCart } from "@/context/cart";

/* -------------------------------------------------------------------------- */
/*  Theme + haptics                                                           */
/* -------------------------------------------------------------------------- */

type HapticKind = "light" | "medium" | "select" | "success" | "none";

const COLORS = {
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
};

const SHADOW = {
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

const fire = (kind: HapticKind) => {
  if (Platform.OS === "web") return;
  if (kind === "light") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  else if (kind === "medium") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  else if (kind === "select") Haptics.selectionAsync();
  else if (kind === "success")
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
};

/* -------------------------------------------------------------------------- */
/*  Pricing                                                                   */
/* -------------------------------------------------------------------------- */

const DELIVERY_FEE = 30;
const PLATFORM_FEE = 10;

/* -------------------------------------------------------------------------- */
/*  Reusable bits                                                             */
/* -------------------------------------------------------------------------- */

function PressableScale({
  children,
  onPress,
  style,
  haptic = "light",
  scaleTo = 0.96,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
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

function VegBadge({ veg }: { veg: boolean }) {
  const c = veg ? COLORS.green : COLORS.red;
  return (
    <View style={[styles.vegBox, { borderColor: c }]}>
      <View style={[styles.vegDot, { backgroundColor: c }]} />
    </View>
  );
}

function BillRow({
  label,
  value,
  color,
  bold,
}: {
  label: string;
  value: string;
  color?: string;
  bold?: boolean;
}) {
  return (
    <View style={styles.billRow}>
      <Text style={[styles.billLabel, bold && styles.billBold, color ? { color } : null]}>
        {label}
      </Text>
      <Text style={[styles.billValue, bold && styles.billBold, color ? { color } : null]}>
        {value}
      </Text>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*  Screen                                                                    */
/* -------------------------------------------------------------------------- */

export default function CartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { list, count, total: itemTotal, inc, dec, placeOrder: saveOrder, payment, selectedAddress, couponCode, setCoupon, walletBalance } = useCart();

  const [ordered, setOrdered] = useState(false);
  const [paid, setPaid] = useState(0);
  const [paidVia, setPaidVia] = useState("");

  const offer = evaluateCoupon(couponCode, itemTotal, DELIVERY_FEE);
  const discount = offer.valid ? offer.discount : 0;
  const grandTotal = itemTotal > 0 ? itemTotal + DELIVERY_FEE + PLATFORM_FEE - discount : 0;

  // wallet checkout
  const usingWallet = payment.id === "wallet";
  const shortBy = usingWallet ? Math.max(0, grandTotal - walletBalance) : 0;
  const insufficient = shortBy > 0;

  /* success pop animation */
  const pop = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (ordered) {
      Animated.spring(pop, {
        toValue: 1,
        useNativeDriver: true,
        bounciness: 14,
        speed: 10,
      }).start();
    }
  }, [ordered, pop]);

  const goBack = () => {
    fire("light");
    if (router.canGoBack()) router.back();
    else router.replace("/");
  };

  const placeOrder = () => {
    if (insufficient) {
      fire("medium");
      Alert.alert(
        "Insufficient wallet balance",
        `You need ₹${shortBy} more in your wallet to place this order.`,
        [
          { text: "Pay another way", onPress: () => router.push("/payments" as any) },
          { text: "Add money", onPress: () => router.push("/wallet" as any) },
        ]
      );
      return;
    }
    const ok = saveOrder(grandTotal, payment.id);
    if (!ok) {
      fire("medium");
      return;
    }
    fire("success");
    setPaid(grandTotal);
    setPaidVia(payment.label);
    setOrdered(true);
  };

  const trackOrder = () => router.replace("/orders" as any);
  const goHome = () => router.replace("/");

  /* ---------------------------- success state ---------------------------- */
  if (ordered) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
        <View style={styles.centerFill}>
          <Animated.View
            style={[
              styles.successCircle,
              {
                opacity: pop,
                transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }) }],
              },
            ]}
          >
            <Ionicons name="checkmark" size={56} color="#fff" />
          </Animated.View>
          <Text style={styles.successTitle}>Order placed!</Text>
          <Text style={styles.successSub}>
            Your food is being prepared and will arrive in about 25 min.
          </Text>
          <Text style={styles.successAmount}>Total paid: ₹{paid} • {paidVia}</Text>
          <PressableScale
            haptic="medium"
            onPress={trackOrder}
            style={[styles.primaryBtn, SHADOW.lg, { marginTop: 28, width: 220 }]}
          >
            <Text style={styles.primaryBtnText}>Track order</Text>
          </PressableScale>
          <PressableScale haptic="light" onPress={goHome} style={{ marginTop: 16, padding: 8 }}>
            <Text style={{ color: COLORS.subtext, fontWeight: "700", fontSize: 14.5 }}>
              Back to home
            </Text>
          </PressableScale>
        </View>
      </SafeAreaView>
    );
  }

  /* ----------------------------- empty state ----------------------------- */
  if (list.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
        <View style={styles.header}>
          <PressableScale haptic="none" scaleTo={0.9} onPress={goBack} style={styles.circleBtn}>
            <Ionicons name="chevron-back" size={22} color={COLORS.text} />
          </PressableScale>
          <Text style={styles.headerTitle}>Your Cart</Text>
          <View style={{ width: 42 }} />
        </View>
        <View style={styles.centerFill}>
          <Text style={{ fontSize: 60 }}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySub}>Add something tasty and it will show up here.</Text>
          <PressableScale
            haptic="medium"
            onPress={() => router.replace("/")}
            style={[styles.primaryBtn, SHADOW.lg, { marginTop: 22, width: 200 }]}
          >
            <Text style={styles.primaryBtnText}>Browse food</Text>
          </PressableScale>
        </View>
      </SafeAreaView>
    );
  }

  /* ------------------------------ cart state ----------------------------- */
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      {/* Header */}
      <View style={styles.header}>
        <PressableScale haptic="none" scaleTo={0.9} onPress={goBack} style={styles.circleBtn}>
          <Ionicons name="chevron-back" size={22} color={COLORS.text} />
        </PressableScale>
        <Text style={styles.headerTitle}>Your Cart</Text>
        <View style={{ width: 42 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 150 }}
      >
        {/* Items */}
        {list.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <Image source={{ uri: item.image }} style={styles.itemImg} />
            <View style={styles.itemBody}>
              <View style={styles.row}>
                <VegBadge veg={item.veg} />
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.name}
                </Text>
              </View>
              <Text style={styles.itemPrice}>₹{item.price * item.qty}</Text>
              {item.qty > 1 && (
                <Text style={styles.itemEach}>₹{item.price} each</Text>
              )}
            </View>
            <View style={styles.stepper}>
              <Pressable
                hitSlop={8}
                onPress={() => {
                  fire("light");
                  dec(item.id);
                }}
              >
                <Ionicons name="remove" size={18} color={COLORS.primary} />
              </Pressable>
              <Text style={styles.stepperQty}>{item.qty}</Text>
              <Pressable
                hitSlop={8}
                onPress={() => {
                  fire("light");
                  inc(item.id);
                }}
              >
                <Ionicons name="add" size={18} color={COLORS.primary} />
              </Pressable>
            </View>
          </View>
        ))}

        {/* Offer */}
        <PressableScale
          haptic="select"
          scaleTo={0.98}
          onPress={() => router.push("/offers" as any)}
          style={[styles.offerCard, offer.valid && styles.offerCardOn]}
        >
          <View style={[styles.offerIcon, offer.valid && { backgroundColor: COLORS.green }]}>
            <Ionicons
              name={offer.valid ? "checkmark" : "pricetag"}
              size={18}
              color={offer.valid ? "#fff" : COLORS.primary}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.offerTitle}>
              {offer.coupon
                ? `${offer.coupon.code} ${offer.valid ? "applied" : "selected"}`
                : "Apply Offer"}
            </Text>
            <Text
              style={[styles.offerSub, offer.coupon && !offer.valid && { color: COLORS.red }]}
            >
              {offer.coupon ? offer.message : "See all coupons and save more"}
            </Text>
          </View>
          {offer.coupon ? (
            <Pressable
              hitSlop={10}
              onPress={() => {
                fire("light");
                setCoupon(null);
              }}
            >
              <Ionicons
                name="close-circle"
                size={22}
                color={offer.valid ? COLORS.green : COLORS.muted}
              />
            </Pressable>
          ) : (
            <Ionicons name="chevron-forward" size={18} color={COLORS.muted} />
          )}
        </PressableScale>

        {/* Deliver to + Pay using */}
        <View style={styles.infoCard}>
          <Pressable
            style={styles.infoRow}
            onPress={() => {
              fire("light");
              router.push("/addresses" as any);
            }}
          >
            <View style={styles.infoIcon}>
              <Ionicons name="location-outline" size={18} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Deliver to {selectedAddress?.label ?? ""}</Text>
              <Text style={styles.infoValue} numberOfLines={1}>
                {selectedAddress?.line ?? "Add a delivery address"}
              </Text>
            </View>
            <Text style={styles.infoChange}>Change</Text>
          </Pressable>
          <View style={styles.infoDivider} />
          <Pressable
            style={styles.infoRow}
            onPress={() => {
              fire("light");
              router.push("/payments" as any);
            }}
          >
            <View style={styles.infoIcon}>
              <Ionicons name={payment.icon as any} size={18} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Pay using</Text>
              <Text
                style={[styles.infoValue, insufficient && { color: COLORS.red }]}
                numberOfLines={1}
              >
                {usingWallet
                  ? `${payment.label} • ₹${walletBalance}${insufficient ? " (low)" : ""}`
                  : payment.label}
              </Text>
            </View>
            <Text style={styles.infoChange}>Change</Text>
          </Pressable>
        </View>

        {/* Low wallet balance */}
        {insufficient && (
          <View style={styles.lowCard}>
            <View style={styles.lowIcon}>
              <Ionicons name="wallet-outline" size={20} color={COLORS.red} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.lowTitle}>Add ₹{shortBy} to pay with wallet</Text>
              <Text style={styles.lowSub}>Or choose another payment method.</Text>
            </View>
            <PressableScale
              haptic="medium"
              scaleTo={0.94}
              onPress={() => router.push("/wallet" as any)}
              style={styles.lowBtn}
            >
              <Text style={styles.lowBtnText}>Add money</Text>
            </PressableScale>
          </View>
        )}

        {/* Bill */}
        <View style={styles.billCard}>
          <Text style={styles.billTitle}>Bill details</Text>
          <BillRow label={`Item Total (${count} ${count === 1 ? "item" : "items"})`} value={`₹${itemTotal}`} />
          <BillRow label="Delivery Fee" value={`₹${DELIVERY_FEE}`} />
          <BillRow label="Platform Fee" value={`₹${PLATFORM_FEE}`} />
          {discount > 0 && (
            <BillRow label={`Offer (${couponCode})`} value={`-₹${discount}`} color={COLORS.green} />
          )}
          <View style={styles.billDivider} />
          <BillRow label="Total" value={`₹${grandTotal}`} bold />
        </View>
      </ScrollView>

      {/* Place order */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        <PressableScale
          haptic="none"
          scaleTo={0.98}
          onPress={placeOrder}
          style={[styles.placeBtn, SHADOW.lg]}
        >
          <View>
            <Text style={styles.placeTotal}>₹{grandTotal}</Text>
            <Text style={styles.placeSub}>TOTAL</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.placeText}>Place Order</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
          </View>
        </PressableScale>
      </View>
    </SafeAreaView>
  );
}

/* -------------------------------------------------------------------------- */
/*  Styles                                                                    */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  row: { flexDirection: "row", alignItems: "center" },
  centerFill: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 30 },

  /* header */
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

  /* items */
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 10,
    marginBottom: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
    ...SHADOW.md,
  },
  itemImg: { width: 70, height: 70, borderRadius: 14 },
  itemBody: { flex: 1, marginLeft: 12, marginRight: 8 },
  itemName: { flex: 1, marginLeft: 8, fontSize: 15, fontWeight: "800", color: COLORS.text },
  itemPrice: { marginTop: 6, fontSize: 15, fontWeight: "800", color: COLORS.text },
  itemEach: { marginTop: 1, fontSize: 11.5, color: COLORS.muted },
  stepper: {
    width: 88,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.primarySoft,
    borderWidth: 1,
    borderColor: "#FFD3BE",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  stepperQty: { fontSize: 15, fontWeight: "900", color: COLORS.primary },
  vegBox: {
    width: 16,
    height: 16,
    borderWidth: 1.5,
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  vegDot: { width: 8, height: 8, borderRadius: 4 },

  /* offer */
  offerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 14,
    marginTop: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.sm,
  },
  offerCardOn: { backgroundColor: COLORS.greenSoft, borderColor: "#BFE8D6" },
  offerIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  offerTitle: { fontSize: 15, fontWeight: "800", color: COLORS.text },
  offerSub: { fontSize: 12.5, color: COLORS.subtext, marginTop: 2 },

  /* deliver / pay */
  infoCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
    ...SHADOW.md,
  },
  infoRow: { flexDirection: "row", alignItems: "center", padding: 14 },
  infoIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  infoLabel: { fontSize: 12, color: COLORS.muted, fontWeight: "600" },
  infoValue: { fontSize: 14.5, color: COLORS.text, fontWeight: "700", marginTop: 2 },
  infoChange: { fontSize: 13, fontWeight: "800", color: COLORS.primary },
  infoDivider: { height: StyleSheet.hairlineWidth, backgroundColor: COLORS.border, marginHorizontal: 14 },

  /* low wallet */
  lowCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FDECEC",
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F8CFCF",
  },
  lowIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  lowTitle: { fontSize: 14, fontWeight: "800", color: COLORS.text },
  lowSub: { fontSize: 12, color: COLORS.subtext, marginTop: 2 },
  lowBtn: {
    paddingHorizontal: 12,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.red,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  lowBtnText: { color: "#fff", fontSize: 12.5, fontWeight: "800" },

  /* bill */
  billCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
    ...SHADOW.md,
  },
  billTitle: { fontSize: 16, fontWeight: "800", color: COLORS.text, marginBottom: 12 },
  billRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
  billLabel: { fontSize: 14, color: COLORS.subtext },
  billValue: { fontSize: 14, color: COLORS.text, fontWeight: "600" },
  billBold: { fontSize: 17, fontWeight: "900", color: COLORS.text },
  billDivider: { height: 1, backgroundColor: COLORS.border, marginVertical: 8 },

  /* footer */
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
  placeBtn: {
    height: 62,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  placeTotal: { color: "#fff", fontSize: 18, fontWeight: "900" },
  placeSub: { color: "rgba(255,255,255,0.8)", fontSize: 10.5, fontWeight: "700", letterSpacing: 0.8 },
  placeText: { color: "#fff", fontSize: 16, fontWeight: "800" },

  /* buttons */
  primaryBtn: {
    height: 52,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: { color: "#fff", fontSize: 15.5, fontWeight: "800" },

  /* empty + success */
  emptyTitle: { fontSize: 20, fontWeight: "800", color: COLORS.text, marginTop: 14 },
  emptySub: { fontSize: 14, color: COLORS.subtext, marginTop: 6, textAlign: "center" },
  successCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: COLORS.green,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOW.md,
  },
  successTitle: { fontSize: 26, fontWeight: "900", color: COLORS.text, marginTop: 24, letterSpacing: -0.5 },
  successSub: { fontSize: 14.5, color: COLORS.subtext, marginTop: 8, textAlign: "center", lineHeight: 21 },
  successAmount: { fontSize: 15, fontWeight: "800", color: COLORS.text, marginTop: 16 },
});