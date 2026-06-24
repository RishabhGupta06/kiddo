import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Platform,
  useWindowDimensions,
  Animated,
  TextInput,
} from 'react-native';
import { useCartStore, globalAllProducts } from './store';
import { ComponentData } from './types';
import { ThemeProvider, useTheme } from './ThemeContext';

// Visual Components
import BannerHero from './components/BannerHero';
import ProductGrid2x2 from './components/ProductGrid2x2';
import DynamicCollection from './components/DynamicCollection';
import CartScreen from './components/CartScreen';

// Animations
import FallingPencilsAnimation from './components/animations/FallingPencilsAnimation';
import WaterSplashAnimation from './components/animations/WaterSplashAnimation';
import ConfettiAnimation from './components/animations/ConfettiAnimation';

// Icons
import { ShoppingBag, GraduationCap, Sun, Sparkles, Heart, Zap, ChevronDown, Wallet, UserCircle2, Search, Bike, CheckCircle2 } from 'lucide-react-native';

const COMPONENT_REGISTRY: Record<string, React.ComponentType<{ data: ComponentData }>> = {
  BANNER_HERO: BannerHero,
  PRODUCT_GRID_2X2: ProductGrid2x2,
  DYNAMIC_COLLECTION: DynamicCollection,
};

// Custom Kiddo Logo matching the brand screenshot
const KiddoLogo: React.FC = () => {
  return (
    <View style={styles.logoContainer}>
      <View style={styles.logoTextRow}>
        <Text style={styles.logoK}>K</Text>
        <View style={styles.logoIWrapper}>
          <Heart size={11} color="#F54E5E" fill="#F54E5E" style={styles.logoHeart} />
          <Text style={styles.logoI}>ı</Text>
        </View>
        <Text style={styles.logoDdo}>ddo</Text>
      </View>
      <View style={styles.logoBadgeContainer}>
        <Text style={styles.logoSlogan}>the best for your kiddo</Text>
        <View style={styles.logoPill}>
          <Text style={styles.logoPillText}>delivered in minutes</Text>
        </View>
      </View>
    </View>
  );
};

