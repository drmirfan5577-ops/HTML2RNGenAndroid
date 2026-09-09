// Powered by OnSpace.AI
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, Radii } from '@/constants/theme';
import { AppTemplate } from '@/constants/templates';

interface Props {
  template: AppTemplate;
  onPress: () => void;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
}

export function TemplateCard({ template, onPress, isFavorite = false, onFavoriteToggle }: Props) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
      <View style={[styles.iconContainer, { backgroundColor: template.color + '22' }]}>
        <MaterialIcons name={template.icon as any} size={26} color={template.color} />
        {template.isReady ? (
          <View style={styles.readyBadge}>
            <MaterialIcons name="bolt" size={8} color="#000" />
          </View>
        ) : null}
      </View>

      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text style={styles.name}>{template.urduName}</Text>
          <View style={styles.badges}>
            <View style={[styles.catBadge, { backgroundColor: template.color + '22', borderColor: template.color + '44' }]}>
              <Text style={[styles.catText, { color: template.color }]}>{template.category}</Text>
            </View>
          </View>
        </View>
        <Text style={styles.englishName}>{template.name}</Text>
        <Text style={styles.desc} numberOfLines={2}>{template.urduDescription}</Text>
        <View style={styles.footer}>
          <View style={styles.tagRow}>
            {template.tags.slice(0, 3).map(tag => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
          <View style={styles.footerRight}>
            <Text style={styles.fileCount}>{template.files.length} فائلز</Text>
            {onFavoriteToggle ? (
              <Pressable onPress={onFavoriteToggle} hitSlop={12} style={styles.favBtn}>
                <MaterialIcons
                  name={isFavorite ? 'favorite' : 'favorite-border'}
                  size={18} color={isFavorite ? Colors.error : Colors.textMuted}
                />
              </Pressable>
            ) : null}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', gap: Spacing.md, backgroundColor: Colors.surface,
    borderRadius: Radii.lg, padding: Spacing.md, marginBottom: Spacing.sm,
    borderWidth: 1, borderColor: Colors.border,
  },
  cardPressed: { opacity: 0.75 },
  iconContainer: {
    width: 56, height: 56, borderRadius: Radii.md,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative',
  },
  readyBadge: {
    position: 'absolute', top: -3, right: -3, width: 14, height: 14,
    borderRadius: 7, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  info: { flex: 1, gap: 3 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flexWrap: 'wrap' },
  name: { color: Colors.textPrimary, fontSize: FontSizes.base, fontWeight: '700', flex: 1 },
  badges: { flexDirection: 'row', gap: 4 },
  catBadge: { borderRadius: Radii.full, paddingHorizontal: 7, paddingVertical: 2, borderWidth: 1 },
  catText: { fontSize: 9, fontWeight: '700' },
  englishName: { color: Colors.textMuted, fontSize: FontSizes.xs },
  desc: { color: Colors.textSecondary, fontSize: FontSizes.xs, lineHeight: 18 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 },
  tagRow: { flexDirection: 'row', gap: 4, flex: 1 },
  tag: { backgroundColor: Colors.primary + '11', borderRadius: Radii.full, paddingHorizontal: 6, paddingVertical: 2, borderWidth: 1, borderColor: Colors.primary + '22' },
  tagText: { color: Colors.primary, fontSize: 9, fontWeight: '600' },
  footerRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  fileCount: { color: Colors.textMuted, fontSize: 9 },
  favBtn: { padding: 2 },
});
