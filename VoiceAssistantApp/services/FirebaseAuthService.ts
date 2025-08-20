import auth from '@react-native-firebase/auth';

// Note: We will need to create UI for these functions.
// This file just contains the core logic.

export const signUp = (email, password) => {
  return auth().createUserWithEmailAndPassword(email, password);
};

export const signIn = (email, password) => {
  return auth().signInWithEmailAndPassword(email, password);
};

export const signOut = () => {
  return auth().signOut();
};

// This is a listener that you can use to get the current user state
// in your main app component.
export const onAuthStateChanged = (callback) => {
  return auth().onAuthStateChanged(callback);
};

export const getCurrentUser = () => {
  return auth().currentUser;
};
