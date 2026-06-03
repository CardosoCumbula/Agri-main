import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  orderBy,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Notification, NotificationType } from '../types';

const NOTIFICATIONS_COLLECTION = 'notifications';

// Create a notification
export async function createNotification(
  userId: string,
  type: NotificationType,
  message: string,
  relatedId?: string
): Promise<string> {
  const docRef = await addDoc(collection(db, NOTIFICATIONS_COLLECTION), {
    userId,
    type,
    message,
    relatedId: relatedId || null,
    read: false,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

// Get all notifications for a user
export async function getNotifications(userId: string): Promise<Notification[]> {
  const q = query(
    collection(db, NOTIFICATIONS_COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
  } as Notification));
}

// Get unread notification count for a user
export async function getUnreadNotificationCount(userId: string): Promise<number> {
  const q = query(
    collection(db, NOTIFICATIONS_COLLECTION),
    where('userId', '==', userId),
    where('read', '==', false)
  );
  const snapshot = await getDocs(q);
  return snapshot.size;
}

// Mark a notification as read
export async function markNotificationAsRead(notificationId: string): Promise<void> {
  const docRef = doc(db, NOTIFICATIONS_COLLECTION, notificationId);
  await updateDoc(docRef, { read: true });
}

// Mark all notifications as read for a user
export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  const q = query(
    collection(db, NOTIFICATIONS_COLLECTION),
    where('userId', '==', userId),
    where('read', '==', false)
  );
  const snapshot = await getDocs(q);

  for (const doc of snapshot.docs) {
    await updateDoc(doc.ref, { read: true });
  }
}

// Delete a notification
export async function deleteNotification(notificationId: string): Promise<void> {
  const docRef = doc(db, NOTIFICATIONS_COLLECTION, notificationId);
  await deleteDoc(docRef);
}

// Listen to real-time notifications
export function listenToNotifications(
  userId: string,
  callback: (notifications: Notification[]) => void
): Unsubscribe {
  const q = query(
    collection(db, NOTIFICATIONS_COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
    } as Notification));
    callback(notifications);
  });
}

// Notify farmer about product approval
export async function notifyProductApproval(
  farmerId: string,
  productName: string,
  productId: string
): Promise<void> {
  await createNotification(
    farmerId,
    'product_approved',
    `Seu produto "${productName}" foi aprovado e está agora visível no mercado.`,
    productId
  );
}

// Notify farmer about product rejection
export async function notifyProductRejection(
  farmerId: string,
  productName: string,
  rejectionReason: string,
  productId: string
): Promise<void> {
  const message = `Seu produto "${productName}" foi rejeitado. Motivo: ${rejectionReason}`;
  await createNotification(
    farmerId,
    'product_rejected',
    message,
    productId
  );
}

// Notify farmer about new order
export async function notifyNewOrder(
  farmerId: string,
  buyerName: string,
  productName: string,
  orderId: string
): Promise<void> {
  const message = `${buyerName} fez um pedido para "${productName}".`;
  await createNotification(
    farmerId,
    'new_order',
    message,
    orderId
  );
}

// Notify buyer about order status update
export async function notifyOrderStatusUpdate(
  buyerId: string,
  orderStatus: string,
  productName: string,
  orderId: string
): Promise<void> {
  const message = `Seu pedido de "${productName}" foi atualizado para: ${orderStatus}.`;
  await createNotification(
    buyerId,
    'order_status_update',
    message,
    orderId
  );
}

// Notify user about new message
export async function notifyNewMessage(
  userId: string,
  senderName: string,
  conversationId: string
): Promise<void> {
  const message = `${senderName} enviou-lhe uma mensagem.`;
  await createNotification(
    userId,
    'new_message',
    message,
    conversationId
  );
}
