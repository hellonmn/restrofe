import React from "react";
import {
  Image,
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

import { FavPlace, useCart } from "@/context/cart";
import { COLORS, PressableScale, SHADOW, fire } from "@/components/restro-ui";

export default function FavouritesScreen() {
  const router = useRouter();
  const { favList, toggleFav } = useCart();

  const goBack = () => {
    fire("light");
    if (router.canGoBack()) router.back();
    else router.replace("/");
  };

  const open = (p: FavPlace) =>
    router.push({
      pathname: "/restaurant/[id]",
      params: {
        id: p.id,
        name: p.name,
        image: p.image,
        rating: String(p.rating),
        reviews: p.reviews,
        mins: String(p.mins),
        price: p.price,
        cuisines: p.cuisines.join("|"),
      },
    } as any);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      <View style={styles.header}>
        <PressableScale haptic="none" scaleTo={0.9} onPress={goBack} style={styles.circleBtn}>
          <Ionicons name="chevron-back" size={22} color={COLORS.text} />
        </PressableScale>
        <Text style={styles.headerTitle}>Favourites</Text>
        <View style={{ width: 42 }} />
      </View>

      {favList.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyCircle}>
            <Ionicons name="heart-outline" size={44} color={COLORS.primary} />
          </View>
          <Text style={styles.emptyTitle}>No favourites yet</Text>
          <Text style={styles.emptySub}>
            Tap the heart on any restaurant or café to save it here.
          </Text>
          <PressableScale
            haptic="medium"
            onPress={() => router.replace("/")}
            style={[styles.primaryBtn, SHADOW.lg]}
          >
            <Text style={styles.primaryBtnText}>Explore food</Text>
          </PressableScale>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        >
          <Text style={styles.count}>
            {favList.length} saved {favList.length === 1 ? "place" : "places"}
          </Text>

          {favList.map((p) => (
            <PressableScale
              key={p.id}
              haptic="light"
              scaleTo={0.98}
              onPress={() => open(p)}
              style={styles.card}
            >
              <Image source={{ uri: p.image }} style={styles.img} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.name} numberOfLines={1}>
                  {p.name}
                </Text>
                <Text style={styles.sub} numberOfLines={1}>
                  {p.cuisines.join(" • ")}
                </Text>
                <View style={styles.metaRow}>
                  <View style={styles.ratingPill}>
                    <Text style={styles.ratingText}>{p.rating}</Text>
                    <Ionicons name="star" size={10} color="#fff" />
                  </View>
                  <Text style={styles.meta}>{p.mins} min</Text>
                  <Text style={styles.meta}>• {p.price}</Text>
                </View>
              </View>
              <Pressable
                hitSlop={10}
                onPress={() => {
                  fire("medium");
                  toggleFav(p);
                }}
                style={styles.heart}
              >
                <Ionicons name="heart" size={20} color={COLORS.red} />
              </Pressable>
            </PressableScale>
          ))}
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

  count: { fontSize: 13.5, fontWeight: "700", color: COLORS.muted, marginBottom: 12 },

  card: {
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
  img: { width: 82, height: 82, borderRadius: 16 },
  name: { fontSize: 16, fontWeight: "800", color: COLORS.text },
  sub: { fontSize: 12.5, color: COLORS.subtext, marginTop: 3 },
  metaRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  meta: { fontSize: 12, color: COLORS.subtext, marginLeft: 8 },
  ratingPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.green,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 7,
  },
  ratingText: { color: "#fff", fontSize: 12, fontWeight: "800", marginRight: 3 },
  heart: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#FDECEC",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
  },

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
  primaryBtn: {
    marginTop: 22,
    width: 190,
    height: 50,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: { color: "#fff", fontSize: 15, fontWeight: "800" },
});
