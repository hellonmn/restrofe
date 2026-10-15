import React from 'react';

/**
 * Handcrafted Restrofe Culinary & Cafe Doodles
 * Designed to add organic, artisanal warmth to the partner portal.
 */

// 1. Sidebar Artisanal Coffee Cup & Botanical Leaves Doodle
export const SidebarCoffeeDoodle: React.FC<{
  className?: string;
  style?: React.CSSProperties;
  color?: string;
}> = ({ className = '', style = {}, color = '#E2A96B' }) => (
  <svg
    viewBox="0 0 160 110"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ width: '100%', maxWidth: '160px', height: 'auto', ...style }}
  >
    {/* Steam curls */}
    <path
      d="M74 38C72 30 78 24 76 16C75 12 71 8 74 3"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeDasharray="2 2"
      opacity="0.85"
    />
    <path
      d="M86 36C84 26 92 20 89 12C88 9 84 5 86 1"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      opacity="0.95"
    />
    <path
      d="M98 39C96 32 101 26 99 18C98 14 95 10 97 5"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeDasharray="3 2"
      opacity="0.75"
    />

    {/* Coffee Cup Body */}
    <path
      d="M60 44H112C112 44 113 72 86 72C59 72 60 44 60 44Z"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Cup Inner Rim / Coffee Surface */}
    <ellipse cx="86" cy="44" rx="26" ry="4.5" stroke={color} strokeWidth="1.6" />
    <path
      d="M66 47C72 50 98 50 106 47"
      stroke={color}
      strokeWidth="1.2"
      opacity="0.6"
    />

    {/* Cup Handle */}
    <path
      d="M111 48C119 48 126 53 124 61C122 68 114 67 108 66"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />

    {/* Saucer */}
    <ellipse cx="86" cy="74" rx="38" ry="6" stroke={color} strokeWidth="2" />
    <path
      d="M62 76C70 79 102 79 110 76"
      stroke={color}
      strokeWidth="1.3"
      opacity="0.7"
    />

    {/* Left Botanical Coffee Leaves */}
    <g opacity="0.85">
      {/* Main Left Leaf */}
      <path
        d="M52 76C40 73 30 63 26 49C35 48 46 54 50 66"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M26 49C34 56 42 66 50 72"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Smaller Side Leaf */}
      <path
        d="M44 82C34 83 24 88 18 96C24 99 34 97 40 91"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M18 96C27 92 34 88 42 84"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* Branch curve */}
      <path
        d="M16 98C22 92 36 84 56 80"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </g>

    {/* Right Botanical Coffee Leaves */}
    <g opacity="0.85">
      {/* Bottom right leaf */}
      <path
        d="M120 78C132 77 142 83 148 93C140 96 128 93 122 85"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M122 81C130 84 139 88 148 93"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* Branch stem */}
      <path
        d="M116 77C124 81 138 88 150 93"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </g>

    {/* Coffee Bean accent */}
    <g transform="translate(134, 52) rotate(18) scale(0.65)" opacity="0.9">
      <ellipse cx="10" cy="14" rx="7" ry="10" stroke={color} strokeWidth="2.2" />
      <path
        d="M10 5C13 9 7 19 10 23"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </g>
    <g transform="translate(38, 32) rotate(-22) scale(0.55)" opacity="0.75">
      <ellipse cx="10" cy="14" rx="7" ry="10" stroke={color} strokeWidth="2.2" />
      <path
        d="M10 5C13 9 7 19 10 23"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </g>
  </svg>
);

// 2. Table Doodles for the Live Table Floor Plan
export type TableDoodleType =
  | '2p-indoor'
  | '4p-rect'
  | '4p-round'
  | '6p-terrace'
  | 'patio-umbrella'
  | '4p-patio'
  | 'bar-stool'
  | 'banquet-8p';

// 2p Indoor Table (Round with 2 curved chairs)
export const Table2pDoodle: React.FC<{ size?: number; color?: string; opacity?: number }> = ({
  size = 36,
  color = '#94A3B8',
  opacity = 0.75,
}) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={{ opacity }}>
    {/* Left chair */}
    <path
      d="M9 13C6 16 6 24 9 27"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path d="M9 16H12V24H9" stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
    {/* Right chair */}
    <path
      d="M31 13C34 16 34 24 31 27"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path d="M31 16H28V24H31" stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
    {/* Center Table */}
    <circle cx="20" cy="20" r="7.5" stroke={color} strokeWidth="1.8" />
    <circle cx="20" cy="20" r="4.5" stroke={color} strokeWidth="1" strokeDasharray="2 2" />
    {/* Table base / legs */}
    <path d="M16 26L14 30M24 26L26 30" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

