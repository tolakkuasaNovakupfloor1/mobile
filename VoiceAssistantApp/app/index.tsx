import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import Voice from '@react-native-community/voice';
import { handleEmergencyCommand } from '../services/EmergencyService';
import { handleSimpleCommands } from '../services/CommandService';
import { handleEmailCommands } from '../services/EmailCommandService';
import { handleWhatsAppCommand } from '../services/WhatsAppCommandService';

export default function HomeScreen() {
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechEnd = () => setIsListening(false);
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechResults = async (e: any) => {
    const text = e.value[0];
    setRecognizedText(text);

    // Priority 1: Emergency
    const emergencyHandled = await handleEmergencyCommand(text);
    if (emergencyHandled) return;

    // Priority 2: Email
    const emailHandled = await handleEmailCommands(text);
    if (emailHandled) return;

    // Priority 3: WhatsApp
    const whatsappHandled = await handleWhatsAppCommand(text);
    if (whatsappHandled) return;

    // Priority 4: Simple Commands (like opening apps)
    const simpleHandled = handleSimpleCommands(text);
    if (simpleHandled) return;

    // Priority 5: (Future) If no match, send to Gemini API for complex interpretation
    Alert.alert('Perintah Tidak Dikenali', `Tidak ada aksi yang terdaftar untuk: "${text}"`);
  };

  const onSpeechError = (e: any) => setError(JSON.stringify(e.error));

  const toggleListening = async () => {
    try {
      if (isListening) {
        await Voice.stop();
      } else {
        setRecognizedText('');
        setError('');
        await Voice.start('id-ID');
        setIsListening(true);
      }
    } catch (e) {
      setError(JSON.stringify(e));
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Asisten Suara AI</Text>
      <View style={styles.controlPanel}>
        <Text style={styles.instructions}>Tekan untuk mengaktifkan asisten</Text>
        <Button
          title={isListening ? 'Berhenti Mendengarkan...' : 'Aktifkan Asisten'}
          onPress={toggleListening}
        />
        <Text style={styles.label}>Perintah Anda:</Text>
        <Text style={styles.result}>{recognizedText}</Text>
        {error && <Text style={styles.error}>{error}</Text>}
      </View>

      <View style={styles.menu}>
        <Text style={styles.menuTitle}>Menu Pengaturan</Text>
        <Link href="/security" style={styles.link}>🔐 Pengaturan Keamanan</Link>
        <Link href="/voice" style={styles.link}>🎤 Pengaturan Suara</Link>
        <Link href="/email" style={styles.link}>📧 Kelola Email</Link>
        <Link href="/whatsapp" style={styles.link}>💬 Kelola WhatsApp</Link>
        <Link href="/media" style={styles.link}>🎵 Kontrol Media</Link>
        <Link href="/launcher" style={styles.link}>📱 Peluncur Aplikasi</Link>
        <Link href="/settings" style={styles.link}>⚙️ Pengaturan Umum</Link>
        <Link href="/devices" style={styles.link}>👨‍👩‍👧 Perangkat Keluarga</Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  controlPanel: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  instructions: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
  },
  result: {
    fontSize: 18,
    color: '#333',
    marginTop: 8,
    fontStyle: 'italic',
  },
  error: {
    fontSize: 14,
    color: 'red',
    marginTop: 8,
  },
  menu: {
    padding: 24,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  link: {
    fontSize: 18,
    paddingVertical: 12,
  },
});
