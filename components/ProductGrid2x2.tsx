import React from 'react';
import { StyleSheet, View, Text, useWindowDimensions } from 'react-native';
import { ComponentData } from '../types';
import { useTheme } from '../ThemeContext';
import ProductCard from './ProductCard';

interface ProductGrid2x2Props {
  data: ComponentData;
}

export const ProductGrid2x2: React.FC<ProductGrid2x2Props> = ({ data }) => {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();

  if (!data.products || data.products.length === 0) return null;

  // Responsive columns: 2 on mobile, 4 on larger screens
  const cols = width > 600 ? 4 : 2;
  const itemWidth = `${100 / cols}%` as any;
  const gridProducts = data.products.slice(0, cols === 4 ? 8 : 4);

  return (
    <View style={styles.container}>
      {data.title && (
        <Text style={[styles.title, { color: colors.text }]}>
          {data.title}
        </Text>
      )}
      <View style={styles.grid}>
        {gridProducts.map((product) => (
          <View key={product.id} style={[styles.gridItem, { width: itemWidth }]}>
            <ProductCard product={product} />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    marginVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
    paddingHorizontal: 6,
    letterSpacing: -0.2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    padding: 4,
  },
});

export default ProductGrid2x2;
