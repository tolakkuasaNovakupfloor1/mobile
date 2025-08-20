import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { savePasscode, removePasscode } from '../services/StorageService';

export default function PasscodeScreen() {
  const [passcode, setPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const router = useRouter();

  const handleSave = async () => {
    if (passcode.length < 4) {
      Alert.alert('Error', 'Passcode harus terdiri dari minimal 4 digit.');
      return;
    }
    if (passcode !== confirmPasscode) {
      Alert.alert('Error', 'Passcode tidak cocok. Silakan coba lagi.');
      return;
    }

    try {
      await savePasscode(passcode);
      Alert.alert('Sukses', 'Passcode berhasil disimpan.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
      setPasscode('');
      setConfirmPasscode('');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleRemove = async () => {
    try {
      await removePasscode();
      Alert.alert('Sukses', 'Passcode berhasil dihapus.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Atur Passcode' }} />
      <Text style={styles.title}>Atur Passcode Aplikasi</Text>
      <Text style={styles.label}>Passcode Baru (minimal 4 digit)</Text>
      <TextInput
        style={styles.input}
        placeholder="****"
        value={passcode}
        onChangeText={setPasscode}
        keyboardType="number-pad"
        secureTextEntry
        maxLength={6}
      />
      <Text style={styles.label}>Konfirmasi Passcode Baru</Text>
      <TextInput
        style={styles.input}
        placeholder="****"
        value={confirmPasscode}
        onChangeText={setConfirmPasscode}
        keyboardType="number-pad"
        secureTextEntry
        maxLength={6}
      />
      <View style={styles.buttonContainer}>
        <Button title="Simpan Passcode" onPress={handleSave} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Hapus Passcode" onPress={handleRemove} color="red" />
      </View>
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
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 18,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 20,
  },
});
