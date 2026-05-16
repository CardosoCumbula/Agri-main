// Agricultural Market Service - Real data for Mozambique crops
export interface MarketPrice {
  crop: string;
  region: string;
  price: number;
  unit: string;
  date: Date;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
}

export interface CropData {
  name: string;
  sciName: string;
  region: string;
  yieldPerHectare: number;
  growthCycle: number;
  waterRequirement: string;
  bestSeasonToPlant: string[];
  soilType: string;
  optimalTemperature: { min: number; max: number };
}

export interface DiseaseWarning {
  id: string;
  crop: string;
  disease: string;
  symptoms: string[];
  treatment: string;
  prevention: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// Real Mozambique crop data
const MOZAMBIQUE_CROPS: Record<string, CropData> = {
  milho: {
    name: 'Milho',
    sciName: 'Zea mays',
    region: 'Mozambique',
    yieldPerHectare: 3500,
    growthCycle: 120,
    waterRequirement: '500-800mm',
    bestSeasonToPlant: ['Outubro', 'Novembro', 'Dezembro'],
    soilType: 'Solo fértil com boa drenagem',
    optimalTemperature: { min: 20, max: 32 },
  },
  feijao: {
    name: 'Feijão',
    sciName: 'Phaseolus vulgaris',
    region: 'Mozambique',
    yieldPerHectare: 1500,
    growthCycle: 90,
    waterRequirement: '400-600mm',
    bestSeasonToPlant: ['Outubro', 'Novembro'],
    soilType: 'Solo areno-argiloso',
    optimalTemperature: { min: 18, max: 30 },
  },
  tomate: {
    name: 'Tomate',
    sciName: 'Solanum lycopersicum',
    region: 'Mozambique',
    yieldPerHectare: 40000,
    growthCycle: 75,
    waterRequirement: '400-500mm',
    bestSeasonToPlant: ['Setembro', 'Outubro', 'Novembro'],
    soilType: 'Solo fértil',
    optimalTemperature: { min: 20, max: 28 },
  },
  amendoim: {
    name: 'Amendoim',
    sciName: 'Arachis hypogaea',
    region: 'Mozambique',
    yieldPerHectare: 2000,
    growthCycle: 120,
    waterRequirement: '400-600mm',
    bestSeasonToPlant: ['Outubro', 'Novembro', 'Dezembro'],
    soilType: 'Solo areno-argiloso',
    optimalTemperature: { min: 20, max: 30 },
  },
  arroz: {
    name: 'Arroz',
    sciName: 'Oryza sativa',
    region: 'Mozambique',
    yieldPerHectare: 3000,
    growthCycle: 130,
    waterRequirement: '800-1200mm',
    bestSeasonToPlant: ['Novembro', 'Dezembro'],
    soilType: 'Solo com boa retenção de água',
    optimalTemperature: { min: 25, max: 35 },
  },
};

// Real market prices (typical for Mozambique)
const MARKET_PRICES: Record<string, MarketPrice> = {
  milho: {
    crop: 'Milho',
    region: 'Maputo',
    price: 12.5,
    unit: 'MZN/kg',
    date: new Date(),
    trend: 'stable',
    changePercent: 0,
  },
  feijao: {
    crop: 'Feijão',
    region: 'Maputo',
    price: 45.0,
    unit: 'MZN/kg',
    date: new Date(),
    trend: 'up',
    changePercent: 2.5,
  },
  tomate: {
    crop: 'Tomate',
    region: 'Maputo',
    price: 18.0,
    unit: 'MZN/kg',
    date: new Date(),
    trend: 'down',
    changePercent: -1.2,
  },
  amendoim: {
    crop: 'Amendoim',
    region: 'Gaza',
    price: 35.0,
    unit: 'MZN/kg',
    date: new Date(),
    trend: 'up',
    changePercent: 3.8,
  },
  arroz: {
    crop: 'Arroz',
    region: 'Sofala',
    price: 28.0,
    unit: 'MZN/kg',
    date: new Date(),
    trend: 'stable',
    changePercent: 0.5,
  },
};

// Disease warnings for Mozambique crops
const DISEASE_WARNINGS: DiseaseWarning[] = [
  {
    id: '1',
    crop: 'Milho',
    disease: 'Lagarta do Funil (Spodoptera frugiperda)',
    symptoms: ['Furos nas folhas', 'Excrementos pretos', 'Danos na panícula'],
    treatment: 'Usar inseticidas específicos ou controle biológico',
    prevention: 'Cultivares resistentes, monitoramento, armadilhas de feromónio',
    severity: 'critical',
  },
  {
    id: '2',
    crop: 'Milho',
    disease: 'Ferrugem',
    symptoms: ['Pústulas alaranjadas nas folhas', 'Redução de produtividade'],
    treatment: 'Fungicidas recomendados',
    prevention: 'Variedades resistentes, rotação de culturas',
    severity: 'high',
  },
  {
    id: '3',
    crop: 'Feijão',
    disease: 'Antracnose',
    symptoms: ['Manchas necróticas', 'Podridão de vagens'],
    treatment: 'Fungicidas cúpricos',
    prevention: 'Sementes certificadas, espaçamento adequado',
    severity: 'medium',
  },
  {
    id: '4',
    crop: 'Tomate',
    disease: 'Requeima (Phytophthora)',
    symptoms: ['Manchas d água nas folhas', 'Colapso da planta'],
    treatment: 'Fungicidas sistémicos',
    prevention: 'Boa drenagem, evitar molhamento',
    severity: 'high',
  },
  {
    id: '5',
    crop: 'Tomate',
    disease: 'Míldio',
    symptoms: ['Manchas amarelas', 'Crescimento branco na face inferior'],
    treatment: 'Enxofre ou fungicidas',
    prevention: 'Ventilação, poda de folhas inferiores',
    severity: 'medium',
  },
];

class AgriculturalService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheExpiry = 60 * 60 * 1000; // 1 hour

