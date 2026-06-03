# AGROMOZ FIREBASE & IMAGE STRATEGY - FINAL SETUP GUIDE

## 📋 QUICK REFERENCE CHECKLIST

### ✅ Completed Components
- [x] Firebase Initialization (`firebase.ts`)
- [x] Firestore Service Layer (all 8 collections)
- [x] Firebase Authentication Hook (`useAuth.ts`)
- [x] Firebase Storage Service (`lib/storage.ts`)
- [x] Firestore Security Rules (`firestore.rules`)
- [x] Admin Approvals Dashboard (`/admin/approvals`)
- [x] Admin Sidebar with Approval Badge
- [x] Buyer Orders Page (`/conta/encomendas`)
- [x] Farmer Sales Page (`/conta/vendas`)
- [x] Chat/Messages System (`/conta/mensagens`)
- [x] Real-time Notifications

---

## 🖼️ IMAGE & MEDIA STRATEGY

### Firebase Storage Structure
```
storage/
├── products/
│   └── {productId}/
│       └── {timestamp}-{filename}
├── listings/
│   └── {listingId}/
│       └── {timestamp}-{filename}
├── tips/
│   └── {tipId}/
│       └── {timestamp}-{filename}
└── conversations/
    └── {conversationId}/
        └── {timestamp}-{filename}
```

### Image Upload Implementation

**1. On Product Submit (Farmer)**
```typescript
import { uploadImage } from '@/lib/storage';

// When submitting a new product
const imageUrl = await uploadImage(imageFile, `products/${productId}`);
await addProduct({ ...productData, imageUrl });
```

**2. On Market Listing Submit (Buyer)**
```typescript
const imageUrl = await uploadImage(imageFile, `listings/${listingId}`);
await addListing({ ...listingData, imageUrl });
```

**3. On Chat Message (Optional Image)**
```typescript
let imageUrl: string | undefined;
if (attachedImage) {
  imageUrl = await uploadImage(attachedImage, `conversations/${conversationId}`);
}
await sendMessage(conversationId, userId, name, text, imageUrl);
```

### Image Optimization Best Practices

1. **Client-side Compression** (recommended)
   ```typescript
   // Add to lib/utils.ts
   export async function compressImage(file: File, maxSizeMB = 2): Promise<File> {
     // Use browser Canvas API or third-party library
     const canvas = document.createElement('canvas');
     // Scale down image if > maxSizeMB
   }
   ```

2. **Firebase Storage Rules** (already set for authenticated users)
   - Max file size: 10MB (configurable in Firebase Console)
   - Allowed formats: .jpg, .jpeg, .png, .gif, .webp

3. **Image CDN/Caching**
   - Firebase Storage URLs include caching headers
   - Use Next.js Image component for optimization:
   ```tsx
   import Image from 'next/image';
   
   <Image 
     src={product.imageUrl} 
     alt={product.name}
     width={400}
     height={300}
     className="object-cover"
   />
   ```

---

## 🔐 SECURITY RULES DEPLOYMENT

### Deploying Firestore Rules

1. **Test locally first** (using Firebase Emulator):
   ```bash
   firebase emulators:start
   ```

2. **Deploy to Firebase**:
   ```bash
   firebase deploy --only firestore:rules
   ```

3. **Rules Summary**:
   - ✅ Users: Only read/write own profile
   - ✅ Products: Only approved visible to public; farmers can create (pending)
   - ✅ Market Listings: Only approved visible; buyers can create (pending)
   - ✅ Orders: Farmers/buyers see only their own; admins see all
   - ✅ Conversations: Only participants and admins can read
   - ✅ Messages: Participants can read/write; admins can read
   - ✅ Notifications: Users read only their own
   - ✅ Reports: Admins only
   - ✅ Tips: Public read; admin write only

---

## 🔄 WORKFLOW IMPLEMENTATIONS

### 1. PRODUCT APPROVAL WORKFLOW
```
Farmer submits → Product created with status="pending"
                    ↓
            Product NOT visible on public pages
                    ↓
Admin reviews → Clicks "Aprovar" or "Rejeitar"
                    ↓
        [Approval Path]          [Rejection Path]
        status → "approved"      status → "rejected"
        Farmer notified          Farmer notified + reason
        ↓                        ↓
    Visible on home/         Visible in farmer
    product pages            dashboard with reason
```

### 2. ORDER CREATION & STATUS FLOW
```
Buyer clicks "Encomendar" 
    ↓
Modal: quantity, address, payment method
    ↓
Order created: status="pending", paymentStatus="unpaid"
    ↓
Farmer receives notification
    ↓
[Farmer Actions]:
- Confirm → status="confirmed"
- Ship → status="shipped"
- Deliver → status="delivered"
- Cancel → status="cancelled"
    ↓
Buyer receives status notifications
```

### 3. CHAT INITIATION PATHS
```
Path A: From Product Page
  Buyer sees "Contactar Agricultor" button
  → getOrCreateConversation(buyerId, farmerId, productId)

Path B: From Order Page
  Farmer: "Falar com o Comprador"
  Buyer: "Falar com o Agricultor"
  → getOrCreateConversation(farmerId, buyerId)
```

---

## 💳 PAYMENT INTEGRATION PLACEHOLDER

### Current Status (Manual/Offline)
Located in: `/lib/firestore/orders.ts` and admin panel

