import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

export default function VoiceScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Pengaturan Suara' }} />
      <Text style={styles.title}>Pengaturan Suara</Text>
      <Text>Di sini Anda akan mendaftarkan, mengedit, dan menghapus profil suara dan kata sandi.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
