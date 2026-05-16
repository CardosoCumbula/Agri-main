// Real Weather API Service - Using Open-Meteo (Free, no API key required)
export interface WeatherData {
  region: string;
  temperature: number;
  condition: string;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  feelsLike: number;
}

export interface WeatherForecast {
  date: string;
  high: number;
  low: number;
  condition: string;
  rainProbability: number;
}

export interface WeatherAlert {
  id: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
  region: string;
  timestamp: Date;
}

// Mozambique coordinates
const MOZAMBIQUE_COORDS: Record<string, { lat: number; lon: number }> = {
  maputo: { lat: -23.8585, lon: 35.3632 },
  gaza: { lat: -22.4165, lon: 35.2833 },
  inhambane: { lat: -23.8632, lon: 35.3771 },
  sofala: { lat: -18.6649, lon: 34.6589 },
  manica: { lat: -18.7669, lon: 33.2833 },
  tete: { lat: -16.1667, lon: 33.5833 },
  zambezia: { lat: -17.8667, lon: 36.6833 },
  nampula: { lat: -15.1236, lon: 39.2669 },
  niassa: { lat: -13.0031, lon: 34.3039 },
};

class WeatherService {
  private baseUrl = 'https://api.open-meteo.com/v1/forecast';
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheExpiry = 30 * 60 * 1000; // 30 minutes

  async getWeatherByRegion(region: string = 'maputo'): Promise<WeatherData> {
    try {
      const cached = this.getFromCache<WeatherData>(`weather_${region}`);
      if (cached) return cached;

      const coords = MOZAMBIQUE_COORDS[region.toLowerCase()] || MOZAMBIQUE_COORDS.maputo;
      const params = new URLSearchParams({
        latitude: coords.lat.toString(),
        longitude: coords.lon.toString(),
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,precipitation_probability',
        timezone: 'Africa/Maputo',
      });

      const response = await fetch(`${this.baseUrl}?${params.toString()}`, {
        next: { revalidate: 600 },
      });

      if (!response.ok) throw new Error('Weather API error');

      const data = await response.json();
      const current = data.current;

      const weatherData: WeatherData = {
        region: region.charAt(0).toUpperCase() + region.slice(1),
        temperature: Math.round(current.temperature_2m),
        condition: this.getWeatherDescription(current.weather_code),
        humidity: current.relative_humidity_2m,
        rainfall: current.precipitation_probability || 0,
        windSpeed: Math.round(current.wind_speed_10m),
        feelsLike: Math.round(current.apparent_temperature),
      };

      this.setCache(`weather_${region}`, weatherData);
      return weatherData;
    } catch (error) {
      console.error('Error fetching weather:', error);
      throw new Error('Falha ao carregar dados meteorológicos');
    }
  }

  async getForecast(region: string = 'maputo', days: number = 7): Promise<WeatherForecast[]> {
    try {
      const cached = this.getFromCache<WeatherForecast[]>(`forecast_${region}`);
      if (cached) return cached;

      const coords = MOZAMBIQUE_COORDS[region.toLowerCase()] || MOZAMBIQUE_COORDS.maputo;
      const params = new URLSearchParams({
        latitude: coords.lat.toString(),
        longitude: coords.lon.toString(),
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max',
        timezone: 'Africa/Maputo',
      });

      const response = await fetch(`${this.baseUrl}?${params.toString()}`, {
        next: { revalidate: 600 },
      });

      if (!response.ok) throw new Error('Forecast API error');

      const data = await response.json();
      const daily = data.daily;

      const forecast: WeatherForecast[] = daily.time.slice(0, days).map((dateStr: string, idx: number) => ({
        date: new Date(dateStr).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' }),
        high: Math.round(daily.temperature_2m_max[idx]),
        low: Math.round(daily.temperature_2m_min[idx]),
        condition: this.getWeatherDescription(daily.weather_code[idx]),
        rainProbability: daily.precipitation_probability_max[idx] || 0,
      }));

      this.setCache(`forecast_${region}`, forecast);
      return forecast;
    } catch (error) {
      console.error('Error fetching forecast:', error);
      throw new Error('Falha ao carregar previsão');
    }
  }

  async getAlerts(region: string = 'maputo'): Promise<WeatherAlert[]> {
    try {
      const weather = await this.getWeatherByRegion(region);
      const alerts: WeatherAlert[] = [];

      if (weather.rainfall > 70) {
        alerts.push({
          id: '1',
          title: 'Aviso de Chuvas Fortes',
          description: `Probabilidade de ${weather.rainfall}% de chuvas. Cuidado com alagamentos.`,
          severity: 'warning',
          region: weather.region,
          timestamp: new Date(),
        });
      }

      if (weather.windSpeed > 40) {
        alerts.push({
          id: '2',
          title: 'Aviso de Ventos Fortes',
          description: `Ventos até ${weather.windSpeed}km/h. Reforçar estruturas.`,
          severity: 'critical',
          region: weather.region,
          timestamp: new Date(),
        });
      }

      if (weather.temperature > 35) {
        alerts.push({
          id: '3',
          title: 'Alerta de Calor Intenso',
          description: `${weather.temperature}°C. Aumentar irrigação.`,
          severity: 'info',
          region: weather.region,
          timestamp: new Date(),
        });
      }

      return alerts;
    } catch (error) {
      console.error('Error getting alerts:', error);
      return [];
    }
  }

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

  private getWeatherDescription(code: number): string {
    const descriptions: Record<number, string> = {
      0: 'Céu limpo',
      1: 'Principalmente limpo',
      2: 'Parcialmente nublado',
      3: 'Nublado',
      45: 'Nevoeça',
      48: 'Nevoeça com geada',
      51: 'Chuva leve',
      53: 'Chuva moderada',
      55: 'Chuva forte',
      61: 'Chuva leve',
      63: 'Chuva moderada',
      65: 'Chuva forte',
      80: 'Chuvadas',
      81: 'Chuvadas moderadas',
      82: 'Chuvadas fortes',
      95: 'Trovoada',
      96: 'Trovoada com granizo',
      99: 'Trovoada com granizo forte',
    };
    return descriptions[code] || 'Condição desconhecida';
  }
}

export const weatherService = new WeatherService();
