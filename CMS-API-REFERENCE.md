# CMS API Reference

This guide documents all the CMS functions and components available for product management.

## 🔧 Firebase Operations

All CRUD operations are available in `lib/admin/firebaseOperations.ts`

### Types

```typescript
interface Product {
  id?: string;
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  imageUrl: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
```

### Functions

#### Add Product
```typescript
await addProduct({
  title: "Organic Tomatoes",
  description: "Fresh, locally grown tomatoes",
  price: 25.99,
  category: "Vegetables",
  location: "Farm XYZ",
  imageUrl: "https://example.com/tomato.jpg"
});
```

#### Update Product
```typescript
await updateProduct(productId, {
  title: "Organic Tomatoes - Fresh",
  price: 29.99
});
```

#### Delete Product
```typescript
await deleteProduct(productId);
```

#### Get All Products
```typescript
const products = await getAllProducts();
```

#### Get Products by Category
```typescript
const vegetables = await getProductsByCategory("Vegetables");
```

#### Delete Multiple Products
```typescript
await deleteMultipleProducts([id1, id2, id3]);
```

#### Get Product Statistics
```typescript
const stats = await getProductStats();
// Returns: { totalProducts, categories, categoryBreakdown }
```

---

## 🪝 Admin Hooks

### useAdminAuth Hook

Manages admin authentication and authorization.

```typescript
import { useAdminAuth } from '@/hooks/admin/useAdminAuth';

export default function MyComponent() {
  const { user, isAdmin, loading } = useAdminAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!isAdmin) return <div>Not authorized</div>;
  
  return <div>Welcome, {user?.email}</div>;
}
```

**Returns:**
- `user`: Firebase User object or null
- `isAdmin`: Boolean indicating if user is admin
- `loading`: Boolean indicating auth state loading

---

## 🎨 Admin Components

### AdminSidebar

Navigation sidebar with menu items.

```typescript
import { AdminSidebar } from '@/components/admin/AdminSidebar';

<AdminSidebar 
  isOpen={true}
  onClose={() => setSidebarOpen(false)}
/>
```

**Props:**
- `isOpen`: Boolean - sidebar visibility
- `onClose`: Callback - triggered when sidebar should close

---

### ProductForm

Form for creating/editing products with validation.

```typescript
import { ProductForm } from '@/components/admin/ProductForm';

<ProductForm
  product={editingProduct}
  categories={['Vegetables', 'Fruits', 'Dairy']}
  onSubmit={handleSave}
  onCancel={handleCancel}
  isLoading={false}
/>
```

**Props:**
- `product`: Product object (for editing) or undefined (for creating)
- `categories`: Array of category strings
- `onSubmit`: Callback with form data
- `onCancel`: Callback to close form
- `isLoading`: Boolean - disable form while saving

---

### ProductsTable

Table displaying products with search and actions.

```typescript
import { ProductsTable } from '@/components/admin/ProductsTable';

<ProductsTable
  products={products}
  searchTerm={searchTerm}
  onSearchChange={setSearchTerm}
  onEdit={handleEdit}
  onDelete={handleDelete}
  isDeleting={false}
/>
```

**Props:**
- `products`: Array of Product objects
- `searchTerm`: String - current search filter
- `onSearchChange`: Callback with new search term
- `onEdit`: Callback with product to edit
- `onDelete`: Callback with product ID to delete
- `isDeleting`: Boolean - disable delete while processing

---

## 📄 Pages

### Admin Login Page
**Path:** `/admin/login`

Features:
- Email/password authentication
- Error handling
- Redirect to products on success

### Products Management Page
**Path:** `/admin/products`

Features:
- List all products in a table
- Search and filter
- Add new product form
- Edit existing products
- Delete products
- Real-time updates

### Analytics Page
**Path:** `/admin/analytics`

Features:
- Total products count
- Number of categories
- Average products per category
- Category breakdown with charts

### Settings Page
**Path:** `/admin/settings`

Features:
- Admin account information
- Setup guide
- Firestore rules guide
- Feature list

---

## 🔑 Environment Variables

### Required Variables

```env
NEXT_PUBLIC_ADMIN_EMAILS=email1@example.com,email2@example.com
```

**Note:** These must be comma-separated without spaces between emails.

---

## 🔐 Security

### Authentication Flow

1. User enters email/password on `/admin/login`
2. Firebase authenticates the user
3. System checks if email is in `NEXT_PUBLIC_ADMIN_EMAILS`
4. If authorized, user is redirected to `/admin/products`
5. If not authorized, user is redirected to `/`

### Authorization

- Only emails in `NEXT_PUBLIC_ADMIN_EMAILS` can access admin pages
- Firestore rules restrict database write operations to admin emails
- All operations are verified server-side via Firestore security rules

---

## 🚀 Usage Examples

### Complete Product Management Flow

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useAdminAuth } from '@/hooks/admin/useAdminAuth';
import {
  addProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
} from '@/lib/admin/firebaseOperations';
import { ProductForm } from '@/components/admin/ProductForm';

export default function AdminPage() {
  const { isAdmin } = useAdminAuth();
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await getAllProducts();
    setProducts(data);
  };

  const handleSaveProduct = async (formData) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, formData);
    } else {
      await addProduct(formData);
    }
    loadProducts();
    setShowForm(false);
  };

  const handleDeleteProduct = async (id) => {
    if (confirm('Delete this product?')) {
      await deleteProduct(id);
      loadProducts();
    }
  };

  if (!isAdmin) return <div>Not authorized</div>;

  return (
    <div>
      {showForm && (
        <ProductForm
          product={editingProduct}
          categories={['Vegetables', 'Fruits']}
          onSubmit={handleSaveProduct}
          onCancel={() => setShowForm(false)}
          isLoading={false}
        />
      )}
      
      {/* Display products */}
    </div>
  );
}
```

---

## 📚 File Structure Reference

```
lib/admin/
  ├── firebaseOperations.ts        # Database operations
  
components/admin/
  ├── AdminSidebar.tsx              # Navigation
  ├── ProductForm.tsx               # Form component
  └── ProductsTable.tsx             # Table component

hooks/admin/
  └── useAdminAuth.ts               # Auth hook

app/admin/
  ├── page.tsx                      # Redirect
  ├── layout.tsx                    # Admin layout
  ├── login/
  │   └── page.tsx                  # Login page
  ├── products/
  │   └── page.tsx                  # Products page
  ├── analytics/
  │   └── page.tsx                  # Analytics page
  └── settings/
      └── page.tsx                  # Settings page
```

---

## 🛠️ Extending the CMS

### Add New Product Field

1. Update `Product` interface in `firebaseOperations.ts`:
   ```typescript
   interface Product {
     // ... existing fields
     newField: string;
   }
   ```

2. Add to form validation in `ProductForm.tsx`:
   ```typescript
   const productSchema = z.object({
     // ... existing fields
     newField: z.string().min(1, 'New field is required'),
   });
   ```

3. Add input field in form JSX

### Add New Admin Page

1. Create new file: `app/admin/new-page/page.tsx`
2. Wrap with `useAdminAuth()` hook
3. Add menu item to `AdminSidebar.tsx`

---

**Questions?** See CMS-SETUP.md for detailed guides.
