import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  RestaurantProfile,
  MenuItem,
  Offer,
  TableQR,
  CustomerReview,
  LiveVisit,
  StoreStatus,
  TableStatus,
} from '../types';
import {
  INITIAL_PROFILE,
  INITIAL_MENU_ITEMS,
  INITIAL_OFFERS,
  INITIAL_TABLES,
  INITIAL_VISITS,
  INITIAL_REVIEWS,
} from '../data/mockData';

export type NavTab =
  | 'dashboard'
  | 'menu'
  | 'offers'
  | 'tables'
  | 'analytics'
  | 'settlement'
  | 'account';

interface RestaurantContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  profile: RestaurantProfile;
  updateProfile: (updated: Partial<RestaurantProfile>) => void;
  storeStatus: StoreStatus;
  setStoreStatus: (status: StoreStatus) => void;

  menuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, 'id' | 'rating' | 'reviewCount'>) => void;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  toggleStock: (id: string) => void;

  offers: Offer[];
  addOffer: (offer: Omit<Offer, 'id' | 'claimedCount'>) => void;
  updateOffer: (id: string, offer: Partial<Offer>) => void;
  deleteOffer: (id: string) => void;
  toggleOfferActive: (id: string) => void;

  tables: TableQR[];
  updateTableStatus: (tableNumber: number, status: TableStatus) => void;
  updateTableUPI: (tableNumber: number, upi: string) => void;
  addTable: (capacity: number, section: TableQR['section']) => void;

  visits: LiveVisit[];
  triggerLiveVisit: () => void;

  reviews: CustomerReview[];
  replyToReview: (id: string, text: string) => void;

  selectedStandeeTable: TableQR | null;
  setSelectedStandeeTable: (table: TableQR | null) => void;

  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  resetAllData: () => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

