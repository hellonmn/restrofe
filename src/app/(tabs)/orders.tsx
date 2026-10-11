import React from "react";
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PackIcon } from "@/components/pack-icon";
import { useRouter } from "expo-router";

import { useCart } from "@/context/cart";
import { COLORS, PressableScale, SHADOW, fire } from "@/components/restro-ui";

export default function OrdersScreen() {
  const router = useRouter();
  const { orders, add } = useCart();

  const handleReorder = (orderItems: any[]) => {
    fire("success");
    orderItems.forEach((item) => {
      add({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        veg: item.veg,
      });
    });
    router.push("/cart" as any);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Orders 🛍️</Text>
          <Text style={styles.headerSub}>
            {orders.length} {orders.length === 1 ? "order" : "orders"} placed
          </Text>
        </View>

        {orders.length === 0 ? (
          <View style={styles.emptyWrap}>
            <View style={styles.emptyIconCircle}>
              <PackIcon name="receipt" size={42} color={COLORS.primary} />
            </View>
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.emptySub}>
              Explore our menu and place your first delicious order!
            </Text>
            <PressableScale
              haptic="medium"
              style={styles.browseBtn}
              onPress={() => router.push("/(tabs)" as any)}
            >
              <Text style={styles.browseBtnText}>Browse Restaurants</Text>
            </PressableScale>
          </View>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listPadding}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
            renderItem={({ item }) => {
              const formattedDate = new Date(item.placedAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <View style={styles.orderCard}>
                  <View style={styles.orderHeader}>
                    <View style={styles.orderHeaderLeft}>
                      <View style={styles.resIcon}>
                        <PackIcon name="utensils" size={18} color={COLORS.primary} />
                      </View>
                      <View>
                        <Text style={styles.orderId}>Order #{item.id}</Text>
                        <Text style={styles.orderDate}>{formattedDate}</Text>
                      </View>
                    </View>
                    <View style={styles.statusPill}>
                      <Text style={styles.statusText}>Preparing</Text>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.itemList}>
                    {item.items.map((it, idx) => (
                      <View key={idx} style={styles.itemRow}>
                        <Text style={styles.itemName}>
                          {it.qty}x {it.name}
                        </Text>
                        <Text style={styles.itemPrice}>₹{it.price * it.qty}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.orderFooter}>
                    <View>
                      <Text style={styles.totalLabel}>Total Paid</Text>
                      <Text style={styles.totalVal}>₹{item.total}</Text>
                    </View>

                    <PressableScale
                      haptic="light"
                      style={styles.reorderBtn}
                      onPress={() => handleReorder(item.items)}
                    >
                      <PackIcon name="refresh" size={14} color="#FFFFFF" />
                      <Text style={styles.reorderText}>Reorder</Text>
                    </PressableScale>
                  </View>
                </View>
              );
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bg },
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.text,
    letterSpacing: -0.8,
  },
  headerSub: {
    fontSize: 13,
    color: COLORS.subtext,
    marginTop: 4,
    fontWeight: "500",
  },
  listPadding: { padding: 20, paddingBottom: 100 },
  orderCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    ...SHADOW.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  resIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  orderId: { fontSize: 14, fontWeight: "700", color: COLORS.text },
  orderDate: { fontSize: 11, color: COLORS.subtext, marginTop: 2 },
  statusPill: {
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: { fontSize: 11, fontWeight: "700", color: COLORS.primary },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 12 },
  itemList: { gap: 6 },
  itemRow: { flexDirection: "row", justifyContent: "space-between" },
  itemName: { fontSize: 13, color: COLORS.subtext, fontWeight: "500" },
  itemPrice: { fontSize: 13, fontWeight: "700", color: COLORS.text },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: { fontSize: 11, color: COLORS.subtext },
  totalVal: { fontSize: 16, fontWeight: "800", color: COLORS.primary },
  reorderBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },
  reorderText: { color: "#FFFFFF", fontWeight: "700", fontSize: 12 },
  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: { fontSize: 18, fontWeight: "800", color: COLORS.text },
  emptySub: {
    fontSize: 13,
    color: COLORS.subtext,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
  },
  browseBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    marginTop: 20,
  },
  browseBtnText: { color: "#FFFFFF", fontWeight: "800", fontSize: 13 },
});
