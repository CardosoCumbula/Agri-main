import * as admin from 'firebase-admin';
import * as path from 'path';

// Initialize Firebase Admin
const serviceAccountPath = path.join(process.cwd(), 'firebase-key.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountPath),
});

const db = admin.firestore();

interface SeedData {
  products: any[];
  tips: any[];
  marketListings: any[];
  users: any[];
}

const MOZAMBICAN_PRODUCTS: SeedData['products'] = [
  {
    name: 'Tomate Fresco',
    category: 'Vegetais',
    price: 125.50,
    unit: 'kg',
    quantity: 500,
    farmerName: 'João Mboa',
    province: 'Gaza',
    imageUrl: 'https://images.unsplash.com/photo-1592921870789-04563d55041c?w=500&h=500&fit=crop',
    status: 'approved',
    rejectionReason: null,
  },
  {
    name: 'Milho Amarelo',
    category: 'Cereais',
    price: 45.00,
    unit: 'kg',
    quantity: 2000,
    farmerName: 'Maria Silva',
    province: 'Sofala',
    imageUrl: 'https://images.unsplash.com/photo-1601593346740-925612772716?w=500&h=500&fit=crop',
    status: 'approved',
    rejectionReason: null,
  },
  {
    name: 'Feijão Preto',
    category: 'Legumes',
    price: 280.00,
    unit: 'kg',
    quantity: 300,
    farmerName: 'José Chirindza',
    province: 'Inhambane',
    imageUrl: 'https://images.unsplash.com/photo-1585390932829-4793f5578d35?w=500&h=500&fit=crop',
    status: 'approved',
    rejectionReason: null,
  },
  {
    name: 'Cebola Roxa',
    category: 'Vegetais',
    price: 95.00,
    unit: 'kg',
    quantity: 800,
    farmerName: 'António Nkosi',
    province: 'Tete',
    imageUrl: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=500&h=500&fit=crop',
    status: 'approved',
    rejectionReason: null,
  },
  {
    name: 'Mandioca Fresca',
    category: 'Insumos',
    price: 35.50,
    unit: 'kg',
    quantity: 1500,
    farmerName: 'Francisca Mthembu',
    province: 'Zambézia',
    imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad576?w=500&h=500&fit=crop',
    status: 'approved',
    rejectionReason: null,
  },
  {
    name: 'Arroz Branco',
    category: 'Cereais',
    price: 125.00,
    unit: 'kg',
    quantity: 1200,
    farmerName: 'Pedro Tembe',
    province: 'Maputo',
    imageUrl: 'https://images.unsplash.com/photo-1586985289688-cacf2b32b55f?w=500&h=500&fit=crop',
    status: 'approved',
    rejectionReason: null,
  },
  {
    name: 'Soja Premium',
    category: 'Oleaginosas',
    price: 350.00,
    unit: 'kg',
    quantity: 600,
    farmerName: 'Rosa Pethwa',
    province: 'Manica',
    imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad576?w=500&h=500&fit=crop',
    status: 'approved',
    rejectionReason: null,
  },
  {
    name: 'Amendoim Descascado',
    category: 'Oleaginosas',
    price: 280.00,
    unit: 'kg',
    quantity: 400,
    farmerName: 'Manuel Chidamoio',
    province: 'Cabo Delgado',
    imageUrl: 'https://images.unsplash.com/photo-1599599810694-2d5f4f41d8f3?w=500&h=500&fit=crop',
    status: 'approved',
    rejectionReason: null,
  },
];