// Isolated Cart Indicator Component to prevent full App re-renders on cart update
const CartIndicator: React.FC<{ onPress: () => void }> = ({ onPress }) => {
  const { colors } = useTheme();
  const cart = useCartStore((state) => state.cart);
  
  const cartTotalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.cartIndicator, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
    >
      <ShoppingBag size={18} color={colors.text} />
      {cartTotalItems > 0 && (
        <View style={[styles.cartBadge, { backgroundColor: colors.primary }]}>
          <Text style={styles.cartBadgeText}>{cartTotalItems}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

// Custom Functional Free Delivery Banner
const FreeDeliveryBanner: React.FC = () => {
  const cart = useCartStore((state) => state.cart);
  const subtotal = Object.entries(cart).reduce((sum, [productId, quantity]) => {
    const product = globalAllProducts.find(p => p.id === productId);
    return sum + ((product?.price || 0) * quantity);
  }, 0);

  const FREE_DELIVERY_THRESHOLD = 999;
  const remaining = FREE_DELIVERY_THRESHOLD - subtotal;
  const isUnlocked = remaining <= 0;

  return (
    <View style={styles.freeDeliveryBanner}>
      <View style={styles.freeDeliveryIconBg}>
        {isUnlocked ? (
          <CheckCircle2 size={20} color="#4CAF50" />
        ) : (
          <Bike size={20} color="#FFFFFF" />
        )}
      </View>
      <View style={styles.freeDeliveryTextContainer}>
        <Text style={styles.freeDeliveryTitle}>
          {isUnlocked ? 'Free delivery unlocked' : 'Unlock free delivery'}
        </Text>
        <Text style={styles.freeDeliverySubtitle}>
          {isUnlocked ? 'Yay! No delivery charges on this order' : `Shop for ₹${remaining} more`}
        </Text>
      </View>
    </View>
  );
};

// Dynamic Overlay Resolver (Resolves FULL_SCREEN_OVERLAY parsed from layout JSON)
const FullScreenOverlayRenderer: React.FC<{ node?: ComponentData }> = ({ node }) => {
  if (!node) return null;
  const { theme } = useTheme();

  // Choose high-performance particle animation overlay based on active theme
  switch (theme) {
    case 'back_to_school':
      return <FallingPencilsAnimation />;
    case 'summer_playhouse':
      return <WaterSplashAnimation />;
    case 'mystery_gift_carnival':
      return <ConfettiAnimation />;
    default:
      return null;
  }
};

function AppContent() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [locationText, setLocationText] = useState('Detecting current location...');
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const layout = useCartStore((state) => state.layout);
  const theme = useCartStore((state) => state.theme);
  const setTheme = useCartStore((state) => state.setTheme);
  const { colors } = useTheme(); // Consuming colors dynamically via React Context Provider

  // Animation Refs
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;

  // Inject global CSS for font and color transitions on Web
  useEffect(() => {
    // 1. Fetch real-world location using the browser Geolocation API
    if (Platform.OS === 'web' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            // Use free OpenStreetMap Nominatim for reverse geocoding
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await res.json();
            if (data && data.address) {
              const addr = data.address;
              const street = addr.road || addr.suburb || addr.neighbourhood || '';
              const city = addr.city || addr.town || addr.county || '';
              const region = [street, city].filter(Boolean).join(', ');
              setLocationText(`Current - ${region || data.display_name}`);
            } else {
              setLocationText('Current Location (GPS Active)');
            }
          } catch (e) {
            setLocationText('Current Location (GPS Active)');
          }
        },
        (error) => {
          setLocationText('Home - 42 Nursery Lane (Please enable location access)');
        }
      );
    } else {
      setLocationText('Current Location (Simulated)');
    }

    // 2. Setup Fonts and CSS
    if (Platform.OS === 'web') {
      const link = document.createElement('link');
      link.href = 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap';
      link.rel = 'stylesheet';
      document.head.appendChild(link);

      const style = document.createElement('style');
      style.textContent = `
        * {
          font-family: 'Nunito', sans-serif !important;
          transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
        }
      `;
      document.head.append(style);
      return () => {
        style.remove();
        link.remove();
      };
    }
  }, []);

  const handleThemeChange = (newTheme: any) => {
    if (theme === newTheme) return;
    
    // Smoothly animate out current content
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(translateYAnim, { toValue: 10, duration: 150, useNativeDriver: true })
    ]).start(() => {
      // Swap the theme layout
      setTheme(newTheme);
      // Reset translateY to slightly below for the slide-up effect
      translateYAnim.setValue(10);
      
      // Smoothly animate in new content
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.timing(translateYAnim, { toValue: 0, duration: 250, useNativeDriver: true })
      ]).start();
    });
  };

  // Extract overlays and content components dynamically from the server JSON structure
  const overlayNode = layout.find((item) => item.type === 'FULL_SCREEN_OVERLAY');
  const mainContentLayout = layout.filter((item) => item.type !== 'FULL_SCREEN_OVERLAY');

  const renderItem = ({ item }: { item: ComponentData }) => {
    // Resolve component from Factory Registry Map
    const TargetComponent = COMPONENT_REGISTRY[item.type];
    
    if (!TargetComponent) {
      // RESILIENCE CRITICAL RULE: Fail gracefully on unrecognized type and drop the node quietly
      console.warn(`[SDUI Factory] Ignoring unrecognized type: "${item.type}"`);
      return null;
    }
    
    return <TargetComponent data={item} />;
  };

  const getThemeTitle = () => {
    switch (theme) {
      case 'back_to_school':
        return 'Back to School 🎒';
      case 'summer_playhouse':
        return 'Summer Playhouse 🏖️';
      case 'mystery_gift_carnival':
        return 'Mystery Carnival 🎪';
    }
  };

  const appView = (
    <SafeAreaView style={[styles.appContainer, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" />
      
      {/* A. TOP HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <KiddoLogo />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.walletPill}>
              <Wallet size={16} color="#673AB7" fill="#673AB7" style={{marginRight: 4}} />
              <Text style={styles.walletText}>₹0</Text>
            </View>
            <UserCircle2 size={26} color={colors.text} style={{marginLeft: 12, marginRight: 12}} />
            <CartIndicator onPress={() => setIsCartOpen(true)} />
          </View>
        </View>

        <View style={styles.deliveryInfoContainer}>
          <View style={styles.deliveryTimeRow}>
            <Zap size={24} color={colors.text} fill={colors.text} style={styles.zapIcon} />
            <Text style={[styles.deliveryTimeText, { color: colors.text }]}>20 minutes</Text>
          </View>
          <View style={styles.deliveryAddressRow}>
            <Text style={[styles.deliveryAddressText, { color: colors.text }]} numberOfLines={1}>
              {locationText}
            </Text>
            <ChevronDown size={14} color={colors.text} style={{ marginLeft: 4 }} />
          </View>
        </View>
      </View>

      {/* B. THEME SWITCHER BAR */}
      <View style={styles.themeBar}>
        <TouchableOpacity
          onPress={() => handleThemeChange('back_to_school')}
          style={[styles.zeptoTab, theme === 'back_to_school' ? styles.zeptoTabActive : styles.zeptoTabInactive]}
          activeOpacity={0.8}
        >
          <Text style={[styles.zeptoTabText, { color: '#E65100' }]}>School Store</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleThemeChange('summer_playhouse')}
          style={[styles.zeptoTab, theme === 'summer_playhouse' ? styles.zeptoTabActive : styles.zeptoTabInactive]}
          activeOpacity={0.8}
        >
          <Text style={[styles.zeptoTabText, { color: '#0288D1' }]}>Summer Store</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleThemeChange('mystery_gift_carnival')}
          style={[styles.zeptoTab, theme === 'mystery_gift_carnival' ? styles.zeptoTabActive : styles.zeptoTabInactive]}
          activeOpacity={0.8}
        >
          <Text style={[styles.zeptoTabText, { color: '#D32F2F' }]}>Mystery</Text>
        </TouchableOpacity>
      </View>

      {/* C. SEARCH BAR */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#1A2530" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput}
            placeholder='Search for "Toys"'
            placeholderTextColor="#888"
          />
        </View>
      </View>

      {/* D. SINGLE VERTICAL SCROLLING FEED WITH ANIMATED TRANSITION */}
      <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: translateYAnim }] }}>
        <FlatList
          data={mainContentLayout}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          initialNumToRender={4}
          maxToRenderPerBatch={4}
          windowSize={5}
        />
      </Animated.View>

      {/* E. FLOATING FREE DELIVERY BANNER */}
      <FreeDeliveryBanner />

      {/* F. REMOTE DYNAMIC OVERLAY (Pointer-events="none" allows click-throughs) */}
      <FullScreenOverlayRenderer node={overlayNode} />
      
      {/* G. CART SCREEN MODAL */}
      {isCartOpen && <CartScreen onClose={() => setIsCartOpen(false)} />}
    </SafeAreaView>
  );

  // Fully responsive wrapper
  return (
    <View style={[styles.webAppWrapper, { backgroundColor: colors.background }]}>
      {appView}
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  webAppWrapper: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    overflow: 'hidden',
  },
  appContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 800, // Clean max width for laptops/tablets
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  deliveryInfoContainer: {
    marginBottom: 4,
  },
  deliveryTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  zapIcon: {
    marginRight: 6,
  },
  deliveryTimeText: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  deliveryAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryAddressText: {
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.8,
    flexShrink: 1, // Truncate safely
  },
  headerLeft: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  logoContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: 2,
  },
  logoTextRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 32,
  },
  logoK: {
    fontSize: 32,
    fontWeight: '900',
    color: '#F54E5E',
    letterSpacing: -1.5,
    lineHeight: 38,
  },
  logoIWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
    width: 12,
    marginHorizontal: 1,
    height: '100%',
  },
  logoHeart: {
    position: 'absolute',
    top: 4,
    zIndex: 10,
  },
  logoI: {
    fontSize: 32,
    fontWeight: '900',
    color: '#F54E5E',
    lineHeight: 38,
  },
  logoDdo: {
    fontSize: 32,
    fontWeight: '900',
    color: '#F54E5E',
    letterSpacing: -2,
    lineHeight: 38,
  },
  logoBadgeContainer: {
    alignItems: 'center',
    marginTop: -4,
    paddingLeft: 2,
  },
  logoSlogan: {
    color: '#F54E5E',
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 0.2,
    marginBottom: 1,
  },
  logoPill: {
    backgroundColor: '#F54E5E',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 8,
  },
  logoPillText: {
    color: '#FFFFFF',
    fontSize: 6,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  liveSaleBadge: {
    fontSize: 9,
    letterSpacing: 0.5,
    marginTop: 4,
  },
  cartIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 24, // Softer radius
    borderWidth: 1,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1A2530',
  },
  themeBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  walletPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  walletText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#673AB7',
  },
  searchBarContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1A2530',
    outlineStyle: 'none', // For web
  },
  zeptoTab: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zeptoTabInactive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  zeptoTabActive: {
    backgroundColor: 'transparent',
  },
  zeptoTabText: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  listContent: {
    paddingBottom: 100, // Increased to allow scrolling past the floating banner
  },
  freeDeliveryBanner: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#333740',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  freeDeliveryIconBg: {
    backgroundColor: '#4A4E58',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  freeDeliveryTextContainer: {
    flex: 1,
  },
  freeDeliveryTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2,
  },
  freeDeliverySubtitle: {
    color: '#AAB0BB',
    fontSize: 12,
    fontWeight: '600',
  },
  
  // WEB EMULATOR SHELL STYLES (REMOVED for fully native responsive layout)
});
