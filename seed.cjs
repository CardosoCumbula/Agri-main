const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://dnntumdrzpapurtrypwv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRubnR1bWRyenBhcHVydHJ5cHd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2MDA0MTcsImV4cCI6MjA5NjE3NjQxN30.U1DgX-vbtDWq56HevJlR5Vo2a5N38JSrYgjy4fexdbo'
);

async function seed() {
  console.log('Seeding Supabase...');

  const products = [
    { name: 'Tomate Fresco', category: 'Vegetais', price: 125.50, unit: 'kg', quantity: 500, farmer_name: 'Joao Mboa', province: 'Gaza', image_url: 'https://images.unsplash.com/photo-1592921870789-04563d55041c?w=500&h=500&fit=crop', status: 'approved' },
    { name: 'Milho Amarelo', category: 'Cereais', price: 45.00, unit: 'kg', quantity: 2000, farmer_name: 'Maria Silva', province: 'Sofala', image_url: 'https://images.unsplash.com/photo-1601593346740-925612772716?w=500&h=500&fit=crop', status: 'approved' },
    { name: 'Feijao Preto', category: 'Legumes', price: 280.00, unit: 'kg', quantity: 300, farmer_name: 'Jose Chirindza', province: 'Inhambane', image_url: 'https://images.unsplash.com/photo-1585390932829-4793f5578d35?w=500&h=500&fit=crop', status: 'approved' },
    { name: 'Cebola Roxa', category: 'Vegetais', price: 95.00, unit: 'kg', quantity: 800, farmer_name: 'Antonio Nkosi', province: 'Tete', image_url: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=500&h=500&fit=crop', status: 'approved' },
    { name: 'Mandioca Fresca', category: 'Insumos', price: 35.50, unit: 'kg', quantity: 1500, farmer_name: 'Francisca Mthembu', province: 'Zambezia', image_url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad576?w=500&h=500&fit=crop', status: 'approved' },
    { name: 'Arroz Branco', category: 'Cereais', price: 125.00, unit: 'kg', quantity: 1200, farmer_name: 'Pedro Tembe', province: 'Maputo', image_url: 'https://images.unsplash.com/photo-1586985289688-cacf2b32b55f?w=500&h=500&fit=crop', status: 'approved' },
    { name: 'Soja Premium', category: 'Oleaginosas', price: 350.00, unit: 'kg', quantity: 600, farmer_name: 'Rosa Pethwa', province: 'Manica', image_url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad576?w=500&h=500&fit=crop', status: 'approved' },
    { name: 'Amendoim Descascado', category: 'Oleaginosas', price: 280.00, unit: 'kg', quantity: 400, farmer_name: 'Manuel Chidamoio', province: 'Cabo Delgado', image_url: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&h=500&fit=crop', status: 'approved' },
  ];

  const tips = [
    { title: 'Como Prevenir a Broca-do-Milho', category: 'Pragas', read_time: '5', summary: 'Tecnicas simples e eficazes para proteger sua lavoura contra a broca-do-milho.', image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&h=500&fit=crop' },
    { title: 'Irrigacao Eficiente em Clima Seco', category: 'Irrigacao', read_time: '7', summary: 'Conserve agua enquanto maximiza o rendimento das suas culturas.', image_url: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=500&h=500&fit=crop' },
    { title: 'Selecao e Tratamento de Sementes', category: 'Sementes', read_time: '6', summary: 'Escolha as melhores sementes e prepare-as adequadamente para o plantio.', image_url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad576?w=500&h=500&fit=crop' },
    { title: 'Rotacao de Culturas - Boas Praticas', category: 'Boas Praticas', read_time: '8', summary: 'Mantenha o solo saudavel atraves de rotacao de culturas estrategica.', image_url: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&h=500&fit=crop' },
  ];

  const market_listings = [
    { product_name: 'Tomate Fresco', buyer_name: 'Restaurante Mahala', buyer_type: 'Restaurante', location: 'Maputo', price_per_unit: 150.00, unit: 'kg', quantity_needed: 200, frequency: 'Semanal', image_url: 'https://images.unsplash.com/photo-1592921870789-04563d55041c?w=500&h=500&fit=crop', status: 'approved' },
    { product_name: 'Milho Amarelo', buyer_name: 'Moageiro Industrial', buyer_type: 'Processador', location: 'Beira', price_per_unit: 50.00, unit: 'kg', quantity_needed: 5000, frequency: 'Mensal', image_url: 'https://images.unsplash.com/photo-1601593346740-925612772716?w=500&h=500&fit=crop', status: 'approved' },
    { product_name: 'Feijao Preto', buyer_name: 'Supermercado Panda', buyer_type: 'Retalho', location: 'Maputo', price_per_unit: 320.00, unit: 'kg', quantity_needed: 500, frequency: 'Quinzenal', image_url: 'https://images.unsplash.com/photo-1585390932829-4793f5578d35?w=500&h=500&fit=crop', status: 'approved' },
    { product_name: 'Cebola', buyer_name: 'Distribuidora Central', buyer_type: 'Distribuidor', location: 'Matola', price_per_unit: 80.00, unit: 'kg', quantity_needed: 1000, frequency: 'Semanal', image_url: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=500&h=500&fit=crop', status: 'approved' },
  ];

  const { error: pe } = await supabase.from('products').insert(products);
  if (pe) console.error('Products error:', pe.message); else console.log('✔ ' + products.length + ' products added');

  const { error: te } = await supabase.from('tips').insert(tips);
  if (te) console.error('Tips error:', te.message); else console.log('✔ ' + tips.length + ' tips added');

  const { error: me } = await supabase.from('market_listings').insert(market_listings);
  if (me) console.error('Market error:', me.message); else console.log('✔ ' + market_listings.length + ' listings added');

  console.log('Seed complete!');
  process.exit(0);
}
seed().catch(e => { console.error(e); process.exit(1); });
