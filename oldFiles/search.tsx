import React, { useMemo, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { useCart } from "@/context/cart";
import {
  COLORS,
  PressableScale,
  SHADOW,
  VegBadge,
  fire,
} from "@/components/restro-ui";

/* -------------------------------------------------------------------------- */
/*  Catalog (sample data)                                                     */
/* -------------------------------------------------------------------------- */

const IMG = {
  burger: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
  pasta: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&q=80",
  pizza: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80",
  coffee: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80",
  noodles: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80",
  salad: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
  fries: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&q=80",
  dessert: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80",
};

type Place = {
  id: string;
  name: string;
  image: string;
  mins: number;
  rating: number;
  reviews: string;
  price: string;
  cuisines: string[];
};

type Dish = {
  id: string;
  name: string;
  price: number;
  image: string;
  veg: boolean;
  tags: string[];
};

const PLACES: Place[] = [
  { id: "1", name: "The Burger House", image: IMG.burger, mins: 20, rating: 4.8, reviews: "1.2K", price: "₹200 for two", cuisines: ["Burgers", "American", "Fast Food"] },
  { id: "2", name: "The Café Spot", image: IMG.pasta, mins: 25, rating: 4.6, reviews: "856", price: "₹300 for two", cuisines: ["Café", "Italian", "Pasta"] },
  { id: "3", name: "Italian Bites", image: IMG.pizza, mins: 25, rating: 4.7, reviews: "910", price: "₹300 for two", cuisines: ["Pizza", "Italian", "Pasta"] },
  { id: "4", name: "Brew & Bites", image: IMG.coffee, mins: 15, rating: 4.5, reviews: "540", price: "₹250 for two", cuisines: ["Café", "Beverages", "Desserts"] },
  { id: "5", name: "Sweet Tooth Bakery", image: IMG.dessert, mins: 18, rating: 4.4, reviews: "275", price: "₹220 for two", cuisines: ["Desserts", "Bakery", "Café"] },
  { id: "6", name: "Healthy Hub", image: IMG.salad, mins: 22, rating: 4.6, reviews: "410", price: "₹280 for two", cuisines: ["Healthy", "Salads", "Bowls"] },
  { id: "7", name: "Dragon Wok", image: IMG.noodles, mins: 35, rating: 4.1, reviews: "320", price: "₹350 for two", cuisines: ["Chinese", "Asian", "Noodles"] },
];

// Same ids as the home screen's "Popular dishes", so the cart stays in sync
const DISHES: Dish[] = [
  { id: "d1", name: "Classic Burger", price: 149, image: IMG.burger, veg: false, tags: ["burger"] },
  { id: "d2", name: "Iced Latte", price: 149, image: IMG.coffee, veg: true, tags: ["coffee", "café", "cold"] },
  { id: "d3", name: "Margherita Pizza", price: 249, image: IMG.pizza, veg: true, tags: ["pizza"] },
  { id: "d4", name: "White Sauce Pasta", price: 199, image: IMG.pasta, veg: true, tags: ["pasta", "italian"] },
  { id: "d5", name: "Choco Pastry", price: 129, image: IMG.dessert, veg: true, tags: ["dessert", "cake", "pastry"] },
  { id: "d6", name: "Peri Peri Fries", price: 99, image: IMG.fries, veg: true, tags: ["fries", "snacks"] },
];

const TRENDING = ["Pizza", "Burger", "Cold coffee", "Pasta", "Pastry"];
const CUISINES = [
  { label: "Café", emoji: "☕" },
  { label: "Pizza", emoji: "🍕" },
  { label: "Burgers", emoji: "🍔" },
  { label: "Desserts", emoji: "🧁" },
  { label: "Chinese", emoji: "🍜" },
  { label: "Healthy", emoji: "🥗" },
];

/* -------------------------------------------------------------------------- */
/*  Screen                                                                    */
/* -------------------------------------------------------------------------- */

export default function SearchScreen() {
  const router = useRouter();
  const { items, add, inc, dec, count, total } = useCart();

  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>(["Pizza", "Cold coffee"]);

  const q = query.trim().toLowerCase();

  const placeResults = useMemo(
    () =>
      q
        ? PLACES.filter(
            (p) =>
              p.name.toLowerCase().includes(q) ||
              p.cuisines.some((c) => c.toLowerCase().includes(q))
          )
        : [],
    [q]
  );

  const dishResults = useMemo(
    () =>
      q
        ? DISHES.filter(
            (d) => d.name.toLowerCase().includes(q) || d.tags.some((t) => t.includes(q))
          )
        : [],
    [q]
  );

  const remember = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setRecent((r) => [t, ...r.filter((x) => x.toLowerCase() !== t.toLowerCase())].slice(0, 6));
  };

  const pick = (text: string) => {
    fire("select");
    setQuery(text);
    remember(text);
  };

  const openPlace = (p: Place) => {
    remember(query);
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
  };

  const hasResults = placeResults.length > 0 || dishResults.length > 0;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      <Text style={styles.title}>Search</Text>

      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color={COLORS.primary} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => remember(query)}
          placeholder="Search for food, café..."
          placeholderTextColor={COLORS.muted}
          style={styles.searchInput}
          returnKeyType="search"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <Pressable
            hitSlop={10}
            onPress={() => {
              fire("light");
              setQuery("");
            }}
          >
            <Ionicons name="close-circle" size={20} color={COLORS.muted} />
          </Pressable>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: count > 0 ? 120 : 40 }}
      >
        {/* ---------- idle: recents, trending, cuisines ---------- */}
        {!q && (
          <>
            {recent.length > 0 && (
              <>
                <View style={styles.rowBetween}>
                  <Text style={styles.sectionTitle}>Recent searches</Text>
                  <Pressable
                    hitSlop={8}
                    onPress={() => {
                      fire("light");
                      setRecent([]);
                    }}
                  >
                    <Text style={styles.clearText}>Clear</Text>
                  </Pressable>
                </View>
                <View style={styles.chipWrap}>
                  {recent.map((r) => (
                    <PressableScale
                      key={r}
                      haptic="none"
                      scaleTo={0.94}
                      onPress={() => pick(r)}
                      style={styles.chip}
                    >
                      <Ionicons name="time-outline" size={15} color={COLORS.muted} />
                      <Text style={styles.chipText}>{r}</Text>
                    </PressableScale>
                  ))}
                </View>
              </>
            )}

            <Text style={[styles.sectionTitle, { marginTop: 22 }]}>Trending now</Text>
            <View style={styles.chipWrap}>
              {TRENDING.map((t) => (
                <PressableScale
                  key={t}
                  haptic="none"
                  scaleTo={0.94}
                  onPress={() => pick(t)}
                  style={[styles.chip, styles.chipHot]}
                >
                  <Ionicons name="flame" size={15} color={COLORS.primary} />
                  <Text style={[styles.chipText, { color: COLORS.primary }]}>{t}</Text>
                </PressableScale>
              ))}
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 22 }]}>Browse by cuisine</Text>
            <View style={styles.cuisineGrid}>
              {CUISINES.map((c) => (
                <PressableScale
                  key={c.label}
                  haptic="none"
                  scaleTo={0.95}
                  onPress={() => pick(c.label)}
                  containerStyle={styles.cuisineWrap}
                  style={styles.cuisineCard}
                >
                  <Text style={{ fontSize: 28 }}>{c.emoji}</Text>
                  <Text style={styles.cuisineText}>{c.label}</Text>
                </PressableScale>
              ))}
            </View>
          </>
        )}

        {/* ---------- results ---------- */}
        {q.length > 0 && hasResults && (
          <>
            {placeResults.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>
                  Restaurants & cafés ({placeResults.length})
                </Text>
                {placeResults.map((p) => (
                  <PressableScale
                    key={p.id}
                    haptic="light"
                    scaleTo={0.98}
                    onPress={() => openPlace(p)}
                    style={styles.placeCard}
                  >
                    <Image source={{ uri: p.image }} style={styles.placeImg} />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.placeName} numberOfLines={1}>
                        {p.name}
                      </Text>
                      <Text style={styles.placeSub} numberOfLines={1}>
                        {p.cuisines.join(" • ")}
                      </Text>
                      <View style={[styles.row, { marginTop: 6 }]}>
                        <View style={styles.ratingPill}>
                          <Text style={styles.ratingPillText}>{p.rating}</Text>
                          <Ionicons name="star" size={10} color="#fff" />
                        </View>
                        <Text style={styles.placeMeta}>{p.mins} min</Text>
                        <Text style={styles.placeMeta}>• {p.price}</Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={COLORS.muted} />
                  </PressableScale>
                ))}
              </>
            )}

            {dishResults.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, { marginTop: 18 }]}>
                  Dishes ({dishResults.length})
                </Text>
                {dishResults.map((d) => {
                  const qty = items[d.id]?.qty ?? 0;
                  return (
                    <View key={d.id} style={styles.dishCard}>
                      <Image source={{ uri: d.image }} style={styles.dishImg} />
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <View style={styles.row}>
                          <VegBadge veg={d.veg} />
                          <Text style={styles.dishName} numberOfLines={1}>
                            {d.name}
                          </Text>
                        </View>
                        <Text style={styles.dishPrice}>₹{d.price}</Text>
                      </View>
                      {qty === 0 ? (
                        <PressableScale
                          haptic="none"
                          scaleTo={0.92}
                          onPress={() => {
                            fire("success");
                            add({ id: d.id, name: d.name, price: d.price, image: d.image, veg: d.veg });
                          }}
                          style={styles.addBtn}
                        >
                          <Text style={styles.addText}>ADD</Text>
                        </PressableScale>
                      ) : (
                        <View style={styles.stepper}>
                          <Pressable
                            hitSlop={8}
                            onPress={() => {
                              fire("light");
                              dec(d.id);
                            }}
                          >
                            <Ionicons name="remove" size={18} color="#fff" />
                          </Pressable>
                          <Text style={styles.stepperQty}>{qty}</Text>
                          <Pressable
                            hitSlop={8}
                            onPress={() => {
                              fire("light");
                              inc(d.id);
                            }}
                          >
                            <Ionicons name="add" size={18} color="#fff" />
                          </Pressable>
                        </View>
                      )}
                    </View>
                  );
                })}
              </>
            )}
          </>
        )}

        {/* ---------- no results ---------- */}
        {q.length > 0 && !hasResults && (
          <View style={styles.empty}>
            <Text style={{ fontSize: 48 }}>🔍</Text>
            <Text style={styles.emptyTitle}>No results for "{query.trim()}"</Text>
            <Text style={styles.emptySub}>Try a dish, a café or a cuisine like "pizza".</Text>
          </View>
        )}
      </ScrollView>

      {/* mini cart bar */}
      {count > 0 && (
        <View style={styles.miniWrap}>
          <PressableScale
            haptic="medium"
            scaleTo={0.98}
            onPress={() => router.push("/cart" as any)}
            style={[styles.mini, SHADOW.lg]}
          >
            <Text style={styles.miniText}>
              {count} {count === 1 ? "item" : "items"} • ₹{total}
            </Text>
            <View style={styles.row}>
              <Text style={styles.miniText}>View cart</Text>
              <Ionicons name="bag-handle" size={17} color="#fff" style={{ marginLeft: 8 }} />
            </View>
          </PressableScale>
        </View>
      )}
    </SafeAreaView>
  );
}

