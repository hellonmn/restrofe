import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { PackIcon } from "@/components/pack-icon";
import { DISHES, getRestaurant } from "@/constants/catalog";

/* --------------------------- persistence --------------------------------
 * Saves everything to the phone so login, cart, favourites, orders etc. survive
 * app restarts. Uses AsyncStorage if it is installed; if it isn't (or the dev
 * build doesn't include it yet) the app simply works without saving.
 * Install:  npx expo install @react-native-async-storage/async-storage
 * -------------------------------------------------------------------------- */
const STORAGE_KEY = "restrofe:v1";

type KV = {
  getItem: (k: string) => Promise<string | null>;
  setItem: (k: string, v: string) => Promise<void>;
};

function getStorage(): KV | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { NativeModules, Platform } = require("react-native");
    if (Platform.OS !== "web") {
      const hasNative =
        Boolean(NativeModules?.RNCAsyncStorage) ||
        Boolean(NativeModules?.PlatformLocalStorage) ||
        Boolean(NativeModules?.RNC_AsyncSQLiteDBStorage);
      if (!hasNative) {
        return null;
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require("@react-native-async-storage/async-storage");
    return (mod?.default ?? mod) as KV;
  } catch {
    return null;
  }
}

/** Set to false while developing if you don't want to log in on every app reload. */
export const AUTH_ENABLED = false;

/* ------------------------------- types ---------------------------------- */

export type User = { phone: string };


export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  veg: boolean;
  qty: number;
  restaurantId?: string;
  restaurantName?: string;
};

export type Order = {
  id: string;
  items: CartItem[];
  total: number;
  placedAt: number;
  restaurantId?: string;
  restaurantName?: string;
  restaurantImage?: string;
  address?: string;
  paymentMethod?: string;
  paidWith?: string;
  status?: string;
  discount?: number;
  itemTotal?: number;
  deliveryFee?: number;
};

export type WalletTxn = {
  id: string;
  type: "credit" | "debit";
  title: string;
  amount: number;
  at: number;
  orderId?: string;
};

export const WALLET_MIN_ADD = 100;
export const WALLET_MAX_ADD = 10000;
export const WALLET_BONUS_MIN = 500;
export const WALLET_BONUS = 50;

export type FavPlace = {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviews: string;
  mins: number;
  price: string;
  cuisines: string[];
};

export type AddressLabel = "Home" | "Work" | "Other";
export type Address = { id: string; label: AddressLabel; line: string };

export type PaymentMethod = {
  id: string;
  label: string;
  sub: string;
  icon: string; // Ionicons name
};

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: "upi", label: "UPI", sub: "Google Pay, PhonePe, Paytm", icon: "phone-portrait-outline" },
  { id: "card", label: "Credit / Debit card", sub: "Visa, Mastercard, RuPay", icon: "card-outline" },
  { id: "wallet", label: "Wallets", sub: "Paytm, Amazon Pay", icon: "wallet-outline" },
  { id: "cod", label: "Cash on delivery", sub: "Pay when your order arrives", icon: "cash-outline" },
];

export type Coupon = {
  code: string;
  title: string;
  desc: string;
  min: number;
  kind: "percent" | "flat" | "freedel";
  value: number;
  max?: number;
  icon: string; // Ionicons name
};

export const COUPONS: Coupon[] = [
  { code: "RESTRO60", title: "60% OFF up to ₹120", desc: "On orders above ₹149", min: 149, kind: "percent", value: 60, max: 120, icon: "pricetag" },
  { code: "CAFE50", title: "Flat ₹50 OFF", desc: "On orders above ₹199", min: 199, kind: "flat", value: 50, icon: "cafe" },
  { code: "FREEDEL", title: "Free delivery", desc: "On orders above ₹299", min: 299, kind: "freedel", value: 0, icon: "bicycle" },
];

export function evaluateCoupon(code: string | null, itemTotal: number, deliveryFee: number) {
  const coupon = COUPONS.find((x) => x.code === code);
  if (!coupon) return { coupon: undefined, discount: 0, valid: false, message: "" };
  if (itemTotal < coupon.min) {
    return {
      coupon,
      discount: 0,
      valid: false,
      message: `Add ₹${coupon.min - itemTotal} more to use ${coupon.code}`,
    };
  }
  let discount = 0;
  if (coupon.kind === "percent") {
    discount = Math.min(Math.round((itemTotal * coupon.value) / 100), coupon.max ?? Infinity);
  } else if (coupon.kind === "flat") {
    discount = coupon.value;
  } else {
    discount = deliveryFee;
  }
  return { coupon, discount, valid: true, message: `You saved ₹${discount} on this order` };
}

