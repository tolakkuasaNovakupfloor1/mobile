import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import firestore from '@react-native-firebase/firestore';

// This function handles all the logic for registering a device for push notifications.
import axios from 'axios';

export async function sendPushNotification(targetUserId: string, title: string, body: string, data?: object) {
  try {
    // 1. Get the target user's push tokens from Firestore
    const userDoc = await firestore().collection('users').doc(targetUserId).get();
    if (!userDoc.exists || !userDoc.data()?.pushTokens) {
      console.log("No push tokens found for user:", targetUserId);
      return;
    }
    const pushTokens = userDoc.data()?.pushTokens;

    // 2. Construct the message payload
    const messages = pushTokens.map(token => ({
      to: token,
      sound: 'default',
      title,
      body,
      data, // e.g., { action: 'ring' }
    }));

    // 3. Send the notifications via Expo's server
    await axios.post('https://exp.host/--/api/v2/push/send', messages, {
      headers: {
        'Accept': 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error("Error sending push notification:", error);
    throw new Error("Gagal mengirim notifikasi.");
  }
}

export async function registerForPushNotificationsAsync(userId: string): Promise<string | null> {
  let token;

  // Set up notification channel for Android
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  // Check for existing permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // If permission not granted, ask for it
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  // If permission is still not granted, exit
  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return null;
  }

  // Get the Expo Push Token
  try {
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } catch (e) {
      console.error("Failed to get Expo Push Token", e);
      return null;
  }


  if (token) {
    // Save the token to the user's document in Firestore
    try {
      const userDocRef = firestore().collection('users').doc(userId);
      await userDocRef.set({
        pushTokens: firestore.FieldValue.arrayUnion(token)
      }, { merge: true }); // Use arrayUnion to add the token without duplicates, and merge to not overwrite other fields
    } catch (error) {
      console.error("Failed to save push token to Firestore", error);
    }
  }

  return token;
}
