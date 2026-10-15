import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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

/* eslint-disable @typescript-eslint/no-require-imports */
function getStorage(): KV | null {
  try {
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
    const mod = require("@react-native-async-storage/async-storage");
    return (mod?.default ?? mod) as KV;
  } catch {
    return null;
  }
}
/* eslint-enable @typescript-eslint/no-require-imports */

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
};

export type Order = {
  id: string;
  items: CartItem[];
  total: number;
  placedAt: number;
};

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
  kind: "percent" | "flat" | "stacked" | "freedel";
  value: number;
  stackedValue?: number;
  max?: number;
  icon: string; // Ionicons or PackIcon name
};

export const COUPONS: Coupon[] = [
  { code: "RESTRO60", title: "60% OFF up to ₹120", desc: "On orders above ₹149", min: 149, kind: "percent", value: 60, max: 120, icon: "pricetag" },
  { code: "STACK50", title: "30% + 20% Stacked Discount", desc: "Team offer on bills above ₹499", min: 499, kind: "stacked", value: 30, stackedValue: 20, icon: "flame" },
  { code: "BILL100", title: "₹100 OFF on ₹1,000 Bill", desc: "Table QR & Dine-in special", min: 1000, kind: "flat", value: 100, icon: "pricetag" },
  { code: "CAFE50", title: "Flat ₹50 OFF", desc: "On orders above ₹199", min: 199, kind: "flat", value: 50, icon: "cafe" },
  { code: "FREEDEL", title: "Free delivery", desc: "On orders above ₹299", min: 299, kind: "freedel", value: 0, icon: "bicycle" },
];

export function evaluateCoupon(
  code: string | null,
  itemTotal: number,
  deliveryFee: number,
  customList: Coupon[] = COUPONS
) {
  const coupon = customList.find((x) => x.code === code);
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
  } else if (coupon.kind === "stacked") {
    const baseDiscount = Math.round((itemTotal * coupon.value) / 100);
    const remaining = Math.max(0, itemTotal - baseDiscount);
    const extraDiscount = Math.round((remaining * (coupon.stackedValue ?? 20)) / 100);
    discount = Math.min(baseDiscount + extraDiscount, coupon.max ?? Infinity);
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
  add: (item: Omit<CartItem, "qty">) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;
  clear: () => void;
  /* orders */
  orders: Order[];
  placeOrder: (paidTotal: number) => void;
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
            })
          )
        ).catch(() => {});
      } catch {
        // ignore
      }
    }, 300);
    return () => clearTimeout(t);
  }, [hydrated, user, items, orders, favs, addresses, selectedId, paymentId, couponCode, notifs]);

  /* cart */
  const add = useCallback((item: Omit<CartItem, "qty">) => {
    setItems((prev) => ({
      ...prev,
      [item.id]: { ...item, qty: (prev[item.id]?.qty ?? 0) + 1 },
    }));
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
  const placeOrder = useCallback((paidTotal: number) => {
    const list = Object.values(itemsRef.current);
    if (list.length === 0) return;
    const order: Order = {
      id: `RF${orderSeq.current++}`,
      items: list,
      total: paidTotal,
      placedAt: Date.now(),
    };
    setOrders((o) => [order, ...o]);
    setItems({});
    setCouponCode(null);
    setNotifs((n) => [
      {
        id: `n-${order.id}`,
        type: "order",
        title: `Order #${order.id} placed`,
        body: `₹${paidTotal} • The restaurant is preparing your food.`,
        at: order.placedAt,
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
      add,
      inc,
      dec,
      clear,
      orders,
      placeOrder,
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
    tabBarVisible, onScrollHideTabBar,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}