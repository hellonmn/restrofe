import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  MENUS as DEFAULT_MENUS,
  RESTAURANTS as DEFAULT_RESTAURANTS,
  type MenuItem,
  type Restaurant,
} from "@/constants/catalog";

/* -------------------------------------------------------------------------- */
/*  Persistence Helpers                                                       */
/* -------------------------------------------------------------------------- */

const PARTNER_STORAGE_KEY = "restrofe:partner:v1";

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

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export type PartnerOffer = {
  code: string;
  title: string;
  desc: string;
  min: number;
  kind: "percent" | "flat" | "stacked" | "freedel";
  value: number; // e.g. 30
  stackedValue?: number; // e.g. 20 for 30% + 20%
  max?: number;
  icon: string;
  active: boolean;
  expiresAt?: string;
  typeTag?: "Visit Streak" | "Friday Deal" | "Birthday" | "Special";
};

export type VisitRecord = {
  id: string;
  customerName: string;
  phone: string;
  timestamp: number;
  amount: number;
  tableNumber?: string;
  status: "Verified" | "Pending" | "Settled";
  method: "Restrofe QR" | "UPI" | "Card" | "Coins";
};

export type CustomerReview = {
  id: string;
  customerName: string;
  rating: number;
  text: string;
  date: string;
  reply?: string;
  replyDate?: string;
};

export type AccountSettings = {
  ownerName: string;
  email: string;
  phone: string;
  restaurantName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
  fssaiNumber: string;
  gstin: string;
  subscriptionTier: "Free Trial" | "Pro Plan";
  trialDaysLeft: number;
  planRenewalDate: string;
};

export interface RestaurantContextType {
  hydrated: boolean;
  restaurants: Restaurant[];
  activeRestaurant: Restaurant;
  menus: Record<string, MenuItem[]>;
  offers: PartnerOffer[];
  visits: VisitRecord[];
  reviews: CustomerReview[];
  account: AccountSettings;
  /* Restaurant Listing / Management */
  updateActiveRestaurant: (data: Partial<Restaurant>) => void;
  listNewRestaurant: (restaurant: Restaurant) => void;
  toggleStoreStatus: (isOpen: boolean) => void;
  /* Menu Actions */
  addMenuItem: (cuisineCategory: string, item: Omit<MenuItem, "id">) => void;
  updateMenuItem: (cuisineCategory: string, itemId: string, data: Partial<MenuItem>) => void;
  deleteMenuItem: (cuisineCategory: string, itemId: string) => void;
  /* Offer Actions */
  addOffer: (offer: PartnerOffer) => void;
  toggleOffer: (code: string) => void;
  deleteOffer: (code: string) => void;
  /* Visits & Analytics Actions */
  logVisit: (visit: Omit<VisitRecord, "id" | "timestamp">) => void;
  replyReview: (reviewId: string, replyText: string) => void;
  /* Account Actions */
  updateAccount: (data: Partial<AccountSettings>) => void;
}

const RestaurantContext = createContext<RestaurantContextType | null>(null);

/* -------------------------------------------------------------------------- */
/*  Initial Default Data                                                      */
/* -------------------------------------------------------------------------- */

const DEFAULT_OFFERS: PartnerOffer[] = [
  {
    code: "RESTRO60",
    title: "60% OFF up to ₹120",
    desc: "On orders above ₹149",
    min: 149,
    kind: "percent",
    value: 60,
    max: 120,
    icon: "ticket",
    active: true,
    typeTag: "Special",
    expiresAt: "31 Oct 2026",
  },
  {
    code: "STACK50",
    title: "30% + 20% Stacked Discount",
    desc: "Restrofe team offer on minimum ₹499 bill",
    min: 499,
    kind: "stacked",
    value: 30,
    stackedValue: 20,
    icon: "flame",
    active: true,
    typeTag: "Special",
    expiresAt: "30 Nov 2026",
  },
  {
    code: "BILL100",
    title: "₹100 OFF on ₹1,000 Bill",
    desc: "Scan restaurant QR & pay directly at table",
    min: 1000,
    kind: "flat",
    value: 100,
    icon: "pricetag",
    active: true,
    typeTag: "Visit Streak",
    expiresAt: "15 Nov 2026",
  },
  {
    code: "FRIDAYFEAST",
    title: "Friday App Reward Day",
    desc: "Flat ₹75 OFF on all dine-in QR orders",
    min: 299,
    kind: "flat",
    value: 75,
    icon: "bolt",
    active: true,
    typeTag: "Friday Deal",
    expiresAt: "Every Friday",
  },
];

