// Powered by OnSpace.AI
import * as Clipboard from 'expo-clipboard';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await Clipboard.setStringAsync(text);
    return true;
  } catch {
    return false;
  }
}

export async function shareCode(code: string, filename: string = 'ConvertedComponent.tsx'): Promise<boolean> {
  try {
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      await copyToClipboard(code);
      return true;
    }
    const fileUri = FileSystem.cacheDirectory + filename;
    await FileSystem.writeAsStringAsync(fileUri, code, { encoding: FileSystem.EncodingType.UTF8 });
    await Sharing.shareAsync(fileUri, {
      mimeType: 'text/plain',
      dialogTitle: 'React Native کوڈ شیئر کریں',
      UTI: 'public.source-code',
    });
    return true;
  } catch (e) {
    console.warn('Share error:', e);
    try {
      await copyToClipboard(code);
      return true;
    } catch {
      return false;
    }
  }
}

export async function saveCodeToFile(code: string, filename: string = 'ConvertedComponent.tsx'): Promise<string | null> {
  try {
    const dir = FileSystem.documentDirectory + 'HTMLtoRN/';
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    const fileUri = dir + filename;
    await FileSystem.writeAsStringAsync(fileUri, code, { encoding: FileSystem.EncodingType.UTF8 });
    return fileUri;
  } catch (e) {
    console.warn('Save error:', e);
    return null;
  }
}