const TIPS: SeedData['tips'] = [
  {
    title: 'Como Prevenir a Broca-do-Milho',
    category: 'Pragas',
    readTime: 5,
    summary: 'Técnicas simples e eficazes para proteger sua lavoura contra a broca-do-milho.',
    content:
      'A broca-do-milho é uma das pragas mais destrutivas. Use feromônios, remova plantas infectadas e alterne culturas anualmente.',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&h=500&fit=crop',
    publishedAt: new Date('2024-05-15'),
  },
  {
    title: 'Irrigação Eficiente em Clima Seco',
    category: 'Irrigação',
    readTime: 7,
    summary: 'Conserve água enquanto maximiza o rendimento das suas culturas.',
    content:
      'Use gotejamento localizado e mulch. Irrigue no início da manhã ou final da tarde para minimizar evaporação.',
    imageUrl: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=500&h=500&fit=crop',
    publishedAt: new Date('2024-05-20'),
  },
  {
    title: 'Seleção e Tratamento de Sementes',
    category: 'Sementes',
    readTime: 6,
    summary: 'Escolha as melhores sementes e prepare-as adequadamente para o plantio.',
    content:
      'Escolha sementes de variedades localmente adaptadas. Trate com fungicida antes de plantar para prevenir doenças.',
    imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad576?w=500&h=500&fit=crop',
    publishedAt: new Date('2024-05-25'),
  },
  {
    title: 'Rotação de Culturas - Boas Práticas',
    category: 'Boas Práticas',
    readTime: 8,
    summary: 'Mantenha o solo saudável através de rotação de culturas estratégica.',
    content:
      'Alterne legumes, cereais e oleaginosas. Isso reduz pragas e melhora a fertilidade do solo naturalmente.',
    imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&h=500&fit=crop',
    publishedAt: new Date('2024-06-01'),
  },
];

const MARKET_LISTINGS: SeedData['marketListings'] = [
  {
    productName: 'Tomate Fresco',
    buyerName: 'Restaurante Mahala',
    buyerType: 'Restaurante',
    location: 'Maputo',
    pricePerUnit: 150.00,
    unit: 'kg',
    quantityNeeded: 200,
    frequency: 'Semanal',
    imageUrl: 'https://images.unsplash.com/photo-1592921870789-04563d55041c?w=500&h=500&fit=crop',
    status: 'approved',
    rejectionReason: null,
    postedAt: new Date('2024-05-10'),
  },
  {
    productName: 'Milho Amarelo',
    buyerName: 'Moageiro Industrial',
    buyerType: 'Processador',
    location: 'Beira',
    pricePerUnit: 50.00,
    unit: 'kg',
    quantityNeeded: 5000,
    frequency: 'Mensal',
    imageUrl: 'https://images.unsplash.com/photo-1601593346740-925612772716?w=500&h=500&fit=crop',
    status: 'approved',
    rejectionReason: null,
    postedAt: new Date('2024-05-12'),
  },
  {
    productName: 'Feijão Preto',
    buyerName: 'Supermercado Panda',
    buyerType: 'Retalho',
    location: 'Lourenço Marques',
    pricePerUnit: 320.00,
    unit: 'kg',
    quantityNeeded: 500,
    frequency: 'Quinzenal',
    imageUrl: 'https://images.unsplash.com/photo-1585390932829-4793f5578d35?w=500&h=500&fit=crop',
    status: 'approved',
    rejectionReason: null,
    postedAt: new Date('2024-05-15'),
  },
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting Firestore database seed...\n');

    // Seed Products
    console.log('📦 Seeding products...');
    const productsRef = db.collection('products');
    for (const product of MOZAMBICAN_PRODUCTS) {
      const docRef = productsRef.doc();
      await docRef.set({
        ...product,
        createdAt: admin.firestore.Timestamp.now(),
      });
      console.log(`  ✓ Added: ${product.name}`);
    }

    // Seed Tips
    console.log('\n💡 Seeding tips...');
    const tipsRef = db.collection('tips');
    for (const tip of TIPS) {
      const docRef = tipsRef.doc();
      await docRef.set({
        ...tip,
        publishedAt: admin.firestore.Timestamp.fromDate(tip.publishedAt),
      });
      console.log(`  ✓ Added: ${tip.title}`);
    }

    // Seed Market Listings
    console.log('\n🛒 Seeding market listings...');
    const marketRef = db.collection('market_listings');
    for (const listing of MARKET_LISTINGS) {
      const docRef = marketRef.doc();
      await docRef.set({
        ...listing,
        postedAt: admin.firestore.Timestamp.fromDate(listing.postedAt),
      });
      console.log(`  ✓ Added: ${listing.productName} - ${listing.buyerName}`);
    }

    console.log(
      '\n✅ Database seed complete!\n' +
        `   - ${MOZAMBICAN_PRODUCTS.length} products added\n` +
        `   - ${TIPS.length} tips added\n` +
        `   - ${MARKET_LISTINGS.length} market listings added\n`
    );

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
