// Powered by OnSpace.AI
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Colors, Spacing, Radii, FontSizes } from '@/constants/theme';

interface Suggestion {
  label: string;
  insert: string;
  description: string;
  type: 'tag' | 'attr' | 'snippet';
  color: string;
}

const ALL_SUGGESTIONS: Suggestion[] = [
  // Common tags
  { label: '<div>', insert: '<div>\n  \n</div>', description: 'View container', type: 'tag', color: '#61dafb' },
  { label: '<p>', insert: '<p>متن</p>', description: 'Paragraph', type: 'tag', color: '#a8ff78' },
  { label: '<h1>', insert: '<h1>عنوان</h1>', description: 'Main heading', type: 'tag', color: '#a8ff78' },
  { label: '<h2>', insert: '<h2>ذیلی عنوان</h2>', description: 'Sub heading', type: 'tag', color: '#a8ff78' },
  { label: '<span>', insert: '<span>متن</span>', description: 'Inline text', type: 'tag', color: '#a8ff78' },
  { label: '<img>', insert: '<img src="https://picsum.photos/200/200" alt="تصویر" width="200" height="200">', description: 'Image', type: 'tag', color: '#ff6b6b' },
  { label: '<button>', insert: '<button>کلک کریں</button>', description: 'Button', type: 'tag', color: '#ffd700' },
  { label: '<input>', insert: '<input type="text" placeholder="درج کریں">', description: 'Text input', type: 'tag', color: '#ff9f43' },
  { label: '<input email>', insert: '<input type="email" placeholder="ای میل">', description: 'Email input', type: 'tag', color: '#ff9f43' },
  { label: '<input password>', insert: '<input type="password" placeholder="پاسورڈ">', description: 'Password input', type: 'tag', color: '#ff9f43' },
  { label: '<textarea>', insert: '<textarea placeholder="پیغام لکھیں..."></textarea>', description: 'Multi-line input', type: 'tag', color: '#ff9f43' },
  { label: '<ul>', insert: '<ul>\n  <li>آئٹم 1</li>\n  <li>آئٹم 2</li>\n</ul>', description: 'Unordered list', type: 'tag', color: '#61dafb' },
  { label: '<a href>', insert: '<a href="https://example.com">لنک</a>', description: 'Hyperlink', type: 'tag', color: '#ffd700' },
  { label: '<form>', insert: '<form>\n  \n</form>', description: 'Form container', type: 'tag', color: '#61dafb' },
  { label: '<header>', insert: '<header>\n  \n</header>', description: 'Header section', type: 'tag', color: '#61dafb' },
  { label: '<footer>', insert: '<footer>\n  \n</footer>', description: 'Footer section', type: 'tag', color: '#61dafb' },
  { label: '<nav>', insert: '<nav>\n  \n</nav>', description: 'Navigation', type: 'tag', color: '#61dafb' },
  { label: '<section>', insert: '<section>\n  \n</section>', description: 'Section', type: 'tag', color: '#61dafb' },
  { label: '<strong>', insert: '<strong>جلی متن</strong>', description: 'Bold text', type: 'tag', color: '#a8ff78' },
  { label: '<em>', insert: '<em>ترچھا متن</em>', description: 'Italic text', type: 'tag', color: '#a8ff78' },
  { label: '<hr>', insert: '<hr>', description: 'Horizontal divider', type: 'tag', color: '#b2bec3' },
  { label: '<br>', insert: '<br>', description: 'Line break', type: 'tag', color: '#b2bec3' },
  // Snippets
  { label: '📋 لاگ ان فارم', insert: '<div>\n  <h2>لاگ ان</h2>\n  <input type="email" placeholder="ای میل">\n  <input type="password" placeholder="پاسورڈ">\n  <button>لاگ ان کریں</button>\n</div>', description: 'مکمل لاگ ان فارم', type: 'snippet', color: '#6c5ce7' },
  { label: '🃏 کارڈ', insert: '<div>\n  <img src="https://picsum.photos/300/200" alt="تصویر" width="300" height="200">\n  <h3>عنوان</h3>\n  <p>تفصیل یہاں لکھیں</p>\n  <button>مزید</button>\n</div>', description: 'تصویر والا کارڈ', type: 'snippet', color: '#6c5ce7' },
  { label: '📝 رابطہ فارم', insert: '<form>\n  <input type="text" placeholder="نام">\n  <input type="email" placeholder="ای میل">\n  <textarea placeholder="پیغام"></textarea>\n  <button>بھیجیں</button>\n</form>', description: 'رابطہ فارم', type: 'snippet', color: '#6c5ce7' },
  { label: '📸 گیلری گرڈ', insert: '<div>\n  <div>\n    <img src="https://picsum.photos/150/150?1" alt="1" width="150" height="150">\n    <img src="https://picsum.photos/150/150?2" alt="2" width="150" height="150">\n  </div>\n  <div>\n    <img src="https://picsum.photos/150/150?3" alt="3" width="150" height="150">\n    <img src="https://picsum.photos/150/150?4" alt="4" width="150" height="150">\n  </div>\n</div>', description: 'تصویری گرڈ', type: 'snippet', color: '#6c5ce7' },
  { label: '🧭 نیو بار', insert: '<nav>\n  <a href="#">ہوم</a>\n  <a href="#">پروڈکٹس</a>\n  <a href="#">ہم سے ملیں</a>\n  <button>لاگ ان</button>\n</nav>', description: 'نیویگیشن بار', type: 'snippet', color: '#6c5ce7' },
  { label: '📊 ڈیٹا ٹیبل', insert: '<table>\n  <thead>\n    <tr><th>نام</th><th>قیمت</th><th>اسٹیٹس</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>آئٹم 1</td><td>100</td><td>فعال</td></tr>\n    <tr><td>آئٹم 2</td><td>200</td><td>غیر فعال</td></tr>\n  </tbody>\n</table>', description: 'ڈیٹا ٹیبل', type: 'snippet', color: '#6c5ce7' },
];

