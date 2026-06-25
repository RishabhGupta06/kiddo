import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Wallet, UserCircle2, Zap, ChevronDown } from 'lucide-react-native';
import { useTheme } from '../ThemeContext';
import { useCartStore } from '../store';

const KiddoLogo = () => (
  <View style={styles.logoContainer}>
    <Text style={styles.logoText}>K<Text style={{color: '#FF6B6B'}}>i</Text>ddo</Text>
    <View style={styles.taglineBox}>
      <Text style={styles.taglineText}>the best for your kiddo</Text>
    </View>
    <View style={styles.deliveryBadge}>
      <Text style={styles.deliveryBadgeText}>delivered in minutes</Text>
    </View>
  </View>
);

export const Header: React.FC<{
  onOpenLogin: () => void;
  onOpenCart: () => void;
}> = ({ onOpenLogin, onOpenCart }) => {
  const { colors } = useTheme();
  const isLoggedIn = useCartStore((state) => state.isLoggedIn);
  const cart = useCartStore((state) => state.cart);
  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  return (
    <View style={[styles.header, { backgroundColor: colors.background }]}>
      <View style={styles.headerTopRow}>
        <KiddoLogo />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.walletPill}>
            <Wallet size={16} color="#673AB7" fill="#673AB7" style={{marginRight: 4}} />
            <Text style={styles.walletText}>₹0</Text>
          </View>
          <TouchableOpacity onPress={() => {
            if (isLoggedIn) {
              alert('Welcome back to Kiddo! You are already logged in.');
            } else {
              onOpenLogin();
            }
          }}>
            <UserCircle2 size={26} color={colors.text} style={{marginLeft: 12, marginRight: 12}} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onOpenCart} style={styles.cartIconWrapper}>
            <View style={styles.cartIconCircle}>
              <Text style={{ fontSize: 16 }}>🛍️</Text>
            </View>
            {totalItems > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{totalItems}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.deliveryInfoContainer}>
        <View style={styles.deliveryTimeRow}>
          <Zap size={24} color={colors.text} fill={colors.text} style={styles.zapIcon} />
          <Text style={[styles.deliveryTimeText, { color: colors.text }]}>20 minutes</Text>
        </View>
        <View style={styles.deliveryAddressRow}>
          <Text style={[styles.deliveryAddressText, { color: colors.text }]} numberOfLines={1}>
            Home - 42 Nursery Lane (Please enable location access)
          </Text>
          <ChevronDown size={14} color={colors.text} style={{ marginLeft: 4 }} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  logoContainer: {
    alignItems: 'flex-start',
  },
  logoText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FF4757',
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  taglineBox: {
    marginTop: -2,
    marginBottom: 4,
  },
  taglineText: {
    fontSize: 10,
    color: '#888',
    fontWeight: '600',
    fontStyle: 'italic',
  },
  deliveryBadge: {
    backgroundColor: '#FF4757',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  deliveryBadgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  walletPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  walletText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4A148C',
  },
  cartIconWrapper: {
    position: 'relative',
  },
  cartIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF4757',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  cartBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  deliveryInfoContainer: {
    marginTop: 4,
  },
  deliveryTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  zapIcon: {
    marginRight: 4,
  },
  deliveryTimeText: {
    fontSize: 22,
    fontWeight: '900',
  },
  deliveryAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  deliveryAddressText: {
    fontSize: 13,
    fontWeight: '500',
    opacity: 0.8,
  },
});
