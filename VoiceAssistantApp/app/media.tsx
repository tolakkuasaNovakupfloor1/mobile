import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

export default function MediaScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Kontrol Media' }} />
      <Text style={styles.title}>Kontrol Media</Text>
      <Text>Di sini Anda akan mengelola pemutaran musik dan playlist.</Text>
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
