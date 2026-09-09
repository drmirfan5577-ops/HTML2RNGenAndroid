// Powered by OnSpace.AI

export interface ConversionResult {
  code: string;
  imports: string[];
  warnings: string[];
  stats: {
    elementsConverted: number;
    importsNeeded: string[];
  };
}

// ─── Tag map ──────────────────────────────────────────────────────────────────
const TAG_MAP: Record<string, { rn: string; import: string }> = {
  div: { rn: 'View', import: 'View' },
  section: { rn: 'View', import: 'View' },
  article: { rn: 'View', import: 'View' },
  main: { rn: 'View', import: 'View' },
  header: { rn: 'View', import: 'View' },
  footer: { rn: 'View', import: 'View' },
  nav: { rn: 'View', import: 'View' },
  aside: { rn: 'View', import: 'View' },
  figure: { rn: 'View', import: 'View' },
  figcaption: { rn: 'Text', import: 'Text' },
  p: { rn: 'Text', import: 'Text' },
  span: { rn: 'Text', import: 'Text' },
  h1: { rn: 'Text', import: 'Text' },
  h2: { rn: 'Text', import: 'Text' },
  h3: { rn: 'Text', import: 'Text' },
  h4: { rn: 'Text', import: 'Text' },
  h5: { rn: 'Text', import: 'Text' },
  h6: { rn: 'Text', import: 'Text' },
  label: { rn: 'Text', import: 'Text' },
  strong: { rn: 'Text', import: 'Text' },
  b: { rn: 'Text', import: 'Text' },
  em: { rn: 'Text', import: 'Text' },
  i: { rn: 'Text', import: 'Text' },
  small: { rn: 'Text', import: 'Text' },
  abbr: { rn: 'Text', import: 'Text' },
  cite: { rn: 'Text', import: 'Text' },
  code: { rn: 'Text', import: 'Text' },
  pre: { rn: 'Text', import: 'Text' },
  blockquote: { rn: 'View', import: 'View' },
  img: { rn: 'Image', import: 'Image' },
  button: { rn: 'TouchableOpacity', import: 'TouchableOpacity' },
  a: { rn: 'TouchableOpacity', import: 'TouchableOpacity' },
  input: { rn: 'TextInput', import: 'TextInput' },
  textarea: { rn: 'TextInput', import: 'TextInput' },
  ul: { rn: 'View', import: 'View' },
  ol: { rn: 'View', import: 'View' },
  li: { rn: 'View', import: 'View' },
  form: { rn: 'View', import: 'View' },
  table: { rn: 'View', import: 'View' },
  thead: { rn: 'View', import: 'View' },
  tbody: { rn: 'View', import: 'View' },
  tr: { rn: 'View', import: 'View' },
  td: { rn: 'View', import: 'View' },
  th: { rn: 'Text', import: 'Text' },
  select: { rn: 'View', import: 'View' },
  option: { rn: 'Text', import: 'Text' },
  video: { rn: 'View', import: 'View' },
  audio: { rn: 'View', import: 'View' },
  canvas: { rn: 'View', import: 'View' },
  iframe: { rn: 'View', import: 'View' },
  hr: { rn: 'View', import: 'View' },
  details: { rn: 'View', import: 'View' },
  summary: { rn: 'Text', import: 'Text' },
  time: { rn: 'Text', import: 'Text' },
  mark: { rn: 'Text', import: 'Text' },
};

const HEADING_SIZES: Record<string, { size: number; weight: string }> = {
  h1: { size: 32, weight: "'800'" },
  h2: { size: 26, weight: "'700'" },
  h3: { size: 22, weight: "'700'" },
  h4: { size: 20, weight: "'600'" },
  h5: { size: 18, weight: "'600'" },
  h6: { size: 16, weight: "'600'" },
};

