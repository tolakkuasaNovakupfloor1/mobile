import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, Alert } from 'react-native';
import { Stack, Link } from 'expo-router';
import { startBackgroundLocationTracking, stopBackgroundLocationTracking, isTrackingBackgroundLocation } from '../services/LocationService';

export default function SettingsScreen() {
  const [isLocationTrackingEnabled, setIsLocationTrackingEnabled] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      const isTracking = await isTrackingBackgroundLocation();
      setIsLocationTrackingEnabled(isTracking);
    };
    checkStatus();
  }, []);

  const toggleLocationTracking = async () => {
    try {
      if (isLocationTrackingEnabled) {
        await stopBackgroundLocationTracking();
        setIsLocationTrackingEnabled(false);
        Alert.alert('Sukses', 'Pelacakan lokasi di latar belakang telah dinonaktifkan.');
      } else {
        await startBackgroundLocationTracking();
        setIsLocationTrackingEnabled(true);
        Alert.alert('Sukses', 'Pelacakan lokasi di latar belakang telah diaktifkan.');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
      // Revert the switch state on error
      setIsLocationTrackingEnabled(isLocationTrackingEnabled);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Pengaturan Umum' }} />
      <Text style={styles.title}>Pengaturan Umum</Text>

      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>Aktifkan Lacak Lokasi</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isLocationTrackingEnabled ? "#f5dd4b" : "#f4f3f4"}
          onValueChange={toggleLocationTracking}
          value={isLocationTrackingEnabled}
        />
      </View>
      <Text style={styles.settingDescription}>
        Jika diaktifkan, aplikasi akan mengirim pembaruan lokasi Anda secara berkala ke anggota keluarga lain.
      </Text>

      <Link href="/passcode" style={styles.link}>
        <Text style={styles.linkText}>🔑 Atur Passcode Aplikasi</Text>
      </Link>
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
  link: {
    paddingVertical: 15,
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  linkText: {
    fontSize: 18,
    color: '#007AFF',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  settingLabel: {
    fontSize: 18,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  }
});
