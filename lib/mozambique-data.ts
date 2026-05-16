// Mozambique agricultural data and images
export const mozambiqueRegions = [
  'Maputo',
  'Gaza',
  'Inhambane',
  'Sofala',
  'Manica',
  'Tete',
  'Zambezia',
  'Nampula',
  'Niassa',
  'Cabo Delgado',
];

export const categoryImages: Record<string, string> = {
  'Vegetais': 'https://images.unsplash.com/photo-1464226184679-280bd6b0b3a5?w=400&h=400&fit=crop',
  'Grãos': 'https://images.unsplash.com/photo-1629334599878-8b7f5df45c85?w=400&h=400&fit=crop',
  'Frutas': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop',
  'Insumos': 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=400&fit=crop',
  'Cereais': 'https://images.unsplash.com/photo-1592925647508-3c2f57d55d3a?w=400&h=400&fit=crop',
  'Legumes': 'https://images.unsplash.com/photo-1511689915661-c52646073886?w=400&h=400&fit=crop',
  'Oleaginosas': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
  'Outros': 'https://images.unsplash.com/photo-1625246333195-78d9c38ad576?w=400&h=400&fit=crop',
};

// Product-specific images for high fidelity with Mozambique context
export const productImages: Record<string, string> = {
  'Tomate Fresco Premium': 'https://images.unsplash.com/photo-1592924357228-91a4daadcccf?w=400&h=400&fit=crop',
  'Alface Crispla': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
  'Milho Branco (Grão)': 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=400&fit=crop',
  'Milho Amarelo': 'https://images.unsplash.com/photo-1585518419759-96f11db64055?w=400&h=400&fit=crop',
  'Mangas Alfonce': 'https://images.unsplash.com/photo-1585075694002-53b92f63b340?w=400&h=400&fit=crop',
  'Feijão Nhemba': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
  'Cebola Doce': 'https://images.unsplash.com/photo-1585518419759-96f11db64055?w=400&h=400&fit=crop',
  'Cebola Roxa': 'https://images.unsplash.com/photo-1563621033406-be7bc20a26cb?w=400&h=400&fit=crop',
  'Amendoim (Grão)': 'https://images.unsplash.com/photo-1585094032761-5ce08e9ba047?w=400&h=400&fit=crop',
  'Banana Prata': 'https://images.unsplash.com/photo-1596195694269-f5033e338d1b?w=400&h=400&fit=crop',
  'Abóbora Local': 'https://images.unsplash.com/photo-1605986458413-ea74ceaf6914?w=400&h=400&fit=crop',
  'Arroz Branco': 'https://images.unsplash.com/photo-1586985289688-cacf2b32b55f?w=400&h=400&fit=crop',
  'Arroz Integral': 'https://images.unsplash.com/photo-1540554677795-f82f3cda5c47?w=400&h=400&fit=crop',
  'Trigo Integral': 'https://images.unsplash.com/photo-1599599810694-b5ac4dd26626?w=400&h=400&fit=crop',
  'Sorgo': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=400&fit=crop',
  'Soja Premium': 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=400&h=400&fit=crop',
  'Girassol Óleo': 'https://images.unsplash.com/photo-1600721394637-beee27c7b227?w=400&h=400&fit=crop',
  'Milho para Ração': 'https://images.unsplash.com/photo-1629707618435-0ecd28629bb0?w=400&h=400&fit=crop',
  'Couve Folha': 'https://images.unsplash.com/photo-1520763185298-1b434c919eba?w=400&h=400&fit=crop',
  'Espinafre Fresco': 'https://images.unsplash.com/photo-1585518419759-96f11db64055?w=400&h=400&fit=crop',
  'Batata Doce': 'https://images.unsplash.com/photo-1599599810404-be961c90cf23?w=400&h=400&fit=crop',
  'Batata Inglesa': 'https://images.unsplash.com/photo-1596804392200-667ee3fde34d?w=400&h=400&fit=crop',
  'Cenoura Laranja': 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=400&fit=crop',
  'Moranga': 'https://images.unsplash.com/photo-1605986458413-ea74ceaf6914?w=400&h=400&fit=crop',
  'Melancia': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop',
  'Papaia': 'https://images.unsplash.com/photo-1585518419759-96f11db64055?w=400&h=400&fit=crop',
  'Pimenta Malagueta': 'https://images.unsplash.com/photo-1599599810694-b5ac4dd26626?w=400&h=400&fit=crop',
  'Pimento Vermelho': 'https://images.unsplash.com/photo-1563181286-d3fee7d55364?w=400&h=400&fit=crop',
};

