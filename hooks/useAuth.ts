import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signInAnonymously } from 'firebase/auth';
import { auth, database } from '@/lib/firebase';
import { ref, get, set } from 'firebase/database';

export interface SimpleUser {
  phoneNumber: string;
  uid: string;
  pin?: string;
}

const STORAGE_KEY = '@super_message_user';

export function useAuth() {
  const [user, setUser] = useState<SimpleUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        // Ensure Firebase session is active
        const cred = await signInAnonymously(auth);
        setUser({ ...parsed, uid: cred.user.uid });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (phoneNumber: string, pin?: string) => {
    try {
      setLoading(true);
      const cred = await signInAnonymously(auth);
      const newUser: SimpleUser = { phoneNumber, uid: cred.user.uid, pin };
      
      // Save to RTDB (User profile)
      await set(ref(database, `users/${phoneNumber.replace(/[^0-9]/g, '')}`), {
        phoneNumber,
        uid: cred.user.uid,
        pin: pin || null,
        lastSeen: Date.now(),
      });

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      setUser(newUser);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      await auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return { user, loading, login, logout, isAuthenticated: !!user };
}
