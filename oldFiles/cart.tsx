import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

/** Set to false while developing if you don't want to log in on every app reload. */
export const AUTH_ENABLED = true;

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
  const [user, setUser] = useState<User | null>(null);
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
    };
  }, [
    couponCode, notifs, markAllRead, markRead,
    user, items, orders, favs, addresses, selectedId, paymentId,
    login, logout, add, inc, dec, clear, placeOrder, toggleFav, addAddress, removeAddress,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