// 4p Indoor Rectangular Table with 4 chairs
export const Table4pRectDoodle: React.FC<{ size?: number; color?: string; opacity?: number }> = ({
  size = 36,
  color = '#94A3B8',
  opacity = 0.75,
}) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={{ opacity }}>
    {/* Top 2 chairs */}
    <path d="M13 8C13 6 17 6 17 8M23 8C23 6 27 6 27 8" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    <path d="M12 9H18M22 9H28" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    {/* Bottom 2 chairs */}
    <path d="M13 32C13 34 17 34 17 32M23 32C23 34 27 34 27 32" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    <path d="M12 31H18M22 31H28" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    {/* Table Top */}
    <rect x="10" y="11" width="20" height="18" rx="3.5" stroke={color} strokeWidth="1.8" />
    {/* Table surface placemats */}
    <rect x="13" y="13" width="5" height="4" rx="1" stroke={color} strokeWidth="1" opacity="0.6" />
    <rect x="22" y="13" width="5" height="4" rx="1" stroke={color} strokeWidth="1" opacity="0.6" />
    <rect x="13" y="23" width="5" height="4" rx="1" stroke={color} strokeWidth="1" opacity="0.6" />
    <rect x="22" y="23" width="5" height="4" rx="1" stroke={color} strokeWidth="1" opacity="0.6" />
  </svg>
);

// 4p Round Table (Circular with 4 surrounding chairs)
export const Table4pRoundDoodle: React.FC<{ size?: number; color?: string; opacity?: number }> = ({
  size = 36,
  color = '#94A3B8',
  opacity = 0.75,
}) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={{ opacity }}>
    {/* Top chair */}
    <path d="M16 7C18 5 22 5 24 7" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M16 9H24" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    {/* Bottom chair */}
    <path d="M16 33C18 35 22 35 24 33" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M16 31H24" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    {/* Left chair */}
    <path d="M7 16C5 18 5 22 7 24" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M9 16V24" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    {/* Right chair */}
    <path d="M33 16C35 18 35 22 33 24" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M31 16V24" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    {/* Center Table */}
    <circle cx="20" cy="20" r="8" stroke={color} strokeWidth="1.8" />
    <circle cx="20" cy="20" r="3" stroke={color} strokeWidth="1" strokeDasharray="2 1.5" />
  </svg>
);

// Patio Garden Table with Sun Umbrella / Parasol
export const TablePatioDoodle: React.FC<{ size?: number; color?: string; opacity?: number }> = ({
  size = 36,
  color = '#94A3B8',
  opacity = 0.75,
}) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={{ opacity }}>
    {/* Parasol / Umbrella Canopy */}
    <path
      d="M10 14C10 8 20 5 20 5C20 5 30 8 30 14C27 15 25 13 20 14C15 13 13 15 10 14Z"
      stroke={color}
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path d="M20 5V14" stroke={color} strokeWidth="1.2" />
    <path d="M15 11C17 9 20 5 20 5" stroke={color} strokeWidth="1" opacity="0.6" />
    <path d="M25 11C23 9 20 5 20 5" stroke={color} strokeWidth="1" opacity="0.6" />
    {/* Center Umbrella Pole */}
    <path d="M20 14V27" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    {/* Table Top */}
    <ellipse cx="20" cy="23" rx="9" ry="3.5" stroke={color} strokeWidth="1.6" />
    {/* Patio Table Legs */}
    <path d="M15 25L13 33M25 25L27 33M20 27V33" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    {/* 2 Garden chairs */}
    <path d="M7 21C6 24 7 28 9 29M6 25H11" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
    <path d="M33 21C34 24 33 28 31 29M34 25H29" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

