// Powered by OnSpace.AI
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, Radii } from '@/constants/theme';
import { HTML_CONVERSION_RULES, TEMPLATES } from '@/constants/templates';
import { ConversionRuleRow } from '@/components';

const { width } = Dimensions.get('window');

const STATS = [
  { label: 'ٹیمپلیٹس', value: '4', icon: 'dashboard', color: Colors.primary },
  { label: 'HTML ٹیگز', value: '20+', icon: 'code', color: '#61dafb' },
  { label: 'فائلز', value: '50+', icon: 'insert-drive-file', color: '#ffd700' },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + Spacing.base, paddingBottom: insets.bottom + 80 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero */}
      <View style={styles.hero}>
        <Image
          source={require('@/assets/images/hero.png')}
          style={styles.heroImage}
          contentFit="cover"
          transition={300}
        />
        <View style={styles.heroOverlay}>
          <View style={styles.heroBadge}>
            <MaterialIcons name="auto-awesome" size={12} color={Colors.primary} />
            <Text style={styles.heroBadgeText}>HTML → React Native</Text>
          </View>
          <Text style={styles.heroTitle}>HTML کو RN میں{'\n'}تبدیل کریں</Text>
          <Text style={styles.heroSub}>ان شاء اللہ عزوجل</Text>

          <Pressable
            onPress={() => router.push('/(tabs)/converter')}
            style={({ pressed }) => [styles.heroBtn, pressed && { opacity: 0.85 }]}
          >
            <MaterialIcons name="transform" size={18} color="#000" />
            <Text style={styles.heroBtnText}>ابھی شروع کریں</Text>
          </Pressable>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {STATS.map(stat => (
          <View key={stat.label} style={[styles.statCard, { borderColor: stat.color + '33' }]}>
            <MaterialIcons name={stat.icon as any} size={20} color={stat.color} />
            <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Conversion Rules Preview */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>تبدیلی کے اصول</Text>
          <Text style={styles.sectionSub}>HTML → React Native</Text>
        </View>
        <View style={styles.rulesCard}>
          {HTML_CONVERSION_RULES.slice(0, 6).map((rule, i) => (
            <ConversionRuleRow
              key={i}
              html={rule.html}
              rn={rule.rn}
              color={rule.color}
            />
          ))}
        </View>
      </View>

      {/* Templates Quick Access */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>ریڈی میڈ ٹیمپلیٹس</Text>
          <Pressable onPress={() => router.push('/(tabs)/templates')}>
            <Text style={styles.seeAll}>سب دیکھیں</Text>
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.templateRow}>
            {TEMPLATES.map(t => (
              <Pressable
                key={t.id}
                onPress={() => router.push({ pathname: '/template-detail', params: { id: t.id } })}
                style={({ pressed }) => [styles.templateChip, pressed && { opacity: 0.7 }]}
              >
                <View style={[styles.chipIcon, { backgroundColor: t.color + '22' }]}>
                  <MaterialIcons name={t.icon as any} size={18} color={t.color} />
                </View>
                <Text style={styles.chipName}>{t.urduName}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* How it works */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>کام کرنے کا طریقہ</Text>
        {[
          { step: '1', title: 'HTML لکھیں', desc: 'کنورٹر میں HTML کوڈ پیسٹ کریں', icon: 'edit', color: '#61dafb' },
          { step: '2', title: 'تبدیل کریں', desc: 'ایک کلک میں React Native کوڈ بنائیں', icon: 'transform', color: Colors.primary },
          { step: '3', title: 'کاپی کریں', desc: 'تیار کوڈ کاپی کریں اور استعمال کریں', icon: 'content-copy', color: '#ffd700' },
        ].map(item => (
          <View key={item.step} style={styles.stepCard}>
            <View style={[styles.stepIcon, { backgroundColor: item.color + '22' }]}>
              <MaterialIcons name={item.icon as any} size={22} color={item.color} />
            </View>
            <View style={styles.stepInfo}>
              <Text style={styles.stepTitle}>{item.title}</Text>
              <Text style={styles.stepDesc}>{item.desc}</Text>
            </View>
            <View style={[styles.stepBadge, { backgroundColor: item.color + '22' }]}>
              <Text style={[styles.stepNum, { color: item.color }]}>{item.step}</Text>
            </View>
          </View>
        ))}
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
  hero: {
    borderRadius: Radii.xl,
    overflow: 'hidden',
    height: 260,
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: Spacing.xl,
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.primary + '22',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: Colors.primary + '44',
  },
  heroBadgeText: {
    color: Colors.primary,
    fontSize: FontSizes.xs,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  heroTitle: {
    color: '#fff',
    fontSize: FontSizes.xxl,
    fontWeight: '800',
    lineHeight: 34,
  },
  heroSub: {
    color: Colors.primary,
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  heroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.md,
    marginTop: Spacing.xs,
  },
  heroBtnText: {
    color: '#000',
    fontSize: FontSizes.md,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radii.md,
    padding: Spacing.md,
    alignItems: 'center',
    gap: Spacing.xs,
    borderWidth: 1,
  },
  statValue: {
    fontSize: FontSizes.xl,
    fontWeight: '800',
  },
  statLabel: {
    color: Colors.textSecondary,
    fontSize: FontSizes.xs,
    textAlign: 'center',
  },
  section: {
    gap: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: FontSizes.lg,
    fontWeight: '700',
  },
  sectionSub: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
    fontFamily: 'monospace',
  },
  seeAll: {
    color: Colors.primary,
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  rulesCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 2,
  },
  templateRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingRight: Spacing.base,
  },
  templateChip: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    width: 100,
  },
  chipIcon: {
    width: 44,
    height: 44,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipName: {
    color: Colors.textPrimary,
    fontSize: FontSizes.sm,
    fontWeight: '600',
    textAlign: 'center',
  },
  stepCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.md,
    padding: Spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stepIcon: {
    width: 44,
    height: 44,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepInfo: {
    flex: 1,
    gap: 2,
  },
  stepTitle: {
    color: Colors.textPrimary,
    fontSize: FontSizes.base,
    fontWeight: '700',
  },
  stepDesc: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNum: {
    fontSize: FontSizes.sm,
    fontWeight: '800',
  },
});