export const sampleProducts = [
  {
    title: 'Tomate Fresco Premium',
    description: 'Tomates frescos cultivados em Maputo, perfeitos para saladas e molhos',
    price: 45.50,
    category: 'Vegetais',
    location: 'Maputo',
    contact: '+258 82 123 4567',
    type: 'sell' as const,
  },
  {
    title: 'Alface Crispla',
    description: 'Alface fresca e crocante de Manica, ideal para saladas',
    price: 28.00,
    category: 'Vegetais',
    location: 'Manica',
    contact: '+258 82 111 1111',
    type: 'sell' as const,
  },
  {
    title: 'Milho Branco (Grão)',
    description: 'Milho de alta qualidade produzido em Gaza, ideal para moagem',
    price: 120.00,
    category: 'Cereais',
    location: 'Gaza',
    contact: '+258 82 234 5678',
    type: 'sell' as const,
  },
  {
    title: 'Milho Amarelo',
    description: 'Milho amarelo nutritivo de Sofala, ótimo para alimentação animal',
    price: 115.00,
    category: 'Cereais',
    location: 'Sofala',
    contact: '+258 82 222 2222',
    type: 'sell' as const,
  },
  {
    title: 'Mangas Alfonce',
    description: 'Mangas doces e suculentas da colheita de Inhambane',
    price: 80.00,
    category: 'Frutas',
    location: 'Inhambane',
    contact: '+258 82 345 6789',
    type: 'sell' as const,
  },
  {
    title: 'Feijão Nhemba',
    description: 'Feijão tradicional de Moçambique, cultivado em Sofala',
    price: 90.00,
    category: 'Legumes',
    location: 'Sofala',
    contact: '+258 82 456 7890',
    type: 'sell' as const,
  },
  {
    title: 'Cebola Doce',
    description: 'Cebolas frescas e saudáveis de Manica',
    price: 35.75,
    category: 'Vegetais',
    location: 'Manica',
    contact: '+258 82 567 8901',
    type: 'sell' as const,
  },
  {
    title: 'Cebola Roxa',
    description: 'Cebola roxa de qualidade premium de Tete',
    price: 42.00,
    category: 'Vegetais',
    location: 'Tete',
    contact: '+258 82 333 3333',
    type: 'sell' as const,
  },
  {
    title: 'Amendoim (Grão)',
    description: 'Amendoim de qualidade premium de Tete',
    price: 150.00,
    category: 'Oleaginosas',
    location: 'Tete',
    contact: '+258 82 678 9012',
    type: 'sell' as const,
  },
  {
    title: 'Soja Premium',
    description: 'Soja de alta qualidade para moagem e processamento, cultivada em Manica',
    price: 175.00,
    category: 'Oleaginosas',
    location: 'Manica',
    contact: '+258 82 444 4444',
    type: 'sell' as const,
  },
  {
    title: 'Girassol Óleo',
    description: 'Girassol premium para extração de óleo, produzido em Gaza',
    price: 160.00,
    category: 'Oleaginosas',
    location: 'Gaza',
    contact: '+258 82 555 5555',
    type: 'sell' as const,
  },
  {
    title: 'Banana Prata',
    description: 'Bananas frescas cultivadas em Zambezia',
    price: 55.00,
    category: 'Frutas',
    location: 'Zambezia',
    contact: '+258 82 789 0123',
    type: 'sell' as const,
  },
  {
    title: 'Abóbora Local',
    description: 'Abóboras nutritivas de Nampula',
    price: 28.50,
    category: 'Vegetais',
    location: 'Nampula',
    contact: '+258 82 890 1234',
    type: 'sell' as const,
  },
  {
    title: 'Arroz Branco',
    description: 'Arroz branco de grão longo, cultivado em Inhambane',
    price: 95.00,
    category: 'Cereais',
    location: 'Inhambane',
    contact: '+258 82 666 6666',
    type: 'sell' as const,
  },
  {
    title: 'Arroz Integral',
    description: 'Arroz integral nutritivo produzido em Zambezia',
    price: 110.00,
    category: 'Cereais',
    location: 'Zambezia',
    contact: '+258 82 777 7777',
    type: 'sell' as const,
  },
  {
    title: 'Trigo Integral',
    description: 'Trigo integral premium de Tete para moagem',
    price: 135.00,
    category: 'Cereais',
    location: 'Tete',
    contact: '+258 82 888 8888',
    type: 'sell' as const,
  },
  {
    title: 'Sorgo',
    description: 'Sorgo nutritivo de Nampula, resistente à seca',
    price: 100.00,
    category: 'Cereais',
    location: 'Nampula',
    contact: '+258 82 999 9999',
    type: 'sell' as const,
  },
  {
    title: 'Couve Folha',
    description: 'Couve folha fresca de Manica, rica em nutrientes',
    price: 32.00,
    category: 'Vegetais',
    location: 'Manica',
    contact: '+258 82 101 0101',
    type: 'sell' as const,
  },
  {
    title: 'Espinafre Fresco',
    description: 'Espinafre fresco de Sofala, perfeito para saladas',
    price: 38.50,
    category: 'Vegetais',
    location: 'Sofala',
    contact: '+258 82 121 2121',
    type: 'sell' as const,
  },
  {
    title: 'Batata Doce',
    description: 'Batata doce nutritiva de Gaza',
    price: 45.00,
    category: 'Legumes',
    location: 'Gaza',
    contact: '+258 82 131 3131',
    type: 'sell' as const,
  },
  {
    title: 'Batata Inglesa',
    description: 'Batata inglesa de qualidade superior de Manica',
    price: 50.00,
    category: 'Vegetais',
    location: 'Manica',
    contact: '+258 82 141 4141',
    type: 'sell' as const,
  },
  {
    title: 'Cenoura Laranja',
    description: 'Cenoura fresca e doce de Maputo',
    price: 35.00,
    category: 'Vegetais',
    location: 'Maputo',
    contact: '+258 82 151 5151',
    type: 'sell' as const,
  },
  {
    title: 'Melancia',
    description: 'Melancia suculenta de Inhambane, doce e refrescante',
    price: 60.00,
    category: 'Frutas',
    location: 'Inhambane',
    contact: '+258 82 161 6161',
    type: 'sell' as const,
  },
  {
    title: 'Papaia',
    description: 'Papaia madura e doce de Zambezia',
    price: 70.00,
    category: 'Frutas',
    location: 'Zambezia',
    contact: '+258 82 171 7171',
    type: 'sell' as const,
  },
  {
    title: 'Pimenta Malagueta',
    description: 'Pimenta malagueta picante de Sofala',
    price: 85.00,
    category: 'Vegetais',
    location: 'Sofala',
    contact: '+258 82 181 8181',
    type: 'sell' as const,
  },
  {
    title: 'Pimento Vermelho',
    description: 'Pimento vermelho doce de Manica',
    price: 55.00,
    category: 'Vegetais',
    location: 'Manica',
    contact: '+258 82 191 9191',
    type: 'sell' as const,
  },
];