// Bar Counter Cocktail Table with High Stools
export const TableBarStoolDoodle: React.FC<{ size?: number; color?: string; opacity?: number }> = ({
  size = 36,
  color = '#94A3B8',
  opacity = 0.75,
}) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={{ opacity }}>
    {/* High Table top */}
    <ellipse cx="20" cy="11" rx="8" ry="3" stroke={color} strokeWidth="1.7" />
    {/* Table Stem & Footring */}
    <path d="M20 14V33" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <ellipse cx="20" cy="26" rx="4" ry="1.5" stroke={color} strokeWidth="1.2" />
    <ellipse cx="20" cy="33" rx="7" ry="2" stroke={color} strokeWidth="1.6" />

    {/* Left High Bar Stool */}
    <ellipse cx="9" cy="17" rx="3.5" ry="1.5" stroke={color} strokeWidth="1.4" />
    <path d="M7 18.5L6 31M11 18.5L12 31" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
    <path d="M6.5 25H11.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" />

    {/* Right High Bar Stool */}
    <ellipse cx="31" cy="17" rx="3.5" ry="1.5" stroke={color} strokeWidth="1.4" />
    <path d="M29 18.5L28 31M33 18.5L34 31" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
    <path d="M28.5 25H33.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

// Rooftop Terrace / Large Banquet Family Table (8p)
export const TableBanquetDoodle: React.FC<{ size?: number; color?: string; opacity?: number }> = ({
  size = 36,
  color = '#94A3B8',
  opacity = 0.75,
}) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={{ opacity }}>
    {/* Banquet Table Top (Oval/Pill) */}
    <rect x="10" y="14" width="20" height="12" rx="6" stroke={color} strokeWidth="1.8" />
    <path d="M14 20H26" stroke={color} strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
    {/* 3 Top Chairs */}
    <path d="M12 10C12 8 15 8 15 10M18 10C18 8 22 8 22 10M25 10C25 8 28 8 28 10" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    <path d="M11 11H16M17 11H23M24 11H29" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
    {/* 3 Bottom Chairs */}
    <path d="M12 30C12 32 15 32 15 30M18 30C18 32 22 32 22 30M25 30C25 32 28 32 28 30" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    <path d="M11 29H16M17 29H23M24 29H29" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
    {/* 2 End Chairs */}
    <path d="M6 18C4 19 4 21 6 22M7 18V22" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
    <path d="M34 18C36 19 36 21 34 22M33 18V22" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

// Helper component that selects the correct table doodle based on table data
export const TableDoodleRenderer: React.FC<{
  tableNumber: number;
  section: string;
  capacity: number;
  size?: number;
  color?: string;
  opacity?: number;
}> = ({ tableNumber, section, capacity, size = 34, color = '#94A3B8', opacity = 0.7 }) => {
  // Patio garden tables
  if (section === 'Patio Garden' || tableNumber === 5) {
    if (tableNumber === 5) {
      return <TablePatioDoodle size={size} color={color} opacity={opacity} />;
    }
    return <Table4pRectDoodle size={size} color={color} opacity={opacity} />;
  }

  // Bar counter tables
  if (section === 'Bar Counter' || tableNumber >= 10) {
    return <TableBarStoolDoodle size={size} color={color} opacity={opacity} />;
  }

  // Large family banquet table
  if (capacity >= 8 || tableNumber === 9) {
    return <TableBanquetDoodle size={size} color={color} opacity={opacity} />;
  }

  // 6p rooftop terrace table
  if (capacity >= 6 || tableNumber === 4 || tableNumber === 8) {
    return <Table4pRoundDoodle size={size} color={color} opacity={opacity} />;
  }

  // 4p round table
  if (capacity === 4 && (tableNumber === 3 || tableNumber === 7)) {
    return <Table4pRoundDoodle size={size} color={color} opacity={opacity} />;
  }

  // 4p rect table
  if (capacity === 4 || tableNumber === 2 || tableNumber === 6) {
    return <Table4pRectDoodle size={size} color={color} opacity={opacity} />;
  }

  // Default: 2p round table
  return <Table2pDoodle size={size} color={color} opacity={opacity} />;
};

// 3. Delicate Botanical Coffee Branch Doodle (for Stat Cards)
export const CoffeeSproutDoodle: React.FC<{ size?: number; color?: string }> = ({
  size = 28,
  color = '#10B981',
}) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    {/* Stem */}
    <path
      d="M8 26C12 24 18 18 22 8"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      opacity="0.75"
    />
    {/* Top leaf */}
    <path
      d="M22 8C20 4 14 6 12 11C16 11 20 10 22 8Z"
      stroke={color}
      strokeWidth="1.4"
      strokeLinejoin="round"
      opacity="0.85"
    />
    {/* Right leaf */}
    <path
      d="M17 15C22 13 26 15 26 20C21 21 18 18 17 15Z"
      stroke={color}
      strokeWidth="1.4"
      strokeLinejoin="round"
      opacity="0.85"
    />
    {/* Small coffee cherry */}
    <circle cx="15" cy="18" r="2" stroke={color} strokeWidth="1.3" opacity="0.9" />
    <circle cx="18" cy="13" r="1.8" stroke={color} strokeWidth="1.2" opacity="0.75" />
  </svg>
);

