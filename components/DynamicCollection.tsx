import React from 'react';
import { StyleSheet, View, Text, FlatList, useWindowDimensions, Platform } from 'react-native';
import { ComponentData } from '../types';
import { useTheme } from '../ThemeContext';
import ProductCard from './ProductCard';

interface DynamicCollectionProps {
  data: ComponentData;
}

export const DynamicCollection: React.FC<DynamicCollectionProps> = ({ data }) => {
  const { colors } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  // Card width is 44% of window, but caps at 250px so it doesn't get huge on laptops
  const CARD_WIDTH = Math.min(windowWidth * 0.44, 250);

  if (!data.products || data.products.length === 0) return null;

  return (
    <View style={styles.container}>
      {data.title && (
        <Text style={[styles.title, { color: colors.text }]}>
          {data.title}
        </Text>
      )}
      <FlatList
        data={data.products}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + 12} // Smooth snap scrolling
        decelerationRate="fast"
        nestedScrollEnabled={true} // Crucial for nested scroll gestures
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={[styles.cardContainer, { width: CARD_WIDTH }]}>
            <ProductCard product={item} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
    paddingHorizontal: 16,
    letterSpacing: -0.2,
  },
  listContent: {
    paddingHorizontal: 10,
  },
  cardContainer: {
    paddingHorizontal: 6,
  },
});

export default DynamicCollection;
