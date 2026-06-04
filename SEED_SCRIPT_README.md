# Seed Script for AgroMoz Firebase Database

This script populates your Firestore database with realistic Mozambican agricultural data for development and testing.

## Prerequisites

1. **Firebase Admin SDK credentials** (JSON key file)
   - Go to Firebase Console → Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save as `firebase-key.json` in the project root

2. **Node.js with TypeScript support** 
   ```bash
   npm install -g ts-node
   ```

3. **Install dependencies** (if not already done)
   ```bash
   npm install firebase-admin
   ```

## Data Included

The script seeds:

- **8 Produtos** - Realistic Mozambican crops with real farmer names and provinces
  - Tomate, Milho, Feijão, Cebola, Mandioca, Arroz, Soja, Amendoim
  - All with status: "approved" for testing
  - Real Unsplash images for each product

- **4 Dicas** - Agricultural tips covering:
  - Pragas (Pests)
  - Irrigação (Irrigation)
  - Sementes (Seeds)
  - Boas Práticas (Best Practices)

- **3 Solicitações de Mercado** - Buyer procurement requests
  - Restaurantes, Processadores, Retalho
  - All with status: "approved"

## Usage

### Run the seed script:
```bash
npx ts-node scripts/seedFirestore.ts
```

### Expected output:
```
🌱 Starting Firestore database seed...

📦 Seeding products...
  ✓ Added: Tomate Fresco
  ✓ Added: Milho Amarelo
  ...

💡 Seeding tips...
  ✓ Added: Como Prevenir a Broca-do-Milho
  ...

🛒 Seeding market listings...
  ✓ Added: Tomate Fresco - Restaurante Mahala
  ...

✅ Database seed complete!
   - 8 products added
   - 4 tips added
   - 3 market listings added
```

## Notes

- All seeded products and listings have status: **"approved"** so they appear on public pages immediately
- Images use Unsplash URLs (publicly available)
- You can add more data to the arrays in `scripts/seedFirestore.ts`
- After seeding, you can test creating new products/listings as they will start with status: "pending"

## Troubleshooting

**"firebase-key.json not found"**
- Download the Firebase Admin SDK key from Firebase Console
- Place it in the root of your project

**"Cannot find module 'firebase-admin'"**
- Run: `npm install firebase-admin`

**"Module not found: ts-node"**
- Run: `npm install -g ts-node`

**"Cannot find module 'typescript'"**
- Run: `npm install --save-dev typescript`

## Next Steps

After seeding:
1. Test the home page - should show featured products
2. Test the Mercado page - should show buyer requests
3. Test the Dicas page - should show all tips with filtering
4. Create a new product as a farmer - should show "pending" status
5. Visit admin panel to approve the new product