// ─── CSS → RN style converter ─────────────────────────────────────────────────
function cssToRNStyle(css: string): string {
  if (!css.trim()) return '';
  const props: string[] = [];
  const declarations = css.split(';').map(s => s.trim()).filter(Boolean);

  for (const decl of declarations) {
    const [prop, val] = decl.split(':').map(s => s.trim());
    if (!prop || !val) continue;

    switch (prop) {
      case 'color': props.push(`color: '${val}'`); break;
      case 'background-color':
      case 'background': props.push(`backgroundColor: '${val.split(' ')[0]}'`); break;
      case 'font-size': {
        const px = parseInt(val);
        if (!isNaN(px)) props.push(`fontSize: ${px}`);
        break;
      }
      case 'font-weight': props.push(`fontWeight: '${val}'`); break;
      case 'font-style': props.push(`fontStyle: '${val}'`); break;
      case 'text-align': props.push(`textAlign: '${val}'`); break;
      case 'text-decoration': {
        if (val.includes('underline')) props.push(`textDecorationLine: 'underline'`);
        if (val.includes('line-through')) props.push(`textDecorationLine: 'line-through'`);
        break;
      }
      case 'margin': {
        const m = parseInt(val);
        if (!isNaN(m)) props.push(`margin: ${m}`);
        break;
      }
      case 'margin-top': { const m = parseInt(val); if (!isNaN(m)) props.push(`marginTop: ${m}`); break; }
      case 'margin-bottom': { const m = parseInt(val); if (!isNaN(m)) props.push(`marginBottom: ${m}`); break; }
      case 'margin-left': { const m = parseInt(val); if (!isNaN(m)) props.push(`marginLeft: ${m}`); break; }
      case 'margin-right': { const m = parseInt(val); if (!isNaN(m)) props.push(`marginRight: ${m}`); break; }
      case 'padding': {
        const p = parseInt(val);
        if (!isNaN(p)) props.push(`padding: ${p}`);
        break;
      }
      case 'padding-top': { const p = parseInt(val); if (!isNaN(p)) props.push(`paddingTop: ${p}`); break; }
      case 'padding-bottom': { const p = parseInt(val); if (!isNaN(p)) props.push(`paddingBottom: ${p}`); break; }
      case 'padding-left': { const p = parseInt(val); if (!isNaN(p)) props.push(`paddingLeft: ${p}`); break; }
      case 'padding-right': { const p = parseInt(val); if (!isNaN(p)) props.push(`paddingRight: ${p}`); break; }
      case 'width': {
        if (val.includes('%')) props.push(`width: '${val}'`);
        else { const w = parseInt(val); if (!isNaN(w)) props.push(`width: ${w}`); }
        break;
      }
      case 'height': {
        if (val.includes('%')) props.push(`height: '${val}'`);
        else { const h = parseInt(val); if (!isNaN(h)) props.push(`height: ${h}`); }
        break;
      }
      case 'border-radius': { const r = parseInt(val); if (!isNaN(r)) props.push(`borderRadius: ${r}`); break; }
      case 'display': {
        if (val === 'flex') props.push(`flex: 1`);
        if (val === 'none') props.push(`display: 'none'`);
        break;
      }
      case 'flex-direction': props.push(`flexDirection: '${val}'`); break;
      case 'align-items': props.push(`alignItems: '${val}'`); break;
      case 'justify-content': props.push(`justifyContent: '${val}'`); break;
      case 'opacity': props.push(`opacity: ${parseFloat(val)}`); break;
      case 'border': {
        const parts = val.split(' ');
        const w = parseInt(parts[0]);
        if (!isNaN(w)) props.push(`borderWidth: ${w}`);
        const color = parts.find(p => p.startsWith('#') || p.startsWith('rgb'));
        if (color) props.push(`borderColor: '${color}'`);
        break;
      }
      case 'border-color': props.push(`borderColor: '${val}'`); break;
      case 'border-width': { const bw = parseInt(val); if (!isNaN(bw)) props.push(`borderWidth: ${bw}`); break; }
    }
  }

  return props.length ? `{${props.join(', ')}}` : '';
}

