import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref, set } from 'firebase/database';
import { getAuth, GoogleAuthProvider, onIdTokenChanged, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {

    apiKey: "AIzaSyBzQ8PfdOzHnOMK2MCgryfKbPswpMqUoIs",
  
    authDomain: "josh-scheduler-2d177.firebaseapp.com",
  
    databaseURL: "https://josh-scheduler-2d177-default-rtdb.firebaseio.com",
  
    projectId: "josh-scheduler-2d177",
  
    storageBucket: "josh-scheduler-2d177.appspot.com",
  
    messagingSenderId: "616089150553",
  
    appId: "1:616089150553:web:dac2c560131f04b481fd48",
  
    measurementId: "G-7M6YN7X8FG"
  
  };

const firebase = initializeApp(firebaseConfig);
const database = getDatabase(firebase);
export const useData = (path, transform) => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
  
    useEffect(() => {
      const dbRef = ref(database, path);
      const devMode = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
      if (devMode) { console.log(`loading ${path}`); }
      return onValue(dbRef, (snapshot) => {
        const val = snapshot.val();
        if (devMode) { console.log(val); }
        setData(transform ? transform(val) : val);
        setLoading(false);
        setError(null);
      }, (error) => {
        setData(null);
        setLoading(false);
        setError(error);
      });
    }, [path, transform]);
  
    return [data, loading, error];
  };

export const setData = (path, value) => {
    set(ref(database,path), value);
  };

export const signInWithGoogle = () => {
    signInWithPopup(getAuth(firebase), new GoogleAuthProvider());
  };

const firebaseSignOut = () => signOut(getAuth(firebase));

export { firebaseSignOut as signOut };

export const useUserState = () => {
  const [user, setUser] = useState();

  useEffect(() => {
    onIdTokenChanged(getAuth(firebase), setUser);
  }, []);

  return [user];
};

// export const useUserState = () => useAuthState(firebase.auth());