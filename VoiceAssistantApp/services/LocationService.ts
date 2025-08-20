import * as Location from 'expo-location';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

import { LOCATION_TASK_NAME } from '../tasks/locationTask';

export async function startBackgroundLocationTracking() {
  const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
  if (foregroundStatus !== 'granted') {
    throw new Error('Izin lokasi foreground ditolak.');
  }

  const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
  if (backgroundStatus !== 'granted') {
    throw new Error('Izin lokasi background ditolak.');
  }

  await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
    accuracy: Location.Accuracy.Balanced,
    timeInterval: 60 * 1000, // 1 minute
    distanceInterval: 100, // 100 meters
  });
  console.log("Background location tracking started.");
}

export async function stopBackgroundLocationTracking() {
  await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
  console.log("Background location tracking stopped.");
}

export async function isTrackingBackgroundLocation() {
    return await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
}

export async function getCurrentLocation(): Promise<Coordinates | null> {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    console.error('Permission to access location was denied');
    // In a real app, you'd want to show a more user-friendly message
    // or guide the user to settings.
    return null;
  }

  try {
    let location = await Location.getCurrentPositionAsync({});
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error('Error getting location', error);
    return null;
  }
}
