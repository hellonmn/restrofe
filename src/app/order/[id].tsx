import React from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PackIcon } from "@/components/pack-icon";
import { useCart, type CartItem, type Order } from "@/context/cart";
import { getRestaurant, RESTAURANTS } from "@/constants/catalog";
import {
  COLORS,
  PressableScale,
  SHADOW,
  VegBadge,
  fire,
} from "@/components/restro-ui";

const first = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v ?? "");

export default function OrderDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const orderId = first(params.id);

  const { orders, add } = useCart();

  // Find order by ID, or fallback to most recent order if not found
  const order: Order | undefined =
    orders.find((o) => o.id === orderId) ?? orders[0];

  const goBack = () => {
    fire("light");
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)/orders" as any);
  };

  if (!order) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
        <View style={styles.header}>
          <PressableScale haptic="light" scaleTo={0.9} onPress={goBack} style={styles.circleBtn}>
            <PackIcon name="chevron-back" size={20} color={COLORS.text} />
          </PressableScale>
          <Text style={styles.headerTitle}>Order Details</Text>
          <View style={{ width: 42 }} />
        </View>

        <View style={styles.emptyWrap}>
          <Text style={{ fontSize: 50 }}>📦</Text>
          <Text style={styles.emptyTitle}>Order not found</Text>
          <PressableScale
            haptic="medium"
            style={styles.backBtn}
            onPress={() => router.replace("/(tabs)/orders" as any)}
          >
            <Text style={styles.backBtnText}>View all orders</Text>
          </PressableScale>
        </View>
      </SafeAreaView>
    );
  }

  // Lookup restaurant data
  const restaurant =
    (order.restaurantId ? getRestaurant(order.restaurantId) : undefined) ??
    RESTAURANTS.find(
      (r) =>
        r.name.toLowerCase() === (order.restaurantName || "").toLowerCase()
    ) ??
    RESTAURANTS[0];

  const formattedDate = new Date(order.placedAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Navigate to restaurant page
  const openRestaurant = () => {
    fire("select");
    router.push({
      pathname: "/restaurant/[id]",
      params: {
        id: restaurant.id,
        name: restaurant.name,
        image: restaurant.image,
        rating: String(restaurant.rating),
        reviews: restaurant.reviews,
        mins: String(restaurant.mins),
        price: restaurant.price,
        cuisines: restaurant.cuisines.join("|"),
      },
    } as any);
  };

  // Navigate to restaurant page with this dish highlighted
  const openDish = (item: CartItem) => {
    fire("select");
    router.push({
      pathname: "/restaurant/[id]",
      params: {
        id: restaurant.id,
        name: restaurant.name,
        image: restaurant.image,
        rating: String(restaurant.rating),
        reviews: restaurant.reviews,
        mins: String(restaurant.mins),
        price: restaurant.price,
        cuisines: restaurant.cuisines.join("|"),
        highlightDish: item.name,
      },
    } as any);
  };

  const handleReorder = () => {
    fire("success");
    order.items.forEach((item) => {
      add({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        veg: item.veg,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
      });
    });
    router.push("/cart" as any);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      {/* Header */}
      <View style={styles.header}>
        <PressableScale haptic="light" scaleTo={0.9} onPress={goBack} style={styles.circleBtn}>
          <PackIcon name="chevron-back" size={20} color={COLORS.text} />
        </PressableScale>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.headerTitle}>Order Summary</Text>
          <Text style={styles.headerSubtitle}>#{order.id}</Text>
        </View>
        <View style={{ width: 42 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 130 + insets.bottom }]}
      >
        {/* Status card */}
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View style={styles.statusIconCircle}>
              <PackIcon name="utensils" size={22} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.statusTitle}>Preparing your food 👨‍🍳</Text>
              <Text style={styles.statusDesc}>
                The kitchen has received your order and is cooking it fresh.
              </Text>
            </View>
          </View>

          {/* Timeline steps */}
          <View style={styles.timeline}>
            <View style={styles.timelineStep}>
              <View style={[styles.timelineDot, styles.timelineDotDone]}>
                <PackIcon name="check" size={10} color="#FFFFFF" />
              </View>
              <Text style={styles.timelineTextDone}>Confirmed</Text>
            </View>
            <View style={[styles.timelineBar, styles.timelineBarDone]} />
            <View style={styles.timelineStep}>
              <View style={[styles.timelineDot, styles.timelineDotActive]}>
                <View style={styles.innerPulse} />
              </View>
              <Text style={styles.timelineTextActive}>Preparing</Text>
            </View>
            <View style={styles.timelineBar} />
            <View style={styles.timelineStep}>
              <View style={styles.timelineDot} />
              <Text style={styles.timelineText}>On the way</Text>
            </View>
            <View style={styles.timelineBar} />
            <View style={styles.timelineStep}>
              <View style={styles.timelineDot} />
              <Text style={styles.timelineText}>Delivered</Text>
            </View>
          </View>
        </View>

        {/* Clickable Restaurant Card */}
        <Text style={styles.sectionHeading}>Restaurant</Text>
        <PressableScale
          haptic="light"
          scaleTo={0.98}
          onPress={openRestaurant}
          style={styles.restaurantCard}
        >
          <Image source={{ uri: restaurant.image }} style={styles.restaurantImg} />
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={styles.restaurantName} numberOfLines={1}>
              {restaurant.name}
            </Text>
            <Text style={styles.restaurantCuisines} numberOfLines={1}>
              {restaurant.cuisines.join(" • ")}
            </Text>
            <View style={styles.restaurantMetaRow}>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>{restaurant.rating}</Text>
                <PackIcon name="star" size={10} color="#FFFFFF" />
              </View>
              <Text style={styles.restaurantDistance}>• {restaurant.distance}</Text>
            </View>
          </View>
          <View style={styles.viewRestaurantPrompt}>
            <Text style={styles.viewRestaurantText}>View</Text>
            <PackIcon name="chevron-forward" size={14} color={COLORS.primary} />
          </View>
        </PressableScale>

        {/* Clickable Dishes list */}
        <View style={styles.dishesHeaderRow}>
          <Text style={styles.sectionHeading}>Dishes Ordered ({order.items.length})</Text>
          <Text style={styles.tapTip}>Tap dish to view menu</Text>
        </View>

        <View style={styles.dishesCard}>
          {order.items.map((item, idx) => {
            const isLast = idx === order.items.length - 1;
            return (
              <PressableScale
                key={item.id || idx}
                haptic="light"
                scaleTo={0.98}
                onPress={() => openDish(item)}
                style={[styles.dishRow, !isLast && styles.dishRowBorder]}
              >
                <Image source={{ uri: item.image }} style={styles.dishImg} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <View style={styles.dishTitleRow}>
                    <VegBadge veg={item.veg} />
                    <Text style={styles.dishName} numberOfLines={1}>
                      {item.name}
                    </Text>
                  </View>
                  <Text style={styles.dishQtyPrice}>
                    {item.qty} × ₹{item.price}
                  </Text>
                </View>

                <View style={styles.dishRight}>
                  <Text style={styles.dishTotal}>₹{item.qty * item.price}</Text>
                  <View style={styles.explorePill}>
                    <Text style={styles.explorePillText}>Explore</Text>
                    <PackIcon name="chevron-right" size={10} color={COLORS.primary} />
                  </View>
                </View>
              </PressableScale>
            );
          })}
        </View>

        {/* Bill summary */}
        <Text style={styles.sectionHeading}>Bill Breakdown</Text>
        <View style={styles.billCard}>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Item Total</Text>
            <Text style={styles.billValue}>
              ₹{order.itemTotal ?? order.items.reduce((s, it) => s + it.price * it.qty, 0)}
            </Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Delivery Fee</Text>
            <Text style={styles.billValue}>₹{order.deliveryFee ?? 30}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Platform Fee</Text>
            <Text style={styles.billValue}>₹10</Text>
          </View>
          {(order.discount ?? 0) > 0 && (
            <View style={styles.billRow}>
              <Text style={[styles.billLabel, { color: COLORS.green }]}>Discount Applied</Text>
              <Text style={[styles.billValue, { color: COLORS.green }]}>-₹{order.discount}</Text>
            </View>
          )}
          <View style={styles.billDivider} />
          <View style={styles.billRow}>
            <Text style={styles.billTotalLabel}>Grand Total</Text>
            <Text style={styles.billTotalValue}>₹{order.total}</Text>
          </View>
        </View>

        {/* Order Info & Delivery Details */}
        <Text style={styles.sectionHeading}>Delivery & Payment</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoIconCircle}>
              <PackIcon name="location" size={16} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.infoLabel}>Delivery Address</Text>
              <Text style={styles.infoValue}>
                {order.address || "Jaipur, Rajasthan"}
              </Text>
            </View>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIconCircle}>
              <PackIcon name="receipt" size={16} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.infoLabel}>Payment Method</Text>
              <Text style={styles.infoValue}>
                {order.paymentMethod || "UPI"} • Paid Online
              </Text>
            </View>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIconCircle}>
              <PackIcon name="clock" size={16} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.infoLabel}>Placed On</Text>
              <Text style={styles.infoValue}>{formattedDate}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Floating Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        <PressableScale
          haptic="success"
          scaleTo={0.97}
          onPress={handleReorder}
          style={[styles.reorderMainBtn, SHADOW.lg]}
        >
          <PackIcon name="refresh" size={16} color="#FFFFFF" />
          <Text style={styles.reorderMainText}>Reorder Dishes</Text>
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
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.subtext,
    marginTop: 2,
  },
  circleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.card,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOW.sm,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  /* Status Card */
  statusCard: {
    backgroundColor: COLORS.card,
    borderRadius: 22,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FFEDE4",
    ...SHADOW.md,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
  },
  statusDesc: {
    fontSize: 12.5,
    color: COLORS.subtext,
    marginTop: 3,
    lineHeight: 18,
  },
  timeline: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  timelineStep: {
    alignItems: "center",
  },
  timelineDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#E5E5EA",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  timelineDotDone: {
    backgroundColor: COLORS.green,
  },
  timelineDotActive: {
    backgroundColor: COLORS.primarySoft,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  innerPulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  timelineBar: {
    flex: 1,
    height: 2,
    backgroundColor: "#E5E5EA",
    marginHorizontal: 4,
    marginBottom: 22,
  },
  timelineBarDone: {
    backgroundColor: COLORS.green,
  },
  timelineText: {
    fontSize: 11,
    color: COLORS.muted,
    fontWeight: "600",
  },
  timelineTextActive: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: "800",
  },
  timelineTextDone: {
    fontSize: 11,
    color: COLORS.green,
    fontWeight: "700",
  },

  /* Headings */
  sectionHeading: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  dishesHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  tapTip: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.primary,
  },

  /* Restaurant Card */
  restaurantCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 12,
    marginBottom: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
    ...SHADOW.md,
  },
  restaurantImg: {
    width: 68,
    height: 68,
    borderRadius: 16,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
  },
  restaurantCuisines: {
    fontSize: 12.5,
    color: COLORS.subtext,
    marginTop: 2,
  },
  restaurantMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.green,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 7,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#FFFFFF",
    marginRight: 2,
  },
  restaurantDistance: {
    fontSize: 12,
    color: COLORS.subtext,
    marginLeft: 6,
  },
  viewRestaurantPrompt: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  viewRestaurantText: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.primary,
    marginRight: 2,
  },

  /* Dishes List Card */
  dishesCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
    ...SHADOW.md,
  },
  dishRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  dishRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  dishImg: {
    width: 54,
    height: 54,
    borderRadius: 12,
  },
  dishTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dishName: {
    fontSize: 14.5,
    fontWeight: "800",
    color: COLORS.text,
    marginLeft: 8,
    flex: 1,
  },
  dishQtyPrice: {
    fontSize: 12.5,
    color: COLORS.subtext,
    marginTop: 4,
    marginLeft: 8,
  },
  dishRight: {
    alignItems: "flex-end",
  },
  dishTotal: {
    fontSize: 14.5,
    fontWeight: "800",
    color: COLORS.text,
  },
  explorePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 4,
  },
  explorePillText: {
    fontSize: 10.5,
    fontWeight: "700",
    color: COLORS.primary,
    marginRight: 2,
  },

  /* Bill Card */
  billCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
    ...SHADOW.md,
  },
  billRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  billLabel: {
    fontSize: 13.5,
    color: COLORS.subtext,
  },
  billValue: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
  },
  billDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.border,
    marginVertical: 6,
  },
  billTotalLabel: {
    fontSize: 16,
    fontWeight: "900",
    color: COLORS.text,
  },
  billTotalValue: {
    fontSize: 17,
    fontWeight: "900",
    color: COLORS.primary,
  },

  /* Delivery / Payment Info */
  infoCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
    ...SHADOW.md,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.subtext,
    fontWeight: "600",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: 2,
  },
  infoDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },

  /* Bottom Bar */
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.card,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOW.lg,
  },
  reorderMainBtn: {
    height: 52,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  reorderMainText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
    marginLeft: 8,
  },

  /* Empty state */
  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
    marginTop: 12,
    marginBottom: 20,
  },
  backBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});
