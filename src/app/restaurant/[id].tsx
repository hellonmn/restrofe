import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Image,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StatusBar,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { useCart } from "@/context/cart";
import { useRestaurant } from "@/context/restaurant";
import { IMG, REVIEWS, type MenuItem } from "@/constants/catalog";

/* -------------------------------------------------------------------------- */
/*  Theme + haptics (same as home screen)                                     */
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
  red: "#E23744",
  star: "#FFB400",
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
/*  Menu data (picked by the restaurant's first cuisine)                      */
/* -------------------------------------------------------------------------- */

const TAB_LIST = ["Menu", "Reviews", "About"] as const;
type TabKey = (typeof TAB_LIST)[number];

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

const first = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v ?? "");

/* -------------------------------------------------------------------------- */
/*  Screen                                                                    */
/* -------------------------------------------------------------------------- */

export default function RestaurantDetail() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const { restaurants, menus: dynamicMenus } = useRestaurant();

  const restId = first(params.id) || "r";
  const known = restaurants.find((r) => r.id === restId);
  const name = first(params.name) || known?.name || "Italian Bites";
  const image = first(params.image) || known?.image || IMG.pizza;
  const rating = Number(first(params.rating) || known?.rating || 4.7);
  const reviews = first(params.reviews) || known?.reviews || "856";
  const mins = first(params.mins) || String(known?.mins ?? 25);
  const price = first(params.price) || known?.price || "₹200 for two";
  const cuisinesStr = first(params.cuisines) || known?.cuisines.join("|") || "Italian|Pizza|Pasta";
  const cuisines = useMemo(() => cuisinesStr.split("|").filter(Boolean), [cuisinesStr]);

  const menu = useMemo(() => {
    const key = cuisines.find((c) => dynamicMenus[c]) ?? "Pizza";
    return dynamicMenus[key] || [];
  }, [cuisines, dynamicMenus]);

  const [tab, setTab] = useState<TabKey>("Menu");
  const {
    items: cartItems,
    count: cartCount,
    total: cartTotal,
    add: cartAdd,
    inc: cartInc,
    dec: cartDec,
    favs,
    toggleFav,
  } = useCart();
  const liked = !!favs[restId];

  const add = (m: MenuItem) => {
    fire("success");
    cartAdd({
      id: `${restId}-${m.id}`,
      name: m.name,
      price: m.price,
      image: m.image,
      veg: m.veg,
    });
  };
  const inc = (cid: string) => {
    fire("light");
    cartInc(cid);
  };
  const dec = (cid: string) => {
    fire("light");
    cartDec(cid);
  };

  /* cart bar slide-in */
  const cartAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(cartAnim, {
      toValue: cartCount > 0 ? 1 : 0,
      useNativeDriver: true,
      bounciness: 8,
      speed: 14,
    }).start();
  }, [cartCount, cartAnim]);

  const goBack = () => {
    fire("light");
    if (router.canGoBack()) router.back();
    else router.replace("/");
  };

  const onShare = () => {
    fire("light");
    Share.share({ message: `Check out ${name} on Restrofe 🍽️` }).catch(() => {});
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        {/* Hero */}
        <View>
          <Image source={{ uri: image }} style={styles.hero} />
          <LinearGradient
            colors={["rgba(0,0,0,0.45)", "transparent"]}
            style={styles.heroTopShade}
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.35)"]}
            style={styles.heroBottomShade}
          />

          <View style={[styles.heroActions, { top: insets.top + 8 }]}>
            <PressableScale haptic="none" scaleTo={0.9} onPress={goBack} style={styles.circleBtn}>
              <Ionicons name="chevron-back" size={22} color={COLORS.text} />
            </PressableScale>
            <View style={styles.row}>
              <PressableScale
                haptic="none"
                scaleTo={0.9}
                onPress={() => {
                  fire(liked ? "light" : "medium");
                  toggleFav({
                    id: restId,
                    name,
                    image,
                    rating,
                    reviews,
                    mins: Number(mins),
                    price,
                    cuisines,
                  });
                }}
                style={styles.circleBtn}
              >
                <Ionicons
                  name={liked ? "heart" : "heart-outline"}
                  size={21}
                  color={liked ? COLORS.red : COLORS.text}
                />
              </PressableScale>
              <PressableScale
                haptic="none"
                scaleTo={0.9}
                onPress={onShare}
                style={[styles.circleBtn, { marginLeft: 10 }]}
              >
                <Ionicons name="share-outline" size={21} color={COLORS.text} />
              </PressableScale>
            </View>
          </View>

          <View style={styles.timePill}>
            <Ionicons name="time-outline" size={14} color={COLORS.text} />
            <Text style={styles.timeText}>{mins} min</Text>
          </View>
        </View>

        {/* Info sheet */}
        <View style={styles.sheet}>
          <Text style={styles.name}>{name}</Text>

          <View style={[styles.row, { marginTop: 6 }]}>
            <Ionicons name="star" size={16} color={COLORS.star} />
            <Text style={styles.ratingValue}>{rating}</Text>
            <Text style={styles.ratingCount}>({reviews} reviews)</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 14 }}
          >
            {[...cuisines.slice(0, 3), price].map((t) => (
              <View key={t} style={styles.tag}>
                <Text style={styles.tagText}>{t}</Text>
              </View>
            ))}
          </ScrollView>

          {/* Tabs */}
          <View style={styles.tabsRow}>
            {TAB_LIST.map((t) => {
              const active = tab === t;
              return (
                <Pressable
                  key={t}
                  style={styles.tabBtn}
                  onPress={() => {
                    fire("select");
                    setTab(t);
                  }}
                >
                  <Text style={[styles.tabText, active && styles.tabTextActive]}>{t}</Text>
                  <View style={[styles.tabLine, active && styles.tabLineActive]} />
                </Pressable>
              );
            })}
          </View>

          {/* Menu */}
          {tab === "Menu" && (
            <View style={{ paddingTop: 18 }}>
              <Text style={styles.sectionTitle}>Popular Items</Text>
              {menu.map((m) => {
                const cid = `${restId}-${m.id}`;
                const qty = cartItems[cid]?.qty ?? 0;
                return (
                  <View key={m.id} style={styles.menuCard}>
                    <Image source={{ uri: m.image }} style={styles.menuImg} />
                    <View style={styles.menuBody}>
                      <View style={styles.row}>
                        <VegBadge veg={m.veg} />
                        <Text style={styles.menuName} numberOfLines={1}>
                          {m.name}
                        </Text>
                      </View>
                      <Text style={styles.menuDesc} numberOfLines={2}>
                        {m.desc}
                      </Text>
                      <View style={styles.menuBottom}>
                        <Text style={styles.menuPrice}>₹{m.price}</Text>
                        {qty === 0 ? (
                          <PressableScale
                            haptic="none"
                            scaleTo={0.92}
                            onPress={() => add(m)}
                            style={styles.addBtn}
                          >
                            <Text style={styles.addText}>Add</Text>
                          </PressableScale>
                        ) : (
                          <View style={styles.stepper}>
                            <Pressable onPress={() => dec(cid)} hitSlop={8}>
                              <Ionicons name="remove" size={18} color="#fff" />
                            </Pressable>
                            <Text style={styles.stepperQty}>{qty}</Text>
                            <Pressable onPress={() => inc(cid)} hitSlop={8}>
                              <Ionicons name="add" size={18} color="#fff" />
                            </Pressable>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {/* Reviews */}
          {tab === "Reviews" && (
            <View style={{ paddingTop: 18 }}>
              <View style={styles.reviewSummary}>
                <Text style={styles.reviewBig}>{rating}</Text>
                <View style={{ marginLeft: 14 }}>
                  <View style={styles.row}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Ionicons
                        key={i}
                        name={i <= Math.round(rating) ? "star" : "star-outline"}
                        size={16}
                        color={COLORS.star}
                      />
                    ))}
                  </View>
                  <Text style={styles.ratingCount}>Based on {reviews} reviews</Text>
                </View>
              </View>

              {REVIEWS.map((r) => (
                <View key={r.id} style={styles.reviewCard}>
                  <View style={styles.rowBetween}>
                    <View style={styles.row}>
                      <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{r.name[0]}</Text>
                      </View>
                      <View style={{ marginLeft: 10 }}>
                        <Text style={styles.reviewName}>{r.name}</Text>
                        <Text style={styles.reviewWhen}>{r.when}</Text>
                      </View>
                    </View>
                    <View style={styles.ratingPill}>
                      <Text style={styles.ratingPillText}>{r.rating}</Text>
                      <Ionicons name="star" size={11} color="#fff" />
                    </View>
                  </View>
                  <Text style={styles.reviewText}>{r.text}</Text>
                </View>
              ))}
            </View>
          )}

          {/* About */}
          {tab === "About" && (
            <View style={{ paddingTop: 18 }}>
              {[
                { icon: "location-outline", label: "Address", value: "Jaipur, Rajasthan" },
                { icon: "time-outline", label: "Open hours", value: "11:00 AM – 11:30 PM" },
                { icon: "restaurant-outline", label: "Cuisines", value: cuisines.join(", ") },
                { icon: "cash-outline", label: "Cost", value: price },
              ].map((row) => (
                <View key={row.label} style={styles.aboutRow}>
                  <View style={styles.aboutIcon}>
                    <Ionicons name={row.icon as any} size={20} color={COLORS.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.aboutLabel}>{row.label}</Text>
                    <Text style={styles.aboutValue}>{row.value}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating cart bar */}
      <Animated.View
        pointerEvents={cartCount > 0 ? "auto" : "none"}
        style={[
          styles.cartBarWrap,
          {
            bottom: Math.max(insets.bottom, 12) + 4,
            opacity: cartAnim,
            transform: [
              {
                translateY: cartAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [90, 0],
                }),
              },
            ],
          },
        ]}
      >
        <PressableScale
          haptic="medium"
          scaleTo={0.98}
          style={[styles.cartBar, SHADOW.lg]}
          onPress={() => router.push("/cart" as any)}
        >
          <View>
            <Text style={styles.cartCount}>
              {cartCount} {cartCount === 1 ? "item" : "items"} added
            </Text>
            <Text style={styles.cartTotal}>₹{cartTotal} + taxes</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cartCta}>View cart</Text>
            <Ionicons name="bag-handle" size={18} color="#fff" style={{ marginLeft: 8 }} />
          </View>
        </PressableScale>
      </Animated.View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*  Styles                                                                    */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  row: { flexDirection: "row", alignItems: "center" },
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },

  /* hero */
  hero: { width: "100%", height: 300 },
  heroTopShade: { position: "absolute", top: 0, left: 0, right: 0, height: 120 },
  heroBottomShade: { position: "absolute", bottom: 0, left: 0, right: 0, height: 90 },
  heroActions: {
    position: "absolute",
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  circleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.96)",
    alignItems: "center",
    justifyContent: "center",
    ...SHADOW.sm,
  },
  timePill: {
    position: "absolute",
    right: 16,
    bottom: 44,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    ...SHADOW.sm,
  },
  timeText: { marginLeft: 5, fontSize: 13, fontWeight: "800", color: COLORS.text },

  /* sheet */
  sheet: {
    marginTop: -28,
    backgroundColor: COLORS.bg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 22,
  },
  name: { fontSize: 26, fontWeight: "900", color: COLORS.text, letterSpacing: -0.6 },
  ratingValue: { marginLeft: 5, fontSize: 15, fontWeight: "800", color: COLORS.text },
  ratingCount: { marginLeft: 6, fontSize: 13, color: COLORS.subtext },
  tag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: COLORS.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
    marginRight: 10,
    ...SHADOW.sm,
  },
  tagText: { fontSize: 13, fontWeight: "600", color: COLORS.subtext },

  /* tabs */
  tabsRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tabBtn: { flex: 1, alignItems: "center", paddingTop: 10 },
  tabText: { fontSize: 15, fontWeight: "600", color: COLORS.muted, paddingBottom: 10 },
  tabTextActive: { color: COLORS.primary, fontWeight: "800" },
  tabLine: { height: 3, width: "100%", borderRadius: 3, backgroundColor: "transparent" },
  tabLineActive: { backgroundColor: COLORS.primary },

  /* menu */
  sectionTitle: { fontSize: 19, fontWeight: "800", color: COLORS.text, marginBottom: 14 },
  menuCard: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 10,
    marginBottom: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
    ...SHADOW.md,
  },
  menuImg: { width: 96, height: 96, borderRadius: 16 },
  menuBody: { flex: 1, marginLeft: 12, justifyContent: "space-between" },
  menuName: { flex: 1, marginLeft: 8, fontSize: 15.5, fontWeight: "800", color: COLORS.text },
  menuDesc: { fontSize: 12.5, color: COLORS.subtext, marginTop: 4, lineHeight: 17 },
  menuBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  menuPrice: { fontSize: 16, fontWeight: "800", color: COLORS.text },
  addBtn: {
    minWidth: 78,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOW.lg,
  },
  addText: { color: "#fff", fontSize: 14, fontWeight: "800" },
  stepper: {
    width: 92,
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
  vegBox: {
    width: 16,
    height: 16,
    borderWidth: 1.5,
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  vegDot: { width: 8, height: 8, borderRadius: 4 },

  /* reviews */
  reviewSummary: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
    ...SHADOW.md,
  },
  reviewBig: { fontSize: 40, fontWeight: "900", color: COLORS.text, letterSpacing: -1 },
  reviewCard: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
    ...SHADOW.sm,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontWeight: "800", color: COLORS.primary },
  reviewName: { fontSize: 14, fontWeight: "700", color: COLORS.text },
  reviewWhen: { fontSize: 11.5, color: COLORS.muted, marginTop: 1 },
  reviewText: { marginTop: 10, fontSize: 13.5, color: COLORS.subtext, lineHeight: 19 },
  ratingPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.green,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  ratingPillText: { color: "#fff", fontSize: 12.5, fontWeight: "800", marginRight: 3 },

  /* about */
  aboutRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
    ...SHADOW.sm,
  },
  aboutIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  aboutLabel: { fontSize: 12, color: COLORS.muted, fontWeight: "600" },
  aboutValue: { fontSize: 14.5, color: COLORS.text, fontWeight: "700", marginTop: 2 },

  /* cart bar */
  cartBarWrap: { position: "absolute", left: 16, right: 16 },
  cartBar: {
    height: 62,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cartCount: { color: "#fff", fontSize: 14.5, fontWeight: "800" },
  cartTotal: { color: "rgba(255,255,255,0.85)", fontSize: 12, marginTop: 1 },
  cartCta: { color: "#fff", fontSize: 15, fontWeight: "800" },
});