import { useState, useEffect } from 'react';
import { ref, onValue, push, set, remove, serverTimestamp, query, orderByChild } from 'firebase/database';
import { database } from '@/lib/firebase';
import { useAuth } from './useAuth';

export interface ChatMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  text: string;
  timestamp: number;
  status: 'sent' | 'delivered';
}

export function useChatRoom(otherUserId: string) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);

  // Generate a unique room ID
  const roomId = [user?.uid, otherUserId].sort().join('_');

  useEffect(() => {
    if (!user || !otherUserId) return;

    const chatRef = ref(database, `chats/${roomId}`);
    const unsubscribe = onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const msgList = Object.entries(data).map(([key, value]: [string, any]) => ({
          id: key,
          ...value,
        }));
        msgList.sort((a, b) => a.timestamp - b.timestamp);
        setMessages(msgList);
      } else {
        setMessages([]);
      }
    });

    // Typing indicator
    const typingRef = ref(database, `typing/${roomId}/${otherUserId}`);
    const typingUnsubscribe = onValue(typingRef, (snapshot) => {
      setOtherUserTyping(!!snapshot.val());
    });

    return () => {
      unsubscribe();
      typingUnsubscribe();
    };
  }, [user, otherUserId, roomId]);

  const sendMessage = async (text: string) => {
    if (!user || !text.trim()) return;

    const chatRef = ref(database, `chats/${roomId}`);
    const newMessageRef = push(chatRef);
    await set(newMessageRef, {
      sender_id: user.uid,
      receiver_id: otherUserId,
      text: text.trim(),
      timestamp: serverTimestamp(),
      status: 'sent',
    });
  };

  const setTyping = (typing: boolean) => {
    if (!user) return;
    const typingRef = ref(database, `typing/${roomId}/${user.uid}`);
    set(typingRef, typing ? true : null);
    setIsTyping(typing);
  };

  const deleteMessage = async (messageId: string) => {
    const messageRef = ref(database, `chats/${roomId}/${messageId}`);
    await remove(messageRef);
  };

  return { messages, sendMessage, isTyping, setTyping, otherUserTyping, deleteMessage };
}
