// User roles
export type UserRole = 'farmer' | 'buyer' | 'admin';

// User document
export interface User {
  uid: string;
  name: string;
  phone: string;
  role: UserRole;
  province: string;
  createdAt: Date;
  email: string;
  deactivated?: boolean;
}

// Product categories
export type ProductCategory = 'Vegetais' | 'Frutas' | 'Grãos' | 'Legumes' | 'Oleaginosas' | 'Insumos' | 'Cereais';

// Product status for approval workflow
export type ProductStatus = 'pending' | 'approved' | 'rejected';

// Product document
export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  unit: string; // kg, liters, units, etc.
  quantity: number;
  farmerId: string;
  farmerName: string;
  province: string;
  imageUrl: string;
  createdAt: Date;
  status: ProductStatus;
  rejectionReason?: string;
}

// Market listing status
export type MarketListingStatus = 'pending' | 'approved' | 'rejected';

// Market listing (Mercado page - buyer requests)
export interface MarketListing {
  id: string;
  productName: string;
  buyerName: string;
  buyerType: string; // e.g., "Restaurante", "Retalho", "Processador"
  location: string;
  pricePerUnit: number;
  unit: string;
  quantityNeeded: number;
  frequency: string; // e.g., "Semanal", "Mensal", "Pontual"
  imageUrl: string;
  postedAt: Date;
  status: MarketListingStatus;
  rejectionReason?: string;
}

// Tips/Extensão Rural categories
export type TipCategory = 'Pragas' | 'Irrigação' | 'Sementes' | 'Boas Práticas';

// Tips document
export interface Tip {
  id: string;
  title: string;
  category: TipCategory;
  readTime: number; // in minutes
  summary: string;
  content?: string;
  imageUrl: string;
  publishedAt: Date;
}

// Order status
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

// Payment method
export type PaymentMethod = 'mpesa' | 'emola' | 'bank_transfer' | 'cash_on_delivery';

// Payment status
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';

// Order status history entry
export interface OrderStatusEntry {
  status: OrderStatus;
  timestamp: Date;
}

// Order document
export interface Order {
  id: string;
  productId: string;
  productName: string;
  farmerId: string;
  farmerName: string;
  buyerId: string;
  buyerName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  unit: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  deliveryAddress: string;
  province: string;
  notes?: string;
  statusHistory?: OrderStatusEntry[];
  createdAt: Date;
  updatedAt: Date;
}

// Conversation document
export interface Conversation {
  id: string;
  participantIds: string[]; // exactly 2 uids
  participantNames: { [uid: string]: string };
  productId?: string; // optional - if chat started from a product listing
  lastMessage: string;
  lastMessageAt: Date;
  unreadCount: { [uid: string]: number };
  createdAt: Date;
}

// Message document (in conversations/{conversationId}/messages subcollection)
export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  imageUrl?: string;
  read: boolean;
  createdAt: Date;
}

// Notification types
export type NotificationType = 'product_approved' | 'product_rejected' | 'new_order' | 'new_message' | 'order_status_update';

// Notification document
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  message: string;
  read: boolean;
  relatedId?: string; // productId, orderId, conversationId, etc.
  createdAt: Date;
}

// Report document (for moderation)
export interface Report {
  id: string;
  conversationId: string;
  reportedBy: string;
  reason: string;
  createdAt: Date;
  status: 'open' | 'resolved' | 'dismissed';
  adminNotes?: string;
}

// Weather cache (optional - for Clima page)
export interface WeatherCache {
  province: string;
  data: Record<string, any>; // JSON data from weather API
  updatedAt: Date;
}
