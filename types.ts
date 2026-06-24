export type ActionType = 'ADD_TO_CART' | 'OPEN_LINK' | 'ALERT' | 'APPLY_MYSTERY_GIFT_COUPON';

export interface Action {
  type: ActionType;
  payload: {
    productId?: string;
    url?: string;
    message?: string;
    couponCode?: string;
  };
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  category: string;
  action: Action;
}

export type ComponentType = 'BANNER_HERO' | 'PRODUCT_GRID_2X2' | 'DYNAMIC_COLLECTION' | 'FULL_SCREEN_OVERLAY' | string;

export interface ComponentData {
  type: ComponentType;
  id: string;
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  animationUrl?: string; // For campaign overlay configurations
  action?: Action;
  products?: Product[];
}

export type ThemeType = 'back_to_school' | 'summer_playhouse' | 'mystery_gift_carnival';

export interface ThemeColors {
  primary: string;
  background: string;
  cardBackground: string;
  text: string;
  subtext: string;
  border: string;
  accent: string;
}

export interface ServerPayload {
  theme: ThemeType;
  colors: ThemeColors;
  layout: ComponentData[];
}
