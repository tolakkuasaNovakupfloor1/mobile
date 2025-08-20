import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { signIn, signUp } from '../services/FirebaseAuthService';
import { createUserDocument } from '../services/UserService';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleAuth = async () => {
    try {
      if (isRegistering) {
        const userCredential = await signUp(email, password);
        await createUserDocument(userCredential.user);
        Alert.alert('Sukses', 'Akun berhasil didaftarkan. Silakan login.');
        setIsRegistering(false); // Switch to login view after successful registration
      } else {
        await signIn(email, password);
        // On successful sign-in, the onAuthStateChanged listener in the
        // root layout will handle navigating away from this screen.
      }
    } catch (error: any) {
      Alert.alert('Authentication Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: isRegistering ? 'Register' : 'Login' }} />
      <Text style={styles.title}>{isRegistering ? 'Buat Akun Baru' : 'Login ke Akun Anda'}</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={styles.buttonContainer}>
        <Button title={isRegistering ? 'Register' : 'Login'} onPress={handleAuth} />
      </View>

      <View style={styles.toggleContainer}>
        <Text>{isRegistering ? 'Sudah punya akun?' : 'Belum punya akun?'}</Text>
        <Button
          title={isRegistering ? 'Login di sini' : 'Register di sini'}
          onPress={() => setIsRegistering(!isRegistering)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  buttonContainer: {
    marginTop: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
});
