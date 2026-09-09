// Powered by OnSpace.AI
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, FlatList, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, Radii } from '@/constants/theme';
import { useHistory } from '@/hooks/useHistory';
import { copyToClipboard, shareCode } from '@/services/exportService';
import { formatDate } from '@/services/historyService';
import { CodeBlock } from '@/components';
import { useAlert } from '@/template';

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const { history, isLoading, removeItem, clearHistory, refresh } = useHistory();
  const [selected, setSelected] = useState<string | null>(null);
  const { showAlert } = useAlert();

  const handleClear = () => {
    showAlert('ہسٹری صاف کریں', 'کیا آپ تمام ہسٹری حذف کرنا چاہتے ہیں؟', [
      { text: 'منسوخ', style: 'cancel' },
      { text: 'صاف کریں', style: 'destructive', onPress: () => clearHistory() },
    ]);
  };

  const handleDelete = (id: string) => {
    showAlert('حذف کریں', 'کیا یہ آئٹم حذف کریں؟', [
      { text: 'منسوخ', style: 'cancel' },
      { text: 'حذف', style: 'destructive', onPress: () => removeItem(id) },
    ]);
  };

  const handleCopy = async (code: string) => {
    const ok = await copyToClipboard(code);
    showAlert(ok ? 'کاپی ہو گیا' : 'خرابی', ok ? 'کوڈ کلپ بورڈ میں کاپی ہو گیا' : 'کاپی نہیں ہو سکا');
  };

  const handleShare = async (code: string) => {
    await shareCode(code, 'ConvertedComponent.tsx');
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>ہسٹری لوڈ ہو رہی ہے...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>کنورژن ہسٹری</Text>
          <Text style={styles.subtitle}>{history.length} کنورژن محفوظ</Text>
        </View>
        {history.length > 0 ? (
          <Pressable onPress={handleClear} style={styles.clearBtn} hitSlop={8}>
            <MaterialIcons name="delete-sweep" size={18} color={Colors.error} />
            <Text style={styles.clearBtnText}>سب حذف</Text>
          </Pressable>
        ) : null}
      </View>

      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="history" size={64} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>ابھی کوئی ہسٹری نہیں</Text>
          <Text style={styles.emptyDesc}>HTML کنورٹر میں کوڈ تبدیل کریں — یہاں محفوظ ہو جائے گا</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={item => item.id}
          contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 80 }]}
          showsVerticalScrollIndicator={false}
          onRefresh={refresh}
          refreshing={isLoading}
          renderItem={({ item }) => {
            const isOpen = selected === item.id;
            return (
              <View style={[styles.card, isOpen && styles.cardOpen]}>
                {/* Card header */}
                <Pressable onPress={() => setSelected(isOpen ? null : item.id)} style={styles.cardHeader}>
                  <View style={styles.cardIcon}>
                    <MaterialIcons name="history" size={18} color={Colors.primary} />
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.cardDate}>{formatDate(item.createdAt)}</Text>
                  </View>
                  <View style={styles.cardStats}>
                    <View style={styles.miniStat}>
                      <Text style={[styles.miniStatVal, { color: Colors.primary }]}>{item.elementsConverted}</Text>
                      <Text style={styles.miniStatKey}>عناصر</Text>
                    </View>
                    <View style={styles.miniStat}>
                      <Text style={[styles.miniStatVal, { color: '#61dafb' }]}>{item.importsCount}</Text>
                      <Text style={styles.miniStatKey}>امپورٹس</Text>
                    </View>
                    {item.warningsCount > 0 ? (
                      <View style={styles.miniStat}>
                        <Text style={[styles.miniStatVal, { color: Colors.warning }]}>{item.warningsCount}</Text>
                        <Text style={styles.miniStatKey}>وارننگز</Text>
                      </View>
                    ) : null}
                    <MaterialIcons
                      name={isOpen ? 'expand-less' : 'expand-more'}
                      size={18} color={Colors.textMuted}
                    />
                  </View>
                </Pressable>

                {isOpen ? (
                  <View style={styles.cardBody}>
                    {/* Input HTML */}
                    <Text style={styles.sectionLabel}>اصل HTML</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      <View style={styles.htmlPreview}>
                        <Text style={styles.htmlText}>{item.htmlInput.slice(0, 300)}
                          {item.htmlInput.length > 300 ? '...' : ''}</Text>
                      </View>
                    </ScrollView>

                    {/* Generated code */}
                    <Text style={styles.sectionLabel}>جنریٹڈ کوڈ</Text>
                    <CodeBlock code={item.rnCode} title="ConvertedComponent.tsx" maxLines={20} />

                    {/* Actions */}
                    <View style={styles.cardActions}>
                      <Pressable onPress={() => handleCopy(item.rnCode)} style={styles.actionBtn}>
                        <MaterialIcons name="content-copy" size={15} color={Colors.primary} />
                        <Text style={styles.actionText}>کاپی</Text>
                      </Pressable>
                      <Pressable onPress={() => handleShare(item.rnCode)} style={styles.actionBtn}>
                        <MaterialIcons name="share" size={15} color={Colors.primary} />
                        <Text style={styles.actionText}>شیئر</Text>
                      </Pressable>
                      <Pressable onPress={() => handleDelete(item.id)} style={[styles.actionBtn, styles.actionBtnDel]}>
                        <MaterialIcons name="delete" size={15} color={Colors.error} />
                        <Text style={[styles.actionText, { color: Colors.error }]}>حذف</Text>
                      </Pressable>
                    </View>
                  </View>
                ) : null}
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: Colors.textSecondary, fontSize: FontSizes.sm, marginTop: Spacing.md },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  title: { color: Colors.textPrimary, fontSize: FontSizes.xl, fontWeight: '800' },
  subtitle: { color: Colors.textMuted, fontSize: FontSizes.sm, marginTop: 2 },
  clearBtn: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.xs,
    paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs,
    backgroundColor: Colors.error + '11', borderRadius: Radii.sm,
  },
  clearBtnText: { color: Colors.error, fontSize: FontSizes.sm, fontWeight: '600' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.md, padding: Spacing.xl },
  emptyTitle: { color: Colors.textSecondary, fontSize: FontSizes.xl, fontWeight: '700' },
  emptyDesc: { color: Colors.textMuted, fontSize: FontSizes.sm, textAlign: 'center', lineHeight: 22 },
  list: { padding: Spacing.base, gap: Spacing.md },
  card: {
    backgroundColor: Colors.surface, borderRadius: Radii.lg,
    borderWidth: 1, borderColor: Colors.border, overflow: 'hidden',
  },
  cardOpen: { borderColor: Colors.primary + '44' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', padding: Spacing.base, gap: Spacing.sm },
  cardIcon: {
    width: 36, height: 36, borderRadius: Radii.sm,
    backgroundColor: Colors.primary + '22', alignItems: 'center', justifyContent: 'center',
  },
  cardInfo: { flex: 1, gap: 2 },
  cardTitle: { color: Colors.textPrimary, fontSize: FontSizes.base, fontWeight: '700' },
  cardDate: { color: Colors.textMuted, fontSize: FontSizes.xs },
  cardStats: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  miniStat: { alignItems: 'center' },
  miniStatVal: { fontSize: FontSizes.sm, fontWeight: '800' },
  miniStatKey: { color: Colors.textMuted, fontSize: 9 },
  cardBody: { padding: Spacing.base, paddingTop: 0, gap: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.border },
  sectionLabel: { color: Colors.textSecondary, fontSize: FontSizes.sm, fontWeight: '600', marginTop: Spacing.sm },
  htmlPreview: {
    backgroundColor: '#0d1117', borderRadius: Radii.sm,
    padding: Spacing.sm, borderWidth: 1, borderColor: '#30363d',
  },
  htmlText: { color: '#ff6b6b', fontFamily: 'monospace', fontSize: 12, lineHeight: 18 },
  cardActions: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.xs },
  actionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.xs, backgroundColor: Colors.primary + '11',
    borderRadius: Radii.sm, paddingVertical: Spacing.sm,
    borderWidth: 1, borderColor: Colors.primary + '33',
  },
  actionBtnDel: { backgroundColor: Colors.error + '11', borderColor: Colors.error + '33' },
  actionText: { color: Colors.primary, fontSize: FontSizes.sm, fontWeight: '600' },
});
