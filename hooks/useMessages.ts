import { useState, useEffect } from 'react';
import { ref, onValue, query, orderByChild, limitToLast } from 'firebase/database';
import { database } from '@/lib/firebase';
import { useAuth } from './useAuth';

export interface Message {
  id: string;
  sender_number: string;
  message_text: string;
  timestamp: number;
  device_id?: string;
  user_id?: string;
  message_type: 'sms' | 'in-app';
  is_spam?: boolean;
  is_bank?: boolean;
}

export function useMessages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // In a real app, we might filter by user_id or device_id
    // For this prototype, we'll listen to a common 'messages' node
    const messagesRef = ref(database, 'messages');
    const messagesQuery = query(messagesRef, orderByChild('timestamp'), limitToLast(50));

    const unsubscribe = onValue(messagesQuery, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageList = Object.entries(data)
          .map(([key, value]: [string, any]) => ({
            id: key,
            ...value,
          }))
          .filter((m) => m.user_id === user.uid);
        // Sort descending
        messageList.sort((a, b) => b.timestamp - a.timestamp);
        setMessages(messageList);
      } else {
        setMessages([]);
      }
      setLoading(false);
    }, (error) => {
      console.error(error);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  return { messages, loading };
}
