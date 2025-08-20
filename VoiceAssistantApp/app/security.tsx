import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { saveSecuritySettings, loadSecuritySettings, SecuritySettings } from '../services/StorageService';

export default function SecurityScreen() {
  const [secretCommand, setSecretCommand] = useState('');
  const [contact1, setContact1] = useState('');
  const [contact2, setContact2] = useState('');

  // Load settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      const settings = await loadSecuritySettings();
      if (settings) {
        setSecretCommand(settings.secretCommand);
        setContact1(settings.contact1);
        setContact2(settings.contact2 || '');
      }
    };
    loadSettings();
  }, []);

  const handleSaveSettings = async () => {
    if (!secretCommand || !contact1) {
      Alert.alert('Error', 'Perintah rahasia dan setidaknya satu kontak darurat harus diisi.');
      return;
    }

    const settings: SecuritySettings = { secretCommand, contact1, contact2 };

    try {
      await saveSecuritySettings(settings);
      Alert.alert('Sukses', 'Pengaturan keamanan berhasil disimpan.');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Pengaturan Keamanan' }} />
      <Text style={styles.title}>Pengaturan Keamanan</Text>
      <Text style={styles.label}>Perintah Rahasia</Text>
      <TextInput
        style={styles.input}
        placeholder="Contoh: 'kode merah darurat'"
        value={secretCommand}
        onChangeText={setSecretCommand}
      />

      <Text style={styles.label}>Kontak Darurat 1 (Wajib)</Text>
      <TextInput
        style={styles.input}
        placeholder="Nomor WhatsApp (contoh: 6281234567890)"
        value={contact1}
        onChangeText={setContact1}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Kontak Darurat 2 (Opsional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Nomor WhatsApp kedua"
        value={contact2}
        onChangeText={setContact2}
        keyboardType="phone-pad"
      />

      <View style={styles.buttonContainer}>
        <Button title="Simpan Pengaturan" onPress={handleSaveSettings} />
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
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 30,
  },
});
