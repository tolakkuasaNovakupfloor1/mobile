import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';

interface LockScreenProps {
  storedPasscode: string;
  onUnlock: () => void;
}

export default function LockScreen({ storedPasscode, onUnlock }: LockScreenProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (text: string) => {
    setError('');
    setInput(text);
    if (text.length === storedPasscode.length) {
      if (text === storedPasscode) {
        onUnlock();
      } else {
        setError('Passcode salah. Coba lagi.');
        setInput('');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Masukkan Passcode</Text>
      <TextInput
        style={styles.input}
        value={input}
        onChangeText={handleInputChange}
        keyboardType="number-pad"
        secureTextEntry
        maxLength={6}
        autoFocus
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 10,
    width: '60%',
    padding: 15,
    fontSize: 24,
    textAlign: 'center',
    letterSpacing: 10, // Creates space between digits
  },
  errorText: {
    color: 'red',
    marginTop: 15,
    fontSize: 16,
  },
});