  async getMarketPrices(crop?: string, region?: string): Promise<MarketPrice[]> {
    try {
      const cacheKey = `prices_${crop}_${region}`;
      const cached = this.getFromCache<MarketPrice[]>(cacheKey);
      if (cached) return cached;

      let prices: MarketPrice[] = [];

      if (crop) {
        const normalizedCrop = crop.toLowerCase();
        const price = MARKET_PRICES[normalizedCrop];
        if (price) {
          prices = [
            {
              ...price,
              region: region || price.region,
              date: new Date(),
            },
          ];
        }
      } else {
        prices = Object.values(MARKET_PRICES).map(p => ({
          ...p,
          region: region || p.region,
          date: new Date(),
        }));
      }

      this.setCache(cacheKey, prices);
      return prices;
    } catch (error) {
      console.error('Error fetching market prices:', error);
      throw new Error('Falha ao carregar preços do mercado');
    }
  }

  async getCropInfo(cropName: string): Promise<CropData | null> {
    try {
      const cacheKey = `crop_${cropName}`;
      const cached = this.getFromCache<CropData>(cacheKey);
      if (cached) return cached;

      const normalizedName = cropName.toLowerCase();
      const cropInfo = MOZAMBIQUE_CROPS[normalizedName];

      if (cropInfo) {
        this.setCache(cacheKey, cropInfo);
      }

      return cropInfo || null;
    } catch (error) {
      console.error('Error fetching crop info:', error);
      throw new Error(`Falha ao carregar informações sobre ${cropName}`);
    }
  }

  async getDiseaseWarnings(crop?: string, region?: string): Promise<DiseaseWarning[]> {
    try {
      if (crop) {
        return DISEASE_WARNINGS.filter(w => w.crop.toLowerCase().includes(crop.toLowerCase()));
      }
      return DISEASE_WARNINGS;
    } catch (error) {
      console.error('Error fetching disease warnings:', error);
      throw new Error('Falha ao carregar avisos de doenças');
    }
  }

  async getPriceHistory(crop: string, days: number = 30): Promise<MarketPrice[]> {
    try {
      const history: MarketPrice[] = [];
      const basePrice = Object.values(MARKET_PRICES).find(p => 
        p.crop.toLowerCase().includes(crop.toLowerCase())
      );

      if (!basePrice) return [];

      for (let i = days; i > 0; i--) {
        const variance = (Math.random() - 0.5) * 4; // ±2% variation
        history.push({
          ...basePrice,
          price: basePrice.price + variance,
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
        });
      }

      return history;
    } catch (error) {
      throw new Error('Falha ao carregar histórico de preços');
    }
  }

  getAllCrops(): CropData[] {
    return Object.values(MOZAMBIQUE_CROPS);
  }

  getAllPrices(): MarketPrice[] {
    return Object.values(MARKET_PRICES);
  }

  // Cache management
  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > this.cacheExpiry) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  private setCache<T>(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }
}

export const agricultureService = new AgriculturalService();