export type Notif = {
  id: string;
  type: "order" | "offer" | "info";
  title: string;
  body: string;
  at: number;
  read: boolean;
};

type CartContextValue = {
  /** false until saved data has been loaded from the phone */
  hydrated: boolean;
  /* coupons */
  couponCode: string | null;
  setCoupon: (code: string | null) => void;
  /* notifications */
  notifs: Notif[];
  unreadCount: number;
  markAllRead: () => void;
  markRead: (id: string) => void;
  /* auth */
  user: User | null;
  login: (phone: string) => void;
  logout: () => void;
  /* cart */
  items: Record<string, CartItem>;
  list: CartItem[];
  count: number;
  total: number;
  cartRestaurant: { id: string; name: string; image?: string } | null;
  add: (item: Omit<CartItem, "qty">) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;
  clear: () => void;
  /* orders */
  orders: Order[];
  placeOrder: (paidTotal: number, extra?: Partial<Order> | string) => Order | undefined;
  /* wallet */
  walletBalance: number;
  walletTxns: WalletTxn[];
  addMoney: (amount: number) => void;
  /* favourites */
  favs: Record<string, FavPlace>;
  favList: FavPlace[];
  toggleFav: (place: FavPlace) => void;
  /* addresses */
  addresses: Address[];
  selectedAddress: Address | undefined;
  addAddress: (label: AddressLabel, line: string) => void;
  removeAddress: (id: string) => void;
  selectAddress: (id: string) => void;
  /* payment */
  paymentId: string;
  payment: PaymentMethod;
  setPaymentId: (id: string) => void;
  /* tab bar visibility */
  tabBarVisible: boolean;
  setTabBarVisible: (visible: boolean) => void;
  onScrollHideTabBar: (e: any) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

/* ------------------------------ provider -------------------------------- */

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Record<string, CartItem>>({});
  const [orders, setOrders] = useState<Order[]>([]);
  const [favs, setFavs] = useState<Record<string, FavPlace>>({});
  const [addresses, setAddresses] = useState<Address[]>([
    { id: "a1", label: "Home", line: "Jaipur, Rajasthan" },
  ]);
  const [selectedId, setSelectedId] = useState("a1");
  const [paymentId, setPaymentId] = useState("upi");
  const [walletBalance, setWalletBalance] = useState<number>(250);
  const [walletTxns, setWalletTxns] = useState<WalletTxn[]>(() => {
    const now = Date.now();
    const d = 86400000;
    return [
      {
        id: "tx-init-1",
        type: "credit",
        title: "Welcome Bonus 🎉",
        amount: 250,
        at: now - 3 * d,
      },
    ];
  });
  const [user, setUser] = useState<User | null>({ phone: "+91 9876543210" });
  const [tabBarVisible, setTabBarVisible] = useState(true);
  const lastScrollY = useRef(0);

  const onScrollHideTabBar = useCallback((e: any) => {
    const y = e?.nativeEvent?.contentOffset?.y ?? 0;
    if (y <= 25) {
      setTabBarVisible(true);
      lastScrollY.current = y;
      return;
    }

    const diff = y - lastScrollY.current;

    if (diff > 12) {
      setTabBarVisible(false);
      lastScrollY.current = y;
    } else if (diff < -10) {
      setTabBarVisible(true);
      lastScrollY.current = y;
    }
  }, []);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [notifs, setNotifs] = useState<Notif[]>(() => {
    const now = Date.now();
    const h = 3600000;
    return [
      { id: "n1", type: "offer", title: "60% OFF on your first order", body: "Use code RESTRO60 and save up to ₹120.", at: now - 2 * h, read: false },
      { id: "n2", type: "offer", title: "Café Fridays are here ☕", body: "Flat ₹50 OFF with CAFE50 on orders above ₹199.", at: now - 26 * h, read: false },
      { id: "n3", type: "info", title: "Welcome to Restrofe 🎉", body: "Discover great food and cafés near you.", at: now - 72 * h, read: true },
    ];
  });

  const itemsRef = useRef(items);
  itemsRef.current = items;
  const orderSeq = useRef(1001);
  const addrSeq = useRef(2);

  /* load saved data once on app start */
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const raw = await getStorage()?.getItem(STORAGE_KEY);
        if (raw && alive) {
          const d = JSON.parse(raw);
          if (d.user) setUser(d.user);
          if (d.items) setItems(d.items);
          if (d.orders) {
            setOrders(d.orders);
            const nums = (d.orders as Order[]).map((o) => parseInt(o.id.replace(/\D/g, ""), 10) || 0);
            orderSeq.current = Math.max(1000, ...nums) + 1;
          }
          if (d.favs) setFavs(d.favs);
          if (d.addresses) {
            setAddresses(d.addresses);
            const nums = (d.addresses as Address[]).map((a) => parseInt(a.id.replace(/\D/g, ""), 10) || 0);
            addrSeq.current = Math.max(1, ...nums) + 1;
          }
          if (d.selectedId !== undefined) setSelectedId(d.selectedId);
          if (d.paymentId) setPaymentId(d.paymentId);
          if (typeof d.walletBalance === "number") setWalletBalance(d.walletBalance);
          if (Array.isArray(d.walletTxns)) setWalletTxns(d.walletTxns);
          if (d.couponCode !== undefined) setCouponCode(d.couponCode);
          if (d.notifs) setNotifs(d.notifs);
        }
      } catch {
        // ignore – start fresh
      } finally {
        if (alive) setHydrated(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  /* save whenever something changes (after the first load) */
  useEffect(() => {
    if (!hydrated) return;
    const t = setTimeout(() => {
      try {
        Promise.resolve(
          getStorage()?.setItem(
            STORAGE_KEY,
            JSON.stringify({
              user, items, orders, favs, addresses, selectedId, paymentId, couponCode, notifs,
              walletBalance, walletTxns,
            })
          )
        ).catch(() => {});
      } catch {
        // ignore
      }
    }, 300);
    return () => clearTimeout(t);
  }, [hydrated, user, items, orders, favs, addresses, selectedId, paymentId, couponCode, notifs, walletBalance, walletTxns]);

  /* conflict dialog for single-restaurant rule */
  const [conflict, setConflict] = useState<{
    pendingItem: Omit<CartItem, "qty">;
    currentRestaurantName: string;
    newRestaurantName: string;
  } | null>(null);

  const cartRestaurant = useMemo(() => {
    const list = Object.values(items);
    if (list.length === 0) return null;
    const withRest = list.find((i) => i.restaurantId);
    if (withRest && withRest.restaurantId) {
      const restData = getRestaurant(withRest.restaurantId);
      return {
        id: withRest.restaurantId,
        name: withRest.restaurantName || restData?.name || "Restaurant",
        image: restData?.image,
      };
    }
    return null;
  }, [items]);

  /* cart */
  const add = useCallback((item: Omit<CartItem, "qty">) => {
    let enrichedItem = { ...item };
    if (!enrichedItem.restaurantId) {
      const match = DISHES.find(
        (d) => d.id === item.id || d.name.toLowerCase() === item.name.toLowerCase()
      );
      if (match) {
        enrichedItem.restaurantId = match.restaurantId;
        enrichedItem.restaurantName = match.restaurantName;
      }
    }

    const currentList = Object.values(itemsRef.current);
    const existingRestId = currentList.find((i) => i.restaurantId)?.restaurantId;
    const existingRestName =
      currentList.find((i) => i.restaurantName)?.restaurantName || "previous restaurant";

    if (
      currentList.length > 0 &&
      existingRestId &&
      enrichedItem.restaurantId &&
      existingRestId !== enrichedItem.restaurantId
    ) {
      setConflict({
        pendingItem: enrichedItem,
        currentRestaurantName: existingRestName,
        newRestaurantName: enrichedItem.restaurantName || "this restaurant",
      });
      return;
    }

    setItems((prev) => ({
      ...prev,
      [enrichedItem.id]: { ...enrichedItem, qty: (prev[enrichedItem.id]?.qty ?? 0) + 1 },
    }));
  }, []);

  const confirmDiscardAndAdd = useCallback(() => {
    if (!conflict) return;
    const itemToAdd = conflict.pendingItem;
    setItems({
      [itemToAdd.id]: {
        ...itemToAdd,
        qty: 1,
      },
    });
    setConflict(null);
  }, [conflict]);

  const cancelConflict = useCallback(() => {
    setConflict(null);
  }, []);

  const inc = useCallback((id: string) => {
    setItems((prev) =>
      prev[id] ? { ...prev, [id]: { ...prev[id], qty: prev[id].qty + 1 } } : prev
    );
  }, []);

  const dec = useCallback((id: string) => {
    setItems((prev) => {
      const cur = prev[id];
      if (!cur) return prev;
      const next = { ...prev };
      if (cur.qty <= 1) delete next[id];
      else next[id] = { ...cur, qty: cur.qty - 1 };
      return next;
    });
  }, []);

  const clear = useCallback(() => setItems({}), []);

  /* orders */
  const placeOrder = useCallback(
    (paidTotal: number, extra?: Partial<Order> | string) => {
      const list = Object.values(itemsRef.current);
      if (list.length === 0) return undefined;

      const extraObj: Partial<Order> =
        typeof extra === "string" ? { paymentMethod: extra } : extra ?? {};

      const curAddress = addresses.find((a) => a.id === selectedId);
      const curPayment = PAYMENT_METHODS.find((p) => p.id === paymentId) ?? PAYMENT_METHODS[0];

      const pMethod = extraObj.paymentMethod || curPayment.id;
      const isWallet = pMethod === "wallet" || pMethod === "Wallets";

      if (isWallet && walletBalance < paidTotal) {
        return undefined;
      }

      const restId = extraObj.restaurantId || list[0]?.restaurantId || "1";
      const restData = restId ? getRestaurant(restId) : undefined;
      const restName =
        extraObj.restaurantName ||
        list[0]?.restaurantName ||
        restData?.name ||
        "The Burger House";

      const order: Order = {
        id: `RF${orderSeq.current++}`,
        items: list,
        total: paidTotal,
        placedAt: Date.now(),
        restaurantId: restId || "1",
        restaurantName: restName,
        restaurantImage: extraObj.restaurantImage || restData?.image || list[0]?.image || "",
        address: extraObj.address || curAddress?.line || "Jaipur, Rajasthan",
        paymentMethod: isWallet ? "Wallet" : (curPayment.label || "UPI"),
        paidWith: isWallet ? "wallet" : (curPayment.id || "upi"),
        status: "Preparing",
        discount: extraObj.discount ?? 0,
        deliveryFee: extraObj.deliveryFee ?? 30,
        itemTotal: extraObj.itemTotal ?? list.reduce((s, i) => s + i.price * i.qty, 0),
      };

      if (isWallet) {
        setWalletBalance((prev) => Math.max(0, prev - paidTotal));
        setWalletTxns((prev) => [
          {
            id: `tx-order-${order.id}`,
            type: "debit",
            title: `Order #${order.id} payment`,
            amount: paidTotal,
            at: order.placedAt,
            orderId: order.id,
          },
          ...prev,
        ]);
      }

      setOrders((o) => [order, ...o]);
      setItems({});
      setCouponCode(null);
      setNotifs((n) => [
        {
          id: `n-${order.id}`,
          type: "order",
          title: `Order #${order.id} placed`,
          body: `₹${paidTotal} • ${restName} is preparing your food.`,
          at: order.placedAt,
          read: false,
        },
        ...n,
      ]);
      return order;
    },
    [addresses, selectedId, paymentId, walletBalance]
  );

  /* wallet */
  const addMoney = useCallback((amount: number) => {
    const now = Date.now();
    const willGetBonus = amount >= WALLET_BONUS_MIN;
    const bonus = willGetBonus ? WALLET_BONUS : 0;
    const totalAdded = amount + bonus;

    const newTxns: WalletTxn[] = [
      {
        id: `tx-${now}`,
        type: "credit",
        title: "Added to wallet",
        amount,
        at: now,
      },
    ];

    if (willGetBonus) {
      newTxns.push({
        id: `tx-b-${now}`,
        type: "credit",
        title: "Cashback bonus 🎉",
        amount: bonus,
        at: now + 1,
      });
    }

    setWalletBalance((prev) => prev + totalAdded);
    setWalletTxns((prev) => [...newTxns, ...prev]);

    setNotifs((n) => [
      {
        id: `n-wallet-${now}`,
        type: "info",
        title: "Wallet updated 💳",
        body: `₹${totalAdded} added to your Restrofe Wallet.`,
        at: now,
        read: false,
      },
      ...n,
    ]);
  }, []);

  /* notifications */
  const markAllRead = useCallback(
    () => setNotifs((n) => n.map((x) => (x.read ? x : { ...x, read: true }))),
    []
  );
  const markRead = useCallback(
    (id: string) => setNotifs((n) => n.map((x) => (x.id === id ? { ...x, read: true } : x))),
    []
  );

  /* auth */
  const login = useCallback((phone: string) => setUser({ phone }), []);
  const logout = useCallback(() => {
    setUser(null);
    setItems({});
    setOrders([]);
    setFavs({});
  }, []);

  /* favourites */
  const toggleFav = useCallback((place: FavPlace) => {
    setFavs((prev) => {
      const next = { ...prev };
      if (next[place.id]) delete next[place.id];
      else next[place.id] = place;
      return next;
    });
  }, []);

  /* addresses */
  const addAddress = useCallback((label: AddressLabel, line: string) => {
    const id = `a${addrSeq.current++}`;
    setAddresses((a) => [...a, { id, label, line: line.trim() }]);
    setSelectedId(id);
  }, []);

  const removeAddress = useCallback((id: string) => {
    setAddresses((a) => {
      const next = a.filter((x) => x.id !== id);
      setSelectedId((cur) => (cur === id ? next[0]?.id ?? "" : cur));
      return next;
    });
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const list = Object.values(items);
    return {
      hydrated,
      couponCode,
      setCoupon: setCouponCode,
      notifs,
      unreadCount: notifs.filter((x) => !x.read).length,
      markAllRead,
      markRead,
      user,
      login,
      logout,
      items,
      list,
      count: list.reduce((n, i) => n + i.qty, 0),
      total: list.reduce((sum, i) => sum + i.qty * i.price, 0),
      cartRestaurant,
      add,
      inc,
      dec,
      clear,
      orders,
      placeOrder,
      walletBalance,
      walletTxns,
      addMoney,
      favs,
      favList: Object.values(favs),
      toggleFav,
      addresses,
      selectedAddress: addresses.find((a) => a.id === selectedId),
      addAddress,
      removeAddress,
      selectAddress: setSelectedId,
      paymentId,
      payment: PAYMENT_METHODS.find((p) => p.id === paymentId) ?? PAYMENT_METHODS[0],
      setPaymentId,
      tabBarVisible,
      setTabBarVisible,
      onScrollHideTabBar,
    };
  }, [
    hydrated, couponCode, notifs, markAllRead, markRead,
    user, items, orders, favs, addresses, selectedId, paymentId,
    login, logout, add, inc, dec, clear, placeOrder, toggleFav, addAddress, removeAddress,
    tabBarVisible, onScrollHideTabBar, cartRestaurant, walletBalance, walletTxns, addMoney,
  ]);

  return (
    <CartContext.Provider value={value}>
      {children}
      {conflict && (
        <Modal
          transparent
          visible={Boolean(conflict)}
          animationType="fade"
          onRequestClose={cancelConflict}
        >
          <View style={conflictStyles.overlay}>
            <View style={conflictStyles.dialog}>
              <View style={conflictStyles.iconCircle}>
                <PackIcon name="utensils" size={26} color="#FF5A1F" />
              </View>
              <Text style={conflictStyles.title}>Replace cart items?</Text>
              <Text style={conflictStyles.desc}>
                Your cart contains dishes from{" "}
                <Text style={conflictStyles.bold}>
                  {conflict.currentRestaurantName}
                </Text>
                . A single order can only be from one restaurant.
                {"\n\n"}
                Do you want to discard your cart and add items from{" "}
                <Text style={conflictStyles.bold}>
                  {conflict.newRestaurantName}
                </Text>
                ?
              </Text>

              <View style={conflictStyles.actions}>
                <Pressable
                  style={[conflictStyles.btn, conflictStyles.btnCancel]}
                  onPress={cancelConflict}
                >
                  <Text style={conflictStyles.btnCancelText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[conflictStyles.btn, conflictStyles.btnConfirm]}
                  onPress={confirmDiscardAndAdd}
                >
                  <Text style={conflictStyles.btnConfirmText}>
                    Discard & Add
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </CartContext.Provider>
  );
}

const conflictStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  dialog: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 22,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFEDE4",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1C1C1E",
    marginBottom: 8,
    textAlign: "center",
  },
  desc: {
    fontSize: 14,
    color: "#6B6B73",
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 20,
  },
  bold: {
    fontWeight: "700",
    color: "#1C1C1E",
  },
  actions: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
  },
  btn: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  btnCancel: {
    backgroundColor: "#F2F2F7",
  },
  btnCancelText: {
    fontSize: 14.5,
    fontWeight: "700",
    color: "#6B6B73",
  },
  btnConfirm: {
    backgroundColor: "#FF5A1F",
  },
  btnConfirmText: {
    fontSize: 14.5,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}