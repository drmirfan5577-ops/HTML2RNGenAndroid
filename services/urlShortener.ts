// Powered by OnSpace.AI

export interface UrlResult {
  original: string;
  short: string;
  isValid: boolean;
  error?: string;
  domain?: string;
  protocol?: string;
  path?: string;
}

export interface UrlValidation {
  isValid: boolean;
  isSecure: boolean;
  domain: string;
  protocol: string;
  path: string;
  queryParams: Record<string, string>;
  issues: string[];
  suggestions: string[];
}

// ─── URL Validator ─────────────────────────────────────────────────────────────
export function validateUrl(url: string): UrlValidation {
  const issues: string[] = [];
  const suggestions: string[] = [];

  if (!url.trim()) {
    return { isValid: false, isSecure: false, domain: '', protocol: '', path: '', queryParams: {}, issues: ['خالی URL'], suggestions: ['https:// سے شروع کریں'] };
  }

  let parsed: URL | null = null;
  try {
    parsed = new URL(url);
  } catch {
    // Try with protocol
    try {
      parsed = new URL('https://' + url);
      suggestions.push('https:// شامل کریں');
    } catch {
      return { isValid: false, isSecure: false, domain: '', protocol: '', path: '', queryParams: {}, issues: ['URL فارمیٹ غلط ہے'], suggestions: ['مثال: https://example.com'] };
    }
  }

  const isSecure = parsed.protocol === 'https:';
  if (!isSecure) suggestions.push('https:// استعمال کریں بجائے http://');

  const queryParams: Record<string, string> = {};
  parsed.searchParams.forEach((val, key) => { queryParams[key] = val; });

  if (parsed.hostname.includes('localhost')) issues.push('localhost — صرف local کام کرتا ہے');
  if (parsed.hostname.length > 253) issues.push('domain name بہت لمبا ہے');
  if (!parsed.hostname.includes('.') && parsed.hostname !== 'localhost') issues.push('domain نامکمل لگتا ہے');

  return {
    isValid: issues.length === 0,
    isSecure,
    domain: parsed.hostname,
    protocol: parsed.protocol,
    path: parsed.pathname,
    queryParams,
    issues,
    suggestions,
  };
}

// ─── Short URL Generator (client-side simulation + TinyURL API) ───────────────
const shortCache = new Map<string, string>();

function base62Encode(num: number): string {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  while (num > 0) {
    result = chars[num % 62] + result;
    num = Math.floor(num / 62);
  }
  return result || '0';
}

function hashUrl(url: string): number {
  let hash = 5381;
  for (let i = 0; i < url.length; i++) {
    hash = ((hash << 5) + hash) ^ url.charCodeAt(i);
    hash = hash >>> 0;
  }
  return hash;
}

export async function generateShortUrl(url: string): Promise<UrlResult> {
  const validation = validateUrl(url);
  if (!validation.isValid && validation.issues.length > 0 && !validation.suggestions.length) {
    return { original: url, short: '', isValid: false, error: validation.issues[0] };
  }

  // Check cache
  if (shortCache.has(url)) {
    return { original: url, short: shortCache.get(url)!, isValid: true, domain: validation.domain };
  }

  // Try TinyURL API
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`, { signal: controller.signal });
    clearTimeout(timeout);
    if (response.ok) {
      const short = await response.text();
      if (short.startsWith('https://tinyurl.com/')) {
        shortCache.set(url, short);
        return { original: url, short, isValid: true, domain: validation.domain };
      }
    }
  } catch { /* fallback */ }

  // Fallback: local short code
  const code = base62Encode(hashUrl(url)).slice(0, 7);
  const short = `https://rn.app/${code}`;
  shortCache.set(url, short);
  return { original: url, short, isValid: true, domain: validation.domain, error: 'آف لائن — مقامی کوڈ بنایا گیا' };
}

export function extractUrlsFromText(text: string): string[] {
  const urlRegex = /https?:\/\/[^\s"'<>()[\]{}|\\^`]+/gi;
  return Array.from(new Set(text.match(urlRegex) || []));
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
