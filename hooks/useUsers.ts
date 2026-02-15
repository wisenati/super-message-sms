import { useState, useEffect } from 'react';
import { ref, onValue, query, orderByChild } from 'firebase/database';
import { database } from '@/lib/firebase';
import { useAuth } from './useAuth';

export interface UserProfile {
  uid: string;
  phoneNumber: string;
  displayName?: string;
  status?: 'online' | 'offline';
  lastSeen?: number;
}

export function useUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const usersRef = ref(database, 'users');
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const userList = Object.entries(data)
          .map(([key, value]: [string, any]) => ({
            uid: key,
            ...value,
          }))
          .filter((u) => u.uid !== currentUser.uid);
        setUsers(userList);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser]);

  return { users, loading };
}
