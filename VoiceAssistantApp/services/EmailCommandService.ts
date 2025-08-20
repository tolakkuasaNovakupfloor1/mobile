import Tts from 'react-native-tts';
import { getLatestEmails } from './GmailService';

// This service handles email-related voice commands.
// Returns true if a command was recognized and handled, false otherwise.
export const handleEmailCommands = async (command: string): Promise<boolean> => {
  const lowerCaseCommand = command.toLowerCase();

  if (lowerCaseCommand.includes('baca email terakhir') || lowerCaseCommand.includes('cek email terbaru')) {
    try {
      Tts.speak('Baik, sedang memeriksa email terakhir...');
      const latestEmails = await getLatestEmails(1);

      if (latestEmails.length > 0) {
        const email = latestEmails[0];
        // Sanitize 'from' field to remove email address for better speech
        const from = email.from.split('<')[0].trim();
        const response = `Email terakhir dari ${from}, dengan subjek: ${email.subject}.`;
        Tts.speak(response);
      } else {
        Tts.speak('Tidak ada email baru di kotak masuk Anda.');
      }
    } catch (error: any) {
      console.error(error);
      Tts.speak(error.message || 'Maaf, gagal mengambil data email.');
    }
    return true; // Command was handled (or attempted)
  }

  // Add other email commands here, e.g., "how many new emails"
  // if (lowerCaseCommand.includes('berapa email baru')) { ... }

  return false; // No email command was matched
};
