// Powered by OnSpace.AI
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, Radii } from '@/constants/theme';
import { TEMPLATES } from '@/constants/templates';
import { Badge, CodeBlock, Button } from '@/components';

const FILE_TYPE_COLORS = {
  component: Colors.primary,
  screen: '#61dafb',
  config: '#ffd700',
  data: '#a29bfe',
  util: '#ff9f43',
};

const FILE_TYPE_ICONS: Record<string, string> = {
  component: 'widgets',
  screen: 'phone-android',
  config: 'settings',
  data: 'storage',
  util: 'build',
};

export default function TemplateDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeFile, setActiveFile] = useState<string | null>(null);

  const template = TEMPLATES.find(t => t.id === id);

  if (!template) {
    return (
      <View style={[styles.container, styles.center, { paddingTop: insets.top }]}>
        <MaterialIcons name="error-outline" size={48} color={Colors.error} />
        <Text style={styles.errorText}>ٹیمپلیٹ نہیں ملا</Text>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>واپس جائیں</Text>
        </Pressable>
      </View>
    );
  }

  const SAMPLE_CODES: Record<string, string> = {
    'App.js': `import React from 'react';\nimport { StyleSheet, View } from 'react-native';\nimport AppNavigator from './navigation/AppNavigator';\n\nexport default function App() {\n  return (\n    <View style={styles.container}>\n      <AppNavigator />\n    </View>\n  );\n}\n\nconst styles = StyleSheet.create({\n  container: { flex: 1 },\n});`,
    'screens/HomeScreen.js': `import React from 'react';\nimport { View, Text, StyleSheet } from 'react-native';\n\nexport default function HomeScreen({ navigation }) {\n  return (\n    <View style={styles.container}>\n      {/* REPLACE_HTML_COMPONENTS_HERE */}\n    </View>\n  );\n}\n\nconst styles = StyleSheet.create({\n  container: { flex: 1, padding: 16, backgroundColor: '#fff' },\n});`,
    'package.json': `{\n  "name": "${template.id}",\n  "version": "1.0.0",\n  "main": "node_modules/expo/AppEntry.js",\n  "scripts": {\n    "start": "expo start",\n    "android": "expo start --android",\n    "ios": "expo start --ios"\n  },\n  "dependencies": {\n    "expo": "~51.0.0",\n    "react": "18.2.0",\n    "react-native": "0.74.0",\n    "@react-navigation/native": "^6.1.9",\n    "@react-navigation/native-stack": "^6.9.17"\n  }\n}`,
  };

  const selectedFile = template.files.find(f => f.path === activeFile);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={22} color={Colors.textPrimary} />
        </Pressable>
        <View style={styles.headerInfo}>
          <View style={[styles.headerIcon, { backgroundColor: template.color + '22' }]}>
            <MaterialIcons name={template.icon as any} size={20} color={template.color} />
          </View>
          <View>
            <Text style={styles.headerTitle}>{template.urduName}</Text>
            <Text style={styles.headerSub}>{template.name}</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Description */}
        <View style={[styles.descCard, { borderColor: template.color + '44' }]}>
          <Text style={styles.descText}>{template.urduDescription}</Text>
          <View style={styles.tags}>
            {template.tags.map(tag => (
              <Badge key={tag} label={tag} color={template.color} />
            ))}
          </View>
        </View>

        {/* File structure */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>فائل اسٹرکچر ({template.files.length} فائلز)</Text>

          <View style={styles.fileTree}>
            <View style={styles.treeRoot}>
              <MaterialIcons name="folder-open" size={16} color={template.color} />
              <Text style={[styles.treeName, { color: template.color }]}>{template.id}/</Text>
            </View>

            {template.files.map((file, i) => {
              const typeColor = FILE_TYPE_COLORS[file.type];
              const typeIcon = FILE_TYPE_ICONS[file.type];
              const isActive = activeFile === file.path;

              return (
                <Pressable
                  key={file.path}
                  onPress={() => setActiveFile(isActive ? null : file.path)}
                  style={[styles.treeFile, isActive && styles.treeFileActive]}
                >
                  <View style={styles.treeIndent}>
                    <View style={styles.treeLine} />
                    <MaterialIcons
                      name={typeIcon as any}
                      size={14}
                      color={isActive ? typeColor : Colors.textMuted}
                    />
                    <Text style={[styles.treeFileName, isActive && { color: typeColor }]}>
                      {file.path}
                    </Text>
                  </View>
                  <View style={styles.treeRight}>
                    <Text style={styles.treeDesc}>{file.description}</Text>
                    <MaterialIcons
                      name={isActive ? 'expand-less' : 'expand-more'}
                      size={14}
                      color={Colors.textMuted}
                    />
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Code preview */}
        {activeFile && SAMPLE_CODES[activeFile] ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>کوڈ پریویو</Text>
            <CodeBlock
              code={SAMPLE_CODES[activeFile]}
              title={activeFile}
              maxLines={20}
            />
          </View>
        ) : activeFile ? (
          <View style={styles.noPreview}>
            <MaterialIcons name="insert-drive-file" size={24} color={Colors.textMuted} />
            <Text style={styles.noPreviewText}>{activeFile} - پریویو دستیاب نہیں</Text>
          </View>
        ) : null}

        {/* Setup instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>استعمال کا طریقہ</Text>
          <View style={styles.stepsCard}>
            {[
              { num: '1', text: `npx create-expo-app ${template.id}`, mono: true },
              { num: '2', text: `cd ${template.id}`, mono: true },
              { num: '3', text: 'اوپر دی گئی فائلز کاپی کریں', mono: false },
              { num: '4', text: 'npm install', mono: true },
              { num: '5', text: 'npx expo start', mono: true },
            ].map(step => (
              <View key={step.num} style={styles.stepRow}>
                <View style={[styles.stepNum, { backgroundColor: template.color + '22' }]}>
                  <Text style={[styles.stepNumText, { color: template.color }]}>{step.num}</Text>
                </View>
                <Text style={[styles.stepText, step.mono && styles.stepMono]}>
                  {step.text}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <Button
          label="کنورٹر پر جائیں"
          onPress={() => router.push('/(tabs)/converter')}
          icon={<MaterialIcons name="transform" size={16} color="#000" />}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: Radii.sm,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: FontSizes.base,
    fontWeight: '700',
  },
  headerSub: {
    color: Colors.textSecondary,
    fontSize: FontSizes.xs,
  },
  content: {
    padding: Spacing.base,
    gap: Spacing.xl,
  },
  descCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.md,
    padding: Spacing.base,
    borderWidth: 1,
    gap: Spacing.md,
  },
  descText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.base,
    lineHeight: 24,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  section: {
    gap: Spacing.md,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: FontSizes.lg,
    fontWeight: '700',
  },
  fileTree: {
    backgroundColor: '#111',
    borderRadius: Radii.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 2,
  },
  treeRoot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: Spacing.xs,
  },
  treeName: {
    fontFamily: 'monospace',
    fontSize: FontSizes.sm,
    fontWeight: '700',
  },
  treeFile: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.xs,
    borderRadius: Radii.sm,
  },
  treeFileActive: {
    backgroundColor: Colors.surface,
  },
  treeIndent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingLeft: Spacing.md,
  },
  treeLine: {
    width: 1,
    height: 14,
    backgroundColor: Colors.border,
    marginRight: Spacing.xs,
  },
  treeFileName: {
    fontFamily: 'monospace',
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  treeRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  treeDesc: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
  },
  noPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radii.md,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  noPreviewText: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
    fontFamily: 'monospace',
  },
  stepsCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.md,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: {
    fontSize: FontSizes.sm,
    fontWeight: '800',
  },
  stepText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
  },
  stepMono: {
    fontFamily: 'monospace',
    color: Colors.textCode,
  },
  errorText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.lg,
    marginTop: Spacing.md,
  },
  backBtnText: {
    color: Colors.primary,
    fontSize: FontSizes.base,
    fontWeight: '600',
    marginTop: Spacing.md,
  },
});
