import firestore from '@react-native-firebase/firestore';
import { getCurrentUser } from './FirebaseAuthService';

export interface AppUser {
  id: string; // This will be the firebase uid
  email?: string;
  // We can add more fields here like displayName, etc.
}

// Fetches all users from the 'users' collection, except for the currently logged-in user.
export const getAllOtherUsers = async (): Promise<AppUser[]> => {
  try {
    const currentUser = getCurrentUser();
    const snapshot = await firestore().collection('users').get();

    const users: AppUser[] = [];
    snapshot.forEach(doc => {
      // We assume the document ID is the user's UID
      const user = {
        id: doc.id,
        email: doc.data().email || 'Email tidak diketahui', // assuming email is stored
      };
      // Add user to the list if it's not the current user
      if (currentUser && currentUser.uid !== user.id) {
        users.push(user);
      }
    });

    return users;
  } catch (error) {
    console.error("Error fetching users: ", error);
    throw new Error("Gagal mengambil daftar pengguna.");
  }
};

// We also need a function to create the user document when they register
export const createUserDocument = async (user: any) => {
    if (!user) return;
    const userDocRef = firestore().collection('users').doc(user.uid);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
        await userDocRef.set({
            email: user.email,
            createdAt: firestore.FieldValue.serverTimestamp(),
        });
    }
}
