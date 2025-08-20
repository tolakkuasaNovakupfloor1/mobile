import { Alert, Linking } from 'react-native';
import Tts from 'react-native-tts';
import { loadWhatsappContacts } from './StorageService';

// This service handles WhatsApp-related voice commands.
// Returns true if a command was recognized and handled, false otherwise.
export const handleWhatsAppCommand = async (command: string): Promise<boolean> => {
  const lowerCaseCommand = command.toLowerCase();
  const triggerPhrase = 'kirim whatsapp ke ';

  if (lowerCaseCommand.startsWith(triggerPhrase)) {
    const contacts = await loadWhatsappContacts();
    if (contacts.length === 0) {
      Tts.speak('Anda belum memiliki kontak favorit. Silakan tambahkan terlebih dahulu.');
      return true;
    }

    // Extract "[contact name] [message]"
    const commandPayload = command.substring(triggerPhrase.length);

    let targetContact = null;
    let message = '';

    // Find the contact whose name is mentioned in the command
    for (const contact of contacts) {
      if (commandPayload.toLowerCase().startsWith(contact.name.toLowerCase())) {
        targetContact = contact;
        // The rest of the string is the message
        message = commandPayload.substring(contact.name.length).trim();
        break;
      }
    }

    if (targetContact && message) {
      Tts.speak(`Baik, menyiapkan pesan untuk ${targetContact.name}.`);

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `whatsapp://send?phone=${targetContact.phone}&text=${encodedMessage}`;

      try {
        const supported = await Linking.canOpenURL(whatsappUrl);
        if (supported) {
          await Linking.openURL(whatsappUrl);
        } else {
          Alert.alert('Error', 'Tidak dapat membuka WhatsApp. Pastikan aplikasi telah terinstal.');
        }
      } catch (error) {
        console.error('Error opening WhatsApp', error);
        Alert.alert('Error', 'Terjadi kesalahan saat mencoba membuka WhatsApp.');
      }

    } else {
      Tts.speak('Maaf, saya tidak bisa menemukan nama kontak favorit itu dalam perintah Anda atau pesannya kosong.');
    }

    return true; // Command was handled (or attempted)
  }

  return false; // No WhatsApp command was matched
};
