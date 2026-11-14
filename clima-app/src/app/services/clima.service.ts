import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

// ─── Interface Geocoding ───────────────────────────────────────────────────────
export interface ResultadoGeocodificacao {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code: string;
  admin1?: string; // estado/região
  population?: number;
}

export interface RespostaGeocodificacao {
  results?: ResultadoGeocodificacao[];
}

export interface ClimaAtual {
  latitude: number;
  longitude: number;
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
    apparent_temperature: number;
    precipitation: number;
    is_day: number;
    time: string;
  };
  current_units: {
    temperature_2m: string;
    relative_humidity_2m: string;
    wind_speed_10m: string;
    apparent_temperature: string;
    precipitation: string;
  };
}

export interface PrevisaoHoraria {
  latitude: number;
  longitude: number;
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    weather_code: number[];
    wind_speed_10m: number[];
    relative_humidity_2m: number[];
  };
}

export interface PrevisaoDiaria {
  latitude: number;
  longitude: number;
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
    precipitation_sum: number[];
    wind_speed_10m_max: number[];
    uv_index_max: number[];
    sunrise: string[];
    sunset: string[];
  };
}

@Injectable({
  providedIn: 'root',
})
export class ClimaService {
  private readonly BASE_URL = 'https://api.open-meteo.com/v1/forecast';
  private readonly CACHE_SIZE = 1;
  private readonly CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos

  // ─── Cache por chave "lat|lon" ─────────────────────────────────────────────
  private cacheAtual = new Map<string, { obs: Observable<ClimaAtual>; ts: number }>();
  private cacheHorario = new Map<string, { obs: Observable<PrevisaoHoraria>; ts: number }>();
  private cacheDiario = new Map<string, { obs: Observable<PrevisaoDiaria>; ts: number }>();

  constructor(private http: HttpClient) {}

  private chave(lat: number, lon: number): string {
    return `${lat.toFixed(4)}|${lon.toFixed(4)}`;
  }

  private cacheValido<T>(map: Map<string, { obs: Observable<T>; ts: number }>, key: string): Observable<T> | null {
    const entry = map.get(key);
    if (entry && Date.now() - entry.ts < this.CACHE_TTL_MS) {
      return entry.obs;
    }
    return null;
  }

  // ─── GET 1: Clima atual ────────────────────────────────────────────────────
  getClimaAtual(lat: number, lon: number): Observable<ClimaAtual> {
    const key = this.chave(lat, lon);
    const cached = this.cacheValido(this.cacheAtual, key);
    if (cached) return cached;

    const params = new HttpParams()
      .set('latitude', lat)
      .set('longitude', lon)
      .set('current', 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,is_day')
      .set('timezone', 'America/Sao_Paulo');

    const obs = this.http.get<ClimaAtual>(this.BASE_URL, { params }).pipe(
      shareReplay(this.CACHE_SIZE)
    );
    this.cacheAtual.set(key, { obs, ts: Date.now() });
    return obs;
  }

  // ─── GET 2: Previsão horária (próximas 24h) ────────────────────────────────
  getPrevisaoHoraria(lat: number, lon: number): Observable<PrevisaoHoraria> {
    const key = this.chave(lat, lon);
    const cached = this.cacheValido(this.cacheHorario, key);
    if (cached) return cached;

    const params = new HttpParams()
      .set('latitude', lat)
      .set('longitude', lon)
      .set('hourly', 'temperature_2m,precipitation_probability,weather_code,wind_speed_10m,relative_humidity_2m')
      .set('forecast_days', 1)
      .set('timezone', 'America/Sao_Paulo');

    const obs = this.http.get<PrevisaoHoraria>(this.BASE_URL, { params }).pipe(
      shareReplay(this.CACHE_SIZE)
    );
    this.cacheHorario.set(key, { obs, ts: Date.now() });
    return obs;
  }

  // ─── GET 3: Previsão diária (7 dias) ──────────────────────────────────────
  getPrevisaoDiaria(lat: number, lon: number): Observable<PrevisaoDiaria> {
    const key = this.chave(lat, lon);
    const cached = this.cacheValido(this.cacheDiario, key);
    if (cached) return cached;

    const params = new HttpParams()
      .set('latitude', lat)
      .set('longitude', lon)
      .set('daily', 'temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum,wind_speed_10m_max,uv_index_max,sunrise,sunset')
      .set('forecast_days', 7)
      .set('timezone', 'America/Sao_Paulo');

    const obs = this.http.get<PrevisaoDiaria>(this.BASE_URL, { params }).pipe(
      shareReplay(this.CACHE_SIZE)
    );
    this.cacheDiario.set(key, { obs, ts: Date.now() });
    return obs;
  }

  // ─── GET 4: Pesquisa de cidades (Geocoding API) ───────────────────────────
  buscarCidades(nome: string): Observable<RespostaGeocodificacao> {
    const params = new HttpParams()
      .set('name', nome)
      .set('count', 6)
      .set('language', 'pt')
      .set('format', 'json');
    return this.http.get<RespostaGeocodificacao>('https://geocoding-api.open-meteo.com/v1/search', { params });
  }

  /** Limpa o cache (usado no botão "Atualizar") */
  limparCache(): void {
    this.cacheAtual.clear();
    this.cacheHorario.clear();
    this.cacheDiario.clear();
  }
}
