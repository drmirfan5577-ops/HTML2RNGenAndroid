// Powered by OnSpace.AI

export type ErrorSeverity = 'error' | 'warning' | 'info';

export interface ValidationError {
  line: number;
  col: number;
  message: string;
  severity: ErrorSeverity;
  tag?: string;
  suggestion?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  infos: ValidationError[];
  stats: { tags: number; errors: number; warnings: number };
}

const VOID_ELEMENTS = new Set([
  'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'
]);

const DEPRECATED_TAGS = new Set([
  'center','font','marquee','blink','strike','tt','big','frame','frameset','noframes'
]);

const REQUIRED_ATTRS: Record<string, string[]> = {
  img: ['src', 'alt'],
  input: ['type'],
  a: ['href'],
};

const UNSUPPORTED_IN_RN = new Set([
  'video','audio','canvas','iframe','svg','script','style','link','meta','head','html','body'
]);

function getLineCol(html: string, index: number): { line: number; col: number } {
  const before = html.slice(0, index);
  const lines = before.split('\n');
  return { line: lines.length, col: lines[lines.length - 1].length + 1 };
}

export function validateHTML(html: string): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  const infos: ValidationError[] = [];
  const stack: Array<{ tag: string; index: number; pos: { line: number; col: number } }> = [];
  let tagCount = 0;

  if (!html.trim()) {
    return { isValid: false, errors: [{ line: 1, col: 1, message: 'خالی HTML', severity: 'error' }], warnings: [], infos: [], stats: { tags: 0, errors: 1, warnings: 0 } };
  }

  // Find all tags
  const tagRegex = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)((?:\s+[^>]*)?)(\/?)>/g;
  let match: RegExpExecArray | null;

  while ((match = tagRegex.exec(html)) !== null) {
    const [full, closing, tagName, attrs, selfClose] = match;
    const tag = tagName.toLowerCase();
    const pos = getLineCol(html, match.index);
    tagCount++;

    if (closing) {
      // Closing tag
      if (VOID_ELEMENTS.has(tag)) {
        errors.push({ ...pos, message: `</${tag}> — void element کو closing tag نہیں ہوتا`, severity: 'error', tag, suggestion: `<${tag}> کو self-closing لکھیں` });
        continue;
      }
      if (stack.length === 0) {
        errors.push({ ...pos, message: `</${tag}> — کوئی opening tag نہیں ملا`, severity: 'error', tag });
        continue;
      }
      const last = stack[stack.length - 1];
      if (last.tag !== tag) {
        errors.push({ ...pos, message: `</${tag}> — لیکن آخری opening tag <${last.tag}> تھا`, severity: 'error', tag, suggestion: `</${last.tag}> بند کریں پہلے` });
      } else {
        stack.pop();
      }
    } else if (!selfClose && !VOID_ELEMENTS.has(tag)) {
      // Opening tag
      stack.push({ tag, index: match.index, pos });
    }

    // Deprecated tags
    if (DEPRECATED_TAGS.has(tag)) {
      warnings.push({ ...pos, message: `<${tag}> پرانا HTML tag ہے`, severity: 'warning', tag, suggestion: 'CSS classes استعمال کریں' });
    }

    // Unsupported in RN
    if (UNSUPPORTED_IN_RN.has(tag)) {
      warnings.push({ ...pos, message: `<${tag}> React Native میں مکمل سپورٹ نہیں`, severity: 'warning', tag, suggestion: 'RN alternative استعمال ہوگا' });
    }

    // Required attributes
    if (REQUIRED_ATTRS[tag]) {
      for (const req of REQUIRED_ATTRS[tag]) {
        if (!new RegExp(`${req}\\s*=`).test(attrs)) {
          warnings.push({ ...pos, message: `<${tag}> میں "${req}" attribute نہیں ہے`, severity: 'warning', tag, suggestion: `${req}="..." شامل کریں` });
        }
      }
    }

    // Inline style check
    if (/style\s*=/.test(attrs)) {
      infos.push({ ...pos, message: `<${tag}> میں inline style ہے — RN stylesheet میں تبدیل ہوگی`, severity: 'info', tag });
    }
  }

  // Unclosed tags
  for (const unclosed of stack) {
    errors.push({ ...unclosed.pos, message: `<${unclosed.tag}> بند نہیں ہوا`, severity: 'error', tag: unclosed.tag, suggestion: `</${unclosed.tag}> شامل کریں` });
  }

  // Nested <a> check
  if ((html.match(/<a\s/gi) || []).length > (html.match(/<\/a>/gi) || []).length) {
    warnings.push({ line: 1, col: 1, message: 'کچھ <a> tags بند نہیں', severity: 'warning' });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    infos,
    stats: { tags: tagCount, errors: errors.length, warnings: warnings.length },
  };
}
