import React from 'react';
import { View, StyleSheet } from 'react-native';

export function CardSkeleton() {
  return (
    <View style={styles.card}>
      <View style={styles.titleBone} />
      <View style={styles.detailsRow}>
        <View style={styles.priceBone} />
        <View style={styles.distanceBone} />
        <View style={styles.ratingBone} />
      </View>
    </View>
  );
}

export function SkeletonList({ count = 4 }: { count?: number }) {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 8,
  },
  titleBone: {
    height: 18,
    width: '75%',
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginBottom: 10,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  priceBone: {
    height: 16,
    width: 60,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
  },
  distanceBone: {
    height: 16,
    width: 50,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
  },
  ratingBone: {
    height: 16,
    width: 40,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
  },
});
