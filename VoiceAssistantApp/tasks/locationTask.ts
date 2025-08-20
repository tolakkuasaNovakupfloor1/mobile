import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import firestore from '@react-native-firebase/firestore';
import { getCurrentUser } from '../services/FirebaseAuthService';

export const LOCATION_TASK_NAME = 'background-location-task';

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('Background location task error:', error);
    return;
  }

  if (data) {
    const { locations } = data as { locations: Location.LocationObject[] };
    const latestLocation = locations[0];

    const currentUser = getCurrentUser();

    if (currentUser && latestLocation) {
      const userDocRef = firestore().collection('users').doc(currentUser.uid);
      try {
        await userDocRef.update({
          lastKnownLocation: {
            latitude: latestLocation.coords.latitude,
            longitude: latestLocation.coords.longitude,
            timestamp: firestore.FieldValue.serverTimestamp(),
          }
        });
        console.log('Background location updated for user:', currentUser.uid);
      } catch (e) {
        console.error('Failed to update background location in Firestore:', e);
      }
    }
  }
});
