// Powered by OnSpace.AI
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, Radii } from '@/constants/theme';

interface CodeBlockProps {
  code: string;
  title?: string;
  maxLines?: number;
}

// ─── Token types ────────────────────────────────────────────────────────────
type TokenType = 'keyword' | 'jsxTag' | 'string' | 'comment' | 'number' | 'operator' | 'jsx_attr' | 'jsx_value' | 'plain';

interface Token { type: TokenType; text: string }

const KEYWORDS = new Set([
  'import','export','default','from','const','let','var','function','return',
  'if','else','for','while','do','switch','case','break','continue','try','catch',
  'finally','throw','new','typeof','instanceof','in','of','async','await',
  'class','extends','static','get','set','null','undefined','true','false',
  'React','StyleSheet','useState','useEffect','useCallback','useMemo','useRef',
]);

function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const len = code.length;

  while (i < len) {
    // Comment //
    if (code[i] === '/' && code[i + 1] === '/') {
      const end = code.indexOf('\n', i);
      const text = end === -1 ? code.slice(i) : code.slice(i, end);
      tokens.push({ type: 'comment', text });
      i += text.length;
      continue;
    }
    // Comment /* */
    if (code[i] === '/' && code[i + 1] === '*') {
      const end = code.indexOf('*/', i + 2);
      const text = end === -1 ? code.slice(i) : code.slice(i, end + 2);
      tokens.push({ type: 'comment', text });
      i += text.length;
      continue;
    }
    // Strings
    if (code[i] === '"' || code[i] === "'" || code[i] === '`') {
      const quote = code[i];
      let j = i + 1;
      while (j < len && code[j] !== quote) {
        if (code[j] === '\\') j++;
        j++;
      }
      tokens.push({ type: 'string', text: code.slice(i, j + 1) });
      i = j + 1;
      continue;
    }
    // JSX closing tag </Tag>
    if (code[i] === '<' && code[i + 1] === '/') {
      const end = code.indexOf('>', i);
      if (end !== -1) {
        tokens.push({ type: 'jsxTag', text: code.slice(i, end + 1) });
        i = end + 1;
        continue;
      }
    }
    // JSX opening/self-closing tag
    if (code[i] === '<' && (code[i + 1] === undefined || /[A-Za-z]/.test(code[i + 1]))) {
      const end = code.indexOf('>', i);
      if (end !== -1) {
        tokens.push({ type: 'jsxTag', text: code.slice(i, end + 1) });
        i = end + 1;
        continue;
      }
    }
    // Numbers
    if (/[0-9]/.test(code[i]) && (i === 0 || /[\s,(:=]/.test(code[i - 1]))) {
      let j = i;
      while (j < len && /[0-9.]/.test(code[j])) j++;
      tokens.push({ type: 'number', text: code.slice(i, j) });
      i = j;
      continue;
    }
    // Words (keywords or plain)
    if (/[A-Za-z_$]/.test(code[i])) {
      let j = i;
      while (j < len && /[A-Za-z0-9_$]/.test(code[j])) j++;
      const word = code.slice(i, j);
      tokens.push({ type: KEYWORDS.has(word) ? 'keyword' : 'plain', text: word });
      i = j;
      continue;
    }
    // Plain char
    tokens.push({ type: 'plain', text: code[i] });
    i++;
  }
  return tokens;
}

const TOKEN_COLORS: Record<TokenType, string> = {
  keyword: '#c792ea',
  jsxTag: '#89ddff',
  string: '#c3e88d',
  comment: '#546e7a',
  number: '#f78c6c',
  operator: '#89ddff',
  jsx_attr: '#ffcb6b',
  jsx_value: '#c3e88d',
  plain: '#eeffff',
};

export function CodeBlock({ code, title, maxLines = 50 }: CodeBlockProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const lines = code.split('\n');
  const totalLines = lines.length;
  const displayLines = expanded ? lines : lines.slice(0, maxLines);
  const isTruncated = totalLines > maxLines && !expanded;

  const handleCopy = async () => {
    await Clipboard.setStringAsync(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderLine = (line: string, lineNum: number) => {
    const tokens = tokenize(line);
    return (
      <View key={lineNum} style={styles.lineRow}>
        <Text style={styles.lineNum}>{lineNum + 1}</Text>
        <Text style={styles.lineContent}>
          {tokens.map((tok, ti) => (
            <Text key={ti} style={[styles.token, { color: TOKEN_COLORS[tok.type] }]}>
              {tok.text}
            </Text>
          ))}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.dots}>
          <View style={[styles.dot, { backgroundColor: '#ff5f57' }]} />
          <View style={[styles.dot, { backgroundColor: '#febc2e' }]} />
          <View style={[styles.dot, { backgroundColor: '#28c840' }]} />
        </View>
        {title ? (
          <View style={styles.titleRow}>
            <MaterialIcons name="insert-drive-file" size={12} color={Colors.textMuted} />
            <Text style={styles.title} numberOfLines={1}>{title}</Text>
          </View>
        ) : null}
        <View style={styles.headerRight}>
          <Text style={styles.lineCount}>{totalLines} lines</Text>
          <Pressable onPress={handleCopy} style={styles.copyBtn} hitSlop={8}>
            <MaterialIcons
              name={copied ? 'check' : 'content-copy'}
              size={14}
              color={copied ? Colors.primary : Colors.textMuted}
            />
            <Text style={[styles.copyLabel, copied && { color: Colors.primary }]}>
              {copied ? 'کاپی ہو گیا' : 'کاپی'}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Code */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.codeScroll}>
        <View style={styles.codeBody}>
          {displayLines.map((line, i) => renderLine(line, i))}
          {isTruncated ? (
            <Pressable onPress={() => setExpanded(true)} style={styles.showMoreBtn}>
              <Text style={styles.showMoreText}>
                ... مزید {totalLines - maxLines} لائنز دیکھیں
              </Text>
            </Pressable>
          ) : null}
          {expanded && totalLines > maxLines ? (
            <Pressable onPress={() => setExpanded(false)} style={styles.showMoreBtn}>
              <Text style={styles.showMoreText}>کم دکھائیں</Text>
            </Pressable>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0d1117',
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: '#30363d',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#21262d',
    gap: Spacing.sm,
  },
  dots: { flexDirection: 'row', gap: 5 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  titleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  title: {
    color: '#8b949e',
    fontSize: FontSizes.xs,
    fontFamily: 'monospace',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginLeft: 'auto',
  },
  lineCount: {
    color: '#8b949e',
    fontSize: 10,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#21262d',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radii.sm,
    borderWidth: 1,
    borderColor: '#30363d',
  },
  copyLabel: {
    color: '#8b949e',
    fontSize: 11,
    fontWeight: '600',
  },
  codeScroll: { maxHeight: 400 },
  codeBody: {
    padding: Spacing.sm,
    paddingRight: Spacing.xl,
  },
  lineRow: {
    flexDirection: 'row',
    minHeight: 20,
    alignItems: 'flex-start',
  },
  lineNum: {
    color: '#8b949e',
    fontSize: 12,
    fontFamily: 'monospace',
    minWidth: 32,
    textAlign: 'right',
    marginRight: Spacing.md,
    lineHeight: 20,
    userSelect: 'none' as any,
  },
  lineContent: {
    flex: 1,
    lineHeight: 20,
  },
  token: {
    fontSize: 12,
    fontFamily: 'monospace',
    lineHeight: 20,
  },
  showMoreBtn: {
    paddingVertical: Spacing.sm,
    paddingLeft: 44,
  },
  showMoreText: {
    color: Colors.primary,
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },
});
