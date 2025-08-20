import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Alert, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { getAllOtherUsers, AppUser } from '../services/UserService';
import { sendPushNotification } from '../services/PushNotificationService';
import { getCurrentUser } from '../services/FirebaseAuthService';

export default function DevicesScreen() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = getCurrentUser();
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const otherUsers = await getAllOtherUsers();
        setUsers(otherUsers);
      } catch (error: any) {
        Alert.alert('Error', error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleSendNotification = (targetUser: AppUser) => {
    Alert.prompt(
      'Kirim Notifikasi',
      `Masukkan pesan untuk ${targetUser.email}:`,
      async (message) => {
        if (message) {
          try {
            const title = `Pesan dari ${currentUser?.email}`;
            await sendPushNotification(targetUser.id, title, message);
            Alert.alert('Sukses', `Notifikasi telah dikirim ke ${targetUser.email}.`);
          } catch (error: any) {
            Alert.alert('Error', error.message);
          }
        }
      }
    );
  };

  const handleRingDevice = async (targetUser: AppUser) => {
    try {
      const title = `Panggilan dari ${currentUser?.email}`;
      const body = 'Seseorang sedang mencoba menemukan perangkat Anda.';
      await sendPushNotification(targetUser.id, title, body, { action: 'ring' });
      Alert.alert('Sukses', `Perintah dering telah dikirim ke ${targetUser.email}.`);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleViewMap = (targetUser: AppUser) => {
    router.push({
      pathname: '/map',
      params: { userId: targetUser.id, userEmail: targetUser.email },
    });
  };

  const renderItem = ({ item }: { item: AppUser }) => (
    <View style={styles.userItem}>
      <Text style={styles.userEmail}>{item.email}</Text>
      <View style={styles.buttonRow}>
        <Button title="Lihat Peta" onPress={() => handleViewMap(item)} />
        <Button title="Notifikasi" onPress={() => handleSendNotification(item)} />
        <Button title="Deringkan" onPress={() => handleRingDevice(item)} color="#FFA500" />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Perangkat Terhubung' }} />
      <Text style={styles.title}>Perangkat Terhubung</Text>
      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : users.length > 0 ? (
        <FlatList
          data={users}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      ) : (
        <Text style={styles.emptyText}>Tidak ada perangkat lain yang terhubung.</Text>
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
    padding: 24,
    textAlign: 'center',
  },
  userItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  userEmail: {
    fontSize: 18,
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
});
