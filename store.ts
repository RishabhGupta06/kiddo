import { create } from 'zustand';
import { Alert, Linking } from 'react-native';
import { ServerPayload, ThemeType, ThemeColors, ComponentData, Action, Product } from './types';
import mockData from './mockData.json';

// Compute a global catalog of all products across all themes
const globalAllProducts: Product[] = [];
const extractProducts = (layouts: ComponentData[]) => {
  layouts.forEach(component => {
    if ((component.type === 'PRODUCT_GRID_2X2' || component.type === 'DYNAMIC_COLLECTION') && component.products) {
      component.products.forEach(p => {
        if (!globalAllProducts.find(existing => existing.id === p.id)) {
          globalAllProducts.push(p);
        }
      });
    }
  });
};

interface CartState {
  cart: Record<string, number>;
  theme: ThemeType;
  colors: ThemeColors;
  layout: ComponentData[];
  couponDiscount: number; // State to track coupon discounts dynamically
  
  // Actions
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  setTheme: (theme: ThemeType) => void;
  handleAction: (action: Action) => void;
}

// Predefined mock data for each theme to show Server-Driven UI updates
const themePayloads: Record<ThemeType, { colors: ThemeColors; layout: ComponentData[] }> = {
  back_to_school: {
    colors: mockData.colors as ThemeColors,
    // Add FULL_SCREEN_OVERLAY to school campaign layout from server JSON structure
    layout: [
      {
        type: 'FULL_SCREEN_OVERLAY',
        id: 'overlay_school_campaign',
        animationUrl: 'https://assets.example.com/pencils_school.json'
      },
      ...(mockData.layout as ComponentData[])
    ],
  },
  summer_playhouse: {
    colors: {
      primary: '#4FC3F7',
      background: '#E1F5FE',
      cardBackground: '#FFFFFF',
      text: '#01579B',
      subtext: '#0288D1',
      border: '#B3E5FC',
      accent: '#00E5FF',
    },
    layout: [
      // Dynamic overlay component in server configuration
      {
        type: 'FULL_SCREEN_OVERLAY',
        id: 'overlay_summer_campaign',
        animationUrl: 'https://assets.example.com/water_summer.json'
      },
      {
        type: 'BANNER_HERO',
        id: 'banner_summer',
        title: 'Baby\'s First Summer!',
        subtitle: 'Splashing water toys and pool floats for infants.',
        imageUrl: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=800&auto=format&fit=crop',
        action: {
          type: 'OPEN_LINK',
          payload: {
            url: 'https://kiddo-app.com/sales/summer-baby'
          }
        }
      },
      {
        type: 'PRODUCT_GRID_2X2',
        id: 'grid_water_toys',
        title: 'Infant Water Toys 🧸',
        products: [
          {
            id: "prod_baby_float",
            name: "Shaded Infant Pool Float",
            price: 599,
            originalPrice: 850,
            imageUrl: "https://images.unsplash.com/photo-1537655780520-1e392edd816a?w=400&auto=format&fit=crop",
            category: "Pool Essentials",
            action: {
              type: "ADD_TO_CART",
              payload: { productId: "prod_baby_float" }
            }
          },
          {
            id: "prod_swim_diaper",
            name: "Reusable Swim Diaper",
            price: 399,
            originalPrice: 599,
            imageUrl: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&auto=format&fit=crop",
            category: "Apparel",
            action: {
              type: "ADD_TO_CART",
              payload: { productId: "prod_swim_diaper" }
            }
          },
          {
            id: "prod_sun_hat",
            name: "UPF 50+ Baby Sun Hat",
            price: 250,
            originalPrice: 350,
            imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&auto=format&fit=crop",
            category: "Apparel",
            action: {
              type: "ADD_TO_CART",
              payload: { productId: "prod_sun_hat" }
            }
          },
          {
            id: "prod_splash_mat",
            name: "Sprinkler Splash Mat",
            price: 450,
            originalPrice: 600,
            imageUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&auto=format&fit=crop",
            category: "Toys",
            action: {
              type: "ADD_TO_CART",
              payload: { productId: "prod_splash_mat" }
            }
          }
        ]
      },
      {
        type: 'DYNAMIC_COLLECTION',
        id: 'coll_zoo_tickets',
        title: 'Baby Friendly Parks 🦁',
        products: [
          {
            id: "tkt_family",
            name: "Toddler Park Family Pass",
            price: 1200,
            originalPrice: 1500,
            imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&auto=format&fit=crop",
            category: "Tickets",
            action: {
              type: "ALERT",
              payload: { message: "Booking Toddler Park Family Pass ticket... Redirecting to checkout!" }
            }
          },
          {
            id: "tkt_safari",
            name: "Petting Zoo Entry (Under 3 Free)",
            price: 450,
            originalPrice: 600,
            imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&auto=format&fit=crop",
            category: "Tours",
            action: {
              type: "ALERT",
              payload: { message: "Adding Petting Zoo Entry to your cart!" }
            }
          }
        ]
      }
    ]
  },
  mystery_gift_carnival: {
    colors: {
      primary: '#F48FB1',
      background: '#FCE4EC',
      cardBackground: '#FFFFFF',
      text: '#880E4F',
      subtext: '#C2185B',
      border: '#F8BBD0',
      accent: '#FF4081',
    },
    layout: [
      // Dynamic overlay component in server configuration
      {
        type: 'FULL_SCREEN_OVERLAY',
        id: 'overlay_carnival_campaign',
        animationUrl: 'https://assets.example.com/confetti_carnival.json'
      },
      {
        type: 'BANNER_HERO',
        id: 'banner_carnival',
        title: 'Baby Mystery Box!',
        subtitle: 'Crack the mystery box. Rattles, teethers & soft books!',
        imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop',
        action: {
          type: 'ALERT',
          payload: { message: "Welcome to the Mystery Gift Carnival! Spend ₹500 to claim a free scratch card!" }
        }
      },
      {
        type: 'PRODUCT_GRID_2X2',
        id: 'grid_mystery_gifts',
        title: 'Baby Surprise Boxes 🎁',
        products: [
          {
            id: "gift_rattles",
            name: "Wooden Rattle Set",
            price: 599,
            originalPrice: 999,
            imageUrl: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&auto=format&fit=crop",
            category: "Toys",
            action: {
              type: "ADD_TO_CART",
              payload: { productId: "gift_rattles" }
            }
          },
          {
            id: "gift_teethers",
            name: "Silicone Teether Bundle",
            price: 450,
            originalPrice: 600,
            imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&auto=format&fit=crop",
            category: "Toys",
            action: {
              type: "ADD_TO_CART",
              payload: { productId: "gift_teethers" }
            }
          },
          {
            id: "gift_books",
            name: "Soft Cloth Books (Set of 3)",
            price: 799,
            originalPrice: 1200,
            imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop",
            category: "Books",
            action: {
              type: "ADD_TO_CART",
              payload: { productId: "gift_books" }
            }
          },
          {
            id: "gift_clothing_bundle",
            name: "Mystery Organic Cotton Onesies",
            price: 899,
            originalPrice: 1499,
            imageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&auto=format&fit=crop",
            category: "Clothing",
            action: {
              type: "ADD_TO_CART",
              payload: { productId: "gift_clothing_bundle" }
            }
          }
        ]
      },
      {
        type: 'DYNAMIC_COLLECTION',
        id: 'coll_baby_clothes_toys',
        title: 'Cute Baby Clothes & Toys 🧸',
        products: [
          {
            id: "prod_sleepsuit",
            name: "Organic Cotton Sleepsuit",
            price: 599,
            originalPrice: 899,
            imageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&auto=format&fit=crop",
            category: "Clothing",
            action: { type: "ADD_TO_CART", payload: { productId: "prod_sleepsuit" } }
          },
          {
            id: "prod_bunny_toy",
            name: "Plush Bunny Toy",
            price: 350,
            originalPrice: 500,
            imageUrl: "https://images.unsplash.com/photo-1558244402-286dd748c593?w=400&auto=format&fit=crop",
            category: "Toys",
            action: { type: "ADD_TO_CART", payload: { productId: "prod_bunny_toy" } }
          },
          {
            id: "prod_cot_mobile",
            name: "Musical Cot Mobile",
            price: 1200,
            originalPrice: 1500,
            imageUrl: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&auto=format&fit=crop",
            category: "Toys",
            action: { type: "ADD_TO_CART", payload: { productId: "prod_cot_mobile" } }
          },
          {
            id: "prod_cardigan",
            name: "Knitted Baby Cardigan",
            price: 750,
            originalPrice: 1100,
            imageUrl: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=400&auto=format&fit=crop",
            category: "Clothing",
            action: { type: "ADD_TO_CART", payload: { productId: "prod_cardigan" } }
          },
          {
            id: "prod_stacking_rings",
            name: "Stacking Rings Toy",
            price: 499,
            originalPrice: 650,
            imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&auto=format&fit=crop",
            category: "Toys",
            action: { type: "ADD_TO_CART", payload: { productId: "prod_stacking_rings" } }
          }
        ]
      },
      {
        type: 'DYNAMIC_COLLECTION',
        id: 'coll_coupons',
        title: 'Mystery Gift Coupons 🎟️',
        products: [
          {
            id: "coup_delivery",
            name: "Free Delivery Coupon",
            price: 10,
            originalPrice: 50,
            imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&auto=format&fit=crop",
            category: "Coupons",
            // Bind APPLY_MYSTERY_GIFT_COUPON macro action
            action: {
              type: "APPLY_MYSTERY_GIFT_COUPON",
              payload: { couponCode: "FREE_DEL_COUP", message: "Activating Free Delivery Code..." }
            }
          },
          {
            id: "coup_cashback",
            name: "Flat ₹150 Discount Coupon",
            price: 25,
            originalPrice: 150,
            imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&auto=format&fit=crop",
            category: "Coupons",
            // Bind APPLY_MYSTERY_GIFT_COUPON macro action
            action: {
              type: "APPLY_MYSTERY_GIFT_COUPON",
              payload: { couponCode: "MYSTERY150", message: "Activating flat ₹150 discount..." }
            }
          },
          {
            id: "coup_b1g1",
            name: "Buy 1 Get 1 Free Teether",
            price: 99,
            originalPrice: 500,
            imageUrl: "https://images.unsplash.com/photo-1537655780520-1e392edd816a?w=400&auto=format&fit=crop",
            category: "Coupons",
            action: {
              type: "APPLY_MYSTERY_GIFT_COUPON",
              payload: { couponCode: "B1G1_TOY", message: "Activating B1G1 Toy Voucher..." }
            }
          }
        ]
      }
    ]
  }
};

