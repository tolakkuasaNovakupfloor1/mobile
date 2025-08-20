import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Stack, useLocalSearchParams } from 'expo-router';
import firestore from '@react-native-firebase/firestore';

interface LocationData {
  latitude: number;
  longitude: number;
  timestamp: any;
}

export default function MapScreen() {
  const { userId, userEmail } = useLocalSearchParams<{ userId: string, userEmail: string }>();
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (!userId) {
      Alert.alert("Error", "User ID tidak ditemukan.");
      setIsLoading(false);
      return;
    }

    const subscriber = firestore()
      .collection('users')
      .doc(userId)
      .onSnapshot(documentSnapshot => {
        const data = documentSnapshot.data();
        if (data && data.lastKnownLocation) {
          setLocation(data.lastKnownLocation);

          // Animate map to new location
          mapRef.current?.animateToRegion({
            latitude: data.lastKnownLocation.latitude,
            longitude: data.lastKnownLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }, 1000);

        }
        setIsLoading(false);
      }, error => {
        console.error(error);
        Alert.alert("Error", "Gagal memuat data lokasi.");
        setIsLoading(false);
      });

    // Stop listening for updates when the component is unmounted
    return () => subscriber();
  }, [userId]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `Lokasi ${userEmail || 'Pengguna'}` }} />
      {isLoading ? (
        <ActivityIndicator size="large" style={StyleSheet.absoluteFill} />
      ) : location ? (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
        >
          <Marker
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            title={userEmail || 'Lokasi Pengguna'}
            description={`Terakhir dilihat: ${new Date(location.timestamp?.toDate()).toLocaleString()}`}
          />
        </MapView>
      ) : (
        <View style={styles.centered}>
          <Text>Menunggu data lokasi pertama dari pengguna...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
