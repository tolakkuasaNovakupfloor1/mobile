import EncryptedStorage from 'react-native-encrypted-storage';

export interface SecuritySettings {
  secretCommand: string;
  contact1: string;
  contact2?: string;
}

const STORAGE_KEY = 'security_settings';

export async function saveSecuritySettings(settings: SecuritySettings): Promise<void> {
  try {
    await EncryptedStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save security settings', error);
    throw new Error('Gagal menyimpan pengaturan keamanan.');
  }
}

export async function loadSecuritySettings(): Promise<SecuritySettings | null> {
  try {
    const jsonString = await EncryptedStorage.getItem(STORAGE_KEY);
    if (jsonString) {
      return JSON.parse(jsonString) as SecuritySettings;
    }
    return null; // No settings saved yet
  } catch (error) {
    console.error('Failed to load security settings', error);
    throw new Error('Gagal memuat pengaturan keamanan.');
  }
}

// --- Auth Token Storage ---

export interface AuthTokens {
  accessToken: string;
  refreshToken: string | null;
  expiresIn: number | null;
}

const AUTH_TOKEN_KEY = 'google_auth_tokens';

export async function saveTokens(tokens: AuthTokens): Promise<void> {
  try {
    await EncryptedStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(tokens));
  } catch (error) {
    console.error('Failed to save auth tokens', error);
    throw new Error('Gagal menyimpan token otentikasi.');
  }
}

export async function loadTokens(): Promise<AuthTokens | null> {
  try {
    const jsonString = await EncryptedStorage.getItem(AUTH_TOKEN_KEY);
    if (jsonString) {
      return JSON.parse(jsonString) as AuthTokens;
    }
    return null;
  } catch (error) {
    console.error('Failed to load auth tokens', error);
    throw new Error('Gagal memuat token otentikasi.');
  }
}

export async function clearTokens(): Promise<void> {
  try {
    await EncryptedStorage.removeItem(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to clear auth tokens', error);
    throw new Error('Gagal menghapus token otentikasi.');
  }
}

// --- WhatsApp Favorite Contacts Storage ---

export interface FavoriteContact {
  id: string;
  name: string;
  phone: string;
}

const WHATSAPP_CONTACTS_KEY = 'whatsapp_favorite_contacts';

export async function saveWhatsappContacts(contacts: FavoriteContact[]): Promise<void> {
  try {
    await EncryptedStorage.setItem(WHATSAPP_CONTACTS_KEY, JSON.stringify(contacts));
  } catch (error) {
    console.error('Failed to save WhatsApp contacts', error);
    throw new Error('Gagal menyimpan kontak favorit.');
  }
}

export async function loadWhatsappContacts(): Promise<FavoriteContact[]> {
  try {
    const jsonString = await EncryptedStorage.getItem(WHATSAPP_CONTACTS_KEY);
    return jsonString ? JSON.parse(jsonString) : [];
  } catch (error) {
    console.error('Failed to load WhatsApp contacts', error);
    throw new Error('Gagal memuat kontak favorit.');
  }
}

// --- App Passcode Storage ---

const PASSCODE_KEY = 'app_passcode';

export async function savePasscode(passcode: string): Promise<void> {
  try {
    await EncryptedStorage.setItem(PASSCODE_KEY, passcode);
  } catch (error) {
    console.error('Failed to save passcode', error);
    throw new Error('Gagal menyimpan passcode.');
  }
}

export async function loadPasscode(): Promise<string | null> {
  try {
    return await EncryptedStorage.getItem(PASSCODE_KEY);
  } catch (error) {
    console.error('Failed to load passcode', error);
    throw new Error('Gagal memuat passcode.');
  }
}

export async function removePasscode(): Promise<void> {
  try {
    await EncryptedStorage.removeItem(PASSCODE_KEY);
  } catch (error) {
    console.error('Failed to remove passcode', error);
    throw new Error('Gagal menghapus passcode.');
  }
}
