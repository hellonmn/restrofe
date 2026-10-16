import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Image,
  ImageSourcePropType,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { PackIcon } from "@/components/pack-icon";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCart } from "@/context/cart";
import { DISHES, RESTAURANTS, getRestaurant, type Dish, type Restaurant } from "@/constants/catalog";
import * as Haptics from "expo-haptics";

/* -------------------------------------------------------------------------- */
/*  Config                                                                    */
/* -------------------------------------------------------------------------- */

// Turn on only if your _layout.tsx does NOT already render a bottom tab bar
const SHOW_CUSTOM_TAB_BAR = false;

type IconName = string;
type HapticKind = "light" | "medium" | "select" | "success" | "none";

const COLORS = {
  bg: "#F6F4F2",
  card: "#FFFFFF",
  primary: "#FF5A1F",
  primarySoft: "#FFEDE4",
  text: "#1C1C1E",
  subtext: "#5C5C66",
  muted: "#9A9AA3",
  border: "#ECE7E2",
  green: "#1BA672",
  red: "#E23744",
  star: "#FFB400",
};

/* Layered, cross-platform shadows */
const SHADOW = {
  // very light – chips, small buttons
  sm: Platform.select<ViewStyle>({
    ios: {
      shadowColor: "#000",
      shadowOpacity: 0.04,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
    },
    default: { elevation: 1.5, shadowColor: "#D8CCC2" },
  }) as ViewStyle,
  // soft & wide – cards, search, categories
  md: Platform.select<ViewStyle>({
    ios: {
      shadowColor: "#000",
      shadowOpacity: 0.07,
      shadowRadius: 22,
      shadowOffset: { width: 0, height: 8 },
    },
    default: { elevation: 3, shadowColor: "#CDBBAA" },
  }) as ViewStyle,
  // soft orange glow – cart bar, stepper, primary buttons
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

/* -------------------------------------------------------------------------- */
/*  Haptics                                                                   */
/* -------------------------------------------------------------------------- */

const fire = (kind: HapticKind) => {
  if (Platform.OS === "web") return;
  switch (kind) {
    case "light":
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      break;
    case "medium":
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      break;
    case "select":
      Haptics.selectionAsync();
      break;
    case "success":
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      break;
  }
};

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/* -------------------------------------------------------------------------- */

type Category = {
  id: string;
  label: string;
  image?: ImageSourcePropType;
  emoji?: string;
  icon?: IconName;
};
const CATEGORIES: Category[] = [
  { id: "Café", label: "Café", emoji: "☕" },
  { id: "Pizza", label: "Pizza", image: require("../../../assets/images/categories/pizza.png") },
  { id: "Burgers", label: "Burgers", image: require("../../../assets/images/categories/burger.png") },
  { id: "Desserts", label: "Desserts", emoji: "🧁" },
  { id: "Chinese", label: "Chinese", emoji: "🍜" },
  { id: "Healthy", label: "Healthy", emoji: "🥗" },
];

const BANNERS = [
  {
    id: "1",
    title: "60% OFF",
    sub: "up to ₹120 on your first order",
    code: "USE RESTRO60",
    colors: ["#FF5A1F", "#FF9A44"] as const,
    glow: "#FF7A3D",
    emoji: "🍔",
  },
  {
    id: "2",
    title: "Café Fridays",
    sub: "Buy 1 get 1 on all cold coffees",
    code: "USE BREWBOGO",
    colors: ["#6B4A3A", "#B98A6A"] as const,
    glow: "#B98A6A",
    emoji: "☕",
  },
  {
    id: "3",
    title: "Flat ₹75 OFF",
    sub: "on pizzas & pastas tonight",
    code: "USE ITALIAN75",
    colors: ["#118A5E", "#4CCB9A"] as const,
    glow: "#2FBF8A",
    emoji: "🍕",
  },
];

// soft halo layers drawn behind each banner (ambient light)
const GLOW_LAYERS = [
  { inset: 18, opacity: 0.045 },
  { inset: 13, opacity: 0.06 },
  { inset: 8, opacity: 0.08 },
  { inset: 4, opacity: 0.1 },
];

const FILTERS: { id: string; label: string; icon?: IconName }[] = [
  { id: "veg", label: "Pure Veg", icon: "leaf-outline" },
  { id: "rating", label: "Rating 4.5+", icon: "star-outline" },
  { id: "fast", label: "Fast delivery", icon: "flash-outline" },
  { id: "offers", label: "Offers", icon: "pricetag-outline" },
];

const TABS: { key: string; icon: IconName; active: IconName }[] = [
  { key: "Home", icon: "home-outline", active: "home" },
  { key: "Search", icon: "search-outline", active: "search" },
  { key: "Orders", icon: "bag-handle-outline", active: "bag-handle" },
  { key: "Profile", icon: "person-outline", active: "person" },
];

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

function AmbientGlow({ color }: { color: string }) {
  return (
    <>
      {GLOW_LAYERS.map((l, i) => (
        <View
          key={i}
          pointerEvents="none"
          style={{
            position: "absolute",
            top: -l.inset + 10,
            left: -l.inset,
            right: -l.inset,
            bottom: -l.inset - 10,
            borderRadius: 22 + l.inset,
            backgroundColor: color,
            opacity: l.opacity,
          }}
        />
      ))}
    </>
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

function SectionTitle({
  title,
  action,
  style,
}: {
  title: string;
  action?: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.sectionHeader, style]}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? (
        <PressableScale haptic="select" scaleTo={0.92} style={styles.seeAll}>
          <Text style={styles.seeAllText}>{action}</Text>
          <PackIcon name="chevron-forward" size={14} color={COLORS.primary} />
        </PressableScale>
      ) : null}
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*  Screen                                                                    */
/* -------------------------------------------------------------------------- */

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width } = useWindowDimensions();

  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("Home");
  const [bannerIndex, setBannerIndex] = useState(0);
  /* ---- cart (shared across screens) ---- */
  const {
    items: cartItems,
    count: cartCount,
    total: cartTotal,
    add: cartAdd,
    inc: cartInc,
    dec: cartDec,
    favs,
    toggleFav,
    selectedAddress,
    unreadCount,
    tabBarVisible,
    onScrollHideTabBar,
  } = useCart();

  const openDish = (d: Dish) => {
    fire("select");
    const r = getRestaurant(d.restaurantId);
    if (!r) return;
    router.push({
      pathname: "/restaurant/[id]",
      params: {
        id: r.id,
        name: r.name,
        image: r.image,
        rating: String(r.rating),
        reviews: r.reviews,
        mins: String(r.mins),
        price: r.price,
        cuisines: r.cuisines.join("|"),
        highlightDish: d.name,
      },
    } as any);
  };

  /* ---- cart bar slide-in & position sync ---- */
  const cartAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(cartAnim, {
      toValue: cartCount > 0 ? 1 : 0,
      useNativeDriver: true,
      bounciness: 8,
      speed: 14,
    }).start();
  }, [cartCount, cartAnim]);

  const cartShiftY = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(cartShiftY, {
      toValue: tabBarVisible ? 0 : 56,
      useNativeDriver: true,
      bounciness: 4,
      speed: 16,
    }).start();
  }, [tabBarVisible, cartShiftY]);

  /* ---- filters ---- */
  const toggleFilter = (id: string) => {
    fire("select");
    setActiveFilters((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  };

  const visibleRestaurants = useMemo(
    () =>
      RESTAURANTS.filter((r) => {
        if (activeCat && !r.cuisines.includes(activeCat)) return false;
        if (activeFilters.includes("veg") && !r.veg) return false;
        if (activeFilters.includes("rating") && r.rating < 4.5) return false;
        if (activeFilters.includes("fast") && r.mins > 25) return false;
        if (activeFilters.includes("offers") && !r.offer) return false;
        return true;
      }),
    [activeCat, activeFilters]
  );

  /* ---- banner scroll ---- */
  const BANNER_W = width - 40;
  const BANNER_GAP = 14;
  const onBannerEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / (BANNER_W + BANNER_GAP));
    if (i !== bannerIndex) {
      fire("select");
      setBannerIndex(i);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
        contentContainerStyle={{ paddingBottom: 140 }}
        onScroll={onScrollHideTabBar}
        scrollEventThrottle={16}
      >
        {/* 0 — Header */}
        <View style={styles.header}>
          <PressableScale
            haptic="select"
            scaleTo={0.97}
            style={styles.locationBlock}
            onPress={() => router.push("/addresses" as any)}
          >
            <View style={styles.pinCircle}>
              <PackIcon name="marker" size={18} color={COLORS.primary} />
            </View>
            <View>
              <View style={styles.row}>
                <Text style={styles.locationTitle}>{selectedAddress?.label ?? "Add address"}</Text>
                <PackIcon name="chevron-down" size={16} color={COLORS.text} />
              </View>
              <Text style={styles.locationSub} numberOfLines={1}>
                {selectedAddress?.line ?? "Tap to set your delivery location"}
              </Text>
            </View>
          </PressableScale>

          <View style={styles.row}>
            <PressableScale
              haptic="light"
              scaleTo={0.9}
              style={styles.iconBtn}
              onPress={() => router.push("/notifications" as any)}
            >
              <PackIcon name="bell" size={22} color={COLORS.text} />
              {unreadCount > 0 && <View style={styles.bellDot} />}
            </PressableScale>
            <PressableScale
              haptic="light"
              scaleTo={0.9}
              style={[styles.iconBtn, { marginLeft: 10 }]}
              onPress={() => router.push("/profile" as any)}
            >
              <PackIcon name="user" size={21} color={COLORS.text} />
            </PressableScale>
          </View>
        </View>

        {/* 1 — Sticky search */}
        <View style={styles.searchWrap}>
          <View style={styles.searchBox}>
            <PackIcon name="search" size={20} color={COLORS.primary} />
            <TextInput
              placeholder="Search for food, café..."
              placeholderTextColor={COLORS.muted}
              style={styles.searchInput}
              returnKeyType="search"
            />
            <View style={styles.searchDivider} />
            <Pressable onPress={() => fire("light")} hitSlop={10}>
              <PackIcon name="mic" size={21} color={COLORS.primary} />
            </Pressable>
          </View>
        </View>

        {/* 2 — Offer banners with ambient glow */}
        <FlatList
          data={BANNERS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(i) => i.id}
          snapToInterval={BANNER_W + BANNER_GAP}
          decelerationRate="fast"
          onMomentumScrollEnd={onBannerEnd}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 32 }}
          ItemSeparatorComponent={() => <View style={{ width: BANNER_GAP }} />}
          renderItem={({ item }) => (
            <View style={{ width: BANNER_W }}>
              <AmbientGlow color={item.glow} />
              <PressableScale haptic="light" scaleTo={0.98}>
                <LinearGradient
                  colors={item.colors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.banner}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.bannerTitle}>{item.title}</Text>
                    <Text style={styles.bannerSub}>{item.sub}</Text>
                    <View style={styles.bannerCode}>
                      <Text style={styles.bannerCodeText}>{item.code}</Text>
                    </View>
                  </View>
                  <Text style={styles.bannerEmoji}>{item.emoji}</Text>
                </LinearGradient>
              </PressableScale>
            </View>
          )}
        />
        <View style={styles.dots}>
          {BANNERS.map((b, i) => (
            <View
              key={b.id}
              style={[styles.dot, i === bannerIndex && styles.dotActive]}
            />
          ))}
        </View>

        {/* 3 — Categories */}
        <SectionTitle title="What's on your mind?" />
        <FlatList
          data={CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(i) => i.id}
          contentContainerStyle={styles.catList}
          renderItem={({ item }) => {
            const active = item.id === activeCat;
            return (
              <PressableScale
                haptic="select"
                scaleTo={0.92}
                style={styles.catItem}
                onPress={() => {
                  if (item.id === "more") return;
                  setActiveCat(active ? null : item.id);
                }}
              >
                <View style={[styles.catCircle, active && styles.catCircleActive]}>
                  {item.image ? (
                    <Image source={item.image} style={styles.catImg} resizeMode="contain" />
                  ) : item.emoji ? (
                    <Text style={{ fontSize: 30 }}>{item.emoji}</Text>
                  ) : (
                    <PackIcon name={item.icon!} size={26} color={COLORS.subtext} />
                  )}
                </View>
                <Text style={[styles.catLabel, active && styles.catLabelActive]}>
                  {item.label}
                </Text>
              </PressableScale>
            );
          }}
        />

        {/* 4 — Signature dishes */}
        <SectionTitle title="Signature dishes" action="See all" style={{ marginTop: 6 }} />
        <FlatList
          data={DISHES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 22 }}
          ItemSeparatorComponent={() => <View style={{ width: 14 }} />}
          renderItem={({ item }) => {
            return (
              <PressableScale
                haptic="select"
                scaleTo={0.96}
                style={styles.dishCard}
                onPress={() => openDish(item)}
              >
                <View style={styles.dishImgWrap}>
                  <Image source={{ uri: item.image }} style={styles.dishImg} />
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.55)"]}
                    style={styles.dishShade}
                  />

                  {/* Rating badge */}
                  <View style={styles.dishRatingBadge}>
                    <Text style={styles.dishRatingText}>{item.rating}</Text>
                    <PackIcon name="star" size={10} color="#fff" />
                  </View>

                  {/* Price pill */}
                  <View style={styles.dishPricePill}>
                    <Text style={styles.dishPricePillText}>₹{item.price}</Text>
                  </View>
                </View>

                <View style={styles.dishInfo}>
                  <View style={styles.dishTitleRow}>
                    <VegBadge veg={item.veg} />
                    <Text style={styles.dishName} numberOfLines={1}>
                      {item.name}
                    </Text>
                  </View>

                  {/* Restaurant name */}
                  <View style={styles.dishRestRow}>
                    <PackIcon name="utensils" size={11} color={COLORS.primary} />
                    <Text style={styles.dishRestName} numberOfLines={1}>
                      {item.restaurantName}
                    </Text>
                  </View>

                  {/* Explore & order CTA */}
                  <View style={styles.exploreAction}>
                    <Text style={styles.exploreActionText}>Explore & order</Text>
                    <PackIcon name="chevron-right" size={10} color={COLORS.primary} />
                  </View>
                </View>
              </PressableScale>
            );
          }}
        />

        {/* 5 — Filters */}
        <SectionTitle
          title={`${visibleRestaurants.length} cafés & restaurants near you`}
          style={{ marginBottom: 10 }}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {FILTERS.map((f) => {
            const on = activeFilters.includes(f.id);
            return (
              <PressableScale
                key={f.id}
                haptic="none"
                scaleTo={0.94}
                onPress={() => toggleFilter(f.id)}
                style={[styles.chip, on && styles.chipOn]}
              >
                {f.icon ? (
                  <PackIcon
                    name={f.icon}
                    size={15}
                    color={on ? COLORS.primary : COLORS.subtext}
                    style={{ marginRight: 5 }}
                  />
                ) : null}
                <Text style={[styles.chipText, on && styles.chipTextOn]}>{f.label}</Text>
                {on ? (
                  <PackIcon
                    name="cross"
                    size={14}
                    color={COLORS.primary}
                    style={{ marginLeft: 5 }}
                  />
                ) : null}
              </PressableScale>
            );
          })}
        </ScrollView>

        {/* 6 — Restaurants */}
        <View style={{ paddingHorizontal: 20, paddingTop: 6 }}>
          {visibleRestaurants.map((r) => {
            const liked = !!favs[r.id];
            return (
              <PressableScale
                key={r.id}
                haptic="light"
                scaleTo={0.985}
                style={styles.restCard}
                onPress={() =>
                  router.push({
                    pathname: "/restaurant/[id]",
                    params: {
                      id: r.id,
                      name: r.name,
                      image: r.image,
                      rating: String(r.rating),
                      reviews: r.reviews,
                      mins: String(r.mins),
                      price: r.price,
                      cuisines: r.cuisines.join("|"),
                    },
                  } as any)
                }
              >
                <View>
                  <Image source={{ uri: r.image }} style={styles.restImg} />
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.72)"]}
                    style={styles.restShade}
                  />
                  {r.offer ? (
                    <View style={styles.offerWrap}>
                      <PackIcon name="ticket" size={14} color="#fff" />
                      <Text style={styles.offerText}>{r.offer}</Text>
                    </View>
                  ) : null}

                  <Pressable
                    style={styles.heartBtn}
                    hitSlop={8}
                    onPress={() => {
                      fire(liked ? "light" : "medium");
                      toggleFav({
                        id: r.id,
                        name: r.name,
                        image: r.image,
                        rating: r.rating,
                        reviews: r.reviews,
                        mins: r.mins,
                        price: r.price,
                        cuisines: r.cuisines,
                      });
                    }}
                  >
                    <PackIcon
                      name="heart"
                      size={20}
                      color={liked ? COLORS.red : COLORS.text}
                    />
                  </Pressable>

                  <View style={styles.timePill}>
                    <PackIcon name="clock" size={13} color={COLORS.text} />
                    <Text style={styles.timeText}>{r.mins} min</Text>
                  </View>
                </View>

                <View style={styles.restInfo}>
                  <View style={styles.restTop}>
                    <Text style={styles.restName} numberOfLines={1}>
                      {r.name}
                    </Text>
                    <View
                      style={[
                        styles.ratingPill,
                        r.rating < 4.2 && { backgroundColor: "#7DBE3E" },
                      ]}
                    >
                      <Text style={styles.ratingPillText}>{r.rating}</Text>
                      <PackIcon name="star" size={11} color="#fff" />
                    </View>
                  </View>

                  <View style={styles.restMid}>
                    <Text style={styles.restCuisine} numberOfLines={1}>
                      {r.cuisines.join(" • ")}
                    </Text>
                    <Text style={styles.restPrice}>{r.price}</Text>
                  </View>

                  <View style={styles.restDivider} />

                  <View style={styles.row}>
                    <PackIcon name="bike" size={16} color={COLORS.subtext} />
                    <Text style={styles.restMeta}>{r.distance}</Text>
                    <Text style={styles.restMetaDot}>•</Text>
                    <Text style={[styles.restMeta, { color: COLORS.green, fontWeight: "600" }]}>
                      Free delivery
                    </Text>
                    <Text style={[styles.restMeta, { marginLeft: "auto" }]}>
                      {r.reviews} ratings
                    </Text>
                  </View>
                </View>
              </PressableScale>
            );
          })}

          {visibleRestaurants.length === 0 && (
            <View style={styles.empty}>
              <Text style={{ fontSize: 44 }}>🍽️</Text>
              <Text style={styles.emptyTitle}>No restaurants match</Text>
              <Text style={styles.emptySub}>Try removing a filter or category.</Text>
              <PressableScale
                haptic="medium"
                style={styles.emptyBtn}
                onPress={() => {
                  setActiveFilters([]);
                  setActiveCat(null);
                }}
              >
                <Text style={styles.emptyBtnText}>Clear all</Text>
              </PressableScale>
            </View>
          )}
        </View>

        {/* 7 — Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerLogo}>
            Restr<Text style={{ color: COLORS.primary }}>o</Text>fe
          </Text>
          <Text style={styles.footerTag}>Good food brings people together</Text>
        </View>
      </ScrollView>

      {/* Floating cart bar */}
      <Animated.View
        pointerEvents={cartCount > 0 ? "auto" : "none"}
        style={[
          styles.cartBarWrap,
          {
            bottom: Math.max(insets.bottom, 10) + 64,
            opacity: cartAnim,
            transform: [
              {
                translateY: Animated.add(
                  cartAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [90, 0],
                  }),
                  cartShiftY
                ),
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
            <PackIcon name="bag" size={18} color="#fff" style={{ marginLeft: 8 }} />
          </View>
        </PressableScale>
      </Animated.View>

      {/* Optional custom tab bar */}
      {SHOW_CUSTOM_TAB_BAR && (
        <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          {TABS.map((t) => {
            const active = activeTab === t.key;
            return (
              <Pressable
                key={t.key}
                style={styles.tabItem}
                onPress={() => {
                  fire("select");
                  setActiveTab(t.key);
                }}
              >
                <PackIcon
                  name={active ? t.active : t.icon}
                  size={24}
                  color={active ? COLORS.primary : COLORS.muted}
                />
                <Text
                  style={[styles.tabLabel, { color: active ? COLORS.primary : COLORS.muted }]}
                >
                  {t.key}
                </Text>
              </Pressable>
            );
          })}
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

  /* header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: COLORS.bg,
  },
  locationBlock: { flexDirection: "row", alignItems: "center" },
  pinCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  locationTitle: { fontSize: 17, fontWeight: "800", color: COLORS.text, marginRight: 2 },
  locationSub: { fontSize: 12.5, color: COLORS.subtext, marginTop: 1, maxWidth: 190 },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.card,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOW.sm,
  },
  bellDot: {
    position: "absolute",
    top: 10,
    right: 11,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
    borderWidth: 1.5,
    borderColor: "#fff",
  },

  /* search */
  searchWrap: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    paddingTop: 2,
    backgroundColor: COLORS.bg,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 52,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.md,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15, color: COLORS.text },
  searchDivider: {
    width: 1,
    height: 22,
    backgroundColor: COLORS.border,
    marginHorizontal: 12,
  },

  /* banners */
  banner: {
    height: 138,
    borderRadius: 22,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  bannerTitle: { fontSize: 28, fontWeight: "900", color: "#fff", letterSpacing: -0.5 },
  bannerSub: { fontSize: 13.5, color: "rgba(255,255,255,0.92)", marginTop: 4, maxWidth: 190 },
  bannerCode: {
    alignSelf: "flex-start",
    marginTop: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.22)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
    borderStyle: "dashed",
  },
  bannerCodeText: { fontSize: 11, fontWeight: "800", color: "#fff", letterSpacing: 0.6 },
  bannerEmoji: { fontSize: 74, marginRight: -4 },
  dots: { flexDirection: "row", justifyContent: "center", marginTop: -14, marginBottom: 20 },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#D8D2CC",
    marginHorizontal: 3,
  },
  dotActive: { width: 18, backgroundColor: COLORS.primary },

  /* sections */
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 19, fontWeight: "800", color: COLORS.text, letterSpacing: -0.3 },
  seeAll: { flexDirection: "row", alignItems: "center" },
  seeAllText: { fontSize: 13.5, fontWeight: "700", color: COLORS.primary, marginRight: 2 },

  /* categories */
  catList: { paddingHorizontal: 20, paddingBottom: 22 },
  catItem: { alignItems: "center", marginRight: 18 },
  catCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.card,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
    ...SHADOW.md,
  },
  catImg: { width: 54, height: 54 },
  catCircleActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primarySoft },
  catLabel: { marginTop: 8, fontSize: 12.5, fontWeight: "600", color: COLORS.subtext },
  catLabelActive: { color: COLORS.primary, fontWeight: "800" },

  /* dishes */
  dishCard: {
    width: 172,
    backgroundColor: COLORS.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
    ...SHADOW.sm,
  },
  dishImgWrap: {
    width: "100%",
    height: 122,
    position: "relative",
  },
  dishImg: { width: "100%", height: "100%" },
  dishShade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 48,
  },
  dishRatingBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.68)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 3,
  },
  dishRatingText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
  },
  dishPricePill: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 8,
    ...SHADOW.sm,
  },
  dishPricePillText: {
    color: COLORS.text,
    fontSize: 11.5,
    fontWeight: "900",
  },
  dishInfo: {
    padding: 10,
  },
  dishTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dishName: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.text,
    flex: 1,
  },
  dishRestRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 4,
  },
  dishRestName: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.subtext,
    flex: 1,
  },
  exploreAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
  },
  exploreActionText: {
    fontSize: 10.5,
    fontWeight: "700",
    color: COLORS.primary,
  },
  vegBox: {
    width: 16,
    height: 16,
    borderWidth: 1.5,
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  vegDot: { width: 8, height: 8, borderRadius: 4 },

  /* filter chips */
  chipRow: { paddingHorizontal: 20, paddingBottom: 14 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 10,
    ...SHADOW.sm,
  },
  chipOn: { backgroundColor: COLORS.primarySoft, borderColor: COLORS.primary },
  chipText: { fontSize: 13, fontWeight: "600", color: COLORS.subtext },
  chipTextOn: { color: COLORS.primary, fontWeight: "800" },

  /* restaurant cards */
  restCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    marginBottom: 22,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
    ...SHADOW.md,
  },
  restImg: {
    width: "100%",
    height: 190,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  restShade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 110,
  },
  offerWrap: {
    position: "absolute",
    left: 14,
    bottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  offerText: { marginLeft: 6, color: "#fff", fontSize: 16, fontWeight: "900", letterSpacing: -0.2 },
  heartBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.95)",
    alignItems: "center",
    justifyContent: "center",
    ...SHADOW.sm,
  },
  timePill: {
    position: "absolute",
    right: 12,
    bottom: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    ...SHADOW.sm,
  },
  timeText: { marginLeft: 4, fontSize: 12, fontWeight: "800", color: COLORS.text },
  restInfo: { padding: 14, paddingTop: 12 },
  restTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  restName: { flex: 1, fontSize: 18, fontWeight: "800", color: COLORS.text, letterSpacing: -0.3 },
  ratingPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.green,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 10,
  },
  ratingPillText: { color: "#fff", fontSize: 13, fontWeight: "800", marginRight: 3 },
  restMid: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  restCuisine: { flex: 1, fontSize: 13, color: COLORS.subtext },
  restPrice: { fontSize: 13, color: COLORS.subtext, marginLeft: 8 },
  restDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 11,
  },
  restMeta: { marginLeft: 5, fontSize: 12.5, color: COLORS.subtext },
  restMetaDot: { marginHorizontal: 6, color: COLORS.muted },

  /* empty */
  empty: { alignItems: "center", paddingVertical: 36 },
  emptyTitle: { fontSize: 17, fontWeight: "800", color: COLORS.text, marginTop: 10 },
  emptySub: { fontSize: 13.5, color: COLORS.subtext, marginTop: 4 },
  emptyBtn: {
    marginTop: 16,
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    ...SHADOW.lg,
  },
  emptyBtnText: { color: "#fff", fontWeight: "800", fontSize: 14 },

  /* footer */
  footer: { alignItems: "center", paddingTop: 10, paddingBottom: 20 },
  footerLogo: { fontSize: 38, fontWeight: "900", color: "#D9D3CD", letterSpacing: -1.5 },
  footerTag: { fontSize: 13, color: COLORS.muted, marginTop: 4 },

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

  /* tab bar */
  tabBar: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    paddingTop: 10,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    ...SHADOW.md,
  },
  tabItem: { flex: 1, alignItems: "center" },
  tabLabel: { marginTop: 3, fontSize: 11, fontWeight: "600" },
});