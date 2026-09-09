// Powered by OnSpace.AI
import React, { useState, useCallback, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView,
  Platform, Pressable, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, Radii } from '@/constants/theme';
import { Button, CodeBlock } from '@/components';
import { convertHtmlToRN, SAMPLE_HTML, ConversionResult } from '@/services/htmlConverter';
import { validateHTML, ValidationResult } from '@/services/htmlValidator';
import { shareCode, copyToClipboard } from '@/services/exportService';
import { useHistory } from '@/hooks/useHistory';
import { useAlert } from '@/template';
import { CodePreview } from '@/components/feature/CodePreview';
import { HtmlAutoComplete } from '@/components/feature/HtmlAutoComplete';

type ActiveTab = 'input' | 'validate' | 'output' | 'preview';

export default function ConverterScreen() {
  const insets = useSafeAreaInsets();
  const [htmlInput, setHtmlInput] = useState('');
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('input');
  const [isSharing, setIsSharing] = useState(false);
  const [showAutoComplete, setShowAutoComplete] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const { addToHistory } = useHistory();
  const { showAlert } = useAlert();

  const handleConvert = useCallback(() => {
    const val = validateHTML(htmlInput);
    setValidation(val);
    const converted = convertHtmlToRN(htmlInput);
    setResult(converted);
    if (val.errors.length > 0) {
      setActiveTab('validate');
    } else {
      setActiveTab('output');
    }
    addToHistory(htmlInput, converted);
  }, [htmlInput, addToHistory]);

  const handleValidateOnly = useCallback(() => {
    const val = validateHTML(htmlInput);
    setValidation(val);
    setActiveTab('validate');
  }, [htmlInput]);

  const handleSample = useCallback(() => {
    setHtmlInput(SAMPLE_HTML);
    setResult(null);
    setValidation(null);
    setActiveTab('input');
  }, []);

  const handleClear = useCallback(() => {
    setHtmlInput('');
    setResult(null);
    setValidation(null);
    setActiveTab('input');
  }, []);

  const handleCopy = useCallback(async () => {
    if (!result?.code) return;
    const ok = await copyToClipboard(result.code);
    showAlert(ok ? 'کاپی ہو گیا' : 'خرابی', ok ? 'کوڈ کلپ بورڈ میں کاپی ہو گیا' : 'کاپی نہیں ہو سکا');
  }, [result, showAlert]);

  const handleShare = useCallback(async () => {
    if (!result?.code) return;
    setIsSharing(true);
    await shareCode(result.code, 'ConvertedComponent.tsx');
    setIsSharing(false);
  }, [result]);

  const handleAutoCompleteSelect = useCallback((insert: string) => {
    const currentText = htmlInput;
    const lines = currentText.split('\n');
    const lastLine = lines[lines.length - 1];
    const ltIdx = lastLine.lastIndexOf('<');
    if (ltIdx >= 0) {
      lines[lines.length - 1] = lastLine.slice(0, ltIdx);
      setHtmlInput(lines.join('\n') + insert);
    } else {
      setHtmlInput(currentText + insert);
    }
    setShowAutoComplete(false);
  }, [htmlInput]);

  const TABS: { id: ActiveTab; label: string; icon: string; badge?: number | null }[] = [
    { id: 'input', label: 'HTML ان پٹ', icon: 'code' },
    { id: 'validate', label: 'ویلیڈیٹر', icon: 'verified', badge: validation ? validation.errors.length : null },
    { id: 'output', label: 'RN کوڈ', icon: 'output', badge: result ? result.stats.elementsConverted : null },
    { id: 'preview', label: 'پریویو', icon: 'phone-android' },
  ];

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>HTML کنورٹر</Text>
            <Text style={styles.headerSub}>HTML → React Native</Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable onPress={handleSample} style={styles.iconBtn} hitSlop={8}>
              <MaterialIcons name="science" size={18} color={Colors.primary} />
            </Pressable>
            <Pressable onPress={handleClear} style={styles.iconBtn} hitSlop={8}>
              <MaterialIcons name="delete-outline" size={18} color={Colors.error} />
            </Pressable>
          </View>
        </View>

        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}
          contentContainerStyle={styles.tabsContent}>
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <Pressable key={tab.id} onPress={() => setActiveTab(tab.id)}
                style={[styles.tab, isActive && styles.tabActive]}>
                <MaterialIcons name={tab.icon as any} size={15}
                  color={isActive ? Colors.primary : Colors.textMuted} />
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {tab.label}
                </Text>
                {tab.badge !== null && tab.badge !== undefined && tab.badge > 0 ? (
                  <View style={[styles.tabBadge, tab.id === 'validate' && validation && validation.errors.length > 0 ? { backgroundColor: Colors.error } : {}]}>
                    <Text style={styles.tabBadgeText}>{tab.badge}</Text>
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </ScrollView>

        {/* ── INPUT TAB ── */}
        {activeTab === 'input' ? (
          <View style={styles.flex}>
            <ScrollView style={styles.flex}
              contentContainerStyle={[styles.inputArea, { paddingBottom: showAutoComplete ? 160 : insets.bottom + 100 }]}
              showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <View style={styles.hintRow}>
                <MaterialIcons name="info-outline" size={13} color={Colors.textMuted} />
                <Text style={styles.hint}>HTML کوڈ نیچے پیسٹ کریں یا نمونہ بٹن دبائیں</Text>
              </View>

              <View style={styles.editorContainer}>
                <View style={styles.editorHeader}>
                  <View style={styles.dots}>
                    <View style={[styles.dot, { backgroundColor: '#ff5f57' }]} />
                    <View style={[styles.dot, { backgroundColor: '#febc2e' }]} />
                    <View style={[styles.dot, { backgroundColor: '#28c840' }]} />
                  </View>
                  <Text style={styles.editorTitle}>index.html</Text>
                  <Pressable onPress={() => setShowAutoComplete(v => !v)} style={styles.acToggle}>
                    <MaterialIcons name="auto-fix-high" size={14} color={showAutoComplete ? Colors.primary : Colors.textMuted} />
                    <Text style={[styles.acLabel, showAutoComplete && { color: Colors.primary }]}>Auto</Text>
                  </Pressable>
                  <MaterialIcons name="html" size={14} color="#ff6b6b" />
                </View>
                <TextInput
                  ref={inputRef}
                  style={styles.editor}
                  value={htmlInput}
                  onChangeText={setHtmlInput}
                  placeholder={"<div>\n  <h1>میری ایپ</h1>\n  ...\n</div>"}
                  placeholderTextColor={Colors.textMuted}
                  multiline
                  textAlignVertical="top"
                  autoCapitalize="none"
                  autoCorrect={false}
                  spellCheck={false}
                />
                {htmlInput.length > 0 ? (
                  <Text style={styles.charCount}>{htmlInput.length} حروف</Text>
                ) : null}
              </View>

              <View style={styles.actionRow}>
                <Button label="تبدیل کریں" onPress={handleConvert}
                  disabled={!htmlInput.trim()} style={{ flex: 1 }}
                  icon={<MaterialIcons name="transform" size={16} color="#000" />} />
                <Pressable onPress={handleValidateOnly} style={[styles.validateBtn, !htmlInput.trim() && styles.validateBtnDisabled]}>
                  <MaterialIcons name="verified" size={16} color={Colors.primary} />
                  <Text style={styles.validateBtnText}>جانچیں</Text>
                </Pressable>
              </View>

              <Pressable onPress={handleSample} style={styles.sampleBtn}>
                <MaterialIcons name="science" size={14} color={Colors.primary} />
                <Text style={styles.sampleBtnText}>نمونہ HTML لوڈ کریں</Text>
              </Pressable>
            </ScrollView>

            {/* AutoComplete strip */}
            <HtmlAutoComplete
              currentText={htmlInput}
              onSelect={handleAutoCompleteSelect}
              visible={showAutoComplete}
            />
          </View>
        ) : null}

        {/* ── VALIDATE TAB ── */}
        {activeTab === 'validate' ? (
          <ScrollView style={styles.flex}
            contentContainerStyle={[styles.outputArea, { paddingBottom: insets.bottom + 80 }]}
            showsVerticalScrollIndicator={false}>
            {validation ? (
              <>
                {/* Summary */}
                <View style={[styles.validSummary, { borderColor: validation.isValid ? Colors.primary + '55' : Colors.error + '55' }]}>
                  <MaterialIcons
                    name={validation.isValid ? 'check-circle' : 'error'}
                    size={28} color={validation.isValid ? Colors.primary : Colors.error}
                  />
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={[styles.validTitle, { color: validation.isValid ? Colors.primary : Colors.error }]}>
                      {validation.isValid ? 'HTML بالکل درست ہے!' : `${validation.errors.length} خرابی پائی گئی`}
                    </Text>
                    <Text style={styles.validSub}>
                      {validation.stats.tags} ٹیگز • {validation.stats.errors} errors • {validation.stats.warnings} warnings
                    </Text>
                  </View>
                </View>

                {/* Errors */}
                {validation.errors.map((err, i) => (
                  <View key={`err-${i}`} style={[styles.issueCard, { borderColor: Colors.error + '44' }]}>
                    <View style={styles.issueHeader}>
                      <MaterialIcons name="error-outline" size={14} color={Colors.error} />
                      <Text style={[styles.issueLabel, { color: Colors.error }]}>خرابی • سطر {err.line}</Text>
                    </View>
                    <Text style={styles.issueMsg}>{err.message}</Text>
                    {err.suggestion ? (
                      <View style={styles.issueSuggest}>
                        <MaterialIcons name="lightbulb-outline" size={11} color={Colors.primary} />
                        <Text style={styles.issueSuggestText}>{err.suggestion}</Text>
                      </View>
                    ) : null}
                  </View>
                ))}

                {/* Warnings */}
                {validation.warnings.map((w, i) => (
                  <View key={`warn-${i}`} style={[styles.issueCard, { borderColor: Colors.warning + '44' }]}>
                    <View style={styles.issueHeader}>
                      <MaterialIcons name="warning-amber" size={14} color={Colors.warning} />
                      <Text style={[styles.issueLabel, { color: Colors.warning }]}>وارننگ • سطر {w.line}</Text>
                    </View>
                    <Text style={styles.issueMsg}>{w.message}</Text>
                    {w.suggestion ? (
                      <View style={styles.issueSuggest}>
                        <MaterialIcons name="lightbulb-outline" size={11} color={Colors.primary} />
                        <Text style={styles.issueSuggestText}>{w.suggestion}</Text>
                      </View>
                    ) : null}
                  </View>
                ))}

                {/* Infos */}
                {validation.infos.map((info, i) => (
                  <View key={`info-${i}`} style={[styles.issueCard, { borderColor: Colors.info + '44' }]}>
                    <View style={styles.issueHeader}>
                      <MaterialIcons name="info-outline" size={14} color={Colors.info} />
                      <Text style={[styles.issueLabel, { color: Colors.info }]}>معلومات • سطر {info.line}</Text>
                    </View>
                    <Text style={styles.issueMsg}>{info.message}</Text>
                  </View>
                ))}

                {validation.isValid ? (
                  <Button label="React Native میں تبدیل کریں" onPress={handleConvert}
                    icon={<MaterialIcons name="transform" size={16} color="#000" />} />
                ) : (
                  <Button label="بہرحال تبدیل کریں" onPress={() => { const c = convertHtmlToRN(htmlInput); setResult(c); setActiveTab('output'); }} variant="secondary"
                    icon={<MaterialIcons name="transform" size={16} color={Colors.textPrimary} />} />
                )}
              </>
            ) : (
              <View style={styles.emptyOutput}>
                <MaterialIcons name="verified" size={48} color={Colors.textMuted} />
                <Text style={styles.emptyTitle}>ابھی ویلیڈیشن نہیں</Text>
                <Text style={styles.emptyDesc}>ان پٹ ٹیب میں HTML لکھ کر "جانچیں" دبائیں</Text>
                <Pressable onPress={() => setActiveTab('input')} style={styles.goInputBtn}>
                  <Text style={styles.goInputText}>HTML لکھیں</Text>
                </Pressable>
              </View>
            )}
          </ScrollView>
        ) : null}

        {/* ── OUTPUT TAB ── */}
        {activeTab === 'output' ? (
          <ScrollView style={styles.flex}
            contentContainerStyle={[styles.outputArea, { paddingBottom: insets.bottom + 80 }]}
            showsVerticalScrollIndicator={false}>
            {result ? (
              <>
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Text style={[styles.statVal, { color: Colors.primary }]}>{result.stats.elementsConverted}</Text>
                    <Text style={styles.statKey}>عناصر</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={[styles.statVal, { color: '#61dafb' }]}>{result.imports.length}</Text>
                    <Text style={styles.statKey}>امپورٹس</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={[styles.statVal, { color: result.warnings.length > 0 ? Colors.warning : Colors.primary }]}>
                      {result.warnings.length}
                    </Text>
                    <Text style={styles.statKey}>وارننگز</Text>
                  </View>
                </View>

                <View style={styles.exportRow}>
                  <Pressable onPress={handleCopy} style={styles.exportBtn}>
                    <MaterialIcons name="content-copy" size={16} color={Colors.primary} />
                    <Text style={styles.exportBtnText}>کاپی کریں</Text>
                  </Pressable>
                  <Pressable onPress={handleShare} style={[styles.exportBtn, styles.exportBtnShare]} disabled={isSharing}>
                    {isSharing ? <ActivityIndicator size={16} color="#000" /> : <MaterialIcons name="share" size={16} color="#000" />}
                    <Text style={[styles.exportBtnText, { color: '#000' }]}>
                      {isSharing ? 'شیئر ہو رہا ہے...' : 'شیئر کریں'}
                    </Text>
                  </Pressable>
                  <Pressable onPress={() => setActiveTab('preview')} style={styles.exportBtn}>
                    <MaterialIcons name="phone-android" size={16} color={Colors.primary} />
                    <Text style={styles.exportBtnText}>پریویو</Text>
                  </Pressable>
                </View>

                {result.warnings.length > 0 ? (
                  <View style={styles.warningsCard}>
                    <View style={styles.warningHeader}>
                      <MaterialIcons name="warning-amber" size={14} color={Colors.warning} />
                      <Text style={styles.warningTitle}>وارننگز ({result.warnings.length})</Text>
                    </View>
                    {result.warnings.map((w, i) => (
                      <Text key={i} style={styles.warningText}>• {w}</Text>
                    ))}
                  </View>
                ) : null}

                <View style={styles.importsCard}>
                  <Text style={styles.cardLabel}>درکار امپورٹس</Text>
                  <View style={styles.importsList}>
                    {result.imports.map(imp => (
                      <View key={imp} style={styles.importChip}>
                        <Text style={styles.importText}>{imp}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <Text style={styles.codeLabel}>جنریٹڈ کوڈ (سینٹیکس ہائی لائٹنگ)</Text>
                <CodeBlock code={result.code} title="ConvertedComponent.tsx" maxLines={40} />

                <Button label="واپس ترمیم کریں" onPress={() => setActiveTab('input')} variant="secondary"
                  style={{ marginTop: Spacing.sm }}
                  icon={<MaterialIcons name="edit" size={16} color={Colors.textPrimary} />} />
              </>
            ) : (
              <View style={styles.emptyOutput}>
                <MaterialIcons name="output" size={48} color={Colors.textMuted} />
                <Text style={styles.emptyTitle}>ابھی کوئی آؤٹ پٹ نہیں</Text>
                <Text style={styles.emptyDesc}>HTML ان پٹ ٹیب میں کوڈ لکھ کر تبدیل کریں</Text>
                <Pressable onPress={() => setActiveTab('input')} style={styles.goInputBtn}>
                  <Text style={styles.goInputText}>HTML لکھیں</Text>
                </Pressable>
              </View>
            )}
          </ScrollView>
        ) : null}

        {/* ── PREVIEW TAB ── */}
        {activeTab === 'preview' ? (
          <ScrollView style={styles.flex}
            contentContainerStyle={[styles.outputArea, { paddingBottom: insets.bottom + 80, alignItems: 'center' }]}
            showsVerticalScrollIndicator={false}>
            {result ? (
              <>
                <Text style={styles.previewTitle}>بصری پریویو</Text>
                <Text style={styles.previewSub}>RN کمپوننٹ کی عکاسی</Text>
                <CodePreview code={result.code} />
                <Button label="کوڈ دیکھیں" onPress={() => setActiveTab('output')} variant="secondary"
                  style={{ marginTop: Spacing.lg, width: '100%' }}
                  icon={<MaterialIcons name="code" size={16} color={Colors.textPrimary} />} />
              </>
            ) : (
              <View style={styles.emptyOutput}>
                <MaterialIcons name="phone-android" size={48} color={Colors.textMuted} />
                <Text style={styles.emptyTitle}>پریویو کے لیے تبدیل کریں</Text>
                <Pressable onPress={() => setActiveTab('input')} style={styles.goInputBtn}>
                  <Text style={styles.goInputText}>HTML لکھیں</Text>
                </Pressable>
              </View>
            )}
          </ScrollView>
        ) : null}
      </View>
    </KeyboardAvoidingView>
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
  headerTitle: { color: Colors.textPrimary, fontSize: FontSizes.xl, fontWeight: '800' },
  headerSub: { color: Colors.primary, fontSize: FontSizes.xs, fontFamily: 'monospace' },
  headerActions: { flexDirection: 'row', gap: Spacing.sm },
  iconBtn: {
    width: 36, height: 36, borderRadius: Radii.sm, backgroundColor: Colors.surface,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border,
  },
  tabsScroll: { borderBottomWidth: 1, borderBottomColor: Colors.border, flexGrow: 0 },
  tabsContent: { flexDirection: 'row', paddingHorizontal: Spacing.sm },
  tab: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: Spacing.md, paddingHorizontal: Spacing.sm },
  tabActive: { borderBottomWidth: 2, borderBottomColor: Colors.primary },
  tabLabel: { color: Colors.textMuted, fontSize: FontSizes.xs, fontWeight: '600' },
  tabLabelActive: { color: Colors.primary },
  tabBadge: { backgroundColor: Colors.primary, borderRadius: Radii.full, width: 17, height: 17, alignItems: 'center', justifyContent: 'center' },
  tabBadgeText: { color: '#000', fontSize: 9, fontWeight: '800' },
  inputArea: { padding: Spacing.base, gap: Spacing.md },
  hintRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  hint: { color: Colors.textMuted, fontSize: FontSizes.xs },
  editorContainer: { backgroundColor: '#0d1117', borderRadius: Radii.md, borderWidth: 1, borderColor: '#30363d', overflow: 'hidden' },
  editorHeader: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: '#21262d', gap: Spacing.sm,
  },
  dots: { flexDirection: 'row', gap: 5 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  editorTitle: { flex: 1, color: '#8b949e', fontSize: FontSizes.sm, fontFamily: 'monospace' },
  acToggle: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#21262d', paddingHorizontal: 6, paddingVertical: 2, borderRadius: Radii.sm },
  acLabel: { color: Colors.textMuted, fontSize: 10, fontWeight: '700' },
  editor: { color: '#c9d1d9', fontFamily: 'monospace', fontSize: FontSizes.sm, lineHeight: 22, padding: Spacing.md, minHeight: 200 },
  charCount: { color: '#8b949e', fontSize: 10, textAlign: 'right', paddingRight: Spacing.md, paddingBottom: Spacing.sm },
  actionRow: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'center' },
  validateBtn: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.xs,
    backgroundColor: Colors.surface, borderRadius: Radii.md, paddingVertical: 14, paddingHorizontal: Spacing.md,
    borderWidth: 1, borderColor: Colors.primary + '55',
  },
  validateBtnDisabled: { opacity: 0.4 },
  validateBtnText: { color: Colors.primary, fontSize: FontSizes.sm, fontWeight: '700' },
  sampleBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.xs, paddingVertical: Spacing.sm },
  sampleBtnText: { color: Colors.primary, fontSize: FontSizes.sm, fontWeight: '600' },
  outputArea: { padding: Spacing.base, gap: Spacing.md },
  validSummary: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.surface, borderRadius: Radii.md, padding: Spacing.base,
    borderWidth: 1,
  },
  validTitle: { fontSize: FontSizes.base, fontWeight: '800' },
  validSub: { color: Colors.textMuted, fontSize: FontSizes.xs },
  issueCard: {
    backgroundColor: Colors.surface, borderRadius: Radii.md, padding: Spacing.md,
    borderWidth: 1, gap: Spacing.xs,
  },
  issueHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  issueLabel: { fontSize: FontSizes.xs, fontWeight: '700' },
  issueMsg: { color: Colors.textPrimary, fontSize: FontSizes.sm },
  issueSuggest: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  issueSuggestText: { color: Colors.primary, fontSize: FontSizes.xs },
  exportRow: { flexDirection: 'row', gap: Spacing.sm },
  exportBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.xs, backgroundColor: Colors.surface, borderRadius: Radii.md,
    paddingVertical: Spacing.sm, borderWidth: 1, borderColor: Colors.primary + '44',
  },
  exportBtnShare: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  exportBtnText: { color: Colors.primary, fontSize: FontSizes.xs, fontWeight: '700' },
  statsRow: {
    flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: Radii.md,
    padding: Spacing.base, borderWidth: 1, borderColor: Colors.border,
    justifyContent: 'space-around', alignItems: 'center',
  },
  statItem: { alignItems: 'center', gap: 2 },
  statVal: { fontSize: FontSizes.xxl, fontWeight: '800' },
  statKey: { color: Colors.textSecondary, fontSize: FontSizes.xs },
  statDivider: { width: 1, height: 36, backgroundColor: Colors.border },
  warningsCard: {
    backgroundColor: Colors.warning + '11', borderRadius: Radii.md, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.warning + '33', gap: Spacing.xs,
  },
  warningHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  warningTitle: { color: Colors.warning, fontSize: FontSizes.sm, fontWeight: '700' },
  warningText: { color: Colors.warning, fontSize: FontSizes.xs },
  importsCard: { backgroundColor: Colors.surface, borderRadius: Radii.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, gap: Spacing.sm },
  cardLabel: { color: Colors.textSecondary, fontSize: FontSizes.sm, fontWeight: '600' },
  importsList: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  importChip: { backgroundColor: Colors.primary + '22', borderRadius: Radii.full, paddingHorizontal: Spacing.sm, paddingVertical: 3, borderWidth: 1, borderColor: Colors.primary + '44' },
  importText: { color: Colors.primary, fontSize: FontSizes.xs, fontFamily: 'monospace', fontWeight: '600' },
  codeLabel: { color: Colors.textPrimary, fontSize: FontSizes.base, fontWeight: '700' },
  previewTitle: { color: Colors.textPrimary, fontSize: FontSizes.xl, fontWeight: '800', textAlign: 'center' },
  previewSub: { color: Colors.textMuted, fontSize: FontSizes.sm, textAlign: 'center' },
  emptyOutput: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.xxxl * 2, gap: Spacing.md },
  emptyTitle: { color: Colors.textSecondary, fontSize: FontSizes.lg, fontWeight: '700' },
  emptyDesc: { color: Colors.textMuted, fontSize: FontSizes.sm, textAlign: 'center' },
  goInputBtn: { paddingHorizontal: Spacing.xl, paddingVertical: Spacing.sm, backgroundColor: Colors.primary + '22', borderRadius: Radii.full, borderWidth: 1, borderColor: Colors.primary + '44' },
  goInputText: { color: Colors.primary, fontWeight: '700', fontSize: FontSizes.sm },
});
