// Powered by OnSpace.AI
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, Radii } from '@/constants/theme';

interface ConversionRuleRowProps {
  html: string;
  rn: string;
  color: string;
}

export function ConversionRuleRow({ html, rn, color }: ConversionRuleRowProps) {
  return (
    <View style={styles.row}>
      <View style={[styles.tag, { backgroundColor: '#ff6b6b22' }]}>
        <Text style={[styles.code, { color: '#ff6b6b' }]}>{html}</Text>
      </View>
      <MaterialIcons name="arrow-forward" size={14} color={Colors.textMuted} />
      <View style={[styles.tag, { backgroundColor: color + '22' }]}>
        <Text style={[styles.code, { color }]}>{rn}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  tag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radii.sm,
  },
  code: {
    fontFamily: 'monospace',
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
});