const DEFAULT_VISITS: VisitRecord[] = [
  {
    id: "v-101",
    customerName: "Rohan Sharma",
    phone: "+91 98291*****",
    timestamp: Date.now() - 15 * 60 * 1000,
    amount: 850,
    tableNumber: "T-04",
    status: "Verified",
    method: "Restrofe QR",
  },
  {
    id: "v-102",
    customerName: "Ananya Sen",
    phone: "+91 97110*****",
    timestamp: Date.now() - 48 * 60 * 1000,
    amount: 1420,
    tableNumber: "T-02",
    status: "Verified",
    method: "Restrofe QR",
  },
  {
    id: "v-103",
    customerName: "Vikas Meena",
    phone: "+91 94140*****",
    timestamp: Date.now() - 110 * 60 * 1000,
    amount: 620,
    tableNumber: "T-08",
    status: "Verified",
    method: "UPI",
  },
  {
    id: "v-104",
    customerName: "Kavita Rao",
    phone: "+91 99823*****",
    timestamp: Date.now() - 240 * 60 * 1000,
    amount: 1190,
    tableNumber: "T-01",
    status: "Settled",
    method: "Restrofe QR",
  },
];

const DEFAULT_PARTNER_REVIEWS: CustomerReview[] = [
  {
    id: "r1",
    customerName: "Aarav S.",
    rating: 5,
    text: "Loved the food, super fast QR checkout right at the table!",
    date: "2 days ago",
    reply: "Thank you Aarav! Looking forward to serving you again soon! 🍔",
    replyDate: "Yesterday",
  },
  {
    id: "r2",
    customerName: "Meera K.",
    rating: 4,
    text: "Great taste and generous portions. The 30%+20% deal was awesome.",
    date: "1 week ago",
  },
  {
    id: "r3",
    customerName: "Rohit J.",
    rating: 5,
    text: "Best place around for a relaxed evening. Highly recommend.",
    date: "2 weeks ago",
  },
];

const DEFAULT_ACCOUNT: AccountSettings = {
  ownerName: "Devansh Pareek",
  email: "partner@theburgerhouse.restrofe.in",
  phone: "+91 98765 43210",
  restaurantName: "The Burger House",
  bankName: "HDFC Bank Ltd",
  accountNumber: "50200049182391",
  ifscCode: "HDFC0001234",
  upiId: "burgerhouse@hdfcbank",
  fssaiNumber: "12224027000142",
  gstin: "08AABCT1332A1ZP",
  subscriptionTier: "Free Trial",
  trialDaysLeft: 24,
  planRenewalDate: "7 Nov 2026",
};

/* -------------------------------------------------------------------------- */
/*  Provider Component                                                        */
/* -------------------------------------------------------------------------- */

