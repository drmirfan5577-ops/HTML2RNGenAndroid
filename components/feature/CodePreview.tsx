// Powered by OnSpace.AI
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors, Spacing, Radii, FontSizes } from '@/constants/theme';

interface PreviewElement {
  type: 'view' | 'text' | 'image' | 'input' | 'button' | 'divider';
  content?: string;
  style?: Record<string, any>;
  children?: PreviewElement[];
  depth: number;
}

function parseCodeToPreview(code: string): PreviewElement[] {
  const elements: PreviewElement[] = [];
  const lines = code.split('\n');
  let depth = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('<') || trimmed.startsWith('//') || trimmed.startsWith('import')) continue;

    const opening = trimmed.match(/^<([A-Z][a-zA-Z]*)/);
    const closing = trimmed.match(/^<\/([A-Z][a-zA-Z]*)/);
    const selfClose = trimmed.endsWith('/>');

    if (opening && !closing) {
      const tag = opening[1];
      const textMatch = trimmed.match(/>([^<]+)</);
      const content = textMatch ? textMatch[1].trim() : '';

      if (tag === 'View') {
        elements.push({ type: 'view', depth, content: '' });
        if (!selfClose) depth++;
      } else if (tag === 'Text') {
        elements.push({ type: 'text', content: content || 'متن', depth });
      } else if (tag === 'Image') {
        elements.push({ type: 'image', content: '🖼', depth });
      } else if (tag === 'TextInput') {
        const phMatch = trimmed.match(/placeholder="([^"]*)"/);
        elements.push({ type: 'input', content: phMatch ? phMatch[1] : 'ان پٹ...', depth });
      } else if (tag === 'TouchableOpacity' || tag === 'Pressable') {
        elements.push({ type: 'button', content: content || 'بٹن', depth });
        if (!selfClose) depth++;
      }
    } else if (closing) {
      depth = Math.max(0, depth - 1);
    }
  }
  return elements.slice(0, 20);
}

const DEPTH_COLORS = ['#1a2332', '#1e2a3a', '#223040', '#263648', '#2a3c50'];
const DEPTH_INDENT = 12;

interface Props { code: string }

export function CodePreview({ code }: Props) {
  const elements = parseCodeToPreview(code);

  if (elements.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>📱</Text>
        <Text style={styles.emptyText}>پریویو کے لیے کوڈ تبدیل کریں</Text>
      </View>
    );
  }

  const renderElement = (el: PreviewElement, idx: number) => {
    const indent = el.depth * DEPTH_INDENT;
    const bg = DEPTH_COLORS[Math.min(el.depth, DEPTH_COLORS.length - 1)];

    switch (el.type) {
      case 'view':
        return (
          <View key={idx} style={[styles.previewView, { marginLeft: indent, backgroundColor: bg }]}>
            <Text style={styles.tagLabel}>View</Text>
          </View>
        );
      case 'text':
        return (
          <View key={idx} style={[styles.previewRow, { marginLeft: indent + DEPTH_INDENT }]}>
            <View style={styles.textTag}><Text style={styles.tagLabelSmall}>T</Text></View>
            <Text style={styles.previewText} numberOfLines={1}>{el.content}</Text>
          </View>
        );
      case 'image':
        return (
          <View key={idx} style={[styles.previewImageBox, { marginLeft: indent + DEPTH_INDENT }]}>
            <Text style={styles.imageIcon}>🖼</Text>
            <Text style={styles.tagLabelSmall}>Image</Text>
          </View>
        );
      case 'input':
        return (
          <View key={idx} style={[styles.previewInput, { marginLeft: indent + DEPTH_INDENT }]}>
            <Text style={styles.previewInputText}>{el.content}</Text>
          </View>
        );
      case 'button':
        return (
          <View key={idx} style={[styles.previewButton, { marginLeft: indent + DEPTH_INDENT }]}>
            <Text style={styles.previewButtonText}>{el.content || 'بٹن'}</Text>
          </View>
        );
      case 'divider':
        return <View key={idx} style={[styles.previewDivider, { marginLeft: indent }]} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.phoneFrame}>
        <View style={styles.phoneNotch} />
        <ScrollView style={styles.phoneScreen} showsVerticalScrollIndicator={false}>
          <View style={styles.phoneContent}>
            {elements.map(renderElement)}
          </View>
        </ScrollView>
        <View style={styles.phoneHomeBar} />
      </View>
      <Text style={styles.note}>{elements.length} عناصر کا بصری پریویو</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: Spacing.sm },
  empty: { alignItems: 'center', paddingVertical: Spacing.xl, gap: Spacing.sm },
  emptyIcon: { fontSize: 40 },
  emptyText: { color: Colors.textMuted, fontSize: FontSizes.sm },
  phoneFrame: {
    width: 200, backgroundColor: '#0d1117', borderRadius: 24,
    borderWidth: 2, borderColor: '#30363d', overflow: 'hidden',
    shadowColor: Colors.primary, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
  },
  phoneNotch: { height: 20, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' },
  phoneScreen: { maxHeight: 340, backgroundColor: '#0d1117' },
  phoneContent: { padding: 8, gap: 4 },
  phoneHomeBar: { height: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: '#111' },
  previewView: { borderRadius: 4, padding: 4, marginVertical: 2, borderWidth: 1, borderColor: '#30363d', borderStyle: 'dashed' },
  tagLabel: { color: '#61dafb', fontSize: 9, fontFamily: 'monospace' },
  tagLabelSmall: { color: '#fff', fontSize: 8, fontWeight: '800' },
  previewRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginVertical: 1 },
  textTag: { width: 14, height: 14, backgroundColor: '#a8ff78', borderRadius: 3, alignItems: 'center', justifyContent: 'center' },
  previewText: { color: '#eeffff', fontSize: 10, flex: 1 },
  previewImageBox: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#1e2a3a', borderRadius: 4, padding: 4, marginVertical: 2 },
  imageIcon: { fontSize: 14 },
  previewInput: { borderWidth: 1, borderColor: '#555', borderRadius: 4, padding: 4, marginVertical: 2 },
  previewInputText: { color: '#8b949e', fontSize: 9 },
  previewButton: { backgroundColor: '#007AFF', borderRadius: 4, paddingVertical: 4, paddingHorizontal: 8, alignItems: 'center', marginVertical: 2 },
  previewButtonText: { color: '#fff', fontSize: 9, fontWeight: '700' },
  previewDivider: { height: 1, backgroundColor: '#30363d', marginVertical: 3 },
  note: { color: Colors.textMuted, fontSize: FontSizes.xs, textAlign: 'center' },
});