/* -------------------------------------------------------------------------- */
/*  Styles                                                                    */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  row: { flexDirection: "row", alignItems: "center" },
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },

  title: {
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.text,
    letterSpacing: -0.8,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    marginHorizontal: 20,
    marginBottom: 18,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: COLORS.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
    ...SHADOW.md,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15, color: COLORS.text },

  sectionTitle: { fontSize: 17, fontWeight: "800", color: COLORS.text, marginBottom: 12 },
  clearText: { fontSize: 13, fontWeight: "700", color: COLORS.primary, marginBottom: 12 },

  chipWrap: { flexDirection: "row", flexWrap: "wrap" },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
    marginRight: 10,
    marginBottom: 10,
    ...SHADOW.sm,
  },
  chipHot: { backgroundColor: COLORS.primarySoft, borderColor: "#FFD3BE" },
  chipText: { marginLeft: 6, fontSize: 13.5, fontWeight: "600", color: COLORS.subtext },

  cuisineGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  cuisineWrap: { width: "31%", aspectRatio: 1, marginBottom: 12 },
  cuisineCard: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
    ...SHADOW.md,
  },
  cuisineText: { marginTop: 6, fontSize: 12.5, fontWeight: "700", color: COLORS.subtext },

  placeCard: {
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
  placeImg: { width: 78, height: 78, borderRadius: 16 },
  placeName: { fontSize: 15.5, fontWeight: "800", color: COLORS.text },
  placeSub: { fontSize: 12.5, color: COLORS.subtext, marginTop: 3 },
  placeMeta: { fontSize: 12, color: COLORS.subtext, marginLeft: 8 },
  ratingPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.green,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 7,
  },
  ratingPillText: { color: "#fff", fontSize: 12, fontWeight: "800", marginRight: 3 },

  dishCard: {
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
  dishImg: { width: 62, height: 62, borderRadius: 14 },
  dishName: { flex: 1, marginLeft: 8, fontSize: 15, fontWeight: "800", color: COLORS.text },
  dishPrice: { marginTop: 6, fontSize: 14.5, fontWeight: "800", color: COLORS.text },
  addBtn: {
    width: 78,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: "#F0DCD0",
    alignItems: "center",
    justifyContent: "center",
    ...SHADOW.sm,
  },
  addText: { fontSize: 14, fontWeight: "900", color: COLORS.primary, letterSpacing: 0.5 },
  stepper: {
    width: 88,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    ...SHADOW.lg,
  },
  stepperQty: { color: "#fff", fontSize: 15, fontWeight: "900" },

  empty: { alignItems: "center", paddingTop: 50 },
  emptyTitle: { fontSize: 17, fontWeight: "800", color: COLORS.text, marginTop: 12, textAlign: "center" },
  emptySub: { fontSize: 13.5, color: COLORS.subtext, marginTop: 6, textAlign: "center" },

  miniWrap: { position: "absolute", left: 16, right: 16, bottom: 16 },
  mini: {
    height: 56,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  miniText: { color: "#fff", fontSize: 14.5, fontWeight: "800" },
});