const STORAGE_KEY = 'restrofe_partner_portal_state_v1';

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [selectedStandeeTable, setSelectedStandeeTable] = useState<TableQR | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Load from local storage or fallback to mock data
  const [profile, setProfile] = useState<RestaurantProfile>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_profile`);
      return saved ? JSON.parse(saved) : INITIAL_PROFILE;
    } catch {
      return INITIAL_PROFILE;
    }
  });

  const [storeStatus, setStoreStatusState] = useState<StoreStatus>(() => profile.status);

  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_menu`);
      return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
    } catch {
      return INITIAL_MENU_ITEMS;
    }
  });

  const [offers, setOffers] = useState<Offer[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_offers`);
      return saved ? JSON.parse(saved) : INITIAL_OFFERS;
    } catch {
      return INITIAL_OFFERS;
    }
  });

  const [tables, setTables] = useState<TableQR[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_tables`);
      return saved ? JSON.parse(saved) : INITIAL_TABLES;
    } catch {
      return INITIAL_TABLES;
    }
  });

  const [visits, setVisits] = useState<LiveVisit[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_visits`);
      return saved ? JSON.parse(saved) : INITIAL_VISITS;
    } catch {
      return INITIAL_VISITS;
    }
  });

  const [reviews, setReviews] = useState<CustomerReview[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_reviews`);
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  // Save to local storage on changes
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_profile`, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_menu`, JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_offers`, JSON.stringify(offers));
  }, [offers]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_tables`, JSON.stringify(tables));
  }, [tables]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_visits`, JSON.stringify(visits));
  }, [visits]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_reviews`, JSON.stringify(reviews));
  }, [reviews]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3500);
  };

  const updateProfile = (updated: Partial<RestaurantProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updated };
      if (updated.status) setStoreStatusState(updated.status);
      return next;
    });
    showToast('Restaurant details updated successfully');
  };

  const setStoreStatus = (status: StoreStatus) => {
    setStoreStatusState(status);
    setProfile((prev) => ({ ...prev, status }));
    showToast(`Store status set to ${status.toUpperCase()}`, status === 'closed' ? 'info' : 'success');
  };

  const addMenuItem = (item: Omit<MenuItem, 'id' | 'rating' | 'reviewCount'>) => {
    const newItem: MenuItem = {
      ...item,
      id: `m_${Date.now()}`,
      rating: 5.0,
      reviewCount: 1,
    };
    setMenuItems((prev) => [newItem, ...prev]);
    showToast(`Added "${newItem.name}" to menu`);
  };

  const updateMenuItem = (id: string, item: Partial<MenuItem>) => {
    setMenuItems((prev) => prev.map((m) => (m.id === id ? { ...m, ...item } : m)));
    showToast('Menu item updated');
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems((prev) => prev.filter((m) => m.id !== id));
    showToast('Item removed from menu', 'info');
  };

  const toggleStock = (id: string) => {
    setMenuItems((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const nextStock = !m.inStock;
          showToast(`"${m.name}" marked as ${nextStock ? 'In Stock' : 'Sold Out'}`, nextStock ? 'success' : 'info');
          return { ...m, inStock: nextStock };
        }
        return m;
      })
    );
  };

  const addOffer = (offer: Omit<Offer, 'id' | 'claimedCount'>) => {
    const newOffer: Offer = {
      ...offer,
      id: `off_${Date.now()}`,
      claimedCount: 0,
    };
    setOffers((prev) => [newOffer, ...prev]);
    showToast(`Created promotion "${newOffer.code}"`);
  };

  const updateOffer = (id: string, offer: Partial<Offer>) => {
    setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, ...offer } : o)));
    showToast('Promotion updated');
  };

  const deleteOffer = (id: string) => {
    setOffers((prev) => prev.filter((o) => o.id !== id));
    showToast('Promotion deleted', 'info');
  };

  const toggleOfferActive = (id: string) => {
    setOffers((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          const nextActive = !o.isActive;
          showToast(`Promotion "${o.code}" ${nextActive ? 'activated' : 'paused'}`);
          return { ...o, isActive: nextActive };
        }
        return o;
      })
    );
  };

  const updateTableStatus = (tableNumber: number, status: TableStatus) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.tableNumber === tableNumber) {
          return {
            ...t,
            status,
            activeGuests: status === 'vacant' ? 0 : t.activeGuests || 2,
            currentBill: status === 'vacant' ? 0 : t.currentBill || 500,
          };
        }
        return t;
      })
    );
    showToast(`Table ${tableNumber} updated to ${status.replace('_', ' ')}`);
  };

  const updateTableUPI = (tableNumber: number, upi: string) => {
    setTables((prev) => prev.map((t) => (t.tableNumber === tableNumber ? { ...t, upiVpa: upi } : t)));
    showToast(`Table ${tableNumber} UPI mapped to ${upi}`);
  };

  const addTable = (capacity: number, section: TableQR['section']) => {
    const nextNum = Math.max(...tables.map((t) => t.tableNumber), 0) + 1;
    const newTable: TableQR = {
      tableNumber: nextNum,
      capacity,
      section,
      status: 'vacant',
      upiVpa: profile.upiVpa,
    };
    setTables((prev) => [...prev, newTable]);
    showToast(`Table ${nextNum} added to ${section}`);
  };

  const triggerLiveVisit = () => {
    const randomTables = [1, 2, 5, 7, 9, 10, 12];
    const pickedTable = randomTables[Math.floor(Math.random() * randomTables.length)];
    const names = ['Kavita Rao', 'Arjun Saxena', 'Tanvi Singhania', 'Manish Reddy', 'Deepak Joshi'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const bill = Math.floor(Math.random() * 1200) + 450;
    const discount = Math.round(bill * 0.3);

    const newVisit: LiveVisit = {
      id: `v_${Date.now()}`,
      tableNumber: pickedTable,
      customerName: randomName,
      timestamp: 'Just now',
      amount: bill,
      discountApplied: discount,
      coinsEarned: Math.round(bill * 0.05),
      status: 'paid_verified',
      paymentMethod: 'UPI',
    };

    setVisits((prev) => [newVisit, ...prev.slice(0, 14)]);
    updateTableStatus(pickedTable, 'paid_verified');
    showToast(`🎉 New live dine-in payment verified! Table ${pickedTable}: ₹${bill} via UPI`, 'success');
  };

  const replyToReview = (id: string, text: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              reply: {
                text,
                repliedAt: 'Just now',
              },
            }
          : r
      )
    );
    showToast('Reply published to diner review');
  };

  const resetAllData = () => {
    setProfile(INITIAL_PROFILE);
    setMenuItems(INITIAL_MENU_ITEMS);
    setOffers(INITIAL_OFFERS);
    setTables(INITIAL_TABLES);
    setVisits(INITIAL_VISITS);
    setReviews(INITIAL_REVIEWS);
    setStoreStatusState('open');
    showToast('Demo data reset to Restrofe default pitch deck state');
  };

  return (
    <RestaurantContext.Provider
      value={{
        activeTab,
        setActiveTab,
        profile,
        updateProfile,
        storeStatus,
        setStoreStatus,
        menuItems,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleStock,
        offers,
        addOffer,
        updateOffer,
        deleteOffer,
        toggleOfferActive,
        tables,
        updateTableStatus,
        updateTableUPI,
        addTable,
        visits,
        triggerLiveVisit,
        reviews,
        replyToReview,
        selectedStandeeTable,
        setSelectedStandeeTable,
        toast,
        showToast,
        resetAllData,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};