```typescript
// TODO: Integrate M-Pesa or e-Mola payment gateway
// Current flow:
// 1. Buyer selects payment method (mpesa | emola | bank_transfer | cash_on_delivery)
// 2. Show reference instructions (STEP 1: Send to XXXXX, STEP 2: Enter reference)
// 3. Admin manually verifies payment and updates paymentStatus to "paid"

// Future: Connect to payment gateway API
// Example M-Pesa integration points:
// - /api/payments/momo-request (initiate payment)
// - /api/payments/momo-callback (receive payment confirmation)
```

---

## 🚀 DEPLOYMENT CHECKLIST

### Pre-Deployment
- [ ] Set up `.env.local` with real Firebase credentials
- [ ] Test all pages locally: `npm run dev`
- [ ] Test admin approval workflow
- [ ] Test order creation and status updates
- [ ] Test chat messaging
- [ ] Deploy Firestore security rules
- [ ] Test image uploads with various file sizes
- [ ] Verify Firebase Storage rules allow authenticated uploads

### Environment Variables to Set
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### Firebase Console Setup
1. **Create Collections** (if auto-creation disabled):
   - users
   - products
   - market_listings
   - tips
   - orders
   - conversations
   - notifications
   - reports

2. **Enable Services**:
   - ✅ Firestore Database (already configured)
   - ✅ Cloud Storage (already configured)
   - ✅ Authentication (Email/Password)

3. **Deploy Security Rules**:
   ```bash
   firebase deploy --only firestore:rules
   ```

4. **Set Storage Limits** (Firebase Console → Storage → Rules):
   - Max file size: 10MB
   - Max daily bandwidth: Adjust to your needs

### Production Deploy (Vercel)
```bash
# Push to GitHub
git add .
git commit -m "Add Firebase backend & approval workflow"
git push origin main

# Vercel auto-deploys from main
# Set environment variables in Vercel dashboard
```

---

## 📱 TESTING WORKFLOWS

### Test 1: Product Approval Workflow
1. Create farmer account
2. Submit a product with image
3. Verify it's NOT visible on home page
4. Log in as admin
5. Go to `/admin/approvals`
6. Approve product
7. Verify farmer gets notification
8. Verify product now visible on home page

### Test 2: Order Creation & Status Updates
1. Create buyer account
2. Create farmer account with a product (pre-approved for testing)
3. Buyer clicks "Encomendar"
4. Fill order form with quantity, address, payment method
5. Submit order
6. Farmer receives order notification
7. Farmer views `/conta/vendas`
8. Farmer updates order status to "confirmed" → "shipped" → "delivered"
9. Buyer sees status updates in `/conta/encomendas`

### Test 3: Chat System
1. From approved product page, buyer clicks "Contactar Agricultor"
2. Chat window opens
3. Exchange messages
4. Verify messages are real-time (use `listenToMessages` for live updates)
5. Verify unread count badge appears correctly

### Test 4: Image Upload
1. Product submission with image
2. Verify image appears in approvals panel
3. Verify correct size/dimensions
4. Check Firebase Storage console for uploaded files

---

## 🔍 MONITORING & DEBUGGING

### Common Issues & Solutions

**Issue**: Product not showing in approval panel
```
Solution: Check Firestore → products collection → status field
Ensure status is "pending" (case-sensitive)
```

**Issue**: Chat messages not appearing real-time
```
Solution: Verify onSnapshot listener is subscribed
Check browser console for Firebase errors
Verify conversation exists in Firestore
```

**Issue**: Images not uploading
```
Solution: Check Firebase Storage rules
Verify file size < 10MB
Check browser console for storage errors
Verify user is authenticated
```

**Issue**: Notifications not arriving
```
Solution: Verify notification document created in Firestore
Check user ID is correct
Verify notification listener is subscribed
Check /notifications collection permissions
```

---

## 📞 API ENDPOINTS (Future Additions)

When implementing payment gateway, create these endpoints:

```typescript
// pages/api/payments/momo-request.ts
// POST: { amount, phone, reference }
// Response: { qr_code, session_id }

// pages/api/payments/momo-callback.ts
// POST: Webhook from M-Pesa
// Action: Update order.paymentStatus to "paid"

// pages/api/notifications/send-email.ts
// POST: { userId, type, message }
// Action: Send transactional email
```

---

## 🎯 NEXT STEPS

1. **Integrate Payment Gateway** (M-Pesa/e-Mola)
   - Create `/api/payments/*` endpoints
   - Update order creation with payment link
   - Add payment status webhook handler

2. **Add Email Notifications**
   - Use SendGrid or similar
   - Send order confirmation to farmer
   - Send rejection reason to farmer

3. **Analytics Dashboard**
   - Chart orders over time
   - Track product categories
   - User growth metrics
   - Revenue by farmer/product

4. **Mobile App** (Optional)
   - React Native version
   - Share Firestore layer
   - Push notifications via FCM

---

## 📖 DOCUMENTATION LINKS

- [Firebase Console](https://console.firebase.google.com)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/start)
- [Firebase Storage](https://firebase.google.com/docs/storage)
- [Next.js Deployment](https://vercel.com/docs)

---

**Last Updated**: $(date)
**Project**: AgroMoz Agricultural Marketplace
**Version**: 1.0.0