// Populate the global product registry
extractProducts(mockData.layout as ComponentData[]);
Object.values(themePayloads).forEach(theme => {
  extractProducts(theme.layout);
});
export { globalAllProducts };

export const useCartStore = create<CartState>((set, get) => ({
  cart: {},
  theme: mockData.theme as ThemeType,
  colors: mockData.colors as ThemeColors,
  // Add overlay to startup layout
  layout: [
    {
      type: 'FULL_SCREEN_OVERLAY',
      id: 'overlay_school_campaign',
      animationUrl: 'https://assets.example.com/pencils_school.json'
    },
    ...(mockData.layout as ComponentData[])
  ],
  couponDiscount: 0,

  addToCart: (productId: string) => {
    console.log(`[useCartStore] Incrementing quantity for product: ${productId}`);
    set((state) => ({
      cart: {
        ...state.cart,
        [productId]: (state.cart[productId] || 0) + 1,
      },
    }));
  },

  removeFromCart: (productId: string) => {
    console.log(`[useCartStore] Decrementing quantity for product: ${productId}`);
    set((state) => {
      const currentQty = state.cart[productId] || 0;
      if (currentQty <= 1) {
        const newCart = { ...state.cart };
        delete newCart[productId];
        return { cart: newCart };
      }
      return {
        cart: {
          ...state.cart,
          [productId]: currentQty - 1,
        },
      };
    });
  },

  setTheme: (theme: ThemeType) => {
    console.log(`[useCartStore] Theme changing to: ${theme}`);
    const payload = themePayloads[theme];
    if (payload) {
      set({
        theme,
        colors: payload.colors,
        layout: payload.layout,
      });
    }
  },

  handleAction: (action: Action) => {
    console.log(`[Action Traffic Cop] Handling action: ${JSON.stringify(action)}`);
    const { type, payload } = action;

    switch (type) {
      case 'ADD_TO_CART':
        if (payload.productId) {
          get().addToCart(payload.productId);
        }
        break;
        
      case 'OPEN_LINK':
        if (payload.url) {
          Linking.canOpenURL(payload.url)
            .then((supported) => {
              if (supported) {
                Linking.openURL(payload.url!);
              } else {
                Alert.alert('Link Visited', `Simulating navigation to URL: ${payload.url}`);
              }
            })
            .catch(() => {
              Alert.alert('Link Visited', `Simulating navigation to URL: ${payload.url}`);
            });
        }
        break;
        
      case 'ALERT':
        if (payload.message) {
          Alert.alert('Kiddo Live Sale', payload.message);
        }
        break;

      case 'APPLY_MYSTERY_GIFT_COUPON':
        if (payload.couponCode) {
          const discountValue = payload.couponCode === 'MYSTERY150' ? 150 : 50;
          set({ couponDiscount: discountValue });
          Alert.alert(
            'Coupon Applied! 🎁',
            `Congratulations! Code "${payload.couponCode}" applied successfully. You saved ₹${discountValue} on your next checkout.`
          );
        }
        break;

      default:
        console.warn(`[Action Traffic Cop] Unsupported action type: ${type}`);
    }
  },
}));
