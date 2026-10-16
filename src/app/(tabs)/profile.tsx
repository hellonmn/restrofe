import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { useCart } from "@/context/cart";
import { COLORS, PressableScale, SHADOW, fire } from "@/components/restro-ui";

type IconName = keyof typeof Ionicons.glyphMap;

type Row = {
  icon: IconName;
  label: string;
  sub?: string;
  onPress?: () => void;
};

export default function ProfileScreen() {
  const router = useRouter();
  const { orders, favList, selectedAddress, payment, user, logout: signOut, couponCode, notifs, unreadCount, walletBalance } = useCart();

  const [notifications, setNotifications] = useState(true);
  const [vegOnly, setVegOnly] = useState(false);

  const soon = (title: string) =>
    Alert.alert(title, "This screen is coming soon.", [{ text: "OK" }]);

  const account: Row[] = [
    { icon: "wallet-outline", label: "Restrofe Wallet", sub: `Balance ₹${walletBalance}`, onPress: () => router.push("/wallet" as any) },
    { icon: "bag-handle-outline", label: "Your Orders", sub: "Track and reorder", onPress: () => router.push("/orders" as any) },
    { icon: "heart-outline", label: "Favourites", sub: "Places you saved", onPress: () => router.push("/favourites" as any) },
    { icon: "location-outline", label: "Saved Addresses", sub: selectedAddress ? `${selectedAddress.label} • ${selectedAddress.line}` : "Add an address", onPress: () => router.push("/addresses" as any) },
    { icon: "card-outline", label: "Payments", sub: `Default: ${payment.label}`, onPress: () => router.push("/payments" as any) },
    { icon: "pricetag-outline", label: "Offers & Coupons", sub: couponCode ? `${couponCode} applied` : "RESTRO60 and more", onPress: () => router.push("/offers" as any) },
  ];

  const support: Row[] = [
    { icon: "notifications-outline", label: "Notifications", sub: unreadCount > 0 ? `${unreadCount} unread` : `${notifs.length} updates`, onPress: () => router.push("/notifications" as any) },
    { icon: "help-circle-outline", label: "Help & Support", onPress: () => soon("Help & Support") },
    { icon: "shield-checkmark-outline", label: "Privacy & Security", onPress: () => soon("Privacy & Security") },
    { icon: "information-circle-outline", label: "About Restrofe", onPress: () => soon("About Restrofe") },
  ];

  const logout = () => {
    fire("medium");
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: () => {
          fire("success");
          signOut();
          router.replace("/welcome" as any);
        },
      },
    ]);
  };

  const renderRows = (rows: Row[]) =>
    rows.map((r, i) => (
      <Pressable
        key={r.label}
        onPress={() => {
          fire("light");
          r.onPress?.();
        }}
        style={({ pressed }) => [
          styles.rowItem,
          i < rows.length - 1 && styles.rowDivider,
          pressed && { backgroundColor: "#FBF3EC" },
        ]}
      >
        <View style={styles.rowIcon}>
          <Ionicons name={r.icon} size={20} color={COLORS.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.rowLabel}>{r.label}</Text>
          {r.sub ? <Text style={styles.rowSub}>{r.sub}</Text> : null}
        </View>
        <Ionicons name="chevron-forward" size={18} color={COLORS.muted} />
      </Pressable>
    ));

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
      >
        <Text style={styles.title}>Profile</Text>

        {/* Profile card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={34} color={COLORS.primary} />
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={styles.name}>Foodie</Text>
            <Text style={styles.phone}>
              {user ? `+91 ${user.phone.slice(0, 5)} ${user.phone.slice(5)}` : "Not logged in"}
            </Text>
          </View>
          <PressableScale
            haptic="light"
            scaleTo={0.92}
            onPress={() => soon("Edit profile")}
            style={styles.editBtn}
          >
            <Ionicons name="create-outline" size={18} color={COLORS.primary} />
          </PressableScale>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { label: "Orders", value: String(orders.length) },
            { label: "Favourites", value: String(favList.length) },
            { label: "Wallet", value: `₹${walletBalance}` },
          ].map((s) => (
            <View key={s.label} style={styles.statCard}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Account */}
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.group}>{renderRows(account)}</View>

        {/* Preferences */}
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.group}>
          <View style={[styles.rowItem, styles.rowDivider]}>
            <View style={styles.rowIcon}>
              <Ionicons name="notifications-outline" size={20} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowLabel}>Notifications</Text>
              <Text style={styles.rowSub}>Order updates and offers</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={(v) => {
                fire("select");
                setNotifications(v);
              }}
              trackColor={{ false: "#E4DBD2", true: "#FFB596" }}
              thumbColor={notifications ? COLORS.primary : "#FFFFFF"}
              ios_backgroundColor="#E4DBD2"
            />
          </View>
          <View style={styles.rowItem}>
            <View style={styles.rowIcon}>
              <Ionicons name="leaf-outline" size={20} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowLabel}>Veg only</Text>
              <Text style={styles.rowSub}>Show only vegetarian options</Text>
            </View>
            <Switch
              value={vegOnly}
              onValueChange={(v) => {
                fire("select");
                setVegOnly(v);
              }}
              trackColor={{ false: "#E4DBD2", true: "#FFB596" }}
              thumbColor={vegOnly ? COLORS.primary : "#FFFFFF"}
              ios_backgroundColor="#E4DBD2"
            />
          </View>
        </View>

        {/* Support */}
        <Text style={styles.sectionTitle}>More</Text>
        <View style={styles.group}>{renderRows(support)}</View>

        {/* Logout */}
        <PressableScale haptic="none" scaleTo={0.97} onPress={logout} style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.red} />
          <Text style={styles.logoutText}>Log out</Text>
        </PressableScale>

        <Text style={styles.version}>Restrofe v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },

  title: {
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.text,
    letterSpacing: -0.8,
    paddingTop: 10,
    paddingBottom: 16,
  },

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
    ...SHADOW.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFD3BE",
  },
  name: { fontSize: 20, fontWeight: "900", color: COLORS.text, letterSpacing: -0.4 },
  phone: { fontSize: 13.5, color: COLORS.subtext, marginTop: 3 },
  editBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },

  statsRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 14, marginBottom: 6 },
  statCard: {
    width: "31.5%",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: COLORS.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
    ...SHADOW.sm,
  },
  statValue: { fontSize: 20, fontWeight: "900", color: COLORS.primary },
  statLabel: { fontSize: 12, fontWeight: "600", color: COLORS.subtext, marginTop: 2 },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.muted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginTop: 22,
    marginBottom: 10,
  },
  group: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
    ...SHADOW.md,
  },
  rowItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: COLORS.card,
  },
  rowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  rowLabel: { fontSize: 15, fontWeight: "700", color: COLORS.text },
  rowSub: { fontSize: 12, color: COLORS.muted, marginTop: 2 },

  logoutBtn: {
    marginTop: 26,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#FDECEC",
    borderWidth: 1,
    borderColor: "#F8CFCF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: { marginLeft: 8, fontSize: 15.5, fontWeight: "800", color: COLORS.red },
  version: {
    textAlign: "center",
    marginTop: 18,
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: Platform.OS === "ios" ? "500" : "400",
  },
});