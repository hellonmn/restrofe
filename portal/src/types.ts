export type StoreStatus = 'open' | 'busy' | 'closed';

export interface RestaurantProfile {
  id: string;
  name: string;
  tagline: string;
  cuisine: string[];
  phone: string;
  email: string;
  address: string;
  city: string;
  status: StoreStatus;
  fssaiNumber: string;
  gstin: string;
  openingHours: string;
  upiVpa: string;
  bankDetails: {
    accountNumber: string;
    ifsc: string;
    bankName: string;
    beneficiaryName: string;
  };
  subscription: {
    plan: string;
    trialDaysLeft: number;
    commissionRate: number; // 0% as per pitch deck
    validTill: string;
  };
}

export type MenuCategory =
  | 'All'
  | 'Burgers'
  | 'Pizzas'
  | 'Appetizers'
  | 'Mains'
  | 'Beverages'
  | 'Desserts';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  category: string;
  isVeg: boolean;
  inStock: boolean;
  prepTimeMinutes: number;
  rating: number;
  reviewCount: number;
  image: string;
  tags?: string[];
}

export type OfferType = 'stacked' | 'bill_flat' | 'happy_hour' | 'loyalty_streak';

export interface Offer {
  id: string;
  code: string;
  title: string;
  description: string;
  discountPercent: number;
  maxDiscount?: number;
  minBill: number;
  isStacked: boolean; // Restaurant discount + Restrofe coin boost
  coinBoostPercent?: number; // e.g. +20% coins
  type: OfferType;
  validDays: string[];
  validUntil: string;
  isActive: boolean;
  claimedCount: number;
}

export type TableSection = 'Indoor Main' | 'Patio Garden' | 'Rooftop Terrace' | 'Bar Counter';
export type TableStatus = 'vacant' | 'seated' | 'bill_pending' | 'paid_verified';

export interface TableQR {
  tableNumber: number;
  section: TableSection;
  capacity: number;
  status: TableStatus;
  activeGuests?: number;
  currentBill?: number;
  lastScannedTime?: string;
  upiVpa: string;
}

export interface LiveVisit {
  id: string;
  tableNumber: number;
  customerName: string;
  timestamp: string;
  amount: number;
  discountApplied: number;
  coinsEarned: number;
  status: 'seated' | 'ordered' | 'paid_verified' | 'offer_claimed';
  paymentMethod: 'UPI' | 'Restrofe Wallet' | 'Direct QR';
}

export interface CustomerReview {
  id: string;
  customerName: string;
  avatar?: string;
  rating: number;
  date: string;
  comment: string;
  tableNumber: number;
  billAmount: number;
  verifiedDiner: boolean;
  reply?: {
    text: string;
    repliedAt: string;
  };
}

export interface DailyMetric {
  date: string;
  visits: number;
  revenue: number;
  avgBill: number;
}

export interface HourlyTraffic {
  hour: string;
  diners: number;
  isPeak: boolean;
}
