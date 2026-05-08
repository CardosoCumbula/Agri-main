# 🚀 CMS Quick Start - 5 Minutes

## Step 1️⃣: Create Admin Credentials

Create `.env.local` in your project root:

```bash
NEXT_PUBLIC_ADMIN_EMAILS=your-email@example.com
```

## Step 2️⃣: Add User to Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/) → Your Project
2. **Authentication** → **Users**
3. **Create user** with email: `your-email@example.com`
4. Set a strong password

## Step 3️⃣: Update Firestore Rules

1. Go to **Firestore Database** → **Rules**
2. Update the admin emails list:

```
function isAdmin() {
  return isAuthenticated() && (
    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin' ||
    (request.auth.token.email_verified == true && request.auth.token.email in [
      "your-email@example.com"
    ])
  );
}
```

3. Click **Publish**

## Step 4️⃣: Restart Dev Server

```bash
npm run dev
```

## Step 5️⃣: Login & Start Managing

1. Visit: `http://localhost:3000/admin/login`
2. Enter your email and password
3. Click **Login**
4. Manage your products! 🎉

---

## 📍 Admin Pages

| Page | URL | Purpose |
|------|-----|---------|
| **Products** | `/admin/products` | Create, edit, delete products |
| **Analytics** | `/admin/analytics` | View statistics & insights |
| **Settings** | `/admin/settings` | Configuration & setup guide |
| **Login** | `/admin/login` | Admin authentication |

---

## ✨ What You Can Do

- ✅ Add new products with images, prices, categories
- ✅ Edit existing products
- ✅ Delete products
- ✅ Search and filter products
- ✅ View analytics and statistics
- ✅ All data saved to Firestore automatically

---

## 🆘 Common Issues

**Can't login?**
- Email must be in `.env.local` `NEXT_PUBLIC_ADMIN_EMAILS`
- Restart dev server after changing `.env.local`
- User must exist in Firebase Authentication

**Products not showing?**
- Check Firestore has a `products` collection
- Verify read permissions in Firestore rules

**Can't create products?**
- Verify your email is in admin list
- Check Firestore rules allow `create` for your email

---

**Ready?** Start at `/admin/login` 🚀
