import React, { useState, useEffect, useRef } from 'react';
import { AppState, AppStateStatus, Alert } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import * as Notifications from 'expo-notifications';
import { Audio } from 'expo-av';


import { useColorScheme } from '@/hooks/useColorScheme';
import { loadPasscode } from '@/services/StorageService';
import LockScreen from '@/components/LockScreen';
import { onAuthStateChanged } from '@/services/FirebaseAuthService';
import { registerForPushNotificationsAsync } from '@/services/PushNotificationService';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// This is the main layout for the app. It handles auth state and app lock.
function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const [storedPasscode, setStoredPasscode] = useState<string | null>(null);
  const [isAppLocked, setIsAppLocked] = useState(true);
  const [isInitialised, setIsInitialised] = useState(false);
  const soundObject = useRef<Audio.Sound | null>(null);

  // --- Notification & Ringing Logic ---
  useEffect(() => {
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      const action = notification.request.content.data?.action;
      if (action === 'ring') {
        playRingSound();
      }
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      // Handle user tapping on notification
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  const playRingSound = async () => {
    try {
      if (soundObject.current) {
        await soundObject.current.unloadAsync();
      }
      // The original code would crash because the alarm.mp3 file does not exist.
      // This is a placeholder to prevent a crash and inform the user what to do.
      Alert.alert(
        "Fitur Belum Aktif",
        "Untuk mengaktifkan fitur dering, silakan tambahkan file suara 'alarm.mp3' ke dalam folder 'assets/sounds' di proyek ini.",
        [{ text: "OK" }]
      );

      // The code below is the original implementation that will work once the file is added.
      /*
      const { sound } = await Audio.Sound.createAsync(
         require('../assets/sounds/alarm.mp3'),
         { isLooping: true, volume: 1.0 }
      );
      soundObject.current = sound;
      await sound.playAsync();

      Alert.alert(
        "Deringkan Perangkat",
        "Perangkat ini dideringkan dari jarak jauh.",
        [{ text: "Hentikan", onPress: stopRingSound }]
      );
      */
    } catch (e) {
        console.error("Could not play sound", e);
        Alert.alert("Error", "Tidak dapat memutar suara. Pastikan file 'alarm.mp3' ada di folder assets/sounds.");
    }
  };

  const stopRingSound = async () => {
    if (soundObject.current) {
      await soundObject.current.stopAsync();
      await soundObject.current.unloadAsync();
      soundObject.current = null;
    }
  };

  // --- Passcode & App State Logic ---
  useEffect(() => {
    const checkPasscode = async () => {
      const passcode = await loadPasscode();
      setStoredPasscode(passcode);
      setIsAppLocked(!!passcode);
      setIsInitialised(true);
    };
    checkPasscode();
  }, []);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active' && storedPasscode) {
        setIsAppLocked(true);
      }
    };
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [storedPasscode]);

  if (!isInitialised) {
    return null;
  }

  if (isAppLocked && storedPasscode) {
    return <LockScreen storedPasscode={storedPasscode} onUnlock={() => setIsAppLocked(false)} />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Menu Utama' }} />
        <Stack.Screen name="security" options={{ title: 'Pengaturan Keamanan' }} />
        <Stack.Screen name="voice" options={{ title: 'Pengaturan Suara' }} />
        <Stack.Screen name="email" options={{ title: 'Kelola Email' }} />
        <Stack.Screen name="whatsapp" options={{ title: 'Kontak Favorit WhatsApp' }} />
        <Stack.Screen name="media" options={{ title: 'Kontrol Media' }} />
        <Stack.Screen name="launcher" options={{ title: 'Peluncur Aplikasi' }} />
        <Stack.Screen name="settings" options={{ title: 'Pengaturan Umum' }} />
        <Stack.Screen name="passcode" options={{ title: 'Atur Passcode' }} />
        <Stack.Screen name="devices" options={{ title: 'Perangkat Keluarga' }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}


export default function RootLayout() {
  const [user, setUser] = useState<any | null>(null);
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!loaded) return;

    const unsubscribe = onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        registerForPushNotificationsAsync(firebaseUser.uid);
        const inAuthGroup = segments[0] === 'auth';
        if (inAuthGroup) {
          router.replace('/');
        }
      } else {
        router.replace('/auth');
      }
    });

    return () => unsubscribe();
  }, [loaded]);

  if (!loaded) {
    return <Slot />;
  }

  if (user === null) {
    return <Slot />;
  }

  return <RootLayoutNav />;
}
