import React from "react";
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { Notif, useCart } from "@/context/cart";
import { COLORS, PressableScale, SHADOW, fire } from "@/components/restro-ui";

type IconName = keyof typeof Ionicons.glyphMap;

const TYPE_STYLE: Record<Notif["type"], { icon: IconName; bg: string; fg: string }> = {
  order: { icon: "bag-handle", bg: COLORS.greenSoft, fg: COLORS.green },
  offer: { icon: "pricetag", bg: COLORS.primarySoft, fg: COLORS.primary },
  info: { icon: "sparkles", bg: "#EEF1FF", fg: "#5B6CF0" },
};

function timeAgo(ts: number) {
  const mins = Math.max(0, Math.floor((Date.now() - ts) / 60000));
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.floor(hrs / 24);
  return days === 1 ? "Yesterday" : `${days} days ago`;
}

export default function NotificationsScreen() {
  const router = useRouter();
  const { notifs, unreadCount, markAllRead, markRead } = useCart();

  const goBack = () => {
    fire("light");
    if (router.canGoBack()) router.back();
    else router.replace("/");
  };

  const open = (n: Notif) => {
    markRead(n.id);
    if (n.type === "order") router.push("/orders" as any);
    else if (n.type === "offer") router.push("/offers" as any);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      <View style={styles.header}>
        <PressableScale haptic="none" scaleTo={0.9} onPress={goBack} style={styles.circleBtn}>
          <Ionicons name="chevron-back" size={22} color={COLORS.text} />
        </PressableScale>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 42 }} />
      </View>

      {notifs.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyCircle}>
            <Ionicons name="notifications-off-outline" size={42} color={COLORS.primary} />
          </View>
          <Text style={styles.emptyTitle}>You're all caught up</Text>
          <Text style={styles.emptySub}>New offers and order updates will show up here.</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        >
          <View style={styles.topRow}>
            <Text style={styles.count}>
              {unreadCount > 0 ? `${unreadCount} unread` : "All read"}
            </Text>
            {unreadCount > 0 && (
              <Pressable
                hitSlop={10}
                onPress={() => {
                  fire("success");
                  markAllRead();
                }}
              >
                <Text style={styles.markAll}>Mark all as read</Text>
              </Pressable>
            )}
          </View>

          {notifs.map((n) => {
            const t = TYPE_STYLE[n.type];
            return (
              <PressableScale
                key={n.id}
                haptic="light"
                scaleTo={0.98}
                onPress={() => open(n)}
                style={[styles.card, !n.read && styles.cardUnread]}
              >
                <View style={[styles.iconBox, { backgroundColor: t.bg }]}>
                  <Ionicons name={t.icon} size={21} color={t.fg} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.titleRow}>
                    <Text
                      style={[styles.title, !n.read && styles.titleUnread]}
                      numberOfLines={1}
                    >
                      {n.title}
                    </Text>
                    {!n.read && <View style={styles.dot} />}
                  </View>
                  <Text style={styles.body} numberOfLines={2}>
                    {n.body}
                  </Text>
                  <Text style={styles.time}>{timeAgo(n.at)}</Text>
                </View>
              </PressableScale>
            );
          })}
        </ScrollView>
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

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  count: { fontSize: 13.5, fontWeight: "700", color: COLORS.muted },
  markAll: { fontSize: 13.5, fontWeight: "800", color: COLORS.primary },

  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
    ...SHADOW.sm,
  },
  cardUnread: { backgroundColor: "#FFFBF8", borderColor: "#FFD9C6", ...SHADOW.md },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  titleRow: { flexDirection: "row", alignItems: "center" },
  title: { flex: 1, fontSize: 15, fontWeight: "600", color: COLORS.text },
  titleUnread: { fontWeight: "800" },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
    marginLeft: 8,
  },
  body: { fontSize: 13, color: COLORS.subtext, marginTop: 4, lineHeight: 18 },
  time: { fontSize: 11.5, color: COLORS.muted, marginTop: 6, fontWeight: "600" },

  empty: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 36, paddingBottom: 60 },
  emptyCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: { fontSize: 20, fontWeight: "800", color: COLORS.text, marginTop: 18 },
  emptySub: { fontSize: 14, color: COLORS.subtext, marginTop: 8, textAlign: "center", lineHeight: 20 },
});