function getContextualSuggestions(text: string): Suggestion[] {
  if (!text.trim()) return ALL_SUGGESTIONS;
  const last50 = text.slice(-50).toLowerCase();
  const lastWord = last50.split(/[\s\n]/).pop() || '';

  // Filter by what user is typing
  if (lastWord.startsWith('<')) {
    const partial = lastWord.slice(1);
    return ALL_SUGGESTIONS.filter(s => s.type === 'tag' && s.label.toLowerCase().includes(partial));
  }

  return ALL_SUGGESTIONS;
}

interface Props {
  currentText: string;
  onSelect: (insert: string) => void;
  visible: boolean;
}

export function HtmlAutoComplete({ currentText, onSelect, visible }: Props) {
  if (!visible) return null;

  const suggestions = getContextualSuggestions(currentText);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>💡 HTML سجیشنز</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {suggestions.map((s, i) => (
          <Pressable key={i} onPress={() => onSelect(s.insert)} style={[styles.chip, { borderColor: s.color + '55' }]}>
            <Text style={[styles.chipLabel, { color: s.color }]}>{s.label}</Text>
            <Text style={styles.chipDesc} numberOfLines={1}>{s.description}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#0d1117', borderTopWidth: 1, borderTopColor: '#21262d' },
  header: { paddingHorizontal: Spacing.md, paddingTop: Spacing.xs, paddingBottom: 2 },
  headerText: { color: Colors.textMuted, fontSize: 10, fontWeight: '600' },
  scroll: { flexDirection: 'row', gap: Spacing.sm, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  chip: {
    backgroundColor: '#161b22', borderRadius: Radii.sm, paddingHorizontal: Spacing.sm,
    paddingVertical: 5, borderWidth: 1, minWidth: 80, maxWidth: 140,
  },
  chipLabel: { fontSize: FontSizes.xs, fontFamily: 'monospace', fontWeight: '700' },
  chipDesc: { color: Colors.textMuted, fontSize: 9, marginTop: 1 },
});
