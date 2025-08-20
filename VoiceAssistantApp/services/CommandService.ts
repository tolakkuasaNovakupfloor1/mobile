import { Alert, Linking } from 'react-native';

// This service handles simple, hardcoded commands.
// It returns true if a command was recognized and handled, false otherwise.
export const handleSimpleCommands = (command: string): boolean => {
  const lowerCaseCommand = command.toLowerCase();

  if (lowerCaseCommand.includes('buka whatsapp')) {
    Alert.alert('Perintah Dikenali', 'Membuka WhatsApp...', [
      { text: 'OK', onPress: () => Linking.openURL('whatsapp://app') }
    ]);
    return true;
  }

  if (lowerCaseCommand.includes('buka email')) {
    Alert.alert('Perintah Dikenali', 'Membuka aplikasi email...', [
      { text: 'OK', onPress: () => Linking.openURL('mailto:') }
    ]);
    return true;
  }

  // Add more simple commands here if needed
  // e.g., if (lowerCaseCommand.includes('buka telepon')) { ... }

  return false; // No simple command was matched
};
