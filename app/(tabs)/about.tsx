// Powered by OnSpace.AI
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, Radii } from '@/constants/theme';
import { HTML_CONVERSION_RULES } from '@/constants/templates';
import { ConversionRuleRow } from '@/components';

const INFO_SECTIONS = [
  {
    title: 'پروجیکٹ کے بارے میں',
    icon: 'info',
    color: Colors.info,
    items: [
      { label: 'ورژن', value: '1.0.0' },
      { label: 'صنف', value: 'ڈیویلپر ٹول' },
      { label: 'پلیٹ فارم', value: 'React Native / Expo' },
      { label: 'مصنف', value: 'Dr M Irfan Qadir Thaheem' },
    ],
  },
  {
    title: 'ٹیکنالوجی',
    icon: 'code',
    color: Colors.primary,
    items: [
      { label: 'فریم ورک', value: 'React Native' },
      { label: 'بلڈ ٹول', value: 'Expo SDK 51' },
      { label: 'لینگویج', value: 'TypeScript' },
      { label: 'نیویگیشن', value: 'Expo Router' },
    ],
  },
];

export default function AboutScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + Spacing.base, paddingBottom: insets.bottom + 80 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Brand */}
      <View style={styles.brand}>
        <View style={styles.brandIcon}>
          <MaterialIcons name="transform" size={36} color={Colors.primary} />
        </View>
        <Text style={styles.brandName}>HTML → RN</Text>
        <Text style={styles.brandTagline}>Generator</Text>
        <Text style={styles.brandDua}>ان شاء اللہ عزوجل</Text>
      </View>

      {/* Info sections */}
      {INFO_SECTIONS.map(section => (
        <View key={section.title} style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialIcons name={section.icon as any} size={18} color={section.color} />
            <Text style={[styles.cardTitle, { color: section.color }]}>{section.title}</Text>
          </View>
          {section.items.map(item => (
            <View key={item.label} style={styles.infoRow}>
              <Text style={styles.infoLabel}>{item.label}</Text>
              <Text style={styles.infoValue}>{item.value}</Text>
            </View>
          ))}
        </View>
      ))}

      {/* All conversion rules */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialIcons name="compare-arrows" size={18} color={Colors.primary} />
          <Text style={[styles.cardTitle, { color: Colors.primary }]}>تمام تبدیلی اصول</Text>
        </View>
        {HTML_CONVERSION_RULES.map((rule, i) => (
          <ConversionRuleRow
            key={i}
            html={rule.html}
            rn={rule.rn}
            color={rule.color}
          />
        ))}
      </View>

      {/* Features */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialIcons name="star" size={18} color={Colors.warning} />
          <Text style={[styles.cardTitle, { color: Colors.warning }]}>خصوصیات</Text>
        </View>
        {[
          '20+ HTML ٹیگز کی تبدیلی',
          'خودکار امپورٹس جنریشن',
          'ٹائپ اسکرپٹ سپورٹ',
          'کوڈ کاپی ٹو کلپ بورڈ',
          '4 ریڈی میڈ ٹیمپلیٹس',
          'اردو انٹرفیس',
          'ڈارک تھیم',
          'مفت استعمال',
        ].map((feat, i) => (
          <View key={i} style={styles.featureRow}>
            <MaterialIcons name="check-circle" size={14} color={Colors.primary} />
            <Text style={styles.featureText}>{feat}</Text>
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>بسم اللہ الرحمن الرحیم</Text>
        <Text style={styles.footerSub}>تمام حقوق محفوظ ہیں</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.xl,
  },
  brand: {
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xl,
  },
  brandIcon: {
    width: 80,
    height: 80,
    borderRadius: Radii.xl,
    backgroundColor: Colors.primary + '22',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary + '44',
  },
  brandName: {
    color: Colors.textPrimary,
    fontSize: FontSizes.hero,
    fontWeight: '900',
    fontFamily: 'monospace',
  },
  brandTagline: {
    color: Colors.primary,
    fontSize: FontSizes.lg,
    fontWeight: '700',
  },
  brandDua: {
    color: Colors.textMuted,
    fontSize: FontSizes.base,
    fontStyle: 'italic',
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  cardTitle: {
    fontSize: FontSizes.base,
    fontWeight: '700',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  infoLabel: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
  },
  infoValue: {
    color: Colors.textPrimary,
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: 2,
  },
  featureText: {
    color: Colors.textPrimary,
    fontSize: FontSizes.sm,
  },
  footer: {
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.lg,
  },
  footerText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.base,
    fontWeight: '600',
  },
  footerSub: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
  },
});
