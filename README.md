# Restrofe 🍽️

> **"One app for customers. One portal for restaurants."**  
> Direct Diners • Stacked Discounts • Table QR & Instant UPI • 0% Commission Forever

Restrofe is an F&B ecosystem designed to eliminate high aggregator commissions (20–30%) by connecting diners directly with dine-in restaurants through table QR ordering, stacked promotions (store discounts + Restrofe coin boosts), and direct merchant UPI settlements.

---

## Architecture Overview

| Component | Platform | Tech Stack | Purpose |
|---|---|---|---|
| **Diner Mobile App** | iOS & Android | Expo SDK 57, React Native 0.86, Expo Router | Table QR scanner, live digital menus, stacked coin wallet, table checkouts |
| **Restaurant Partner Portal** | Web Desktop | React 19, TypeScript, Vite, Tailwind CSS | Menu manager, stacked offers engine, table QR standee generator, analytics & 0% settlement ledger |

---

## 1. Restaurant Web Portal (`portal/`)

The Restaurant Partner Portal allows restaurant owners and managers to control live store operations, menus, pricing, stacked discounts, and print physical table standees.

### Features
* **Live Operations Dashboard:** Track active tables, verified QR revenue, average check value, and live aggregator savings (0% commission).
* **Menu Catalog & Stock Control:** Add/edit dishes, manage dietary flags (Veg/Non-Veg), prep times, prices, and instant 86 / Sold-Out toggles.
* **Restrofe Stacked Discounts Engine:** Launch promotions combining store discounts with Restrofe Coin boosts (e.g. 30% Off Dine-In + 20% Coin Boost).
* **Table QR & Standees Generator:** Table-specific QR codes with direct UPI routing (`burgerhouse@hdfcbank`), high-resolution canvas rendering, and print-ready acrylic standee previews.
* **Guest Analytics & Verified Reviews:** Peak dining hours heatmap, repeat diner streak tracking, and manager reply functionality for verified reviews.
* **0% Commission & Bank Settlements:** Direct peer-to-merchant settlement tracking, 1-month free trial monitor, and linked bank account management.

### Running the Web Portal

From the repository root:
```bash
# Start the web portal dev server (runs on http://localhost:3000)
npm run portal

# Or navigate directly to the portal directory:
cd portal
npm run dev
```

To build for production:
```bash
npm run portal:build
```

---

## 2. Diner Mobile App (`src/`)

The customer-facing mobile application built with Expo Router.

### Running the Mobile App

From the repository root:
```bash
# Install root dependencies (if not already installed)
npm install

# Start the Expo development server
npx expo start
```

Press `a` for Android Emulator, `i` for iOS Simulator, or scan the QR code with Expo Go on a physical device.

### Quality Checks
```bash
# Check TypeScript types
npx tsc --noEmit

# Run ESLint
npm run lint
```
