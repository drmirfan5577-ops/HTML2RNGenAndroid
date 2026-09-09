// Powered by OnSpace.AI
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, Pressable, ActivityIndicator, Linking
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, Radii } from '@/constants/theme';
import { generateShortUrl, validateUrl, extractUrlsFromText, UrlResult, UrlValidation } from '@/services/urlShortener';
import { useAlert } from '@/template';

type ActiveTab = 'shorten' | 'validate' | 'extract';

export default function UrlToolsScreen() {
  const insets = useSafeAreaInsets();
  const { showAlert } = useAlert();
  const [tab, setTab] = useState<ActiveTab>('shorten');
  const [urlInput, setUrlInput] = useState('');
  const [extractInput, setExtractInput] = useState('');
  const [shortResult, setShortResult] = useState<UrlResult | null>(null);
  const [validation, setValidation] = useState<UrlValidation | null>(null);
  const [extractedUrls, setExtractedUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<UrlResult[]>([]);

  const handleShorten = async () => {
    if (!urlInput.trim()) return;
    setIsLoading(true);
    const result = await generateShortUrl(urlInput.trim());
    setShortResult(result);
    if (result.isValid && result.short) {
      setHistory(prev => [result, ...prev.slice(0, 9)]);
    }
    setIsLoading(false);
  };

  const handleValidate = () => {
    if (!urlInput.trim()) return;
    const result = validateUrl(urlInput.trim());
    setValidation(result);
  };

  const handleExtract = () => {
    const urls = extractUrlsFromText(extractInput);
    setExtractedUrls(urls);
  };

  const handleCopy = async (text: string) => {
    await Clipboard.setStringAsync(text);
    showAlert('کاپی ہو گیا', 'URL کلپ بورڈ میں کاپی ہو گیا');
  };

  const handleOpen = (url: string) => {
    Linking.openURL(url).catch(() => showAlert('خرابی', 'URL نہیں کھل سکا'));
  };

  const TABS = [
    { id: 'shorten' as ActiveTab, label: 'شارٹ URL', icon: 'link' },
    { id: 'validate' as ActiveTab, label: 'ویلیڈیٹر', icon: 'verified' },
    { id: 'extract' as ActiveTab, label: 'URLز نکالیں', icon: 'filter-list' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>URL ٹولز</Text>
          <Text style={styles.subtitle}>شارٹنر • ویلیڈیٹر • ایکسٹریکٹر</Text>
        </View>
        <View style={styles.headerIcon}>
          <MaterialIcons name="link" size={22} color={Colors.primary} />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map(t => (
          <Pressable key={t.id} onPress={() => setTab(t.id)}
            style={[styles.tabItem, tab === t.id && styles.tabActive]}>
            <MaterialIcons name={t.icon as any} size={15}
              color={tab === t.id ? Colors.primary : Colors.textMuted} />
            <Text style={[styles.tabLabel, tab === t.id && styles.tabLabelActive]}>
              {t.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView style={styles.flex}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* ── SHORTEN TAB ── */}
        {tab === 'shorten' ? (
          <>
            <Text style={styles.sectionTitle}>طویل URL کو چھوٹا کریں</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.urlInput}
                value={urlInput}
                onChangeText={setUrlInput}
                placeholder="https://example.com/very-long-url..."
                placeholderTextColor={Colors.textMuted}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
              />
              <Pressable
                onPress={handleShorten}
                disabled={!urlInput.trim() || isLoading}
                style={[styles.goBtn, (!urlInput.trim() || isLoading) && styles.goBtnDisabled]}>
                {isLoading
                  ? <ActivityIndicator size={16} color="#000" />
                  : <MaterialIcons name="compress" size={18} color="#000" />}
              </Pressable>
            </View>

            {shortResult ? (
              <View style={[styles.resultCard, { borderColor: shortResult.isValid ? Colors.primary + '55' : Colors.error + '55' }]}>
                {shortResult.isValid ? (
                  <>
                    <View style={styles.resultHeader2}>
                      <MaterialIcons name="check-circle" size={18} color={Colors.primary} />
                      <Text style={styles.resultTitle}>شارٹ URL تیار!</Text>
                    </View>
                    <View style={styles.shortUrlRow}>
                      <Text style={styles.shortUrlText} numberOfLines={1} selectable>{shortResult.short}</Text>
                      <Pressable onPress={() => handleCopy(shortResult.short)} style={styles.copyBtn} hitSlop={8}>
                        <MaterialIcons name="content-copy" size={16} color={Colors.primary} />
                      </Pressable>
                      <Pressable onPress={() => handleOpen(shortResult.short)} style={styles.openBtn} hitSlop={8}>
                        <MaterialIcons name="open-in-new" size={16} color="#000" />
                      </Pressable>
                    </View>
                    {shortResult.error ? (
                      <Text style={styles.resultNote}>{shortResult.error}</Text>
                    ) : null}
                    <Text style={styles.originalLabel}>اصل URL:</Text>
                    <Text style={styles.originalUrl} numberOfLines={2}>{shortResult.original}</Text>
                  </>
                ) : (
                  <View style={styles.errorCard}>
                    <MaterialIcons name="error-outline" size={18} color={Colors.error} />
                    <Text style={styles.errorText}>{shortResult.error}</Text>
                  </View>
                )}
              </View>
            ) : null}

            {/* History */}
            {history.length > 0 ? (
              <View style={styles.historySection}>
                <Text style={styles.sectionTitle}>حالیہ ہسٹری</Text>
                {history.map((item, i) => (
                  <View key={i} style={styles.historyItem}>
                    <View style={styles.historyIcon}>
                      <MaterialIcons name="link" size={14} color={Colors.primary} />
                    </View>
                    <View style={styles.historyInfo}>
                      <Text style={styles.historyShort} numberOfLines={1}>{item.short}</Text>
                      <Text style={styles.historyOriginal} numberOfLines={1}>{item.original}</Text>
                    </View>
                    <Pressable onPress={() => handleCopy(item.short)} hitSlop={8}>
                      <MaterialIcons name="content-copy" size={14} color={Colors.textMuted} />
                    </Pressable>
                  </View>
                ))}
              </View>
            ) : null}
          </>
        ) : null}

        {/* ── VALIDATE TAB ── */}
        {tab === 'validate' ? (
          <>
            <Text style={styles.sectionTitle}>URL کی جانچ کریں</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.urlInput}
                value={urlInput}
                onChangeText={setUrlInput}
                placeholder="https://example.com"
                placeholderTextColor={Colors.textMuted}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
              />
              <Pressable onPress={handleValidate} disabled={!urlInput.trim()}
                style={[styles.goBtn, !urlInput.trim() && styles.goBtnDisabled]}>
                <MaterialIcons name="verified" size={18} color="#000" />
              </Pressable>
            </View>

            {validation ? (
              <View style={[styles.resultCard, { borderColor: validation.isValid ? Colors.primary + '55' : Colors.error + '55' }]}>
                <View style={styles.resultHeader2}>
                  <MaterialIcons
                    name={validation.isValid ? 'check-circle' : 'error'}
                    size={18} color={validation.isValid ? Colors.primary : Colors.error}
                  />
                  <Text style={[styles.resultTitle, { color: validation.isValid ? Colors.primary : Colors.error }]}>
                    {validation.isValid ? 'درست URL' : 'خرابی پائی گئی'}
                  </Text>
                  {validation.isSecure ? (
                    <View style={styles.secureBadge}>
                      <MaterialIcons name="lock" size={10} color={Colors.primary} />
                      <Text style={styles.secureBadgeText}>HTTPS</Text>
                    </View>
                  ) : (
                    <View style={[styles.secureBadge, { backgroundColor: Colors.warning + '22', borderColor: Colors.warning + '44' }]}>
                      <MaterialIcons name="lock-open" size={10} color={Colors.warning} />
                      <Text style={[styles.secureBadgeText, { color: Colors.warning }]}>HTTP</Text>
                    </View>
                  )}
                </View>

                {validation.domain ? (
                  <View style={styles.infoGrid}>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoKey}>پروٹوکول:</Text>
                      <Text style={styles.infoVal}>{validation.protocol}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoKey}>ڈومین:</Text>
                      <Text style={styles.infoVal}>{validation.domain}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoKey}>پاتھ:</Text>
                      <Text style={styles.infoVal}>{validation.path || '/'}</Text>
                    </View>
                    {Object.keys(validation.queryParams).length > 0 ? (
                      <View style={styles.infoRow}>
                        <Text style={styles.infoKey}>پیرامیٹرز:</Text>
                        <Text style={styles.infoVal}>{Object.keys(validation.queryParams).length}</Text>
                      </View>
                    ) : null}
                  </View>
                ) : null}

                {validation.issues.map((issue, i) => (
                  <View key={i} style={styles.issueRow}>
                    <MaterialIcons name="error-outline" size={12} color={Colors.error} />
                    <Text style={styles.issueText}>{issue}</Text>
                  </View>
                ))}

                {validation.suggestions.map((sug, i) => (
                  <View key={i} style={styles.suggestRow}>
                    <MaterialIcons name="lightbulb-outline" size={12} color={Colors.primary} />
                    <Text style={styles.suggestText}>{sug}</Text>
                  </View>
                ))}
              </View>
            ) : null}
          </>
        ) : null}

        {/* ── EXTRACT TAB ── */}
        {tab === 'extract' ? (
          <>
            <Text style={styles.sectionTitle}>متن سے URLز نکالیں</Text>
            <Text style={styles.sectionDesc}>کسی بھی متن، کوڈ، یا HTML سے تمام URLs خودکار نکالیں</Text>
            <TextInput
              style={styles.bigInput}
              value={extractInput}
              onChangeText={setExtractInput}
              placeholder="یہاں متن، HTML یا کوڈ پیسٹ کریں..."
              placeholderTextColor={Colors.textMuted}
              multiline
              textAlignVertical="top"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Pressable onPress={handleExtract} disabled={!extractInput.trim()}
              style={[styles.extractBtn, !extractInput.trim() && styles.goBtnDisabled]}>
              <MaterialIcons name="filter-list" size={18} color="#000" />
              <Text style={styles.extractBtnText}>URLز نکالیں</Text>
            </Pressable>

            {extractedUrls.length > 0 ? (
              <View style={styles.extractedList}>
                <View style={styles.extractedHeader}>
                  <Text style={styles.extractedTitle}>{extractedUrls.length} URL ملے</Text>
                  <Pressable onPress={() => handleCopy(extractedUrls.join('\n'))} style={styles.copyAllBtn}>
                    <MaterialIcons name="content-copy" size={14} color={Colors.primary} />
                    <Text style={styles.copyAllText}>سب کاپی کریں</Text>
                  </Pressable>
                </View>
                {extractedUrls.map((url, i) => (
                  <View key={i} style={styles.extractedItem}>
                    <Text style={styles.extractedNum}>{i + 1}</Text>
                    <Text style={styles.extractedUrl} numberOfLines={1} selectable>{url}</Text>
                    <Pressable onPress={() => handleCopy(url)} hitSlop={8}>
                      <MaterialIcons name="content-copy" size={14} color={Colors.textMuted} />
                    </Pressable>
                    <Pressable onPress={() => handleOpen(url)} hitSlop={8}>
                      <MaterialIcons name="open-in-new" size={14} color={Colors.primary} />
                    </Pressable>
                  </View>
                ))}
              </View>
            ) : extractInput.length > 0 ? (
              <View style={styles.emptyExtract}>
                <MaterialIcons name="search-off" size={32} color={Colors.textMuted} />
                <Text style={styles.emptyExtractText}>کوئی URL نہیں ملا</Text>
              </View>
            ) : null}
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  title: { color: Colors.textPrimary, fontSize: FontSizes.xl, fontWeight: '800' },
  subtitle: { color: Colors.textMuted, fontSize: FontSizes.xs, marginTop: 2 },
  headerIcon: {
    width: 40, height: 40, borderRadius: Radii.md, backgroundColor: Colors.primary + '22',
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.primary + '44',
  },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: Colors.border },
  tabItem: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: Spacing.md },
  tabActive: { borderBottomWidth: 2, borderBottomColor: Colors.primary },
  tabLabel: { color: Colors.textMuted, fontSize: FontSizes.xs, fontWeight: '600' },
  tabLabelActive: { color: Colors.primary },
  content: { padding: Spacing.base, gap: Spacing.md },
  sectionTitle: { color: Colors.textPrimary, fontSize: FontSizes.base, fontWeight: '700' },
  sectionDesc: { color: Colors.textMuted, fontSize: FontSizes.xs, marginTop: -Spacing.xs },
  inputRow: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'center' },
  urlInput: {
    flex: 1, backgroundColor: Colors.surface, borderRadius: Radii.md, paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm, borderWidth: 1, borderColor: Colors.border,
    color: Colors.textPrimary, fontSize: FontSizes.sm, fontFamily: 'monospace',
  },
  goBtn: {
    width: 46, height: 46, borderRadius: Radii.md, backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  goBtnDisabled: { opacity: 0.4 },
  resultCard: {
    backgroundColor: Colors.surface, borderRadius: Radii.md, padding: Spacing.base,
    borderWidth: 1, gap: Spacing.sm,
  },
  resultHeader2: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  resultTitle: { color: Colors.textPrimary, fontSize: FontSizes.base, fontWeight: '700', flex: 1 },
  shortUrlRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.primary + '11', borderRadius: Radii.sm, padding: Spacing.sm,
    borderWidth: 1, borderColor: Colors.primary + '33',
  },
  shortUrlText: { flex: 1, color: Colors.primary, fontSize: FontSizes.sm, fontFamily: 'monospace', fontWeight: '700' },
  copyBtn: { padding: 4 },
  openBtn: { padding: 4, backgroundColor: Colors.primary, borderRadius: Radii.xs },
  resultNote: { color: Colors.textMuted, fontSize: FontSizes.xs },
  originalLabel: { color: Colors.textMuted, fontSize: FontSizes.xs, marginTop: 4 },
  originalUrl: { color: Colors.textSecondary, fontSize: FontSizes.xs, fontFamily: 'monospace' },
  errorCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  errorText: { color: Colors.error, fontSize: FontSizes.sm, flex: 1 },
  historySection: { gap: Spacing.sm },
  historyItem: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.surface, borderRadius: Radii.sm, padding: Spacing.sm,
    borderWidth: 1, borderColor: Colors.border,
  },
  historyIcon: {
    width: 28, height: 28, borderRadius: Radii.xs, backgroundColor: Colors.primary + '22',
    alignItems: 'center', justifyContent: 'center',
  },
  historyInfo: { flex: 1 },
  historyShort: { color: Colors.primary, fontSize: FontSizes.xs, fontFamily: 'monospace', fontWeight: '700' },
  historyOriginal: { color: Colors.textMuted, fontSize: 10 },
  secureBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: Colors.primary + '22', borderRadius: Radii.full,
    paddingHorizontal: 6, paddingVertical: 2, borderWidth: 1, borderColor: Colors.primary + '44',
  },
  secureBadgeText: { color: Colors.primary, fontSize: 9, fontWeight: '700' },
  infoGrid: { gap: 4 },
  infoRow: { flexDirection: 'row', gap: Spacing.sm },
  infoKey: { color: Colors.textMuted, fontSize: FontSizes.xs, width: 80 },
  infoVal: { color: Colors.textPrimary, fontSize: FontSizes.xs, fontFamily: 'monospace', flex: 1 },
  issueRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  issueText: { color: Colors.error, fontSize: FontSizes.xs, flex: 1 },
  suggestRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  suggestText: { color: Colors.primary, fontSize: FontSizes.xs, flex: 1 },
  bigInput: {
    backgroundColor: Colors.surface, borderRadius: Radii.md, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.border, color: Colors.textPrimary,
    fontSize: FontSizes.xs, fontFamily: 'monospace', minHeight: 130, textAlignVertical: 'top',
  },
  extractBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
    backgroundColor: Colors.primary, borderRadius: Radii.md, paddingVertical: 14,
  },
  extractBtnText: { color: '#000', fontSize: FontSizes.base, fontWeight: '700' },
  extractedList: { gap: Spacing.sm },
  extractedHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  extractedTitle: { color: Colors.textPrimary, fontSize: FontSizes.base, fontWeight: '700' },
  copyAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.primary + '22', paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radii.full },
  copyAllText: { color: Colors.primary, fontSize: FontSizes.xs, fontWeight: '600' },
  extractedItem: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.surface, borderRadius: Radii.sm, padding: Spacing.sm,
    borderWidth: 1, borderColor: Colors.border,
  },
  extractedNum: { color: Colors.textMuted, fontSize: 10, width: 16, textAlign: 'right' },
  extractedUrl: { flex: 1, color: Colors.textPrimary, fontSize: FontSizes.xs, fontFamily: 'monospace' },
  emptyExtract: { alignItems: 'center', paddingVertical: Spacing.xl, gap: Spacing.sm },
  emptyExtractText: { color: Colors.textMuted, fontSize: FontSizes.sm },
});
