import { google } from 'googleapis';
import { loadTokens } from './StorageService';

// This is a simplified representation of an email
export interface Email {
  id: string;
  from: string;
  subject: string;
  snippet: string;
}

// Caches the authenticated client
let oauth2Client: any = null;

async function getAuthenticatedClient() {
  if (oauth2Client) {
    // A simple check if the token is about to expire, might need refreshing logic
    // For now, we assume the token is valid if the client exists.
    // In a production app, you'd handle token refreshing.
    return oauth2Client;
  }

  const tokens = await loadTokens();
  if (!tokens) {
    throw new Error('User is not authenticated.');
  }

  const client = new google.auth.OAuth2();
  client.setCredentials({ access_token: tokens.accessToken });

  oauth2Client = client;
  return oauth2Client;
}

export async function getLatestEmails(count: number = 5): Promise<Email[]> {
  try {
    const client = await getAuthenticatedClient();
    const gmail = google.gmail({ version: 'v1', auth: client });

    // 1. Get the list of message IDs
    const listResponse = await gmail.users.messages.list({
      userId: 'me',
      maxResults: count,
      q: 'in:inbox', // Only search in the inbox
    });

    const messages = listResponse.data.messages;
    if (!messages || messages.length === 0) {
      return [];
    }

    // 2. For each message ID, get the full message details
    const emailPromises = messages.map(async (message) => {
      if (!message.id) return null;

      const msgResponse = await gmail.users.messages.get({
        userId: 'me',
        id: message.id,
        format: 'metadata', // We only need headers and snippet, not the full body
        metadataHeaders: ['From', 'Subject'],
      });

      const headers = msgResponse.data.payload?.headers;
      const fromHeader = headers?.find(h => h.name === 'From');
      const subjectHeader = headers?.find(h => h.name === 'Subject');

      return {
        id: msgResponse.data.id || '',
        from: fromHeader?.value || 'Tidak diketahui',
        subject: subjectHeader?.value || '(Tanpa subjek)',
        snippet: msgResponse.data.snippet || '',
      };
    });

    const emails = (await Promise.all(emailPromises)).filter(e => e !== null) as Email[];
    return emails;

  } catch (error) {
    console.error('Failed to fetch emails:', error);
    // Reset client if there's an auth error
    oauth2Client = null;
    throw new Error('Gagal mengambil data email. Mungkin perlu login ulang.');
  }
}
