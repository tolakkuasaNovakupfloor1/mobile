import { Alert, Linking } from 'react-native';
import { loadSecuritySettings } from './StorageService';
import { getCurrentLocation } from './LocationService';
import { encode as btoa } from 'base-64';

// This function checks for the emergency command and triggers the full action.
// Returns true if the command was handled, false otherwise.
export const handleEmergencyCommand = async (command: string): Promise<boolean> => {
  const settings = await loadSecuritySettings();

  // Check if settings and a secret command exist, and if the spoken command matches.
  if (!settings || !settings.secretCommand || !command.toLowerCase().includes(settings.secretCommand.toLowerCase())) {
    return false;
  }

  // If we reach here, the secret command was matched.
  Alert.alert(
    'Perintah Darurat Aktif!',
    'Mencoba mendapatkan lokasi dan menyiapkan pesan WhatsApp...'
  );

  const location = await getCurrentLocation();
  let message = "PESAN DARURAT: Saya butuh bantuan segera.";

  if (location) {
    const mapsUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
    message += `\n\nLokasi saya saat ini:\n${mapsUrl}`;
  } else {
    message += "\n\n(Tidak dapat mengambil data lokasi.)";
  }

  const contacts = [settings.contact1, settings.contact2].filter(c => !!c); // Get non-empty contacts

  if (contacts.length === 0) {
    Alert.alert('Error', 'Tidak ada kontak darurat yang tersimpan.');
    return true; // Command was handled, but no action could be taken
  }

  // Use a small delay to ensure the first alert is seen before Linking opens WhatsApp
  setTimeout(() => {
    for (const phone of contacts) {
      // The `btoa` function might be needed if the URL contains special characters.
      // For now, we'll use encodeURIComponent for standard URL encoding.
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `whatsapp://send?phone=${phone}&text=${encodedMessage}`;

      Linking.canOpenURL(whatsappUrl)
        .then(supported => {
          if (supported) {
            return Linking.openURL(whatsappUrl);
          } else {
            Alert.alert('Error', 'Tidak dapat membuka WhatsApp. Pastikan aplikasi telah terinstal.');
          }
        })
        .catch(err => console.error('An error occurred', err));
    }
  }, 500);


  return true; // The command was recognized and handled.
};
