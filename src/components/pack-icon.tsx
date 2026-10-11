import React from 'react';
import { Image, ImageStyle } from 'expo-image';
import { StyleProp } from 'react-native';

const ICONS: Record<string, any> = {
  // Navigation & Core
  home: require('../../assets/icons/pack1/svg/fi-rr-home.svg'),
  'home-outline': require('../../assets/icons/pack1/svg/fi-rr-home.svg'),
  search: require('../../assets/icons/pack1/svg/fi-rr-search.svg'),
  'search-outline': require('../../assets/icons/pack1/svg/fi-rr-search.svg'),
  bag: require('../../assets/icons/pack1/svg/fi-rr-shopping-bag.svg'),
  'bag-outline': require('../../assets/icons/pack1/svg/fi-rr-shopping-bag.svg'),
  'bag-handle': require('../../assets/icons/pack1/svg/fi-rr-shopping-bag.svg'),
  'bag-handle-outline': require('../../assets/icons/pack1/svg/fi-rr-shopping-bag.svg'),
  orders: require('../../assets/icons/pack1/svg/fi-rr-shopping-bag.svg'),
  'shopping-bag': require('../../assets/icons/pack1/svg/fi-rr-shopping-bag.svg'),
  cart: require('../../assets/icons/pack1/svg/fi-rr-shopping-cart.svg'),
  'shopping-cart': require('../../assets/icons/pack1/svg/fi-rr-shopping-cart.svg'),
  user: require('../../assets/icons/pack1/svg/fi-rr-user.svg'),
  person: require('../../assets/icons/pack1/svg/fi-rr-user.svg'),
  'person-outline': require('../../assets/icons/pack1/svg/fi-rr-user.svg'),
  profile: require('../../assets/icons/pack1/svg/fi-rr-user.svg'),

  // Feedback & Status
  star: require('../../assets/icons/pack1/svg/fi-rr-star.svg'),
  'star-outline': require('../../assets/icons/pack1/svg/fi-rr-star.svg'),
  heart: require('../../assets/icons/pack1/svg/fi-rr-heart.svg'),
  'heart-outline': require('../../assets/icons/pack1/svg/fi-rr-heart.svg'),
  bell: require('../../assets/icons/pack1/svg/fi-rr-bell.svg'),
  notifications: require('../../assets/icons/pack1/svg/fi-rr-bell.svg'),
  'notifications-outline': require('../../assets/icons/pack1/svg/fi-rr-bell.svg'),
  'notifications-off-outline': require('../../assets/icons/pack1/svg/fi-rr-bell.svg'),

  // Location & Navigation
  marker: require('../../assets/icons/pack1/svg/fi-rr-marker.svg'),
  location: require('../../assets/icons/pack1/svg/fi-rr-marker.svg'),
  'location-sharp': require('../../assets/icons/pack1/svg/fi-rr-marker.svg'),
  'location-outline': require('../../assets/icons/pack1/svg/fi-rr-marker.svg'),

  // Chevrons & Arrows
  'chevron-right': require('../../assets/icons/pack1/svg/fi-rr-angle-small-right.svg'),
  'chevron-forward': require('../../assets/icons/pack1/svg/fi-rr-angle-small-right.svg'),
  'arrow-right': require('../../assets/icons/pack1/svg/fi-rr-angle-small-right.svg'),
  'arrow-forward': require('../../assets/icons/pack1/svg/fi-rr-angle-small-right.svg'),
  'chevron-left': require('../../assets/icons/pack1/svg/fi-rr-angle-small-left.svg'),
  'chevron-back': require('../../assets/icons/pack1/svg/fi-rr-angle-small-left.svg'),
  'arrow-left': require('../../assets/icons/pack1/svg/fi-rr-angle-small-left.svg'),
  'arrow-back': require('../../assets/icons/pack1/svg/fi-rr-angle-small-left.svg'),
  'chevron-down': require('../../assets/icons/pack1/svg/fi-rr-angle-small-down.svg'),
  'arrow-down': require('../../assets/icons/pack1/svg/fi-rr-angle-small-down.svg'),
  'chevron-up': require('../../assets/icons/pack1/svg/fi-rr-angle-small-up.svg'),
  'arrow-up': require('../../assets/icons/pack1/svg/fi-rr-angle-small-up.svg'),

  // Controls & Actions
  plus: require('../../assets/icons/pack1/svg/fi-rr-plus.svg'),
  add: require('../../assets/icons/pack1/svg/fi-rr-plus.svg'),
  'add-circle': require('../../assets/icons/pack1/svg/fi-rr-plus.svg'),
  minus: require('../../assets/icons/pack1/svg/fi-rr-minus.svg'),
  remove: require('../../assets/icons/pack1/svg/fi-rr-minus.svg'),
  cross: require('../../assets/icons/pack1/svg/fi-rr-cross.svg'),
  close: require('../../assets/icons/pack1/svg/fi-rr-cross.svg'),
  'close-circle': require('../../assets/icons/pack1/svg/fi-rr-cross.svg'),
  check: require('../../assets/icons/pack1/svg/fi-rr-check.svg'),
  checkmark: require('../../assets/icons/pack1/svg/fi-rr-check.svg'),
  'checkmark-circle': require('../../assets/icons/pack1/svg/fi-rr-check.svg'),
  trash: require('../../assets/icons/pack1/svg/fi-rr-trash.svg'),
  'trash-outline': require('../../assets/icons/pack1/svg/fi-rr-trash.svg'),
  refresh: require('../../assets/icons/pack1/svg/fi-rr-refresh.svg'),
  filter: require('../../assets/icons/pack1/svg/fi-rr-filter.svg'),
  settings: require('../../assets/icons/pack1/svg/fi-rr-settings.svg'),
  share: require('../../assets/icons/pack1/svg/fi-rr-share.svg'),
  'share-outline': require('../../assets/icons/pack1/svg/fi-rr-share.svg'),
  edit: require('../../assets/icons/pack1/svg/fi-rr-edit.svg'),
  'create-outline': require('../../assets/icons/pack1/svg/fi-rr-edit.svg'),

  // Food, Business, Time
  clock: require('../../assets/icons/pack1/svg/fi-rr-clock.svg'),
  time: require('../../assets/icons/pack1/svg/fi-rr-clock.svg'),
  'time-outline': require('../../assets/icons/pack1/svg/fi-rr-clock.svg'),
  utensils: require('../../assets/icons/pack1/svg/fi-rr-utensils.svg'),
  restaurant: require('../../assets/icons/pack1/svg/fi-rr-utensils.svg'),
  ticket: require('../../assets/icons/pack1/svg/fi-rr-ticket.svg'),
  coupon: require('../../assets/icons/pack1/svg/fi-rr-ticket.svg'),
  pricetag: require('../../assets/icons/pack1/svg/fi-rr-ticket.svg'),
  'pricetag-outline': require('../../assets/icons/pack1/svg/fi-rr-ticket.svg'),
  receipt: require('../../assets/icons/pack1/svg/fi-rr-receipt.svg'),
  'receipt-outline': require('../../assets/icons/pack1/svg/fi-rr-receipt.svg'),
  bike: require('../../assets/icons/pack1/svg/fi-rr-bike.svg'),
  bicycle: require('../../assets/icons/pack1/svg/fi-rr-bike.svg'),
  'bicycle-outline': require('../../assets/icons/pack1/svg/fi-rr-bike.svg'),
  flame: require('../../assets/icons/pack1/svg/fi-rr-flame.svg'),
  bolt: require('../../assets/icons/pack1/svg/fi-rr-bolt.svg'),
  flash: require('../../assets/icons/pack1/svg/fi-rr-bolt.svg'),
  'flash-outline': require('../../assets/icons/pack1/svg/fi-rr-bolt.svg'),
  leaf: require('../../assets/icons/pack1/svg/fi-rr-leaf.svg'),
  'leaf-outline': require('../../assets/icons/pack1/svg/fi-rr-leaf.svg'),

  // Security, Audio, Comm
  mic: require('../../assets/icons/pack1/svg/fi-rr-microphone.svg'),
  'mic-outline': require('../../assets/icons/pack1/svg/fi-rr-microphone.svg'),
  microphone: require('../../assets/icons/pack1/svg/fi-rr-microphone.svg'),
  shield: require('../../assets/icons/pack1/svg/fi-rr-shield.svg'),
  'shield-checkmark': require('../../assets/icons/pack1/svg/fi-rr-shield-check.svg'),
  lock: require('../../assets/icons/pack1/svg/fi-rr-lock.svg'),
  exit: require('../../assets/icons/pack1/svg/fi-rr-sign-out-alt.svg'),
  'sign-out': require('../../assets/icons/pack1/svg/fi-rr-sign-out-alt.svg'),
  'log-out': require('../../assets/icons/pack1/svg/fi-rr-sign-out-alt.svg'),
  'log-out-outline': require('../../assets/icons/pack1/svg/fi-rr-sign-out-alt.svg'),
  comment: require('../../assets/icons/pack1/svg/fi-rr-comment.svg'),
  chat: require('../../assets/icons/pack1/svg/fi-rr-comment.svg'),
  'chatbubble-ellipses-outline': require('../../assets/icons/pack1/svg/fi-rr-comment.svg'),
  phone: require('../../assets/icons/pack1/svg/fi-rr-phone-call.svg'),
  'phone-portrait-outline': require('../../assets/icons/pack1/svg/fi-rr-phone-call.svg'),
  wallet: require('../../assets/icons/pack1/svg/fi-rr-wallet.svg'),
  'wallet-outline': require('../../assets/icons/pack1/svg/fi-rr-wallet.svg'),
  card: require('../../assets/icons/pack1/svg/fi-rr-credit-card.svg'),
  'card-outline': require('../../assets/icons/pack1/svg/fi-rr-credit-card.svg'),
  'alert-circle': require('../../assets/icons/pack1/svg/fi-rr-exclamation.svg'),
  info: require('../../assets/icons/pack1/svg/fi-rr-info.svg'),
  'information-circle-outline': require('../../assets/icons/pack1/svg/fi-rr-info.svg'),
  question: require('../../assets/icons/pack1/svg/fi-rr-question.svg'),
  help: require('../../assets/icons/pack1/svg/fi-rr-question.svg'),
  'help-circle-outline': require('../../assets/icons/pack1/svg/fi-rr-question.svg'),
  'shield-checkmark-outline': require('../../assets/icons/pack1/svg/fi-rr-shield-check.svg'),
};

export type PackIconName = keyof typeof ICONS | string;

export interface PackIconProps {
  name: PackIconName;
  size?: number;
  color?: string;
  style?: StyleProp<ImageStyle>;
}

export function PackIcon({ name, size = 20, color, style }: PackIconProps) {
  const normalized = (name || '').toLowerCase().trim();
  const source = ICONS[normalized] ?? ICONS[normalized.replace(/-outline$/, '')] ?? ICONS.home;
  return (
    <Image
      source={source}
      tintColor={color}
      contentFit="contain"
      style={[{ width: size, height: size }, style]}
    />
  );
}

export default PackIcon;
