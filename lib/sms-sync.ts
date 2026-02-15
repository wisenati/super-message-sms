import { ref, push, set, serverTimestamp } from 'firebase/database';
import { database } from '@/lib/firebase';

const BANK_KEYWORDS = ['debit', 'credit', 'otp', 'bank', 'transaction', 'alert', 'acct', 'transfer', 'received', 'sent'];
const SPAM_KEYWORDS = ['win', 'prize', 'gift', 'claim', 'lottery', 'congratulations', 'urgent', 'verify account'];

export interface IncomingSMS {
  address: string;
  body: string;
  date: number;
}

export const syncSMSToFirebase = async (sms: IncomingSMS, userId: string) => {
  try {
    const isBank = BANK_KEYWORDS.some(keyword => sms.body.toLowerCase().includes(keyword));
    const isSpam = SPAM_KEYWORDS.some(keyword => sms.body.toLowerCase().includes(keyword));

    const messagesRef = ref(database, 'messages');
    const newMessageRef = push(messagesRef);

    await set(newMessageRef, {
      sender_number: sms.address,
      message_text: sms.body,
      timestamp: sms.date || Date.now(),
      user_id: userId,
      message_type: 'sms',
      is_bank: isBank,
      is_spam: isSpam,
    });

    console.log('SMS synced to Firebase');
  } catch (error) {
    console.error('Error syncing SMS:', error);
  }
};

/**
 * Mock function to simulate receiving an SMS for testing purposes
 */
export const simulateIncomingSMS = async (userId: string) => {
  const mocks: IncomingSMS[] = [
    { address: 'BankAlert', body: 'Debit: Your Acct XXX123 has been debited for USD 50.00. Desc: ATM WDL.', date: Date.now() },
    { address: 'AuthService', body: 'Your OTP is 482910. Do not share this with anyone.', date: Date.now() },
    { address: '+123456789', body: 'Hey, are we still meeting today at the sanctuary?', date: Date.now() },
    { address: 'WinnerNotice', body: 'CONGRATULATIONS! You have won a $1000 gift card. Click here to claim your prize now!', date: Date.now() },
  ];

  const randomSMS = mocks[Math.floor(Math.random() * mocks.length)];
  await syncSMSToFirebase(randomSMS, userId);
};