export function RestaurantProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(DEFAULT_RESTAURANTS);
  const [activeRestaurantId, setActiveRestaurantId] = useState<string>("1");
  const [menus, setMenus] = useState<Record<string, MenuItem[]>>(DEFAULT_MENUS);
  const [offers, setOffers] = useState<PartnerOffer[]>(DEFAULT_OFFERS);
  const [visits, setVisits] = useState<VisitRecord[]>(DEFAULT_VISITS);
  const [reviews, setReviews] = useState<CustomerReview[]>(DEFAULT_PARTNER_REVIEWS);
  const [account, setAccount] = useState<AccountSettings>(DEFAULT_ACCOUNT);

  // Load persisted partner state
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const raw = await getStorage()?.getItem(PARTNER_STORAGE_KEY);
        if (raw && alive) {
          const parsed = JSON.parse(raw);
          if (parsed.restaurants?.length) setRestaurants(parsed.restaurants);
          if (parsed.activeRestaurantId) setActiveRestaurantId(parsed.activeRestaurantId);
          if (parsed.menus) setMenus(parsed.menus);
          if (parsed.offers?.length) setOffers(parsed.offers);
          if (parsed.visits?.length) setVisits(parsed.visits);
          if (parsed.reviews?.length) setReviews(parsed.reviews);
          if (parsed.account) setAccount(parsed.account);
        }
      } catch {
        // Fall back to clean defaults
      } finally {
        if (alive) setHydrated(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Persist state updates
  useEffect(() => {
    if (!hydrated) return;
    const timer = setTimeout(() => {
      try {
        Promise.resolve(
          getStorage()?.setItem(
            PARTNER_STORAGE_KEY,
            JSON.stringify({
              restaurants,
              activeRestaurantId,
              menus,
              offers,
              visits,
              reviews,
              account,
            })
          )
        ).catch(() => {});
      } catch {
        // ignore
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [hydrated, restaurants, activeRestaurantId, menus, offers, visits, reviews, account]);

  const activeRestaurant = useMemo(
    () => restaurants.find((r) => r.id === activeRestaurantId) || restaurants[0] || DEFAULT_RESTAURANTS[0],
    [restaurants, activeRestaurantId]
  );

  /* Restaurant mutations */
  const updateActiveRestaurant = useCallback((data: Partial<Restaurant>) => {
    setRestaurants((prev) =>
      prev.map((r) => (r.id === activeRestaurantId ? { ...r, ...data } : r))
    );
  }, [activeRestaurantId]);

  const listNewRestaurant = useCallback((restaurant: Restaurant) => {
    setRestaurants((prev) => [restaurant, ...prev]);
    setActiveRestaurantId(restaurant.id);
    setAccount((prev) => ({
      ...prev,
      restaurantName: restaurant.name,
    }));
  }, []);

  const toggleStoreStatus = useCallback((isOpen: boolean) => {
    setRestaurants((prev) =>
      prev.map((r) => (r.id === activeRestaurantId ? { ...r, isOpen } : r))
    );
  }, [activeRestaurantId]);

  /* Menu mutations */
  const addMenuItem = useCallback((cuisineCategory: string, item: Omit<MenuItem, "id">) => {
    const newItem: MenuItem = {
      ...item,
      id: `m-${Date.now()}`,
    };
    setMenus((prev) => {
      const existing = prev[cuisineCategory] || [];
      return {
        ...prev,
        [cuisineCategory]: [newItem, ...existing],
      };
    });
  }, []);

  const updateMenuItem = useCallback(
    (cuisineCategory: string, itemId: string, data: Partial<MenuItem>) => {
      setMenus((prev) => {
        const categoryItems = prev[cuisineCategory] || [];
        return {
          ...prev,
          [cuisineCategory]: categoryItems.map((item) =>
            item.id === itemId ? { ...item, ...data } : item
          ),
        };
      });
    },
    []
  );

  const deleteMenuItem = useCallback((cuisineCategory: string, itemId: string) => {
    setMenus((prev) => {
      const categoryItems = prev[cuisineCategory] || [];
      return {
        ...prev,
        [cuisineCategory]: categoryItems.filter((item) => item.id !== itemId),
      };
    });
  }, []);

  /* Offer mutations */
  const addOffer = useCallback((offer: PartnerOffer) => {
    setOffers((prev) => [offer, ...prev.filter((o) => o.code !== offer.code)]);
  }, []);

  const toggleOffer = useCallback((code: string) => {
    setOffers((prev) =>
      prev.map((o) => (o.code === code ? { ...o, active: !o.active } : o))
    );
  }, []);

  const deleteOffer = useCallback((code: string) => {
    setOffers((prev) => prev.filter((o) => o.code !== code));
  }, []);

  /* Visits & Reviews */
  const logVisit = useCallback((visit: Omit<VisitRecord, "id" | "timestamp">) => {
    const newVisit: VisitRecord = {
      ...visit,
      id: `v-${Date.now()}`,
      timestamp: Date.now(),
    };
    setVisits((prev) => [newVisit, ...prev]);
  }, []);

  const replyReview = useCallback((reviewId: string, replyText: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              reply: replyText,
              replyDate: "Just now",
            }
          : r
      )
    );
  }, []);

  /* Account Settings */
  const updateAccount = useCallback((data: Partial<AccountSettings>) => {
    setAccount((prev) => ({ ...prev, ...data }));
  }, []);

  const value = useMemo<RestaurantContextType>(
    () => ({
      hydrated,
      restaurants,
      activeRestaurant,
      menus,
      offers,
      visits,
      reviews,
      account,
      updateActiveRestaurant,
      listNewRestaurant,
      toggleStoreStatus,
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      addOffer,
      toggleOffer,
      deleteOffer,
      logVisit,
      replyReview,
      updateAccount,
    }),
    [
      hydrated,
      restaurants,
      activeRestaurant,
      menus,
      offers,
      visits,
      reviews,
      account,
      updateActiveRestaurant,
      listNewRestaurant,
      toggleStoreStatus,
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      addOffer,
      toggleOffer,
      deleteOffer,
      logVisit,
      replyReview,
      updateAccount,
    ]
  );

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const ctx = useContext(RestaurantContext);
  if (!ctx) {
    throw new Error("useRestaurant must be used inside <RestaurantProvider>");
  }
  return ctx;
}
