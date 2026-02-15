import { useState, useEffect } from 'react';
import { ref, onValue, query, orderByChild, limitToLast } from 'firebase/database';
import { database } from '@/lib/firebase';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  timestamp: number;
  type: 'info' | 'alert' | 'update' | 'promo';
  link?: string;
}

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const announcementsRef = ref(database, 'announcements');
    const announcementsQuery = query(announcementsRef, orderByChild('timestamp'), limitToLast(20));

    const unsubscribe = onValue(announcementsQuery, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.entries(data).map(([key, value]: [string, any]) => ({
          id: key,
          ...value,
        }));
        list.sort((a, b) => b.timestamp - a.timestamp);
        setAnnouncements(list);
      } else {
        setAnnouncements([]);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { announcements, loading };
}
