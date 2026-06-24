import React from 'react';
import { StyleSheet, View, Text, ImageBackground, TouchableOpacity, useWindowDimensions } from 'react-native';
import { ComponentData } from '../types';
import { useCartStore } from '../store';
import { useTheme } from '../ThemeContext';

interface BannerHeroProps {
  data: ComponentData;
}

export const BannerHero: React.FC<BannerHeroProps> = ({ data }) => {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const handleAction = useCartStore((state) => state.handleAction);

  // Height is 200 on mobile, 300 on tablets, 400 on large screens
  const bannerHeight = width > 800 ? 350 : width > 500 ? 250 : 200;

  if (!data.imageUrl) return null;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => data.action && handleAction(data.action)}
      style={[styles.container, { height: bannerHeight }]}
    >
      <ImageBackground
        source={{ uri: data.imageUrl }}
        style={styles.imageBackground}
        imageStyle={styles.image}
      >
        {/* Subtle dark overlay to ensure readability */}
        <View style={styles.overlay} />

        {/* Floating details banner */}
        <View style={[styles.contentCard, { backgroundColor: 'rgba(255, 255, 255, 0.9)' }]}>
          {data.title && (
            <Text style={[styles.title, { color: colors.text }]}>
              {data.title}
            </Text>
          )}
          {data.subtitle && (
            <Text style={[styles.subtitle, { color: colors.subtext }]} numberOfLines={2}>
              {data.subtitle}
            </Text>
          )}
          <View style={[styles.badge, { backgroundColor: colors.primary }]}>
            <Text style={styles.badgeText}>SHOP NOW</Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 28, // Softer
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    padding: 16,
  },
  image: {
    borderRadius: 28, // Softer
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  contentCard: {
    padding: 14,
    borderRadius: 20, // Softer
    width: '90%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    marginBottom: 8,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16, // Softer pill shape
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1A2530',
    letterSpacing: 0.5,
  },
});

export default BannerHero;