export const wikiContent = [
  {
    id: 1,
    title: 'Como combater a Lagarta do Funil do Milho',
    category: 'Pragas e Doenças',
    readTime: '5 min de leitura',
    description: 'Aprenda métodos naturais e químicos recomendados pelos serviços de extensão rural para proteger a sua plantação de milho.',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcccf?w=600&h=400&fit=crop',
    content: `
    A Lagarta do Funil do Milho (Spodoptera frugiperda) é uma praga séria em Moçambique que pode destruir plantações inteiras.
    
    ## Sinais de Infestação
    - Orifícios nas folhas
    - Excrementos nas axilas das folhas
    - Colheita comprometida
    
    ## Controle Natural
    - Use cultivares resistentes
    - Remova manualmente as larvas
    - Plante plantas repelentes
    
    ## Controle Químico
    - Inseticidas recomendados pelos extensionistas locais
    - Aplique conforme as instruções de segurança
    `,
  },
  {
    id: 2,
    title: 'Preparação da terra para a época chuvosa',
    category: 'Boas Práticas',
    readTime: '3 min',
    description: 'Veja como fazer a lavoura de conservação para reter mais água no solo e evitar a erosão.',
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop',
    content: `
    A preparação adequada do solo é fundamental para o sucesso agrícola em Moçambique.
    
    ## Técnicas de Conservação
    - Lavoura mínima
    - Mulching com resíduos de culturas
    - Terraceamento em encostas
    
    ## Benefícios
    - Retenção de água
    - Redução de erosão
    - Melhoria da fertilidade do solo
    `,
  },
  {
    id: 3,
    title: 'Sistema de rega gota-a-gota caseiro',
    category: 'Irrigação',
    readTime: '8 min de leitura',
    description: 'Passo-a-passo para montar um sistema de irrigação eficiente usando garrafas PET e materiais de baixo custo.',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad576?w=600&h=400&fit=crop',
    content: `
    Um sistema de irrigação eficiente pode aumentar significativamente sua produção.
    
    ## Materiais Necessários
    - Garrafas PET
    - Tubo de plástico
    - Agulhas ou furos pequenos
    - Bomba manual ou gravidade
    
    ## Instalação
    1. Prepare as garrafas com furos
    2. Conecte aos tubos
    3. Posicione no campo
    `,
  },
];

export const weatherData = [
  {
    region: 'Maputo',
    temperature: 28,
    condition: 'Parcialmente nublado',
    humidity: 65,
    rainfall: 20,
  },
  {
    region: 'Gaza',
    temperature: 26,
    condition: 'Céu limpo',
    humidity: 55,
    rainfall: 10,
  },
  {
    region: 'Inhambane',
    temperature: 27,
    condition: '40% prob. chuva',
    humidity: 70,
    rainfall: 40,
  },
  {
    region: 'Sofala',
    temperature: 25,
    condition: '60% prob. chuva',
    humidity: 75,
    rainfall: 60,
  },
];
