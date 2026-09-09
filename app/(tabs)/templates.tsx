// Powered by OnSpace.AI
import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, Radii } from '@/constants/theme';
import { TEMPLATES, TEMPLATE_CATEGORIES } from '@/constants/templates';
import { TemplateCard } from '@/components';
import { useFavorites } from '@/hooks/useFavorites';

export default function TemplatesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { favorites, isFav, toggle } = useFavorites();
  const [selected, setSelected] = useState('سب');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    let list = TEMPLATES;

    // Category filter
    if (selected === 'پسندیدہ') {
      list = list.filter(t => favorites.includes(t.id));
    } else if (selected !== 'سب') {
      list = list.filter(t => t.category === selected);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.urduName.includes(q) ||
        t.category.includes(q) ||
        t.tags.some(tag => tag.toLowerCase().includes(q)) ||
        t.description.toLowerCase().includes(q)
      );
    }

    return list;
  }, [selected, searchQuery, favorites]);

  const getCategoryCount = useCallback((catId: string) => {
    if (catId === 'سب') return TEMPLATES.length;
    if (catId === 'پسندیدہ') return favorites.length;
    return TEMPLATES.filter(t => t.category === catId).length;
  }, [favorites]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>ریڈی میڈ ٹیمپلیٹس</Text>
        <Text style={styles.subtitle}>{TEMPLATES.length}+ ٹیمپلیٹس — {favorites.length} پسندیدہ</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={18} color={Colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="ٹیمپلیٹ تلاش کریں..."
          placeholderTextColor={Colors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
        {searchQuery.length > 0 ? (
          <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
            <MaterialIcons name="close" size={16} color={Colors.textMuted} />
          </Pressable>
        ) : null}
      </View>

      {/* Category filter */}
      <View style={styles.filterOuter}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}>
          {TEMPLATE_CATEGORIES.map(cat => {
            const isActive = selected === cat.id;
            const count = getCategoryCount(cat.id);
            const isFavCat = cat.id === 'پسندیدہ';
            return (
              <Pressable key={cat.id} onPress={() => setSelected(cat.id)}
                style={[styles.chip, isActive && styles.chipActive, isFavCat && !isActive && styles.chipFav]}>
                <MaterialIcons name={cat.icon as any} size={13}
                  color={isActive ? '#000' : isFavCat ? Colors.error : Colors.textSecondary} />
                <Text style={[styles.chipLabel, isActive && styles.chipLabelActive, isFavCat && !isActive && { color: Colors.error }]}>
                  {cat.label}
                </Text>
                {count > 0 ? (
                  <Text style={[styles.chipCount, isActive && styles.chipCountActive]}>
                    {count}
                  </Text>
                ) : null}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Results header */}
      <View style={styles.resultHeader}>
        <Text style={styles.resultText}>
          {filtered.length} ٹیمپلیٹ
          {selected !== 'سب' ? ` — ${selected}` : ''}
          {searchQuery ? ` — "${searchQuery}"` : ''}
        </Text>
        {filtered.some(t => t.isReady) ? (
          <View style={styles.readyLegend}>
            <View style={[styles.readyDot, { backgroundColor: Colors.primary }]} />
            <Text style={styles.readyText}>انسٹال ریڈی</Text>
          </View>
        ) : null}
      </View>

      {/* Templates list */}
      <ScrollView style={styles.flex}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}>
        {filtered.length > 0 ? (
          filtered.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              isFavorite={isFav(template.id)}
              onFavoriteToggle={() => toggle(template.id)}
              onPress={() => router.push({ pathname: '/template-detail', params: { id: template.id } })}
            />
          ))
        ) : (
          <View style={styles.empty}>
            <MaterialIcons name="search-off" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>کوئی ٹیمپلیٹ نہیں ملا</Text>
            {selected === 'پسندیدہ' ? (
              <Text style={styles.emptyDesc}>کسی ٹیمپلیٹ پر ❤ دبا کر پسندیدہ میں شامل کریں</Text>
            ) : (
              <Text style={styles.emptyDesc}>مختلف الفاظ سے تلاش کریں یا کیٹیگری بدلیں</Text>
            )}
          </View>
        )}

        <View style={styles.infoCard}>
          <MaterialIcons name="info-outline" size={18} color={Colors.info} />
          <View style={styles.infoText}>
            <Text style={styles.infoTitle}>مزید ٹیمپلیٹس جلد آئیں گے</Text>
            <Text style={styles.infoDesc}>ان شاء اللہ عزوجل</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.base, paddingTop: Spacing.md, paddingBottom: Spacing.sm,
  },
  title: { color: Colors.textPrimary, fontSize: FontSizes.xl, fontWeight: '800' },
  subtitle: { color: Colors.textMuted, fontSize: FontSizes.sm, marginTop: 2 },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    marginHorizontal: Spacing.base, marginBottom: Spacing.sm,
    backgroundColor: Colors.surface, borderRadius: Radii.md, paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm, borderWidth: 1, borderColor: Colors.border,
  },
  searchInput: {
    flex: 1, color: Colors.textPrimary, fontSize: FontSizes.sm,
    paddingVertical: 0,
  },
  filterOuter: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  filterContent: { flexDirection: 'row', gap: Spacing.sm, paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs,
    borderRadius: Radii.full, backgroundColor: Colors.surface,
    borderWidth: 1, borderColor: Colors.border, height: 36,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipFav: { borderColor: Colors.error + '55' },
  chipLabel: { color: Colors.textSecondary, fontSize: FontSizes.xs, fontWeight: '600' },
  chipLabelActive: { color: '#000' },
  chipCount: {
    color: Colors.textMuted, fontSize: 10, fontWeight: '700',
    backgroundColor: Colors.border, borderRadius: 8, paddingHorizontal: 5, paddingVertical: 1,
  },
  chipCountActive: { color: '#000', backgroundColor: 'rgba(0,0,0,0.2)' },
  resultHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm,
  },
  resultText: { color: Colors.textMuted, fontSize: FontSizes.sm },
  readyLegend: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  readyDot: { width: 7, height: 7, borderRadius: 4 },
  readyText: { color: Colors.textMuted, fontSize: 10 },
  list: { paddingHorizontal: Spacing.base, paddingTop: Spacing.xs },
  empty: { alignItems: 'center', paddingVertical: Spacing.xxxl, gap: Spacing.sm },
  emptyTitle: { color: Colors.textSecondary, fontSize: FontSizes.lg, fontWeight: '700' },
  emptyDesc: { color: Colors.textMuted, fontSize: FontSizes.sm, textAlign: 'center' },
  infoCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm,
    backgroundColor: Colors.info + '11', borderRadius: Radii.md, padding: Spacing.base,
    borderWidth: 1, borderColor: Colors.info + '33', marginTop: Spacing.sm,
  },
  infoText: { flex: 1, gap: 2 },
  infoTitle: { color: Colors.info, fontSize: FontSizes.sm, fontWeight: '700' },
  infoDesc: { color: Colors.info, fontSize: FontSizes.xs, opacity: 0.8 },
});
