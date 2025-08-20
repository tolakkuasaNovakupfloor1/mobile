import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, Linking } from 'react-native';
import { Stack } from 'expo-router';
import Voice from '@react-native-community/voice';

export default function LauncherScreen() {
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Setup voice listeners
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechEnd = onSpeechEnd;

    // Cleanup listeners on component unmount
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechResults = (e: any) => {
    const text = e.value[0];
    setRecognizedText(text);
    handleCommand(text);
  };

  const onSpeechError = (e: any) => {
    setError(JSON.stringify(e.error));
  };

  const onSpeechEnd = () => {
    setIsListening(false);
  };

  const startListening = async () => {
    try {
      setRecognizedText('');
      setError('');
      await Voice.start('id-ID'); // Start listening in Indonesian
      setIsListening(true);
    } catch (e) {
      setError(JSON.stringify(e));
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (e) {
      setError(JSON.stringify(e));
    }
  };

  const handleCommand = (command: string) => {
    const lowerCaseCommand = command.toLowerCase();

    if (lowerCaseCommand.includes('buka whatsapp')) {
      Alert.alert('Perintah Dikenali', 'Membuka WhatsApp...', [
        { text: 'OK', onPress: () => Linking.openURL('whatsapp://app') }
      ]);
    } else if (lowerCaseCommand.includes('buka email')) {
        Alert.alert('Perintah Dikenali', 'Membuka aplikasi email...', [
        { text: 'OK', onPress: () => Linking.openURL('mailto:') }
      ]);
    }
    // More commands can be added here
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Peluncur Aplikasi' }} />
      <Text style={styles.title}>Peluncur Aplikasi</Text>
      <Text style={styles.instructions}>Tekan tombol dan ucapkan "Buka WhatsApp" atau "Buka Email".</Text>

      <View style={styles.buttonContainer}>
        <Button
          title={isListening ? 'Mendengarkan...' : 'Mulai Mendengarkan'}
          onPress={isListening ? stopListening : startListening}
        />
      </View>

      <Text style={styles.label}>Teks yang Dikenali:</Text>
      <Text style={styles.result}>{recognizedText}</Text>

      {error ? (
        <>
          <Text style={styles.label}>Error:</Text>
          <Text style={styles.error}>{error}</Text>
        </>
      ) : null}
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
    marginBottom: 8,
  },
  instructions: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666'
  },
  buttonContainer: {
    marginVertical: 20,
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
  },
  error: {
    fontSize: 14,
    color: 'red',
    marginTop: 8,
  },
});
