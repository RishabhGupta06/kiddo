import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image, SafeAreaView, Modal, Platform } from 'react-native';
import { useCartStore, globalAllProducts } from '../store';
import { useTheme } from '../ThemeContext';
import { X, Minus, Plus } from 'lucide-react-native';
import { Product } from '../types';

interface CartScreenProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartScreen: React.FC<CartScreenProps> = ({ isOpen, onClose }) => {
  const { colors } = useTheme();
  const cart = useCartStore((state) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const cartItems = Object.entries(cart).map(([id, qty]) => {
    const product = globalAllProducts.find(p => p.id === id);
    return { product, qty };
  }).filter(item => item.product) as { product: Product, qty: number }[];

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.product.price * item.qty), 0);

  const renderItem = ({ item }: { item: { product: Product, qty: number } }) => (
    <View style={[styles.cartItem, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
      <Image source={{ uri: item.product.imageUrl }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={2}>{item.product.name}</Text>
        <Text style={[styles.itemPrice, { color: colors.text }]}>₹{item.product.price}</Text>
      </View>
      <View style={[styles.quantitySelector, { borderColor: colors.primary }]}>
        <TouchableOpacity onPress={() => removeFromCart(item.product.id)} style={styles.qtyBtn}>
          <Minus size={14} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.qtyText, { color: colors.text }]}>{item.qty}</Text>
        <TouchableOpacity onPress={() => addToCart(item.product.id)} style={styles.qtyBtn}>
          <Plus size={14} color={colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Modal visible={isOpen} animationType="slide" transparent={true} onRequestClose={onClose}>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Your Cart</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <X size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.subtext }]}>Your cart is empty.</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={item => item.product.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
          />
          <View style={[styles.footer, { backgroundColor: colors.cardBackground, borderTopColor: colors.border }]}>
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: colors.text }]}>Total Amount:</Text>
              <Text style={[styles.totalValue, { color: colors.text }]}>₹{totalAmount}</Text>
            </View>
            <TouchableOpacity 
              style={[styles.checkoutBtn, { backgroundColor: colors.primary }]}
              onPress={() => alert('Order Placed successfully! (Simulated Checkout)')}
            >
              <Text style={styles.checkoutBtnText}>Buy Now</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 480 : '100%',
    alignSelf: 'center',
    zIndex: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '800',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
  },
  qtyBtn: {
    padding: 8,
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '700',
    minWidth: 20,
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '900',
  },
  checkoutBtn: {
    padding: 16,
    borderRadius: 24,
    alignItems: 'center',
  },
  checkoutBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A2530',
  },
});

export default CartScreen;
