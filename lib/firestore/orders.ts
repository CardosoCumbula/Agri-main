import {
  collection,
  query,
  where,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  QueryConstraint,
  Timestamp,
  getDocs,
  arrayUnion,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Order, OrderStatus, OrderStatusEntry } from '../types';

const ORDERS_COLLECTION = 'orders';

// Create a new order
export async function createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory'>): Promise<string> {
  const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
    ...order,
    statusHistory: [
      {
        status: order.status,
        timestamp: Timestamp.now(),
      },
    ],
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

// Get an order by ID
export async function getOrderById(orderId: string): Promise<Order | null> {
  const docRef = doc(db, ORDERS_COLLECTION, orderId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  return {
    id: docSnap.id,
    ...docSnap.data(),
    createdAt: docSnap.data().createdAt?.toDate(),
    updatedAt: docSnap.data().updatedAt?.toDate(),
    statusHistory: docSnap.data().statusHistory?.map((entry: any) => ({
      ...entry,
      timestamp: entry.timestamp?.toDate(),
    })),
  } as Order;
}

// Get all orders for a buyer
export async function getOrdersByBuyer(buyerId: string): Promise<Order[]> {
  const q = query(collection(db, ORDERS_COLLECTION), where('buyerId', '==', buyerId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
    statusHistory: doc.data().statusHistory?.map((entry: any) => ({
      ...entry,
      timestamp: entry.timestamp?.toDate(),
    })),
  } as Order));
}

// Get all orders for a farmer
export async function getOrdersByFarmer(farmerId: string): Promise<Order[]> {
  const q = query(collection(db, ORDERS_COLLECTION), where('farmerId', '==', farmerId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
    statusHistory: doc.data().statusHistory?.map((entry: any) => ({
      ...entry,
      timestamp: entry.timestamp?.toDate(),
    })),
  } as Order));
}

// Update order status
export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus
): Promise<void> {
  const docRef = doc(db, ORDERS_COLLECTION, orderId);
  const orderDoc = await getDoc(docRef);

  if (!orderDoc.exists()) {
    throw new Error('Order not found');
  }

  const statusEntry: OrderStatusEntry = {
    status: newStatus,
    timestamp: new Date(),
  };

  await updateDoc(docRef, {
    status: newStatus,
    statusHistory: arrayUnion(statusEntry),
    updatedAt: Timestamp.now(),
  });
}

// Update payment status
export async function updatePaymentStatus(
  orderId: string,
  paymentStatus: 'unpaid' | 'paid' | 'refunded'
): Promise<void> {
  const docRef = doc(db, ORDERS_COLLECTION, orderId);
  await updateDoc(docRef, {
    paymentStatus,
    updatedAt: Timestamp.now(),
  });
}

// Cancel an order
export async function cancelOrder(orderId: string): Promise<void> {
  await updateOrderStatus(orderId, 'cancelled');
}

// Get all orders (admin view)
export async function getAllOrders(): Promise<Order[]> {
  const q = query(collection(db, ORDERS_COLLECTION));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
    statusHistory: doc.data().statusHistory?.map((entry: any) => ({
      ...entry,
      timestamp: entry.timestamp?.toDate(),
    })),
  } as Order));
}

// Get orders by product ID
export async function getOrdersByProductId(productId: string): Promise<Order[]> {
  const q = query(collection(db, ORDERS_COLLECTION), where('productId', '==', productId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
    statusHistory: doc.data().statusHistory?.map((entry: any) => ({
      ...entry,
      timestamp: entry.timestamp?.toDate(),
    })),
  } as Order));
}