// 4. Coffee Beans Pair Doodle (for Commission Saved / Savings card)
export const CoffeeBeansPairDoodle: React.FC<{ size?: number; color?: string }> = ({
  size = 28,
  color = '#8B5CF6',
}) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    {/* Left Bean */}
    <g transform="translate(6, 6) rotate(-15)">
      <ellipse cx="6" cy="9" rx="5" ry="7.5" stroke={color} strokeWidth="1.5" opacity="0.85" />
      <path d="M6 3C8 6 4 12 6 15" stroke={color} strokeWidth="1.4" strokeLinecap="round" opacity="0.85" />
    </g>
    {/* Right Bean */}
    <g transform="translate(16, 12) rotate(25)">
      <ellipse cx="5" cy="7" rx="4.5" ry="6.5" stroke={color} strokeWidth="1.5" opacity="0.85" />
      <path d="M5 2C7 5 3 9 5 12" stroke={color} strokeWidth="1.4" strokeLinecap="round" opacity="0.85" />
    </g>
    {/* Delicate aroma swirl */}
    <path
      d="M18 4C20 6 22 5 24 3"
      stroke={color}
      strokeWidth="1.2"
      strokeLinecap="round"
      opacity="0.6"
    />
  </svg>
);

// 5. Dining Table Floor Plan Header Badge Doodle
export const DiningTableIconBadge: React.FC<{ size?: number; color?: string }> = ({
  size = 22,
  color = '#9A3412',
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Tabletop */}
    <rect x="4" y="8" width="16" height="3" rx="1.5" stroke={color} strokeWidth="1.8" fill={color} fillOpacity="0.15" />
    {/* Table Legs */}
    <path d="M7 11V18M17 11V18" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    {/* Left Chair */}
    <path d="M2 10V16M2 13H4" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    {/* Right Chair */}
    <path d="M22 10V16M22 13H20" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

// 6. Cloche & Steam Culinary Doodle (for Menu Catalog header)
export const ChefClocheDoodle: React.FC<{ size?: number; color?: string }> = ({
  size = 32,
  color = '#FF5A1F',
}) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    {/* Dome Handle */}
    <circle cx="16" cy="9" r="1.8" stroke={color} strokeWidth="1.5" />
    {/* Dome */}
    <path
      d="M7 21C7 14 11 11 16 11C21 11 25 14 25 21H7Z"
      stroke={color}
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    {/* Platter base */}
    <path d="M5 23H27" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Rising steam dots */}
    <path d="M12 6C13 4 15 4 16 2" stroke={color} strokeWidth="1.3" strokeLinecap="round" opacity="0.75" />
    <path d="M19 6C20 4 22 4 23 2" stroke={color} strokeWidth="1.3" strokeLinecap="round" opacity="0.6" />
  </svg>
);

// 7. Stacked Coins & Gift Ribbon Doodle (for Offers & Promos)
export const PromoGiftCoinsDoodle: React.FC<{ size?: number; color?: string }> = ({
  size = 32,
  color = '#FF5A1F',
}) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    {/* Coin 1 bottom */}
    <ellipse cx="14" cy="23" rx="8" ry="3.5" stroke={color} strokeWidth="1.6" />
    <path d="M6 23V20C6 20 6 17 14 17C22 17 22 20 22 20V23" stroke={color} strokeWidth="1.6" />
    {/* Coin 2 top */}
    <ellipse cx="14" cy="15" rx="7.5" ry="3.2" stroke={color} strokeWidth="1.6" />
    {/* Star sparkle */}
    <path
      d="M24 7L25 10L28 11L25 12L24 15L23 12L20 11L23 10L24 7Z"
      stroke={color}
      strokeWidth="1.2"
      strokeLinejoin="round"
      opacity="0.9"
    />
    <circle cx="9" cy="8" r="1.5" fill={color} opacity="0.7" />
  </svg>
);
