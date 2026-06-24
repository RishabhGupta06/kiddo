import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Product } from '../types';
import { useCartStore } from '../store';
import { useTheme } from '../ThemeContext';
import { Plus, Minus, ShoppingCart } from 'lucide-react-native';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = React.memo(({ product }) => {
  // Read colors from our ThemeContext Provider (OTA Theming Injection)
  const { colors } = useTheme();

  // Selective store subscription remains isolated for the cart quantity!
  // It only causes re-render when this specific product's cart count updates.
  const quantity = useCartStore((state) => state.cart[product.id] || 0);
  
  const handleAction = useCartStore((state) => state.handleAction);
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  console.log(`[RENDER LOG] ProductCard rendering: ${product.id} (Quantity: ${quantity})`);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
      {/* Product Image & Discount Tag */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.imageUrl }} style={styles.image} resizeMode="cover" />
        {discount > 0 && (
          <View style={[styles.discountTag, { backgroundColor: colors.primary }]}>
            <Text style={styles.discountText}>-{discount}%</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={[styles.category, { color: colors.subtext }]} numberOfLines={1}>
          {product.category.toUpperCase()}
        </Text>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
          {product.name}
        </Text>

        {/* Pricing & Cart controls */}
        <View style={styles.footer}>
          <View>
            <Text style={[styles.price, { color: colors.text }]}>₹{product.price}</Text>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
            )}
          </View>

          {quantity > 0 ? (
            <View style={[styles.quantitySelector, { borderColor: colors.primary }]}>
              <TouchableOpacity
                onPress={() => removeFromCart(product.id)}
                style={[styles.qtyButton, { backgroundColor: colors.background }]}
                activeOpacity={0.7}
              >
                <Minus size={14} color={colors.text} />
              </TouchableOpacity>
              <Text style={[styles.qtyText, { color: colors.text }]}>{quantity}</Text>
              <TouchableOpacity
                onPress={() => addToCart(product.id)}
                style={[styles.qtyButton, { backgroundColor: colors.background }]}
                activeOpacity={0.7}
              >
                <Plus size={14} color={colors.text} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => handleAction(product.action)}
              style={[styles.addButton, { backgroundColor: colors.primary }]}
              activeOpacity={0.8}
            >
              <ShoppingCart size={16} color="#1A2530" style={styles.cartIcon} />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 24, // Softer
    borderWidth: 1,
    margin: 6,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  imageContainer: {
    height: 120,
    width: '100%',
    position: 'relative',
    backgroundColor: '#F7FAFC',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  discountTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16, // Softer
  },
  discountText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1A2530',
  },
  info: {
    padding: 12,
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
  },
  category: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    height: 36,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
  },
  originalPrice: {
    fontSize: 11,
    textDecorationLine: 'line-through',
    color: '#A0AEC0',
    marginTop: 2,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 24, // Pill shape
    minWidth: 70,
    justifyContent: 'center',
  },
  cartIcon: {
    marginRight: 4,
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A2530',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 24, // Pill shape
    overflow: 'hidden',
  },
  qtyButton: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: 13,
    fontWeight: '700',
    paddingHorizontal: 8,
    textAlign: 'center',
    minWidth: 20,
  },
});

export default ProductCard;
