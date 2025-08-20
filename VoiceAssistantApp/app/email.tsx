import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Image, FlatList, ActivityIndicator, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { getLatestEmails, Email } from '../services/GmailService';

export default function EmailScreen() {
  const { isLoggedIn, userInfo, login, logout } = useGoogleAuth();
  const [emails, setEmails] = useState<Email[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEmails = async () => {
    setIsLoading(true);
    try {
      const latestEmails = await getLatestEmails(5);
      setEmails(latestEmails);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Gagal mengambil email.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderEmail = ({ item }: { item: Email }) => (
    <View style={styles.emailItem}>
      <Text style={styles.emailFrom}>From: {item.from}</Text>
      <Text style={styles.emailSubject}>Subject: {item.subject}</Text>
      <Text style={styles.emailSnippet}>{item.snippet}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Kelola Email' }} />
      <Text style={styles.title}>Kelola Akun Email</Text>

      {isLoggedIn && userInfo ? (
        <View style={styles.loggedInContainer}>
          <View style={styles.userInfoContainer}>
            <Image source={{ uri: userInfo.picture }} style={styles.avatar} />
            <View>
              <Text style={styles.userName}>{userInfo.name}</Text>
              <Text style={styles.userEmail}>{userInfo.email}</Text>
            </View>
            <Button title="Logout" onPress={logout} color="red" />
          </View>

          <View style={styles.emailSection}>
            <Button title="Cek 5 Email Terakhir" onPress={fetchEmails} disabled={isLoading} />
            {isLoading ? (
              <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
            ) : (
              <FlatList
                data={emails}
                renderItem={renderEmail}
                keyExtractor={item => item.id}
                style={{ width: '100%', marginTop: 10 }}
              />
            )}
          </View>
        </View>
      ) : (
        <View style={styles.loggedOutContainer}>
          <Text style={styles.infoText}>
            Hubungkan akun Google Anda untuk membaca email.
          </Text>
          <View style={styles.buttonContainer}>
            <Button title="Hubungkan Akun Google" onPress={() => login()} />
          </View>
        </View>
      )}
    </View>
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
    paddingTop: 10,
    paddingBottom: 10,
    textAlign: 'center',
  },
  loggedInContainer: {
    flex: 1,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#f9f9f9',
    width: '100%',
  },
  loggedOutContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: '#333',
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
  emailSection: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  emailItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  emailFrom: {
    fontWeight: 'bold',
  },
  emailSubject: {
    fontStyle: 'italic',
    color: '#555'
  },
  emailSnippet: {
    color: '#777'
  }
});
