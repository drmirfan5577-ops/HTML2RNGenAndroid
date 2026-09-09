// Powered by OnSpace.AI
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSizes, Spacing, Radii } from '@/constants/theme';

interface BadgeProps {
  label: string;
  color?: string;
}

export function Badge({ label, color = Colors.primary }: BadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: color + '22', borderColor: color + '44' }]}>
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radii.full,
    borderWidth: 1,
  },
  label: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
