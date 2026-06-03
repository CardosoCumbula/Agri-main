import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  addDoc,
  orderBy,
  Timestamp,
  arrayUnion,
  collectionGroup,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Conversation, Message } from '../types';

const CONVERSATIONS_COLLECTION = 'conversations';

// Get or create a conversation between two users
export async function getOrCreateConversation(
  userId1: string,
  userId2: string,
  user1Name: string,
  user2Name: string,
  productId?: string
): Promise<string> {
  // Check if conversation already exists
  const q = query(
    collection(db, CONVERSATIONS_COLLECTION),
    where('participantIds', 'array-contains', userId1)
  );
  const snapshot = await getDocs(q);

  for (const doc of snapshot.docs) {
    const conv = doc.data() as Conversation;
    if (
      conv.participantIds.includes(userId2) &&
      conv.participantIds.length === 2
    ) {
      // Conversation exists
      if (productId && !conv.productId) {
        // Update with productId if provided
        await updateDoc(doc.ref, { productId });
      }
      return doc.id;
    }
  }

  // Create new conversation
  const [firstId, secondId] = [userId1, userId2].sort();
  const docRef = await addDoc(collection(db, CONVERSATIONS_COLLECTION), {
    participantIds: [userId1, userId2],
    participantNames: {
      [userId1]: user1Name,
      [userId2]: user2Name,
    },
    productId: productId || null,
    lastMessage: '',
    lastMessageAt: Timestamp.now(),
    unreadCount: {
      [userId1]: 0,
      [userId2]: 0,
    },
    createdAt: Timestamp.now(),
  });

  return docRef.id;
}

// Send a message in a conversation
export async function sendMessage(
  conversationId: string,
  senderId: string,
  senderName: string,
  text: string,
  imageUrl?: string
): Promise<string> {
  const messagesRef = collection(
    db,
    CONVERSATIONS_COLLECTION,
    conversationId,
    'messages'
  );

  const messageRef = await addDoc(messagesRef, {
    senderId,
    senderName,
    text,
    imageUrl: imageUrl || null,
    read: false,
    createdAt: Timestamp.now(),
  });

  // Update conversation's last message and increment unread count for the other user
  const conversationRef = doc(db, CONVERSATIONS_COLLECTION, conversationId);
  const conversationSnap = await getDoc(conversationRef);
  const conversation = conversationSnap.data() as Conversation;

  const otherUserId = conversation.participantIds.find((id) => id !== senderId);

  await updateDoc(conversationRef, {
    lastMessage: text,
    lastMessageAt: Timestamp.now(),
    [`unreadCount.${otherUserId}`]: (conversation.unreadCount[otherUserId] || 0) + 1,
  });

  return messageRef.id;
}

// Get all conversations for a user
export async function getConversations(userId: string): Promise<Conversation[]> {
  const q = query(
    collection(db, CONVERSATIONS_COLLECTION),
    where('participantIds', 'array-contains', userId)
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    lastMessageAt: doc.data().lastMessageAt?.toDate(),
    createdAt: doc.data().createdAt?.toDate(),
  } as Conversation));
}

// Get messages from a conversation
export async function getMessages(conversationId: string): Promise<Message[]> {
  const messagesRef = collection(
    db,
    CONVERSATIONS_COLLECTION,
    conversationId,
    'messages'
  );
  const q = query(messagesRef, orderBy('createdAt', 'asc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
  } as Message));
}

// Listen to real-time messages (for live chat UI)
export function listenToMessages(
  conversationId: string,
  callback: (messages: Message[]) => void
): Unsubscribe {
  const messagesRef = collection(
    db,
    CONVERSATIONS_COLLECTION,
    conversationId,
    'messages'
  );
  const q = query(messagesRef, orderBy('createdAt', 'asc'));

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
    } as Message));
    callback(messages);
  });
}

// Mark all messages from another user as read
export async function markAsRead(
  conversationId: string,
  currentUserId: string
): Promise<void> {
  const messagesRef = collection(
    db,
    CONVERSATIONS_COLLECTION,
    conversationId,
    'messages'
  );
  const snapshot = await getDocs(messagesRef);

  // Batch update: mark all messages from other user as read
  for (const doc of snapshot.docs) {
    const message = doc.data() as Message;
    if (message.senderId !== currentUserId && !message.read) {
      await updateDoc(doc.ref, { read: true });
    }
  }

  // Reset unread count for current user
  const conversationRef = doc(db, CONVERSATIONS_COLLECTION, conversationId);
  await updateDoc(conversationRef, {
    [`unreadCount.${currentUserId}`]: 0,
  });
}

// Get a single conversation
export async function getConversationById(
  conversationId: string
): Promise<Conversation | null> {
  const docRef = doc(db, CONVERSATIONS_COLLECTION, conversationId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  return {
    id: docSnap.id,
    ...docSnap.data(),
    lastMessageAt: docSnap.data().lastMessageAt?.toDate(),
    createdAt: docSnap.data().createdAt?.toDate(),
  } as Conversation;
}

// Listen to real-time conversations (for live conversation list)
export function listenToConversations(
  userId: string,
  callback: (conversations: Conversation[]) => void
): Unsubscribe {
  const q = query(
    collection(db, CONVERSATIONS_COLLECTION),
    where('participantIds', 'array-contains', userId)
  );

  return onSnapshot(q, (snapshot) => {
    const conversations = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      lastMessageAt: doc.data().lastMessageAt?.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
    } as Conversation));
    callback(conversations);
  });
}