// ─── Get RN attributes from HTML attrs string ─────────────────────────────────
function getRNAttributes(tagName: string, attrString: string): string {
  const attrs: string[] = [];

  const styleMatch = attrString.match(/style=["']([^"']*)["']/);
  if (styleMatch) {
    const rnStyle = cssToRNStyle(styleMatch[1]);
    if (rnStyle) attrs.push(`style={${rnStyle}}`);
  }

  if (tagName === 'img') {
    const srcMatch = attrString.match(/src=["']([^"']*)["']/);
    const widthMatch = attrString.match(/width=["']?(\d+)["']?/);
    const heightMatch = attrString.match(/height=["']?(\d+)["']?/);
    const altMatch = attrString.match(/alt=["']([^"']*)["']/);
    if (srcMatch) attrs.push(`source={{uri: '${srcMatch[1]}'}}`);
    const w = widthMatch ? parseInt(widthMatch[1]) : 100;
    const h = heightMatch ? parseInt(heightMatch[1]) : 100;
    if (!styleMatch) attrs.push(`style={{width: ${w}, height: ${h}}}`);
    if (altMatch) attrs.push(`accessible={true} accessibilityLabel="${altMatch[1]}"`);
    attrs.push(`resizeMode="cover"`);
  }

  if (tagName === 'input' || tagName === 'textarea') {
    const placeholderMatch = attrString.match(/placeholder=["']([^"']*)["']/);
    const typeMatch = attrString.match(/type=["']([^"']*)["']/);
    const valueMatch = attrString.match(/value=["']([^"']*)["']/);
    if (placeholderMatch) attrs.push(`placeholder="${placeholderMatch[1]}"`);
    if (tagName === 'textarea') attrs.push(`multiline={true} numberOfLines={4}`);
    if (typeMatch) {
      if (typeMatch[1] === 'password') attrs.push(`secureTextEntry={true}`);
      else if (typeMatch[1] === 'email') attrs.push(`keyboardType="email-address" autoCapitalize="none"`);
      else if (typeMatch[1] === 'number' || typeMatch[1] === 'tel') attrs.push(`keyboardType="numeric"`);
      else if (typeMatch[1] === 'url') attrs.push(`keyboardType="url"`);
    }
    if (!styleMatch) attrs.push(`style={{borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 6}}`);
  }

  if (tagName === 'a') {
    const hrefMatch = attrString.match(/href=["']([^"']*)["']/);
    if (hrefMatch && hrefMatch[1] !== '#') {
      attrs.push(`onPress={() => {/* navigate: ${hrefMatch[1]} */}}`);
    }
  }

  if (tagName === 'button') {
    if (!styleMatch) attrs.push(`style={{backgroundColor: '#007AFF', padding: 12, borderRadius: 8, alignItems: 'center'}}`);
    attrs.push(`activeOpacity={0.8}`);
  }

  if (tagName === 'hr') {
    if (!styleMatch) attrs.push(`style={{height: 1, backgroundColor: '#e0e0e0', marginVertical: 8}}`);
  }

  return attrs.length ? ' ' + attrs.join(' ') : '';
}

function getDefaultStyle(tagName: string): string {
  if (tagName in HEADING_SIZES) {
    const { size, weight } = HEADING_SIZES[tagName];
    return ` style={{fontSize: ${size}, fontWeight: ${weight}, marginBottom: 8}}`;
  }
  if (tagName === 'p') return ` style={{fontSize: 16, marginBottom: 8, lineHeight: 24}}`;
  if (tagName === 'strong' || tagName === 'b') return ` style={{fontWeight: 'bold'}}`;
  if (tagName === 'em' || tagName === 'i') return ` style={{fontStyle: 'italic'}}`;
  if (tagName === 'small') return ` style={{fontSize: 12}}`;
  if (tagName === 'code' || tagName === 'pre') return ` style={{fontFamily: 'monospace', backgroundColor: '#f5f5f5', padding: 4}}`;
  if (tagName === 'blockquote') return ` style={{borderLeftWidth: 3, borderLeftColor: '#ccc', paddingLeft: 12, marginVertical: 8}}`;
  if (tagName === 'li') return ` style={{flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4}}`;
  if (tagName === 'table') return ` style={{borderWidth: 1, borderColor: '#e0e0e0'}}`;
  if (tagName === 'tr') return ` style={{flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e0e0e0'}}`;
  if (tagName === 'td' || tagName === 'th') return ` style={{flex: 1, padding: 8}}`;
  return '';
}

// ─── Main converter ───────────────────────────────────────────────────────────
function parseHTML(html: string): ConversionResult {
  const usedImports = new Set<string>(['View', 'Text', 'StyleSheet']);
  const warnings: string[] = [];
  let elementsConverted = 0;

  let cleaned = html
    .replace(/<!DOCTYPE[^>]*>/gi, '')
    .replace(/<html[^>]*>/gi, '').replace(/<\/html>/gi, '')
    .replace(/<head>[\s\S]*?<\/head>/gi, '')
    .replace(/<body[^>]*>/gi, '').replace(/<\/body>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .trim();

  // Self-closing: img
  cleaned = cleaned.replace(/<img([^>]*?)\/?>|<img([^>]*)>/gi, (_, a1, a2) => {
    const attrs = a1 || a2 || '';
    const extraAttrs = getRNAttributes('img', attrs);
    usedImports.add('Image');
    elementsConverted++;
    return `<Image${extraAttrs} />`;
  });

  // Self-closing: input
  cleaned = cleaned.replace(/<input([^>]*?)\/?>|<input([^>]*)>/gi, (_, a1, a2) => {
    const attrs = a1 || a2 || '';
    const extraAttrs = getRNAttributes('input', attrs);
    usedImports.add('TextInput');
    elementsConverted++;
    return `<TextInput${extraAttrs} />`;
  });

  // Self-closing: hr
  cleaned = cleaned.replace(/<hr([^>]*?)\/?>|<hr([^>]*)>/gi, (_, a1, a2) => {
    const attrs = a1 || a2 || '';
    const extraAttrs = getRNAttributes('hr', attrs);
    usedImports.add('View');
    elementsConverted++;
    return `<View${extraAttrs} />`;
  });

  // <br>
  cleaned = cleaned.replace(/<br\s*\/?>/gi, '\n');

  // Opening tags
  cleaned = cleaned.replace(/<([a-zA-Z][a-zA-Z0-9]*)([^>]*)>/g, (match, tag, attrs) => {
    const lower = tag.toLowerCase();
    const mapping = TAG_MAP[lower];
    if (!mapping) {
      warnings.push(`<${tag}> ٹیگ میپ نہیں ہے، View استعمال کیا`);
      usedImports.add('View');
      return `<View>`;
    }
    usedImports.add(mapping.import);
    elementsConverted++;
    const hasStyleAttr = /style=/.test(attrs);
    const extraAttrs = getRNAttributes(lower, attrs);
    const defaultStyle = hasStyleAttr ? '' : getDefaultStyle(lower);
    return `<${mapping.rn}${extraAttrs}${defaultStyle}>`;
  });

  // Closing tags
  cleaned = cleaned.replace(/<\/([a-zA-Z][a-zA-Z0-9]*)>/g, (match, tag) => {
    const lower = tag.toLowerCase();
    const mapping = TAG_MAP[lower];
    if (!mapping) return `</View>`;
    return `</${mapping.rn}>`;
  });

  // Build full component
  const importsList = Array.from(usedImports).sort();
  const lines = cleaned.split('\n').map(l => '      ' + l).join('\n');

  const fullCode =
`import React from 'react';
import { ${importsList.join(', ')} } from 'react-native';

export default function ConvertedComponent() {
  return (
    <View style={styles.container}>
${lines}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
});`;

  return {
    code: fullCode,
    imports: importsList,
    warnings,
    stats: { elementsConverted, importsNeeded: importsList },
  };
}

export function convertHtmlToRN(html: string): ConversionResult {
  if (!html.trim()) {
    return {
      code: '',
      imports: [],
      warnings: ['کوئی HTML فراہم نہیں کیا گیا'],
      stats: { elementsConverted: 0, importsNeeded: [] },
    };
  }
  return parseHTML(html);
}

export const SAMPLE_HTML = `<div>
  <h1>میری ایپ</h1>
  <p>یہ ایک نمونہ ہے۔ React Native میں خوش آمدید!</p>
  <div style="flex-direction: row; margin-top: 16;">
    <button>
      <strong>لاگ ان</strong>
    </button>
  </div>
  <img src="https://picsum.photos/300/200" width="300" height="200" alt="نمونہ تصویر" />
  <form>
    <input type="email" placeholder="ای میل درج کریں" />
    <input type="password" placeholder="پاسورڈ درج کریں" />
    <textarea placeholder="پیغام لکھیں..."></textarea>
  </form>
  <ul>
    <li><span>پہلا آئٹم</span></li>
    <li><span>دوسرا آئٹم</span></li>
    <li><em>تیسرا آئٹم</em></li>
  </ul>
  <hr />
  <small>تمام حقوق محفوظ ہیں</small>
</div>`;
